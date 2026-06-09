#!/bin/bash

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🧪 Running Test Suite...${NC}"

# Parse arguments
SCOPE="${1:-all}"
COVERAGE="${2:-false}"

run_unit_tests() {
  echo -e "${YELLOW}📦 Running Unit Tests...${NC}"
  if [ "$COVERAGE" = "true" ]; then
    pnpm test:coverage
  else
    pnpm test:unit
  fi
  echo -e "${GREEN}✅ Unit Tests Complete${NC}"
}

run_integration_tests() {
  echo -e "${YELLOW}🔗 Running Integration Tests...${NC}"
  pnpm test:integration
  echo -e "${GREEN}✅ Integration Tests Complete${NC}"
}

run_e2e_tests() {
  echo -e "${YELLOW}🌐 Running E2E Tests...${NC}"

  # Check if dev server is running
  if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${YELLOW}Starting dev server...${NC}"
    pnpm dev &
    SERVER_PID=$!

    # Wait for server
    echo -e "${YELLOW}Waiting for server to be ready...${NC}"
    for i in {1..30}; do
      if curl -s http://localhost:3000 > /dev/null 2>&1; then
        break
      fi
      sleep 2
    done
  fi

  pnpm test:e2e

  # Kill dev server if we started it
  if [ -n "${SERVER_PID:-}" ]; then
    kill $SERVER_PID
  fi

  echo -e "${GREEN}✅ E2E Tests Complete${NC}"
}

case "$SCOPE" in
  unit)
    run_unit_tests
    ;;
  integration)
    run_integration_tests
    ;;
  e2e)
    run_e2e_tests
    ;;
  all)
    run_unit_tests
    run_integration_tests
    run_e2e_tests
    ;;
  *)
    echo "Usage: $0 {unit|integration|e2e|all} [coverage:true|false]"
    exit 1
    ;;
esac

echo -e "${GREEN}🎉 All tests completed successfully!${NC}"