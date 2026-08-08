// components/DeckManager.js

import { getDecks, setDecks } from '../utils/storage.js';

export class DeckManager {
  constructor() {
    this.decks = getDecks();
  }

  listarDecks() {
    return this.decks;
  }

  criarDeck(nome, capa = null) {
    if (!nome || nome.trim() === '') {
      alert('Digite um nome para o deck.');
      return false;
    }
    if (this.decks.find(d => d.nome.toLowerCase() === nome.trim().toLowerCase())) {
      alert('Já existe um deck com este nome.');
      return false;
    }
    this.decks.push({ nome: nome.trim(), cartas: [], capa: capa });
    setDecks(this.decks); // 🔥 Correto, sem _salvar
    return true;
  }

  removerDeck(index) {
    if (index < 0 || index >= this.decks.length) return false;
    if (confirm(`Deseja excluir o deck "${this.decks[index].nome}"?`)) {
      this.decks.splice(index, 1);
      setDecks(this.decks);
      return true;
    }
    return false;
  }

  renomearDeck(index, novoNome) {
    if (index < 0 || index >= this.decks.length) return false;
    if (!novoNome || novoNome.trim() === '') {
      alert('Digite um nome válido.');
      return false;
    }
    if (this.decks.find((d, i) => i !== index && d.nome.toLowerCase() === novoNome.trim().toLowerCase())) {
      alert('Já existe um deck com este nome.');
      return false;
    }
    this.decks[index].nome = novoNome.trim();
    setDecks(this.decks);
    return true;
  }

  adicionarCarta(indexDeck, carta) {
    if (indexDeck < 0 || indexDeck >= this.decks.length) return false;
    const deck = this.decks[indexDeck];
    if (deck.cartas.length >= 80) {
      alert('Este deck já atingiu o limite de 80 cartas.');
      return false;
    }
    const count = deck.cartas.filter(c => c.id === carta.id).length;
    if (count >= 3) {
      alert('Você já tem 3 cópias desta carta no deck.');
      return false;
    }
    deck.cartas.push(carta);
    setDecks(this.decks);
    return true;
  }

  removerCarta(indexDeck, cartaId) {
    if (indexDeck < 0 || indexDeck >= this.decks.length) return false;
    const deck = this.decks[indexDeck];
    const index = deck.cartas.findIndex(c => c.id === cartaId);
    if (index === -1) return false;
    deck.cartas.splice(index, 1);
    setDecks(this.decks);
    return true;
  }

  getDeck(index) {
    return this.decks[index] || null;
  }

  duplicarDeck(index, novoNome) {
    if (index < 0 || index >= this.decks.length) return false;
    const original = this.decks[index];
    if (!novoNome || novoNome.trim() === '') {
      alert('Digite um nome para o deck duplicado.');
      return false;
    }
    if (this.decks.find(d => d.nome.toLowerCase() === novoNome.trim().toLowerCase())) {
      alert('Já existe um deck com este nome.');
      return false;
    }
    // Copia o deck (incluindo capa e cartas)
    const copia = {
      nome: novoNome.trim(),
      cartas: [...original.cartas], // copia o array de cartas
      capa: original.capa ? { ...original.capa } : null, // copia a capa
    };
    this.decks.push(copia);
    setDecks(this.decks);
    return true;
  }
}