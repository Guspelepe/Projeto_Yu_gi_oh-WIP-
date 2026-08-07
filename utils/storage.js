// utils/storage.js

const CHAVE_FAVORITOS = 'yugioh_favoritos';
const CHAVE_DECKS = 'yugioh_decks';

// ===== FAVORITOS =====
export function getFavoritos() {
  const data = localStorage.getItem(CHAVE_FAVORITOS);
  return data ? JSON.parse(data) : [];
}

export function setFavoritos(favoritos) {
  localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
}

export function adicionarFavorito(cartaId) {
  const favoritos = getFavoritos();
  if (!favoritos.includes(cartaId)) {
    favoritos.push(cartaId);
    setFavoritos(favoritos);
  }
}

export function removerFavorito(cartaId) {
  let favoritos = getFavoritos();
  favoritos = favoritos.filter(id => id !== cartaId);
  setFavoritos(favoritos);
}

export function isFavorito(cartaId) {
  return getFavoritos().includes(cartaId);
}

// ===== DECKS =====
export function getDecks() {
  const data = localStorage.getItem(CHAVE_DECKS);
  return data ? JSON.parse(data) : [];
}

export function setDecks(decks) {
  localStorage.setItem(CHAVE_DECKS, JSON.stringify(decks));
}