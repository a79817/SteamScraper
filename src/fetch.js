const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const BASE_LISTING_URL = 'https://steamcommunity.com/market/listings/730';

/**
 * Faz fetch a uma página de listagens da Steam Market.
 * @param {string} itemName - Nome exato do item (ex: "Charm | Stitch-Loaded").
 * @param {number} start - Índice inicial da listagem (multiplo de 100).
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
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`❌ Erro HTTP ${response.status} em: ${url}`);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error(`⚠️ Erro ao tentar obter ${itemName} (${start}): ${err.message}`);
        return null;
    }
}

/**
 * Faz fetch a uma página de resultados da Steam Search (pesquisa global).
 * @param {string} query - Termo de pesquisa (ex: "AK-47 |").
 * @param {number} start - Índice de início.
 * @param {number} count - Quantos resultados (máx. 100).
 * @returns {Promise<Object|null>} - Resposta JSON com `results_html`.
 */
async function fetchSearchPage(query, start = 0, count = 100) {
    const url = `https://steamcommunity.com/market/search/render/` +
        `?query=${encodeURIComponent(query)}` +
        `&appid=730&start=${start}&count=${count}` +
        `&country=PT&language=portuguese&currency=3`;

    console.log(`🔍 Search: ${query} (${start}–${start + count})`);

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json'
            }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(`❌ Erro: ${err.message}`);
        return null;
    }
}

module.exports = {
    fetchPage,
    fetchSearchPage
};

