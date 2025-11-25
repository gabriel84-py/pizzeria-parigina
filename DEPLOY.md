# 🚀 Guide de Déploiement

## Commandes de déploiement

Depuis la **racine du projet**, vous pouvez maintenant utiliser :

```bash
# Installation des dépendances
npm install

# Démarrage du serveur
npm start

# Développement avec auto-reload
npm run dev
```

## Configuration pour le déploiement

### 📚 Configuration MongoDB Atlas (OBLIGATOIRE)

**Vous devez configurer MongoDB Atlas avant de déployer !**

👉 **Voir le guide complet :** [MONGODB_SETUP.md](./MONGODB_SETUP.md)

**Résumé rapide :**
1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit)
2. Créez un cluster FREE (M0)
3. Créez un utilisateur de base de données
4. Autorisez l'accès réseau (0.0.0.0/0 pour la production)
5. Copiez votre chaîne de connexion

### Variables d'environnement requises

Créez un fichier `.env` dans le dossier `backend/` avec :

```env
# MongoDB Atlas (OBLIGATOIRE pour le déploiement)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pizzeria_parigina?retryWrites=true&w=majority

# Sécurité
JWT_SECRET=votre_secret_jwt_long_et_securise_au_moins_32_caracteres

# Port (optionnel, défaut: 5000)
PORT=5000
```

**⚠️ Important :**
- Remplacez `username` et `password` par vos identifiants MongoDB Atlas
- Encodez les caractères spéciaux dans le mot de passe (%40 pour @, %23 pour #)
- Ajoutez `/pizzeria_parigina` avant le `?` pour nommer votre base de données

### Plateformes de déploiement

#### Heroku

1. Créez un compte sur [Heroku](https://www.heroku.com)
2. Installez le CLI Heroku : `npm install -g heroku`
3. Connectez-vous : `heroku login`
4. Créez l'app : `heroku create pizzeria-parigina`
5. **Configurez MongoDB Atlas** (voir [MONGODB_SETUP.md](./MONGODB_SETUP.md))
6. Configurez les variables d'environnement :
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pizzeria_parigina?retryWrites=true&w=majority"
   heroku config:set JWT_SECRET="votre_secret_jwt_long_et_securise"
   heroku config:set NODE_ENV=production
   ```
7. Déployez : `git push heroku main`
8. Ouvrez l'app : `heroku open`

#### Railway

1. Créez un compte sur [Railway](https://railway.app)
2. Connectez votre repository GitHub
3. **Configurez MongoDB Atlas** (voir [MONGODB_SETUP.md](./MONGODB_SETUP.md))
4. Dans le dashboard Railway :
   - Allez dans **"Variables"**
   - Ajoutez `MONGODB_URI` avec votre chaîne de connexion Atlas
   - Ajoutez `JWT_SECRET` avec un secret sécurisé
   - Ajoutez `NODE_ENV=production`
5. Railway détectera automatiquement le `package.json` et utilisera `npm start`
6. Le déploiement se fera automatiquement à chaque push

#### Render

1. Créez un compte sur [Render](https://render.com)
2. Créez un nouveau "Web Service"
3. Connectez votre repository GitHub
4. **Configurez MongoDB Atlas** (voir [MONGODB_SETUP.md](./MONGODB_SETUP.md))
5. Configuration :
   - **Build Command :** `npm install`
   - **Start Command :** `npm start`
   - **Environment :** Node
   - **Node Version :** 18.x ou supérieur
6. Dans **"Environment"**, ajoutez les variables :
   - `MONGODB_URI` : votre chaîne de connexion Atlas
   - `JWT_SECRET` : votre secret JWT
   - `NODE_ENV` : `production`
7. Cliquez sur **"Create Web Service"**

#### Vercel / Netlify

Ces plateformes sont optimisées pour le frontend statique. Pour déployer le backend, utilisez plutôt Heroku, Railway ou Render.

## Vérification du déploiement

Une fois déployé, vérifiez que :

1. ✅ Le serveur démarre sans erreur
2. ✅ MongoDB est connecté
3. ✅ L'API répond sur `/api/health`
4. ✅ Le frontend est accessible
5. ✅ Le panel admin fonctionne

## Notes importantes

- ⚠️ **MongoDB Atlas OBLIGATOIRE :** Vous devez configurer MongoDB Atlas avant de déployer (voir [MONGODB_SETUP.md](./MONGODB_SETUP.md))
- ⚠️ **Sécurité :** Changez le JWT_SECRET en production (minimum 32 caractères)
- ⚠️ **MongoDB :** Le plan FREE (M0) offre 512MB gratuits, suffisant pour commencer
- ⚠️ **HTTPS :** La plupart des plateformes fournissent HTTPS automatiquement
- ⚠️ **CORS :** Le serveur accepte toutes les origines. Restreignez en production si nécessaire
- ⚠️ **Initialisation :** Les données (admin, pizzas, etc.) sont créées automatiquement au premier démarrage

## 🆘 Dépannage

### Le serveur ne démarre pas
- Vérifiez que `MONGODB_URI` est bien configuré
- Vérifiez les logs de déploiement pour voir les erreurs

### Erreur de connexion MongoDB
- Vérifiez que votre IP est autorisée dans MongoDB Atlas (Network Access)
- Pour la production, utilisez 0.0.0.0/0 (toutes les IP)
- Vérifiez que le mot de passe est correctement encodé dans l'URI

### Les données ne s'affichent pas
- Attendez quelques secondes après le premier démarrage (initialisation automatique)
- Vérifiez les logs pour voir si l'initialisation s'est bien passée
- Connectez-vous au panel admin pour vérifier que les données existent

