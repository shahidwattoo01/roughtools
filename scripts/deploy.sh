#!/bin/bash

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ENVIRONMENT="${1:-staging}"
TIMESTAMP=$(date +%Y%m%d%H%M%S)

echo -e "${BLUE}🚀 Deploying to ${ENVIRONMENT}...${NC}"

# Pre-deployment checks
echo -e "${YELLOW}📋 Running pre-deployment checks...${NC}"

# Check for uncommitted changes
if ! git diff --quiet; then
  echo -e "${RED}❌ Uncommitted changes detected. Please commit or stash before deploying.${NC}"
  exit 1
fi

# Run linter
echo -e "${YELLOW}🔍 Running linter...${NC}"
pnpm lint

# Run type check
echo -e "${YELLOW}📝 Running type check...${NC}"
pnpm typecheck

# Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
pnpm test:ci

# Build
echo -e "${YELLOW}🔨 Building application...${NC}"
pnpm build

echo -e "${GREEN}✅ Pre-deployment checks passed!${NC}"

# Deploy based on environment
case "$ENVIRONMENT" in
  staging)
    echo -e "${BLUE}📦 Building Docker image for staging...${NC}"
    docker compose -f docker-compose.staging.yml build

    echo -e "${BLUE}🚢 Pushing to staging...${NC}"
    docker compose -f docker-compose.staging.yml up -d --force-recreate

    echo -e "${YELLOW}🩺 Running health check...${NC}"
    sleep 10
    if curl -f http://localhost:3000/api/health; then
      echo -e "${GREEN}✅ Staging deployment successful!${NC}"
    else
      echo -e "${RED}❌ Health check failed!${NC}"
      exit 1
    fi
    ;;

  production)
    # Production requires extra confirmation
    read -p "⚠️  Deploy to PRODUCTION? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
      echo "Deployment cancelled."
      exit 0
    fi

    echo -e "${BLUE}📦 Building Docker image for production...${NC}"
    docker compose -f docker-compose.production.yml build

    echo -e "${BLUE}🚢 Pushing to production...${NC}"
    docker compose -f docker-compose.production.yml up -d --force-recreate

    echo -e "${YELLOW}🩺 Running health check...${NC}"
    sleep 15
    if curl -f http://localhost:3000/api/health; then
      echo -e "${GREEN}✅ Production deployment successful!${NC}"
    else
      echo -e "${RED}❌ Health check failed! Rolling back...${NC}"
      docker compose -f docker-compose.production.yml down
      exit 1
    fi
    ;;

  *)
    echo "Usage: $0 {staging|production}"
    exit 1
    ;;
esac

echo -e "${GREEN}🎉 Deployment to ${ENVIRONMENT} completed at ${TIMESTAMP}!${NC}"