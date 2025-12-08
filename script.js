// script.js
function ativarCarrossel(wrapper) {
    const produtos = wrapper.querySelector(".produtos");
    const setaDir = wrapper.querySelector(".seta-dir");
    const setaEsq = wrapper.querySelector(".seta-esq");

    setaDir.addEventListener("click", () => {
        produtos.scrollLeft += 250;
    });

    setaEsq.addEventListener("click", () => {
        produtos.scrollLeft -= 250;
    });
}

document.querySelectorAll(".carrossel-wrapper").forEach(ativarCarrossel);