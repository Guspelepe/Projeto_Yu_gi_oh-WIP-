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
    this.animacaoTimeout = null;
  }

  setCartas(cartas, totalPaginas = 1) {
    this.cartas = cartas;
    this.totalPaginas = totalPaginas;
    this.paginaAtual = 0;
    this.renderizar();
  }

  renderizar() {
    this.container.innerHTML = '';
    
    // Cria um fragmento para adicionar todas as cartas de uma vez
    const fragment = document.createDocumentFragment();
    this.cartas.forEach(carta => {
      const cardElement = criarCard(carta, this.onCardClick);
      fragment.appendChild(cardElement);
    });
    this.container.appendChild(fragment);

    // ===== ANIMAÇÃO GSAP =====
    const cartasElementos = this.container.querySelectorAll('.cartao');
    if (cartasElementos.length > 0) {
      // Reset dos estilos iniciais
      gsap.set(cartasElementos, {
        opacity: 0,
        scale: 0.85,
        y: 30,
        rotationX: 5,
        rotationY: 5,
      });

      // Animação em stagger (entrada em cascata)
      gsap.to(cartasElementos, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
        clearProps: 'transform',
      });
    }

    this.atualizarPaginacao();
  }

  // Renderiza apenas as novas cartas (para paginação)
  renderizarApenasNovas(novasCartas) {
    const fragment = document.createDocumentFragment();
    novasCartas.forEach(carta => {
      const cardElement = criarCard(carta, this.onCardClick);
      fragment.appendChild(cardElement);
    });
    this.container.appendChild(fragment);

    // Anima apenas as cartas novas (últimas N)
    const cartasElementos = this.container.querySelectorAll('.cartao');
    const total = cartasElementos.length;
    const novas = cartasElementos.slice(total - novasCartas.length);
    
    gsap.set(novas, {
      opacity: 0,
      scale: 0.85,
      y: 30,
    });

    gsap.to(novas, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power3.out',
      clearProps: 'transform',
    });
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.paginaAtual++;
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

  resetar() {
    this.cartas = [];
    this.paginaAtual = 0;
    this.totalPaginas = 0;
    this.container.innerHTML = '';
  }
}