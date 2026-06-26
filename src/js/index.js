//OBJETIVO 1:quando clicar na seta de avançar passar para a proxima carta

//passo 1:pegar o elemento HTML da seta de avançar
const btnAvancar = document.getElementById("btn-avancar");
const cartoes = document.querySelectorAll(".cartao");
let cartaoAtual = 0;

cartoes.forEach(cartao => {(
cartao.addEventListener("click",function {
const cartaVirada = cartao.querySelector(".carta-virada");

cartao.classList.toggle("virar");

cartaVirada.classList.toggle("mostrar-fundo-carta");

const descricao = cartao.querySelector("descricao");
descricao.classList.toggle("esconder");

}
});

//passo 2:dar um jeito de identificar o clique na seta de avançar
btnAvancar.addEventListener("click", function () {
    if(cartaoAtual === cartoes.length - 1) return;

//passo 4:buscar a carta selecionado e esconder ela
const cartaoSelecionado = document.querySelector(".selecionado");
cartaoSelecionado.classList.remove("selecionado");

//passo 3:fazer aparecer a proxima carta
cartaoAtual++;
cartoes[cartaoAtual].classList.add("selecionado");

});




//OBJETIVO 2:quando clicar na seta de voltar,ir para a carta anterior

//passo 1:pegar o elemento HTML da seta voltar
const btnVoltar = document.getElementById("btn-voltar");
const cartas = document.querySelectorAll(".cartao");
let cartaAtual = 0;

//passo 2:dar um jeito de identificar o clique na seta de voltar
btnVoltar.addEventListener("click", function () {
    if(cartaoAtual === 0) return;

//passo 4:buscar a carta selecionado e esconder ela
    esconderCartaoSelecionado();

//passo 3:fazer aparecer a carta anterior
cartaoAtual--;
    mostrarCarta(cartaoAtual);

});

function mostrarCarta() {
    cartoes[cartaoAtual].classList.add("selecionado");
}

function esconderCartaoSelecionado() {
    const cartaoSelecionado = document.querySelector(".selecionado");
    cartaoSelecionado.classList.remove("selecionado");
}