#!/usr/bin/bash
set -euo pipefail

echo "=== Bundle Size Analysis ==="
echo ""

# ─── API bundle ───────────────────────────────────────────
echo "── API Bundle ─────────────────────────────────────────"
if [ -d "apps/api/dist" ]; then
  echo "Total: $(du -sh apps/api/dist/ 2>/dev/null | cut -f1)"
  echo ""
  echo "Breakdown:"
  find apps/api/dist -name "*.js" -exec du -h {} \; 2>/dev/null | sort -rh | head -15
  echo ""
  echo "Node modules (should be minimal with pnpm hoisting):"
  find apps/api/dist/node_modules -maxdepth 1 -exec du -sh {} \; 2>/dev/null | sort -rh | head -5 || echo "  None"
else
  echo "  Not built yet. Run: pnpm -r build"
fi

echo ""
echo "── Web Bundle ──────────────────────────────────────────"
if [ -d "apps/web/dist" ]; then
  TOTAL_KB=$(du -sk apps/web/dist/ 2>/dev/null | cut -f1)
  echo "Total: ${TOTAL_KB} KB"
  echo ""
  echo "Breakdown by type:"
  echo "  JS:    $(find apps/web/dist -name '*.js' -exec du -sh {} \; 2>/dev/null | awk '{s+=$1} END{print "  JS:    "$1" KB (" $(find apps/web/dist -name "*.js" | wc -l) " files)"}')"
  echo "  CSS:   $(find apps/web/dist -name '*.css' -exec du -sh {} \; 2>/dev/null | awk '{s+=$1} END{print "  CSS:   "$1" KB (" $(find apps/web/dist -name "*.css" | wc -l) " files)"}')"
  echo "  HTML:  $(find apps/web/dist -name '*.html' -exec du -sh {} \; 2>/dev/null | awk '{s+=$1} END{print "  HTML:  $1"}')"
  echo "  Other: $(find apps/web/dist -type f ! -name '*.js' ! -name '*.css' ! -name '*.html' -exec du -sh {} \; 2>/dev/null | awk '{s+=$1} END{print "  Other: $1"}')"
  echo ""
  echo "Largest files:"
  find apps/web/dist -type f -exec du -h {} \; 2>/dev/null | sort -rh | head -10
else
  echo "  Not built yet. Run: pnpm -r build"
fi

echo ""
echo "── Dependencies (should be zero with pnpm) ─────────────────"
ROOT_MODS=$(du -sh node_modules 2>/dev/null | cut -f1)
echo "  Root node_modules: ${ROOT_MODS}"
echo ""

echo "=== Analysis Complete ==="