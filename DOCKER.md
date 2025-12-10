# Guide Docker - Développement Local

Ce guide explique comment lancer l'application complète avec Docker en mode développement.

## Prérequis

- Docker installé sur votre machine
- Docker Compose installé (généralement inclus avec Docker Desktop)

**Note** : Aucune configuration supplémentaire n'est nécessaire. Tous les fichiers de configuration (y compris `.env`) sont inclus dans le projet pour un démarrage immédiat.

## Architecture

L'application est composée de 4 services :

1. **PostgreSQL** : Base de données (port 5432)
2. **Backend** : API Express avec Prisma (port 3001)
3. **Client** : Frontend React/TypeScript avec Vite (port 5173)
4. **Web** : Frontend React avec Vite (port 5174)

## Démarrage rapide

### Option 1 : Utiliser le script automatique (recommandé)

```bash
./docker-start.sh
```

Ce script :

- ✅ Vérifie les prérequis (Docker, permissions)
- ✅ Crée automatiquement le fichier `.env` si nécessaire
- ✅ Démarre tous les services
- ✅ Initialise la base de données (migrations + seed)
- ✅ Configure tout automatiquement

### Option 2 : Utiliser docker compose directement

```bash
# Lancer tous les services
docker compose up -d

# Initialiser la base de données
docker compose exec backend npm run db:generate
docker compose exec backend npm run db:migrate
docker compose exec backend npm run db:seed
```

**Note** : Tous les fichiers de configuration (`.env`, etc.) sont inclus dans le projet. Aucune configuration manuelle n'est nécessaire !

### 3. Accéder aux services

- **Backend API** : http://localhost:3001
- **Client Frontend** : http://localhost:5173
- **Web Frontend** : http://localhost:5174
- **PostgreSQL** : localhost:5432

## Commandes utiles

### Voir les logs

```bash
# Tous les services
docker compose logs -f

# Un service spécifique
docker compose logs -f backend
docker compose logs -f client
docker compose logs -f web
```

### Arrêter les services

```bash
docker-compose down
```

Pour supprimer aussi les volumes (⚠️ supprime les données de la base) :

```bash
docker-compose down -v
```

### Redémarrer un service

```bash
docker-compose restart backend
```

### Exécuter une commande dans un conteneur

```bash
# Backend
docker compose exec backend npm run db:studio

# Client
docker compose exec client pnpm install

# Web
docker compose exec web pnpm install
```

## Configuration

Les variables d'environnement sont définies dans `docker-compose.yml`. Pour les modifier :

1. Modifiez directement le fichier `docker-compose.yml`
2. Ou créez un fichier `.env` à la racine du projet

## Dépannage

### Le backend ne peut pas se connecter à la base de données

Vérifiez que PostgreSQL est bien démarré :

```bash
docker-compose ps
```

Attendez que le healthcheck de PostgreSQL soit vert avant de démarrer le backend.

### Les dépendances ne sont pas installées

Rebuild les images :

```bash
docker compose build --no-cache
docker compose up
```

### Port déjà utilisé

Si un port est déjà utilisé, modifiez-le dans `docker-compose.yml` :

```yaml
ports:
  - "NouveauPort:PortInterne"
```

## Notes

- Les volumes sont montés pour le développement, donc les modifications de code sont reflétées immédiatement
- La base de données persiste dans un volume Docker nommé `postgres_data`
- En mode développement, les hot-reloads fonctionnent pour tous les services
