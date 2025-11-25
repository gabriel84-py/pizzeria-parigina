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

### Variables d'environnement requises

Créez un fichier `.env` dans le dossier `backend/` avec :

```env
MONGODB_URI=mongodb://localhost:27017/pizzeria_parigina
# ou pour MongoDB Atlas :
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pizzeria_parigina

JWT_SECRET=votre_secret_jwt_long_et_securise
PORT=5000
```

### Plateformes de déploiement

#### Heroku

1. Créez un compte sur [Heroku](https://www.heroku.com)
2. Installez le CLI Heroku
3. Connectez-vous : `heroku login`
4. Créez l'app : `heroku create pizzeria-parigina`
5. Configurez les variables d'environnement :
   ```bash
   heroku config:set MONGODB_URI=votre_mongodb_uri
   heroku config:set JWT_SECRET=votre_secret_jwt
   heroku config:set NODE_ENV=production
   ```
6. Déployez : `git push heroku main`

#### Railway

1. Créez un compte sur [Railway](https://railway.app)
2. Connectez votre repository GitHub
3. Configurez les variables d'environnement dans le dashboard
4. Railway détectera automatiquement le `package.json` et utilisera `npm start`

#### Render

1. Créez un compte sur [Render](https://render.com)
2. Créez un nouveau "Web Service"
3. Connectez votre repository GitHub
4. Configuration :
   - **Build Command :** `npm install`
   - **Start Command :** `npm start`
   - **Environment :** Node
5. Ajoutez les variables d'environnement dans le dashboard

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

- ⚠️ **Sécurité :** Changez le JWT_SECRET en production
- ⚠️ **MongoDB :** Utilisez MongoDB Atlas pour la production (gratuit jusqu'à 512MB)
- ⚠️ **HTTPS :** La plupart des plateformes fournissent HTTPS automatiquement
- ⚠️ **CORS :** Le serveur accepte toutes les origines. Restreignez en production si nécessaire

