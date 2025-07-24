const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio'); // Precisará do Cheerio no backend
const { fetchSearchPage, fetchPage } = require('./fetch');
const weaponData = require('./data');

const app = express();
app.use(cors());
const PORT = 3001; // Garanta que esta é a porta do seu backend

// Endpoint para pesquisa
app.get('/api/search', async (req, res) => {
  const { weapon, query } = req.query;
  const searchQuery = `${weapon || ''} ${query || ''}`;
  
  const data = await fetchSearchPage(searchQuery, 0, 100);
  if (!data || !data.results_html) {
    return res.json({ results: [] });
  }

  // Processar o HTML e devolver JSON limpo
  const $ = cheerio.load(data.results_html);
  const results = [];
  $('a.market_listing_row_link').each((_, el) => {
    const name = $(el).find('span.market_listing_item_name').text().trim();
    const price = $(el).find('span.normal_price span.market_listing_price').text().trim();
    const iconUrl = $(el).find('img.market_listing_item_img').attr('src');
    
    results.push({
      market_hash_name: name, // O nome completo é o melhor identificador
      name: name.split(' | ')[1]?.split(' (')[0] || name,
      price: price,
      icon_url: iconUrl,
    });
  });

  res.json({ results });
});

// Endpoint para detalhes da skin
app.get('/api/skin/:marketHashName', async (req, res) => {
    const { marketHashName } = req.params;
    const data = await fetchPage(decodeURIComponent(marketHashName), 0, 100);
    // Aqui, você processaria 'data' para extrair e formatar os listings e outras informações
    res.json(data); // Por agora, enviamos os dados brutos
});


app.listen(PORT, () => console.log(`Backend a correr em http://localhost:${PORT}`));