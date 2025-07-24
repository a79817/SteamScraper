const { fetchSearchPage } = require('../src/fetch');
const cheerio = require('cheerio');

/**
 * Lista todas as skins e os seus desgastes disponíveis para uma arma.
 * @param {string} weaponName - Ex: "AK-47"
 * @returns {Promise<Map<string, Set<string>>>} - Map com skins como chave e conjuntos de desgastes
 */
async function listSkinsWithWearForWeapon(weaponName) {
  const skinMap = new Map();
  const count = 100;
  let start = 0;
  let total = Infinity;
  let page = 1;
  const maxPages = 100;

  while (start < total && page <= maxPages) {
    console.log(`📄 Página ${page}: start=${start}`);
    const query = `${weaponName} |`;
    const data = await fetchSearchPage(query, start, count);

    if (!data || !data.results_html) break;

    const $ = cheerio.load(data.results_html);

    $('span.market_listing_item_name').each((_, el) => {
      const fullName = $(el).text().trim(); // Ex: "AK-47 | Redline (Field-Tested)" ou "AK-47 | Safari Mesh"
      const match = fullName.match(/^(.+?) \| ([^(]+?)(?: \((.+?)\))?$/);

      if (match) {
        const skin = match[2].trim();
        const desgaste = match[3] ? match[3].trim() : 'N/A';
        console.log(`→ Encontrado: ${weaponName} | ${skin} (${desgaste})`);

        if (!skinMap.has(skin)) {
          skinMap.set(skin, new Set());
        }

        skinMap.get(skin).add(desgaste);
      }
    });

    total = data.total_count || total;
    if (start + count >= total) break;

    start += count;
    page++;
  }

  return skinMap;
}

// 🧪 Teste direto
(async () => {
  const weaponName = 'AK-47';
  const resultado = await listSkinsWithWearForWeapon(weaponName);

  const skinsOrdenadas = [...resultado.keys()].sort();
  console.log(`\n🎯 Skins e desgastes disponíveis para "${weaponName}":\n`);

  for (const skin of skinsOrdenadas) {
    const desgastes = [...resultado.get(skin)].sort();
    console.log(`- ${weaponName} | ${skin}: ${desgastes.join(', ')}`);
  }

  console.log(`\n🧾 Total de skins únicas: ${skinsOrdenadas.length}`);
})();
