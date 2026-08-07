// components/DeckEditorUI.js

import { buscarCartas } from '../api/yugioh.js';

export class DeckEditorUI {
  constructor(container, deckManager, onSave) {
    this.container = container;
    this.deckManager = deckManager;
    this.onSave = onSave; // callback após salvar
    this.deckIndex = null;
    this.deck = null;
    this.capaSelecionada = null;
  }

  abrir(index) {
    this.deckIndex = index;
    this.deck = this.deckManager.getDeck(index);
    if (!this.deck) return;

    this.capaSelecionada = this.deck.capa || null;
    this.renderizar();
  }

  renderizar() {
    const deck = this.deck;
    const capa = this.capaSelecionada;

    this.container.innerHTML = `
      <div class="deck-editor-overlay">
        <div class="deck-editor-modal">
          <div class="deck-editor-header">
            <h2>✏️ Editar Deck</h2>
            <button class="deck-editor-fechar">✕</button>
          </div>

          <div class="deck-editor-conteudo">
            <!-- Nome -->
            <div class="deck-editor-campo">
              <label for="deck-editor-nome">Nome do Deck</label>
              <input type="text" id="deck-editor-nome" value="${deck.nome}" />
            </div>

            <!-- Capa -->
            <div class="deck-editor-campo">
              <label>Capa do Deck</label>
              <div class="deck-editor-capa-container">
                <div class="deck-editor-capa-preview">
                  ${capa ? `<img src="${capa.image_url}" alt="${capa.name}" />` : '<span class="sem-capa">📚 Sem capa</span>'}
                </div>
                <div class="deck-editor-capa-busca">
                  <input type="text" id="deck-editor-capa-busca" placeholder="Nome da carta para capa..." />
                  <button id="deck-editor-capa-buscar">🔍 Buscar</button>
                  <button id="deck-editor-capa-remover">🗑️ Remover capa</button>
                </div>
                <div id="deck-editor-capa-resultados" class="deck-editor-capa-resultados"></div>
              </div>
            </div>

            <!-- Ações -->
            <div class="deck-editor-acoes">
              <button class="deck-editor-salvar">💾 Salvar</button>
              <button class="deck-editor-cancelar">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // ===== EVENTOS =====

    // Fechar
    this.container.querySelector('.deck-editor-fechar').addEventListener('click', () => this.fechar());
    this.container.querySelector('.deck-editor-cancelar').addEventListener('click', () => this.fechar());
    this.container.querySelector('.deck-editor-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.fechar();
    });

    // Buscar capa
    const inputCapa = this.container.querySelector('#deck-editor-capa-busca');
    const btnBuscar = this.container.querySelector('#deck-editor-capa-buscar');
    const resultadosDiv = this.container.querySelector('#deck-editor-capa-resultados');

    const buscarCapa = async () => {
      const nome = inputCapa.value.trim();
      if (!nome) {
        resultadosDiv.innerHTML = '<p>Digite um nome para buscar.</p>';
        return;
      }
      resultadosDiv.innerHTML = '<p>⏳ Buscando...</p>';
      try {
        const resultado = await buscarCartas({ name: nome }, 0, 10);
        const cartas = resultado.data || [];
        if (cartas.length === 0) {
          resultadosDiv.innerHTML = '<p>Nenhuma carta encontrada.</p>';
          return;
        }
        let html = '<div class="capa-resultados-grid">';
        cartas.forEach(carta => {
          const isSelected = this.capaSelecionada?.id === carta.id;
          html += `
            <div class="capa-resultado-item ${isSelected ? 'selecionado' : ''}" data-id="${carta.id}" data-name="${carta.name}" data-image="${carta.card_images[0].image_url}">
              <img src="${carta.card_images[0].image_url}" alt="${carta.name}" />
              <span>${carta.name}</span>
            </div>
          `;
        });
        html += '</div>';
        resultadosDiv.innerHTML = html;

        // Evento de seleção
        resultadosDiv.querySelectorAll('.capa-resultado-item').forEach(el => {
          el.addEventListener('click', () => {
            const id = parseInt(el.dataset.id);
            const name = el.dataset.name;
            const image = el.dataset.image;
            this.capaSelecionada = { id, name, image_url: image };
            // Atualiza preview
            const preview = this.container.querySelector('.deck-editor-capa-preview');
            preview.innerHTML = `<img src="${image}" alt="${name}" />`;
            // Remove seleção de outros
            resultadosDiv.querySelectorAll('.capa-resultado-item').forEach(item => item.classList.remove('selecionado'));
            el.classList.add('selecionado');
          });
        });
      } catch (error) {
        resultadosDiv.innerHTML = `<p>Erro: ${error.message}</p>`;
      }
    };

    btnBuscar.addEventListener('click', buscarCapa);
    inputCapa.addEventListener('keypress', (e) => { if (e.key === 'Enter') buscarCapa(); });

    // Remover capa
    this.container.querySelector('#deck-editor-capa-remover').addEventListener('click', () => {
      this.capaSelecionada = null;
      const preview = this.container.querySelector('.deck-editor-capa-preview');
      preview.innerHTML = '<span class="sem-capa">📚 Sem capa</span>';
      resultadosDiv.innerHTML = '';
      const input = this.container.querySelector('#deck-editor-capa-busca');
      input.value = '';
    });

    // Salvar
    this.container.querySelector('.deck-editor-salvar').addEventListener('click', () => {
      const nomeInput = this.container.querySelector('#deck-editor-nome');
      const novoNome = nomeInput.value.trim();
      if (!novoNome) {
        alert('Digite um nome para o deck.');
        return;
      }

      // Renomeia
      this.deckManager.renomearDeck(this.deckIndex, novoNome);

      // Atualiza capa
      const deckObj = this.deckManager.getDeck(this.deckIndex);
      deckObj.capa = this.capaSelecionada || null;
      // Salva no localStorage (via setDecks)
      this.deckManager.decks[this.deckIndex] = deckObj;
      this.deckManager._salvar(); // precisamos criar um método privado ou usar setDecks

      if (this.onSave) this.onSave();
      this.fechar();
    });
  }

  fechar() {
    this.container.innerHTML = '';
    this.container.style.display = 'none';
  }
}