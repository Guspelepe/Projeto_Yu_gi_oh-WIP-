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
    this.editor = null;
  }

  // ===== RENDERIZAR LISTA DE DECKS =====
  renderizarLista() {
    this.container.className = '';
    this.container.style.cssText = `
      display: block !important;
      width: 100% !important;
      max-width: 1200px !important;
      margin: 0 auto !important;
      padding: 0 !important;
      background: transparent !important;
    `;

    const decks = this.deckManager.listarDecks();

    if (decks.length === 0) {
      this.container.innerHTML = `
        <div class="deck-lista-vazia">
          <p>Nenhum deck criado ainda.</p>
          <button class="btn-criar-deck">+ Criar novo deck</button>
        </div>
      `;
      this.container.querySelector('.btn-criar-deck')?.addEventListener('click', () => this.criarNovoDeck());
      return;
    }

    let html = `<div class="deck-lista" style="width: 100%; background: rgba(0, 0, 0, 0.3); border-radius: 20px; backdrop-filter: blur(6px); padding: 24px; box-sizing: border-box; min-height: 500px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 10px;">
        <h2 style="color: #ffd700; font-family: 'Yugioh', serif; font-size: 28px; margin: 0;">Meus Decks</h2>
        <button id="btn-voltar-dos-decks" style="background: rgba(255, 255, 255, 0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600;">⬅ Voltar</button>
      </div>
      <button class="btn-criar-deck" style="background: linear-gradient(135deg, #00d4ff, #8351fe); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; font-family: 'Inter', sans-serif; margin-bottom: 24px; transition: transform 0.2s;">+ Criar novo deck</button>
      <div class="deck-grid">`;

    decks.forEach((deck, index) => {
      const qtd = deck.cartas.length;
      html += `
        <div class="deck-item" data-index="${index}">
          <div class="deck-item-capa">
            ${deck.capa ? `<img src="${deck.capa.image_url}" alt="${deck.capa.name}" title="${deck.capa.name}" />` : '<div class="deck-sem-capa">📚</div>'}
          </div>
          <h3>${deck.nome}</h3>
          <p>${qtd}/80 cartas</p>
          <div class="deck-acoes">
            <button class="btn-abrir-deck" data-index="${index}">Abrir</button>
            <button class="btn-editar-deck" data-index="${index}">Editar</button>
            <button class="btn-excluir-deck" data-index="${index}">Excluir</button>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    this.container.innerHTML = html;

    this.container.querySelector('#btn-voltar-dos-decks')?.addEventListener('click', () => {
      document.getElementById('btn-todos').click();
    });

    const grid = this.container.querySelector('.deck-grid');
    if (grid) {
      grid.style.cssText = `
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)) !important;
        gap: 24px !important;
        margin-top: 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
      `;
    }

    this.container.querySelector('.btn-criar-deck')?.addEventListener('click', () => this.criarNovoDeck());
    this.container.querySelectorAll('.btn-abrir-deck').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        this.abrirDeck(idx);
      });
    });
    this.container.querySelectorAll('.btn-editar-deck').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const idx = parseInt(e.target.dataset.index);
        await this.abrirEditor(idx);
      });
    });
    this.container.querySelectorAll('.btn-excluir-deck').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        if (this.deckManager.removerDeck(idx)) this.renderizarLista();
      });
    });
  }

  // ===== CRIAR DECK =====
  async criarNovoDeck() {
    const nome = prompt('Digite o nome do novo deck:');
    if (nome === null) return;
    const nomeCapa = prompt('Digite o nome da carta que será a capa (opcional):');
    let capa = null;
    if (nomeCapa && nomeCapa.trim() !== '') {
      try {
        const resultado = await buscarCartas({ name: nomeCapa.trim() }, 0, 1);
        const cartas = resultado.data || [];
        if (cartas.length > 0) {
          capa = {
            id: cartas[0].id,
            name: cartas[0].name,
            image_url: cartas[0].card_images[0].image_url,
          };
          alert(`✅ Capa definida: ${capa.name}`);
        } else {
          alert('⚠️ Nenhuma carta encontrada.');
        }
      } catch (error) {
        console.error(error);
        alert('Erro ao buscar carta.');
      }
    }
    if (this.deckManager.criarDeck(nome, capa)) this.renderizarLista();
  }

  // ===== ABRIR EDITOR =====
  async abrirEditor(index) {
    if (!this.editor) {
      const editorContainer = document.createElement('div');
      editorContainer.id = 'deck-editor-container';
      editorContainer.style.display = 'none';
      document.body.appendChild(editorContainer);
      const { DeckEditorUI } = await import('./DeckEditorUI.js');
      this.editor = new DeckEditorUI(editorContainer, this.deckManager, () => this.renderizarLista());
    }
    this.editor.container.style.display = 'block';
    this.editor.abrir(index);
  }

  // ===== ABRIR DECK =====
  async abrirDeck(index) {
    const deck = this.deckManager.getDeck(index);
    if (!deck) return;
    this.deckAtual = index;
    const tipos = this.contarTipos(deck.cartas);

    this.container.innerHTML = '';
    this.container.className = '';
    this.container.style.cssText = `
      display: block !important;
      width: 100% !important;
      max-width: 1200px !important;
      margin: 0 auto !important;
      padding: 0 !important;
      background: transparent !important;
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'deck-visualizacao-wrapper';

    const sidebar = document.createElement('div');
    sidebar.className = 'deck-sidebar';
    sidebar.innerHTML = `
      <h3 style="font-family: 'Yugioh', serif; color: #000;">Buscar carta</h3>
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
      <div class="deck-header" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap;">
          <h2 style="color: #fff; font-family: 'Yugioh', serif; font-size: 28px; margin: 0;">${deck.nome} <span style="font-size: 16px; font-family: 'Inter', sans-serif; color: #aaa;">(${deck.cartas.length}/80)</span></h2>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn-exportar-deck" data-index="${index}">Exportar</button>
            <button class="btn-voltar-decks" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s;">⬅ Voltar</button>
          </div>
        </div>
        <div class="deck-estatisticas" style="display: flex; gap: 24px; background: rgba(0, 0, 0, 0.5); padding: 12px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); width: fit-content;">
          <span style="display: flex; align-items: center; gap: 8px; color: #fff; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px;"><span style="color: #4caf50;">●</span> Monstros: <span style="color: #fff;">${tipos.monstros}</span></span>
          <span style="display: flex; align-items: center; gap: 8px; color: #fff; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px;"><span style="color: #42a5f5;">●</span> Magias: <span style="color: #fff;">${tipos.magias}</span></span>
          <span style="display: flex; align-items: center; gap: 8px; color: #fff; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px;"><span style="color: #ab47bc;">●</span> Armadilhas: <span style="color: #fff;">${tipos.armadilhas}</span></span>
        </div>
      </div>
      <div id="deck-cartas-container" class="deck-cartas-grid"></div>
    `;

    wrapper.appendChild(sidebar);
    wrapper.appendChild(mainArea);
    this.container.appendChild(wrapper);

    const btnExportar = mainArea.querySelector('.btn-exportar-deck');
    btnExportar?.addEventListener('click', () => this.exportarDeck(index));

    const btnVoltar = mainArea.querySelector('.btn-voltar-decks');
    btnVoltar?.addEventListener('click', () => this.renderizarLista());

    this.renderizarCartasDeck();
    this.configurarPesquisa(index, sidebar);
  }

  // ===== EXPORTAR DECK =====
  exportarDeck(index) {
    const deck = this.deckManager.getDeck(index);
    if (!deck) {
      alert('❌ Deck não encontrado.');
      return;
    }
    if (deck.cartas.length === 0) {
      alert('⚠️ O deck está vazio. Não há nada para exportar.');
      return;
    }

    const agrupadas = {};
    deck.cartas.forEach(c => {
      if (!agrupadas[c.id]) agrupadas[c.id] = { carta: c, count: 0 };
      agrupadas[c.id].count++;
    });

    let texto = `=== ${deck.nome} ===\n`;
    texto += `Total: ${deck.cartas.length} cartas\n\n`;
    Object.values(agrupadas).forEach(({ carta, count }) => {
      const nome = carta.name;
      const tipo = carta.type || '?';
      const atk = carta.atk || '?';
      const def = carta.def || '?';
      texto += `${count}x ${nome} (${tipo}) | ATK: ${atk} | DEF: ${def}\n`;
    });

    console.log('📤 Texto exportado:\n', texto);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto)
        .then(() => alert('✅ Deck exportado para a área de transferência!'))
        .catch(() => this.fallbackCopiar(texto));
    } else {
      this.fallbackCopiar(texto);
    }
  }

  fallbackCopiar(texto) {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      alert('✅ Deck exportado para a área de transferência!');
    } catch (e) {
      prompt('📋 Copie o texto manualmente:', texto);
    }
    document.body.removeChild(textarea);
  }

  // ===== CONTAR TIPOS =====
  contarTipos(cartas) {
    let monstros = 0, magias = 0, armadilhas = 0;
    cartas.forEach(c => {
      const tipo = c.type || '';
      if (tipo.includes('Spell')) magias++;
      else if (tipo.includes('Trap')) armadilhas++;
      else monstros++;
    });
    return { monstros, magias, armadilhas };
  }

  // ===== CONFIGURAR PESQUISA =====
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
          const cartaJSON = JSON.stringify(carta).replace(/"/g, '&quot;');
          html += `
            <li class="resultado-item">
              <img src="${carta.card_images[0].image_url}" alt="${carta.name}" width="38" />
              <span>${carta.name}</span>
              <span class="qtd">${qtd}/3</span>
              ${podeAdicionar ? `<button class="btn-add-carta-deck" data-carta="${cartaJSON}">+</button>` : '<span class="limite">✔</span>'}
            </li>
          `;
        });
        html += '</ul>';
        resultadosDiv.innerHTML = html;

        resultadosDiv.querySelectorAll('.btn-add-carta-deck').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            let carta;
            try {
              carta = JSON.parse(btn.dataset.carta.replace(/&quot;/g, '"'));
            } catch (error) {
              console.error("❌ ERRO AO LER A CARTA:", error);
              return;
            }
            
            if (this.deckManager.adicionarCarta(index, carta)) {
              this.renderizarCartasDeck();
              
              const deckAtualizado = this.deckManager.getDeck(index);
              const novaQtd = deckAtualizado.cartas.filter(c => c.id === carta.id).length;
              
              const itemLi = btn.closest('li.resultado-item');
              if (itemLi) {
                const qtdSpan = itemLi.querySelector('.qtd');
                if (qtdSpan) qtdSpan.textContent = `${novaQtd}/3`;
                
                if (novaQtd >= 3) {
                  const checkSpan = document.createElement('span');
                  checkSpan.className = 'limite';
                  checkSpan.textContent = '✔';
                  btn.replaceWith(checkSpan);
                }
              }
              document.dispatchEvent(new CustomEvent('deckAtualizado'));
            } else {
              realizarPesquisa();
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

  // ===== RENDERIZAR CARTAS DO DECK =====
  renderizarCartasDeck() {
    const deck = this.deckManager.getDeck(this.deckAtual);
    if (!deck) return;

    let container = this.container.querySelector('#deck-cartas-container');
    if (!container) return;

    if (deck.cartas.length === 0) {
      container.innerHTML = '<p class="sem-resultados">Este deck está vazio.</p>';
      return;
    }

    // 🔥 CORREÇÃO AQUI: Trocamos de 5 para 3 colunas no JS
    container.style.cssText = `
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 24px !important;
      width: 100% !important;
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
    const fragment = document.createDocumentFragment();

    Object.values(agrupadas).forEach(({ carta, count }) => {
      const cardElement = criarCard(carta, this.onCardClick);
      cardElement.style.cssText = `
        width: 100% !important;
        aspect-ratio: 2 / 3 !important;
        margin: 0 !important;
        position: relative !important;
        display: flex !important;
        flex-direction: column !important;
        border: 2px solid rgba(255, 215, 0, 0.15) !important;
        border-radius: 10px !important;
        padding: 8px !important;
        min-height: 240px !important;
        min-width: 160px !important;
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
        if (confirm(`Remover uma cópia de "${carta.name}"?`)) {
          if (this.deckManager.removerCarta(this.deckAtual, carta.id)) {
            this.abrirDeck(this.deckAtual);
          }
        }
      });
      containerCard.appendChild(removeBtn);
      fragment.appendChild(cardElement);
    });

    container.appendChild(fragment);
    const contador = document.getElementById('deck-contador');
    if (contador) contador.textContent = deck.cartas.length;
  }
}