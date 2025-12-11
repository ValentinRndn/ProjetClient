#!/bin/bash
# ============================================
# Vizion Academy - SSL Certificate Initialization
# Run this script once to obtain initial SSL certificates
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration - EDIT THESE VALUES
DOMAIN="YOUR_DOMAIN"
EMAIL="your-email@example.com"
PROJECT_DIR="/opt/vizion-academy"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}   SSL Certificate Initialization${NC}"
echo -e "${BLUE}============================================${NC}"

cd "$PROJECT_DIR"

# Check if domain is configured
if [ "$DOMAIN" = "YOUR_DOMAIN" ]; then
    echo -e "${RED}Error: Please edit this script and set your domain name${NC}"
    exit 1
fi

# Create required directories
echo -e "${YELLOW}Creating directories...${NC}"
mkdir -p certbot/conf
mkdir -p certbot/www

# Replace domain in nginx configuration
echo -e "${YELLOW}Configuring nginx with domain: $DOMAIN${NC}"
sed -i "s/YOUR_DOMAIN/$DOMAIN/g" nginx/conf.d/default.conf.initial
sed -i "s/YOUR_DOMAIN/$DOMAIN/g" nginx/conf.d/default.conf

# Use initial configuration (without SSL)
cp nginx/conf.d/default.conf.initial nginx/conf.d/default.conf

# Start nginx with initial config
echo -e "${YELLOW}Starting nginx...${NC}"
docker compose -f docker-compose.prod.yml up -d nginx

# Wait for nginx to be ready
sleep 5

# Obtain SSL certificate
echo -e "${YELLOW}Obtaining SSL certificate from Let's Encrypt...${NC}"
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    -d "api.$DOMAIN"

# Switch to full SSL configuration
echo -e "${YELLOW}Switching to SSL configuration...${NC}"
cp nginx/conf.d/default.conf.ssl nginx/conf.d/default.conf 2>/dev/null || true

# Reload nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   SSL Certificate obtained successfully!${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Your site is now accessible at:${NC}"
echo -e "${GREEN}  - https://$DOMAIN${NC}"
echo -e "${GREEN}  - https://www.$DOMAIN${NC}"
echo -e "${GREEN}  - https://api.$DOMAIN${NC}"
