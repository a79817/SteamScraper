const path = require('path');
const { fetchPage } = require(path.join(__dirname, '../src/fetch'));

(async () => {
    const data = await fetchPage('P2000 | Amber Fade (Factory New)', 0, 100);
    if (data) {
        console.log(`✅ Sucesso: ${Object.keys(data)}`);
        //console.dir(data, { depth: null, colors: true });
    } else {
        console.log('❌ Falha no fetch');
    }
})();
