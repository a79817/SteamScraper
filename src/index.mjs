export default {
  async fetch(request) {
    const originalUrl = new URL(request.url);
    const path = originalUrl.pathname.replace(/^\/+/, '');
    const steamBase = "https://steamcommunity.com/";
    const steamURL = new URL(steamBase + path);

    // Copia os parâmetros
    for (const [key, value] of originalUrl.searchParams) {
      steamURL.searchParams.set(key, value);
    }

    try {
      const steamResponse = await fetch(steamURL.toString(), {
        headers: {
          // Tenta um User-Agent real de browser moderno
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'pt-PT,pt;q=0.9,en;q=0.8'
        }
      });

      const data = await steamResponse.text();

      return new Response(data, {
        status: steamResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (err) {
      return new Response(`Erro no proxy: ${err.message}`, { status: 500 });
    }
  }
};
