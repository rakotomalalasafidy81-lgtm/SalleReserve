import React from 'react';
import { Presentation, Zap, Cpu, Building2 } from 'lucide-react';
import '../styles/RoomCard.css';

const BuildingsTrio = ({ className, size = 90, strokeWidth = 1.5 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="10" width="5.5" height="11" />
    <rect x="9.25" y="5.5" width="5.5" height="15.5" />
    <rect x="16.5" y="12.5" width="5.5" height="8.5" />
  </svg>
);

const BUILDING_ICONS = {
  Belaza: Building2,
  Amphi: Presentation,
  Principal: BuildingsTrio,
  Elec: Zap,
  STIC: Cpu
};

const RoomCard = ({ room, onReserve }) => {
  const BuildingIcon = BUILDING_ICONS[room.building] || Building2;

  return (
    <div className="room-card">
      <div className="room-card-header" data-building={room.building}>
        <BuildingIcon className="room-card-watermark" size={90} strokeWidth={1.5} />
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
