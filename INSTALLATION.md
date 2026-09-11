# Installation et Démarrage de SalleReserve

## Prérequis

- Node.js (version 14+)
- MongoDB (local ou cloud)
- npm ou yarn

## Installation

### 1. Backend

```bash
cd backend
npm install
```

Créez un fichier `.env`:

```
MONGODB_URI=mongodb://localhost:27017/sallereserve
JWT_SECRET=votre_clé_secrète_très_secure
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Démarrez le serveur:

```bash
npm start
```

Ou en mode développement:

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

L'application ouvrira automatiquement sur `http://localhost:3000`

## Initialiser les données

Créez un compte admin et ajoutez les salles via le panneau admin.

## Structure des données

### Utilisateur (User)
- name: Nom complet
- email: Email unique
- password: Mot de passe hashé
- role: 'user' ou 'admin'

### Salle (Room)
- name: Nom de la salle
- building: Bâtiment (Belaza, Amphi, Principal, Elec, STIC)
- capacity: Capacité en personnes
- description: Description optionnelle
- equipment: Liste d'équipements

### Réservation (Reservation)
- user: Référence utilisateur
- room: Référence salle
- date: Date de réservation
- startTime: Heure de début (HH:mm)
- endTime: Heure de fin (HH:mm)
- purpose: Motif de réservation
- status: 'pending', 'confirmed', 'cancelled', 'completed'

## API Endpoints

### Authentification
- POST `/api/auth/register` - Inscription
- POST `/api/auth/login` - Connexion
- GET `/api/auth/me` - Profil utilisateur

### Salles
- GET `/api/rooms` - Liste toutes les salles
- GET `/api/rooms/:id` - Détails d'une salle
- POST `/api/rooms` - Créer une salle (admin)
- PUT `/api/rooms/:id` - Modifier une salle (admin)
- DELETE `/api/rooms/:id` - Supprimer une salle (admin)

### Réservations
- GET `/api/reservations` - Liste toutes les réservations (admin)
- GET `/api/reservations/user/my-reservations` - Mes réservations
- GET `/api/reservations/:id` - Détails réservation
- POST `/api/reservations` - Créer réservation
- PUT `/api/reservations/:id` - Modifier réservation
- PATCH `/api/reservations/:id/cancel` - Annuler réservation

## Déploiement

### Backend (Heroku)
```bash
heroku login
heroku create sallereserve-api
git push heroku main
```

### Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

## Troubleshooting

- **MongoDB non connecté**: Vérifiez votre MongoDB_URI
- **CORS erreur**: Vérifiez les variables CORS_ORIGIN
- **Port en utilisation**: Changez le PORT dans .env

## License

MIT
