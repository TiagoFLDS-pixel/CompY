(function carregarDadosPreparacao(global) {
  "use strict";

  // A base começa apenas com a apresentação informada pelo utilizador.
  // Não existem recomendações clínicas publicadas até à validação das fichas.
  global.COMPY_PREPARACOES = Object.freeze([
    {
      id: "anfotericina_b",
      nome: "Anfotericina B",
      unidadeDose: "mg",
      apresentacoes: [
        { quantidade: 50, unidade: "mg", forma: "Frasco" }
      ],
      vias: {}
    }
  ]);
})(window);
