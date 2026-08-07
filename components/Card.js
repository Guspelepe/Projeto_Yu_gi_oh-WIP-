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
      <!-- Efeito holográfico -->
      <div class="holographic-effect"></div>
    </div>
  `;

  // ===== EFEITO 3D + HOLOGRÁFICO =====
  let animationFrame = null;

  const handleMouseMove = (e) => {
    if (animationFrame) return;
    animationFrame = requestAnimationFrame(() => {
      const rect = li.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 15;
      const rotateX = -((y - centerY) / centerY) * 15;

      // Aplica o efeito 3D
      li.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      li.style.transition = 'transform 0.05s ease-out';

      // ===== EFEITO HOLOGRÁFICO =====
      const holographic = li.querySelector('.holographic-effect');
      if (holographic) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        holographic.style.setProperty('--holo-x', `${percentX}%`);
        holographic.style.setProperty('--holo-y', `${percentY}%`);
        holographic.style.opacity = '0.7';
      }

      animationFrame = null;
    });
  };

  const handleMouseLeave = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    // Volta ao normal
    li.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    li.style.transition = 'transform 0.4s ease-out';

    // Desvanece o holográfico
    const holographic = li.querySelector('.holographic-effect');
    if (holographic) {
      holographic.style.opacity = '0';
    }
  };

  li.addEventListener('mouseenter', () => {
    li.style.willChange = 'transform';
  });

  li.addEventListener('mousemove', handleMouseMove);
  li.addEventListener('mouseleave', handleMouseLeave);

  // Clique para abrir o modal (sem GSAP)
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