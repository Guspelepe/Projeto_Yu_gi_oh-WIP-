// src/components/CardList.js

import { criarCard } from './Card.js';

export class CardList {
  constructor(container, onCardClick, itemsPerPage = 12) {
    this.container = container;
    this.itemsPerPage = itemsPerPage;
    this.onCardClick = onCardClick;
    this.cartas = [];
    this.paginaAtual = 0;
    this.totalPaginas = 0;
  }

  setCartas(cartas) {
    this.cartas = cartas;
    this.totalPaginas = Math.ceil(this.cartas.length / this.itemsPerPage);
    this.paginaAtual = 0;
    this.renderizar();
  }

  renderizar() {
    const inicio = this.paginaAtual * this.itemsPerPage;
    const fim = inicio + this.itemsPerPage;
    const paginaCartas = this.cartas.slice(inicio, fim);

    this.container.innerHTML = '';
    paginaCartas.forEach(carta => {
      const cardElement = criarCard(carta, this.onCardClick);
      this.container.appendChild(cardElement);
    });

    this.atualizarPaginacao();
  }

  proxima() {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.paginaAtual++;
      this.renderizar();
    }
  }

  anterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.renderizar();
    }
  }

  atualizarPaginacao() {
    const evento = new CustomEvent('paginaAtualizada', {
      detail: { pagina: this.paginaAtual + 1, total: this.totalPaginas }
    });
    document.dispatchEvent(evento);
  }
}