#!/usr/bin/env bash
set -euo pipefail

# ─── Configuration ──────────────────────────────────────────
DB_CONTAINER="${DB_CONTAINER:-roughtools-db-1}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-roughtools}"
BACKUP_DIR="./backups"
RETAIN_DAILY=7
RETAIN_WEEKLY=4
S3_BUCKET="${S3_BUCKET:-roughtools-backups}"
DATE=$(date +%Y-%m-%d)

# ─── Create backup dirs ────────────────────────────────────
mkdir -p "${BACKUP_DIR}/daily" "${BACKUP_DIR}/weekly"

# ─── Full backup ──────────────────────────────────────────
echo "[$(date -I)] Starting backup of ${DB_NAME}..."
docker exec -u root "$DB_CONTAINER" pg_dump \
  -U "$DB_USER" \
  -Fc \
  --no-owner \
  --no-acl \
  --compress=9 \
  "${DB_NAME}" \
  > "${BACKUP_DIR}/daily/${DATE}.sql.gz"

SIZE=$(du -h "${BACKUP_DIR}/daily/${DATE}.sql.gz" | cut -f1)
echo "[$(date -I)] Backup complete: ${SIZE}"

# ─── Upload to S3 (if s3cmd configured) ──────────────────
if command -v s3cmd &>/dev/null && [ -n "$S3_BUCKET" ]; then
  echo "[$(date -I)] Uploading to s3://${S3_BUCKET}/daily/${DATE}.sql.gz..."
  s3cmd put "${BACKUP_DIR}/daily/${DATE}.sql.gz" "s3://${S3_BUCKET}/daily/${DATE}.sql.gz" 2>/dev/null && \
  echo "[$(date -I)] Upload complete"
fi

# ─── Cleanup old backups ───────────────────────────────────
echo "[$(date -I)] Cleaning up old backups..."
DAILY_DELETED=$(find "${BACKUP_DIR}/daily" -name "*.sql.gz" -mtime "+${RETAIN_DAILY}" -print -delete | wc -l)
WEEKLY_DELETED=$(find "${BACKUP_DIR}/weekly" -name "*.sql.gz" -mtime "+$((RETAIN_WEEKLY * 7))" -print -delete 2>/dev/null | wc -l)
echo "  Daily removed: ${DAILY_DELETED}, Weekly removed: ${WEEKLY_DELETED}"

# ─── Verify backup integrity ──────────────────────────────
echo "[$(date -I)] Verifying backup integrity..."
docker exec -u root "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -tAc \
  "SELECT pg_size_pretty(pg_database_size('$DB_NAME')) as db_size" 2>/dev/null

echo "[$(date -I)] Done."
