const { fetchPage } = require('./fetch');

async function listSkinsForWeapon(weaponName) {
  const skins = new Set();
  let start = 0;
  const count = 100;
  const maxPages = 20;
  let page = 0;

  while (page < maxPages) {
    const data = await fetchPage(weaponName, start, count);
    if (!data || !data.assets || !data.assets["730"] || !data.assets["730"]["2"]) break;

    const appAssets = data.assets["730"]["2"];
    for (const assetId in appAssets) {
      const item = appAssets[assetId];
      const name = item.market_hash_name || item.name || '';
      if (name.startsWith(`${weaponName} | `)) {
        const skin = name.split(`${weaponName} | `)[1];
        if (skin) skins.add(skin.trim());
      }
    }

    if (!data.total_count || start + count >= data.total_count) break;

    start += count;
    page++;
  }

  return Array.from(skins).sort();
}

module.exports = { listSkinsForWeapon };
