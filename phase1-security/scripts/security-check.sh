#!/bin/bash
echo "Running Security Checks (pnpm)..."
echo "=================================="
echo ""
echo "[1/2] Running pnpm audit..."
pnpm audit --audit-level=high
echo ""
echo "[2/2] Checking outdated packages..."
pnpm outdated
echo ""
echo "Security Check Complete!"