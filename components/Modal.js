// src/components/Modal.js

export class Modal {
  constructor() {
    this.modal = null;
    this.overlay = null;
    this.criarEstrutura();
  }

  criarEstrutura() {
    // Cria o overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.style.display = 'none';

    // Cria o modal
    this.modal = document.createElement('div');
    this.modal.className = 'modal-container';
    
    // Conteúdo do modal
    this.modal.innerHTML = `
      <button class="modal-fechar">✕</button>
      <div class="modal-conteudo">
        <div class="modal-imagem-container">
          <img class="modal-imagem" src="" alt="Carta" />
        </div>
        <div class="modal-info">
          <h2 class="modal-nome"></h2>
          <div class="modal-detalhes">
            <p><strong>Tipo:</strong> <span class="modal-tipo"></span></p>
            <p><strong>Atributo:</strong> <span class="modal-atributo"></span></p>
            <p><strong>Nível:</strong> <span class="modal-nivel"></span></p>
            <p><strong>ATK:</strong> <span class="modal-atk"></span></p>
            <p><strong>DEF:</strong> <span class="modal-def"></span></p>
            <p><strong>Raça:</strong> <span class="modal-raca"></span></p>
          </div>
          <div class="modal-descricao">
            <h3>Descrição</h3>
            <p class="modal-texto-descricao"></p>
          </div>
          <div class="modal-acoes">
            <button class="modal-favoritar">❤️ Favoritar</button>
            <button class="modal-adicionar-deck">➕ Adicionar ao Deck</button>
          </div>
        </div>
      </div>
    `;

    this.overlay.appendChild(this.modal);
    document.body.appendChild(this.overlay);

    // Evento para fechar
    this.modal.querySelector('.modal-fechar').addEventListener('click', () => this.fechar());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.fechar();
    });

    // Evento ESC para fechar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.style.display !== 'none') {
        this.fechar();
      }
    });
  }

  abrir(carta) {
    // Preenche os dados
    this.modal.querySelector('.modal-imagem').src = carta.card_images[0].image_url;
    this.modal.querySelector('.modal-nome').textContent = carta.name;
    this.modal.querySelector('.modal-tipo').textContent = carta.type || '?';
    this.modal.querySelector('.modal-atributo').textContent = carta.attribute || '?';
    this.modal.querySelector('.modal-nivel').textContent = carta.level || '?';
    this.modal.querySelector('.modal-atk').textContent = carta.atk || '?';
    this.modal.querySelector('.modal-def').textContent = carta.def || '?';
    this.modal.querySelector('.modal-raca').textContent = carta.race || '?';
    this.modal.querySelector('.modal-texto-descricao').textContent = carta.desc || 'Sem descrição';

    // Aplica cor de fundo baseada no atributo
    const cor = this.obterCorAtributo(carta.attribute);
    this.modal.style.setProperty('--modal-cor', cor);

    // Mostra o modal com animação
    this.overlay.style.display = 'flex';
    this.modal.classList.add('modal-aberto');

    // Eventos dos botões (você pode implementar depois)
    const btnFavoritar = this.modal.querySelector('.modal-favoritar');
    const btnDeck = this.modal.querySelector('.modal-adicionar-deck');
    
    // Remove listeners antigos clonando e substituindo
    const novoBtnFav = btnFavoritar.cloneNode(true);
    const novoBtnDeck = btnDeck.cloneNode(true);
    btnFavoritar.parentNode.replaceChild(novoBtnFav, btnFavoritar);
    btnDeck.parentNode.replaceChild(novoBtnDeck, btnDeck);

    novoBtnFav.addEventListener('click', () => {
      // TODO: Implementar favoritos
      alert(`Carta "${carta.name}" favoritada!`);
    });

    novoBtnDeck.addEventListener('click', () => {
      // TODO: Implementar deck
      alert(`Carta "${carta.name}" adicionada ao deck!`);
    });

    // Dispara evento para efeitos sonoros
    document.dispatchEvent(new CustomEvent('modalAberto', { detail: { carta } }));
  }

  fechar() {
    this.overlay.style.display = 'none';
    this.modal.classList.remove('modal-aberto');
    document.dispatchEvent(new CustomEvent('modalFechado'));
  }

  obterCorAtributo(atributo) {
    const cores = {
      'DARK': '#2a1a3a',
      'LIGHT': '#f5e6d3',
      'FIRE': '#8b3a1f',
      'WATER': '#1a3a5c',
      'EARTH': '#3d2b1f',
      'WIND': '#2d5a5a',
      'DIVINE': '#8b7a3a'
    };
    return cores[atributo] || '#2d2d2d';
  }
}