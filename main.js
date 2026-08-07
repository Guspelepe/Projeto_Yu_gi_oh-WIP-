// main.js

console.log('🚀 main.js carregado!');

import { buscarCartas } from './api/yugioh.js';
import { CardList } from './components/CardList.js';
import { Modal } from './components/Modal.js';
import { Favorites } from './components/Favorites.js';
import { DeckListUI } from './components/DeckListUI.js';
import { isFavorito } from './utils/storage.js';

// ===== ELEMENTOS DO DOM =====
const container = document.getElementById('lista-cartas');
const btnAnterior = document.getElementById('btn-anterior');
const btnProximo = document.getElementById('btn-proximo');
const contadorPagina = document.getElementById('contador-pagina');

if (!container) console.error('❌ Container #lista-cartas não encontrado!');

// ===== CONFIGURAÇÕES =====
const ITENS_POR_PAGINA = 20;
let paginaAtual = 0;
let totalPaginas = 0;
let termoBuscaAtual = '';
let atributoFiltroAtual = '';

// ===== CACHE GLOBAL DE CARTAS =====
let cacheCartas = []; // Armazena todas as cartas já carregadas (evita perda de favoritos)

function adicionarAoCache(cartas) {
  cartas.forEach(carta => {
    if (!cacheCartas.find(c => c.id === carta.id)) {
      cacheCartas.push(carta);
    }
  });
}

// ===== MODAL =====
const modal = new Modal();
function abrirModal(carta) {
  modal.abrir(carta);
}

// ===== LISTA DE CARTAS (sem paginação local) =====
const cardList = new CardList(container, abrirModal);

// ===== FUNÇÃO PARA CARREGAR DA API =====
async function carregarCartas(params = {}, offset = 0) {
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

    // Adiciona as cartas ao cache global
    adicionarAoCache(cartas);

    // Calcula total de páginas
    totalPaginas = Math.ceil(total / ITENS_POR_PAGINA);
    const paginaAtual = Math.floor(offset / ITENS_POR_PAGINA) + 1;

    // Atualiza o CardList com as cartas da página e o total de páginas
    cardList.setCartas(cartas, totalPaginas);
    cardList.paginaAtual = paginaAtual - 1;

    contadorPagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`;

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

// ===== EVENTOS DA BARRA DE PESQUISA =====
document.getElementById('btn-buscar').addEventListener('click', realizarBusca);
document.getElementById('input-nome').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') realizarBusca();
});
document.getElementById('filtro-atributo').addEventListener('change', realizarBusca);

// ===== PAGINAÇÃO (CHAMA A API COM OFFSET) =====
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
document.getElementById('btn-favoritos').addEventListener('click', () => {
  // Filtra todos os favoritos do cache global
  const favoritos = cacheCartas.filter(carta => isFavorito(carta.id));
  if (favoritos.length === 0) {
    container.innerHTML = '<p class="sem-resultados">Nenhuma carta favoritada.</p>';
    return;
  }
  // Exibe todos os favoritos (sem paginação, apenas uma página)
  cardList.setCartas(favoritos, 1);
  contadorPagina.textContent = 'Favoritos';
});

document.getElementById('btn-todos').addEventListener('click', () => {
  // Volta para a busca atual
  realizarBusca();
});

// ===== DECKS =====
let deckListUI = null;

document.getElementById('btn-decks').addEventListener('click', () => {
  if (!deckListUI) {
    deckListUI = new DeckListUI(container, abrirModal);
  }
  deckListUI.renderizarLista();
});

// ===== EVENTO PARA ATUALIZAR A VIEW DE DECKS (se aberta) =====
document.addEventListener('deckAtualizado', () => {
  // Se a lista de decks estiver visível, re-renderiza
  if (deckListUI && container.querySelector('.deck-lista')) {
    deckListUI.renderizarLista();
  }
});

// ===== EVENTO PARA ATUALIZAR A LISTA QUANDO FAVORITO MUDA =====
document.addEventListener('favoritoAtualizado', () => {
  // Se a lista atual for a de favoritos, re-renderiza
  if (container.querySelector('.sem-resultados')?.textContent === 'Nenhuma carta favoritada.') {
    // Se não houver favoritos, a mensagem já está lá
  }
  // Se estiver na view de favoritos, podemos re-renderizar chamando o botão de favoritos novamente?
  // Melhor: verificar se o contador mostra "Favoritos"
  if (contadorPagina.textContent === 'Favoritos') {
    document.getElementById('btn-favoritos').click();
  }
});

// ===== CARREGAMENTO INICIAL =====
document.getElementById('input-nome').value = 'Blue-Eyes';
realizarBusca();

// ===== ESCUTA EVENTO DE PÁGINA ATUALIZADA (do CardList) =====
document.addEventListener('paginaAtualizada', (e) => {
  const { pagina, total } = e.detail;
  // Se não estiver na view de favoritos ou decks, atualiza o contador
  if (contadorPagina.textContent !== 'Favoritos') {
    contadorPagina.textContent = `Página ${pagina} de ${total}`;
  }
});