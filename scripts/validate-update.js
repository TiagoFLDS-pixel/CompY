#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const VALID_STATUSES = ["compativel", "incompativel", "variavel"];

function projectRoot() {
  return path.resolve(__dirname, "..");
}

function loadLocalBase() {
  const dataPath = path.join(projectRoot(), "data", "compatibilidades.js");
  const code = `${fs.readFileSync(dataPath, "utf8")}
globalThis.__compyBase = { MEDICAMENTOS, COMPATIBILIDADE_POR_DROGA };`;
  const context = {};

  vm.runInNewContext(code, context, { filename: dataPath });

  return context.__compyBase;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function getArray(patch, asciiKey, unicodeKey) {
  return asArray(patch[asciiKey] || patch[unicodeKey]);
}

function normalizePatch(patch) {
  return {
    updateId: patch.updateId,
    drugId: patch.drugId,
    fonte: patch.fonte,
    dataFonte: patch.dataFonte || patch["data da fonte"],
    responsavelRevisor: patch.responsavelRevisor || patch["responsável/revisor"],
    compativel: getArray(patch, "compativeis", "compatíveis"),
    incompativel: getArray(patch, "incompativeis", "incompatíveis"),
    variavel: getArray(patch, "variaveis", "variáveis"),
    semDadosNaoAdicionar:
      patch.semDadosNaoAdicionar ||
      patch.paresSemDadosNaoAdicionar ||
      patch["pares sem dados que não devem ser adicionados"] ||
      [],
    observacoes: patch.observacoes || ""
  };
}

function pairKey(a, b) {
  return [a, b].sort().join("||");
}

function validatePatchObject(rawPatch, options = {}) {
  const { MEDICAMENTOS } = options.base || loadLocalBase();
  const validIds = new Set(MEDICAMENTOS.map(med => med.id));
  const patch = normalizePatch(rawPatch);
  const errors = [];
  const warnings = [];
  const seenPairs = new Map();
  const semDados = new Set(asArray(patch.semDadosNaoAdicionar));

  for (const field of ["updateId", "drugId", "fonte", "dataFonte", "responsavelRevisor"]) {
    if (typeof patch[field] !== "string" || patch[field].trim() === "") {
      errors.push(`Campo obrigatório ausente ou inválido: ${field}`);
    }
  }

  if (!validIds.has(patch.drugId)) {
    errors.push(`drugId inexistente em MEDICAMENTOS: ${patch.drugId}`);
  }

  for (const status of VALID_STATUSES) {
    if (!Array.isArray(patch[status])) {
      errors.push(`Lista inválida para ${status}. Deve ser array.`);
      continue;
    }

    const idsNaLista = new Set();

    for (const id of patch[status]) {
      if (typeof id !== "string" || id.trim() === "") {
        errors.push(`ID vazio ou inválido em ${status}.`);
        continue;
      }

      if (!validIds.has(id)) {
        errors.push(`ID inexistente em ${status}: ${id}`);
      }

      if (id === patch.drugId) {
        errors.push(`Par inválido em ${status}: ${patch.drugId} consigo próprio.`);
      }

      if (idsNaLista.has(id)) {
        errors.push(`Duplicado interno em ${status}: ${id}`);
      }

      idsNaLista.add(id);

      const key = pairKey(patch.drugId, id);
      const previousStatus = seenPairs.get(key);

      if (previousStatus && previousStatus !== status) {
        errors.push(
          `Conflito interno para ${patch.drugId} + ${id}: ${previousStatus} e ${status}`
        );
      } else {
        seenPairs.set(key, status);
      }
    }
  }

  if (!Array.isArray(patch.semDadosNaoAdicionar)) {
    errors.push("semDadosNaoAdicionar deve ser array.");
  } else {
    const semDadosVistos = new Set();

    for (const id of patch.semDadosNaoAdicionar) {
      if (typeof id !== "string" || id.trim() === "") {
        errors.push("ID vazio ou inválido em semDadosNaoAdicionar.");
        continue;
      }

      if (!validIds.has(id)) {
        errors.push(`ID inexistente em semDadosNaoAdicionar: ${id}`);
      }

      if (id === patch.drugId) {
        errors.push(`Par sem dados inválido: ${patch.drugId} consigo próprio.`);
      }

      if (semDadosVistos.has(id)) {
        errors.push(`Duplicado em semDadosNaoAdicionar: ${id}`);
      }

      semDadosVistos.add(id);
    }
  }

  for (const status of VALID_STATUSES) {
    for (const id of patch[status]) {
      if (semDados.has(id)) {
        errors.push(
          `Par marcado como sem dados não pode ser adicionado em ${status}: ${patch.drugId} + ${id}`
        );
      }
    }
  }

  if (seenPairs.size === 0) {
    warnings.push("Patch não adiciona pares classificados.");
  }

  return {
    ok: errors.length === 0,
    patch,
    errors,
    warnings,
    pairCount: seenPairs.size,
    pairs: [...seenPairs.entries()].map(([key, status]) => {
      const [medicamentoA, medicamentoB] = key.split("||");
      return { medicamentoA, medicamentoB, status };
    })
  };
}

function validatePatchFile(filePath) {
  return validatePatchObject(readJson(filePath));
}

function printValidationResult(result) {
  console.log(`Update: ${result.patch.updateId || "(sem updateId)"}`);
  console.log(`Medicamento base: ${result.patch.drugId || "(sem drugId)"}`);
  console.log(`Pares classificados no patch: ${result.pairCount}`);

  if (result.warnings.length > 0) {
    console.log("\nAvisos:");
    result.warnings.forEach(warning => console.log(`- ${warning}`));
  }

  if (!result.ok) {
    console.error("\nErros críticos:");
    result.errors.forEach(error => console.error(`- ${error}`));
    return;
  }

  console.log("\nValidação local do patch: OK");
}

if (require.main === module) {
  const patchPath = process.argv[2];

  if (!patchPath) {
    console.error("Uso: node scripts/validate-update.js updates/pending/<patch>.json");
    process.exit(1);
  }

  try {
    const result = validatePatchFile(path.resolve(patchPath));
    printValidationResult(result);
    process.exitCode = result.ok ? 0 : 1;
  } catch (error) {
    console.error(`Erro ao validar patch: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  VALID_STATUSES,
  loadLocalBase,
  normalizePatch,
  pairKey,
  validatePatchFile,
  validatePatchObject
};
