import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import '../styles/MyReservations.css';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reservations/user/my-reservations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data.reservations);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) {
      try {
        await axios.patch(
          `/api/reservations/${reservationId}/cancel`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchReservations();
      } catch (err) {
        alert('Erreur lors de l\'annulation');
      }
    }
  };

  return (
    <div className="my-reservations">
      <Header />

      <div className="reservations-container">
        <div className="reservations-header">
          <h1>Mes Réservations</h1>
          <p>Historique et gestion de vos réservations</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="reservations-list">
            {reservations.length > 0 ? (
              reservations.map(reservation => (
                <div key={reservation._id} className="reservation-card">
                  <div className="reservation-header">
                    <h3>{reservation.room.name}</h3>
                    <span className={`status ${reservation.status}`}>
                      {reservation.status}
                    </span>
                  </div>
                  <div className="reservation-details">
                    <p><strong>Bâtiment:</strong> {reservation.room.building}</p>
                    <p><strong>Date:</strong> {new Date(reservation.date).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Horaire:</strong> {reservation.startTime} - {reservation.endTime}</p>
                    <p><strong>Motif:</strong> {reservation.purpose}</p>
                    {reservation.notes && <p><strong>Notes:</strong> {reservation.notes}</p>}
                  </div>
                  {reservation.status !== 'cancelled' && (
                    <button 
                      className="btn-cancel"
                      onClick={() => handleCancel(reservation._id)}
                    >
                      Annuler
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="no-reservations">
                Vous n'avez pas encore de réservations
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
