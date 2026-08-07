// components/CardList.js

import { criarCard } from './Card.js';

export class CardList {
  constructor(container, onCardClick) {
    this.container = container;
    this.onCardClick = onCardClick;
    this.cartas = [];
    this.paginaAtual = 0;
    this.totalPaginas = 0;
    this.itensPorPagina = 20;
  }

  setCartas(cartas, totalPaginas = 1) {
    this.cartas = cartas;
    this.totalPaginas = totalPaginas;
    this.paginaAtual = 0;
    this.renderizar();
  }

  renderizar() {
    this.container.innerHTML = '';
    this.cartas.forEach(carta => {
      const cardElement = criarCard(carta, this.onCardClick);
      this.container.appendChild(cardElement);
    });
    this.atualizarPaginacao();
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.paginaAtual++;
      // Notifica que precisa carregar a próxima página (via callback no main)
      document.dispatchEvent(new CustomEvent('mudarPagina', { 
        detail: { pagina: this.paginaAtual } 
      }));
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      document.dispatchEvent(new CustomEvent('mudarPagina', { 
        detail: { pagina: this.paginaAtual } 
      }));
    }
  }

  atualizarPaginacao() {
    const evento = new CustomEvent('paginaAtualizada', {
      detail: { pagina: this.paginaAtual + 1, total: this.totalPaginas }
    });
    document.dispatchEvent(evento);
  }

  // Mantém compatibilidade com reset (caso use)
  resetar() {
    this.cartas = [];
    this.paginaAtual = 0;
    this.totalPaginas = 0;
    this.container.innerHTML = '';
  }
}