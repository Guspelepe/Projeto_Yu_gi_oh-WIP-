// api/yugioh.js

const BASE_URL = 'https://db.ygoprodeck.com/api/v7';

/**
 * Busca cartas com paginação.
 * @param {Object} params - Filtros (name, attribute, type, level, etc.)
 * @param {number} offset - Quantas cartas pular
 * @param {number} num - Quantas cartas por página (padrão 20)
 * @returns {Promise<{data: Array, total: number}>}
 */
export async function buscarCartas(params = {}, offset = 0, num = 20) {
  const queryParams = new URLSearchParams();

  // Se tiver 'name', converte para 'fname' (busca difusa)
  if (params.name) {
    queryParams.append('fname', params.name);
    delete params.name;
  }

  // Adiciona os demais filtros
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value && value !== '') {
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

    // A API retorna o total no campo 'meta'
    const total = data.meta?.total_rows || data.data?.length || 0;
    return { data: data.data || [], total };
  } catch (error) {
    console.error('❌ Erro ao buscar cartas:', error);
    throw error;
  }
}

/**
 * Busca por nome (compatibilidade)
 */
export async function buscarPorNome(nome, offset = 0, num = 20) {
  return buscarCartas({ name: nome }, offset, num);
}