import React from 'react';
import { Link } from 'react-router-dom';
import { FaSteam } from 'react-icons/fa'; // Exemplo de ícone
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo-container">
          <FaSteam size={32} />
          <h1>Skin Inspector</h1>
        </Link>
        <nav>
          {/* Pode adicionar mais links aqui no futuro */}
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Sobre</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;