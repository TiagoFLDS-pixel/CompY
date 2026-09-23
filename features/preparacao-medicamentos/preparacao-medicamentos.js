(function prepararModulo(global, document) {
  "use strict";

  if (!global.COMPY_FEATURES?.PREPARACAO_MEDICAMENTOS) return;

  const root = document.getElementById("preparacao-medicamentos-root");
  const schema = global.CompYPreparacaoSchema;
  if (!root || !schema) return;

  const opcoes = valores => valores.map(valor => `<option value="${valor}">${valor}</option>`).join("");

  root.innerHTML = `
    <div class="preparacao-cabecalho">
      <div>
        <p class="preparacao-etiqueta">Módulo experimental — conteúdo não validado</p>
        <h2>Preparação e administração IV</h2>
        <p>Área interna para registar orientações de reconstituição, diluição e perfusão.</p>
      </div>
    </div>

    <form id="form-preparacao" class="preparacao-form" novalidate>
      <fieldset>
        <legend>Medicamento</legend>
        <label>Nome do medicamento <input name="medicamento" required></label>
        <label>Apresentação <input name="apresentacao" placeholder="Ex.: frasco 500 mg"></label>
        <label>Via <input name="via" value="Intravenosa"></label>
      </fieldset>

      <fieldset>
        <legend>Reconstituição</legend>
        <label class="preparacao-check"><input type="checkbox" name="reconstituicaoNecessaria"> Necessita de reconstituição</label>
        <label>Líquido de reconstituição <input name="reconstituicaoLiquido"></label>
        <label>Volume (mL) <input name="reconstituicaoVolume" type="number" min="0" step="any"></label>
        <label class="preparacao-largo">Observações <textarea name="reconstituicaoObservacoes" rows="2"></textarea></label>
      </fieldset>

      <fieldset>
        <legend>Diluição</legend>
        <label>Líquido de diluição <input name="diluicaoLiquido" required></label>
        <label>Volume final (mL) <input name="diluicaoVolumeFinal" type="number" min="0" step="any"></label>
        <label class="preparacao-largo">Observações <textarea name="diluicaoObservacoes" rows="2"></textarea></label>
      </fieldset>

      <fieldset>
        <legend>Concentração final</legend>
        <label>Mínima <input name="concentracaoMinima" type="number" min="0" step="any"></label>
        <label>Recomendada <input name="concentracaoRecomendada" type="number" min="0" step="any" required></label>
        <label>Máxima <input name="concentracaoMaxima" type="number" min="0" step="any"></label>
        <label>Unidade <select name="concentracaoUnidade" required><option value="">-- Selecione --</option>${opcoes(schema.UNIDADES_CONCENTRACAO)}</select></label>
      </fieldset>

      <fieldset>
        <legend>Perfusão recomendada</legend>
        <label>Taxa mínima <input name="taxaMinima" type="number" min="0" step="any"></label>
        <label>Taxa recomendada <input name="taxaRecomendada" type="number" min="0" step="any"></label>
        <label>Taxa máxima <input name="taxaMaxima" type="number" min="0" step="any"></label>
        <label>Unidade <select name="taxaUnidade"><option value="">-- Selecione --</option>${opcoes(schema.UNIDADES_TAXA)}</select></label>
        <label>Duração (minutos) <input name="duracaoMinutos" type="number" min="0" step="any"></label>
      </fieldset>

      <fieldset>
        <legend>Segurança e observações</legend>
        <label class="preparacao-largo">Observações clínicas <textarea name="observacoes" rows="4"></textarea></label>
        <label class="preparacao-largo">Efeitos adversos relevantes <textarea name="efeitosAdversos" rows="4"></textarea></label>
      </fieldset>

      <fieldset>
        <legend>Fonte e validação</legend>
        <label>Referência clínica <input name="fonteReferencia" required></label>
        <label>Ligação da fonte <input name="fonteUrl" type="url"></label>
        <label>Data da consulta <input name="fonteConsultadaEm" type="date"></label>
        <label>Estado <select name="estadoValidacao">${opcoes(schema.ESTADOS_VALIDACAO)}</select></label>
        <label>Validado por <input name="validadoPor"></label>
        <label>Data da validação <input name="validadoEm" type="date"></label>
        <label>Próxima revisão <input name="revistoEm" type="date"></label>
      </fieldset>

      <div class="preparacao-acoes">
        <button type="submit">Validar rascunho</button>
        <button type="button" id="exportar-preparacao" class="btn-secundario" disabled>Exportar JSON</button>
      </div>
      <div id="preparacao-feedback" class="preparacao-feedback" aria-live="polite"></div>
    </form>
  `;
  root.hidden = false;

  const form = root.querySelector("#form-preparacao");
  const feedback = root.querySelector("#preparacao-feedback");
  const botaoExportar = root.querySelector("#exportar-preparacao");
  let ultimoRegisto = null;

  function valoresDoFormulario() {
    const dados = new FormData(form);
    return schema.criarRegistoPreparacao({
      medicamento: dados.get("medicamento"),
      apresentacao: dados.get("apresentacao"),
      via: dados.get("via"),
      reconstituicao: {
        necessaria: dados.get("reconstituicaoNecessaria") === "on",
        liquido: dados.get("reconstituicaoLiquido"),
        volumeMl: dados.get("reconstituicaoVolume"),
        observacoes: dados.get("reconstituicaoObservacoes")
      },
      diluicao: {
        liquido: dados.get("diluicaoLiquido"),
        volumeFinalMl: dados.get("diluicaoVolumeFinal"),
        observacoes: dados.get("diluicaoObservacoes")
      },
      concentracaoFinal: {
        minima: dados.get("concentracaoMinima"),
        recomendada: dados.get("concentracaoRecomendada"),
        maxima: dados.get("concentracaoMaxima"),
        unidade: dados.get("concentracaoUnidade")
      },
      perfusao: {
        taxaMinima: dados.get("taxaMinima"),
        taxaRecomendada: dados.get("taxaRecomendada"),
        taxaMaxima: dados.get("taxaMaxima"),
        unidade: dados.get("taxaUnidade"),
        duracaoMinutos: dados.get("duracaoMinutos")
      },
      observacoes: dados.get("observacoes"),
      efeitosAdversos: dados.get("efeitosAdversos"),
      fonte: {
        referencia: dados.get("fonteReferencia"),
        url: dados.get("fonteUrl"),
        consultadaEm: dados.get("fonteConsultadaEm")
      },
      validacao: {
        estado: dados.get("estadoValidacao"),
        validadoPor: dados.get("validadoPor"),
        validadoEm: dados.get("validadoEm"),
        revistoEm: dados.get("revistoEm")
      }
    });
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const registo = valoresDoFormulario();
    const erros = schema.validarRegistoPreparacao(registo);

    if (erros.length) {
      ultimoRegisto = null;
      botaoExportar.disabled = true;
      feedback.className = "preparacao-feedback preparacao-feedback--erro";
      feedback.innerHTML = `<strong>Rascunho incompleto:</strong><ul>${erros.map(erro => `<li>${erro}</li>`).join("")}</ul>`;
      return;
    }

    ultimoRegisto = registo;
    botaoExportar.disabled = false;
    feedback.className = "preparacao-feedback preparacao-feedback--sucesso";
    feedback.textContent = "Estrutura válida. O conteúdo continua a ser um rascunho clínico até validação formal.";
  });

  botaoExportar.addEventListener("click", () => {
    if (!ultimoRegisto) return;
    const blob = new Blob([JSON.stringify(ultimoRegisto, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `preparacao-${ultimoRegisto.medicamento.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "medicamento"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });
})(window, document);
