import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms');
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    building: 'Belaza',
    capacity: '',
    description: '',
    equipment: []
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'rooms') fetchRooms();
    else fetchReservations();
  }, [activeTab]);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/rooms');
      setRooms(response.data.rooms);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reservations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data.reservations);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/rooms', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRooms();
      setShowRoomForm(false);
      setFormData({
        name: '',
        building: 'Belaza',
        capacity: '',
        description: '',
        equipment: []
      });
    } catch (err) {
      alert('Erreur lors de la création de la salle');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Êtes-vous sûr?')) {
      try {
        await axios.delete(`/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchRooms();
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="admin-panel">
      <Header />

      <div className="admin-container">
        <div className="admin-header">
          <h1>Tableau de Bord Admin</h1>
          <p>Gérez les salles et les réservations</p>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            Salles
          </button>
          <button 
            className={`tab ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            Réservations
          </button>
        </div>

        {activeTab === 'rooms' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Gestion des Salles</h2>
              <button 
                className="btn-primary"
                onClick={() => setShowRoomForm(!showRoomForm)}
              >
                {showRoomForm ? 'Annuler' : 'Ajouter une salle'}
              </button>
            </div>

            {showRoomForm && (
              <form onSubmit={handleSubmit} className="room-form">
                <div className="form-group">
                  <label>Nom de la salle</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Bâtiment</label>
                  <select name="building" value={formData.building} onChange={handleFormChange}>
                    <option>Belaza</option>
                    <option>Amphi</option>
                    <option>Principal</option>
                    <option>Elec</option>
                    <option>STIC</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Capacité</label>
                  <input 
                    type="number" 
                    name="capacity" 
                    value={formData.capacity}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">Créer</button>
              </form>
            )}

            {loading ? (
              <div className="loading">Chargement...</div>
            ) : (
              <div className="rooms-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Bâtiment</th>
                      <th>Capacité</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map(room => (
                      <tr key={room._id}>
                        <td>{room.name}</td>
                        <td>{room.building}</td>
                        <td>{room.capacity} personnes</td>
                        <td>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteRoom(room._id)}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="admin-section">
            <h2>Toutes les Réservations</h2>
            {loading ? (
              <div className="loading">Chargement...</div>
            ) : (
              <div className="reservations-table">
                <table>
                  <thead>
                    <tr>
                      <th>Utilisateur</th>
                      <th>Salle</th>
                      <th>Date</th>
                      <th>Horaire</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(res => (
                      <tr key={res._id}>
                        <td>{res.user.name}</td>
                        <td>{res.room.name}</td>
                        <td>{new Date(res.date).toLocaleDateString('fr-FR')}</td>
                        <td>{res.startTime} - {res.endTime}</td>
                        <td><span className={`status ${res.status}`}>{res.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
