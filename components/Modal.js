// components/Modal.js

import { isFavorito, adicionarFavorito, removerFavorito, getDecks } from '../utils/storage.js';
import { DeckManager } from './DeckManager.js';

export class Modal {
  constructor() {
    this.modal = null;
    this.overlay = null;
    this.cartaAtual = null;
    this.criarEstrutura();
  }

  criarEstrutura() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.style.display = 'none';

    this.modal = document.createElement('div');
    this.modal.className = 'modal-container';

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
            <button class="modal-favoritar">🤍 Favoritar</button>
            <button class="modal-adicionar-deck">➕ Adicionar ao Deck</button>
          </div>
        </div>
      </div>
    `;

    this.overlay.appendChild(this.modal);
    document.body.appendChild(this.overlay);

    // Fechar modal
    this.modal.querySelector('.modal-fechar').addEventListener('click', () => this.fechar());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.fechar();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.style.display !== 'none') {
        this.fechar();
      }
    });
  }

  abrir(carta) {
    this.cartaAtual = carta;

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

    // Cor de fundo por atributo
    const cor = this.obterCorAtributo(carta.attribute);
    this.modal.style.setProperty('--modal-cor', cor);

    // Configura botão favoritar
    this.configurarBotaoFavoritar();

    // Configura botão de deck
    this.configurarBotaoDeck();

    // Mostra o modal
    this.overlay.style.display = 'flex';
    this.modal.classList.add('modal-aberto');
    document.dispatchEvent(new CustomEvent('modalAberto', { detail: { carta } }));
  }

  fechar() {
    this.overlay.style.display = 'none';
    this.modal.classList.remove('modal-aberto');
    document.dispatchEvent(new CustomEvent('modalFechado'));
  }

  // ===== FAVORITOS =====
  configurarBotaoFavoritar() {
    const btn = this.modal.querySelector('.modal-favoritar');
    const id = this.cartaAtual.id;
    const isFav = isFavorito(id);

    this.atualizarBotaoFavoritar(btn, isFav);

    const novoBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(novoBtn, btn);

    novoBtn.addEventListener('click', () => {
      const agoraFavorito = isFavorito(id);
      if (agoraFavorito) {
        removerFavorito(id);
        this.atualizarBotaoFavoritar(novoBtn, false);
        document.dispatchEvent(new CustomEvent('favoritoAtualizado', { detail: { cartaId: id } }));
      } else {
        adicionarFavorito(id);
        this.atualizarBotaoFavoritar(novoBtn, true);
        document.dispatchEvent(new CustomEvent('favoritoAtualizado', { detail: { carta: this.cartaAtual } }));
      }
    });
  }

  atualizarBotaoFavoritar(botao, isFav) {
    if (isFav) {
      botao.textContent = '❤️ Favoritado';
      botao.style.background = 'linear-gradient(135deg, #ff6b6b, #c0392b)';
    } else {
      botao.textContent = '🤍 Favoritar';
      botao.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
    }
  }

  // ===== DECK =====
  configurarBotaoDeck() {
    const btn = this.modal.querySelector('.modal-adicionar-deck');
    const novoBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(novoBtn, btn);

    novoBtn.addEventListener('click', async () => {
      const carta = this.cartaAtual;
      const decks = getDecks();

      if (decks.length === 0) {
        alert('Nenhum deck criado. Crie um primeiro clicando em "Meus Decks" no menu.');
        return;
      }

      // Mostra opções em um prompt simples
      let opcoes = decks.map((d, i) => `${i+1}: ${d.nome} (${d.cartas.length}/80)`).join('\n');
      const escolha = prompt(`Adicionar "${carta.name}" a qual deck?\n\n${opcoes}\n\nDigite o número:`);
      if (escolha === null) return;

      const index = parseInt(escolha) - 1;
      if (isNaN(index) || index < 0 || index >= decks.length) {
        alert('Número inválido.');
        return;
      }

      const manager = new DeckManager();
      if (manager.adicionarCarta(index, carta)) {
        alert(`✅ "${carta.name}" adicionada ao deck "${decks[index].nome}"!`);
        document.dispatchEvent(new CustomEvent('deckAtualizado'));
      }
    });
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