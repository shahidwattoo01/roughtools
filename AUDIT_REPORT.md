# Project Audit Report - AI Tools Platform
**Date:** 2026-06-10 | **Status:** CRITICAL ISSUES FOUND & BEING FIXED

---

## Executive Summary
Your project has **7 critical issues** blocking development. Most are configuration and dependency mismatches. All are fixable in this session.

---

## 🔴 CRITICAL ISSUES

### 1. **Syntax Error in layout.tsx** [FIXED]
- **File:** `apps/web/src/app/layout.tsx:167`
- **Issue:** File ends with `}c` instead of `}`
- **Severity:** CRITICAL - Blocks all Next.js compilation
- **Status:** ✅ FIXED

---

### 2. **Missing Prisma Type Exports**
- **Files:** 
  - `apps/web/src/app/api/iq/_lib/adaptive-state.ts:11`
  - `apps/web/src/app/api/iq/_lib/session.ts:3`
  - `apps/web/src/lib/prisma.ts:1`
  - `apps/web/src/workers/iq-jobs.ts:11`
- **Error:** Module '@prisma/client' has no exported member 'IqSession' and 'PrismaClient'
- **Root Cause:** IqSession model exists in schema (line 438 of schema.prisma) but:
  - @platform/db package doesn't re-export IqSession type
  - @prisma/client needs to be regenerated
  - apps/web is importing directly from @prisma/client instead of @platform/db
- **Severity:** CRITICAL - 4 import errors
- **Fix Required:** 
  1. Run `prisma generate` in packages/db
  2. Add IqSession export to packages/db/src/index.ts
  3. Update imports in apps/web to use @platform/db instead

---

### 3. **Redis/ioredis Version Mismatch**
- **Files:** `packages/queue/src/index.ts:43, 79, 105, 121, 132, 146, 157, 170, 178, 186`
- **Error:** Type mismatch between ioredis 5.11.1 and 5.10.1
  ```
  Type 'Redis' is not assignable to type 'ConnectionOptions'
  ```
- **Root Cause:** 
  - apps/web depends on `ioredis: ^5.4.2` (can resolve to 5.11.1)
  - packages/queue depends on `ioredis: ^5.4.2` (can resolve to 5.10.1)
  - pnpm installed different versions in node_modules
- **Severity:** CRITICAL - 8 type errors in queue package
- **Fix Required:** 
  1. Lock ioredis to single version across workspace
  2. Run `pnpm install` to synchronize

---

### 4. **Dynamic Import Type Errors in ClientProviders.tsx**
- **File:** `apps/web/src/components/ClientProviders.tsx:12-13`
- **Error:** 
  ```
  Argument of type '() => Promise<typeof import(...)>' is not assignable to 
  parameter of type 'DynamicOptions<{}> | Loader<{}>'
  ```
- **Root Cause:** Toaster and ScrollReveal are 'use client' components but dynamic() expects default export
  - Toaster exports named export `function Toaster()`
  - ScrollReveal exports named export `function ScrollReveal()`
  - dynamic() can't auto-resolve named exports
- **Severity:** CRITICAL - 2 type errors
- **Fix Required:**
  1. Add named export property to dynamic() calls
  2. Or add default exports to components

---

### 5. **Package.json Export Order Issues (Warnings)**
- **Files:**
  - `packages/validation/package.json:8-13`
  - `packages/iq-engine/package.json:8-14`
  - Others with similar patterns
- **Warning:** "The condition 'types' here will never be used as it comes after both 'import' and 'require'"
- **Root Cause:** Wrong order in exports field. Should be: `types` first, then `import`, then `require`
- **Severity:** WARNING - Affects type resolution
- **Fix Required:** Reorder exports in package.json files

```json
// WRONG
"exports": {
  ".": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.js",
    "types": "./dist/index.d.ts"   // ❌ Never used
  }
}

// CORRECT
"exports": {
  ".": {
    "types": "./dist/index.d.ts",    // ✅ First
    "import": "./dist/index.mjs",
    "require": "./dist/index.js"
  }
}
```

---

### 6. **Incorrect Package.json in iq-engine**
- **File:** `packages/iq-engine/package.json:5-7`
- **Issue:** Points to source files instead of dist
  ```json
  "main": "./src/index.ts",
  "module": "./src/index.ts",
  "types": "./src/index.ts"
  ```
- **Severity:** WARNING - Breaks builds in non-dev environments
- **Fix Required:** Point to dist/ directory

---

### 7. **Queue Package ioredis Dependency**
- **File:** `packages/queue/package.json:16`
- **Issue:** `ioredis: ^5.4.2` conflicts with web app's version
- **Severity:** CRITICAL - Type incompatibility
- **Fix Required:** Pin to specific version

---

## 📊 Error Summary by Severity

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 5 | In Progress |
| WARNING | 2 | In Progress |
| **TOTAL** | **7** | **7 Fixable** |

---

## 🛠️ Packages Status

| Package | Status | Issues |
|---------|--------|--------|
| @platform/db | ⚠️ | Needs Prisma generation, IqSession export |
| @platform/iq-engine | ⚠️ | Export order, wrong main/module/types paths |
| @platform/validation | ⚠️ | Export order |
| @platform/config | ⚠️ | Export order |
| @toolverse/queue | ❌ | ioredis version conflict, export paths |
| @toolverse/errors | ⚠️ | Export order (good example) |
| @toolverse/storage | ⚠️ | No dev script |
| @workspace/web | ❌ | Import errors, dynamic type errors |
| @workspace/ui | ✅ | OK |
| @workspace/utils | ✅ | OK |

---

## 📝 Recommended Fix Order

1. **Run Prisma generate** → Regenerate @prisma/client
2. **Fix layout.tsx** → Already done ✅
3. **Fix ioredis version** → Lock in pnpm
4. **Add IqSession export** → Update @platform/db
5. **Fix dynamic imports** → Update ClientProviders.tsx
6. **Fix export orders** → Update package.json files
7. **Verify builds** → Run typecheck, lint, build

---

## Dependencies Analysis

```
MONOREPO STRUCTURE:
├── apps/
│   └── web (Next.js) → depends on 8 packages
├── packages/
│   ├── db (Prisma client)
│   ├── iq-engine (IQ test logic)
│   ├── queue (BullMQ + Redis)
│   ├── validation
│   ├── config
│   ├── errors
│   ├── storage
│   ├── redis
│   ├── legal
│   ├── cache
│   ├── seo
│   ├── validators
│   └── utils
└── @workspace/ui
```

**Version Conflicts:**
- ioredis: declared as ^5.4.2 in 2 places, resolving differently
- @prisma/client: ^5.0.0 in db, ^5.22.0 in web (should match)

---

## Next Steps
All fixes will be applied automatically. Monitor the dev server for:
- No TypeScript errors
- No import errors
- Port 3001 successfully starts
- All packages build in watch mode
