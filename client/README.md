# Vizion Academy - Client

Application frontend pour Vizion Academy.

## 📦 Installation

```bash
pnpm install
```

## 🚀 Développement

```bash
pnpm dev
```

L'application sera accessible sur `http://localhost:5173`

## 🔧 Configuration

Créez un fichier `.env` à la racine avec :

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_API_TIMEOUT=10000
```

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── ProtectedRoute.tsx    # Route protégée (nécessite auth)
│   ├── PublicRoute.tsx       # Route publique (redirige si connecté)
│   └── LoggedOutRoute.tsx    # Route pour utilisateurs déconnectés
├── hooks/              # Hooks React
│   └── useAuth.ts            # Hook d'authentification
├── lib/                # Bibliothèques et utilitaires
│   ├── api.ts               # Client API avec intercepteurs
│   └── auth.ts              # Utilitaires d'authentification
├── services/           # Services API
│   ├── auth.ts              # Service d'authentification
│   ├── missions.ts          # Service des missions
│   ├── ecoles.ts            # Service des écoles
│   ├── intervenants.ts      # Service des intervenants
│   └── users.ts             # Service des utilisateurs
└── pages/              # Pages de l'application
```

## 🔐 Authentification

### Utilisation du hook `useAuth`

```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login("email@example.com", "password");
      // Redirection automatique ou traitement
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Connecté en tant que {user?.email}</p>
          <button onClick={logout}>Déconnexion</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Connexion</button>
      )}
    </div>
  );
}
```

## 🛣 Routes protégées

### Route protégée (nécessite authentification)

```tsx
import ProtectedRoute from "@/components/ProtectedRoute";

<Route
  path="/dashboard"
  element={
    <ProtectedRoute requiredRole="ECOLE">
      <DashboardPage />
    </ProtectedRoute>
  }
/>;
```

### Route pour utilisateurs non connectés

```tsx
import LoggedOutRoute from "@/components/LoggedOutRoute";

<Route
  path="/login"
  element={
    <LoggedOutRoute redirectTo="/dashboard">
      <LoginPage />
    </LoggedOutRoute>
  }
/>;
```

### Route publique (redirige si connecté)

```tsx
import PublicRoute from "@/components/PublicRoute";

<Route
  path="/home"
  element={
    <PublicRoute redirectTo="/dashboard">
      <HomePage />
    </PublicRoute>
  }
/>;
```

## 📡 Services API

### Exemple : Utilisation des services

```tsx
import * as missionService from "@/services/missions";
import * as ecoleService from "@/services/ecoles";

// Récupérer toutes les missions
const missions = await missionService.getAllMissions({
  status: "ACTIVE",
  take: 10,
});

// Récupérer les missions de l'école
const ecoleMissions = await missionService.getMyEcoleMissions();

// Récupérer les écoles publiques (pour filtres)
const ecoles = await ecoleService.getPublicEcoles();
```

## 🔄 Refresh automatique des tokens

Le client API gère automatiquement :

- L'ajout du token JWT dans les headers
- Le refresh automatique du token expiré
- La redirection vers `/login` en cas d'échec d'authentification
- La gestion des erreurs avec messages clairs

## 🏗 Build

```bash
pnpm build
```

Le build sera disponible dans le dossier `dist/`
