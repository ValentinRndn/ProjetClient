# Vizion Academy - Guide de Deploiement VPS

## Prerequis

- Un VPS avec Ubuntu 22.04 LTS (ou Debian 11+)
- Docker et Docker Compose installes
- Un nom de domaine pointe vers l'IP de votre VPS
- Ports 80 et 443 ouverts dans le firewall

## 1. Preparation du VPS

### Installer Docker

```bash
# Mettre a jour le systeme
sudo apt update && sudo apt upgrade -y

# Installer les dependances
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Ajouter la cle GPG Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Ajouter le depot Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER

# Activer Docker au demarrage
sudo systemctl enable docker
```

### Installer Git

```bash
sudo apt install -y git
```

## 2. Deployer l'application

### Cloner le projet

```bash
# Creer le repertoire
sudo mkdir -p /opt/vizion-academy
sudo chown $USER:$USER /opt/vizion-academy

# Cloner le projet
cd /opt/vizion-academy
git clone https://github.com/votre-username/vizion-academy.git .
```

### Configurer l'environnement

```bash
# Copier le fichier d'environnement
cp .env.production.example .env

# Editer les variables (IMPORTANT: changez les mots de passe!)
nano .env
```

Variables importantes a configurer:
- `POSTGRES_PASSWORD`: mot de passe fort pour PostgreSQL
- `JWT_SECRET`: chaine aleatoire de 64+ caracteres
- `CORS_ORIGIN`: votre domaine (https://vizion.votredomaine.com)
- `VITE_API_URL`: URL de l'API (https://api.vizion.votredomaine.com)

### Configurer Nginx

```bash
# Remplacer YOUR_DOMAIN par votre domaine dans les fichiers nginx
sed -i 's/YOUR_DOMAIN/vizion.votredomaine.com/g' nginx/conf.d/default.conf
sed -i 's/YOUR_DOMAIN/vizion.votredomaine.com/g' nginx/conf.d/default.conf.initial
```

## 3. Premier deploiement (sans SSL)

```bash
# Utiliser la configuration initiale (sans SSL)
cp nginx/conf.d/default.conf.initial nginx/conf.d/default.conf

# Construire et demarrer les conteneurs
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# Verifier que tout fonctionne
docker compose -f docker-compose.prod.yml ps

# Executer les migrations de base de donnees
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

## 4. Obtenir les certificats SSL

```bash
# Creer les repertoires certbot
mkdir -p certbot/conf certbot/www

# Obtenir le certificat SSL
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email votre-email@example.com \
    --agree-tos \
    --no-eff-email \
    -d vizion.votredomaine.com \
    -d www.vizion.votredomaine.com \
    -d api.vizion.votredomaine.com
```

## 5. Activer SSL

```bash
# Restaurer la configuration complete avec SSL
git checkout nginx/conf.d/default.conf
sed -i 's/YOUR_DOMAIN/vizion.votredomaine.com/g' nginx/conf.d/default.conf

# Redemarrer nginx
docker compose -f docker-compose.prod.yml restart nginx
```

## 6. Commandes utiles

### Voir les logs

```bash
# Tous les conteneurs
docker compose -f docker-compose.prod.yml logs -f

# Un conteneur specifique
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f nginx
```

### Redemarrer les services

```bash
docker compose -f docker-compose.prod.yml restart
```

### Mise a jour de l'application

```bash
# Tirer les dernieres modifications
git pull origin main

# Reconstruire et redemarrer
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# Executer les migrations
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### Backup de la base de donnees

```bash
# Sauvegarder
docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U vizion vizion_db > backup_$(date +%Y%m%d).sql

# Restaurer
docker compose -f docker-compose.prod.yml exec -T postgres psql -U vizion vizion_db < backup_20240101.sql
```

### Acceder au conteneur backend

```bash
docker compose -f docker-compose.prod.yml exec backend sh
```

## 7. Configuration DNS

Configurez les enregistrements DNS suivants:

| Type | Nom | Valeur |
|------|-----|--------|
| A | vizion.votredomaine.com | IP_DE_VOTRE_VPS |
| A | www.vizion.votredomaine.com | IP_DE_VOTRE_VPS |
| A | api.vizion.votredomaine.com | IP_DE_VOTRE_VPS |

## 8. Firewall

```bash
# Autoriser SSH, HTTP et HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 9. Monitoring (optionnel)

### Verifier l'etat des conteneurs

```bash
docker compose -f docker-compose.prod.yml ps
```

### Verifier l'utilisation des ressources

```bash
docker stats
```

## Depannage

### Le site ne charge pas

1. Verifier que les conteneurs sont en cours d'execution:
   ```bash
   docker compose -f docker-compose.prod.yml ps
   ```

2. Verifier les logs nginx:
   ```bash
   docker compose -f docker-compose.prod.yml logs nginx
   ```

3. Verifier les logs backend:
   ```bash
   docker compose -f docker-compose.prod.yml logs backend
   ```

### Erreur de base de donnees

1. Verifier que PostgreSQL est en cours d'execution:
   ```bash
   docker compose -f docker-compose.prod.yml logs postgres
   ```

2. Verifier la connexion:
   ```bash
   docker compose -f docker-compose.prod.yml exec backend npx prisma db push
   ```

### Erreur SSL

1. Verifier que les certificats existent:
   ```bash
   ls -la certbot/conf/live/
   ```

2. Renouveler manuellement:
   ```bash
   docker compose -f docker-compose.prod.yml run --rm certbot renew
   ```
