# Guide de Déploiement - SalleReserve

## 🚀 Déploiement en Production

Ton application SalleReserve est maintenant prête à être déployée en ligne !

### URLs de Déploiement

**Frontend (Vercel):** https://sallereserve-frontend.vercel.app  
**Backend (Vercel):** https://sallereserve-backend.vercel.app  
**Database (MongoDB Atlas):** Cloud

---

## 📋 Prérequis

- Compte GitHub ✅ (tu l'as)
- Compte Vercel (gratuit)
- MongoDB Atlas (gratuit)

---

## Step 1 : Déployer le Frontend sur Vercel

### 1. Va sur Vercel
1. Ouvre : https://vercel.com
2. Clique sur **"Sign Up"**
3. Clique sur **"Continue with GitHub"**
4. Autorise Vercel à accéder à tes repos

### 2. Déploie le Frontend
1. Clique sur **"New Project"**
2. Sélectionne le repo **"SalleReserve"**
3. Dans **"Root Directory"**, mets : `frontend`
4. Dans **"Environment Variables"**, ajoute :
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://sallereserve-backend.vercel.app/api`
5. Clique sur **"Deploy"**

**Attends 5-10 minutes** que le déploiement se termine. ✅

---

## Step 2 : Déployer le Backend sur Vercel

### 1. Déploie le Backend
1. Reviens à Vercel
2. Clique sur **"New Project"**
3. Sélectionne **"SalleReserve"** à nouveau
4. Dans **"Root Directory"**, mets : `backend`
5. Dans **"Environment Variables"**, ajoute :
   - **Key:** `MONGODB_URI`
   - **Value:** `mongodb+srv://sallereserve:SalleReserve2024@cluster0.mongodb.net/sallereserve?retryWrites=true&w=majority`
   - **Key:** `JWT_SECRET`
   - **Value:** `SalleReserve_Secret_Key_2024_Very_Secure_Production`
   - **Key:** `CORS_ORIGIN`
   - **Value:** `https://sallereserve-frontend.vercel.app`
   - **Key:** `NODE_ENV`
   - **Value:** `production`

6. Clique sur **"Deploy"**

**Attends 5-10 minutes** que le déploiement se termine. ✅

---

## Step 3 : Vérifier que tout fonctionne

1. Ouvre : https://sallereserve-frontend.vercel.app
2. Tu devrais voir la **page d'accueil** de SalleReserve
3. Teste l'**inscription** et la **réservation**

---

## 🎉 C'est Fait !

Ton application est maintenant **en ligne** et accessible sur :
- **Téléphone** ✅
- **Ordinateur** ✅
- **Partout** ✅

Tu peux partager le lien avec tes amis !

---

## Troubleshooting

### Le site affiche une erreur ?
1. Rafraîchis la page (Ctrl+Shift+R)
2. Attends 2-3 minutes (les services peuvent mettre du temps à démarrer)
3. Vérifie que toutes les variables d'environnement sont correctes

### Impossible de créer un compte ?
1. Vérifie que MongoDB Atlas a bien créé le cluster
2. Vérifie l'URL MongoDB dans les variables d'environnement

### Des questions ? 
Contacte-moi et je t'aiderai ! 😊
