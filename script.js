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

lista.addEventListener("click", event => {
    const botao = event.target.closest("button");
    if (!botao) return;

    if (botao.classList.contains("btn-qty")) {
        const index = Number(botao.dataset.index);
        const delta = Number(botao.dataset.delta);
        alterarQuantidade(index, delta);
        return;
    }

    if (botao.classList.contains("btn-remover")) {
        const index = Number(botao.dataset.index);
        remover(index);
    }
});

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
                    <button type="button" class="btn-qty" data-index="${index}" data-delta="-1">-</button>
                    <span>${produto.qtd}</span>
                    <button type="button" class="btn-qty" data-index="${index}" data-delta="1">+</button>
                </div>
                <button type="button" class="btn-remover" data-index="${index}">Remover</button>
            </div>
        `;

        lista.appendChild(div);
    });

    document.getElementById("subtotal").innerText = total.toFixed(2);
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

// LIDAR COM MUDANÇA DE FORMA DE PAGAMENTO
document.getElementById("pagamentoPedido").addEventListener("change", function() {
    const parcelasDiv = document.getElementById("parcelasDiv");
    if (this.value === "Cartao Credito") {
        parcelasDiv.style.display = "block";
    } else {
        parcelasDiv.style.display = "none";
    }
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

    // Capturar dados do formulário
    const nome = document.getElementById("nomeCliente").value.trim();
    const telefone = document.getElementById("telefonePedido").value.trim();
    const ruaNumero = document.getElementById("ruaNumero").value.trim();
    const bairro = document.getElementById("bairroPedido").value.trim();
    const cidade = document.getElementById("cidadePedido").value.trim();
    const estado = document.getElementById("estadoPedido").value.trim();
    const pagamento = document.getElementById("pagamentoPedido").value;
    const parcelas = document.getElementById("parcelasPagamento").value;

    // Validar campos
    if (!nome) {
        alert("Por favor, preencha seu nome.");
        return;
    }
    if (!telefone) {
        alert("Por favor, preencha seu telefone.");
        return;
    }
    if (!ruaNumero || !bairro || !cidade || !estado) {
        alert("Por favor, preencha o endereço completo de entrega.");
        return;
    }
    if (!pagamento) {
        alert("Por favor, selecione uma forma de pagamento.");
        return;
    }

    const endereco = `${ruaNumero}, ${bairro}, ${cidade} - ${estado}`;

    // Construir mensagem formal
    let mensagem = "PEDIDO V&D COSMETICOS\n";
    mensagem += "==================\n\n";
    mensagem += "CLIENTE: " + nome + "\n";
    mensagem += "TELEFONE: " + telefone + "\n\n";
    
    mensagem += "ITENS DO PEDIDO:\n";
    mensagem += "---\n";

    let subtotal = 0;
    carrinho.forEach((item, index) => {
        const subtotalItem = item.preco * item.qtd;
        subtotal += subtotalItem;
        mensagem += `${index + 1}. ${item.nome}\n`;
        mensagem += `   Quantidade: ${item.qtd}x\n`;
        mensagem += `   Valor: R$ ${item.preco.toFixed(2)}\n`;
        mensagem += `   Subtotal: R$ ${subtotalItem.toFixed(2)}\n\n`;
    });

    mensagem += "---\n";
    mensagem += `Subtotal: R$ ${subtotal.toFixed(2)}\n`;
    mensagem += `VALOR TOTAL: R$ ${subtotal.toFixed(2)}\n\n`;
    
    mensagem += "ENDERECO DE ENTREGA:\n";
    mensagem += endereco + "\n\n";
    
    mensagem += "FORMA DE PAGAMENTO:\n";
    mensagem += pagamento + "\n";
    
    if (pagamento === "Cartao Credito") {
        mensagem += `Parcelas: ${parcelas}\n`;
    }
    
    mensagem += "\n==================\n";
    mensagem += "Favor confirmar e informar o prazo de entrega.";

    const urlCodificada = encodeURIComponent(mensagem);
    window.open(`https://wa.me/5585981963794?text=${urlCodificada}`);
});

// INICIAR
atualizarCarrinho();