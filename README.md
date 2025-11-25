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
# Depuis la racine du projet
npm install
```

Cette commande installera automatiquement toutes les dépendances dans le dossier `backend/`.

### 3. Configuration de l'environnement

#### Option A : MongoDB Local (développement)

Créez un fichier `.env` dans le dossier `backend` :

```env
MONGODB_URI=mongodb://localhost:27017/pizzeria_parigina
JWT_SECRET=votre_secret_jwt_securise
PORT=5000
```

#### Option B : MongoDB Atlas (recommandé pour le déploiement)

👉 **Voir le guide complet :** [MONGODB_SETUP.md](./MONGODB_SETUP.md)

Créez un fichier `.env` dans le dossier `backend` :

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pizzeria_parigina?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_securise
PORT=5000
```

**⚠️ Important pour le déploiement :** Vous devez utiliser MongoDB Atlas (cloud). Voir [MONGODB_SETUP.md](./MONGODB_SETUP.md) pour la configuration complète.

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
# Depuis la racine du projet
npm start

# Ou pour le développement avec auto-reload :
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

👉 **Guide complet de déploiement :** [DEPLOY.md](./DEPLOY.md)

### Prérequis pour le déploiement

1. **MongoDB Atlas** (OBLIGATOIRE) - Voir [MONGODB_SETUP.md](./MONGODB_SETUP.md)
2. Compte sur une plateforme de déploiement (Heroku, Railway, Render, etc.)

### Variables d'environnement de production

Assurez-vous de définir dans votre plateforme de déploiement :
- `MONGODB_URI` : URL de votre base de données MongoDB Atlas
- `JWT_SECRET` : Secret JWT long et sécurisé (minimum 32 caractères)
- `PORT` : Port du serveur (généralement défini automatiquement par la plateforme)
- `NODE_ENV` : `production`

### Commandes de déploiement

- **Build Command :** `npm install`
- **Start Command :** `npm start`

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

