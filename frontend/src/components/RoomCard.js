import React from 'react';
import '../styles/RoomCard.css';

const RoomCard = ({ room, onReserve }) => {
  return (
    <div className="room-card">
      <div className="room-card-header">
        <h3>{room.name}</h3>
        <span className="building-badge">{room.building}</span>
      </div>

      <div className="room-card-content">
        <div className="room-info">
          <p><strong>Capacité:</strong> {room.capacity} personnes</p>
          {room.description && <p><strong>Description:</strong> {room.description}</p>}
          {room.equipment && room.equipment.length > 0 && (
            <p><strong>Équipements:</strong> {room.equipment.join(', ')}</p>
          )}
        </div>

        <div className="room-status">
          <span className={room.available ? 'status-available' : 'status-unavailable'}>
            {room.available ? 'Disponible' : 'Indisponible'}
          </span>
        </div>
      </div>

      <button 
        className="btn-reserve"
        onClick={onReserve}
        disabled={!room.available}
      >
        Réserver
      </button>
    </div>
  );
};

export default RoomCard;
