# 📡 Documentation des Routes API - Vizion Academy

**Base URL** : `http://localhost:3001/api/v1`

**Authentification** : JWT Bearer Token dans le header `Authorization: Bearer <token>`

---

## 🔐 Authentification (`/auth`)

### `POST /api/v1/auth/register`

**Description** : Inscription d'un nouvel utilisateur  
**Accès** : Public  
**Rate Limit** : 5 requêtes/minute  
**Body** :

```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "role": "ECOLE" | "INTERVENANT" | "ADMIN",
  "ecoleData": { "name": "..." },  // Si role = ECOLE
  "intervenantData": { "bio": "..." }  // Si role = INTERVENANT
}
```

**Réponse** :

```json
{
  "success": true,
  "user": { "id": "...", "email": "...", "role": "..." },
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "expiresIn": "15m"
}
```

### `POST /api/v1/auth/login`

**Description** : Connexion et obtention des tokens JWT  
**Accès** : Public  
**Rate Limit** : 5 requêtes/minute  
**Body** :

```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponse** :

```json
{
  "success": true,
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "expiresIn": "15m",
  "user": { "id": "...", "email": "...", "role": "..." }
}
```

### `POST /api/v1/auth/refresh`

**Description** : Rafraîchir le token d'accès  
**Accès** : Public  
**Body** :

```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Réponse** :

```json
{
  "success": true,
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...", // Optionnel
  "expiresIn": "15m"
}
```

### `POST /api/v1/auth/logout`

**Description** : Déconnexion et invalidation du refresh token  
**Accès** : Public  
**Body** :

```json
{
  "refreshToken": "eyJhbGci..." // Optionnel
}
```

### `GET /api/v1/auth/me`

**Description** : Récupérer le profil de l'utilisateur connecté  
**Accès** : Authentifié  
**Headers** : `Authorization: Bearer <token>`  
**Réponse** :

```json
{
  "success": true,
  "user": { "id": "...", "email": "...", "role": "..." }
}
```

---

## 👥 Utilisateurs (`/users`)

### `GET /api/v1/users`

**Description** : Liste tous les utilisateurs (avec pagination et filtres)  
**Accès** : ADMIN uniquement  
**Query Parameters** :

- `take` : Nombre de résultats (1-100, défaut: 50)
- `skip` : Nombre de résultats à sauter (défaut: 0)
- `role` : Filtrer par rôle (ADMIN, ECOLE, INTERVENANT)
- `q` : Recherche textuelle (max 100 caractères)

### `POST /api/v1/users`

**Description** : Créer un nouvel utilisateur  
**Accès** : ADMIN uniquement  
**Body** :

```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "role": "ECOLE" | "INTERVENANT" | "ADMIN"
}
```

### `GET /api/v1/users/:id`

**Description** : Récupérer un utilisateur par son ID  
**Accès** : Authentifié (soi-même ou ADMIN)

### `PATCH /api/v1/users/:id`

**Description** : Mettre à jour un utilisateur  
**Accès** : Authentifié (soi-même ou ADMIN)  
**Body** :

```json
{
  "email": "newemail@example.com",
  "password": "nouveaumotdepasse" // Optionnel
}
```

### `DELETE /api/v1/users/:id`

**Description** : Supprimer un utilisateur  
**Accès** : ADMIN uniquement

### `PATCH /api/v1/users/:id/role`

**Description** : Changer le rôle d'un utilisateur  
**Accès** : ADMIN uniquement  
**Body** :

```json
{
  "role": "ECOLE" | "INTERVENANT" | "ADMIN"
}
```

---

## 🏫 Écoles (`/ecoles`)

### `POST /api/v1/ecoles`

**Description** : Créer une nouvelle école  
**Accès** : ADMIN uniquement  
**Body** :

```json
{
  "name": "Nom de l'école",
  "contactEmail": "contact@ecole.fr",
  "address": "123 Rue Example",
  "phone": "0123456789"
}
```

### `GET /api/v1/ecoles`

**Description** : Liste toutes les écoles  
**Accès** : ADMIN uniquement

### `GET /api/v1/ecoles/:id`

**Description** : Récupérer une école par son ID  
**Accès** : Authentifié

### `PATCH /api/v1/ecoles/:id`

**Description** : Mettre à jour une école  
**Accès** : ADMIN ou l'école elle-même  
**Body** :

```json
{
  "name": "Nouveau nom",
  "contactEmail": "nouveau@email.fr",
  "address": "Nouvelle adresse",
  "phone": "0987654321"
}
```

### `DELETE /api/v1/ecoles/:id`

**Description** : Supprimer une école  
**Accès** : ADMIN uniquement

### `GET /api/v1/ecoles/:id/dashboard`

**Description** : Récupérer le dashboard d'une école (stats, missions, etc.)  
**Accès** : ADMIN ou l'école elle-même

### `POST /api/v1/ecoles/:id/declare-mission`

**Description** : Déclarer une nouvelle mission pour l'école  
**Accès** : ECOLE ou ADMIN  
**Body** : (détails de la mission)

---

## 👨‍🏫 Intervenants (`/intervenants`)

### `GET /api/v1/intervenants`

**Description** : Liste tous les intervenants (avec pagination et filtres)  
**Accès** : ADMIN uniquement  
**Query Parameters** :

- `take` : Nombre de résultats (1-100, défaut: 50)
- `skip` : Nombre de résultats à sauter (défaut: 0)
- `status` : Filtrer par statut (pending, approved, rejected)

### `GET /api/v1/intervenants/:id`

**Description** : Récupérer un intervenant par son ID  
**Accès** : Authentifié

### `PATCH /api/v1/intervenants/:id`

**Description** : Mettre à jour un intervenant  
**Accès** : ADMIN ou l'intervenant lui-même  
**Body** :

```json
{
  "bio": "Nouvelle biographie",
  "siret": "12345678901234",
  "disponibility": { "days": ["lundi", "mardi"] }
}
```

### `PATCH /api/v1/intervenants/:id/status`

**Description** : Changer le statut d'un intervenant (validation admin)  
**Accès** : ADMIN uniquement  
**Body** :

```json
{
  "status": "pending" | "approved" | "rejected"
}
```

### `GET /api/v1/intervenants/:id/documents`

**Description** : Liste tous les documents d'un intervenant  
**Accès** : Authentifié

### `POST /api/v1/intervenants/:id/documents`

**Description** : Uploader un document pour un intervenant  
**Accès** : ADMIN ou l'intervenant lui-même  
**Body** :

```json
{
  "fileName": "cv.pdf",
  "filePath": "s3://bucket/cv.pdf",
  "type": "CV" | "RIB" | "KBIS" | "DIPLOME" | "AUTRE"
}
```

### `DELETE /api/v1/intervenants/:id/documents/:docId`

**Description** : Supprimer un document  
**Accès** : ADMIN ou l'intervenant lui-même

---

## 📋 Missions (`/missions`)

### `GET /api/v1/missions`

**Description** : Liste toutes les missions avec filtres  
**Accès** : Authentifié  
**Query Parameters** :

- `ecoleId` : Filtrer par école (UUID)
- `intervenantId` : Filtrer par intervenant (UUID)
- `status` : Filtrer par statut (DRAFT, ACTIVE, COMPLETED)
- `take` : Nombre de résultats (1-100, défaut: 50)
- `skip` : Nombre de résultats à sauter (défaut: 0)
- `q` : Recherche textuelle (max 100 caractères)

### `GET /api/v1/missions/ecole`

**Description** : Liste les missions de l'école connectée  
**Accès** : ECOLE ou ADMIN  
**Fonctionnement** : Récupère automatiquement l'école de l'utilisateur connecté

### `GET /api/v1/missions/intervenant`

**Description** : Liste les missions de l'intervenant connecté  
**Accès** : INTERVENANT ou ADMIN  
**Fonctionnement** : Récupère automatiquement l'intervenant de l'utilisateur connecté

### `POST /api/v1/missions`

**Description** : Créer une nouvelle mission  
**Accès** : ECOLE uniquement  
**Body** :

```json
{
  "title": "Titre de la mission",
  "description": "Description détaillée",
  "status": "DRAFT" | "ACTIVE",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "priceCents": 50000
}
```

### `GET /api/v1/missions/:id`

**Description** : Récupérer une mission par son ID  
**Accès** : Authentifié

### `PATCH /api/v1/missions/:id`

**Description** : Mettre à jour une mission  
**Accès** : ECOLE ou ADMIN  
**Body** :

```json
{
  "title": "Nouveau titre",
  "description": "Nouvelle description",
  "priceCents": 60000
}
```

### `PATCH /api/v1/missions/:id/status`

**Description** : Changer le statut d'une mission  
**Accès** : ECOLE ou ADMIN  
**Body** :

```json
{
  "status": "DRAFT" | "ACTIVE" | "COMPLETED"
}
```

### `POST /api/v1/missions/:id/assign`

**Description** : Affecter un intervenant à une mission  
**Accès** : ECOLE ou ADMIN  
**Body** :

```json
{
  "intervenantId": "uuid-de-l-intervenant"
}
```

### `DELETE /api/v1/missions/:id`

**Description** : Supprimer une mission  
**Accès** : ECOLE ou ADMIN

---

## 🎯 Challenges (`/challenges`)

**Note** : Ces routes sont définies mais peuvent ne pas être montées dans `index.js`

### `GET /api/v1/challenges`

**Description** : Liste publique des challenges (avec filtres et pagination)  
**Accès** : Public

### `GET /api/v1/challenges/:id`

**Description** : Récupérer un challenge par son ID  
**Accès** : Public ou Authentifié

### `POST /api/v1/challenges/:id/feedback`

**Description** : Soumettre un feedback sur un challenge  
**Accès** : Authentifié

### `POST /api/v1/challenges`

**Description** : Créer un nouveau challenge  
**Accès** : ADMIN ou SUPER_ADMIN

### `PATCH /api/v1/challenges/:id`

**Description** : Mettre à jour un challenge  
**Accès** : ADMIN ou SUPER_ADMIN

### `DELETE /api/v1/challenges/:id`

**Description** : Supprimer un challenge  
**Accès** : ADMIN ou SUPER_ADMIN

### `POST /api/v1/challenges/:id/activate`

**Description** : Activer un challenge  
**Accès** : ADMIN ou SUPER_ADMIN

### `POST /api/v1/challenges/:id/deactivate`

**Description** : Désactiver un challenge  
**Accès** : ADMIN ou SUPER_ADMIN

---

## 💰 Factures (`/invoices`)

**Note** : Ces routes sont définies mais peuvent ne pas être montées dans `index.js`

### `POST /api/v1/invoices/webhook`

**Description** : Webhook public pour les PSP (Stripe, MangoPay, etc.)  
**Accès** : Public  
**Important** : Nécessite un raw body (pas de JSON middleware)

### `GET /api/v1/invoices`

**Description** : Liste des factures (utilisateur : ses propres factures, admin : toutes)  
**Accès** : Authentifié

### `GET /api/v1/invoices/:id`

**Description** : Récupérer une facture par son ID  
**Accès** : Authentifié

### `GET /api/v1/invoices/:id/download`

**Description** : Télécharger le PDF d'une facture  
**Accès** : Propriétaire ou ADMIN

### `GET /api/v1/invoices/:id/pdf-url`

**Description** : Obtenir une URL signée pour le PDF  
**Accès** : Authentifié

### `POST /api/v1/invoices/generate`

**Description** : Générer une facture pour une ressource (mission, remboursement, etc.)  
**Accès** : Authentifié

### `POST /api/v1/invoices/:id/pay`

**Description** : Marquer une facture comme payée  
**Accès** : Authentifié

### `POST /api/v1/invoices/:id/regenerate`

**Description** : Régénérer le PDF d'une facture  
**Accès** : ADMIN ou SUPER_ADMIN

---

## 💳 Paiements (`/payments`)

**Note** : Ces routes sont définies mais peuvent ne pas être montées dans `index.js`

### `POST /api/v1/payments/webhook`

**Description** : Webhook public Stripe  
**Accès** : Public  
**Important** : Nécessite un raw body (pas de JSON middleware)

### `POST /api/v1/payments/intent`

**Description** : Créer une intention de paiement pour une mission, challenge, service...  
**Accès** : Authentifié

### `GET /api/v1/payments/:id`

**Description** : Récupérer le détail d'un paiement  
**Accès** : Authentifié

### `GET /api/v1/payments`

**Description** : Liste des paiements avec filtres (date, user, status...)  
**Accès** : ADMIN ou SUPER_ADMIN

### `POST /api/v1/payments/:id/refund`

**Description** : Effectuer un remboursement  
**Accès** : ADMIN ou SUPER_ADMIN

---

## 🔔 Webhooks (`/webhooks`)

**Note** : Ces routes sont définies mais peuvent ne pas être montées dans `index.js`

### `POST /api/v1/webhooks/stripe`

**Description** : Webhook Stripe (nécessite raw body)  
**Accès** : Public

### `POST /api/v1/webhooks/payment`

**Description** : Webhook générique pour paiements (Paypal, MangoPay, Payplig, Lemonway...)  
**Accès** : Public

### `POST /api/v1/webhooks/email`

**Description** : Webhook pour providers email (Brevo, SendInBlue, Mailgun, Resend...)  
**Accès** : Public

### `POST /api/v1/webhooks/storage`

**Description** : Webhook pour événements de stockage (AWS S3, Cloudflare R2, Minio...)  
**Accès** : Public

### `POST /api/v1/webhooks/log`

**Description** : Webhook générique de fallback pour logging  
**Accès** : Public

---

## 📊 Tracking (`/tracking`)

**Note** : Ces routes sont définies mais peuvent ne pas être montées dans `index.js`

### `POST /api/v1/tracking/event`

**Description** : Enregistrer un événement personnalisé  
**Accès** : Public

### `POST /api/v1/tracking/pageview`

**Description** : Enregistrer une page vue  
**Accès** : Public

### `POST /api/v1/tracking/action`

**Description** : Enregistrer une action utilisateur  
**Accès** : Authentifié

### `GET /api/v1/tracking`

**Description** : Liste des événements de tracking  
**Accès** : ADMIN ou SUPER_ADMIN

### `GET /api/v1/tracking/:id`

**Description** : Récupérer un événement de tracking par son ID  
**Accès** : ADMIN ou SUPER_ADMIN

---

## 👨‍💼 Admin (`/admin`)

**Note** : Ces routes sont définies mais peuvent ne pas être montées dans `index.js`

**Toutes les routes admin nécessitent** : Authentification + Rôle ADMIN ou SUPER_ADMIN

### `GET /api/v1/admin/users`

**Description** : Liste des utilisateurs (vue admin)

### `GET /api/v1/admin/logs`

**Description** : Récupérer les logs d'audit

### `POST /api/v1/admin/intervenants/:id/validate`

**Description** : Valider un intervenant

### `POST /api/v1/admin/export`

**Description** : Créer un export de données

### `GET /api/v1/admin/export/:id`

**Description** : Récupérer un export par son ID

### `GET /api/v1/admin/stats`

**Description** : Récupérer les statistiques du dashboard admin

### `POST /api/v1/admin/reload-cache`

**Description** : Recharger le cache (opération interne)

---

## 🏥 Health Check

### `GET /health`

**Description** : Vérifier que l'API est en ligne  
**Accès** : Public  
**Réponse** :

```json
{
  "success": true,
  "message": "Vizion Academy API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 📝 Notes Importantes

### Routes Montées dans `index.js`

Seules ces routes sont actuellement montées dans l'application :

- `/auth`
- `/users`
- `/ecoles`
- `/intervenants`
- `/missions`

Les autres routes (challenges, invoices, payments, webhooks, tracking, admin) sont définies mais peuvent ne pas être montées. Vérifiez `src/routes/index.js` pour confirmer.

### Authentification

- Toutes les routes protégées nécessitent un header : `Authorization: Bearer <token>`
- Les tokens expirent après 15 minutes (configurable)
- Utilisez `/auth/refresh` pour obtenir un nouveau token

### Rôles

- **ADMIN** : Accès complet
- **ECOLE** : Gestion de ses propres missions et profil
- **INTERVENANT** : Gestion de son profil et consultation des missions

### Rate Limiting

- Routes d'authentification : 5 requêtes/minute
- Autres routes : Selon configuration

### Validation

- Toutes les routes utilisent Joi pour la validation
- Les erreurs de validation retournent un code 400 avec les détails

### Format des Réponses

**Succès** :

```json
{
  "success": true,
  "data": { ... }
}
```

**Erreur** :

```json
{
  "success": false,
  "message": "Message d'erreur",
  "error": { ... }  // Optionnel
}
```

---

_Document généré le : $(date)_  
_Projet : Vizion Academy - Backend API_
