// main.js (na raiz)

console.log('🚀 main.js carregado!');

import { buscarCartas } from './api/yugioh.js';
import { CardList } from './components/CardList.js';
import { SearchBar } from './components/SearchBar.js';
import { Modal } from './components/Modal.js';

// Elementos do DOM
const container = document.getElementById('lista-cartas');
const btnAnterior = document.getElementById('btn-anterior');
const btnProximo = document.getElementById('btn-proximo');
const contadorPagina = document.getElementById('contador-pagina');

if (!container) {
  console.error('❌ Container #lista-cartas não encontrado!');
}

// Instancia o Modal
const modal = new Modal();

// Função que será chamada ao clicar na carta
function abrirModal(carta) {
  console.log('🖱️ Clicou na carta:', carta.name);
  modal.abrir(carta);
}

// Instancia a lista de cartas com o callback do modal
const cardList = new CardList(container, abrirModal, 12);

// Função para carregar cartas
async function carregarCartas(params = {}) {
  console.log('🔄 Carregando cartas com params:', params);
  try {
    const cartas = await buscarCartas(params);
    console.log('✅ Cartas recebidas:', cartas?.length || 0);
    if (cartas && cartas.length > 0) {
      cardList.setCartas(cartas.slice(0, 50));
    } else {
      container.innerHTML = '<p class="sem-resultados">Nenhuma carta encontrada.</p>';
    }
  } catch (error) {
    console.error('❌ Erro ao carregar cartas:', error);
    container.innerHTML = `<p class="erro">Erro ao carregar cartas: ${error.message}</p>`;
  }
}

// Inicializa a busca
const searchBar = new SearchBar(
  '#input-nome',
  '#btn-buscar',
  {
    attribute: '#filtro-atributo',
  },
  (cartas) => {
    console.log('🔍 Busca realizada, cartas:', cartas?.length || 0);
    if (cartas && cartas.length > 0) {
      cardList.setCartas(cartas.slice(0, 50));
    } else {
      container.innerHTML = '<p class="sem-resultados">Nenhuma carta encontrada.</p>';
    }
  }
);

// Carregar cartas iniciais
carregarCartas({ name: 'Dark Magician' });

// Eventos de paginação
document.addEventListener('paginaAtualizada', (e) => {
  const { pagina, total } = e.detail;
  console.log('📄 Página atualizada:', pagina, total);
  contadorPagina.textContent = `Página ${pagina} de ${total}`;
});

btnAnterior?.addEventListener('click', () => {
  console.log('⬅️ Anterior');
  cardList.anterior();
});
btnProximo?.addEventListener('click', () => {
  console.log('➡️ Próximo');
  cardList.proxima();
});