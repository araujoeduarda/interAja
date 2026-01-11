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
// 3. MODAIS PERSONALIZADOS (CORRIGIDO E OTIMIZADO)
// =====================================

// Função centralizada para resetar o modal
function fecharEresetarModal() {
    const modal = document.getElementById("meuModal");
    const botao = document.getElementById("botaoModal");
    
    if (modal) modal.style.display = "none";
    if (botao) {
        botao.innerText = "OK";
        botao.style.display = 'block'; // Garante que o botão padrão volte a aparecer
    }
}

// abrir modal simples (titulo, html do texto)
function abrirModal(titulo, texto) {
    document.getElementById("tituloModal").innerText = titulo;
    document.getElementById("textoModal").innerHTML = texto;

    const modal = document.getElementById("meuModal");
    modal.style.display = "flex";

    const fecharEl = document.querySelector(".fechar");
    const botao = document.getElementById("botaoModal");

    // Garante que o botão seja "OK"
    if (botao) botao.innerText = "OK";

    if (fecharEl) fecharEl.onclick = fecharEresetarModal;
    if (botao) botao.onclick = fecharEresetarModal;

    modal.onclick = (e) => { if (e.target === modal) fecharEresetarModal(); };
}

// MODAL DE CONFIRMAÇÃO (sim / não)
function abrirModalConfirmacao(texto, callbackSim) {
    document.getElementById("tituloModal").innerText = "Confirmação";
    document.getElementById("textoModal").innerHTML = texto;

    const modal = document.getElementById("meuModal");
    modal.style.display = "flex";

    const botao = document.getElementById("botaoModal");
    botao.innerText = "Sim"; // Mudar o texto do botão para "Sim"

    // Ação Sim: executa callback e reseta
    botao.onclick = () => {
        fecharEresetarModal(); // Fecha e reseta para 'OK'
        callbackSim();
    };

    // Fechar pelo X ou clique externo: apenas fecha e reseta
    document.querySelector(".fechar").onclick = fecharEresetarModal;
    modal.onclick = (e) => {
        if (e.target === modal) fecharEresetarModal();
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

    botao.innerText = "Confirmar"; // Mudar o texto do botão

    // Ação Confirmar: executa callback e reseta
    botao.onclick = () => {
        const valor = document.getElementById("inputModal").value.trim();
        fecharEresetarModal(); // Fecha e reseta para 'OK'
        callback(valor);
    };

    // Fechar pelo X ou clique externo: apenas fecha e reseta
    document.querySelector(".fechar").onclick = fecharEresetarModal;

    modal.onclick = (e) => {
        if (e.target === modal) fecharEresetarModal();
    };
}


// NOVO: MODAL DE ESCOLHA DE AÇÃO (MOBILE OPTIMIZED)
function abrirModalAcoesProduto(produto) {
    const titulo = document.getElementById("tituloModal");
    const texto = document.getElementById("textoModal");
    const botaoPadrao = document.getElementById("botaoModal");
    const modal = document.getElementById("meuModal");

    // 1. Configurar o modal
    titulo.innerText = produto.nome;
    texto.innerHTML = `<p>O que deseja fazer com "<b>${produto.nome}</b>"?</p>
        <div id="botoesAcaoProduto" style="display:flex; justify-content:space-around; margin-top: 20px;">
            <button id="btnAcaoCarrinho" style="padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; flex-grow: 1; margin-right: 5px;">🛒 Adicionar ao Carrinho</button>
            <button id="btnAcaoFavoritar" style="padding: 10px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; flex-grow: 1; margin-left: 5px;">⭐ Favoritar</button>
        </div>`;
    
    // 2. Mostrar modal
    modal.style.display = "flex";
    
    // 3. Ocultar o botão padrão "OK"
    if (botaoPadrao) botaoPadrao.style.display = 'none';

    // Função de reset especial (garante que o botão padrão volta a aparecer)
    const resetEshowBotaoPadrao = () => {
        if (modal) modal.style.display = "none";
        if (botaoPadrao) {
             botaoPadrao.innerText = "OK";
             botaoPadrao.style.display = 'block'; 
        }
    };
    
    // 4. Adicionar listeners aos novos botões
    // Ação Carrinho
    document.getElementById("btnAcaoCarrinho").onclick = () => {
        adicionarAoCarrinho(produto);
        resetEshowBotaoPadrao(); 
        abrirModal("Sucesso", "Produto adicionado ao carrinho!"); 
    };

    // Ação Favoritar
    document.getElementById("btnAcaoFavoritar").onclick = () => {
        adicionarFavorito(produto);
        resetEshowBotaoPadrao();
        abrirModal("⭐ Favoritos", "Produto adicionado aos favoritos!"); 
    };
    
    // 5. Configurar fechamento (X e clique externo)
    const fecharEl = document.querySelector(".fechar");
    if (fecharEl) fecharEl.onclick = resetEshowBotaoPadrao;

    modal.onclick = (e) => { 
        if (e.target === modal) resetEshowBotaoPadrao(); 
    };
}


// =====================================
// 4. FAVORITOS (toggle e listagem)
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
        // ... (lógica de remoção)
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
// 5. CARRINHO (com remover)
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
// 8. INTERAÇÃO COM PRODUTOS (NOVO FLUXO MOBILE)
// =====================================
document.querySelectorAll(".produtos img").forEach((img, index) => {
    img.addEventListener("click", () => {

        // preço fake (depois dá pra puxar de banco)
        const preco = "89.90";

        const nome = encodeURIComponent(img.alt);
        const imagem = encodeURIComponent(img.src);

        window.location.href =
            `produto.html?nome=${nome}&imagem=${imagem}&preco=${preco}`;
    });
});




// =====================================
// MODAL DE LISTAGEM (CARRINHO / FAVORITOS)
// =====================================
function abrirLista(titulo, lista, callbackRemover) {
    const modal = document.getElementById("meuModal");

    document.getElementById("tituloModal").innerText = titulo;

    // Se estiver vazio
    if (!lista || lista.length === 0) {
        document.getElementById("textoModal").innerHTML = "<p>Nada aqui ainda.</p>";
    } else {
document.getElementById("textoModal").innerHTML =
    lista.map((item, i) => `
        <div class="item-lista" style="display:flex; gap:12px; align-items:flex-start;">
            <img src="${item.imagem}" alt="${item.nome}" style="width:70px; border-radius:10px;">

            <div style="flex:1;">
                <strong>${item.nome}</strong>
                <p style="margin:4px 0;">R$ ${item.preco}</p>
                <p style="font-size:14px; color:#555;">
                    Tamanho: <b>${item.tamanho || "-"}</b><br>
                    Tecido: <b>${item.tecido || "-"}</b><br>
                    Cor: <b>${item.cor || "-"}</b>
                </p>
            </div>

            <button class="btn-remover" data-index="${i}">✖</button>
        </div>
    `).join("");

    }

    modal.style.display = "flex";

    // Fechar modal
    const fecharEl = document.querySelector(".fechar");
    if (fecharEl) fecharEl.onclick = fecharEresetarModal;
    
    // Garante que o botão seja "OK" e feche o modal
    const botao = document.getElementById("botaoModal");
    if (botao) {
        botao.innerText = "OK"; 
        botao.onclick = fecharEresetarModal;
        botao.style.display = 'block'; // Garante que esteja visível
    }

    modal.onclick = (e) => {
        if (e.target === modal) fecharEresetarModal();
    };

    // Remover itens - precisamos adicionar listeners depois do conteúdo estar no DOM
    document.querySelectorAll(".btn-remover").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            callbackRemover(index);
        });
    });
}

