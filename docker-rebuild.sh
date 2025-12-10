#!/bin/bash

# Script pour reconstruire les images Docker
# Usage: ./docker-rebuild.sh

set -e

echo "🔨 Reconstruction des images Docker..."

# Arrêter les conteneurs
echo "🛑 Arrêt des conteneurs..."
docker compose down

# Reconstruire l'image backend sans cache
echo "🔨 Reconstruction de l'image backend..."
docker compose build --no-cache backend

echo "✅ Reconstruction terminée !"
echo ""
echo "Vous pouvez maintenant lancer :"
echo "  ./docker-start.sh"
echo "ou"
echo "  docker compose up"
