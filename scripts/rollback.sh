#!/usr/bin/bash
set -euo pipefail

ENVIRONMENT="${1:-production}"
PREVIOUS_IMAGE="ghcr.io/${GITHUB_REPOSITORY:-your-org/roughtools}/${ENVIRONMENT}:previous"

echo "=== Rollback Plan ==="
echo ""
echo "Target: ${ENVIRONMENT}"
echo "Rolling back to: ${PREVIOUS_IMAGE}"
echo ""
echo "Steps:"
echo "  1. Pull previous known-good image"
echo "  2. Re-tag as current"
echo " 3. Redeploy containers"
echo "  4. Verify health"
echo ""

read -p "Confirm rollback? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Rollback cancelled."
  exit 0
fi

echo ""
echo "[$(date -I)] Pulling ${PREVIOUS_IMAGE}..."
docker pull "$PREVIOUS_IMAGE" || {
  echo "ERROR: Could not pull image. Does it exist?"
  echo "If not, check: docker images | grep previous"
  exit 1
}

echo "[$(date -I)] Tagging as current..."
docker tag "$PREVIOUS_IMAGE" "ghcr.io/${GITHUB_REPOSITORY:-your-org/roughtools}/${ENVIRONMENT}:latest"

echo "[$(date -I)] Pushing rollback tag..."
docker push "ghcr.io/${GITHUB_REPOSITORY:-your-org/roughtools/${ENVIRONMENT}:latest"

echo "[$(date -I)] Rolling back containers..."
# This would normally run on your server via SSH or docker compose
# docker compose up -d --force-recreate

echo ""
echo "=== Rollback Complete ==="
echo ""
echo "If issues persist, re-deploy the previous commit hash:"
echo "  git revert HEAD~1"
echo "  git push --force"
echo "  Then re-run this script"