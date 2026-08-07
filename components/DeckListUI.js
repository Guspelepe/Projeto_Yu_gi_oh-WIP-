// components/DeckListUI.js

import { DeckManager } from './DeckManager.js';
import { criarCard } from './Card.js';
import { buscarCartas } from '../api/yugioh.js';

export class DeckListUI {
  constructor(container, onCardClick) {
    this.container = container;
    this.onCardClick = onCardClick;
    this.deckManager = new DeckManager();
    this.deckAtual = null;
  }

  renderizarLista() {
    const decks = this.deckManager.listarDecks();
    if (decks.length === 0) {
      this.container.innerHTML = `
        <div class="deck-lista-vazia">
          <p>Nenhum deck criado ainda.</p>
          <button class="btn-criar-deck">➕ Criar novo deck</button>
        </div>
      `;
      this.container.querySelector('.btn-criar-deck')?.addEventListener('click', () => this.criarNovoDeck());
      return;
    }

    let html = `<div class="deck-lista">
      <h2>Meus Decks</h2>
      <button class="btn-criar-deck">➕ Criar novo deck</button>
      <div class="deck-grid">`;

    decks.forEach((deck, index) => {
      const qtd = deck.cartas.length;
      html += `
        <div class="deck-item" data-index="${index}">
          <h3>${deck.nome}</h3>
          <p>${qtd}/80 cartas</p>
          <div class="deck-acoes">
            <button class="btn-abrir-deck" data-index="${index}">Abrir</button>
            <button class="btn-renomear-deck" data-index="${index}">✏️</button>
            <button class="btn-excluir-deck" data-index="${index}">🗑️</button>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    this.container.innerHTML = html;

    this.container.querySelector('.btn-criar-deck')?.addEventListener('click', () => this.criarNovoDeck());
    this.container.querySelectorAll('.btn-abrir-deck').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        this.abrirDeck(idx);
      });
    });
    this.container.querySelectorAll('.btn-renomear-deck').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        const novoNome = prompt('Novo nome:', this.deckManager.decks[idx].nome);
        if (novoNome !== null) {
          this.deckManager.renomearDeck(idx, novoNome);
          this.renderizarLista();
        }
      });
    });
    this.container.querySelectorAll('.btn-excluir-deck').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        if (this.deckManager.removerDeck(idx)) this.renderizarLista();
      });
    });
  }

  criarNovoDeck() {
    const nome = prompt('Digite o nome do novo deck:');
    if (nome !== null) {
      this.deckManager.criarDeck(nome);
      this.renderizarLista();
    }
  }

  async abrirDeck(index) {
    const deck = this.deckManager.getDeck(index);
    if (!deck) return;
    this.deckAtual = index;

    this.container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'deck-visualizacao-wrapper';

    const sidebar = document.createElement('div');
    sidebar.className = 'deck-sidebar';
    sidebar.innerHTML = `
      <h3>Buscar carta</h3>
      <input type="text" id="deck-pesquisa-input" placeholder="Nome da carta..." />
      <select id="deck-pesquisa-atributo">
        <option value="">Todos atributos</option>
        <option value="DARK">Trevas</option>
        <option value="LIGHT">Luz</option>
        <option value="FIRE">Fogo</option>
        <option value="WATER">Água</option>
        <option value="EARTH">Terra</option>
        <option value="WIND">Vento</option>
        <option value="DIVINE">Divino</option>
      </select>
      <button id="deck-pesquisa-buscar">Buscar</button>
      <div id="deck-resultados-pesquisa"></div>
    `;

    const mainArea = document.createElement('div');
    mainArea.className = 'deck-main-area';
    mainArea.innerHTML = `
      <div class="deck-header">
        <h2>${deck.nome} (<span id="deck-contador">${deck.cartas.length}</span>/80)</h2>
        <button class="btn-voltar-decks">⬅️ Voltar</button>
        <button id="btn-forcar" style="background:orange;color:#000;padding:4px 12px;border:none;border-radius:4px;cursor:pointer;">🔄 Forçar</button>
      </div>
      <div id="deck-cartas-container"></div>
    `;

    wrapper.appendChild(sidebar);
    wrapper.appendChild(mainArea);
    this.container.appendChild(wrapper);

    requestAnimationFrame(() => {
      setTimeout(() => {
        this.renderizarCartasDeck();
      }, 50);
    });

    wrapper.querySelector('#btn-forcar')?.addEventListener('click', () => {
      this.renderizarCartasDeck();
    });

    this.configurarPesquisa(index, sidebar);
    mainArea.querySelector('.btn-voltar-decks').addEventListener('click', () => this.renderizarLista());
  }

  configurarPesquisa(index, sidebar) {
    const inputBusca = sidebar.querySelector('#deck-pesquisa-input');
    const selectAtributo = sidebar.querySelector('#deck-pesquisa-atributo');
    const btnBuscar = sidebar.querySelector('#deck-pesquisa-buscar');
    const resultadosDiv = sidebar.querySelector('#deck-resultados-pesquisa');
    const deck = this.deckManager.getDeck(index);

    const realizarPesquisa = async () => {
        const nome = inputBusca.value.trim();
        const atributo = selectAtributo.value;
        const params = {};
        if (nome) params.name = nome;
        if (atributo) params.attribute = atributo;

        if (!nome && !atributo) {
          resultadosDiv.innerHTML = '<p>Digite um termo ou selecione um atributo.</p>';
          return;
        }

        resultadosDiv.innerHTML = '<p>⏳ Buscando...</p>';
        try {
          const resultado = await buscarCartas(params, 0, 20);
          const cartas = resultado.data || [];
          if (cartas.length === 0) {
              resultadosDiv.innerHTML = '<p>Nenhuma carta encontrada.</p>';
              return;
          }

          let html = '<ul class="resultados-pesquisa-lista">';
          cartas.forEach(carta => {
              const qtd = deck.cartas.filter(c => c.id === carta.id).length;
              const podeAdicionar = qtd < 3 && deck.cartas.length < 80;
              
              // 🔥 CORREÇÃO DEFINITIVA: Substitui aspas por entidade HTML &quot;
              const cartaJSON = JSON.stringify(carta).replace(/"/g, '&quot;');
              
              html += `
                <li class="resultado-item">
                    <img src="${carta.card_images[0].image_url}" alt="${carta.name}" width="40" />
                    <span>${carta.name}</span>
                    <span class="qtd">${qtd}/3</span>
                    ${podeAdicionar ? `<button class="btn-add-carta-deck" data-carta="${cartaJSON}">+</button>` : '<span class="limite">✔</span>'}
                </li>
              `;
          });
          html += '</ul>';
          resultadosDiv.innerHTML = html;

          resultadosDiv.querySelectorAll('.btn-add-carta-deck').forEach(btn => {
              btn.addEventListener('click', () => {
                // 🔥 DESCODIFICAÇÃO SEGURA: Troca &quot; de volta para "
                const carta = JSON.parse(btn.dataset.carta.replace(/&quot;/g, '"'));
                
                if (this.deckManager.adicionarCarta(index, carta)) {
                    this.renderizarCartasDeck();
                    document.getElementById('deck-contador').textContent = deck.cartas.length;
                    
                    // Atualiza localmente (sem recarregar a API inteira)
                    const item = btn.closest('.resultado-item');
                    if (item) {
                        const qtdSpan = item.querySelector('.qtd');
                        let qtdAtual = parseInt(qtdSpan.textContent);
                        qtdAtual++;
                        qtdSpan.textContent = `${qtdAtual}/3`;
                        
                        if(qtdAtual >= 3 || deck.cartas.length >= 80) {
                            btn.remove(); // Remove o botão se atingir o limite
                            const limiteSpan = document.createElement('span');
                            limiteSpan.className = 'limite';
                            limiteSpan.textContent = '✔';
                            item.appendChild(limiteSpan);
                        }
                    }
                } else {
                    // 🔥 TRATAMENTO DE ERRO: Se o deckManager falhar, força um recarregamento
                    setTimeout(() => realizarPesquisa(), 300);
                }
              });
          });
        } catch (error) {
          resultadosDiv.innerHTML = `<p>Erro: ${error.message}</p>`;
        }
    };

    btnBuscar.addEventListener('click', realizarPesquisa);
    inputBusca.addEventListener('keypress', (e) => { if (e.key === 'Enter') realizarPesquisa(); });
    selectAtributo.addEventListener('change', realizarPesquisa);
  }

  renderizarCartasDeck() {
    const deck = this.deckManager.getDeck(this.deckAtual);
    if (!deck) return;

    let container = this.container.querySelector('#deck-cartas-container');
    if (!container) return;

    if (deck.cartas.length === 0) {
      container.innerHTML = '<p class="sem-resultados">Este deck está vazio. Adicione cartas pela busca lateral.</p>';
      return;
    }

    container.style.cssText = `
      display: grid !important;
      grid-template-columns: repeat(5, 1fr) !important;
      gap: 24px !important;
      width: 100% !important;
      min-width: 350px !important;
      flex: 1 !important;
      min-height: 400px !important;
      padding: 15px !important;
      box-sizing: border-box !important;
      border-radius: 12px !important;
      background: rgba(0, 0, 0, 0.15) !important;
      align-content: start !important;
    `;

    const agrupadas = {};
    deck.cartas.forEach(c => {
      if (!agrupadas[c.id]) agrupadas[c.id] = { carta: c, count: 0 };
      agrupadas[c.id].count++;
    });

    container.innerHTML = ''; 

    Object.values(agrupadas).forEach(({ carta, count }) => {
      const cardElement = criarCard(carta, this.onCardClick);
      
      cardElement.style.cssText = `
        width: 100% !important;
        min-width: 160px !important;
        min-height: 240px !important;
        aspect-ratio: 2 / 3 !important;
        margin: 0 !important;
        position: relative !important;
        display: flex !important;
        flex-direction: column !important;
        border: 2px solid rgba(255, 215, 0, 0.15) !important;
        border-radius: 10px !important;
        padding: 8px !important;
        background: rgba(0, 0, 0, 0.4) !important;
        box-sizing: border-box !important;
        transition: transform 0.2s !important;
        cursor: pointer !important;
        overflow: hidden !important;
      `;

      const containerCard = cardElement.querySelector('.carta-container');

      const badge = document.createElement('span');
      badge.className = 'deck-card-count';
      badge.textContent = `x${count}`;
      containerCard.appendChild(badge);

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✖';
      removeBtn.className = 'btn-remover-carta-deck';
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Remover uma cópia de "${carta.name}" do deck?`)) {
          if (this.deckManager.removerCarta(this.deckAtual, carta.id)) {
            this.abrirDeck(this.deckAtual);
          }
        }
      });
      containerCard.appendChild(removeBtn);

      container.appendChild(cardElement);
    });

    const contador = document.getElementById('deck-contador');
    if (contador) contador.textContent = deck.cartas.length;
  }
}