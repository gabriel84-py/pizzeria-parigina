# 🍕 Pizzeria Parigina - Site Web Fullstack

Site web complet pour la Pizzeria Parigina avec backend Node.js et frontend HTML/CSS/JS.

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- MongoDB (installé localement ou compte MongoDB Atlas)
- Un navigateur web moderne

## 🚀 Installation

### 1. Structure du projet

Créez la structure suivante :

```
pizzeria-parigina/
├── backend/
│   ├── server.js
│   ├── .env
│   ├── package.json
│   ├── models/
│   │   ├── Pizza.js
│   │   ├── Category.js
│   │   ├── Contact.js
│   │   ├── Hours.js
│   │   ├── Gallery.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── pizzas.js
│   │   ├── categories.js
│   │   ├── contact.js
│   │   ├── hours.js
│   │   ├── gallery.js
│   │   └── admin.js
│   └── middleware/
│       └── auth.js
│
└── frontend/
    ├── index.html
    ├── admin.html
    ├── css/
    │   └── style.css
    └── js/
        ├── main.js
        └── admin.js
```

### 2. Installation du Backend

```bash
cd backend
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken body-parser
npm install --save-dev nodemon
```

### 3. Configuration de la base de données

Créez un fichier `.env` dans le dossier `backend/` :

```env
MONGODB_URI=mongodb://localhost:27017/pizzeria_parigina
JWT_SECRET=changez_ce_secret_en_production_avec_une_chaine_tres_longue_et_securisee
PORT=5000
```

**Note importante :** Si vous utilisez MongoDB Atlas (cloud), remplacez `MONGODB_URI` par votre URL de connexion.

### 4. Modification du package.json (backend)

Ajoutez ces scripts dans `backend/package.json` :

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 5. Démarrage de MongoDB

**Option A - MongoDB local :**
```bash
# Sur macOS/Linux
sudo systemctl start mongodb
# ou
mongod

# Sur Windows
net start MongoDB
```

**Option B - MongoDB Atlas (cloud) :**
1. Créez un compte sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit
3. Obtenez votre URL de connexion
4. Mettez-la dans le fichier `.env`

### 6. Démarrage du serveur

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### 7. Initialisation automatique

Au premier lancement, le système crée automatiquement :
- ✅ Le compte admin (username: `parigina`, password: `parigina`)
- ✅ Les catégories de pizzas
- ✅ Toutes les pizzas du menu
- ✅ Les informations de contact
- ✅ Les horaires d'ouverture

### 8. Ouverture du site

Ouvrez le fichier `frontend/index.html` dans votre navigateur ou utilisez un serveur local :

```bash
# Avec Python 3
cd frontend
python -m http.server 8000

# Avec Node.js (si vous avez installé http-server)
npx http-server frontend -p 8000
```

Accédez ensuite à :
- **Site principal :** `http://localhost:8000/index.html`
- **Panel admin :** `http://localhost:8000/admin.html`

## 🔐 Accès Admin

**URL :** `http://localhost:8000/admin.html`

**Identifiants par défaut :**
- Username: `parigina`
- Password: `parigina`

⚠️ **IMPORTANT :** Changez ces identifiants dès votre première connexion dans la section "Paramètres" !

## 📱 Fonctionnalités

### Site Public
- ✨ Design moderne et sobre avec touches italiennes
- 🍕 Menu complet avec filtres par catégorie
- 📞 Informations de contact
- 🕒 Horaires d'ouverture
- 📸 Section galerie (à compléter avec vos photos)
- 📱 100% Responsive

### Panel Admin
- 🔒 Authentification sécurisée
- ➕ Ajouter/Modifier/Supprimer des pizzas
- ✏️ Modifier les informations de contact
- ⏰ Gérer les horaires d'ouverture
- 🔑 Changer mot de passe et username
- 📊 Statistiques en temps réel

## 🎨 Personnalisation

### Couleurs
Les couleurs sont définies dans `frontend/css/style.css` :

```css
:root {
    --terracotta: #D4734A;  /* Couleur principale */
    --green: #2D5016;        /* Vert italien */
    --cream: #FFF8F0;        /* Fond doux */
    --charcoal: #2C2C2C;     /* Texte */
    --gold: #C9A961;         /* Accents or */
}
```

### Ajouter des images à la galerie
Connectez-vous au panel admin et ajoutez des URL d'images dans la section Galerie (à implémenter si besoin).

## 🔧 API Endpoints

### Public
- `GET /api/pizzas` - Liste des pizzas
- `GET /api/pizzas/category/:category` - Pizzas par catégorie
- `GET /api/categories` - Liste des catégories
- `GET /api/contact` - Informations de contact
- `GET /api/hours` - Horaires d'ouverture
- `GET /api/gallery` - Images de la galerie

### Admin (nécessite authentification)
- `POST /api/admin/login` - Connexion admin
- `PUT /api/admin/change-password` - Changer mot de passe
- `PUT /api/admin/change-username` - Changer username
- `POST /api/pizzas` - Créer une pizza
- `PUT /api/pizzas/:id` - Modifier une pizza
- `DELETE /api/pizzas/:id` - Supprimer une pizza
- `PUT /api/contact` - Modifier contact
- `PUT /api/hours/:id` - Modifier horaires

## 📦 Déploiement en Production

### Backend
1. Changez `JWT_SECRET` dans `.env` par une valeur très sécurisée
2. Utilisez MongoDB Atlas pour la base de données
3. Déployez sur Heroku, Railway, ou DigitalOcean
4. Mettez à jour `API_URL` dans les fichiers JS frontend

### Frontend
1. Déployez sur Netlify, Vercel, ou GitHub Pages
2. Mettez à jour l'URL de l'API dans `main.js` et `admin.js`

## 🐛 Dépannage

**Erreur de connexion à MongoDB :**
- Vérifiez que MongoDB est démarré
- Vérifiez l'URL dans `.env`

**Erreur CORS :**
- Vérifiez que le backend autorise l'origine du frontend
- Ajoutez votre domaine dans les options CORS si nécessaire

**Les données ne s'affichent pas :**
- Vérifiez la console du navigateur (F12)
- Vérifiez que le backend fonctionne (`http://localhost:5000/api/health`)

## 📄 Licence

Projet créé pour la Pizzeria Parigina - Villeneuve-lès-Avignon

## 🤝 Support

Pour toute question : pariginafg75@gmail.com

---

**Bon appétit et bon codage ! 🍕👨‍💻**
