// MENU HAMBURGUER
const toggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");

toggle.addEventListener("click", () => {
    navbar.classList.toggle("active");
});


// FECHAR MENU AO CLICAR
document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("active");
    });
});


// HEADER DINÂMICO AO ROLAR
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.style.background = "rgba(80, 15, 35, 1)";
        header.style.boxShadow = "0 4px 25px rgba(0,0,0,0.3)";
    } else {
        header.style.background = "rgba(106, 27, 49, 0.95)";
        header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
    }
});
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const lista = document.getElementById("listaCarrinho");
const totalEl = document.getElementById("total");
const contador = document.getElementById("contador");
const carrinhoVazio = document.getElementById("carrinhoVazio");

const abrir = document.getElementById("abrirCarrinho");
const fechar = document.getElementById("fecharCarrinho");
const limparCarrinhoBtn = document.getElementById("limparCarrinho");
const carrinhoBox = document.getElementById("carrinho");

abrir.onclick = () => carrinhoBox.classList.add("ativo");
fechar.onclick = () => carrinhoBox.classList.remove("ativo");

// ADICIONAR PRODUTO
const botoesAdd = document.querySelectorAll(".btn-add");
botoesAdd.forEach(btn => {
    btn.addEventListener("click", () => {
        const nome = btn.dataset.nome;
        const preco = parseFloat(btn.dataset.preco);

        const itemExistente = carrinho.find(p => p.nome === nome);

        if (itemExistente) {
            itemExistente.qtd += 1;
        } else {
            carrinho.push({ nome, preco, qtd: 1 });
        }

        salvar();
        atualizarCarrinho();
    });
});

// ATUALIZAR CARRINHO
function atualizarCarrinho() {
    lista.innerHTML = "";

    let total = 0;
    let totalItens = 0;

    if (carrinho.length === 0) {
        carrinhoVazio.style.display = "block";
    } else {
        carrinhoVazio.style.display = "none";
    }

    carrinho.forEach((produto, index) => {
        total += produto.preco * produto.qtd;
        totalItens += produto.qtd;

        const div = document.createElement("div");
        div.classList.add("item");

        div.innerHTML = `
            <div class="item-info">
                <p>${produto.nome}</p>
                <span>${produto.qtd}x • R$ ${produto.preco.toFixed(2)} cada</span>
                <span class="item-subtotal">Subtotal: R$ ${(produto.preco * produto.qtd).toFixed(2)}</span>
            </div>
            <div class="item-controles">
                <div class="quantidade">
                    <button onclick="alterarQuantidade(${index}, -1)">-</button>
                    <span>${produto.qtd}</span>
                    <button onclick="alterarQuantidade(${index}, 1)">+</button>
                </div>
                <button class="btn-remover" onclick="remover(${index})">Remover</button>
            </div>
        `;

        lista.appendChild(div);
    });

    totalEl.innerText = total.toFixed(2);
    contador.innerText = totalItens;
}

// ALTERAR QUANTIDADE
function alterarQuantidade(index, delta) {
    const item = carrinho[index];
    if (!item) return;

    item.qtd += delta;
    if (item.qtd <= 0) {
        carrinho.splice(index, 1);
    }

    salvar();
    atualizarCarrinho();
}

// REMOVER ITEM
function remover(index) {
    carrinho.splice(index, 1);
    salvar();
    atualizarCarrinho();
}

// LIMPAR CARRINHO
limparCarrinhoBtn.addEventListener("click", () => {
    carrinho = [];
    salvar();
    atualizarCarrinho();
});

// SALVAR
function salvar() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// FINALIZAR WHATSAPP
document.getElementById("finalizarPedido").addEventListener("click", () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.");
        return;
    }

    let mensagem = "🛍️ *Pedido V&D Cosméticos*%0A%0A";

    carrinho.forEach(item => {
        mensagem += `- ${item.nome} (${item.qtd}x) - R$ ${item.preco.toFixed(2)}%0A`;
    });

    mensagem += `%0ATotal: R$ ${totalEl.innerText}`;

    window.open(`https://wa.me/5511999999999?text=${mensagem}`);
});

// INICIAR
atualizarCarrinho();