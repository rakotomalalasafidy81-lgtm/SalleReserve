
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import RoomCard from '../components/RoomCard';
import ReservationModal from '../components/ReservationModal';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterBuilding, setFilterBuilding] = useState('');

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const url = filterBuilding 
        ? `/api/rooms?building=${filterBuilding}` 
        : '/api/rooms';
      const response = await axios.get(url);
      setRooms(response.data.rooms);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des salles');
    } finally {
      setLoading(false);
    }
  }, [filterBuilding]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleReserveClick = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  const handleReservationSuccess = () => {
    fetchRooms();
    handleCloseModal();
  };

  const buildings = ['Belaza', 'Amphi', 'Principal', 'Elec', 'STIC'];

  return (
    <div className="dashboard">
      <Header />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Réservation de Salles</h1>
          <p>Sélectionnez une salle et choisissez votre créneau horaire</p>
        </div>

      <div className="filters-section">
          <div className="filter-group">
            <label>Filtrer par bâtiment</label>
            <div className="filter-pills">
              <button
                type="button"
                className={`filter-pill ${filterBuilding === '' ? 'active' : ''}`}
                onClick={() => setFilterBuilding('')}
              >
                Tous les bâtiments
              </button>
              {buildings.map(building => (
                <button
                  type="button"
                  key={building}
                  className={`filter-pill ${filterBuilding === building ? 'active' : ''}`}
                  onClick={() => setFilterBuilding(building)}
                >
                  {building}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Chargement des salles...</div>
        ) : (
          <div className="rooms-grid">
            {rooms.length > 0 ? (
              rooms.map(room => (
                <RoomCard 
                  key={room._id} 
                  room={room} 
                  onReserve={() => handleReserveClick(room)}
                />
              ))
            ) : (
              <div className="no-rooms">Aucune salle disponible</div>
            )}
          </div>
        )}
      </div>

      {showModal && selectedRoom && (
        <ReservationModal 
          room={selectedRoom}
          onClose={handleCloseModal}
          onSuccess={handleReservationSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
