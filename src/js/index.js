// OBJETIVO 1: quando clicar na seta de avançar passar para a próxima carta
const btnAvancar = document.getElementById("btn-avancar");
const cartoes = document.querySelectorAll(".cartao");
let cartaoAtual = 0;

// Evento de clique para virar as cartas
cartoes.forEach(cartao => {
    cartao.addEventListener("click", function() {
        const cartaVirada = cartao.querySelector(".carta-virada");
        cartao.classList.toggle("virar");
        cartaVirada.classList.toggle("mostrar-fundo-carta");
        
        const descricao = cartao.querySelector(".descricao");
        descricao.classList.toggle("esconder");
    });
});

// Botão avançar
btnAvancar.addEventListener("click", function() {
    if (cartaoAtual === cartoes.length - 1) return;
    
    // Esconder carta selecionada
    const cartaoSelecionado = document.querySelector(".selecionado");
    cartaoSelecionado.classList.remove("selecionado");
    
    // Mostrar próxima carta
    cartaoAtual++;
    cartoes[cartaoAtual].classList.add("selecionado");
});

// OBJETIVO 2: quando clicar na seta de voltar, ir para a carta anterior
const btnVoltar = document.getElementById("btn-voltar");

// Funções auxiliares
function mostrarCarta(indice) {
    cartoes[indice].classList.add("selecionado");
}

function esconderCartaoSelecionado() {
    const cartaoSelecionado = document.querySelector(".selecionado");
    if (cartaoSelecionado) {
        cartaoSelecionado.classList.remove("selecionado");
    }
}

// Botão voltar
btnVoltar.addEventListener("click", function() {
    if (cartaoAtual === 0) return;
    
    esconderCartaoSelecionado();
    cartaoAtual--;
    mostrarCarta(cartaoAtual);
});

// Evento de clique para virar as cartas
cartoes.forEach(cartao => {
    cartao.addEventListener("click", function() {
        // CORRIGIDO: use "cartao-virar" em vez de "virar"
        this.classList.toggle("cartao-virar");
        
        const cartaVirada = this.querySelector(".carta-virada");
        if (cartaVirada) {
            cartaVirada.classList.toggle("mostrar-fundo-carta");
        }
        
        const descricao = this.querySelector(".descricao");
        if (descricao) {
            descricao.classList.toggle("esconder");
        }
    });
});