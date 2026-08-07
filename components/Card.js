// components/Card.js

export function criarCard(carta, onCardClick) {
  const li = document.createElement('li');
  li.className = 'cartao';
  li.dataset.id = carta.id;

  // Define a classe de fundo baseada no atributo
  const fundoClasse = obterFundoPorAtributo(carta.attribute);
  li.classList.add(fundoClasse);

  // Nível (estrelas) – opcional, pode manter ou remover
  const estrelas = carta.level ? '★'.repeat(carta.level) : '';

  li.innerHTML = `
    <div class="carta-container">
      <div class="carta-imagem-wrapper">
        <img src="${carta.card_images[0].image_url}" 
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

  // Clique abre o modal (e não vira mais)
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