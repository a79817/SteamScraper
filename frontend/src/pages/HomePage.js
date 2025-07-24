import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './HomePage.css';

// Funções e dados importados
import { rifles, smgs, heavy, pistols } from '../data/Weapons';
import { searchSkins } from '../api/Skins';
import SkinCard from '../components/SkinCard';

const HomePage = () => {
  // Estados para gerir os controlos do formulário
  const [selectedType, setSelectedType] = useState('rifles');
  const [selectedWeapon, setSelectedWeapon] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para gerir os resultados da API
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const weaponTypes = { rifles, smgs, heavy, pistols };

  const handleSearch = async () => {
    if (!selectedWeapon && !searchTerm) {
      alert("Por favor, selecione uma arma ou insira um termo de pesquisa.");
      return;
    }
    
    setLoading(true);
    setHasSearched(true);
    setResults([]);

    const searchResults = await searchSkins(selectedWeapon, searchTerm);
    setResults(searchResults);
    
    setLoading(false);
  };

  return (
    <div className="homepage">
      <section className="hero-section">
        <h2>Encontre a sua Skin Perfeita</h2>
        <p>Pesquise e analise skins do Counter-Strike 2 em tempo real.</p>
      </section>
      
      <section className="search-section">
        <div className="filter-controls">
          <select 
            className="custom-select"
            value={selectedType} 
            onChange={e => {
              setSelectedType(e.target.value);
              setSelectedWeapon('');
            }}
          >
            <option value="rifles">Rifles</option>
            <option value="smgs">SMGs</option>
            <option value="heavy">Heavy</option>
            <option value="pistols">Pistolas</option>
          </select>

          <select 
            className="custom-select"
            value={selectedWeapon} 
            onChange={e => setSelectedWeapon(e.target.value)}
            disabled={!selectedType}
          >
            <option value="">Selecione a arma</option>
            {selectedType && weaponTypes[selectedType].map(weapon => (
              <option key={weapon} value={weapon}>{weapon}</option>
            ))}
          </select>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Nome da skin (ex: Redline)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyPress={(event) => event.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} disabled={loading}>
              {loading ? '...' : <FaSearch />}
            </button>
          </div>
        </div>
      </section>

      <section className="results-section">
        {loading && <div className="loader">A Carregar...</div>}
        
        {!loading && results.length > 0 && (
          <div className="results-grid">
            {results.map((skin) => (
              <Link 
                key={skin.market_hash_name} 
                to={`/skin/${encodeURIComponent(skin.market_hash_name)}`}
                className="skin-card-link"
              >
                <SkinCard skin={skin} />
              </Link>
            ))}
          </div>
        )}
        
        {!loading && results.length === 0 && hasSearched && (
          <div className="no-results">
            <p>Nenhuma skin encontrada para os critérios selecionados.</p>
          </div>
        )}
      </section>
    </div>
  );
};

// ESTA É A LINHA CRÍTICA QUE ESTAVA A FALTAR
export default HomePage;