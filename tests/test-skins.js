const { fetchSearchPage } = require('../src/fetch');

(async () => {
  const query = 'AK-47 |';
  const start = 0;
  const count = 100;

  const data = await fetchSearchPage(query, start, count);

  if (data) {
    console.log('\n🔑 Chaves da resposta:');
    console.log(Object.keys(data));

    console.log('\n📄 Campo results_html (primeiros 500 caracteres):\n');
    console.log(data.results_html.slice(0, 500000)); // corta para não ser enorme

    // Ou para ver tudo:
    // console.log(data.results_html);
  } else {
    console.log('❌ Falha ao obter dados');
  }
})();
