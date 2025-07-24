import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSkinDetails } from '../api/Skins';
import './SkinDetailPage.css';

const SkinDetailPage = () => {
  // 1. Obter o parâmetro da URL
  const { marketHashName } = useParams();
  
  const [skinData, setSkinData] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para carregar os dados
    const fetchSkinData = async () => {
      setLoading(true);
      setError(null);
      
      const data = await getSkinDetails(marketHashName);
      
      if (data && data.success) {
        setSkinData(data);
        // Os listings estão dentro de data.listinginfo
        const formattedListings = Object.values(data.listinginfo || {});
        setListings(formattedListings);
      } else {
        setError("Não foi possível carregar os dados desta skin.");
      }
      
      setLoading(false);
    };

    fetchSkinData();
  }, [marketHashName]); // <-- Executa sempre que o nome da skin na URL mudar

  if (loading) {
    return <div className="loader">A carregar detalhes da skin...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="skin-detail-page">
      <div className="skin-info-column">
        {/* Adicionar aqui a imagem grande e informações gerais quando o backend as fornecer */}
        <h1>{decodeURIComponent(marketHashName)}</h1>
        <div className="skin-image-large-container">
          <img 
            src={`https://community.cloudflare.steamstatic.com/economy/image/${skinData?.assets?.[Object.keys(skinData.assets)[0]]?.icon_url_large}`}
            alt={decodeURIComponent(marketHashName)}
          />
        </div>
      </div>

      <div className="skin-listings-column">
        <h2>Listings no Mercado</h2>
        <div className="listings-table-container">
          <table className="listings-table">
            <thead>
              <tr>
                <th>Preço</th>
                <th>Float</th>
                <th>Pattern</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {listings.length > 0 ? (
                listings.map(listing => (
                  <tr key={listing.listingid}>
                    <td>{listing.converted_price_per_unit / 100} {listing.converted_currency_symbol}</td>
                    <td className="placeholder-data">N/A</td>
                    <td className="placeholder-data">N/A</td>
                    <td>
                      <a 
                        href={`https://steamcommunity.com/market/listings/730/${encodeURIComponent(marketHashName)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="buy-button"
                      >
                        Ver no Mercado
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Nenhum listing encontrado.</td>
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