(function prepararModulo(global, document) {
  "use strict";

  if (!global.COMPY_FEATURES?.PREPARACAO_MEDICAMENTOS) return;

  const root = document.getElementById("preparacao-medicamentos-root");
  const botaoAbrir = document.getElementById("btn-teste-preparacao");
  const schema = global.CompYPreparacaoSchema;
  const fichas = Array.isArray(global.COMPY_PREPARACOES) ? global.COMPY_PREPARACOES : [];
  if (!root || !botaoAbrir || !schema) return;

  root.className = "preparacao-painel";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-labelledby", "preparacao-titulo");
  root.innerHTML = `
    <div class="preparacao-painel-topo">
      <div>
        <p class="preparacao-etiqueta">Teste — base clínica em construção</p>
        <h2 id="preparacao-titulo">Preparação e administração IV</h2>
      </div>
      <button type="button" id="fechar-preparacao" class="preparacao-fechar" aria-label="Fechar Teste">×</button>
    </div>
    <p class="preparacao-introducao">Selecione o medicamento, a dose total e o tipo de acesso. A recomendação terá em conta a apresentação disponível e os limites validados para cada via.</p>
    <form id="form-preparacao" class="preparacao-form" novalidate>
      <label class="preparacao-largo">Medicamento<select name="medicamento" required><option value="">-- Selecione --</option></select></label>
      <label>Dose total prescrita<input name="dose" type="number" min="0" step="any" inputmode="decimal" placeholder="Ex.: 150" required></label>
      <label>Unidade<input name="unidadeDose" value="mg" readonly></label>
      <label class="preparacao-largo">Apresentação disponível<select name="apresentacao" required disabled><option value="">Selecione primeiro o medicamento</option></select></label>
      <fieldset class="preparacao-vias">
        <legend>Tipo de acesso</legend>
        <label><input type="radio" name="via" value="periferica" required> Via periférica</label>
        <label><input type="radio" name="via" value="central" required> Via central</label>
      </fieldset>
      <button type="submit" class="preparacao-calcular">Ver recomendação</button>
    </form>
    <div id="preparacao-feedback" class="preparacao-feedback" aria-live="polite"></div>
    <section id="preparacao-resultado" class="preparacao-resultado" hidden aria-live="polite"></section>
    <p class="preparacao-aviso">Ferramenta experimental. Não utilizar para decisão clínica enquanto a ficha do medicamento não estiver validada pela farmácia/protocolo institucional.</p>
  `;

  const selectMedicamento = root.querySelector('[name="medicamento"]');
  const selectApresentacao = root.querySelector('[name="apresentacao"]');
  const unidadeDose = root.querySelector('[name="unidadeDose"]');
  const form = root.querySelector("#form-preparacao");
  const feedback = root.querySelector("#preparacao-feedback");
  const resultado = root.querySelector("#preparacao-resultado");
  const botaoFechar = root.querySelector("#fechar-preparacao");

  for (const ficha of fichas) {
    const option = document.createElement("option");
    option.value = ficha.id;
    option.textContent = ficha.nome;
    selectMedicamento.append(option);
  }

  const fichaSelecionada = () => fichas.find(ficha => ficha.id === selectMedicamento.value) || null;

  function abrirPainel() {
    root.hidden = false;
    document.body.classList.add("preparacao-aberta");
    botaoAbrir.setAttribute("aria-expanded", "true");
    selectMedicamento.focus();
  }

  function fecharPainel() {
    root.hidden = true;
    document.body.classList.remove("preparacao-aberta");
    botaoAbrir.setAttribute("aria-expanded", "false");
    botaoAbrir.focus();
  }

  botaoAbrir.addEventListener("click", abrirPainel);
  botaoFechar.addEventListener("click", fecharPainel);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !root.hidden) fecharPainel();
  });

  selectMedicamento.addEventListener("change", () => {
    const ficha = fichaSelecionada();
    selectApresentacao.replaceChildren();
    resultado.hidden = true;
    feedback.textContent = "";

    if (!ficha) {
      selectApresentacao.disabled = true;
      selectApresentacao.append(new Option("Selecione primeiro o medicamento", ""));
      unidadeDose.value = "mg";
      return;
    }

    unidadeDose.value = ficha.unidadeDose;
    selectApresentacao.append(new Option("-- Selecione --", ""));
    for (const apresentacao of ficha.apresentacoes) {
      const descricao = `${apresentacao.forma} de ${apresentacao.quantidade} ${apresentacao.unidade}`;
      selectApresentacao.append(new Option(descricao, String(apresentacao.quantidade)));
    }
    selectApresentacao.disabled = false;
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const dados = new FormData(form);
    const calculo = schema.calcularPreparacao({
      ficha: fichaSelecionada(),
      dose: dados.get("dose"),
      apresentacao: dados.get("apresentacao"),
      via: dados.get("via")
    });

    if (calculo.erro) {
      resultado.hidden = true;
      feedback.className = "preparacao-feedback preparacao-feedback--erro";
      feedback.textContent = calculo.erro;
      return;
    }

    feedback.textContent = "";
    feedback.className = "preparacao-feedback";
    resultado.replaceChildren();
    const resumo = document.createElement("div");
    resumo.className = "preparacao-resumo";
    resumo.innerHTML = `<div><span>Dose</span><strong>${calculo.dose} ${calculo.unidadeDose}</strong></div><div><span>Apresentação</span><strong>${calculo.apresentacao} ${calculo.unidadeDose}</strong></div><div><span>Frascos necessários</span><strong>${calculo.numeroFrascos}</strong></div><div><span>Acesso</span><strong>${calculo.via === "central" ? "Central" : "Periférico"}</strong></div>`;
    resultado.append(resumo);

    if (calculo.incompleto) {
      const aviso = document.createElement("div");
      aviso.className = "preparacao-sem-ficha";
      aviso.innerHTML = `<strong>Ficha ainda não disponível</strong><p>${calculo.mensagem}</p><p>Não foi calculado qualquer volume ou concentração.</p>`;
      resultado.append(aviso);
      resultado.hidden = false;
      return;
    }

    const recomendacoes = document.createElement("div");
    recomendacoes.className = "preparacao-recomendacoes";
    recomendacoes.innerHTML = `<article><h3>Diluição habitual</h3><p><strong>${calculo.habitual.volumeMl.toFixed(1)} mL</strong></p><p>${calculo.habitual.concentracao} ${calculo.unidadeConcentracao}</p></article><article><h3>Menor volume validado</h3><p><strong>${calculo.volumeMinimo.volumeMl.toFixed(1)} mL</strong></p><p>Concentração máxima: ${calculo.volumeMinimo.concentracao} ${calculo.unidadeConcentracao}</p></article>`;
    resultado.append(recomendacoes);

    const detalhes = document.createElement("dl");
    detalhes.className = "preparacao-detalhes";
    for (const [titulo, valor] of [["Diluente(s)", calculo.diluentes.join(" ou ")], ["Tempo recomendado", calculo.tempoAdministracao], ["Observações", calculo.observacoes], ["Efeitos adversos", calculo.efeitosAdversos]]) {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = titulo;
      dd.textContent = valor || "Sem informação registada.";
      detalhes.append(dt, dd);
    }
    resultado.append(detalhes);
    resultado.hidden = false;
  });
})(window, document);
