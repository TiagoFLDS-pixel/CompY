(function prepararSchema(global) {
  "use strict";

  const UNIDADES_CONCENTRACAO = Object.freeze([
    "mg/mL",
    "microgramas/mL",
    "g/L",
    "UI/mL",
    "mmol/mL"
  ]);

  const UNIDADES_TAXA = Object.freeze([
    "mL/h",
    "mg/h",
    "mg/kg/h",
    "microgramas/min",
    "microgramas/kg/min",
    "UI/h"
  ]);

  const ESTADOS_VALIDACAO = Object.freeze(["rascunho", "em_revisao", "validado"]);

  function texto(valor) {
    return String(valor ?? "").trim();
  }

  function numeroOuNulo(valor) {
    if (valor === "" || valor === null || valor === undefined) return null;
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
  }

  function criarRegistoPreparacao(valores = {}) {
    return {
      id: texto(valores.id),
      medicamento: texto(valores.medicamento),
      apresentacao: texto(valores.apresentacao),
      via: texto(valores.via || "Intravenosa"),
      reconstituicao: {
        necessaria: Boolean(valores.reconstituicao?.necessaria),
        liquido: texto(valores.reconstituicao?.liquido),
        volumeMl: numeroOuNulo(valores.reconstituicao?.volumeMl),
        observacoes: texto(valores.reconstituicao?.observacoes)
      },
      diluicao: {
        liquido: texto(valores.diluicao?.liquido),
        volumeFinalMl: numeroOuNulo(valores.diluicao?.volumeFinalMl),
        observacoes: texto(valores.diluicao?.observacoes)
      },
      concentracaoFinal: {
        minima: numeroOuNulo(valores.concentracaoFinal?.minima),
        recomendada: numeroOuNulo(valores.concentracaoFinal?.recomendada),
        maxima: numeroOuNulo(valores.concentracaoFinal?.maxima),
        unidade: texto(valores.concentracaoFinal?.unidade)
      },
      perfusao: {
        taxaMinima: numeroOuNulo(valores.perfusao?.taxaMinima),
        taxaRecomendada: numeroOuNulo(valores.perfusao?.taxaRecomendada),
        taxaMaxima: numeroOuNulo(valores.perfusao?.taxaMaxima),
        unidade: texto(valores.perfusao?.unidade),
        duracaoMinutos: numeroOuNulo(valores.perfusao?.duracaoMinutos)
      },
      observacoes: texto(valores.observacoes),
      efeitosAdversos: texto(valores.efeitosAdversos),
      fonte: {
        referencia: texto(valores.fonte?.referencia),
        url: texto(valores.fonte?.url),
        consultadaEm: texto(valores.fonte?.consultadaEm)
      },
      validacao: {
        estado: ESTADOS_VALIDACAO.includes(valores.validacao?.estado)
          ? valores.validacao.estado
          : "rascunho",
        validadoPor: texto(valores.validacao?.validadoPor),
        validadoEm: texto(valores.validacao?.validadoEm),
        revistoEm: texto(valores.validacao?.revistoEm)
      }
    };
  }

  function validarRegistoPreparacao(registo) {
    const erros = [];

    if (!registo.medicamento) erros.push("Indique o medicamento.");
    if (!registo.diluicao.liquido) erros.push("Indique o líquido de diluição.");
    if (!registo.concentracaoFinal.unidade) erros.push("Indique a unidade da concentração final.");
    if (registo.concentracaoFinal.recomendada === null) {
      erros.push("Indique a concentração final recomendada.");
    }
    const temAlgumaTaxa = [
      registo.perfusao.taxaMinima,
      registo.perfusao.taxaRecomendada,
      registo.perfusao.taxaMaxima
    ].some(valor => valor !== null);
    if (temAlgumaTaxa && !registo.perfusao.unidade) {
      erros.push("Indique a unidade da taxa de perfusão.");
    }
    if (registo.perfusao.taxaRecomendada === null && registo.perfusao.duracaoMinutos === null) {
      erros.push("Indique a taxa recomendada ou a duração da perfusão.");
    }
    if (!registo.fonte.referencia) erros.push("Indique a fonte clínica.");

    if (registo.validacao.estado === "validado") {
      if (!registo.validacao.validadoPor) erros.push("Identifique quem validou o registo.");
      if (!registo.validacao.validadoEm) erros.push("Indique a data da validação.");
    }

    return erros;
  }

  global.CompYPreparacaoSchema = Object.freeze({
    UNIDADES_CONCENTRACAO,
    UNIDADES_TAXA,
    ESTADOS_VALIDACAO,
    criarRegistoPreparacao,
    validarRegistoPreparacao
  });
})(window);
