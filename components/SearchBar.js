// components/SearchBar.js

import { buscarCartas } from '../api/yugioh.js';

export class SearchBar {
  constructor(options = {}) {
    this.input = options.input;
    this.button = options.button;
    this.filtros = options.filtros || {};
    this.onSearch = options.onSearch;
    this.debounceTime = options.debounceTime || 300;
    this.timeout = null;
    this.ultimaBusca = '';

    this.inicializarEventos();
  }

  inicializarEventos() {
    // Evento de input com debounce (pesquisa em tempo real)
    this.input?.addEventListener('input', () => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.realizarBusca();
      }, this.debounceTime);
    });

    // Enter no campo de busca
    this.input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(this.timeout);
        this.realizarBusca();
      }
    });

    // Botão de busca
    this.button?.addEventListener('click', () => {
      clearTimeout(this.timeout);
      this.realizarBusca();
    });

    // Filtros: mudança já dispara busca (com debounce)
    Object.values(this.filtros).forEach(filtro => {
      filtro?.addEventListener('change', () => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.realizarBusca();
        }, 100);
      });
    });
  }

  async realizarBusca() {
    const nome = this.input?.value.trim() || '';
    const params = {};

    // Se não houver termo e nenhum filtro, não faz busca (opcional)
    // Mas podemos buscar tudo se quiser

    if (nome) {
      params.name = nome;
    }

    // Coleta filtros
    Object.keys(this.filtros).forEach(key => {
      const valor = this.filtros[key]?.value;
      if (valor && valor !== '') {
        params[key] = valor;
      }
    });

    // Evita busca duplicada
    const chaveBusca = JSON.stringify(params);
    if (chaveBusca === this.ultimaBusca) return;
    this.ultimaBusca = chaveBusca;

    // Dispara evento de busca
    if (this.onSearch) {
      this.onSearch(params);
    }
  }

  // Método para buscar programaticamente
  buscar() {
    this.realizarBusca();
  }
}