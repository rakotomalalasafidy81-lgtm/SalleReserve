import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Building2 } from 'lucide-react';
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
          <span className="logo-badge"><Building2 size={20} strokeWidth={2} /></span>
          <h2>SalleReserve</h2>
        </div>

        <nav className="nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Réserver</NavLink>
          <NavLink to="/my-reservations" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Mes Réservations</NavLink>
          {user.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link admin-link${isActive ? ' active' : ''}`}>Admin</NavLink>
          )}
        </nav>

        <div className="user-menu">
          <button className="user-button" onClick={() => setShowMenu(!showMenu)}>
            <span className="user-icon">{(user.name || 'U').charAt(0).toUpperCase()}</span>
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
