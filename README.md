# 🍕 Pizzeria Parigina - Site Web Fullstack

Site web complet pour la Pizzeria Parigina avec backend Node.js/Express et frontend HTML/CSS/JS moderne.

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- MongoDB (installé localement ou compte MongoDB Atlas)
- Un navigateur web moderne

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/VOTRE_USERNAME/pizzeria-parigina.git
cd pizzeria-parigina
```

### 2. Installation des dépendances

```bash
cd backend
npm install
```

### 3. Configuration de l'environnement

Créez un fichier `.env` dans le dossier `backend` :

```env
MONGODB_URI=mongodb://localhost:27017/pizzeria_parigina
JWT_SECRET=votre_secret_jwt_securise
PORT=5000
```

**Option MongoDB Atlas (cloud) :**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pizzeria_parigina
```

### 4. Démarrage de MongoDB

**Option A - MongoDB local :**
```bash
# Sur macOS/Linux
mongod

# Sur Windows
net start MongoDB
```

**Option B - MongoDB Atlas :**
Créez un compte sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) et obtenez votre URL de connexion.

### 5. Démarrage du serveur

```bash
cd backend
npm start
# ou pour le développement avec auto-reload :
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### 6. Accès au site

- **Site principal :** `http://localhost:5000`
- **Panel admin :** `http://localhost:5000/admin.html`

## 🔐 Accès Admin

**Identifiants par défaut :**
- Username: `parigina`
- Password: `parigina`

⚠️ **IMPORTANT :** Changez ces identifiants dès votre première connexion dans la section "Paramètres" !

## 📱 Fonctionnalités

### Site Public
- ✨ Design moderne et sobre avec touches italiennes
- 🍕 Menu complet avec filtres par catégorie
- 🔍 Recherche de pizzas en temps réel
- 📞 Informations de contact
- 🕒 Horaires d'ouverture
- 📱 100% Responsive
- 🎨 Animations fluides et modernes

### Panel Admin
- 🔒 Authentification sécurisée (JWT)
- ➕ Ajouter/Modifier/Supprimer des pizzas
- ✏️ Modifier les informations de contact
- ⏰ Gérer les horaires d'ouverture
- 🔑 Changer mot de passe et username
- 📊 Statistiques en temps réel
- 💫 Interface moderne et intuitive

## 🛠️ Technologies

- **Backend :** Node.js, Express, MongoDB, Mongoose
- **Frontend :** HTML5, CSS3, JavaScript (Vanilla)
- **Authentification :** JWT (JSON Web Tokens)
- **Styling :** CSS moderne avec animations

## 📁 Structure du projet

```
pizzeria-parigina/
├── backend/
│   ├── models/          # Modèles MongoDB
│   ├── routes/          # Routes API
│   ├── middleware/      # Middleware (auth)
│   ├── server.js        # Serveur Express
│   └── package.json
├── frontend/
│   ├── css/             # Styles
│   ├── js/              # JavaScript
│   ├── images/          # Images
│   ├── index.html       # Page principale
│   └── admin.html       # Panel admin
└── README.md
```

## 🚀 Déploiement

### Variables d'environnement de production

Assurez-vous de définir :
- `MONGODB_URI` : URL de votre base de données MongoDB
- `JWT_SECRET` : Secret JWT long et sécurisé
- `PORT` : Port du serveur (optionnel, défaut: 5000)

## 📝 Licence

Ce projet est privé et propriétaire de la Pizzeria Parigina.

## 👨‍💻 Développement

Pour contribuer au projet :
1. Fork le repository
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

Fait avec ❤️ pour la Pizzeria Parigina

