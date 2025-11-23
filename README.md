# Détection de Poubelles - Frontend React

Interface web React pour la détection de poubelles pleines/vides.

##  Installation

```bash
npm install
```

##  Lancement

```bash
# Mode développement
npm start

# Build pour production
npm build
```

L'application sera accessible à : http://localhost:3000

##  Configuration

Créez un fichier `.env` pour configurer l'URL du backend :

```
REACT_APP_API_URL=http://localhost:8000
```

##  Dépendances principales

- **React 19** - Framework UI
- **Axios** - Client HTTP
- **React Scripts** - Outils de build

## Fonctionnalités

- Upload d'images par drag & drop
- Upload multiple (jusqu'à 10 images)
- Affichage des résultats annotés
- Statistiques de détection
- Design responsive et moderne

##  Déploiement

Le frontend peut être déployé sur Vercel, Netlify ou Render.

### Vercel/Netlify

```bash
npm run build
# Déployer le dossier build/
```

### Variables d'environnement

- `REACT_APP_API_URL` : URL du backend FastAPI

##  Interface

L'application offre :
- Zone de drop pour les images
- Prévisualisation des résultats
- Badges colorés pour chaque classe
- Détails expandables pour chaque détection
