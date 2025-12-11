# 🔐 Comptes de Test - Vizion Academy

## Accès à l'application
- **URL Frontend**: http://170.39.216.251
- **URL API**: http://170.39.216.251/api/v1

---

## 👤 Comptes créés

### 1. Administrateur
- **Email**: `admin@test.com`
- **Password**: `Admin123`
- **Role**: `ADMIN`
- **Description**: Accès complet à toutes les fonctionnalités d'administration

### 2. École
- **Email**: `ecole@test.com`
- **Password**: `Ecole123`
- **Role**: `ECOLE`
- **Nom**: École Test
- **Adresse**: 123 Rue de Test, 75001 Paris
- **Téléphone**: 0123456789
- **Description**: Compte pour publier des missions et gérer les intervenants

### 3. Intervenant
- **Email**: `intervenant@test.com`
- **Password**: `Intervenant123`
- **Role**: `INTERVENANT`
- **Nom**: Jean Dupont
- **Téléphone**: 0612345678
- **Bio**: Expert en développement web avec 10 ans d'expérience
- **Description**: Compte pour postuler aux missions et gérer son profil

---

## 🧪 Test de connexion

Pour tester les connexions via l'API:

```bash
# Admin
curl -X POST "http://170.39.216.251/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123"}'

# École
curl -X POST "http://170.39.216.251/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"ecole@test.com","password":"Ecole123"}'

# Intervenant
curl -X POST "http://170.39.216.251/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"intervenant@test.com","password":"Intervenant123"}'
```

---

## 📝 Notes

- Tous les comptes ont été créés avec succès
- Les mots de passe sont simples pour faciliter les tests
- Ces comptes peuvent être utilisés pour tester toutes les fonctionnalités de la plateforme
- Pour la production, utilisez des mots de passe plus complexes

