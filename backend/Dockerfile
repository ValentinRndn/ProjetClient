FROM node:20-slim

# Installer les dépendances système nécessaires pour Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le schéma Prisma
COPY prisma ./prisma

# Générer le client Prisma (sans connexion DB nécessaire)
RUN npx prisma generate

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 3001

# Commande par défaut (sera surchargée par docker-compose)
CMD ["npm", "run", "dev"]
