# ============================================================
# ROUGHTOOLS.COM — Makefile
# Monorepo: pnpm workspaces + Turborepo
# App: apps/web (Next.js 14)
# ============================================================

.PHONY: help install dev build lint lint-fix format format-check \
        type-check test test-watch test-coverage \
        db-generate db-migrate db-migrate-prod db-seed db-reset db-studio db-push db-status db-format \
        docker-up docker-down docker-logs docker-rebuild docker-ps docker-db docker-redis \
        clean clean-all clean-cache \
        env-check env-setup \
        deploy-web deploy-web-preview \
        health-web sitemap audit audit-fix deps-outdated \
        setup ci reset

# ─── Default ──────────────────────────────────────────────────────────────────

.DEFAULT_GOAL := help

help: ## Show this help message
	@echo ""
	@echo "  ██████╗  ██████╗ ██╗   ██╗ ██████╗ ██╗  ██╗████████╗ ██████╗  ██████╗ ██╗     ███████╗"
	@echo "  ██╔══██╗██╔═══██╗██║   ██║██╔════╝ ██║  ██║╚══██╔══╝██╔═══██╗██╔═══██╗██║     ██╔════╝"
	@echo "  ██████╔╝██║   ██║██║   ██║██║  ███╗███████║   ██║   ██║   ██║██║   ██║██║     ███████╗"
	@echo "  ██╔══██╗██║   ██║██║   ██║██║   ██║██╔══██║   ██║   ██║   ██║██║   ██║██║     ╚════██║"
	@echo "  ██║  ██║╚██████╔╝╚██████╔╝╚██████╔╝██║  ██║   ██║   ╚██████╔╝╚██████╔╝███████╗███████║"
	@echo "  ╚═╝  ╚═╝ ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚═════╝╚══════╝╚══════╝"
	@echo ""
	@echo "  Usage: make <target>"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""

# ─── Install ──────────────────────────────────────────────────────────────────

install: ## Install all dependencies
	pnpm install

install-frozen: ## Install dependencies (frozen lockfile — use in CI)
	pnpm install --frozen-lockfile

# ─── Development ──────────────────────────────────────────────────────────────

dev: ## Start Next.js web app in dev mode
	pnpm --filter web dev

dev-full: docker-up dev ## Start Docker services + web app

# ─── Build ────────────────────────────────────────────────────────────────────

build: ## Build web app via Turborepo
	pnpm turbo run build

build-web: ## Build Next.js web app
	pnpm --filter web build

build-packages: ## Build all shared packages
	pnpm turbo run build --filter='./packages/*'

# ─── Lint & Format ────────────────────────────────────────────────────────────

lint: ## Lint all apps and packages
	pnpm turbo run lint

lint-web: ## Lint web app only
	pnpm --filter web lint

lint-fix: ## Auto-fix lint issues across monorepo
	pnpm turbo run lint -- --fix

format: ## Format all files with Prettier
	pnpm prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}" --ignore-path .gitignore

format-check: ## Check formatting without writing
	pnpm prettier --check "**/*.{ts,tsx,js,jsx,json,css,md}" --ignore-path .gitignore

# ─── Type Check ───────────────────────────────────────────────────────────────

type-check: ## Run TypeScript type checks across all packages
	pnpm turbo run type-check

type-check-web: ## Type-check web app only
	pnpm --filter web exec tsc --noEmit

# ─── Testing ──────────────────────────────────────────────────────────────────

test: ## Run all tests
	pnpm turbo run test

test-web: ## Run web app tests
	pnpm --filter web test

test-watch: ## Run web tests in watch mode
	pnpm --filter web exec jest --watch

test-coverage: ## Run tests with coverage report
	pnpm --filter web exec jest --coverage

# ─── Database ─────────────────────────────────────────────────────────────────

db-generate: ## Generate Prisma client
	pnpm --filter db exec prisma generate

db-push: ## Push schema changes to DB without migration (dev only)
	pnpm --filter db exec prisma db push

db-migrate: ## Create and apply a new migration (dev)
	@read -p "Migration name: " name; \
	pnpm --filter db exec prisma migrate dev --name "$$name"

db-migrate-prod: ## Apply pending migrations (production)
	pnpm --filter db exec prisma migrate deploy

db-seed: ## Seed the database
	pnpm --filter db exec tsx prisma/seed.ts

db-reset: ## Reset database and re-seed (dev only — DESTRUCTIVE)
	@echo "⚠️  This will DROP and recreate the database. Press Ctrl+C to cancel..."
	@sleep 3
	pnpm --filter db exec prisma migrate reset --force

db-studio: ## Open Prisma Studio (database GUI)
	pnpm --filter db exec prisma studio

db-status: ## Show migration status
	pnpm --filter db exec prisma migrate status

db-format: ## Format Prisma schema
	pnpm --filter db exec prisma format

# ─── Docker ───────────────────────────────────────────────────────────────────

docker-up: ## Start Docker services (PostgreSQL, Redis, Gotenberg)
	docker compose up -d

docker-down: ## Stop Docker services
	docker compose down

docker-logs: ## Tail Docker service logs
	docker compose logs -f

docker-rebuild: ## Rebuild Docker images from scratch
	docker compose down --volumes
	docker compose build --no-cache
	docker compose up -d

docker-ps: ## Show running Docker containers
	docker compose ps

docker-db: ## Connect to PostgreSQL via psql
	docker compose exec postgres psql -U $${POSTGRES_USER:-roughtools} -d $${POSTGRES_DB:-roughtools}

docker-redis: ## Connect to Redis CLI
	docker compose exec redis redis-cli

# ─── Environment ──────────────────────────────────────────────────────────────

env-check: ## Check all required env vars are set
	@echo "Checking required environment variables..."
	@missing=0; \
	for var in DATABASE_URL REDIS_URL JWT_SECRET NEXTAUTH_SECRET NODE_ENV; do \
		if [ -z "$$(printenv $$var 2>/dev/null)" ]; then \
			echo "  ❌ Missing: $$var"; \
			missing=$$((missing+1)); \
		else \
			echo "  ✅ Set:     $$var"; \
		fi; \
	done; \
	if [ $$missing -gt 0 ]; then \
		echo ""; \
		echo "  $$missing required vars are missing. Copy .env.example → .env and fill in values."; \
		exit 1; \
	else \
		echo ""; \
		echo "  All required env vars are set ✓"; \
	fi

env-setup: ## Copy .env.example to .env (if .env doesn't exist)
	@if [ -f .env ]; then \
		echo ".env already exists — skipping."; \
	else \
		cp .env.example .env; \
		echo ".env created from .env.example. Fill in real values before running."; \
	fi

# ─── Clean ────────────────────────────────────────────────────────────────────

clean: ## Remove build artifacts
	pnpm turbo run clean 2>/dev/null || true
	rm -rf apps/web/.next

clean-all: clean ## Remove all build output AND node_modules (full reset)
	@echo "⚠️  Removing all node_modules and build output..."
	find . -name "node_modules" -type d -not -path "*/.git/*" -exec rm -rf {} + 2>/dev/null || true
	find . -name ".turbo" -type d -not -path "*/.git/*" -exec rm -rf {} + 2>/dev/null || true
	find . -name "dist" -type d -not -path "*/.git/*" -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.tsbuildinfo" -delete 2>/dev/null || true
	@echo "✓ Clean complete. Run 'make install' to reinstall."

clean-cache: ## Clear Turborepo cache
	rm -rf .turbo/cache

# ─── Deployment ───────────────────────────────────────────────────────────────

deploy-web: ## Deploy web app (Vercel)
	pnpm --filter web exec vercel --prod

deploy-web-preview: ## Deploy web app as preview (Vercel)
	pnpm --filter web exec vercel

# ─── Health Checks ────────────────────────────────────────────────────────────

health-web: ## Check web app health endpoint
	@curl -sf http://localhost:3000/api/health | python3 -m json.tool 2>/dev/null || \
	 curl -sf http://localhost:3000/api/health || \
	 echo "Web app not running on port 3000"

# ─── SEO ──────────────────────────────────────────────────────────────────────

sitemap: ## Rebuild sitemaps via Next.js build
	@echo "Sitemaps are auto-generated at build time."
	@echo "Run 'make build-web' to regenerate all sitemap files."

# ─── Audit / Reports ──────────────────────────────────────────────────────────

audit: ## Run security audit on all dependencies
	pnpm audit

audit-fix: ## Auto-fix security vulnerabilities
	pnpm audit --fix

deps-outdated: ## Show outdated dependencies
	pnpm outdated

# ─── Shortcuts ────────────────────────────────────────────────────────────────

setup: env-setup install docker-up db-generate db-migrate db-seed ## Full first-time setup
	@echo ""
	@echo "  ✅ Setup complete!"
	@echo ""
	@echo "  Run 'make dev' to start the web app."
	@echo "    Web: http://localhost:3000"
	@echo "    DB:  make db-studio"
	@echo ""

ci: install-frozen lint type-check test build ## Full CI pipeline (lint → types → test → build)
	@echo "✅ CI pipeline passed."

reset: clean-all setup ## Full project reset (clean + reinstall + setup)
