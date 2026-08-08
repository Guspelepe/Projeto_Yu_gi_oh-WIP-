// main.js

console.log('🚀 main.js carregado!');

import { buscarCartas } from './api/yugioh.js';
import { CardList } from './components/CardList.js';
import { Modal } from './components/Modal.js';
import { Favorites } from './components/Favorites.js';
import { DeckListUI } from './components/DeckListUI.js';
import { isFavorito } from './utils/storage.js';

// ===== ELEMENTOS =====
const container = document.getElementById('lista-cartas');
const btnAnterior = document.getElementById('btn-anterior');
const btnProximo = document.getElementById('btn-proximo');
const contadorPagina = document.getElementById('contador-pagina');

// ===== FILTROS =====
const inputNome = document.getElementById('input-nome');
const selectAtributo = document.getElementById('filtro-atributo');
const selectTipo = document.getElementById('filtro-tipo');
const selectNivel = document.getElementById('filtro-nivel');
const btnLimpar = document.getElementById('btn-limpar-filtros');

// ===== CONFIGURAÇÕES =====
const ITENS_POR_PAGINA = 20;
let paginaAtual = 0;
let totalPaginas = 0;
let termoBuscaAtual = '';
let atributoFiltroAtual = '';
let tipoFiltroAtual = '';
let nivelFiltroAtual = '';
let cacheCartas = [];
let estaCarregando = false;

// ===== MODAL =====
const modal = new Modal();
function abrirModal(carta) {
  modal.abrir(carta);
}

// ===== CARD LIST =====
const cardList = new CardList(container, abrirModal);

// ===== FUNÇÃO PARA CARREGAR CARTAS =====
async function carregarCartas(params = {}, pagina = 0) {
  if (estaCarregando) return;
  estaCarregando = true;

  const offset = pagina * ITENS_POR_PAGINA;
  try {
    const resultado = await buscarCartas(params, offset, ITENS_POR_PAGINA);
    const { data: cartas, total } = resultado;

    if (cartas && cartas.length > 0) {
      totalPaginas = Math.ceil(total / ITENS_POR_PAGINA);
      paginaAtual = pagina;
      adicionarAoCache(cartas);
      cardList.setCartas(cartas, totalPaginas);
      atualizarContador();
      atualizarBotoes();
    } else {
      container.innerHTML = '<p class="sem-resultados">Nenhuma carta encontrada.</p>';
      totalPaginas = 0;
      atualizarContador();
      atualizarBotoes();
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    container.innerHTML = `<p class="erro">Erro ao carregar: ${error.message}</p>`;
  } finally {
    estaCarregando = false;
  }
}

// ===== FUNÇÃO DE BUSCA COM FILTROS =====
function realizarBusca() {
  // 🔥 RESTAURA O CONTAINER AO ESTADO PERFEITO DA LISTA DE CARTAS
  container.className = 'lista-personagens';
  container.style.cssText = ''; 

  const nome = inputNome.value.trim();
  const atributo = selectAtributo.value;
  const tipo = selectTipo.value;
  const nivel = selectNivel.value;

  termoBuscaAtual = nome;
  atributoFiltroAtual = atributo;
  tipoFiltroAtual = tipo;
  nivelFiltroAtual = nivel;

  const params = {};
  if (nome) params.name = nome;
  if (atributo && atributo !== 'all') params.attribute = atributo;
  if (tipo && tipo !== 'all') params.type = tipo;
  if (nivel && nivel !== 'all') params.level = nivel;

  // Mostra a paginação ao buscar
  mostrarPaginacao();
  carregarCartas(params, 0);
}

// ===== DEBOUNCE =====
function debounce(func, wait = 400) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const buscarComDebounce = debounce(realizarBusca, 400);

// ===== CACHE =====
function adicionarAoCache(cartas) {
  cartas.forEach(carta => {
    if (!cacheCartas.find(c => c.id === carta.id)) {
      cacheCartas.push(carta);
    }
  });
}

// ===== ATUALIZA CONTADOR E BOTÕES =====
function atualizarContador() {
  if (contadorPagina) {
    if (totalPaginas === 0) {
      contadorPagina.textContent = 'Página 0 de 0';
    } else {
      contadorPagina.textContent = `Página ${paginaAtual + 1} de ${totalPaginas}`;
    }
  }
}

function atualizarBotoes() {
  if (btnAnterior) btnAnterior.disabled = paginaAtual === 0 || totalPaginas === 0;
  if (btnProximo) btnProximo.disabled = paginaAtual >= totalPaginas - 1 || totalPaginas === 0;
}

// ===== EVENTOS DE PÁGINA =====
btnAnterior?.addEventListener('click', () => {
  if (paginaAtual > 0) {
    const params = {};
    if (termoBuscaAtual) params.name = termoBuscaAtual;
    if (atributoFiltroAtual && atributoFiltroAtual !== 'all') params.attribute = atributoFiltroAtual;
    if (tipoFiltroAtual && tipoFiltroAtual !== 'all') params.type = tipoFiltroAtual;
    if (nivelFiltroAtual && nivelFiltroAtual !== 'all') params.level = nivelFiltroAtual;
    carregarCartas(params, paginaAtual - 1);
  }
});

btnProximo?.addEventListener('click', () => {
  if (paginaAtual < totalPaginas - 1) {
    const params = {};
    if (termoBuscaAtual) params.name = termoBuscaAtual;
    if (atributoFiltroAtual && atributoFiltroAtual !== 'all') params.attribute = atributoFiltroAtual;
    if (tipoFiltroAtual && tipoFiltroAtual !== 'all') params.type = tipoFiltroAtual;
    if (nivelFiltroAtual && nivelFiltroAtual !== 'all') params.level = nivelFiltroAtual;
    carregarCartas(params, paginaAtual + 1);
  }
});

// ===== EVENTOS DOS FILTROS =====
inputNome.addEventListener('input', buscarComDebounce);
inputNome.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') realizarBusca();
});

selectAtributo.addEventListener('change', realizarBusca);
selectTipo.addEventListener('change', realizarBusca);
selectNivel.addEventListener('change', realizarBusca);

// Botão "Limpar filtros"
btnLimpar?.addEventListener('click', () => {
  inputNome.value = '';
  selectAtributo.value = 'all';
  selectTipo.value = 'all';
  selectNivel.value = 'all';
  realizarBusca();
});

// ===== FAVORITOS =====
document.getElementById('btn-favoritos').addEventListener('click', () => {
  const favoritos = cacheCartas.filter(carta => isFavorito(carta.id));
  if (favoritos.length === 0) {
    container.innerHTML = '<p class="sem-resultados">Nenhuma carta favoritada.</p>';
    contadorPagina.textContent = '❤️ 0 favoritos';
    btnAnterior.disabled = true;
    btnProximo.disabled = true;
    return;
  }
  // 🔥 Para favoritos, também reseta o container
  container.className = 'lista-personagens';
  container.style.cssText = '';
  esconderPaginacao();
  cardList.setCartas(favoritos, 1);
  contadorPagina.textContent = `❤️ ${favoritos.length} favoritos`;
  btnAnterior.disabled = true;
  btnProximo.disabled = true;
});

document.getElementById('btn-todos').addEventListener('click', () => {
  mostrarPaginacao();
  realizarBusca();
});

// ===== DECKS =====
let deckListUI = null;
document.getElementById('btn-decks').addEventListener('click', () => {
  if (!deckListUI) {
    deckListUI = new DeckListUI(container, abrirModal);
  }
  esconderPaginacao();
  deckListUI.renderizarLista();
});

// ===== CONTROLE DE PAGINAÇÃO =====
function esconderPaginacao() {
  const paginacao = document.getElementById('paginacao');
  if (paginacao) paginacao.style.display = 'none';
}

function mostrarPaginacao() {
  const paginacao = document.getElementById('paginacao');
  if (paginacao) paginacao.style.display = 'flex';
}

// ===== CARREGAMENTO INICIAL =====
// A barra de pesquisa fica vazia
inputNome.value = '';

// Carrega a primeira página SEM FILTRO (todas as cartas)
// A ordem será por ID (números primeiro)
termoBuscaAtual = '';
carregarCartas({}, 0);

// ===== LISTENER PARA ATUALIZAR CONTADOR VINDO DO CARD LIST =====
document.addEventListener('paginaAtualizada', () => {
  atualizarContador();
  atualizarBotoes();
});

// ===== MODO ESCURO / CLARO =====
const btnTema = document.getElementById('btn-tema');
const temaSalvo = localStorage.getItem('tema') || 'light';

// Aplica o tema salvo
if (temaSalvo === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  btnTema.textContent = '☀️';
} else {
  document.documentElement.removeAttribute('data-theme');
  btnTema.textContent = '🌙';
}

btnTema?.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('tema', 'light');
    btnTema.textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('tema', 'dark');
    btnTema.textContent = '☀️';
  }
});

// ==========================================
// 🔥 CORREÇÃO DEFINITIVA DO FUNDO (F5 FIX)
// Força o navegador a carregar a imagem via JS
// ==========================================
document.body.style.backgroundImage = 'url(./src/imagens/imagens/fundo-site.jpg)';
document.body.style.backgroundSize = 'cover';
document.body.style.backgroundRepeat = 'no-repeat';
document.body.style.backgroundAttachment = 'fixed';