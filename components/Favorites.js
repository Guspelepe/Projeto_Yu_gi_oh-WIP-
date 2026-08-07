// components/Favorites.js

import { getFavoritos } from '../utils/storage.js';

export class Favorites {
  constructor(container, onCardClick) {
    this.container = container;
    this.onCardClick = onCardClick;
  }

  filtrarFavoritos(todasCartas) {
    const idsFavoritos = getFavoritos();
    return todasCartas.filter(carta => idsFavoritos.includes(carta.id));
  }

  renderizar(todasCartas, cardListInstance) {
    const favoritos = this.filtrarFavoritos(todasCartas);
    if (favoritos.length === 0) {
      this.container.innerHTML = '<p class="sem-resultados">Nenhuma carta favoritada ainda. ❤️</p>';
      return;
    }
    cardListInstance.setCartas(favoritos);
  }
}