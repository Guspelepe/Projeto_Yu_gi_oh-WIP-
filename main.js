// main.js

console.log('🚀 main.js carregado!');

import { buscarCartas } from './api/yugioh.js';
import { CardList } from './components/CardList.js';
import { Modal } from './components/Modal.js';
import { Favorites } from './components/Favorites.js';

// ===== ELEMENTOS =====
const container = document.getElementById('lista-cartas');
const btnAnterior = document.getElementById('btn-anterior');
const btnProximo = document.getElementById('btn-proximo');
const contadorPagina = document.getElementById('contador-pagina');

if (!container) console.error('❌ Container não encontrado!');

// ===== CONFIGURAÇÕES =====
const ITENS_POR_PAGINA = 20;
let paginaAtual = 0;
let totalPaginas = 0;
let termoBuscaAtual = '';
let atributoFiltroAtual = '';

// ===== MODAL =====
const modal = new Modal();
function abrirModal(carta) {
  modal.abrir(carta);
}

// ===== LISTA DE CARTAS (local) =====
const cardList = new CardList(container, abrirModal, ITENS_POR_PAGINA);

// ===== FUNÇÃO PARA CARREGAR DA API =====
async function carregarCartas(params = {}, offset = 0) {
  // Mostra loading
  container.innerHTML = '<div class="loading">⏳ Carregando...</div>';

  try {
    const resultado = await buscarCartas(params, offset, ITENS_POR_PAGINA);
    const { data: cartas, total } = resultado;

    console.log(`✅ Recebidas ${cartas.length} cartas, total ${total}`);

    if (cartas.length === 0) {
      container.innerHTML = '<p class="sem-resultados">Nenhuma carta encontrada.</p>';
      totalPaginas = 0;
      contadorPagina.textContent = 'Página 0 de 0';
      return;
    }

    // Atualiza a lista local
    cardList.cartas = cartas;
    cardList.totalPaginas = Math.ceil(total / ITENS_POR_PAGINA);
    cardList.paginaAtual = Math.floor(offset / ITENS_POR_PAGINA);
    cardList.renderizar();

    // Atualiza contador
    totalPaginas = cardList.totalPaginas;
    contadorPagina.textContent = `Página ${cardList.paginaAtual + 1} de ${totalPaginas}`;

  } catch (error) {
    console.error('❌ Erro:', error);
    container.innerHTML = `<p class="erro">Erro ao carregar: ${error.message}</p>`;
  }
}

// ===== FUNÇÃO DE BUSCA =====
function realizarBusca() {
  const nome = document.getElementById('input-nome').value.trim();
  const atributo = document.getElementById('filtro-atributo').value;

  termoBuscaAtual = nome;
  atributoFiltroAtual = atributo;

  const params = {};
  if (nome) params.name = nome;
  if (atributo) params.attribute = atributo;

  paginaAtual = 0;
  carregarCartas(params, 0);
}

// ===== EVENTOS =====
document.getElementById('btn-buscar').addEventListener('click', realizarBusca);
document.getElementById('input-nome').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') realizarBusca();
});
document.getElementById('filtro-atributo').addEventListener('change', realizarBusca);

// Paginação (chama a API com offset)
btnProximo.addEventListener('click', () => {
  if (paginaAtual >= totalPaginas - 1) return;
  paginaAtual++;
  const offset = paginaAtual * ITENS_POR_PAGINA;
  const params = {};
  if (termoBuscaAtual) params.name = termoBuscaAtual;
  if (atributoFiltroAtual) params.attribute = atributoFiltroAtual;
  carregarCartas(params, offset);
});

btnAnterior.addEventListener('click', () => {
  if (paginaAtual <= 0) return;
  paginaAtual--;
  const offset = paginaAtual * ITENS_POR_PAGINA;
  const params = {};
  if (termoBuscaAtual) params.name = termoBuscaAtual;
  if (atributoFiltroAtual) params.attribute = atributoFiltroAtual;
  carregarCartas(params, offset);
});

// ===== FAVORITOS =====
const favoritesManager = new Favorites(container, abrirModal);

document.getElementById('btn-favoritos').addEventListener('click', () => {
  // Para favoritos, usamos a lista local (todas as cartas já carregadas)
  // Mas precisamos das cartas atuais. Vamos pegar do cardList.
  const cartasAtuais = cardList.cartas;
  if (!cartasAtuais || cartasAtuais.length === 0) {
    container.innerHTML = '<p class="sem-resultados">Carregue algumas cartas primeiro.</p>';
    return;
  }
  favoritesManager.renderizar(cartasAtuais, cardList);
});

document.getElementById('btn-todos').addEventListener('click', () => {
  // Recarrega a busca atual
  realizarBusca();
});

// ===== CARREGAMENTO INICIAL =====
realizarBusca(); // já chama com os valores padrão (nome vazio, atributo vazio)
// Mas podemos definir um padrão: buscar "Blue-Eyes" automaticamente
// Para fazer isso, podemos definir o valor do input e chamar realizarBusca
document.getElementById('input-nome').value = 'Blue-Eyes';
realizarBusca();

// ===== ESCUTA EVENTO DE PÁGINA ATUALIZADA (do CardList) =====
document.addEventListener('paginaAtualizada', (e) => {
  const { pagina, total } = e.detail;
  // Atualiza o contador (já fazemos na função carregarCartas, mas por segurança)
  contadorPagina.textContent = `Página ${pagina} de ${total}`;
});