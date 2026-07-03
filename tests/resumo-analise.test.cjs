const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SAFE_NO_DATA_MESSAGE =
  "Sem dados disponíveis na base para esta combinação. Isto não implica compatibilidade ou ausência de interação. Validar em fonte institucional/protocolo local.";

class TestElement {
  constructor(tag) {
    this.tag = tag;
    this.children = [];
    this.classNames = [];
    this.attributes = {};
    this.value = "";
    this.disabled = false;
    this._textContent = "";
    this._innerHTML = "";
    this.classList = {
      add: (...names) => {
        this.classNames.push(...names);
      }
    };
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  addEventListener() {}

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
    if (value === "") {
      this.children = [];
      this._textContent = "";
    }
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set textContent(value) {
    this._textContent = String(value);
    this.children = [];
  }

  get textContent() {
    return [
      this._textContent,
      ...this.children.map(child => child.textContent)
    ]
      .filter(Boolean)
      .join("\n");
  }
}

class TextNode {
  constructor(text) {
    this.textContent = String(text);
  }
}

function pairKey(a, b) {
  return [a, b].sort().join("||");
}

function createSupabaseMock(responses) {
  return {
    rpc(name, params) {
      assert.strictEqual(name, "obter_compatibilidade");

      const classification = responses[pairKey(params.med_a, params.med_b)];

      if (!classification) {
        return Promise.resolve({ data: [], error: null });
      }

      return Promise.resolve({
        data: [
          {
            classificacao: classification,
            fonte: "Teste automatizado",
            data_fonte: "2026-05-09",
            observacoes: null,
            validado: true
          }
        ],
        error: null
      });
    }
  };
}

function createHarness(selectedIds, responses) {
  const resultado = new TestElement("div");
  const selects = selectedIds.map(id => ({ value: id }));

  const context = {
    console: {
      log() {},
      warn() {},
      error() {},
      group() {},
      groupEnd() {}
    },
    setTimeout,
    clearTimeout,
    navigator: {},
    window: {
      addEventListener() {},
      compYSupabase: createSupabaseMock(responses)
    },
    document: {
      addEventListener() {},
      getElementById(id) {
        if (id === "resultado") return resultado;
        return new TestElement("button");
      },
      querySelectorAll(selector) {
        return selector === ".med-select" ? selects : [];
      },
      createElement(tag) {
        return new TestElement(tag);
      },
      createTextNode(text) {
        return new TextNode(text);
      }
    }
  };

  context.window.window = context.window;
  context.window.document = context.document;

  const code = [
    fs.readFileSync(path.join(PROJECT_ROOT, "data", "compatibilidades.js"), "utf8"),
    fs.readFileSync(path.join(PROJECT_ROOT, "app.js"), "utf8")
  ].join("\n");

  vm.runInNewContext(code, context, {
    filename: "compy-resumo-analise.test.vm.js"
  });

  return {
    async run() {
      await context.verificarCompatibilidade();
      return resultado.textContent;
    }
  };
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertSummary(text, expected) {
  assert.match(text, new RegExp(`Total de pares avaliados:\\s*${expected.total}`));
  assert.match(text, new RegExp(`Compatíveis:\\s*${expected.compativel}`));
  assert.match(text, new RegExp(`Incompatíveis:\\s*${expected.incompativel}`));
  assert.match(text, new RegExp(`Variáveis/dados conflitantes:\\s*${expected.variavel}`));
  assert.match(text, new RegExp(`Sem dados:\\s*${expected.semDados}`));

  if (Object.prototype.hasOwnProperty.call(expected, "alertas")) {
    assert.match(text, new RegExp(`Alertas relevantes:\\s*${expected.alertas}`));
  }
}

const tests = [
  {
    name: "conta par compatível",
    async run() {
      const text = await createHarness(
        ["sulfato_magnesio", "glucose_5"],
        { [pairKey("sulfato_magnesio", "glucose_5")]: "compativel" }
      ).run();

      assertSummary(text, {
        total: 1,
        compativel: 1,
        incompativel: 0,
        variavel: 0,
        semDados: 0
      });
      assert.match(text, /Provavelmente compatível em via Y/);
    }
  },
  {
    name: "conta par incompatível",
    async run() {
      const text = await createHarness(
        ["sulfato_magnesio", "furosemida"],
        { [pairKey("sulfato_magnesio", "furosemida")]: "incompativel" }
      ).run();

      assertSummary(text, {
        total: 1,
        compativel: 0,
        incompativel: 1,
        variavel: 0,
        semDados: 0
      });
      assert.match(text, /Provavelmente incompatível em via Y/);
    }
  },
  {
    name: "conta par variável/dados conflitantes",
    async run() {
      const text = await createHarness(
        ["sulfato_magnesio", "propofol"],
        { [pairKey("sulfato_magnesio", "propofol")]: "variavel" }
      ).run();

      assertSummary(text, {
        total: 1,
        compativel: 0,
        incompativel: 0,
        variavel: 1,
        semDados: 0,
        alertas: 2
      });
      assert.match(text, /Compatibilidade variável\/controversa/);
    }
  },
  {
    name: "conta par sem dados e mostra mensagem segura",
    async run() {
      const text = await createHarness(
        ["adenosina", "albumina_humana"],
        {}
      ).run();

      assertSummary(text, {
        total: 1,
        compativel: 0,
        incompativel: 0,
        variavel: 0,
        semDados: 1
      });
      assert.match(text, new RegExp(escapeRegExp(SAFE_NO_DATA_MESSAGE)));
    }
  },
  {
    name: "não conta sem dados como compatível",
    async run() {
      const text = await createHarness(
        ["adenosina", "albumina_humana"],
        {}
      ).run();

      assertSummary(text, {
        total: 1,
        compativel: 0,
        incompativel: 0,
        variavel: 0,
        semDados: 1
      });
    }
  },
  {
    name: "resume análise com três medicamentos e múltiplos pares",
    async run() {
      const text = await createHarness(
        ["glucose_5", "furosemida", "propofol"],
        {
          [pairKey("glucose_5", "furosemida")]: "compativel",
          [pairKey("glucose_5", "propofol")]: "variavel",
          [pairKey("furosemida", "propofol")]: "incompativel"
        }
      ).run();

      assertSummary(text, {
        total: 3,
        compativel: 1,
        incompativel: 1,
        variavel: 1,
        semDados: 0,
        alertas: 3
      });
    }
  },
  {
    name: "conta alertas relevantes dos medicamentos selecionados",
    async run() {
      const text = await createHarness(
        ["dexmedetomidina", "cloreto_potassio"],
        { [pairKey("dexmedetomidina", "cloreto_potassio")]: "compativel" }
      ).run();

      assertSummary(text, {
        total: 1,
        compativel: 1,
        incompativel: 0,
        variavel: 0,
        semDados: 0,
        alertas: 2
      });
      assert.match(text, /Atenção: risco de bólus inadvertido nesta via/);
    }
  }
];

(async () => {
  const failures = [];

  for (const test of tests) {
    try {
      await test.run();
      console.log(`ok - ${test.name}`);
    } catch (error) {
      failures.push({ test, error });
      console.error(`not ok - ${test.name}`);
      console.error(error.message);
    }
  }

  if (failures.length > 0) {
    console.error(`${failures.length} de ${tests.length} testes falharam`);
    process.exitCode = 1;
    return;
  }

  console.log(`${tests.length} testes passaram`);
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
