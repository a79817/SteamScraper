const { fetchSearchPage } = require('./fetch');
const cheerio = require('cheerio');

/**
 * Extrai todas as skins de uma arma e os respetivos estados de desgaste.
 * @param {string} weapon - Nome da arma (ex: "AK-47")
 * @returns {Promise<Map<string, Set<string>>>}
 */
async function listAllSkinsWithWear(weapon) {
  const skinMap = new Map();
  const maxPages = Infinity; // Segurança extra, Steam mostra 43 no máximo
  const count = 10; // Steam limita a 10 resultados por página

  for (let page = 0; page < maxPages; page++) {
    const start = page * count;
    const data = await fetchSearchPage(`${weapon} |`, start, count);

    if (!data || !data.results_html) {
      console.warn(`⚠️ Página ${page + 1} vazia ou erro.`);
      break;
    }

    const $ = cheerio.load(data.results_html);
    const items = $('span.market_listing_item_name');

    if (items.length === 0) break; // Fim da lista

    items.each((_, el) => {
      const fullName = $(el).text().trim(); // Ex: "AK-47 | Redline (Gasto)"
      const match = fullName.match(/^(.+?) \| (.+?) \((.+?)\)$/);

      if (match) {
        const skin = match[2].trim();
        const desgaste = match[3].trim();

        if (!skinMap.has(skin)) skinMap.set(skin, new Set());
        skinMap.get(skin).add(desgaste);
      }
    });
  }

  return skinMap;
}

// 🧪 Teste
(async () => {
  const weapon = 'AK-47';
  const resultados = await listAllSkinsWithWear(weapon);

  const ordenadas = [...resultados.keys()].sort();
  console.log(`\n🎯 Skins e desgastes para "${weapon}":\n`);
  for (const skin of ordenadas) {
    const desgastes = [...resultados.get(skin)].sort();
    console.log(`- ${weapon} | ${skin}: ${desgastes.join(', ')}`);
  }

  console.log(`\n🧾 Total de skins únicas: ${ordenadas.length}`);
})();
