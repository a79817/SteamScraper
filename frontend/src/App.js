import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SkinDetailPage from './pages/SkinDetailPage';
import Header from './components/Header';
import './App.css'; // Vamos criar este ficheiro para estilos gerais

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* O :marketHashName será o identificador único da skin */}
            <Route path="/skin/:marketHashName" element={<SkinDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;