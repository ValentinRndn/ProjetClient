#!/bin/bash
# ============================================
# Vizion Academy - Backup Script
# ============================================

set -e

# Configuration
PROJECT_DIR="/opt/vizion-academy"
BACKUP_DIR="/opt/backups/vizion-academy"
DATE=$(date +%Y%m%d_%H%M%S)
RETAIN_DAYS=7

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}   Vizion Academy - Backup Script${NC}"
echo -e "${BLUE}============================================${NC}"

cd "$PROJECT_DIR"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup database
echo -e "${YELLOW}Backing up database...${NC}"
docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U vizion vizion_db > "$BACKUP_DIR/db_$DATE.sql"

# Compress the database backup
gzip "$BACKUP_DIR/db_$DATE.sql"

# Backup uploads
echo -e "${YELLOW}Backing up uploads...${NC}"
docker compose -f docker-compose.prod.yml exec -T backend tar -czf - /app/uploads > "$BACKUP_DIR/uploads_$DATE.tar.gz"

# Backup environment file
echo -e "${YELLOW}Backing up configuration...${NC}"
cp "$PROJECT_DIR/.env" "$BACKUP_DIR/env_$DATE.bak"

# Remove old backups
echo -e "${YELLOW}Removing backups older than $RETAIN_DAYS days...${NC}"
find "$BACKUP_DIR" -type f -mtime +$RETAIN_DAYS -delete

# List current backups
echo -e "${GREEN}Current backups:${NC}"
ls -lh "$BACKUP_DIR"

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   Backup completed: $DATE${NC}"
echo -e "${GREEN}============================================${NC}"
