FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Installer pnpm et les dépendances
RUN npm install -g pnpm && pnpm install

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 5173

# Commande par défaut (sera surchargée par docker-compose)
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]
