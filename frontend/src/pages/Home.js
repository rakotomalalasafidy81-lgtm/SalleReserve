import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Clock, History, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <div className="home">
      <header className="home-header">
        <div className="header-content">
          <div className="brand-lockup">
            <span className="logo-badge logo-badge-light"><Building2 size={24} strokeWidth={2} /></span>
            <h1>SalleReserve</h1>
          </div>
          <p>Système Intégré de Réservation de Salles</p>
        </div>
        <div className="header-buttons">
          {token ? (
            <>
              <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                Tableau de Bord
              </button>
              <button className="btn-secondary" onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
              }}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button className="btn-primary" onClick={() => navigate('/login')}>
                Connexion
              </button>
              <button className="btn-secondary" onClick={() => navigate('/register')}>
                Inscription
              </button>
            </>
          )}
        </div>
      </header>

      <main className="home-content">
        <section className="hero fade-in-up">
          <h2>Réservez vos salles facilement</h2>
          <p>Une plateforme simple et intuitive pour gérer vos réservations de salles de classe</p>
          <button className="btn-large" onClick={() => navigate(token ? '/dashboard' : '/register')}>
            Commencer <ArrowRight size={18} strokeWidth={2} className="btn-large-icon" />
          </button>
        </section>

        <section className="features">
          <h3>Nos fonctionnalités</h3>
          <div className="features-carousel">
            <div className="features-track">
              {[0, 1].map((copy) => (
                <div className="features-grid" key={copy} aria-hidden={copy === 1}>
                  <div className="feature-card">
                    <div className="feature-icon"><CalendarCheck size={28} strokeWidth={1.75} /></div>
                    <h4>Réservation Simple</h4>
                    <p>Réservez une salle en quelques clics</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon"><Clock size={28} strokeWidth={1.75} /></div>
                    <h4>Horaires Flexibles</h4>
                    <p>Choisissez votre créneau horaire</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon"><History size={28} strokeWidth={1.75} /></div>
                    <h4>Historique Complet</h4>
                    <p>Accédez à vos réservations passées</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon"><ShieldCheck size={28} strokeWidth={1.75} /></div>
                    <h4>Gestion Admin</h4>
                    <p>Contrôle total sur les salles</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="buildings">
          <h3>Nos Bâtiments</h3>
          <div className="buildings-list">
            <div className="building-item">
              <h4>Bâtiment Belaza</h4>
              <p>Agir, Belaza 1, Belaza 2, Belaza 3</p>
            </div>
            <div className="building-item">
              <h4>Amphithéâtre</h4>
              <p>Amphi TCI (800 places)</p>
            </div>
            <div className="building-item">
              <h4>Bâtiment Principal</h4>
              <p>Salles 11 à 16 + 11A, 11B</p>
            </div>
            <div className="building-item">
              <h4>Bâtiment Elec</h4>
              <p>Elec 1, Elec 2</p>
            </div>
            <div className="building-item">
              <h4>Bâtiment STIC</h4>
              <p>Eon 1, Eon 2</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; 2024 SalleReserve. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Home;
