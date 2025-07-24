const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

// ⚙️ Proxy toggle
const BASE_PROXY_URL = 'https://steam-proxy.211kas.workers.dev';

const BASE_LISTING_URL = `${BASE_PROXY_URL}/market/listings/730`;
const BASE_SEARCH_URL = `${BASE_PROXY_URL}/market/search/render`;


/**
 * Faz fetch a uma página de listagens da Steam Market.
 * @param {string} itemName - Nome exato do item (ex: "Charm | Stitch-Loaded").
 * @param {number} start - Índice inicial da listagem (múltiplo de 100).
 * @param {number} count - Quantidade de itens a obter (máx. 100).
 * @returns {Promise<Object|null>} - Objeto JSON com os dados da resposta, ou null em caso de erro.
 */
async function fetchPage(itemName, start = 0, count = 100) {
  const encodedItem = encodeURIComponent(itemName);
  const url = `${BASE_LISTING_URL}/${encodedItem}/render/?start=${start}&count=${count}&country=PT&language=portuguese&currency=3`;

  console.log(`📦 A obter [${itemName}] de ${start} a ${start + count}...`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Erro HTTP ${response.status} em: ${url}`);
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error(`⚠️ Erro ao tentar obter ${itemName} (${start}): ${err.message}`);
    return null;
  }
}

/**
 * Faz fetch a uma página da Steam Search API.
 * @param {string} query - Termo de pesquisa (ex: "AK-47 |")
 * @param {number} start - Índice de início (múltiplo de 10).
 * @param {number} count - Número de resultados a obter (Steam limita a 10 no real, mas Worker pode mudar isso).
 * @returns {Promise<Object|null>}
 */
async function fetchSearchPage(query, start = 0, count = 10) {
  const url = `${BASE_SEARCH_URL}?query=${encodeURIComponent(query)}&appid=730&start=${start}&count=${count}&country=PT&language=portuguese&currency=3`;

  console.log(`🔍 Search: ${query} (start=${start}, count=${count})`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Erro HTTP ${response.status} em: ${url}`);
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error(`⚠️ Erro ao fazer fetch da search page: ${err.message}`);
    return null;
  }
}

module.exports = {
  fetchPage,
  fetchSearchPage,
};
