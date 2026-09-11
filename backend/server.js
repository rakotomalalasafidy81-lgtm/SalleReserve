const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SalleReserve Backend is running' });
});

// Salles data
const salles = [
  { id: 1, name: 'Salle de Conférence A', capacity: 50, price: 500 },
  { id: 2, name: 'Salle de Réunion B', capacity: 20, price: 250 },
  { id: 3, name: 'Amphithéâtre C', capacity: 150, price: 1000 },
  { id: 4, name: 'Bureau privé D', capacity: 4, price: 100 }
];

// Get all salles
app.get('/api/salles', (req, res) => {
  res.json(salles);
});

// Get single salle
app.get('/api/salles/:id', (req, res) => {
  const salle = salles.find(s => s.id === parseInt(req.params.id));
  if (!salle) {
    return res.status(404).json({ message: 'Salle non trouvée' });
  }
  res.json(salle);
});

// Register user
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  res.json({
    success: true,
    user: { email, name },
    message: 'Inscription réussie'
  });
});

// Login user
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  res.json({
    success: true,
    user: { email, name: email.split('@')[0] },
    message: 'Connexion réussie'
  });
});

// Reservations storage
let reservations = [];

// Create reservation
app.post('/api/reservations', (req, res) => {
  const { salleId, date, time, userId } = req.body;

  if (!salleId || !date || !time) {
    return res.status(400).json({ message: 'Données manquantes' });
  }

  const reservation = {
    id: Date.now(),
    salleId,
    date,
    time,
    userId,
    status: 'confirmée',
    createdAt: new Date()
  };

  reservations.push(reservation);
  res.status(201).json(reservation);
});

// Get all reservations
app.get('/api/reservations', (req, res) => {
  res.json(reservations);
});

// Get single reservation
app.get('/api/reservations/:id', (req, res) => {
  const reservation = reservations.find(r => r.id === parseInt(req.params.id));
  if (!reservation) {
    return res.status(404).json({ message: 'Réservation non trouvée' });
  }
  res.json(reservation);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur SalleReserve en cours d'exécution sur le port ${PORT}`);
});
