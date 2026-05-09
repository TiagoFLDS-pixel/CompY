(function () {
  function instalarEstilosSemDados() {
    if (document.getElementById("compy-sem-dados-ui")) return;

    const style = document.createElement("style");
    style.id = "compy-sem-dados-ui";
    style.textContent = `
      .status-desconhecido {
        background: #F1F5F9;
        border: 1px solid #CBD5E1;
        border-left: 5px solid #64748B;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(15, 23, 42, 0.06);
        color: #1E293B;
      }

      .resultado-badge {
        display: inline-block;
        margin-left: 8px;
        margin-bottom: 6px;
        padding: 3px 8px;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1.2;
      }

      .resultado-badge-sem-dados {
        background: #475569;
        color: #FFFFFF;
      }
    `;

    document.head.appendChild(style);
  }

  function melhorarBlocoSemDados(bloco) {
    const texto = bloco.textContent || "";

    if (!texto.includes("Sem dados de compatibilidade registados")) return;

    if (!bloco.querySelector(".resultado-badge-sem-dados")) {
      const badge = document.createElement("span");
      badge.classList.add("resultado-badge", "resultado-badge-sem-dados");
      badge.textContent = "Sem dados registados";

      const titulo = bloco.querySelector("strong");
      if (titulo) {
        titulo.insertAdjacentElement("afterend", badge);
      } else {
        bloco.insertAdjacentElement("afterbegin", badge);
      }
    }

    bloco.querySelectorAll(".resultado-fonte").forEach(fonte => {
      if (fonte.textContent.trim() === "Fonte: Supabase") {
        fonte.textContent = "Fonte consultada: Supabase | Sem registo para este par";
      }
    });
  }

  function observarResultados() {
    const resultado = document.getElementById("resultado");
    if (!resultado) return;

    const melhorar = () => {
      resultado.querySelectorAll(".status-desconhecido").forEach(melhorarBlocoSemDados);
    };

    melhorar();

    const observer = new MutationObserver(melhorar);
    observer.observe(resultado, { childList: true, subtree: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    instalarEstilosSemDados();
    observarResultados();
  });
})();
