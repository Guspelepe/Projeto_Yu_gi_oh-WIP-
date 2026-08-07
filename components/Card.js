// components/Card.js

import { isFavorito } from '../utils/storage.js';

export function criarCard(carta, onCardClick) {
  const li = document.createElement('li');
  li.className = 'cartao';
  li.dataset.id = carta.id;

  const fundoClasse = obterFundoPorAtributo(carta.attribute);
  li.classList.add(fundoClasse);

  const favorito = isFavorito(carta.id);
  const estrelas = carta.level ? '★'.repeat(carta.level) : '';

  // Usa imagem pequena se disponível
  const imagemUrl = carta.card_images[0].image_url_small || carta.card_images[0].image_url;

  li.innerHTML = `
    <div class="carta-container">
      ${favorito ? '<div class="carta-favorito-icone">❤️</div>' : ''}
      <div class="carta-imagem-wrapper">
        <img src="${imagemUrl}" 
             alt="${carta.name}" 
             class="carta-imagem"
             loading="lazy" />
        ${carta.level ? `<div class="carta-nivel">${estrelas}</div>` : ''}
      </div>
      <div class="carta-ataque-defesa">
        <span>ATK ${carta.atk || '?'}</span>
        <span>DEF ${carta.def || '?'}</span>
      </div>
    </div>
  `;

  li.addEventListener('click', (e) => {
    e.stopPropagation();
    if (onCardClick) onCardClick(carta);
  });

  return li;
}

function obterFundoPorAtributo(atributo) {
  const mapa = {
    'DARK': 'fundo-dark',
    'LIGHT': 'fundo-light',
    'FIRE': 'fundo-fire',
    'WATER': 'fundo-water',
    'EARTH': 'fundo-earth',
    'WIND': 'fundo-wind',
    'DIVINE': 'fundo-divine'
  };
  return mapa[atributo] || 'fundo-padrao';
}