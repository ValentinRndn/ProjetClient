# 🎓 Vizion Academy - Backend API

> API REST pour la plateforme Vizion Academy - Mise en relation Écoles / Intervenants

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Required-blue.svg)](https://postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-purple.svg)](https://prisma.io/)

---

## 📋 Table des Matières

- [Description](#-description)
- [Stack Technique](#-stack-technique)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [API Reference](#-api-reference)
  - [Authentification](#authentification)
  - [Utilisateurs](#utilisateurs-admin)
  - [Écoles](#écoles)
  - [Intervenants](#intervenants)
  - [Missions](#missions)
- [Modèles de Données](#-modèles-de-données)
- [Rôles & Permissions](#-rôles--permissions)
- [Codes d'Erreur](#-codes-derreur)
- [Scripts NPM](#-scripts-npm)

---

## 📖 Description

Backend API RESTful pour la plateforme **Vizion Academy**, permettant :
- 🏫 Aux **Écoles** de publier des missions et rechercher des intervenants
- 👨‍🏫 Aux **Intervenants** de consulter et postuler aux missions
- 🔐 Authentification sécurisée avec JWT
- 📄 Gestion documentaire (CV, diplômes, KBIS, etc.)

---

## 🛠 Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express.js** | 5.x | Framework web |
| **PostgreSQL** | 14+ | Base de données (OBLIGATOIRE) |
| **Prisma** | 5.x | ORM |
| **JWT** | - | Authentification |
| **Bcrypt** | - | Hashage des mots de passe |
| **Joi** | 18.x | Validation des données |

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Étapes

```bash
# 1. Cloner le repository
git clone https://github.com/t3mq/vizion-backend.git
cd vizion-backend

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env

# 4. Configurer .env (voir section Configuration)

# 5. Générer le client Prisma
npm run db:generate

# 6. Créer les tables dans la base de données
npm run db:push
```

---

## ⚙️ Configuration

Éditer le fichier `.env` :

```env
# Environnement
NODE_ENV=development
PORT=3001

# Base de données PostgreSQL (OBLIGATOIRE)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# JWT
JWT_SECRET=votre-secret-jwt-tres-securise
ACCESS_EXPIRES_IN=15m
REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=15000
RATE_LIMIT_MAX=100
```

---

## ▶️ Lancement

```bash
# Développement (avec hot reload)
npm run dev

# Production
npm start

# Le serveur démarre sur http://localhost:3001
```

### Vérifier que l'API fonctionne

```bash
curl http://localhost:3001/health
# Réponse: { "success": true, "message": "Vizion Academy API is running" }
```

---

## 📡 API Reference

**Base URL**: `http://localhost:3001/api/v1`

### Headers requis

```
Content-Type: application/json
Authorization: Bearer <token>  # Pour les routes protégées
```

---

### Authentification

#### `POST /auth/register` - Inscription

Créer un nouveau compte utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "name": "Jean Dupont",
  "role": "ECOLE"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Jean Dupont",
      "role": "ECOLE"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### `POST /auth/login` - Connexion

**Body:**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Jean Dupont",
      "role": "ECOLE"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### `POST /auth/refresh` - Rafraîchir le token

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "nouveau-access-token",
    "refreshToken": "nouveau-refresh-token"
  }
}
```

---

#### `POST /auth/logout` - Déconnexion 🔒

**Headers:** `Authorization: Bearer <token>`

**Réponse (200):**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

#### `GET /auth/me` - Profil utilisateur 🔒

**Headers:** `Authorization: Bearer <token>`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jean Dupont",
    "role": "ECOLE",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "ecole": {
      "id": "uuid",
      "name": "École Exemple",
      "contactEmail": "contact@ecole.fr"
    }
  }
}
```

---

### Utilisateurs (Admin)

> 🔒 Toutes ces routes nécessitent le rôle `ADMIN`

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/users` | Liste tous les utilisateurs |
| `GET` | `/users/:id` | Détails d'un utilisateur |
| `POST` | `/users` | Créer un utilisateur |
| `PUT` | `/users/:id` | Modifier un utilisateur |
| `DELETE` | `/users/:id` | Supprimer un utilisateur |

#### `GET /users` - Liste des utilisateurs 🔒 ADMIN

**Query params:**
- `role` - Filtrer par rôle (`ADMIN`, `ECOLE`, `INTERVENANT`)
- `page` - Numéro de page (défaut: 1)
- `limit` - Éléments par page (défaut: 20)

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Jean Dupont",
      "role": "ECOLE",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

---

### Écoles

| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| `GET` | `/ecoles` | ADMIN | Liste toutes les écoles |
| `GET` | `/ecoles/me` | ECOLE | Mon profil école |
| `GET` | `/ecoles/:id` | ADMIN | Détails d'une école |
| `POST` | `/ecoles` | ADMIN | Créer une école |
| `PUT` | `/ecoles/:id` | ECOLE/ADMIN | Modifier une école |
| `GET` | `/ecoles/:id/dashboard` | ECOLE/ADMIN | Dashboard de l'école |
| `GET` | `/ecoles/:id/missions` | ECOLE/ADMIN | Missions de l'école |

#### `GET /ecoles/me` - Mon profil école 🔒 ECOLE

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "École Exemple",
    "contactEmail": "contact@ecole.fr",
    "address": "123 Rue de Paris",
    "phone": "0123456789",
    "user": {
      "id": "uuid",
      "email": "user@ecole.fr",
      "name": "Admin École"
    },
    "missions": [
      {
        "id": "uuid",
        "title": "Formation React",
        "status": "ACTIVE"
      }
    ]
  }
}
```

#### `GET /ecoles/:id/dashboard` - Dashboard école 🔒 ECOLE/ADMIN

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "ecole": {
      "id": "uuid",
      "name": "École Exemple"
    },
    "stats": {
      "totalMissions": 15,
      "activeMissions": 5,
      "completedMissions": 8,
      "draftMissions": 2
    }
  }
}
```

---

### Intervenants

| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| `GET` | `/intervenants` | ADMIN/ECOLE | Liste des intervenants |
| `GET` | `/intervenants/me` | INTERVENANT | Mon profil |
| `GET` | `/intervenants/:id` | Tous | Détails d'un intervenant |
| `PUT` | `/intervenants/:id` | INTERVENANT/ADMIN | Modifier profil |
| `PATCH` | `/intervenants/:id/status` | ADMIN | Valider/Refuser |
| `POST` | `/intervenants/:id/documents` | INTERVENANT | Ajouter un document |
| `GET` | `/intervenants/:id/documents` | INTERVENANT/ADMIN | Liste des documents |
| `DELETE` | `/intervenants/:id/documents/:docId` | INTERVENANT/ADMIN | Supprimer un document |

#### `GET /intervenants` - Liste des intervenants 🔒 ADMIN/ECOLE

**Query params:**
- `status` - Filtrer par statut (`EN_ATTENTE`, `VALIDE`, `REFUSE`)
- `specialite` - Filtrer par spécialité

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "siret": "12345678901234",
      "specialite": "Développement Web",
      "tarifHoraire": 75.00,
      "status": "VALIDE",
      "user": {
        "id": "uuid",
        "name": "Marie Martin",
        "email": "marie@example.com"
      }
    }
  ]
}
```

#### `PATCH /intervenants/:id/status` - Valider/Refuser 🔒 ADMIN

**Body:**
```json
{
  "status": "VALIDE"
}
```

**Valeurs possibles:** `VALIDE`, `REFUSE`

**Réponse (200):**
```json
{
  "success": true,
  "message": "Statut mis à jour",
  "data": {
    "id": "uuid",
    "status": "VALIDE"
  }
}
```

#### `POST /intervenants/:id/documents` - Ajouter un document 🔒 INTERVENANT

**Body:**
```json
{
  "type": "CV",
  "nom": "Mon CV 2025",
  "url": "https://storage.example.com/cv.pdf"
}
```

**Types de documents:** `CV`, `DIPLOME`, `KBIS`, `ASSURANCE`, `RIB`, `AUTRE`

---

### Missions

| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| `GET` | `/missions` | Tous | Liste des missions (publiques) |
| `GET` | `/missions/ecole` | ECOLE | Mes missions (école) |
| `GET` | `/missions/intervenant` | INTERVENANT | Mes missions (intervenant) |
| `GET` | `/missions/:id` | Tous | Détails d'une mission |
| `POST` | `/missions` | ECOLE | Créer une mission |
| `PUT` | `/missions/:id` | ECOLE/ADMIN | Modifier une mission |
| `PATCH` | `/missions/:id/status` | ECOLE/ADMIN | Changer le statut |
| `POST` | `/missions/:id/assign` | ECOLE/ADMIN | Affecter un intervenant |
| `DELETE` | `/missions/:id` | ECOLE/ADMIN | Supprimer une mission |

#### `GET /missions` - Liste des missions

**Query params:**
- `status` - Filtrer par statut (`DRAFT`, `ACTIVE`, `COMPLETED`)
- `ecoleId` - Filtrer par école
- `page` - Numéro de page
- `limit` - Éléments par page

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Formation React Avancé",
      "description": "Formation de 3 jours sur React...",
      "status": "ACTIVE",
      "dateDebut": "2025-02-01T09:00:00.000Z",
      "dateFin": "2025-02-03T17:00:00.000Z",
      "tarifJournalier": 500.00,
      "ecole": {
        "id": "uuid",
        "name": "École Exemple"
      },
      "intervenant": {
        "id": "uuid",
        "user": {
          "name": "Marie Martin"
        }
      }
    }
  ]
}
```

#### `POST /missions` - Créer une mission 🔒 ECOLE

**Body:**
```json
{
  "title": "Formation React Avancé",
  "description": "Formation de 3 jours sur React avec hooks, Redux, et tests",
  "dateDebut": "2025-02-01",
  "dateFin": "2025-02-03",
  "tarifJournalier": 500.00
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Mission créée",
  "data": {
    "id": "uuid",
    "title": "Formation React Avancé",
    "status": "DRAFT",
    "ecoleId": "uuid"
  }
}
```

#### `PATCH /missions/:id/status` - Changer le statut 🔒 ECOLE/ADMIN

**Body:**
```json
{
  "status": "ACTIVE"
}
```

**Statuts possibles:** `DRAFT`, `ACTIVE`, `COMPLETED`

#### `POST /missions/:id/assign` - Affecter un intervenant 🔒 ECOLE/ADMIN

**Body:**
```json
{
  "intervenantId": "uuid-de-l-intervenant"
}
```

---

## 📊 Modèles de Données

### User
```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String    // Hashé avec bcrypt
  name      String
  role      UserRole
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  ecole       Ecole?
  intervenant Intervenant?
}

enum UserRole {
  ADMIN
  ECOLE
  INTERVENANT
}
```

### Ecole
```prisma
model Ecole {
  id           String    @id @default(uuid())
  name         String
  contactEmail String
  address      String?
  phone        String?
  userId       String    @unique
  
  user     User      @relation(fields: [userId], references: [id])
  missions Mission[]
}
```

### Intervenant
```prisma
model Intervenant {
  id           String            @id @default(uuid())
  siret        String            @unique
  specialite   String?
  tarifHoraire Float?
  status       IntervenantStatus @default(EN_ATTENTE)
  userId       String            @unique
  
  user      User       @relation(fields: [userId], references: [id])
  missions  Mission[]
  documents Document[]
}

enum IntervenantStatus {
  EN_ATTENTE
  VALIDE
  REFUSE
}
```

### Mission
```prisma
model Mission {
  id             String        @id @default(uuid())
  title          String
  description    String?
  status         MissionStatus @default(DRAFT)
  dateDebut      DateTime?
  dateFin        DateTime?
  tarifJournalier Float?
  ecoleId        String
  intervenantId  String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  
  ecole       Ecole        @relation(fields: [ecoleId], references: [id])
  intervenant Intervenant? @relation(fields: [intervenantId], references: [id])
}

enum MissionStatus {
  DRAFT
  ACTIVE
  COMPLETED
}
```

### Document
```prisma
model Document {
  id            String       @id @default(uuid())
  nom           String
  url           String
  type          DocumentType
  intervenantId String
  createdAt     DateTime     @default(now())
  
  intervenant Intervenant @relation(fields: [intervenantId], references: [id])
}

enum DocumentType {
  CV
  DIPLOME
  KBIS
  ASSURANCE
  RIB
  AUTRE
}
```

---

## 👥 Rôles & Permissions

| Action | ADMIN | ECOLE | INTERVENANT | Public |
|--------|:-----:|:-----:|:-----------:|:------:|
| **Auth** |
| Register | ✅ | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ | ✅ |
| Voir son profil | ✅ | ✅ | ✅ | ❌ |
| **Users** |
| Liste utilisateurs | ✅ | ❌ | ❌ | ❌ |
| CRUD utilisateurs | ✅ | ❌ | ❌ | ❌ |
| **Écoles** |
| Liste écoles | ✅ | ❌ | ❌ | ❌ |
| Voir son profil école | ✅ | ✅ | ❌ | ❌ |
| Modifier son école | ✅ | ✅ | ❌ | ❌ |
| **Intervenants** |
| Liste intervenants | ✅ | ✅ | ❌ | ❌ |
| Voir son profil | ✅ | ❌ | ✅ | ❌ |
| Modifier son profil | ✅ | ❌ | ✅ | ❌ |
| Valider/Refuser | ✅ | ❌ | ❌ | ❌ |
| Gérer ses documents | ✅ | ❌ | ✅ | ❌ |
| **Missions** |
| Voir liste publique | ✅ | ✅ | ✅ | ✅ |
| Voir ses missions | ✅ | ✅ | ✅ | ❌ |
| Créer mission | ✅ | ✅ | ❌ | ❌ |
| Modifier mission | ✅ | ✅* | ❌ | ❌ |
| Supprimer mission | ✅ | ✅* | ❌ | ❌ |
| Affecter intervenant | ✅ | ✅* | ❌ | ❌ |

*\* Uniquement pour ses propres missions*

---

## ❌ Codes d'Erreur

| Code | Message | Description |
|------|---------|-------------|
| `400` | Bad Request | Données invalides ou manquantes |
| `401` | Unauthorized | Token manquant ou invalide |
| `403` | Forbidden | Accès refusé (rôle insuffisant) |
| `404` | Not Found | Ressource non trouvée |
| `409` | Conflict | Conflit (ex: email déjà utilisé) |
| `422` | Unprocessable Entity | Erreur de validation |
| `429` | Too Many Requests | Rate limit dépassé |
| `500` | Internal Server Error | Erreur serveur |

### Format des erreurs

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": [
    {
      "field": "email",
      "message": "Email invalide"
    }
  ]
}
```

---

## 🔧 Scripts NPM

| Script | Commande | Description |
|--------|----------|-------------|
| `start` | `node src/server.js` | Démarrer en production |
| `dev` | `node --watch src/server.js` | Démarrer en développement (hot reload) |
| `db:generate` | `prisma generate` | Générer le client Prisma |
| `db:push` | `prisma db push` | Synchroniser le schéma avec la BDD |
| `db:migrate` | `prisma migrate dev` | Créer une migration |
| `db:studio` | `prisma studio` | Interface graphique Prisma |

---

## 🧪 Tests avec cURL

```bash
# Health check
curl http://localhost:3001/health

# Inscription
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User","role":"ECOLE"}'

# Connexion
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Profil (avec token)
curl http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN"

# Créer une mission (école)
curl -X POST http://localhost:3001/api/v1/missions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{"title":"Formation JS","description":"Formation JavaScript avancé"}'
```

---

## 📁 Structure du Projet

```
vizion-backend/
├── prisma/
│   └── schema.prisma       # Schéma de base de données
├── src/
│   ├── config/
│   │   └── index.js        # Configuration (env vars)
│   ├── controllers/        # Logique des endpoints
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── schools.controller.js
│   │   ├── intervenants.controller.js
│   │   └── missions.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js      # Vérification JWT
│   │   ├── errorHandler.middleware.js
│   │   └── validate.middleware.js  # Validation Joi
│   ├── routes/             # Définition des routes
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── schools.routes.js
│   │   ├── intervenants.routes.js
│   │   └── missions.routes.js
│   ├── services/           # Logique métier
│   │   ├── auth.service.js
│   │   ├── users.service.js
│   │   ├── schools.service.js
│   │   ├── intervenants.service.js
│   │   └── missions.service.js
│   ├── validators/         # Schémas Joi
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── intervenant.validator.js
│   │   └── mission.validator.js
│   ├── utils/
│   │   └── logger.js
│   ├── app.js              # Configuration Express
│   └── server.js           # Point d'entrée
├── prisma.js               # Client Prisma singleton
├── .env                    # Variables d'environnement
├── .env.example            # Template .env
├── package.json
└── README.md
```

---

## 📅 Roadmap MVP

- [x] Authentification JWT
- [x] CRUD Utilisateurs (Admin)
- [x] Gestion des Écoles
- [x] Gestion des Intervenants
- [x] Gestion des Missions
- [x] Validation/Refus des Intervenants
- [x] Gestion documentaire
- [ ] Upload de fichiers (S3)
- [ ] Notifications email
- [ ] Tests unitaires

**Deadline MVP: 20 décembre 2025**

---

## 👥 Auteurs

- **Vizion Academy Team**

## 📝 Licence

ISC © 2025 Vizion Academy
