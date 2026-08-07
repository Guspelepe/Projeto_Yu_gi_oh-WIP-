// components/CardList.js

import { criarCard } from './Card.js';

export class CardList {
  constructor(container, onCardClick) {
    this.container = container;
    this.onCardClick = onCardClick;
    this.cartas = [];
    this.totalPaginas = 0;
    this.paginaAtual = 0;
  }

  // Define as cartas e renderiza (sem slice, pois já vem paginado)
  setCartas(cartas, totalPaginas = 1) {
    this.cartas = cartas;
    this.totalPaginas = totalPaginas;
    this.renderizar();
  }

  // Renderiza as cartas atuais (sem slice)
  renderizar() {
    this.container.innerHTML = '';
    if (!this.cartas || this.cartas.length === 0) {
      this.container.innerHTML = '<p class="sem-resultados">Nenhuma carta encontrada.</p>';
      return;
    }

    this.cartas.forEach(carta => {
      const cardElement = criarCard(carta, this.onCardClick);
      this.container.appendChild(cardElement);
    });

    this.atualizarPaginacao();
  }

  atualizarPaginacao() {
    const evento = new CustomEvent('paginaAtualizada', {
      detail: { pagina: this.paginaAtual + 1, total: this.totalPaginas }
    });
    document.dispatchEvent(evento);
  }
}