import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}>
          <h2>SalleReserve</h2>
        </div>

        <nav className="nav">
          <a href="/dashboard" className="nav-link">Réserver</a>
          <a href="/my-reservations" className="nav-link">Mes Réservations</a>
          {user.role === 'admin' && (
            <a href="/admin" className="nav-link admin-link">Admin</a>
          )}
        </nav>

        <div className="user-menu">
          <button className="user-button" onClick={() => setShowMenu(!showMenu)}>
            <span className="user-icon">■</span>
            <span>{user.name || 'Utilisateur'}</span>
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <div className="menu-item user-info">
                {user.name}
                <br />
                <small>{user.email}</small>
              </div>
              <button className="menu-item logout" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
