// src/api/yugioh.js

const BASE_URL = 'https://db.ygoprodeck.com/api/v7';

/**
 * Busca cartas da API YGOPRODeck com parâmetros de filtro e paginação
 * @param {Object} params - Parâmetros de filtro (name, attribute, type, level, atk, def, etc.)
 * @param {number} offset - Número de cartas para pular (paginação)
 * @param {number} num - Quantidade de cartas por página (máximo 50)
 * @returns {Promise<Array>} Array de cartas
 */
export async function buscarCartas(params = {}, offset = 0, num = 20) {
  try {
    // Parâmetros da API
    const queryParams = new URLSearchParams();
    
    // Adiciona filtros à query
    Object.keys(params).forEach(key => {
      if (params[key] && params[key] !== '') {
        // Para 'level' e 'atk' que podem ser numéricos
        if (['level', 'atk', 'def'].includes(key)) {
          queryParams.append(key, params[key]);
        } else {
          queryParams.append(key, params[key]);
        }
      }
    });

    // Paginação
    queryParams.append('offset', offset);
    queryParams.append('num', Math.min(num, 50)); // Máximo 50 por requisição

    const url = `${BASE_URL}/cardinfo.php?${queryParams.toString()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return [];
    }
    
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar cartas:', error);
    throw error;
  }
}

/**
 * Busca cartas por nome (busca exata ou parcial)
 * @param {string} nome - Nome da carta ou parte do nome
 * @param {number} offset - Paginação
 * @param {number} num - Quantidade por página
 * @returns {Promise<Array>}
 */
export async function buscarPorNome(nome, offset = 0, num = 20) {
  if (!nome || nome.trim() === '') {
    return buscarCartas({}, offset, num);
  }
  return buscarCartas({ name: nome.trim() }, offset, num);
}

/**
 * Busca cartas por atributo (DARK, LIGHT, FIRE, WATER, EARTH, WIND, DIVINE)
 * @param {string} atributo - Atributo da carta
 * @param {number} offset - Paginação
 * @param {number} num - Quantidade por página
 * @returns {Promise<Array>}
 */
export async function buscarPorAtributo(atributo, offset = 0, num = 20) {
  if (!atributo || atributo === '') {
    return buscarCartas({}, offset, num);
  }
  return buscarCartas({ attribute: atributo.toUpperCase() }, offset, num);
}

/**
 * Busca cartas por tipo (Monster, Spell, Trap, etc.)
 * @param {string} tipo - Tipo da carta (ex: 'Monster', 'Spell Card', 'Trap Card')
 * @param {number} offset - Paginação
 * @param {number} num - Quantidade por página
 * @returns {Promise<Array>}
 */
export async function buscarPorTipo(tipo, offset = 0, num = 20) {
  if (!tipo || tipo === '') {
    return buscarCartas({}, offset, num);
  }
  return buscarCartas({ type: tipo }, offset, num);
}

/**
 * Busca cartas por nível/rank (para monstros)
 * @param {number} nivel - Nível da carta (1 a 12)
 * @param {number} offset - Paginação
 * @param {number} num - Quantidade por página
 * @returns {Promise<Array>}
 */
export async function buscarPorNivel(nivel, offset = 0, num = 20) {
  if (!nivel || nivel === '') {
    return buscarCartas({}, offset, num);
  }
  return buscarCartas({ level: parseInt(nivel) }, offset, num);
}

/**
 * Busca cartas por ATK mínimo e máximo
 * @param {number} atkMin - ATK mínimo
 * @param {number} atkMax - ATK máximo
 * @param {number} offset - Paginação
 * @param {number} num - Quantidade por página
 * @returns {Promise<Array>}
 */
export async function buscarPorAtaque(atkMin, atkMax, offset = 0, num = 20) {
  const params = {};
  if (atkMin && atkMin !== '') params.atk = `>=${parseInt(atkMin)}`;
  if (atkMax && atkMax !== '') params.atk = `<=${parseInt(atkMax)}`;
  // A API suporta intervalos com '>=', '<=', etc.
  // Se ambos forem informados, a API pode não suportar dois valores, então usamos só um
  if (atkMin && atkMax) {
    // Caso a API suporte range, podemos tentar com 'between'
    // Ou buscar primeiro por >= min e depois filtrar no front
    params.atk = `>=${parseInt(atkMin)}`;
  }
  return buscarCartas(params, offset, num);
}

/**
 * Busca cartas por raça (archetype)
 * @param {string} archetype - Raça da carta (ex: 'Dragon', 'Spellcaster')
 * @param {number} offset - Paginação
 * @param {number} num - Quantidade por página
 * @returns {Promise<Array>}
 */
export async function buscarPorRaca(archetype, offset = 0, num = 20) {
  if (!archetype || archetype === '') {
    return buscarCartas({}, offset, num);
  }
  return buscarCartas({ archetype: archetype }, offset, num);
}

/**
 * Busca uma carta específica por ID
 * @param {number} id - ID da carta
 * @returns {Promise<Object|null>}
 */
export async function buscarPorId(id) {
  try {
    const data = await buscarCartas({ id: id }, 0, 1);
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Erro ao buscar carta por ID:', error);
    return null;
  }
}

/**
 * Busca cartas com múltiplos filtros combinados
 * @param {Object} filtros - Objeto com os filtros (nome, atributo, tipo, nível, atkMin, atkMax, raca)
 * @param {number} offset - Paginação
 * @param {number} num - Quantidade por página
 * @returns {Promise<Array>}
 */
export async function buscarComFiltros(filtros, offset = 0, num = 20) {
  const params = {};
  
  if (filtros.nome && filtros.nome.trim() !== '') {
    params.name = filtros.nome.trim();
  }
  if (filtros.atributo && filtros.atributo !== '') {
    params.attribute = filtros.atributo.toUpperCase();
  }
  if (filtros.tipo && filtros.tipo !== '') {
    params.type = filtros.tipo;
  }
  if (filtros.nivel && filtros.nivel !== '') {
    params.level = parseInt(filtros.nivel);
  }
  if (filtros.raca && filtros.raca !== '') {
    params.archetype = filtros.raca;
  }
  
  // ATK: podemos usar intervalo se a API suportar, ou fazer no front
  if (filtros.atkMin && filtros.atkMin !== '') {
    params.atk = `>=${parseInt(filtros.atkMin)}`;
  }
  if (filtros.atkMax && filtros.atkMax !== '') {
    // Se já tem atkMin, a API pode não suportar dois, então usamos só um
    if (!filtros.atkMin || filtros.atkMin === '') {
      params.atk = `<=${parseInt(filtros.atkMax)}`;
    }
    // Caso contrário, faremos filtro duplo no front (veremos depois)
  }
  
  // DEF similar
  if (filtros.defMin && filtros.defMin !== '') {
    params.def = `>=${parseInt(filtros.defMin)}`;
  }
  if (filtros.defMax && filtros.defMax !== '') {
    if (!filtros.defMin || filtros.defMin === '') {
      params.def = `<=${parseInt(filtros.defMax)}`;
    }
  }
  
  return buscarCartas(params, offset, num);
}

// Exportações padrão para uso direto
export default {
  buscarCartas,
  buscarPorNome,
  buscarPorAtributo,
  buscarPorTipo,
  buscarPorNivel,
  buscarPorAtaque,
  buscarPorRaca,
  buscarPorId,
  buscarComFiltros
};