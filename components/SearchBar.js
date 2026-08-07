// components/SearchBar.js

export class SearchBar {
  constructor(inputSelector, buttonSelector, filtroSelectors, onSearchCallback) {
    this.input = document.querySelector(inputSelector);
    this.button = document.querySelector(buttonSelector);
    this.filtros = {};

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

    // Evento de mudança nos filtros (opcional)
    Object.values(this.filtros).forEach(filtro => {
      if (filtro && filtro.tagName === 'SELECT') {
        filtro.addEventListener('change', () => this.buscar());
      }
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
      // Em vez de buscar aqui, delegamos para o callback
      if (this.onSearch) {
        // Passamos os parâmetros e deixamos o main.js lidar com a paginação
        this.onSearch(params);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  }
}