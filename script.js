// =====================================
// 1. CARROSSEL
// =====================================
function ativarCarrossel(wrapper) {
    const produtos = wrapper.querySelector(".produtos");
    const setaDir = wrapper.querySelector(".seta-dir");
    const setaEsq = wrapper.querySelector(".seta-esq");

    if (setaDir) setaDir.addEventListener("click", () => { produtos.scrollLeft += 250; });
    if (setaEsq) setaEsq.addEventListener("click", () => { produtos.scrollLeft -= 250; });
}

document.querySelectorAll(".carrossel-wrapper").forEach(ativarCarrossel);


// =====================================
// 2. BANCO DE DADOS FAKE (LOCALSTORAGE)
// =====================================
const DB = {
    get(key) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    ensure(key) {
        if (!localStorage.getItem(key)) this.set(key, []);
    }
};

// garantir chaves iniciais
DB.ensure("favoritos");
DB.ensure("carrinho");


// =====================================
// 3. MODAIS PERSONALIZADOS
// =====================================

// abrir modal simples (titulo, html do texto)
function abrirModal(titulo, texto) {
    document.getElementById("tituloModal").innerText = titulo;
    document.getElementById("textoModal").innerHTML = texto;

    const modal = document.getElementById("meuModal");
    modal.style.display = "flex";

    const fecharEl = document.querySelector(".fechar");
    const botao = document.getElementById("botaoModal");

    if (fecharEl) fecharEl.onclick = () => modal.style.display = "none";
    if (botao) botao.onclick = () => modal.style.display = "none";

    modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
}

// MODAL DE CONFIRMAÇÃO (sim / não)
function abrirModalConfirmacao(texto, callbackSim) {
    document.getElementById("tituloModal").innerText = "Confirmação";
    document.getElementById("textoModal").innerHTML = texto;

    const modal = document.getElementById("meuModal");
    modal.style.display = "flex";

    const botao = document.getElementById("botaoModal");
    botao.innerText = "Sim";

    botao.onclick = () => {
        modal.style.display = "none";
        callbackSim();
        botao.innerText = "OK"; // reset
    };

    document.querySelector(".fechar").onclick = () => {
        modal.style.display = "none";
        botao.innerText = "OK";
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            botao.innerText = "OK";
        }
    };
}

// MODAL DE INPUT (substitui prompt)
function abrirModalInput(pergunta, callback) {
    const titulo = document.getElementById("tituloModal");
    const texto = document.getElementById("textoModal");
    const botao = document.getElementById("botaoModal");
    const modal = document.getElementById("meuModal");

    titulo.innerText = "Login";
    texto.innerHTML = `${pergunta}<br><br><input id="inputModal" style="padding:8px;width:80%;border-radius:8px;border:1px solid #aaa;">`;

    modal.style.display = "flex";

    botao.innerText = "Confirmar";
    botao.onclick = () => {
        const valor = document.getElementById("inputModal").value.trim();
        modal.style.display = "none";
        botao.innerText = "OK"; // reset
        callback(valor);
    };

    document.querySelector(".fechar").onclick = () => {
        modal.style.display = "none";
        botao.innerText = "OK";
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            botao.innerText = "OK";
        }
    };
}


// =====================================
// 4. FAVORITOS (corrigido e melhorado)
// =====================================
const favoritosBtn = document.querySelector(".icone-favoritos");

if (favoritosBtn) {
    favoritosBtn.addEventListener("click", () => {
        abrirFavoritos();
        animarBotao(favoritosBtn);
    });
}

// toggle (adiciona/remove)
function adicionarFavorito(produto) {
    let favoritos = DB.get("favoritos");
    const existe = favoritos.find(p => p.id === produto.id);

    if (existe) {
        favoritos = favoritos.filter(p => p.id !== produto.id);
    } else {
        favoritos.push(produto);
    }

    DB.set("favoritos", favoritos);
    return favoritos;
}

function removerFavorito(index) {
    let favoritos = DB.get("favoritos");
    // garantir int
    const i = parseInt(index, 10);
    if (isNaN(i) || i < 0 || i >= favoritos.length) return;
    favoritos.splice(i, 1);
    DB.set("favoritos", favoritos);
    abrirFavoritos(); // reabrir/atualizar
}

function abrirFavoritos() {
    const lista = DB.get("favoritos");

    // usa a mesma UI de lista (com botões Remover) para permitir interações
    abrirLista("⭐ Seus Favoritos", lista, removerFavorito);
}


// =====================================
// CARRINHO — ATUALIZADO COM REMOVER
// =====================================
const carrinhoBtn = document.querySelector(".icone-carrinho");

if (carrinhoBtn) {
    carrinhoBtn.addEventListener("click", () => {
        abrirCarrinho();
        animarBotao(carrinhoBtn);
    });
}

function adicionarAoCarrinho(produto) {
    let carrinho = DB.get("carrinho");
    carrinho.push(produto);
    DB.set("carrinho", carrinho);
}

function removerDoCarrinho(index) {
    let carrinho = DB.get("carrinho");
    const i = parseInt(index, 10);
    if (isNaN(i) || i < 0 || i >= carrinho.length) return;
    carrinho.splice(i, 1);
    DB.set("carrinho", carrinho);
    abrirCarrinho(); // atualizar lista automaticamente
}

function abrirCarrinho() {
    const lista = DB.get("carrinho");
    abrirLista("🛒 Seu Carrinho", lista, removerDoCarrinho);
}


// =====================================
// 6. LOGIN FAKE
// =====================================
const usuarioBtn = document.querySelector(".icone-usuario");

if (usuarioBtn) {
    usuarioBtn.addEventListener("click", () => {
        animarBotao(usuarioBtn);
        abrirLogin();
    });
}

function abrirLogin() {
    const usuarioLogado = localStorage.getItem("usuario");

    if (usuarioLogado) {
        abrirModalConfirmacao(
            `Você já está logado como ${usuarioLogado}. Deseja sair?`,
            () => {
                localStorage.removeItem("usuario");
                abrirModal("Logout", "Você saiu da conta.");
            }
        );
        return;
    }

    abrirModalInput("Digite seu nome:", (nome) => {
        if (!nome) return;
        localStorage.setItem("usuario", nome);
        abrirModal("Bem-vindo(a)!", "Login realizado com sucesso.");
    });
}


// =====================================
// 7. ANIMAÇÃO DE BOTÕES
// =====================================
function animarBotao(btn) {
    btn.style.transform = "scale(0.85)";
    btn.style.transition = "0.15s";

    setTimeout(() => {
        btn.style.transform = "scale(1)";
    }, 150);
}


// =====================================
// =====================================
// 8. INTERAÇÃO COM PRODUTOS
// =====================================
document.querySelectorAll(".produtos img").forEach((img, index) => {

    // construir objeto produto dinamicamente
    function produtoFromImg() {
        return {
            id: index + "-" + img.src,
            nome: img.alt || "Produto",
            imagem: img.src
        };
    }

    // CLICK → ADICIONAR AO CARRINHO (Ação Direta)
    img.addEventListener("click", () => {
        const produto = produtoFromImg();

        // **MUDANÇA AQUI:** Ação direta, sem modal de Confirmação
        adicionarAoCarrinho(produto);

        // Abre o modal de Sucesso
        abrirModal("Sucesso", `Produto "<b>${produto.nome}</b>" adicionado ao carrinho!`);

        // Opcional: Adicionar uma animação ou temporizador para fechar o modal
        // setTimeout(() => {
        //     document.getElementById("meuModal").style.display = "none";
        // }, 1500);
    });

    // BOTÃO DIREITO → FAVORITO (desktop)
    img.addEventListener("contextmenu", (e) => {
        e.preventDefault();

        const produto = produtoFromImg();
        adicionarFavorito(produto);

        // Abre o modal de Sucesso
        abrirModal("⭐ Favoritos", `Produto "<b>${produto.nome}</b>" adicionado aos favoritos!`);
    });

    // toability mobile: adicionar um toque longo também adiciona ao favoritos
    let touchStart = 0;
    img.addEventListener("touchstart", () => { touchStart = Date.now(); });
    img.addEventListener("touchend", (e) => {
        const dur = Date.now() - touchStart;
        // se toque > 600ms consideramos "long-press" para favoritar
        if (dur > 600) {
            e.preventDefault();
            const produto = produtoFromImg();
            adicionarFavorito(produto);
            // Abre o modal de Sucesso
            abrirModal("⭐ Favoritos", `Produto "<b>${produto.nome}</b>" adicionado aos favoritos!`);
        }
    });
});