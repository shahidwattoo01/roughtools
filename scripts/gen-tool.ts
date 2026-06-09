import * as fs   from 'fs'
import * as path from 'path'

// ── helpers ────────────────────────────────────────────────────────────────

function toPascal(str: string) {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

function toCamel(str: string) {
  const p = toPascal(str)
  return p.charAt(0).toLowerCase() + p.slice(1)
}

function write(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`  ✅ created  ${filePath}`)
}

// ── main ───────────────────────────────────────────────────────────────────

const slug = process.argv[2]  // e.g. "compound-interest"

if (!slug) {
  console.error('Usage: pnpm run gen:tool <tool-slug>')
  console.error('Example: pnpm run gen:tool compound-interest')
  process.exit(1)
}

const pascal  = toPascal(slug)   // CompoundInterest
const camel   = toCamel(slug)    // compoundInterest
const title   = pascal.replace(/([A-Z])/g, ' $1').trim()  // Compound Interest

console.log(`\n🔧 Generating tool: ${title}\n`)

const ROOT = path.resolve(__dirname, '..')

// ── 1. packages/calculators-core/src/<slug>/schema.ts ─────────────────────

write(
  path.join(ROOT, `packages/calculators-core/src/${slug}/schema.ts`),
`import { z } from 'zod'

export const ${pascal}InputSchema = z.object({
  // TODO: define your inputs here
  value: z.number().positive(),
})

export const ${pascal}OutputSchema = z.object({
  // TODO: define your outputs here
  result: z.number(),
})

export type ${pascal}Input  = z.infer<typeof ${pascal}InputSchema>
export type ${pascal}Output = z.infer<typeof ${pascal}OutputSchema>
`
)

// ── 2. packages/calculators-core/src/<slug>/logic.ts ──────────────────────

write(
  path.join(ROOT, `packages/calculators-core/src/${slug}/logic.ts`),
`import type { ${pascal}Input, ${pascal}Output } from './schema'

export function calculate${pascal}(input: ${pascal}Input): ${pascal}Output {
  // TODO: implement your calculation here
  return {
    result: input.value,
  }
}
`
)

// ── 3. packages/calculators-core/src/<slug>/index.ts ──────────────────────

write(
  path.join(ROOT, `packages/calculators-core/src/${slug}/index.ts`),
`export { calculate${pascal} }                                from './logic'
export { ${pascal}InputSchema, ${pascal}OutputSchema }       from './schema'
export type { ${pascal}Input, ${pascal}Output }              from './schema'
`
)

// ── 4. apps/api/src/routes/<slug>.ts ──────────────────────────────────────

write(
  path.join(ROOT, `apps/api/src/routes/${slug}.ts`),
`import { Router } from 'express'
import { ${pascal}InputSchema, calculate${pascal} } from '@platform/calculators-core'

const router = Router()

router.post('/', (req, res) => {
  const result = ${pascal}InputSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() })
  }

  return res.json(calculate${pascal}(result.data))
})

export default router
`
)

// ── 5. apps/web/src/app/tools/<slug>/page.tsx ─────────────────────────────

write(
  path.join(ROOT, `apps/web/src/app/tools/${slug}-calculator/page.tsx`),
`import { Metadata } from 'next'
import ${pascal}Calculator from '@/components/tools/${pascal}Calculator'

export const metadata: Metadata = {
  title: '${title} Calculator — Free Online Tool',
  description: 'Calculate ${title.toLowerCase()} instantly with our free online tool.',
}

export default function ${pascal}CalculatorPage() {
  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">${title} Calculator</h1>
      <p className="text-gray-500 mb-8">
        Enter your values below to calculate ${title.toLowerCase()}.
      </p>
      <${pascal}Calculator />
    </main>
  )
}
`
)

// ── 6. apps/web/src/components/tools/<Pascal>Calculator.tsx ───────────────

write(
  path.join(ROOT, `apps/web/src/components/tools/${pascal}Calculator.tsx`),
`'use client'

import { useState } from 'react'
import type { ${pascal}Output } from '@platform/calculators-core'

export default function ${pascal}Calculator() {
  const [value,  setValue]  = useState('')
  const [result, setResult] = useState<${pascal}Output | null>(null)
  const [error,  setError]  = useState<string | null>(null)

  async function handleCalculate() {
    setError(null)
    const res = await fetch('/api/tools/${slug}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        value: parseFloat(value),
        // TODO: add more fields here
      }),
    })

    if (!res.ok) {
      setError('Invalid input. Please check your values.')
      return
    }

    setResult(await res.json())
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-5">

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Value {/* TODO: rename this label */}
        </label>
        <input
          type="number"
          value={value}
          onChange={e => { setValue(e.target.value); setResult(null) }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="0"
        />
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold
                   py-2.5 rounded-lg transition"
      >
        Calculate
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {result && (
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">Result</p>
          <p className="text-4xl font-bold text-indigo-600">
            {result.result}
            {/* TODO: format this result nicely */}
          </p>
        </div>
      )}

    </div>
  )
}
`
)

// ── 7. remind user what to do manually ────────────────────────────────────

console.log(`
✅ All files created for "${title} Calculator"

Now do these 2 manual steps:

1. Add to packages/calculators-core/src/index.ts:
   export * from './${slug}'

2. Add to apps/api/src/index.ts:
   import ${camel}Router from './routes/${slug}'
   app.use('/api/tools/${slug}', ${camel}Router)

Then fill in the TODOs:
   - schema.ts  → define your inputs/outputs
   - logic.ts   → write the math
   - ${pascal}Calculator.tsx → update the form fields and result display

`)