// components/Card.js

import { isFavorito } from '../utils/storage.js';

export function criarCard(carta, onCardClick) {
  const li = document.createElement('li');
  li.className = 'cartao';
  li.dataset.id = carta.id;

  // Fundo por atributo
  const fundoClasse = obterFundoPorAtributo(carta.attribute);
  li.classList.add(fundoClasse);

  const favorito = isFavorito(carta.id);
  const estrelas = carta.level ? '★'.repeat(carta.level) : '';

  // Estrutura da carta
  li.innerHTML = `
    <div class="carta-container">
      ${favorito ? '<div class="carta-favorito-icone">❤️</div>' : ''}
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

  // ===== EFEITO 3D =====
  let animationFrame = null;

  const handleMouseMove = (e) => {
    if (animationFrame) return;
    animationFrame = requestAnimationFrame(() => {
      const rect = li.getBoundingClientRect();
      const x = e.clientX - rect.left; // posição X dentro da carta
      const y = e.clientY - rect.top;  // posição Y dentro da carta

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calcula a rotação (máximo de +/- 15 graus)
      const rotateY = ((x - centerX) / centerX) * 15;   // eixo Y (movimento horizontal)
      const rotateX = -((y - centerY) / centerY) * 15;  // eixo X (movimento vertical)

      // Aplica a transformação
      li.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      li.style.transition = 'transform 0.05s ease-out';

      animationFrame = null;
    });
  };

  const handleMouseLeave = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    // Volta ao normal com transição suave
    li.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    li.style.transition = 'transform 0.4s ease-out';
  };

  // Adiciona os listeners
  li.addEventListener('mouseenter', () => {
    // Pré-ativa o efeito
    li.style.willChange = 'transform';
  });

  li.addEventListener('mousemove', handleMouseMove);
  li.addEventListener('mouseleave', handleMouseLeave);

  // Clique para abrir o modal (mantido)
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