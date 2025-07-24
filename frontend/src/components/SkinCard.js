import React from 'react';
import './SkinCard.css';

// Função auxiliar para obter a cor e a abreviatura do estado da skin
const getWearInfo = (marketHashName) => {
  if (marketHashName.includes('Factory New')) return { label: 'FN', color: '#4caf50' };
  if (marketHashName.includes('Minimal Wear')) return { label: 'MW', color: '#8bc34a' };
  // A CORREÇÃO ESTÁ NESTA LINHA:
  if (marketHashName.includes('Field-Tested')) return { label: 'FT', color: '#ffeb3b' };
  if (marketHashName.includes('Well-Worn')) return { label: 'WW', color: '#ff9800' };
  if (marketHashName.includes('Battle-Scarred')) return { label: 'BS', color: '#f44336' };
  return null; // Sem estado definido
};


const SkinCard = ({ skin }) => {
  // 1. MELHORIA DE IMAGEM: Usar uma imagem maior (ex: 256x256) em vez do ícone pequeno
  const highQualityIconUrl = skin.icon_url
    .replace(/^http:/, 'https')
    .replace('96fx96f', '256fx256f'); // Pede uma imagem de 256px

  // 2. VERIFICAR SE É STATTRAK
  const isStatTrak = skin.market_hash_name.includes('StatTrak™');
  
  // 3. OBTER INFO DO ESTADO (WEAR)
  const wearInfo = getWearInfo(skin.market_hash_name);

  return (
    <div className="skin-card">
      {/* Indicador StatTrak™ */}
      {isStatTrak && <div className="stattrak-tag">StatTrak™</div>}

      <div className="skin-card-image-container">
        <img src={highQualityIconUrl} alt={skin.name} className="skin-card-image" />
      </div>
      
      <div className="skin-card-info">
        <h3 className="skin-card-name">{skin.name}</h3>
        <p className="skin-card-price">{skin.price || 'Preço indisponível'}</p>
      </div>

      {/* Indicador de Estado (Wear) */}
      {wearInfo && (
        <div className="wear-indicator" style={{ borderTop: `3px solid ${wearInfo.color}` }}>
          {wearInfo.label}
        </div>
      )}
    </div>
  );
};

export default SkinCard;