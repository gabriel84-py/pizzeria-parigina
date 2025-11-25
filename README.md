# 🍕 Pizzeria Parigina - Site Web Fullstack

Site web complet pour la Pizzeria Parigina avec backend Node.js/Express et frontend HTML/CSS/JS moderne.

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- Un navigateur web moderne

**Note :** La base de données SQLite est incluse et se crée automatiquement. Aucune configuration supplémentaire nécessaire !

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

### 3. Configuration de l'environnement (optionnel)

Créez un fichier `.env` dans le dossier `backend/` si vous voulez personnaliser :

```env
JWT_SECRET=votre_secret_jwt_securise
PORT=5000
```

**Note :** La base de données SQLite se crée automatiquement dans `backend/data/app.db`. Aucune configuration nécessaire !

### 4. Démarrage du serveur

```bash
# Depuis la racine du projet
npm start

# Ou pour le développement avec auto-reload :
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### 5. Initialisation automatique

Au premier lancement, le système crée automatiquement :
- ✅ La base de données SQLite dans `backend/data/app.db`
- ✅ Le compte admin (username: `parigina`, password: `parigina`)
- ✅ Les catégories de pizzas
- ✅ Toutes les pizzas du menu
- ✅ Les informations de contact
- ✅ Les horaires d'ouverture

### 6. Accès au site

Une fois le serveur démarré, accédez à :
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

- **Backend :** Node.js, Express, SQLite (better-sqlite3)
- **Frontend :** HTML5, CSS3, JavaScript (Vanilla)
- **Base de données :** SQLite (fichier local, pas de serveur requis)
- **Authentification :** JWT (JSON Web Tokens)
- **Styling :** CSS moderne avec animations

## 📁 Structure du projet

```
pizzeria-parigina/
├── backend/
│   ├── data/            # Base de données SQLite (app.db)
│   ├── models/          # Modèles SQLite
│   ├── routes/          # Routes API
│   ├── middleware/      # Middleware (auth)
│   ├── database.js      # Configuration SQLite
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

1. Compte sur une plateforme de déploiement (Heroku, Railway, Render, etc.)
2. **Aucune base de données externe nécessaire !** SQLite est inclus

### Variables d'environnement de production

Assurez-vous de définir dans votre plateforme de déploiement :
- `JWT_SECRET` : Secret JWT long et sécurisé (minimum 32 caractères)
- `PORT` : Port du serveur (généralement défini automatiquement par la plateforme)
- `NODE_ENV` : `production` (optionnel)

**Note :** La base de données SQLite sera créée automatiquement dans `backend/data/app.db` lors du premier démarrage.

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
