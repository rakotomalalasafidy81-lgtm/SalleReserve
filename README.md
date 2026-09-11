# 🏫 SalleReserve - Application de Réservation de Salles

Une application web complète pour réserver des salles de classe avec authentification, gestion admin et historique des réservations.

## 📋 Caractéristiques

✅ **Authentification** : Inscription et connexion avec Email + Mot de passe  
✅ **Réservation de salles** : Voir toutes les salles disponibles avec créneaux horaires  
✅ **Gestion des réservations** : Modification et annulation  
✅ **Historique** : Suivi complet des réservations  
✅ **Admin Panel** : Gestion des salles et des réservations  
✅ **Base de données MongoDB** : Stockage sécurisé des données  

## 🏢 Salles Disponibles

### Bâtiment Belaza
- **Agir** : 40 personnes
- **Belaza 1** : 30 personnes
- **Belaza 2** : 30 personnes
- **Belaza 3** : 30 personnes

### Amphithéâtre
- **Amphi TCI** : 800 personnes

### Bâtiment Principal
- **Salle 11** : 40 personnes
- **Salle 12** : 40 personnes
- **Salle 13** : 40 personnes
- **Salle 11A** : 40 personnes
- **Salle 11B** : 40 personnes
- **Salle 14** : 40 personnes
- **Salle 16** : 40 personnes

### Bâtiment Électronique (Elec)
- **Elec 1** : 40 personnes
- **Elec 2** : 40 personnes

### Bâtiment STIC
- **Eon 1** : 40 personnes
- **Eon 2** : 40 personnes

## 🛠️ Stack Technologique

- **Frontend** : React.js
- **Backend** : Node.js + Express
- **Base de données** : MongoDB
- **Authentification** : JWT (JSON Web Tokens)

## 📁 Structure du Projet

```
SalleReserve/
├── backend/          # API Node.js + Express
│   ├── models/       # Schémas MongoDB
│   ├── routes/       # Routes API
│   ├── controllers/  # Logique métier
│   ├── middleware/   # Authentification, etc.
│   └── server.js     # Point d'entrée
├── frontend/         # Application React
│   ├── src/
│   │   ├── pages/    # Pages (Home, Login, Dashboard, etc.)
│   │   ├── components/ # Composants réutilisables
│   │   └── App.js    # Point d'entrée
│   └── package.json
└── README.md
```

## 🚀 Installation

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📝 Licence

MIT

---

**Développé avec ❤️ pour SalleReserve**