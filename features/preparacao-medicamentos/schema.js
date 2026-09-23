(function prepararSchema(global) {
  "use strict";

  function numeroPositivo(valor) {
    const numero = Number(valor);
    return Number.isFinite(numero) && numero > 0 ? numero : null;
  }

  function calcularPreparacao({ ficha, dose, apresentacao, via }) {
    const doseNumerica = numeroPositivo(dose);
    const quantidadeApresentacao = numeroPositivo(apresentacao);
    const perfilVia = ficha?.vias?.[via] || null;

    if (!ficha) return { erro: "Selecione um medicamento." };
    if (!doseNumerica) return { erro: "Indique uma dose total válida." };
    if (!quantidadeApresentacao) return { erro: "Selecione a apresentação disponível." };
    if (!via) return { erro: "Selecione o tipo de acesso venoso." };

    const base = {
      medicamento: ficha.nome,
      dose: doseNumerica,
      unidadeDose: ficha.unidadeDose,
      apresentacao: quantidadeApresentacao,
      numeroFrascos: Math.ceil(doseNumerica / quantidadeApresentacao),
      via
    };

    if (!perfilVia || perfilVia.estado !== "validado") {
      return { ...base, incompleto: true, mensagem: "Ainda não existe uma ficha clínica validada para esta via." };
    }

    const concentracaoHabitual = numeroPositivo(perfilVia.concentracaoHabitual);
    const concentracaoMaxima = numeroPositivo(perfilVia.concentracaoMaxima);
    if (!concentracaoHabitual || !concentracaoMaxima) {
      return { ...base, incompleto: true, mensagem: "A ficha ainda não tem concentrações habitual e máxima válidas." };
    }

    return {
      ...base,
      incompleto: false,
      diluentes: perfilVia.diluentes || [],
      habitual: { concentracao: concentracaoHabitual, volumeMl: doseNumerica / concentracaoHabitual },
      volumeMinimo: { concentracao: concentracaoMaxima, volumeMl: doseNumerica / concentracaoMaxima },
      unidadeConcentracao: perfilVia.unidadeConcentracao,
      tempoAdministracao: perfilVia.tempoAdministracao,
      observacoes: perfilVia.observacoes,
      efeitosAdversos: perfilVia.efeitosAdversos,
      fonte: perfilVia.fonte,
      validadoEm: perfilVia.validadoEm
    };
  }

  global.CompYPreparacaoSchema = Object.freeze({ calcularPreparacao });
})(window);
