import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSkinDetails } from '../api/Skins';
import './SkinDetailPage.css';

const SkinDetailPage = () => {
  const { marketHashName } = useParams();
  
  const [skinData, setSkinData] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Guardar o URL da imagem base para usar na tabela
  const [baseSkinImageUrl, setBaseSkinImageUrl] = useState('');

  useEffect(() => {
    const fetchSkinData = async () => {
      setLoading(true);
      setError(null);
      
      const data = await getSkinDetails(marketHashName);
      
      if (data && data.success) {
        setSkinData(data);
        const formattedListings = Object.values(data.listinginfo || {});
        setListings(formattedListings);

        // Extrai e guarda o URL do ícone da skin para usar na tabela
        // Assume que o primeiro asset é representativo
        const assetKey = Object.keys(data.assets || {})[0];
        if (assetKey) {
            const iconUrl = data.assets[assetKey].icon_url;
            setBaseSkinImageUrl(`https://community.cloudflare.steamstatic.com/economy/image/${iconUrl}`);
        }

      } else {
        setError("Não foi possível carregar os dados desta skin.");
      }
      
      setLoading(false);
    };

    fetchSkinData();
  }, [marketHashName]);

  if (loading) {
    return <div className="loader">A carregar detalhes da skin...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="skin-detail-page">
      <div className="skin-info-column">
        <h1>{decodeURIComponent(marketHashName)}</h1>
        <div className="skin-image-large-container">
          <img 
            src={`https://community.cloudflare.steamstatic.com/economy/image/${skinData?.assets?.[Object.keys(skinData.assets)[0]]?.icon_url_large}`}
            alt={decodeURIComponent(marketHashName)}
          />
        </div>
        {/* Futuramente pode adicionar aqui mais detalhes como float, pattern, etc. */}
      </div>

      <div className="skin-listings-column">
        <h2>Listings no Mercado</h2>
        <div className="listings-table-container">
          <table className="listings-table">
            <thead>
              <tr>
                {/* NOVA COLUNA PARA A IMAGEM */}
                <th>Skin</th>
                <th>Preço</th>
                <th className="placeholder-data">Float</th>
                <th className="placeholder-data">Pattern</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {listings.length > 0 ? (
                listings.map(listing => (
                  <tr key={listing.listingid}>
                    {/* CELULA COM A IMAGEM DA SKIN */}
                    <td>
                      <img 
                        src={baseSkinImageUrl} 
                        alt="skin" 
                        className="listing-skin-image" 
                      />
                    </td>
                    <td>{(listing.converted_price_per_unit / 100).toFixed(2)} {listing.converted_currency_symbol}</td>
                    <td className="placeholder-data">N/A</td>
                    <td className="placeholder-data">N/A</td>
                    <td>
                      <a 
                        href={`https://steamcommunity.com/market/listings/730/${encodeURIComponent(marketHashName)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="buy-button"
                      >
                        Ver
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Nenhum listing encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SkinDetailPage;