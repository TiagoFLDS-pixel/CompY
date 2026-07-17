#!/usr/bin/env node

const path = require("path");
const { pairKey, validatePatchFile } = require("./validate-update");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function requireSupabaseEnv() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      "Defina SUPABASE_URL e SUPABASE_ANON_KEY ou SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente."
    );
  }
}

async function fetchTable(table) {
  requireSupabaseEnv();

  const rows = [];
  const pageSize = 1000;

  for (let from = 0; ; from += pageSize) {
    const endpoint = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}?select=*`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Range: `${from}-${from + pageSize - 1}`
      }
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`${table}: HTTP ${response.status} ${body.slice(0, 180)}`);
    }

    const page = await response.json();
    rows.push(...page);

    if (page.length < pageSize) {
      break;
    }
  }

  return rows;
}

function comparePatchWithSupabase(validation, supabaseRows) {
  const existing = new Map();

  for (const row of supabaseRows) {
    existing.set(pairKey(row.medicamento_a_id, row.medicamento_b_id), row);
  }

  const novos = [];
  const existentes = [];
  const conflitos = [];

  for (const pair of validation.pairs) {
    const key = pairKey(pair.medicamentoA, pair.medicamentoB);
    const current = existing.get(key);

    if (!current) {
      novos.push(pair);
    } else if (current.classificacao === pair.status) {
      existentes.push({ ...pair, id: current.id });
    } else {
      conflitos.push({
        ...pair,
        id: current.id,
        estadoAtual: current.classificacao,
        estadoPatch: pair.status
      });
    }
  }

  return { novos, existentes, conflitos };
}

function printDryRun(report) {
  console.log(`Update: ${report.updateId}`);
  console.log("Modo: dry-run, leitura apenas");
  console.log(`Pares novos: ${report.novos.length}`);
  console.log(`Pares já existentes: ${report.existentes.length}`);
  console.log(`Conflitos: ${report.conflitos.length}`);

  if (report.novos.length > 0) {
    console.log("\nPares novos:");
    report.novos.forEach(pair =>
      console.log(`- ${pair.medicamentoA} + ${pair.medicamentoB}: ${pair.status}`)
    );
  }

  if (report.existentes.length > 0) {
    console.log("\nPares já existentes:");
    report.existentes.forEach(pair =>
      console.log(`- ${pair.medicamentoA} + ${pair.medicamentoB}: ${pair.status}`)
    );
  }

  if (report.conflitos.length > 0) {
    console.log("\nConflitos:");
    report.conflitos.forEach(pair =>
      console.log(
        `- ${pair.medicamentoA} + ${pair.medicamentoB}: atual=${pair.estadoAtual}; patch=${pair.estadoPatch}`
      )
    );
  }
}

async function dryRun(patchPath) {
  const validation = validatePatchFile(patchPath);

  if (!validation.ok) {
    const message = validation.errors.map(error => `- ${error}`).join("\n");
    throw new Error(`Patch inválido:\n${message}`);
  }

  const compatibilidades = await fetchTable("compatibilidades");
  const comparison = comparePatchWithSupabase(validation, compatibilidades);

  return {
    updateId: validation.patch.updateId,
    patch: validation.patch,
    ...comparison,
    escritaRealizada: false
  };
}

if (require.main === module) {
  const patchPath = process.argv[2];

  if (!patchPath) {
    console.error("Uso: node scripts/dry-run-update-supabase.js updates/approved/<patch>.json");
    process.exit(1);
  }

  dryRun(path.resolve(patchPath))
    .then(report => {
      printDryRun(report);
      process.exitCode = report.conflitos.length === 0 ? 0 : 2;
    })
    .catch(error => {
      console.error(`Dry-run falhou: ${error.message}`);
      process.exitCode = 1;
    });
}

module.exports = {
  comparePatchWithSupabase,
  dryRun,
  fetchTable,
  printDryRun
};
