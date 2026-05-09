document.addEventListener("DOMContentLoaded", async () => {
  const botao = document.getElementById("btn-verificar");

  botao.disabled = true;
  botao.textContent = "A carregar medicamentos...";

  await popularSelects();
  validarBase();

  botao.addEventListener("click", verificarCompatibilidade);

  botao.disabled = false;
  botao.textContent = "Verificar compatibilidade";
});

// ==========================
// FUNÇÕES DE NORMALIZAÇÃO
// ==========================

function normaliza(nome) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formaCanonica(valor) {
  return normaliza(String(valor))
    .replace(/[()%+,\./-]/g, " ")
    .replace(/\b(de|do|da|dos|das)\b/g, " ")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

const medsById = new Map(MEDICAMENTOS.map(m => [m.id, m]));
const medsByCanon = new Map();

for (const med of MEDICAMENTOS) {
  medsByCanon.set(formaCanonica(med.id), med.id);
  medsByCanon.set(formaCanonica(med.nome), med.id);
}

const aliases = {
  "noradrenalina": "noradrenalina_bitartarato",
  "norepinephrine_bitartrate": "noradrenalina_bitartarato",
  "epinephrine": "adrenalina",
  "epinephrine_hydrochloride": "adrenalina",
  "nitroprusside_sodium": "nitroprussiato_sodio",
  "nitroprussiato": "nitroprussiato_sodio",
  "isosorbide_dinitrate": "dinitrato_isossorbida"
};
async function carregarMedicamentosComFallback() {
  try {
    if (!window.compYSupabase) {
      throw new Error("Cliente Supabase não está disponível.");
    }

    const { data, error } = await window.compYSupabase
      .from("medicamentos")
      .select("id, nome, tipo, ativo")
      .eq("ativo", true)
      .order("nome", { ascending: true });

    if (error) {
      throw error;
    }

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Lista de medicamentos do Supabase vazia.");
    }

    return {
      medicamentos: data,
      origem: "supabase"
    };
  } catch (erro) {
    console.warn(
      "Falha ao carregar medicamentos do Supabase. A usar lista local como fallback.",
      erro
    );

    return {
      medicamentos: MEDICAMENTOS,
      origem: "json_local"
    };
  }
}

function atualizarIndicesMedicamentos(listaMedicamentos) {
  medsById.clear();
  medsByCanon.clear();

  for (const med of listaMedicamentos) {
    medsById.set(med.id, med);
    medsByCanon.set(formaCanonica(med.id), med.id);
    medsByCanon.set(formaCanonica(med.nome), med.id);
  }
}

const alertasBolus = {
  "noradrenalina_bitartarato": "Risco de bólus inadvertido com hipertensão marcada, bradicardia reflexa e instabilidade hemodinâmica. Idealmente usar via dedicada.",
  "dobutamina_cloridrato": "Risco de alteração hemodinâmica aguda, taquicardia e arritmias se ocorrer bólus inadvertido.",
  "dopamina_cloridrato": "Risco de taquicardia, arritmias e instabilidade hemodinâmica com bólus inadvertido.",
  "vasopressina": "Risco de vasoconstrição/instabilidade hemodinâmica com bólus inadvertido. Idealmente usar via dedicada.",
  "dexmedetomidina": "Pode causar hipotensão e bradicardia. Atenção a flushes, manipulação da linha e administração inadvertida em bólus.",
  "nitroglicerina": "Risco de hipotensão marcada com bólus inadvertido.",
  "cloreto_calcio": "Medicamento de alto risco por via intravenosa. Um bólus inadvertido pode provocar efeitos cardiovasculares importantes.",
  "gluconato_calcio": "Medicamento de alto risco por via intravenosa. Um bólus inadvertido pode provocar efeitos cardiovasculares importantes.",
  "cloreto_potassio": "Risco de arritmias graves e paragem cardiorrespiratória se ocorrer bólus inadvertido.",
  "digoxina": "Risco de toxicidade cardíaca e arritmias se houver administração inadequada ou demasiado rápida.",
  "labetalol_cloridrato": "Risco de hipotensão e bradicardia com bólus inadvertido.",
  "insulina": "Risco de hipoglicemia com bólus inadvertido. Confirmar contexto clínico, monitorização e coexistência de glicose quando aplicável.",
  "morfina_sulfato": "Risco de depressão respiratória e sedação, sobretudo se a via aérea não estiver protegida.",
  "fentanilo_citrato": "Risco de depressão respiratória e sedação, sobretudo se a via aérea não estiver protegida.",
  "sufentanil_citrato": "Risco de depressão respiratória e sedação, sobretudo se a via aérea não estiver protegida.",
  "midazolam_cloridrato": "Risco de sedação excessiva e depressão respiratória, sobretudo se a via aérea não estiver protegida.",
  "cetamina_cloridrato": "Risco de depressão respiratória se administração rápida e de instabilidade hemodinâmica com bólus inadvertido.",
  "propofol": "Risco de sedação profunda, apneia/depressão respiratória e hipotensão com bólus inadvertido.",
  "nitroprussiato_sodio": "Risco de hipotensão marcada com bólus inadvertido."
};

function valorParaId(valor) {
  if (!valor) return null;
  if (medsById.has(valor)) return valor;

  const canon = formaCanonica(valor);

  if (aliases[canon]) return aliases[canon];
  if (medsByCanon.has(canon)) return medsByCanon.get(canon);

  return null;
}

function obterLista(info, singular, plural) {
  if (Array.isArray(info[singular])) return info[singular];
  if (Array.isArray(info[plural])) return info[plural];
  return [];
}

function encontrarChavePorId(id) {
  for (const chave of Object.keys(COMPATIBILIDADE_POR_DROGA)) {
    if (valorParaId(chave) === id) return chave;
  }
  return null;
}

function listaContemId(lista, idProcurado) {
  return lista.some(item => valorParaId(item) === idProcurado);
}

function buscarCompatibilidade(idA, idB) {
  const chaveA = encontrarChavePorId(idA);

  if (chaveA) {
    const info = COMPATIBILIDADE_POR_DROGA[chaveA];

    if (listaContemId(obterLista(info, "compativel", "compativeis"), idB)) {
      return { status: "compativel", origem: chaveA };
    }
    if (listaContemId(obterLista(info, "incompativel", "incompativeis"), idB)) {
      return { status: "incompativel", origem: chaveA };
    }
    if (listaContemId(obterLista(info, "variavel", "variaveis"), idB)) {
      return { status: "variavel", origem: chaveA };
    }
  }

  const chaveB = encontrarChavePorId(idB);

  if (chaveB) {
    const info = COMPATIBILIDADE_POR_DROGA[chaveB];

    if (listaContemId(obterLista(info, "compativel", "compativeis"), idA)) {
      return { status: "compativel", origem: chaveB };
    }
    if (listaContemId(obterLista(info, "incompativel", "incompativeis"), idA)) {
      return { status: "incompativel", origem: chaveB };
    }
    if (listaContemId(obterLista(info, "variavel", "variaveis"), idA)) {
      return { status: "variavel", origem: chaveB };
    }
  }

  if (medsById.has(idA) && medsById.has(idB)) {
    return { status: "nao_identificado", origem: null };
  }

  return null;
}
async function buscarCompatibilidadeSupabase(idA, idB) {
  if (!window.compYSupabase) {
    throw new Error("Cliente Supabase não está disponível.");
  }

  const { data, error } = await window.compYSupabase.rpc("obter_compatibilidade", {
    med_a: idA,
    med_b: idB
  });

  if (error) {
    throw error;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return {
      status: "nao_identificado",
      origem: "supabase",
      fonte: null,
      dataFonte: null,
      observacoes: null
    };
  }

  const item = data[0];

  return {
    status: item.classificacao,
    origem: "supabase",
    fonte: item.fonte,
    dataFonte: item.data_fonte,
    observacoes: item.observacoes,
    validado: item.validado
  };
}

async function buscarCompatibilidadeComFallback(idA, idB) {
  try {
    return await buscarCompatibilidadeSupabase(idA, idB);
  } catch (erro) {
    console.warn("Falha ao consultar Supabase. A usar base local como fallback.", erro);

    const resultadoLocal = buscarCompatibilidade(idA, idB);

    if (!resultadoLocal) {
      return null;
    }

    return {
      ...resultadoLocal,
      origem: "json_local"
    };
  }
}
function validarBase() {
  const chavesSemMatch = [];
  const refsInvalidas = [];
  const medsSemBloco = [];
  const conflitos = [];
  const pares = new Map();

  for (const chave of Object.keys(COMPATIBILIDADE_POR_DROGA)) {
    const idChave = valorParaId(chave);

    if (!idChave) {
      chavesSemMatch.push(chave);
    }

    const info = COMPATIBILIDADE_POR_DROGA[chave];

    const grupos = {
      compativel: obterLista(info, "compativel", "compativeis"),
      incompativel: obterLista(info, "incompativel", "incompativeis"),
      variavel: obterLista(info, "variavel", "variaveis")
    };

    for (const [status, lista] of Object.entries(grupos)) {
      for (const item of lista) {
        const idItem = valorParaId(item);

        if (!idItem) {
          refsInvalidas.push({
            origem: chave,
            status,
            referencia: item
          });
          continue;
        }

        if (idChave) {
          const chavePar = [idChave, idItem].sort().join(" | ");

          if (!pares.has(chavePar)) {
            pares.set(chavePar, []);
          }

          pares.get(chavePar).push({
            origem: chave,
            status
          });
        }
      }
    }
  }

  for (const med of MEDICAMENTOS) {
    const temBloco = Object.keys(COMPATIBILIDADE_POR_DROGA).some(
      chave => valorParaId(chave) === med.id
    );

    if (!temBloco) {
      medsSemBloco.push(med);
    }
  }

  for (const [par, entradas] of pares.entries()) {
    const statuses = [...new Set(entradas.map(e => e.status))];

    if (statuses.length > 1) {
      conflitos.push({
        par,
        entradas
      });
    }
  }

  console.group("Validação da base de compatibilidade");
  console.log("Chaves sem correspondência no array MEDICAMENTOS:", chavesSemMatch);
  console.log("Referências inválidas dentro das listas:", refsInvalidas);
  console.log("Medicamentos sem bloco próprio:", medsSemBloco);
  console.log("Pares com conflito de status:", conflitos);
  console.groupEnd();
}

// ==========================
// UI
// ==========================

async function popularSelects() {
  const { medicamentos, origem } = await carregarMedicamentosComFallback();

  atualizarIndicesMedicamentos(medicamentos);

  window.compYMedicamentosOrigem = origem;
  window.compYMedicamentosAtivos = medicamentos;

  const selects = document.querySelectorAll(".med-select");

  selects.forEach(select => {
    const valorAtual = select.value;

    select.innerHTML = "";

    const optionInicial = document.createElement("option");
    optionInicial.value = "";
    optionInicial.textContent = "-- Selecione --";
    select.appendChild(optionInicial);

    medicamentos.forEach(med => {
      const option = document.createElement("option");
      option.value = med.id;
      option.textContent = med.nome;
      select.appendChild(option);
    });

    if (valorAtual && medicamentos.some(med => med.id === valorAtual)) {
      select.value = valorAtual;
    }
  });

  console.log(`Medicamentos carregados de: ${origem}`, medicamentos.length);
}

function obterNomeMedicamento(id) {
  const med = medsById.get(id);
  return med ? med.nome : id;
}

function criarAvisoBolus(idsSelecionados) {
  const idsComAviso = [...new Set(idsSelecionados)].filter(id => alertasBolus[id]);

  if (idsComAviso.length === 0) {
    return null;
  }

  const caixa = document.createElement("div");
  caixa.classList.add("alerta-bolus");

  const titulo = document.createElement("div");
  titulo.classList.add("alerta-bolus-titulo");
  titulo.textContent = "⚠️ Atenção: risco de bólus inadvertido nesta via";
  caixa.appendChild(titulo);

  const intro = document.createElement("p");
  intro.classList.add("alerta-bolus-intro");
  intro.textContent = "Quando estes medicamentos partilham a via, um flush, reabertura da linha ou outra manipulação pode administrar um bólus não intencional.";
  caixa.appendChild(intro);

  const lista = document.createElement("ul");
  lista.classList.add("alerta-bolus-lista");

  idsComAviso.forEach(id => {
    const item = document.createElement("li");

    const nome = document.createElement("strong");
    nome.textContent = `${obterNomeMedicamento(id)}: `;
    item.appendChild(nome);

    item.appendChild(document.createTextNode(alertasBolus[id]));
    lista.appendChild(item);
  });

  caixa.appendChild(lista);

  return caixa;
}

async function verificarCompatibilidade() {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "";

  const selects = Array.from(document.querySelectorAll(".med-select"));
  const selecionados = selects.map(s => s.value).filter(v => v);
  const unicos = [...new Set(selecionados)];

  if (typeof gtag === "function") {
    gtag("event", "verificar_compatibilidade", {
      medicamentos_selecionados: unicos.length
    });
  }

  if (unicos.length < 2) {
    resultadoDiv.textContent = "Selecione pelo menos dois medicamentos para avaliar a via Y.";
    return;
  }

  const avisoBolus = criarAvisoBolus(unicos);
  if (avisoBolus) {
    resultadoDiv.appendChild(avisoBolus);
  }

  for (let i = 0; i < unicos.length; i++) {
    for (let j = i + 1; j < unicos.length; j++) {
      const idA = unicos[i];
      const idB = unicos[j];
      const nomeA = obterNomeMedicamento(idA);
      const nomeB = obterNomeMedicamento(idB);

const resultado = await buscarCompatibilidadeComFallback(idA, idB);

      const bloco = document.createElement("div");
      bloco.classList.add("resultado-item");

      const titulo = document.createElement("strong");
      titulo.textContent = `${nomeA} + ${nomeB}`;
      bloco.appendChild(titulo);

      const texto = document.createElement("div");

      if (!resultado) {
        bloco.classList.add("status-desconhecido");
        texto.textContent =
          "Não foi possível interpretar esta combinação na base atual. Confirmar em fontes oficiais.";
      } else {
        const { status } = resultado;

        if (status === "compativel") {
          bloco.classList.add("status-compativel");
          texto.textContent = "Provavelmente compatível em via Y. Conferir sempre protocolo institucional.";
        } else if (status === "incompativel") {
          bloco.classList.add("status-incompativel");
          texto.textContent = "Provavelmente incompatível em via Y. Preferir via exclusiva ou outra estratégia.";
        } else if (status === "variavel") {
          bloco.classList.add("status-variavel");
          texto.textContent = "Compatibilidade variável/controversa. Verificar fonte atualizada e protocolo local.";
        } else if (status === "nao_identificado") {
  bloco.classList.add("status-desconhecido");
  texto.textContent =
    "Sem dados de compatibilidade registados na base atual. Não interpretar como compatível. Confirmar em fonte oficial atualizada e/ou com a farmácia clínica.";
}
      }

      bloco.appendChild(texto);

if (resultado && resultado.origem === "supabase") {
  const fonte = document.createElement("small");
  fonte.classList.add("resultado-fonte");

  if (resultado.fonte) {
    fonte.textContent = `Fonte: ${resultado.fonte}${resultado.dataFonte ? ` | Data: ${resultado.dataFonte}` : ""}`;
  } else {
    fonte.textContent = "Fonte: Supabase";
  }

  bloco.appendChild(fonte);
}

if (resultado && resultado.origem === "json_local") {
  const fonte = document.createElement("small");
  fonte.classList.add("resultado-fonte");
  fonte.textContent = "Fonte: base local de fallback";
  bloco.appendChild(fonte);
}

resultadoDiv.appendChild(bloco);
    }
  }

  const rodape = document.createElement("p");
  rodape.classList.add("disclaimer");
  rodape.textContent =
    "Ferramenta experimental para treinamento. Não utilizar para decisões clínicas reais.";
  resultadoDiv.appendChild(rodape);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(reg => {
        console.log("Service Worker registado com sucesso:", reg.scope);
      })
      .catch(err => {console.error("Erro ao registar Service Worker:", err);
      });
  });
}
