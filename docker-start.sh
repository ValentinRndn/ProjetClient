#!/bin/bash

# Script de démarrage Docker pour Vizion Academy
# Usage: ./docker-start.sh
# 
# Note: Aucune configuration requise, tout est prêt à l'emploi !

set -e

echo "🚀 Démarrage de Vizion Academy avec Docker..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! docker compose version &> /dev/null 2>&1; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

# Vérifier les permissions Docker
if ! docker info &> /dev/null; then
    echo "❌ Erreur de permissions Docker."
    echo ""
    echo "Pour corriger ce problème, exécutez :"
    echo "  sudo usermod -aG docker $USER"
    echo "  newgrp docker"
    echo ""
    echo "Ou utilisez sudo pour exécuter ce script :"
    echo "  sudo ./docker-start.sh"
    exit 1
fi

# Vérifier et créer le .env du backend si nécessaire (pour compatibilité locale)
if [ ! -f "./backend/.env" ]; then
    echo "📝 Création du fichier .env pour le backend..."
    cat > ./backend/.env << 'EOF'
# ============================================
# Vizion Academy - Variables d'environnement
# Configuration pour Docker (utilisée aussi en local)
# ============================================

NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://vizion:vizion_dev_password@postgres:5432/vizion_db?schema=public
JWT_SECRET=dev-secret-change-in-production
ACCESS_EXPIRES_IN=15m
REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=15000
RATE_LIMIT_MAX=100
EOF
    echo "   ✅ Fichier .env créé"
fi

# Démarrer les services
echo "📦 Démarrage des conteneurs..."
docker compose up -d

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente de PostgreSQL..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker compose exec -T postgres pg_isready -U vizion -d vizion_db &> /dev/null; then
        echo "✅ PostgreSQL est prêt !"
        break
    fi
    attempt=$((attempt + 1))
    echo "   Tentative $attempt/$max_attempts..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "⚠️  PostgreSQL n'est pas encore prêt, mais on continue..."
fi

# Attendre que le backend soit démarré
echo "⏳ Attente du backend..."
sleep 3

# Initialisation de la base de données
echo "🔧 Initialisation de la base de données..."
echo "   📦 Génération du client Prisma..."
if docker compose exec -T backend npm run db:generate; then
    echo "   ✅ Client Prisma généré"
else
    echo "   ⚠️  Erreur lors de la génération du client Prisma"
fi

echo "   🔄 Application des migrations..."
if docker compose exec -T backend npm run db:migrate; then
    echo "   ✅ Migrations appliquées"
else
    echo "   ⚠️  Erreur lors de l'application des migrations"
fi

echo "   🌱 Exécution du seed..."
if docker compose exec -T backend npm run db:seed; then
    echo "   ✅ Seed exécuté"
else
    echo "   ⚠️  Erreur lors de l'exécution du seed (peut être normal si déjà exécuté)"
fi

echo ""
echo "✅ Services démarrés et base de données initialisée !"
echo ""
echo "📍 Accès aux services :"
echo "   - Backend API: http://localhost:3001"
echo "   - Client Frontend: http://localhost:5173"
echo "   - Web Frontend: http://localhost:5174"
echo ""
echo "📝 Pour voir les logs : docker compose logs -f"
echo "🛑 Pour arrêter : docker compose down"
echo ""
