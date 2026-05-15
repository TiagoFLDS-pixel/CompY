document.addEventListener("DOMContentLoaded", async () => {
  const botao = document.getElementById("btn-verificar");
  const botaoLimpar = document.getElementById("btn-limpar");

  botao.disabled = true;
  botao.textContent = "A carregar medicamentos...";
  botaoLimpar.disabled = true;

  await popularSelects();
  validarBase();

  botao.addEventListener("click", verificarCompatibilidade);
  botaoLimpar.addEventListener("click", limparSelecao);

  botao.disabled = false;
  botaoLimpar.disabled = false;
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

function textoOrigemDados(resultado) {
  if (resultado.origem === "json_local") {
    if (resultado.status === "nao_identificado") {
      return "Base consultada: fallback local | Sem registo na base validada para este par.";
    }

    return "Fonte clínica: Stabilis | Validação CompY: 09/05/2026 | Base consultada: fallback local";
  }

  if (resultado.status === "nao_identificado") {
    return "Base consultada: Supabase | Sem registo na base validada para este par.";
  }

  return "Fonte clínica: Stabilis | Validação CompY: 09/05/2026 | Base consultada: Supabase";
}

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

async function registrarUtilizacaoAnonima(payload) {
  try {
    if (!window.compYSupabase) {
      throw new Error("Cliente Supabase não está disponível.");
    }

    const { error } = await window.compYSupabase
      .from("metricas_utilizacao")
      .insert([payload]);

    if (error) {
      throw error;
    }
  } catch (erro) {
    console.warn("Não foi possível registar a métrica anónima de utilização.", erro);
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

  const intro = document.createElement("p");
  intro.classList.add("alerta-bolus-intro");
  intro.textContent =
    "Quando medicamentos ou soluções partilham a via, um flush, reabertura da linha ou outra manipulação pode administrar conteúdo remanescente de forma não intencional.";
  caixa.appendChild(intro);

  const ordemNiveis = { alto: 1, moderado: 2, baixo: 3 };
  const gruposOrdenados = [...gruposSelecionados.values()].sort(
    (a, b) => ordemNiveis[a.alerta.nivel] - ordemNiveis[b.alerta.nivel]
  );
  const apenasNivelBaixo = gruposOrdenados.every(item => item.alerta.nivel === "baixo");

  if (apenasNivelBaixo) {
    caixa.classList.add("alertas-bolus-so-baixo");
  }

  gruposOrdenados.forEach(({ alerta, medicamentos }) => {
    const bloco = document.createElement("div");
    bloco.classList.add("alerta-bolus", `alerta-bolus-${alerta.nivel}`);

    const subtitulo = document.createElement("strong");
    subtitulo.classList.add("alerta-bolus-grupo-titulo");
    subtitulo.textContent = alerta.titulo;
    bloco.appendChild(subtitulo);

    const medicamentosTexto = document.createElement("p");
    medicamentosTexto.classList.add("alerta-bolus-medicamentos");
    medicamentosTexto.textContent = `Medicamentos selecionados: ${medicamentos.join(", ")}.`;
    bloco.appendChild(medicamentosTexto);

    const mensagem = document.createElement("p");
    mensagem.textContent = alerta.mensagem;
    bloco.appendChild(mensagem);

    const recomendacao = document.createElement("p");
    recomendacao.classList.add("alerta-bolus-recomendacao");
    recomendacao.textContent = alerta.recomendacao;
    bloco.appendChild(recomendacao);

    caixa.appendChild(bloco);
  });

  return caixa;
}

function limparSelecao() {
  document.querySelectorAll(".med-select").forEach(select => {
    select.value = "";
  });

  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "";
}

async function verificarCompatibilidade() {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "";

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
  let numeroPares = 0;
  let temIncompatibilidade = false;
  let temVariavel = false;
  let temSemDados = false;

  for (let i = 0; i < unicos.length; i++) {
    for (let j = i + 1; j < unicos.length; j++) {
      numeroPares++;

      const idA = unicos[i];
      const idB = unicos[j];
      const nomeA = obterNomeMedicamento(idA);
      const nomeB = obterNomeMedicamento(idB);

      const resultado = await buscarCompatibilidadeComFallback(idA, idB);

      if (resultado && resultado.origem === "json_local") {
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
        temSemDados = true;
        texto.textContent =
          "Não foi possível interpretar esta combinação na base atual. Confirmar em fontes oficiais.";
      } else {
        const { status } = resultado;

        if (status === "compativel") {
          bloco.classList.add("status-compativel");
          texto.textContent = "Provavelmente compatível em via Y. Conferir sempre protocolo institucional.";
        } else if (status === "incompativel") {
          bloco.classList.add("status-incompativel");
          temIncompatibilidade = true;
          texto.textContent = "Provavelmente incompatível em via Y. Preferir via exclusiva ou outra estratégia.";
        } else if (status === "variavel") {
          bloco.classList.add("status-variavel");
          temVariavel = true;
          texto.textContent = "Compatibilidade variável/controversa. Verificar fonte atualizada e protocolo local.";
        } else if (status === "nao_identificado") {
          bloco.classList.add("status-desconhecido");
          temSemDados = true;
          texto.textContent =
            "Sem dados de compatibilidade registados na base atual. Não interpretar como compatível. Confirmar em fonte oficial atualizada e/ou com a farmácia clínica.";
        }
      }

      bloco.appendChild(texto);

      if (resultado && (resultado.origem === "supabase" || resultado.origem === "json_local")) {
        const fonte = document.createElement("small");
        fonte.classList.add("resultado-fonte");
        fonte.textContent = textoOrigemDados(resultado);
        bloco.appendChild(fonte);
      }

      resultadoDiv.appendChild(bloco);
    }
  }

  if (fallbackLocalUsado) {
    const avisoFallback = document.createElement("p");
    avisoFallback.classList.add("disclaimer");
    avisoFallback.textContent =
      "Supabase indisponível. Resultados calculados pela base local de segurança.";
    resultadoDiv.appendChild(avisoFallback);
  }

  const rodape = document.createElement("p");
  rodape.classList.add("disclaimer");
  rodape.textContent =
    "Ferramenta experimental para treinamento. Não utilizar para decisões clínicas reais.";
  resultadoDiv.appendChild(rodape);

  registrarUtilizacaoAnonima({
    numero_medicamentos: unicos.length,
    numero_pares: numeroPares,
    tem_incompatibilidade: temIncompatibilidade,
    tem_variavel: temVariavel,
    tem_sem_dados: temSemDados,
    base_consultada: fallbackLocalUsado ? "fallback_local" : "supabase",
    versao_base: "2026-05-09"
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
