#!/bin/bash

set -euo pipefail

echo "📊 Generating test coverage report..."

# Run coverage for all packages
pnpm test:coverage

# Combine coverage reports
echo "📈 Combining coverage reports..."

REPORT_DIR="coverage/combined"
mkdir -p "$REPORT_DIR"

# Copy and combine LCOV files
find . -name "lcov.info" -path "*/coverage/*" -exec cat {} \; > "$REPORT_DIR/lcov.info"

# Generate HTML report
if command -v genhtml &> /dev/null; then
  genhtml -o "$REPORT_DIR/html" "$REPORT_DIR/lcov.info"
  echo "✅ HTML coverage report generated at $REPORT_DIR/html/index.html"
else
  echo "ℹ️  Install genhtml (lcov) for HTML reports: brew install lcov"
fi

# Print summary
echo ""
echo "📊 Coverage Summary:"
echo "===================="
for dir in apps/web packages/ui packages/utils; do
  if [ -f "$dir/coverage/coverage-summary.json" ]; then
    echo ""
    echo "📦 $dir:"
    node -e "
      const summary = require('./$dir/coverage/coverage-summary.json');
      const total = summary.total;
      console.log('  Lines:      ' + total.lines.pct + '%');
      console.log('  Statements: ' + total.statements.pct + '%');
      console.log('  Functions:  ' + total.functions.pct + '%');
      console.log('  Branches:   ' + total.branches.pct + '%');
    "
  fi
done