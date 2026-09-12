const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const reservationRoutes = require('./routes/reservations');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Connexion à MongoDB (mise en cache pour le mode serverless : on ne
// se reconnecte pas à chaque requête si une connexion existe déjà)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log('Connecté à MongoDB');
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Erreur de connexion à MongoDB:', err.message);
    res.status(500).json({ message: 'Erreur de connexion à la base de données' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SalleReserve Backend is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

const PORT = process.env.PORT || 5000;

// Sur Vercel, ce fichier est importé comme un module (pas exécuté
// directement) : on exporte "app" et on ne démarre le serveur nous-
// mêmes qu'en local / hors Vercel.
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Serveur SalleReserve en cours d'exécution sur le port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Erreur de connexion à MongoDB:', err.message);
      process.exit(1);
    });
}

module.exports = app;
