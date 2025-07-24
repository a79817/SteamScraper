import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './HomePage.css';

// Funções e dados importados
import { rifles, smgs, heavy, pistols } from '../data/Weapons';
import * as rifleSkins from '../data/Rifles';
import * as smgSkins from '../data/Smgs';
import * as heavySkins from '../data/Heavy';
import * as pistolSkins from '../data/Pistols';
import { searchSkins } from '../api/Skins';
import SkinCard from '../components/SkinCard';

// Objeto que agrega todas as skins para fácil acesso
const allSkinsData = {
  ...rifleSkins,
  ...smgSkins,
  ...heavySkins,
  ...pistolSkins,
};

// Mapeamento fiável do nome da arma para a chave de dados
const weaponToDataKeyMap = {
    "AK-47": "ak47Skins", "AUG": "augSkins", "AWP": "awpSkins", "FAMAS": "famasSkins",
    "G3SG1": "g3sg1Skins", "Galil AR": "galilARSkins", "M4A1-S": "m4a1sSkins",
    "M4A4": "m4a4Skins", "SCAR-20": "scar20Skins", "SG 553": "sg553Skins", "SSG 08": "ssg08Skins",
    "MAC-10": "mac10Skins", "MP5-SD": "mp5sdSkins", "MP7": "mp7Skins", "MP9": "mp9Skins",
    "PP-Bizon": "ppBizonSkins", "P90": "p90Skins", "UMP-45": "ump45Skins",
    "MAG-7": "mag7Skins", "Nova": "novaSkins", "Sawed-Off": "sawedOffSkins",
    "XM1014": "xm1014Skins", "M249": "m249Skins", "Negev": "negevSkins",
    "USP-S": "uspSkins", "Glock-18": "glock18Skins", "Desert Eagle": "desertEagleSkins",
    "P250": "p250Skins", "Five-SeveN": "fiveSevenSkins", "CZ75-Auto": "cz75Skins",
    "P2000": "p2000Skins", "Tec-9": "tec9Skins", "R8 Revolver": "r8Skins",
    "Dual Berettas": "dualBerettasSkins",
};

const getSkinsForWeapon = (weaponName) => {
  const dataKey = weaponToDataKeyMap[weaponName];
  if (!dataKey || !allSkinsData[dataKey]) return [];
  const weaponData = allSkinsData[dataKey];
  return Object.values(weaponData).flat().map(skin => skin.name.split(' | ')[1]).sort();
};

const HomePage = () => {
  const [selectedType, setSelectedType] = useState('rifles');
  const [selectedWeapon, setSelectedWeapon] = useState('');
  const [selectedSkin, setSelectedSkin] = useState(''); // Estado para a skin selecionada
  const [skinList, setSkinList] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const weaponTypes = { rifles, smgs, heavy, pistols };

  useEffect(() => {
    if (selectedWeapon) {
      setSkinList(getSkinsForWeapon(selectedWeapon));
    } else {
      setSkinList([]);
    }
    setSelectedSkin(''); // Limpa a skin ao trocar de arma
  }, [selectedWeapon]);

  const handleSearch = async () => {
    if (!selectedWeapon || !selectedSkin) {
      alert("Por favor, selecione uma arma e uma skin para pesquisar.");
      return;
    }
    setLoading(true);
    setHasSearched(true);
    setResults([]);
    const searchResults = await searchSkins(selectedWeapon, selectedSkin);
    setResults(searchResults);
    setLoading(false);
  };

  return (
    <div className="homepage">
      <section className="hero-section">
        <h2>Encontre a sua Skin Perfeita</h2>
        <p>Selecione uma arma e uma skin para ver os detalhes e preços em tempo real.</p>
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
          
          {/* O INPUT FOI SUBSTITUÍDO POR ESTE SELECT */}
          <select
            className="custom-select"
            value={selectedSkin}
            onChange={e => setSelectedSkin(e.target.value)}
            disabled={!selectedWeapon || skinList.length === 0}
          >
            <option value="">Selecione a skin</option>
            {skinList.map(skinName => (
              <option key={skinName} value={skinName}>{skinName}</option>
            ))}
          </select>

          <button className="search-button" onClick={handleSearch} disabled={loading || !selectedSkin}>
            {loading ? '...' : <FaSearch />}
            <span className="search-button-text">Pesquisar</span>
          </button>
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

export default HomePage;