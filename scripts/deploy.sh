#!/bin/bash
# ============================================
# Vizion Academy - Deployment Script
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/opt/vizion-academy"
COMPOSE_FILE="docker-compose.prod.yml"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}   Vizion Academy - Deployment Script${NC}"
echo -e "${BLUE}============================================${NC}"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}Warning: Running without root privileges. Some operations may fail.${NC}"
fi

# Navigate to project directory
cd "$PROJECT_DIR" || {
    echo -e "${RED}Error: Project directory $PROJECT_DIR not found${NC}"
    exit 1
}

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found. Please copy .env.example to .env and configure it.${NC}"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

echo -e "${YELLOW}Step 1: Pulling latest changes from git...${NC}"
git pull origin main

echo -e "${YELLOW}Step 2: Building Docker images...${NC}"
docker compose -f $COMPOSE_FILE build --no-cache

echo -e "${YELLOW}Step 3: Stopping existing containers...${NC}"
docker compose -f $COMPOSE_FILE down

echo -e "${YELLOW}Step 4: Starting new containers...${NC}"
docker compose -f $COMPOSE_FILE up -d

echo -e "${YELLOW}Step 5: Running database migrations...${NC}"
docker compose -f $COMPOSE_FILE exec -T backend npx prisma migrate deploy

echo -e "${YELLOW}Step 6: Cleaning up old images...${NC}"
docker image prune -f

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   Deployment completed successfully!${NC}"
echo -e "${GREEN}============================================${NC}"

# Show container status
echo -e "${BLUE}Container Status:${NC}"
docker compose -f $COMPOSE_FILE ps
