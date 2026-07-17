#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { dryRun, fetchTable } = require("./dry-run-update-supabase");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function hasApplyFlag() {
  return process.argv.includes("--apply");
}

function timestampForFile() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function backupDirFor(updateId) {
  return path.join(
    process.cwd(),
    "backups",
    "compatibilidades",
    `pre-apply-${updateId}-${timestampForFile()}`
  );
}

async function createPreApplyBackup(updateId) {
  const dir = backupDirFor(updateId);
  fs.mkdirSync(dir, { recursive: true });

  const [medicamentos, compatibilidades] = await Promise.all([
    fetchTable("medicamentos"),
    fetchTable("compatibilidades")
  ]);

  fs.writeFileSync(
    path.join(dir, "supabase_medicamentos.json"),
    `${JSON.stringify(medicamentos, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(dir, "supabase_compatibilidades.json"),
    `${JSON.stringify(compatibilidades, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(dir, "README.md"),
    `# Backup pré-aplicação ${updateId}\n\nCriado antes de aplicar patch no Supabase.\n\nEscrita realizada neste passo: não.\n`,
    "utf8"
  );

  return dir;
}

async function insertCompatibilidade(row) {
  const endpoint = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/compatibilidades`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(row)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Inserção falhou: HTTP ${response.status} ${body.slice(0, 180)}`);
  }

  return response.json();
}

async function applyPatch(patchPath) {
  if (!hasApplyFlag()) {
    throw new Error("Aplicação bloqueada. Reexecute com --apply para escrever no Supabase.");
  }

  const report = await dryRun(patchPath);

  if (report.conflitos.length > 0) {
    throw new Error("Aplicação bloqueada: há conflitos entre patch e Supabase.");
  }

  const backupDir = await createPreApplyBackup(report.updateId);
  const inserted = [];

  for (const pair of report.novos) {
    const row = {
      medicamento_a_id: pair.medicamentoA,
      medicamento_b_id: pair.medicamentoB,
      classificacao: pair.status,
      fonte: report.patch.fonte,
      data_fonte: report.patch.dataFonte,
      observacoes: report.patch.observacoes || null,
      validado: true
    };

    const result = await insertCompatibilidade(row);
    inserted.push({ pair, result });
  }

  const finalReport = {
    updateId: report.updateId,
    backupDir,
    inseridos: inserted.length,
    ignoradosComoExistentes: report.existentes.length,
    conflitos: report.conflitos.length,
    escritaRealizada: inserted.length > 0
  };

  const reportsDir = path.join(process.cwd(), "updates", "applied");
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportsDir, `${report.updateId}-report.json`),
    `${JSON.stringify(finalReport, null, 2)}\n`,
    "utf8"
  );

  return finalReport;
}

if (require.main === module) {
  const patchPath = process.argv.find(arg => arg.endsWith(".json"));

  if (!patchPath) {
    console.error(
      "Uso: node scripts/apply-update-supabase.js updates/approved/<patch>.json --apply"
    );
    process.exit(1);
  }

  applyPatch(path.resolve(patchPath))
    .then(report => console.log(JSON.stringify(report, null, 2)))
    .catch(error => {
      console.error(`Aplicação falhou: ${error.message}`);
      process.exitCode = 1;
    });
}

module.exports = {
  applyPatch,
  createPreApplyBackup
};
