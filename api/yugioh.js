// api/yugioh.js

const BASE_URL = 'https://db.ygoprodeck.com/api/v7';

/**
 * Busca cartas com paginação e filtros.
 * @param {Object} params - Filtros (name, attribute, type, level, race, etc.)
 * @param {number} offset - Quantas cartas pular
 * @param {number} num - Quantas cartas por página (padrão 20)
 * @returns {Promise<{data: Array, total: number}>}
 */
export async function buscarCartas(params = {}, offset = 0, num = 20) {
  const queryParams = new URLSearchParams();

  // Converte 'name' para 'fname' (busca difusa)
  if (params.name) {
    queryParams.append('fname', params.name);
    delete params.name;
  }

  // 🔥 Adiciona suporte para ID (usado pelos favoritos)
  if (params.id) {
    queryParams.append('id', params.id);
    delete params.id;
  }

  // Adiciona os demais filtros
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value && value !== '' && value !== 'all') {
      queryParams.append(key, value);
    }
  });

  // Paginação
  queryParams.append('offset', offset);
  queryParams.append('num', num);

  const url = `${BASE_URL}/cardinfo.php?${queryParams.toString()}`;
  console.log('🔍 Buscando cartas:', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.error) {
      console.warn('⚠️ API retornou erro:', data.error);
      return { data: [], total: 0 };
    }

    const total = data.meta?.total_rows || data.data?.length || 0;
    return { data: data.data || [], total };
  } catch (error) {
    console.error('❌ Erro ao buscar cartas:', error);
    throw error;
  }
}

export async function buscarPorNome(nome, offset = 0, num = 20) {
  return buscarCartas({ name: nome }, offset, num);
}