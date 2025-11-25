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

### ✅ Base de données SQLite

**Aucune configuration de base de données externe nécessaire !**

La base de données SQLite est incluse et se crée automatiquement dans `backend/data/app.db` lors du premier démarrage. C'est beaucoup plus simple que MongoDB !

### Variables d'environnement requises

Créez un fichier `.env` dans le dossier `backend/` avec :

```env
# Sécurité (OBLIGATOIRE)
JWT_SECRET=votre_secret_jwt_long_et_securise_au_moins_32_caracteres

# Port (optionnel, défaut: 5000)
PORT=5000
```

**⚠️ Important :**
- Le `JWT_SECRET` est obligatoire pour la sécurité
- La base de données SQLite sera créée automatiquement
- Aucune configuration MongoDB nécessaire !

### Plateformes de déploiement

#### Heroku

1. Créez un compte sur [Heroku](https://www.heroku.com)
2. Installez le CLI Heroku : `npm install -g heroku`
3. Connectez-vous : `heroku login`
4. Créez l'app : `heroku create pizzeria-parigina`
5. Configurez les variables d'environnement :
   ```bash
   heroku config:set JWT_SECRET="votre_secret_jwt_long_et_securise"
   heroku config:set NODE_ENV=production
   ```
6. Déployez : `git push heroku main`
7. Ouvrez l'app : `heroku open`

**Note :** La base de données SQLite sera créée automatiquement dans le système de fichiers d'Heroku (éphémère). Pour la persistance, utilisez un addon comme Heroku Postgres ou migrez vers une autre plateforme.

#### Railway

1. Créez un compte sur [Railway](https://railway.app)
2. Connectez votre repository GitHub
3. Dans le dashboard Railway :
   - Allez dans **"Variables"**
   - Ajoutez `JWT_SECRET` avec un secret sécurisé
   - Ajoutez `NODE_ENV=production` (optionnel)
4. Railway détectera automatiquement le `package.json` et utilisera `npm start`
5. Le déploiement se fera automatiquement à chaque push

**Note :** Railway fournit un système de fichiers persistant, donc votre base SQLite sera sauvegardée.

#### Render

1. Créez un compte sur [Render](https://render.com)
2. Créez un nouveau "Web Service"
3. Connectez votre repository GitHub
4. Configuration :
   - **Build Command :** `npm install`
   - **Start Command :** `npm start`
   - **Environment :** Node
   - **Node Version :** 18.x ou supérieur
5. Dans **"Environment"**, ajoutez les variables :
   - `JWT_SECRET` : votre secret JWT sécurisé
   - `NODE_ENV` : `production` (optionnel)
6. Cliquez sur **"Create Web Service"**

**Note :** Render fournit un système de fichiers persistant, donc votre base SQLite sera sauvegardée.

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

- ✅ **SQLite inclus :** Aucune base de données externe nécessaire ! La base se crée automatiquement
- ⚠️ **Sécurité :** Changez le JWT_SECRET en production (minimum 32 caractères)
- ⚠️ **HTTPS :** La plupart des plateformes fournissent HTTPS automatiquement
- ⚠️ **CORS :** Le serveur accepte toutes les origines. Restreignez en production si nécessaire
- ⚠️ **Initialisation :** Les données (admin, pizzas, etc.) sont créées automatiquement au premier démarrage
- ⚠️ **Persistance :** Sur certaines plateformes (comme Heroku), le système de fichiers est éphémère. La base sera recréée à chaque redémarrage. Utilisez Railway ou Render pour la persistance.

## 🆘 Dépannage

### Le serveur ne démarre pas
- Vérifiez que `JWT_SECRET` est bien configuré
- Vérifiez les logs de déploiement pour voir les erreurs
- Assurez-vous que le dossier `backend/data/` peut être créé

### Erreur de base de données
- Vérifiez que le serveur a les permissions d'écriture pour créer `backend/data/app.db`
- Sur certaines plateformes, vous devrez peut-être créer le dossier `data` manuellement

### Les données ne s'affichent pas
- Attendez quelques secondes après le premier démarrage (initialisation automatique)
- Vérifiez les logs pour voir si l'initialisation s'est bien passée
- Connectez-vous au panel admin pour vérifier que les données existent

