# 🗄️ Configuration MongoDB Atlas

Guide complet pour configurer MongoDB Atlas (base de données cloud gratuite) pour votre déploiement.

## 📋 Étape 1 : Créer un compte MongoDB Atlas

1. Allez sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Cliquez sur **"Try Free"** ou **"Sign Up"**
3. Créez votre compte (gratuit)

## 🚀 Étape 2 : Créer un cluster

1. Une fois connecté, cliquez sur **"Build a Database"**
2. Choisissez le plan **FREE (M0)** - 512MB gratuits
3. Choisissez votre région (ex: `Europe (Frankfurt)`)
4. Donnez un nom à votre cluster (ex: `Cluster0`)
5. Cliquez sur **"Create"** (cela prend 3-5 minutes)

## 🔐 Étape 3 : Créer un utilisateur de base de données

1. Dans la section **"Security"** → **"Database Access"**
2. Cliquez sur **"Add New Database User"**
3. Choisissez **"Password"** comme méthode d'authentification
4. Créez un utilisateur :
   - **Username :** `parigina-admin` (ou autre)
   - **Password :** Générez un mot de passe sécurisé (notez-le !)
5. Donnez les permissions **"Atlas admin"** ou **"Read and write to any database"**
6. Cliquez sur **"Add User"**

## 🌐 Étape 4 : Autoriser l'accès réseau

1. Dans **"Security"** → **"Network Access"**
2. Cliquez sur **"Add IP Address"**
3. Pour le développement local :
   - Cliquez sur **"Add Current IP Address"**
   - Ou ajoutez manuellement votre IP
4. Pour le déploiement (production) :
   - Cliquez sur **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ C'est sécurisé car vous avez un mot de passe utilisateur
5. Cliquez sur **"Confirm"**

## 🔗 Étape 5 : Obtenir la chaîne de connexion

1. Dans **"Deployment"** → Cliquez sur **"Connect"** sur votre cluster
2. Choisissez **"Connect your application"**
3. Sélectionnez **"Node.js"** et la version **"5.5 or later"**
4. Copiez la chaîne de connexion qui ressemble à :
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## ✏️ Étape 6 : Configurer votre application

### Pour le développement local

Créez/modifiez `backend/.env` :

```env
MONGODB_URI=mongodb+srv://parigina-admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/pizzeria_parigina?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_securise
PORT=5000
```

**Important :** Remplacez :
- `<username>` par votre nom d'utilisateur (ex: `parigina-admin`)
- `<password>` par votre mot de passe (encodez les caractères spéciaux : `@` devient `%40`, `#` devient `%23`)
- `cluster0.xxxxx` par votre cluster réel
- Ajoutez `/pizzeria_parigina` avant le `?` pour spécifier le nom de la base

### Pour le déploiement (Heroku, Railway, Render)

Ajoutez la variable d'environnement `MONGODB_URI` dans le dashboard de votre plateforme avec la même valeur.

## ✅ Étape 7 : Tester la connexion

1. Démarrez votre serveur : `npm start`
2. Vérifiez les logs : vous devriez voir `✅ MongoDB connecté`
3. Visitez `http://localhost:5000/api/health`
4. Le site initialisera automatiquement les données au premier chargement

## 🔄 Initialisation automatique

Lors du premier démarrage, le site initialise automatiquement :
- ✅ Compte admin (username: `parigina`, password: `parigina`)
- ✅ Catégories de pizzas
- ✅ Toutes les pizzas du menu
- ✅ Informations de contact
- ✅ Horaires d'ouverture

## 🛠️ Gestion de la base de données

### Accéder à votre base via MongoDB Compass

1. Téléchargez [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Utilisez votre chaîne de connexion pour vous connecter
3. Vous pourrez voir et modifier vos données directement

### Via l'interface web Atlas

1. Dans MongoDB Atlas, allez dans **"Collections"**
2. Vous verrez votre base `pizzeria_parigina` avec toutes les collections

## 📊 Monitoring

MongoDB Atlas fournit gratuitement :
- 📈 Métriques de performance
- 🔍 Logs de requêtes
- ⚠️ Alertes automatiques
- 💾 Sauvegardes automatiques (sur les plans payants)

## 🔒 Sécurité

- ✅ Utilisez un mot de passe fort pour l'utilisateur de la base
- ✅ Limitez l'accès IP si possible (0.0.0.0/0 est OK avec un bon mot de passe)
- ✅ Ne commitez JAMAIS votre `.env` dans Git
- ✅ Changez le JWT_SECRET en production

## 💰 Coûts

- **Plan FREE (M0) :** 512MB gratuits, parfait pour commencer
- **Plan M10 :** À partir de $9/mois si vous avez besoin de plus d'espace

## 🆘 Dépannage

### Erreur "Authentication failed"
- Vérifiez le nom d'utilisateur et le mot de passe
- Encodez les caractères spéciaux dans le mot de passe (%40 pour @, etc.)

### Erreur "IP not whitelisted"
- Ajoutez votre IP dans Network Access
- Pour le déploiement, utilisez 0.0.0.0/0

### Erreur de connexion timeout
- Vérifiez que votre cluster est bien démarré
- Vérifiez que l'accès réseau est autorisé

