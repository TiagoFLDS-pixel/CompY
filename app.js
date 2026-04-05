// ===== Inicialização =====
document.addEventListener("DOMContentLoaded", () => {
  preencherSelects();

  document
    .getElementById("btn-verificar")
    .addEventListener("click", verificarCompatibilidades);
});
