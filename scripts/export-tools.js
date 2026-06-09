const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const registryPath = path.join(ROOT, 'apps', 'web', 'src', 'lib', 'tools-registry.ts')
const reportPath = path.join(ROOT, 'tools-structure-report.md')

function read(p) { return fs.readFileSync(p, 'utf8') }

const registry = read(registryPath)
const report = fs.existsSync(reportPath) ? read(reportPath) : ''

// Parse status map from report (lines like: | slug | name | status |)
const statusMap = {}
report.split('\n').forEach(line => {
  const m = line.match(/^\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/) // three cols
  if (m) {
    const slug = m[1].trim()
    const status = m[3].trim()
    statusMap[slug] = status
  }
})

// Heuristic parse registry: split by object entries
const entries = []
// Split by "{ slug:" occurrences to isolate objects
const parts = registry.split(/\{\s*slug\s*:\s*'/g)
for (let i = 1; i < parts.length; i++) {
  const part = parts[i]
  const slugMatch = part.match(/^([^']+)'/) // capture until next '
  const slug = slugMatch ? slugMatch[1].trim() : null
  if (!slug) continue
  // look backward a bit by reconstructing a small object-like string
  const rest = part
  const nameMatch = rest.match(/name\s*:\s*'([^']+)'/) || rest.match(/name\s*:\s*"([^"]+)"/)
  const categoryMatch = rest.match(/category\s*:\s*'([^']+)'/) || rest.match(/category\s*:\s*"([^"]+)"/)
  const descMatch = rest.match(/description\s*:\s*'([^']+)'/) || rest.match(/description\s*:\s*"([^"]+)"/)

  const name = nameMatch ? nameMatch[1].trim() : ''
  const category = categoryMatch ? categoryMatch[1].trim() : ''
  const description = descMatch ? descMatch[1].trim() : ''

  entries.push({ slug, name, category, description })
}

// Remove duplicates by slug (keep first)
const map = {}
entries.forEach(e => { if (!map[e.slug]) map[e.slug] = e })
const tools = Object.values(map)

// For each tool, determine file paths and existence
function pascalCase(s) { return s.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') }

const breakdown = tools.map(t => {
  const pascal = pascalCase(t.slug)
  const pageCandidates = [
    path.join('apps','web','src','app','tools', t.category, t.slug, 'page.tsx'),
    path.join('apps','web','src','app','tools', `${t.slug}-calculator`, 'page.tsx'),
    path.join('apps','web','src','app','tools', t.slug, 'page.tsx'),
  ]
  const apiPath = path.join('apps','api','src','routes', `${t.slug}.ts`)
  const componentPath = path.join('apps','web','src','components','tools', `${pascal}Calculator.tsx`)

  const pagePath = pageCandidates.find(p => fs.existsSync(path.join(ROOT, p))) || pageCandidates[0]
  const apiExists = fs.existsSync(path.join(ROOT, apiPath))
  const componentExists = fs.existsSync(path.join(ROOT, componentPath))

  const status = statusMap[t.slug] || (fs.existsSync(path.join(ROOT, pagePath)) && apiExists && componentExists ? 'complete' : 'unknown')

  return {
    slug: t.slug,
    name: t.name,
    category: t.category,
    description: t.description,
    status,
    pagePath,
    pageExists: fs.existsSync(path.join(ROOT, pagePath)),
    apiPath,
    apiExists,
    componentPath,
    componentExists,
  }
})

// Write outputs
const outDir = path.join(ROOT, 'build')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'tool-export.json'), JSON.stringify(breakdown, null, 2), 'utf8')

const csvLines = ['slug,name,category,description,status,pagePath,pageExists,apiPath,apiExists,componentPath,componentExists']
breakdown.forEach(b => {
  const safe = v => '"' + String(v).replace(/"/g, '""') + '"'
  csvLines.push([b.slug, b.name, b.category, b.description, b.status, b.pagePath, b.pageExists, b.apiPath, b.apiExists, b.componentPath, b.componentExists].map(safe).join(','))
})
fs.writeFileSync(path.join(outDir, 'tool-export.csv'), csvLines.join('\n'), 'utf8')

console.log('Generated', tools.length, 'tools')
console.log('Wrote:', path.join(outDir, 'tool-export.json'))
console.log('Wrote:', path.join(outDir, 'tool-export.csv'))

process.exit(0)
