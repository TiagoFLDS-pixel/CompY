document.addEventListener("DOMContentLoaded", async () => {
  const botao = document.getElementById("btn-verificar");
  const botaoLimpar = document.getElementById("btn-limpar");

  botao.disabled = true;
  botao.textContent = "A carregar medicamentos...";
  botaoLimpar.disabled = true;

  await popularSelects();
  window.compYValidacaoBase = validarBase();
  configurarEstadoBase();

  botao.addEventListener("click", verificarCompatibilidade);
  botaoLimpar.addEventListener("click", limparSelecao);

  botao.disabled = false;
  botaoLimpar.disabled = false;
  botao.textContent = "Verificar compatibilidade";
  enviarEventoUso("app_open");
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

function textoOrigemDados(resultado) {
  if (resultado.origem === "snapshot_local") {
    if (resultado.fallbackDeSupabase) {
      return "Supabase indisponível — usado snapshot local";
    }

    if (resultado.status === "nao_identificado") {
      return "Base consultada: Snapshot local | Sem registo na base validada para este par.";
    }

    return "Fonte clínica: Stabilis | Validação CompY: 09/05/2026 | Base consultada: Snapshot local";
  }

  if (resultado.origem === "supabase_indisponivel") {
    return "Supabase indisponível | Sem interpretação automática como compatibilidade.";
  }

  if (resultado.origem === "supabase" && resultado.status === "nao_identificado") {
    return "Base consultada: Supabase | Sem registo na base validada para este par.";
  }

  return "Fonte clínica: Stabilis | Validação CompY: 09/05/2026 | Base consultada: Supabase";
}

const MENSAGEM_SEM_DADOS =
  "Sem dados disponíveis na base para esta combinação. Isto não implica compatibilidade ou ausência de interação. Validar em fonte institucional/protocolo local.";
const LIMITE_MEDICAMENTOS_SELECIONADOS = 6;
const COMPY_APP_VERSION = "CompY v0.9.0-beta";
const COMPY_BASE_VERSION = "2026-05-09";
const COMPY_ENVIRONMENT = "protótipo/demonstração";
const DATA_BASE_COMPY = "09/05/2026";
const FONTE_PRINCIPAL_COMPY = "Stabilis / IPO-Porto SMI";
const BACKEND_MODES_SUPORTADOS = new Set(["hybrid", "supabase", "local"]);
const SUPABASE_TIMEOUT_MS = 5000;

window.compYBackendStatus = {
  supabase: "não testado",
  ultimoErroSupabase: null,
  fallbackLocalUsado: false
};

function obterBackendMode() {
  const mode = String(window.BACKEND_MODE || "hybrid").toLowerCase();
  return BACKEND_MODES_SUPORTADOS.has(mode) ? mode : "hybrid";
}

function supabaseAtivoPelaConfiguracao() {
  return window.SUPABASE_ENABLED !== false && obterBackendMode() !== "local";
}

function obterClienteSupabase() {
  if (!supabaseAtivoPelaConfiguracao()) {
    return null;
  }

  if (window.compYSupabase) {
    return window.compYSupabase;
  }

  if (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
    window.compYSupabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );
    return window.compYSupabase;
  }

  return null;
}

function fallbackLocalAtivo() {
  return window.LOCAL_FALLBACK_ENABLED !== false;
}

function atualizarEstadoSupabase(estado, erro = null) {
  window.compYBackendStatus.supabase = estado;
  window.compYBackendStatus.ultimoErroSupabase = erro ? String(erro.message || erro) : null;
}

function marcarFallbackLocalUsado() {
  window.compYBackendStatus.fallbackLocalUsado = true;
}

function resultadoSupabaseIndisponivel(erro) {
  atualizarEstadoSupabase("indisponível", erro);

  return {
    status: "nao_identificado",
    origem: "supabase_indisponivel",
    backendIndisponivel: true
  };
}

function comTimeoutSupabase(promise) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Timeout ao consultar Supabase."));
      }, SUPABASE_TIMEOUT_MS);
    })
  ]);
}

async function carregarMedicamentosComFallback() {
  const mode = obterBackendMode();

  if (mode === "local") {
    atualizarEstadoSupabase("não usado");

    return {
      medicamentos: MEDICAMENTOS,
      origem: "snapshot_local"
    };
  }

  try {
    const supabase = obterClienteSupabase();

    if (!supabase) {
      throw new Error("Cliente Supabase não está disponível.");
    }

    const { data, error } = await comTimeoutSupabase(supabase
      .from("medicamentos")
      .select("id, nome, tipo, ativo")
      .eq("ativo", true)
      .order("nome", { ascending: true }));

    if (error) {
      throw error;
    }

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Lista de medicamentos do Supabase vazia.");
    }

    atualizarEstadoSupabase("disponível");

    return {
      medicamentos: data,
      origem: "supabase"
    };
  } catch (erro) {
    atualizarEstadoSupabase("indisponível", erro);

    if (mode === "supabase" || !fallbackLocalAtivo()) {
      console.warn("Falha ao carregar medicamentos do Supabase. Modo sem fallback local.", erro);

      return {
        medicamentos: MEDICAMENTOS,
        origem: "supabase_indisponivel"
      };
    }

    console.warn(
      "Falha ao carregar medicamentos do Supabase. A usar snapshot local como fallback.",
      erro
    );
    marcarFallbackLocalUsado();

    return {
      medicamentos: MEDICAMENTOS,
      origem: "snapshot_local"
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

const ALERTAS_BOLUS_GRUPOS = {
  vasoativo: {
    nivel: "alto",
    titulo: "Alto risco de bólus inadvertido",
    mensagem:
      "Medicamento com efeito hemodinâmico relevante. Administração rápida ou flush rápido de fármaco remanescente na linha pode causar alterações abruptas da pressão arterial, frequência cardíaca ou ritmo cardíaco.",
    recomendacao:
      "Respeitar velocidade/protocolo institucional, evitar flush rápido e monitorizar resposta hemodinâmica. Usar o conector mais proximal ao doente sempre que possível."
  },

  eletrolito_metabolico: {
    nivel: "alto",
    titulo: "Alto risco eletrolítico/metabólico",
    mensagem:
      "Administração rápida pode causar alterações eletrolíticas, metabólicas ou cardiovasculares relevantes, incluindo risco de arritmias ou instabilidade hemodinâmica.",
    recomendacao:
      "Confirmar concentração, diluição, via e velocidade antes da administração. Evitar bólus não protocolado e flush rápido subsequente."
  },

  potassio: {
    nivel: "alto",
    titulo: "Alto risco — potássio IV",
    mensagem:
      "Administração rápida de potássio pode causar arritmias graves e instabilidade hemodinâmica.",
    recomendacao:
      "Confirmar concentração, diluição, via e velocidade. Evitar administração em bólus não protocolado e flush rápido."
  },

  sedativo_analgesico_anestesico: {
    nivel: "alto",
    titulo: "Alto risco respiratório/neurológico",
    mensagem:
      "Administração rápida ou flush rápido pode causar sedação excessiva, depressão respiratória, hipotensão, bradicardia ou outros efeitos neurológicos/hemodinâmicos relevantes.",
    recomendacao:
      "Administrar apenas com monitorização adequada. Respeitar velocidade/protocolo institucional e evitar flush rápido subsequente."
  },

  bloqueador_neuromuscular: {
    nivel: "alto",
    titulo: "Alto risco — bloqueador neuromuscular",
    mensagem:
      "Administração inadvertida pode causar paralisia sem sedação e compromisso respiratório.",
    recomendacao:
      "Garantir indicação, suporte ventilatório, monitorização e dupla verificação conforme protocolo institucional."
  },

  antitrombotico_hemostatico: {
    nivel: "alto",
    titulo: "Alto risco hematológico",
    mensagem:
      "Administração incorreta, dose errada ou bólus inadvertido pode ter consequências clínicas relevantes, incluindo risco hemorrágico ou trombótico conforme o fármaco.",
    recomendacao:
      "Confirmar dose, via, velocidade, indicação e compatibilidade com a linha. Evitar flush rápido não controlado."
  },

  insulina: {
    nivel: "alto",
    titulo: "Alto risco — insulina IV",
    mensagem:
      "Administração rápida, dose incorreta ou flush inadvertido pode causar hipoglicemia grave.",
    recomendacao:
      "Confirmar dose, concentração, via, velocidade e monitorização glicémica conforme protocolo."
  },

  toxicidade_margem_terapeutica: {
    nivel: "alto",
    titulo: "Alto risco — toxicidade/margem terapêutica",
    mensagem:
      "Medicamento com risco relevante de toxicidade ou margem terapêutica estreita. Administração rápida ou flush não controlado pode aumentar o risco de exposição inadequada.",
    recomendacao:
      "Confirmar protocolo, concentração, via, tempo de administração, compatibilidade e necessidade de monitorização."
  },

  administracao_lenta: {
    nivel: "moderado",
    titulo: "Atenção à velocidade de administração",
    mensagem:
      "Administração rápida pode aumentar o risco de reação relacionada com a administração, desconforto, hipotensão, irritação local ou outros efeitos adversos.",
    recomendacao:
      "Confirmar velocidade recomendada/protocolo institucional. Evitar flush rápido se houver fármaco remanescente na linha."
  },

  nutricao_parenterica: {
    nivel: "alto",
    titulo: "Não administrar em bólus",
    mensagem:
      "A nutrição parentérica deve ser administrada por perfusão controlada. Administração rápida pode causar alterações metabólicas, osmolares ou hemodinâmicas.",
    recomendacao:
      "Administrar apenas conforme prescrição e protocolo institucional. Não fazer bólus ou flush rápido da solução remanescente."
  },

  fluido_solvente: {
    nivel: "baixo",
    titulo: "Sem alerta específico de bólus de fármaco",
    mensagem:
      "Solução usada como fluido/solvente. O risco depende sobretudo do contexto clínico, volume, velocidade, osmolaridade e compatibilidade.",
    recomendacao:
      "Confirmar prescrição, compatibilidade e restrições clínicas do doente."
  }
};

const ALERTA_BOLUS_POR_MEDICAMENTO = {
  acido_tranexamico: "antitrombotico_hemostatico",
  adrenalina: "vasoativo",
  albumina_humana_20: "administracao_lenta",
  alteplase: "antitrombotico_hemostatico",
  aminofilina: "toxicidade_margem_terapeutica",
  amiodarona_cloridrato: "vasoativo",
  bicarbonato_sodio: "eletrolito_metabolico",
  cetamina_cloridrato: "sedativo_analgesico_anestesico",
  ciclofosfamida: "toxicidade_margem_terapeutica",
  cloreto_calcio: "eletrolito_metabolico",
  cloreto_potassio: "potassio",
  cloreto_sodio_0_9: "fluido_solvente",
  dexmedetomidina: "sedativo_analgesico_anestesico",
  dinitrato_isossorbida: "vasoativo",
  dobutamina_cloridrato: "vasoativo",
  dopamina_cloridrato: "vasoativo",
  esmolol_cloridrato: "vasoativo",
  fosfato_potassio: "potassio",
  furosemida: "administracao_lenta",
  glucose_5: "fluido_solvente",
  gluconato_calcio: "eletrolito_metabolico",
  heparina_sodica: "antitrombotico_hemostatico",
  insulina: "insulina",
  isoprenalina_cloridrato: "vasoativo",
  labetalol_cloridrato: "vasoativo",
  levosimendan: "vasoativo",
  manitol: "administracao_lenta",
  metotrexato_sodico: "toxicidade_margem_terapeutica",
  midazolam_cloridrato: "sedativo_analgesico_anestesico",
  morfina_sulfato: "sedativo_analgesico_anestesico",
  nitroprussiato_sodio: "vasoativo",
  noradrenalina_bitartarato: "vasoativo",
  nutricao_parenterica_binaria: "nutricao_parenterica",
  nutricao_parenterica_com_lipidos: "nutricao_parenterica",
  octreotido_acetato: "administracao_lenta",
  omeprazol_sodico: "administracao_lenta",
  piperacilina_sodica: "administracao_lenta",
  piperacilina_sodica_tazobactam: "administracao_lenta",
  propofol: "sedativo_analgesico_anestesico",
  remifentanil_cloridrato: "sedativo_analgesico_anestesico",
  ringer_lactato: "fluido_solvente",
  rocuronio_brometo: "bloqueador_neuromuscular",
  sufentanil_citrato: "sedativo_analgesico_anestesico",
  sulfato_magnesio: "eletrolito_metabolico",
  tacrolimus: "toxicidade_margem_terapeutica",
  vancomicina_cloridrato: "administracao_lenta",
  vasopressina: "vasoativo"
};

function obterAlertaBolus(medicamentoId) {
  const grupo = ALERTA_BOLUS_POR_MEDICAMENTO[medicamentoId];

  if (!grupo || !ALERTAS_BOLUS_GRUPOS[grupo]) {
    return null;
  }

  return {
    grupo,
    ...ALERTAS_BOLUS_GRUPOS[grupo]
  };
}

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
  const supabase = obterClienteSupabase();

  if (!supabase) {
    throw new Error("Cliente Supabase não está disponível.");
  }

  const { data, error } = await comTimeoutSupabase(
    supabase.rpc("obter_compatibilidade", {
      med_a: idA,
      med_b: idB
    })
  );

  if (error) {
    throw error;
  }

  atualizarEstadoSupabase("disponível");

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

function buscarCompatibilidadeSnapshotLocal(idA, idB, opcoes = {}) {
  const resultadoLocal = buscarCompatibilidade(idA, idB);

  if (!resultadoLocal) {
    return null;
  }

  return {
    ...resultadoLocal,
    origem: "snapshot_local",
    fallbackDeSupabase: Boolean(opcoes.fallbackDeSupabase)
  };
}

async function obterCompatibilidade(idA, idB) {
  const mode = obterBackendMode();

  if (mode === "local") {
    atualizarEstadoSupabase("não usado");
    return buscarCompatibilidadeSnapshotLocal(idA, idB);
  }

  try {
    return await buscarCompatibilidadeSupabase(idA, idB);
  } catch (erro) {
    if (mode === "supabase" || !fallbackLocalAtivo()) {
      console.warn("Falha ao consultar Supabase. Modo sem fallback local.", erro);
      return resultadoSupabaseIndisponivel(erro);
    }

    console.warn("Falha ao consultar Supabase. A usar snapshot local como fallback.", erro);
    marcarFallbackLocalUsado();
    atualizarEstadoSupabase("indisponível", erro);
    return buscarCompatibilidadeSnapshotLocal(idA, idB, { fallbackDeSupabase: true });
  }
}

function metricasUtilizacaoAtivas() {
  if (Object.prototype.hasOwnProperty.call(window, "METRICS_ENABLED")) {
    return window.METRICS_ENABLED === true;
  }

  return window.COMPY_USAGE_METRICS_ENABLED === true;
}

function obterDeviceTypeAproximado() {
  const largura = window.innerWidth || 1024;
  const pontosToque = navigator.maxTouchPoints || 0;

  return largura <= 768 || pontosToque > 0 ? "mobile" : "desktop";
}

const CAMPOS_CONTADORES_METRICAS = [
  "selected_count",
  "pair_count",
  "compatible_count",
  "incompatible_count",
  "variable_count",
  "no_data_count",
  "alert_count"
];

function criarPayloadEventoUso(eventName, dados = {}) {
  const payload = {
    event_name: eventName,
    timestamp: new Date().toISOString(),
    app_version: COMPY_APP_VERSION,
    base_version: COMPY_BASE_VERSION,
    environment: COMPY_ENVIRONMENT,
    device_type: obterDeviceTypeAproximado()
  };

  CAMPOS_CONTADORES_METRICAS.forEach(campo => {
    if (Number.isInteger(dados[campo])) {
      payload[campo] = dados[campo];
    }
  });

  return payload;
}

function enviarEventoUso(eventName, dados = {}) {
  if (!metricasUtilizacaoAtivas()) {
    return;
  }

  const endpoint = window.COMPY_USAGE_LOG_ENDPOINT;

  if (!endpoint || typeof fetch !== "function") {
    return;
  }

  const payload = criarPayloadEventoUso(eventName, dados);
  const headers = {
    "Content-Type": "application/json"
  };

  if (window.SUPABASE_ANON_KEY) {
    headers.Authorization = `Bearer ${window.SUPABASE_ANON_KEY}`;
  }

  window.setTimeout(() => {
    fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(erro => {
      console.warn("Não foi possível registar a métrica anónima de utilização.", erro);
    });
  }, 0);
}

function registrarUtilizacaoAnonima(payload) {
  enviarEventoUso("analysis_run", payload);
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

  return {
    totalMedicamentos: MEDICAMENTOS.length,
    totalPares: pares.size,
    errosCriticos: {
      chavesSemMatch,
      refsInvalidas,
      conflitos
    },
    avisos: {
      medicamentosSemBloco: medsSemBloco
    }
  };
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
  configurarPesquisaMedicamentos();
}

function obterNomeMedicamento(id) {
  const med = medsById.get(id);
  return med ? med.nome : id;
}

function contarErrosCriticosValidacao(validacao) {
  if (!validacao) {
    return 0;
  }

  return (
    validacao.errosCriticos.chavesSemMatch.length +
    validacao.errosCriticos.refsInvalidas.length +
    validacao.errosCriticos.conflitos.length
  );
}

function contarAvisosValidacao(validacao) {
  if (!validacao) {
    return 0;
  }

  return validacao.avisos.medicamentosSemBloco.length;
}

function textoBaseConsultada() {
  if (window.compYMedicamentosOrigem === "snapshot_local") {
    return "Snapshot local";
  }

  if (window.compYMedicamentosOrigem === "supabase_indisponivel") {
    return "Supabase indisponível";
  }

  return "Supabase";
}

function textoModoBackend() {
  return obterBackendMode();
}

function textoEstadoSupabase() {
  if (!supabaseAtivoPelaConfiguracao()) {
    return "não usado";
  }

  return window.compYBackendStatus.supabase;
}

function textoFallbackLocal() {
  if (obterBackendMode() === "local") {
    return "fonte principal";
  }

  return fallbackLocalAtivo() ? "ativo" : "inativo";
}

function atualizarResumoTopoBackend() {
  const dados = document.getElementById("app-meta-dados");

  if (!dados) {
    return;
  }

  const mode = obterBackendMode();

  if (mode === "local") {
    dados.textContent = "Snapshot local";
  } else if (mode === "supabase") {
    dados.textContent = "Supabase";
  } else {
    dados.textContent = "Supabase + snapshot local";
  }
}

function adicionarItemEstadoBase(lista, etiqueta, valor, classe) {
  const item = document.createElement("div");
  item.classList.add("estado-base-item");

  if (classe) {
    item.classList.add(classe);
  }

  const label = document.createElement("span");
  label.textContent = etiqueta;
  item.appendChild(label);

  const dado = document.createElement("strong");
  dado.textContent = valor;
  item.appendChild(dado);

  lista.appendChild(item);
}

function renderizarEstadoBase() {
  const conteudo = document.getElementById("estado-base-conteudo");
  const validacao = window.compYValidacaoBase;

  if (!conteudo || !validacao) {
    return;
  }

  const totalErrosCriticos = contarErrosCriticosValidacao(validacao);
  const totalAvisos = contarAvisosValidacao(validacao);
  const lista = document.createElement("div");
  lista.classList.add("estado-base-grid");

  conteudo.innerHTML = "";

  atualizarResumoTopoBackend();

  adicionarItemEstadoBase(lista, "Modo atual", textoModoBackend());
  adicionarItemEstadoBase(lista, "Estado do Supabase", textoEstadoSupabase());
  adicionarItemEstadoBase(lista, "Fallback local", textoFallbackLocal());
  adicionarItemEstadoBase(lista, "Data do snapshot local", DATA_BASE_COMPY);
  adicionarItemEstadoBase(lista, "Medicamentos locais", String(validacao.totalMedicamentos));
  adicionarItemEstadoBase(lista, "Pares locais", String(validacao.totalPares));
  adicionarItemEstadoBase(lista, "Fonte principal", FONTE_PRINCIPAL_COMPY);
  adicionarItemEstadoBase(lista, "Base consultada", textoBaseConsultada());
  adicionarItemEstadoBase(
    lista,
    "Última validação",
    totalErrosCriticos === 0 ? "sem erros críticos" : "com erros críticos",
    totalErrosCriticos === 0 ? "estado-ok" : "estado-erro"
  );
  adicionarItemEstadoBase(
    lista,
    "Erros críticos",
    String(totalErrosCriticos),
    totalErrosCriticos === 0 ? "estado-ok" : "estado-erro"
  );
  adicionarItemEstadoBase(
    lista,
    "Avisos não críticos",
    String(totalAvisos),
    totalAvisos === 0 ? "estado-ok" : "estado-aviso"
  );

  conteudo.appendChild(lista);

  if (totalAvisos > 0) {
    const aviso = document.createElement("p");
    aviso.classList.add("estado-base-nota");
    aviso.textContent = `${totalAvisos} medicamento(s) sem bloco próprio na base local.`;
    conteudo.appendChild(aviso);
  }
}

function configurarEstadoBase() {
  const botao = document.getElementById("btn-sobre-base");
  const painel = document.getElementById("estado-base");

  if (!botao || !painel) {
    return;
  }

  renderizarEstadoBase();

  botao.addEventListener("click", () => {
    const vaiAbrir = painel.hasAttribute("hidden");

    painel.toggleAttribute("hidden", !vaiAbrir);
    botao.setAttribute("aria-expanded", String(vaiAbrir));

    if (vaiAbrir) {
      enviarEventoUso("base_status_viewed");
    }
  });
}

function obterSelectsMedicamentos() {
  return Array.from(document.querySelectorAll(".med-select"));
}

function obterIdsSelecionados() {
  return obterSelectsMedicamentos()
    .map(select => select.value)
    .filter(Boolean);
}

function obterAliasesMedicamento(id) {
  return Object.entries(aliases)
    .filter(([, idCanonico]) => idCanonico === id)
    .map(([alias]) => alias);
}

function criarIndicePesquisaMedicamentos() {
  const medicamentos = window.compYMedicamentosAtivos || [];

  return medicamentos.map(med => {
    const aliasesMedicamento = obterAliasesMedicamento(med.id);
    const termos = [med.nome, med.id, ...aliasesMedicamento];

    return {
      id: med.id,
      nome: med.nome,
      aliases: aliasesMedicamento,
      termos: termos.map(formaCanonica)
    };
  });
}

function procurarMedicamentos(termo) {
  const pesquisa = formaCanonica(termo);

  if (pesquisa.length < 2) {
    return [];
  }

  return criarIndicePesquisaMedicamentos()
    .filter(item => item.termos.some(termoNormalizado => termoNormalizado.includes(pesquisa)))
    .slice(0, 8);
}

function definirFeedbackPesquisa(mensagem, tipo = "info") {
  const feedback = document.getElementById("med-search-feedback");

  if (!feedback) {
    return;
  }

  feedback.textContent = mensagem;
  feedback.classList.toggle("aviso", tipo === "aviso");
}

function sincronizarSelectsComIds(ids) {
  const selects = obterSelectsMedicamentos();

  selects.forEach((select, index) => {
    select.value = ids[index] || "";
  });
}

function renderizarChipsSelecionados(mensagem) {
  const chips = document.getElementById("med-chips");

  if (!chips) {
    return;
  }

  const ids = [...new Set(obterIdsSelecionados())];
  chips.innerHTML = "";

  ids.forEach(id => {
    const chip = document.createElement("span");
    chip.classList.add("chip-medicamento");

    const nome = document.createElement("span");
    nome.textContent = obterNomeMedicamento(id);
    chip.appendChild(nome);

    const remover = document.createElement("button");
    remover.type = "button";
    remover.classList.add("chip-remover");
    remover.setAttribute("aria-label", `Remover ${obterNomeMedicamento(id)}`);
    remover.textContent = "×";
    remover.addEventListener("click", () => removerMedicamentoSelecionado(id));
    chip.appendChild(remover);

    chips.appendChild(chip);
  });

  if (mensagem) {
    definirFeedbackPesquisa(mensagem, "aviso");
  } else if (ids.length === 0) {
    definirFeedbackPesquisa("Nenhum medicamento selecionado.");
  } else {
    definirFeedbackPesquisa(`${ids.length} de ${LIMITE_MEDICAMENTOS_SELECIONADOS} medicamentos selecionados.`);
  }
}

function ocultarSugestoesMedicamentos() {
  const sugestoes = document.getElementById("med-suggestions");
  const input = document.getElementById("med-search");

  if (sugestoes) {
    sugestoes.innerHTML = "";
    sugestoes.classList.remove("tem-sugestoes");
  }

  if (input) {
    input.setAttribute("aria-expanded", "false");
  }
}

function selecionarMedicamento(id) {
  const ids = [...new Set(obterIdsSelecionados())];
  const nome = obterNomeMedicamento(id);

  if (ids.includes(id)) {
    renderizarChipsSelecionados(`${nome} já está selecionado.`);
    return false;
  }

  if (ids.length >= LIMITE_MEDICAMENTOS_SELECIONADOS) {
    renderizarChipsSelecionados(`Limite de ${LIMITE_MEDICAMENTOS_SELECIONADOS} medicamentos atingido.`);
    return false;
  }

  ids.push(id);
  sincronizarSelectsComIds(ids);
  renderizarChipsSelecionados();
  return true;
}

function removerMedicamentoSelecionado(id) {
  const ids = obterIdsSelecionados().filter(idSelecionado => idSelecionado !== id);

  sincronizarSelectsComIds(ids);
  renderizarChipsSelecionados();
}

function renderizarSugestoesMedicamentos(termo) {
  const sugestoes = document.getElementById("med-suggestions");
  const input = document.getElementById("med-search");

  if (!sugestoes || !input) {
    return;
  }

  const resultados = procurarMedicamentos(termo);
  sugestoes.innerHTML = "";

  if (resultados.length === 0) {
    sugestoes.classList.remove("tem-sugestoes");
    input.setAttribute("aria-expanded", "false");
    return;
  }

  resultados.forEach(item => {
    const linha = document.createElement("li");
    linha.setAttribute("role", "option");

    const botao = document.createElement("button");
    botao.type = "button";
    botao.classList.add("sugestao-medicamento");
    botao.dataset.id = item.id;

    const nome = document.createElement("strong");
    nome.textContent = item.nome;
    botao.appendChild(nome);

    const detalhe = document.createElement("span");
    const aliasesTexto = item.aliases.length > 0 ? ` | aliases: ${item.aliases.join(", ")}` : "";
    detalhe.textContent = `${item.id}${aliasesTexto}`;
    botao.appendChild(detalhe);

    botao.addEventListener("click", () => {
      if (selecionarMedicamento(item.id)) {
        input.value = "";
        ocultarSugestoesMedicamentos();
        input.focus();
      }
    });

    linha.appendChild(botao);
    sugestoes.appendChild(linha);
  });

  sugestoes.classList.add("tem-sugestoes");
  input.setAttribute("aria-expanded", "true");
}

function adicionarMedicamentoDaPesquisa() {
  const input = document.getElementById("med-search");

  if (!input) {
    return;
  }

  const termo = input.value.trim();
  const resultados = procurarMedicamentos(termo);

  if (resultados.length === 0) {
    definirFeedbackPesquisa("Nenhum medicamento encontrado para a pesquisa.", "aviso");
    return;
  }

  if (selecionarMedicamento(resultados[0].id)) {
    input.value = "";
    ocultarSugestoesMedicamentos();
  }
}

function sincronizarChipsAPartirDosSelects() {
  const ids = obterIdsSelecionados();
  const unicos = [...new Set(ids)];

  if (ids.length !== unicos.length) {
    sincronizarSelectsComIds(unicos);
    renderizarChipsSelecionados("Medicamento duplicado removido da seleção.");
    return;
  }

  renderizarChipsSelecionados();
}

function configurarPesquisaMedicamentos() {
  const input = document.getElementById("med-search");
  const adicionar = document.getElementById("btn-adicionar-med");
  const selects = obterSelectsMedicamentos();

  if (!input || !adicionar || selects.length === 0) {
    return;
  }

  input.addEventListener("input", () => renderizarSugestoesMedicamentos(input.value));
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      adicionarMedicamentoDaPesquisa();
    } else if (event.key === "Escape") {
      ocultarSugestoesMedicamentos();
    }
  });

  adicionar.addEventListener("click", adicionarMedicamentoDaPesquisa);

  selects.forEach(select => {
    select.addEventListener("change", sincronizarChipsAPartirDosSelects);
  });

  document.addEventListener("click", event => {
    const pesquisa = document.querySelector(".pesquisa-medicamentos");

    if (pesquisa && !pesquisa.contains(event.target)) {
      ocultarSugestoesMedicamentos();
    }
  });

  renderizarChipsSelecionados();
}

function criarAvisoBolus(idsSelecionados) {
  const gruposSelecionados = new Map();

  [...new Set(idsSelecionados)].forEach(id => {
    const alerta = obterAlertaBolus(id);

    if (!alerta) {
      return;
    }

    if (!gruposSelecionados.has(alerta.grupo)) {
      gruposSelecionados.set(alerta.grupo, {
        alerta,
        medicamentos: []
      });
    }

    gruposSelecionados.get(alerta.grupo).medicamentos.push(obterNomeMedicamento(id));
  });

  if (gruposSelecionados.size === 0) {
    return null;
  }

  const caixa = document.createElement("div");
  caixa.classList.add("alertas-bolus");

  const titulo = document.createElement("div");
  titulo.classList.add("alerta-bolus-titulo");
  titulo.textContent = "⚠️ Atenção: risco de bólus inadvertido nesta via";
  caixa.appendChild(titulo);

  const textoContextoAlerta =
    "Quando medicamentos ou soluções partilham a via, um flush, reabertura da linha ou outra manipulação pode administrar conteúdo remanescente de forma não intencional.";

  const ordemNiveis = { alto: 1, moderado: 2, baixo: 3 };
  const gruposOrdenados = [...gruposSelecionados.values()].sort(
    (a, b) => ordemNiveis[a.alerta.nivel] - ordemNiveis[b.alerta.nivel]
  );
  const apenasNivelBaixo = gruposOrdenados.every(item => item.alerta.nivel === "baixo");

  if (apenasNivelBaixo) {
    caixa.classList.add("alertas-bolus-so-baixo");
  }

  gruposOrdenados.forEach(({ alerta, medicamentos }) => {
    const bloco = document.createElement("details");
    bloco.classList.add("alerta-bolus", `alerta-bolus-${alerta.nivel}`);

    const resumo = document.createElement("summary");
    resumo.classList.add("alerta-bolus-resumo");

    const subtitulo = document.createElement("strong");
    subtitulo.classList.add("alerta-bolus-grupo-titulo");
    subtitulo.textContent = alerta.titulo;
    resumo.appendChild(subtitulo);

    const medicamentosTexto = document.createElement("p");
    medicamentosTexto.classList.add("alerta-bolus-medicamentos");
    medicamentosTexto.textContent = `Medicamentos selecionados: ${medicamentos.join(", ")}.`;
    resumo.appendChild(medicamentosTexto);

    const indicador = document.createElement("span");
    indicador.classList.add("alerta-bolus-indicador");
    indicador.textContent = "Ver detalhes";
    resumo.appendChild(indicador);

    bloco.appendChild(resumo);

    const detalhes = document.createElement("div");
    detalhes.classList.add("alerta-bolus-detalhes");

    const intro = document.createElement("p");
    intro.classList.add("alerta-bolus-intro");
    intro.textContent = textoContextoAlerta;
    detalhes.appendChild(intro);

    const mensagem = document.createElement("p");
    mensagem.textContent = alerta.mensagem;
    detalhes.appendChild(mensagem);

    const recomendacao = document.createElement("p");
    recomendacao.classList.add("alerta-bolus-recomendacao");
    recomendacao.textContent = alerta.recomendacao;
    detalhes.appendChild(recomendacao);

    bloco.appendChild(detalhes);
    bloco.addEventListener("toggle", () => {
      if (bloco.open) {
        enviarEventoUso("alert_expanded");
      }
    });

    caixa.appendChild(bloco);
  });

  return caixa;
}

function contarAlertasRelevantes(idsSelecionados) {
  const grupos = new Set();

  [...new Set(idsSelecionados)].forEach(id => {
    const alerta = obterAlertaBolus(id);

    if (alerta) {
      grupos.add(alerta.grupo);
    }
  });

  return grupos.size;
}

function atualizarResumoAnalise(resumo, resultado) {
  resumo.total += 1;

  if (!resultado || resultado.status === "nao_identificado") {
    resumo.semDados += 1;
    return;
  }

  if (resultado.status === "compativel") {
    resumo.compativel += 1;
  } else if (resultado.status === "incompativel") {
    resumo.incompativel += 1;
  } else if (resultado.status === "variavel") {
    resumo.variavel += 1;
  }
}

function adicionarBadgeResumo(container, etiqueta, valor, classe, textoTeste = etiqueta) {
  const item = document.createElement("div");
  item.classList.add("resumo-badge", classe);

  const label = document.createElement("span");
  label.textContent = etiqueta;
  item.appendChild(label);

  const numero = document.createElement("strong");
  numero.textContent = valor;
  item.appendChild(numero);

  const textoCompatibilidadeTeste = document.createElement("span");
  textoCompatibilidadeTeste.classList.add("sr-only");
  textoCompatibilidadeTeste.textContent = `${textoTeste}: ${valor}`;
  item.appendChild(textoCompatibilidadeTeste);

  container.appendChild(item);
}

function criarResumoAnalise(resumo) {
  const bloco = document.createElement("div");
  bloco.classList.add("resultado-item", "resumo-analise");

  const titulo = document.createElement("span");
  titulo.classList.add("resumo-titulo");
  titulo.textContent = "Resumo:";
  bloco.appendChild(titulo);

  const badges = document.createElement("div");
  badges.classList.add("resumo-badges");

  adicionarBadgeResumo(badges, "Pares", resumo.total, "resumo-total", "Total de pares avaliados");
  adicionarBadgeResumo(badges, "Compatíveis", resumo.compativel, "resumo-compativel");
  adicionarBadgeResumo(badges, "Incompatíveis", resumo.incompativel, "resumo-incompativel");
  adicionarBadgeResumo(badges, "Variáveis", resumo.variavel, "resumo-variavel", "Variáveis/dados conflitantes");
  adicionarBadgeResumo(badges, "Sem dados", resumo.semDados, "resumo-sem-dados");
  adicionarBadgeResumo(badges, "Alertas", resumo.alertas, "resumo-alertas", "Alertas relevantes");

  bloco.appendChild(badges);
  return bloco;
}

function limparSelecao() {
  obterSelectsMedicamentos().forEach(select => {
    select.value = "";
  });

  const input = document.getElementById("med-search");
  if (input) {
    input.value = "";
  }

  ocultarSugestoesMedicamentos();
  renderizarChipsSelecionados();

  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "";
}

async function verificarCompatibilidade() {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "";
  window.compYBackendStatus.fallbackLocalUsado = false;

  const selects = Array.from(document.querySelectorAll(".med-select"));
  const selecionados = selects.map(s => s.value).filter(v => v);
  const unicos = [...new Set(selecionados)];

  if (selecionados.length !== unicos.length) {
    const avisoDuplicados = document.createElement("div");
    avisoDuplicados.classList.add("aviso-selecao");
    avisoDuplicados.textContent =
      "Há medicamentos repetidos na seleção. Remova duplicados antes de verificar a compatibilidade.";
    resultadoDiv.appendChild(avisoDuplicados);
    return;
  }

  if (unicos.length < 2) {
    resultadoDiv.textContent = "Selecione pelo menos dois medicamentos para avaliar a via Y.";
    return;
  }

  const avisoBolus = criarAvisoBolus(unicos);
  if (avisoBolus) {
    resultadoDiv.appendChild(avisoBolus);
  }

  let fallbackLocalUsado = false;
  const blocosResultados = [];
  const resumoAnalise = {
    total: 0,
    compativel: 0,
    incompativel: 0,
    variavel: 0,
    semDados: 0,
    alertas: contarAlertasRelevantes(unicos)
  };

  for (let i = 0; i < unicos.length; i++) {
    for (let j = i + 1; j < unicos.length; j++) {
      const idA = unicos[i];
      const idB = unicos[j];
      const nomeA = obterNomeMedicamento(idA);
      const nomeB = obterNomeMedicamento(idB);

      const resultado = await obterCompatibilidade(idA, idB);
      atualizarResumoAnalise(resumoAnalise, resultado);

      if (resultado && resultado.fallbackDeSupabase) {
        fallbackLocalUsado = true;
      }

      const bloco = document.createElement("div");
      bloco.classList.add("resultado-item");

      const titulo = document.createElement("strong");
      titulo.textContent = `${nomeA} + ${nomeB}`;
      bloco.appendChild(titulo);

      const texto = document.createElement("div");

      if (!resultado) {
        bloco.classList.add("status-desconhecido");
        texto.textContent = MENSAGEM_SEM_DADOS;
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
          texto.textContent = MENSAGEM_SEM_DADOS;
        }
      }

      bloco.appendChild(texto);

      if (
        resultado &&
        (
          resultado.origem === "supabase" ||
          resultado.origem === "snapshot_local" ||
          resultado.origem === "supabase_indisponivel"
        )
      ) {
        const fonte = document.createElement("small");
        fonte.classList.add("resultado-fonte");
        fonte.textContent = textoOrigemDados(resultado);
        bloco.appendChild(fonte);
      }

      blocosResultados.push(bloco);
    }
  }

  resultadoDiv.appendChild(criarResumoAnalise(resumoAnalise));
  blocosResultados.forEach(bloco => resultadoDiv.appendChild(bloco));

  if (fallbackLocalUsado) {
    const avisoFallback = document.createElement("p");
    avisoFallback.classList.add("disclaimer");
    avisoFallback.textContent =
      "Supabase indisponível — usado snapshot local.";
    resultadoDiv.appendChild(avisoFallback);
  }

  renderizarEstadoBase();

  registrarUtilizacaoAnonima({
    selected_count: unicos.length,
    pair_count: resumoAnalise.total,
    compatible_count: resumoAnalise.compativel,
    incompatible_count: resumoAnalise.incompativel,
    variable_count: resumoAnalise.variavel,
    no_data_count: resumoAnalise.semDados,
    alert_count: resumoAnalise.alertas
  });
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


