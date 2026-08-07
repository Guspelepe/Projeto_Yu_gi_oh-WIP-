// src/components/SearchBar.js

import { buscarCartas } from '../api/yugioh.js';

export class SearchBar {
  constructor(inputSelector, buttonSelector, filtroSelectors, onSearchCallback) {
    this.input = document.querySelector(inputSelector);
    this.button = document.querySelector(buttonSelector);
    this.filtros = {};
    
    // Mapeia os selects para objetos
    if (filtroSelectors) {
      Object.keys(filtroSelectors).forEach(key => {
        this.filtros[key] = document.querySelector(filtroSelectors[key]);
      });
    }

    this.onSearch = onSearchCallback;

    // Evento de clique no botão
    this.button.addEventListener('click', () => this.buscar());

    // Enter no campo de busca
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.buscar();
    });
  }

  async buscar() {
    const nome = this.input.value.trim();
    const params = {};

    if (nome) params.name = nome;

    // Coleta valores dos filtros
    Object.keys(this.filtros).forEach(key => {
      const valor = this.filtros[key].value;
      if (valor) params[key] = valor;
    });

    try {
      const cartas = await buscarCartas(params);
      if (this.onSearch) this.onSearch(cartas);
    } catch (error) {
      console.error('Erro na busca:', error);
      alert('Erro ao buscar cartas. Tente novamente.');
    }
  }
}