import React from 'react';
import './SkinCard.css';

const SkinCard = ({ skin }) => {
  // A API da Steam por vezes não devolve a imagem com https
  const secureIconUrl = skin.icon_url.replace(/^http:/, 'https');

  return (
    <div className="skin-card">
      <div className="skin-card-image-container">
        <img src={secureIconUrl} alt={skin.name} className="skin-card-image" />
      </div>
      <div className="skin-card-info">
        <h3 className="skin-card-name">{skin.name}</h3>
        <p className="skin-card-price">{skin.price || 'Preço indisponível'}</p>
      </div>
    </div>
  );
};

export default SkinCard;