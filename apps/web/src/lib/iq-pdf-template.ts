// ─── IQ Report PDF Template ───────────────────────────────────────────────────
// Generates a 4-page A4 HTML document consumed by Gotenberg's Chromium renderer.
// All charts are inline SVG — no external image dependencies.

interface DomainScore {
  domain: string
  label: string
  efficiency: number
  band: string
  interpretation: string
}

interface ReportPayload {
  sessionId: string
  iqScore: number
  confidenceLower: number
  confidenceUpper: number
  percentile: number
  classification: string
  ageGroup: string
  questionCount: number
  completedAt: string
  normingVersion: string
  domainScores: DomainScore[]
  isValid: boolean
  invalidityFlags: string[]
}

// ─── Inline SVG bell curve ────────────────────────────────────────────────────

function bellCurveSvg(iqScore: number): string {
  const W = 480; const H = 120; const mean = 100; const sd = 15
  const xToSvg = (iq: number) => ((iq - (mean - 4 * sd)) / (8 * sd)) * W
  const gaussian = (x: number) => Math.exp(-0.5 * ((x - mean) / sd) ** 2)
  const pts: string[] = []
  for (let iq = mean - 4 * sd; iq <= mean + 4 * sd; iq += 0.5)
    pts.push(`${xToSvg(iq).toFixed(1)},${(H - gaussian(iq) * (H - 16) - 8).toFixed(1)}`)
  const scorePx = xToSvg(iqScore)
  const scorePy = H - gaussian(iqScore) * (H - 16) - 8

  const bands = [
    { x1: xToSvg(55), x2: xToSvg(70),  fill: '#fee2e2' },
    { x1: xToSvg(70), x2: xToSvg(80),  fill: '#fef3c7' },
    { x1: xToSvg(80), x2: xToSvg(90),  fill: '#fef9c3' },
    { x1: xToSvg(90), x2: xToSvg(110), fill: '#dcfce7' },
    { x1: xToSvg(110), x2: xToSvg(120), fill: '#dbeafe' },
    { x1: xToSvg(120), x2: xToSvg(130), fill: '#e0e7ff' },
    { x1: xToSvg(130), x2: xToSvg(160), fill: '#f3e8ff' },
  ]

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H + 20}" width="480" height="${H + 20}">
      ${bands.map(b => `<rect x="${b.x1.toFixed(1)}" y="8" width="${(b.x2 - b.x1).toFixed(1)}" height="${H - 8}" fill="${b.fill}"/>`).join('')}
      <path d="M ${pts.join(' L ')}" fill="none" stroke="#a21caf" stroke-width="2"/>
      <line x1="${scorePx.toFixed(1)}" y1="${scorePy.toFixed(1)}" x2="${scorePx.toFixed(1)}" y2="${H}" stroke="#a21caf" stroke-width="2" stroke-dasharray="4 3"/>
      <circle cx="${scorePx.toFixed(1)}" cy="${scorePy.toFixed(1)}" r="5" fill="#a21caf"/>
      <text x="${scorePx.toFixed(1)}" y="${H + 14}" text-anchor="middle" font-size="11" fill="#a21caf" font-weight="bold">${iqScore}</text>
      ${[70,85,100,115,130].map(v => `<text x="${xToSvg(v).toFixed(1)}" y="${H + 14}" text-anchor="middle" font-size="9" fill="#999">${v}</text>`).join('')}
    </svg>`
}

// ─── Inline SVG radar chart ───────────────────────────────────────────────────

function radarSvg(domains: DomainScore[]): string {
  if (!domains.length) return ''
  const N = domains.length; const cx = 150; const cy = 150; const r = 110
  const angleStep = (2 * Math.PI) / N
  const getPoint = (i: number, pct: number) => {
    const a = i * angleStep - Math.PI / 2
    const d = (pct / 100) * r
    return { x: cx + d * Math.cos(a), y: cy + d * Math.sin(a) }
  }
  const dataPoints = domains.map((d, i) => getPoint(i, d.efficiency * 100))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z'

  const gridLines = [25, 50, 75, 100].flatMap(lvl =>
    domains.map((_, i) => {
      const p1 = getPoint(i, lvl); const p2 = getPoint((i + 1) % N, lvl)
      return `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="#e5e7eb" stroke-width="1"/>`
    })
  ).join('')

  const spokes = domains.map((_, i) => {
    const p = getPoint(i, 100)
    return `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="#e5e7eb" stroke-width="1"/>`
  }).join('')

  const labels = domains.map((d, i) => {
    const p = getPoint(i, 128)
    const words = d.label.split(' ')
    return words.map((w, j) =>
      `<text x="${p.x.toFixed(1)}" y="${(p.y + j * 11 - (words.length - 1) * 5.5).toFixed(1)}" text-anchor="middle" font-size="9" fill="#555" font-weight="500">${w}</text>`
    ).join('')
  }).join('')

  const dots = dataPoints.map(p =>
    `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="#a21caf"/>`
  ).join('')

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
      ${gridLines}${spokes}
      <path d="${dataPath}" fill="#a21caf" fill-opacity="0.15" stroke="#a21caf" stroke-width="2"/>
      ${dots}${labels}
    </svg>`
}

// ─── Classification colour ────────────────────────────────────────────────────

function classColor(cls: string): string {
  const map: Record<string, string> = {
    'Very Superior': '#7c3aed', Superior: '#2563eb', 'High Average': '#0891b2',
    Average: '#059669', 'Low Average': '#d97706', Borderline: '#dc2626', 'Extremely Low': '#9f1239',
  }
  return map[cls] ?? '#059669'
}

// ─── Main template function ───────────────────────────────────────────────────

export function buildIqReportHtml(p: ReportPayload): string {
  const color = classColor(p.classification)
  const date = p.completedAt
    ? new Date(p.completedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Unknown'
  const ref = p.sessionId.slice(-8).toUpperCase()
  const domains = p.domainScores ?? []

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; background: #fff; }
  .page { width: 210mm; min-height: 297mm; padding: 16mm 18mm; page-break-after: always; position: relative; }
  .page:last-child { page-break-after: avoid; }
  h1 { font-size: 28px; font-weight: 700; }
  h2 { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
  h3 { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
  p  { font-size: 13px; line-height: 1.65; color: #444; }
  .pill { display: inline-block; padding: 4px 14px; border-radius: 99px; font-size: 13px; font-weight: 600; }
  .row { display: flex; gap: 16px; align-items: flex-start; }
  .col { flex: 1; }
  .stat-box { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; text-align: center; }
  .stat-num { font-size: 26px; font-weight: 700; }
  .stat-lbl { font-size: 11px; color: #666; margin-top: 3px; }
  .domain-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .domain-bar-bg { flex: 1; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
  .domain-bar { height: 100%; background: #a21caf; border-radius: 4px; }
  .domain-band { font-size: 10px; padding: 2px 8px; border-radius: 99px; background: #f3f4f6; color: #555; white-space: nowrap; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { text-align: left; padding: 8px 10px; background: #f9f9f9; border-bottom: 2px solid #e5e7eb; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; }
  td { padding: 9px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
  .footer { position: absolute; bottom: 10mm; left: 18mm; right: 18mm; font-size: 10px; color: #aaa; border-top: 1px solid #e5e7eb; padding-top: 6px; display: flex; justify-content: space-between; }
  .cover-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #a21caf 0%, #581c87 100%); z-index: 0; }
  .cover-content { position: relative; z-index: 1; color: #fff; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; gap: 18px; }
  .cover-score { font-size: 96px; font-weight: 800; line-height: 1; }
  .cover-title { font-size: 15px; opacity: 0.85; letter-spacing: 0.08em; text-transform: uppercase; }
  .cover-meta { font-size: 12px; opacity: 0.7; }
  .disclaimer { background: #fdf4ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 12px 14px; font-size: 11px; color: #6b21a8; line-height: 1.6; margin-top: 16px; }
</style>
</head>
<body>

<!-- ─── PAGE 1: COVER ────────────────────────────────────── -->
<div class="page" style="padding: 0; overflow: hidden;">
  <div class="cover-bg"></div>
  <div class="cover-content">
    <div>
      <div class="cover-title">Cognitive Assessment Report</div>
      <div class="cover-score">${p.iqScore}</div>
      <div class="pill" style="background: rgba(255,255,255,0.2); color: #fff; font-size: 16px; margin-top: 8px;">${p.classification}</div>
    </div>
    <div style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 18px; width: 100%;">
      <div class="cover-meta">Date of Assessment: ${date}</div>
      <div class="cover-meta">Age Group: ${p.ageGroup} &nbsp;·&nbsp; Questions: ${p.questionCount}</div>
      <div class="cover-meta" style="margin-top: 6px;">Session Reference: ${ref}</div>
    </div>
    <div style="font-size: 11px; opacity: 0.6; max-width: 340px; text-align: center; line-height: 1.5;">
      This assessment uses adaptive psychometric methods based on established cognitive science.
      Results are for self-assessment purposes and should not replace clinical evaluation.
    </div>
    <div style="font-size: 11px; opacity: 0.5;">roughtools.com</div>
  </div>
</div>

<!-- ─── PAGE 2: SCORE SUMMARY ───────────────────────────── -->
<div class="page">
  <h2 style="color: #a21caf;">Score Summary</h2>

  <div class="row" style="margin-bottom: 20px; gap: 12px;">
    <div class="stat-box col">
      <div class="stat-num" style="color: ${color};">${p.iqScore}</div>
      <div class="stat-lbl">IQ Score</div>
    </div>
    <div class="stat-box col">
      <div class="stat-num" style="color: #a21caf;">${p.percentile}th</div>
      <div class="stat-lbl">Percentile</div>
    </div>
    <div class="stat-box col">
      <div class="stat-num" style="font-size: 18px; color: ${color};">${p.classification}</div>
      <div class="stat-lbl">Classification</div>
    </div>
    <div class="stat-box col">
      <div class="stat-num" style="font-size: 16px;">${p.confidenceLower}–${p.confidenceUpper}</div>
      <div class="stat-lbl">95% Confidence Interval</div>
    </div>
  </div>

  <h3>Score Distribution</h3>
  <p style="margin-bottom: 10px; font-size: 12px;">Your score relative to the general population (mean = 100, SD = 15).</p>
  ${bellCurveSvg(p.iqScore)}

  <div style="margin-top: 20px;">
    <h3>Percentile Context</h3>
    <div style="background: #f9fafb; border-radius: 8px; padding: 12px 14px; margin-top: 8px;">
      <div style="height: 10px; background: #e5e7eb; border-radius: 5px; overflow: hidden; margin-bottom: 6px;">
        <div style="height: 100%; background: #a21caf; border-radius: 5px; width: ${p.percentile}%;"></div>
      </div>
      <p style="font-size: 12px;">You scored higher than <strong>${p.percentile}%</strong> of people in your age group (${p.ageGroup}).</p>
    </div>
  </div>

  <div style="margin-top: 20px;">
    <h3>Confidence Interval</h3>
    <p style="font-size: 12px; margin-top: 6px;">
      All IQ tests carry measurement error. The 95% confidence interval of <strong>${p.confidenceLower}–${p.confidenceUpper}</strong> means
      that if you took this test repeatedly under identical conditions, your score would fall within this range
      95% of the time. This corresponds to ±${Math.round((p.confidenceUpper - p.confidenceLower) / 2)} points (Standard Error of Measurement ≈ 4.74).
    </p>
  </div>

  <div class="footer">
    <span>roughtools.com · Adaptive IQ Assessment</span>
    <span>Ref: ${ref} · Page 2 of 4</span>
  </div>
</div>

<!-- ─── PAGE 3: DOMAIN ANALYSIS ─────────────────────────── -->
<div class="page">
  <h2 style="color: #a21caf;">Cognitive Domain Analysis</h2>

  ${domains.length > 0 ? `
  <div class="row" style="align-items: flex-start; gap: 24px; margin-bottom: 20px;">
    <div>${radarSvg(domains)}</div>
    <div style="flex: 1; padding-top: 8px;">
      ${domains.map(d => `
        <div class="domain-row">
          <span style="font-size: 12px; font-weight: 500; width: 140px; flex-shrink: 0;">${d.label}</span>
          <div class="domain-bar-bg">
            <div class="domain-bar" style="width: ${Math.round(d.efficiency * 100)}%;"></div>
          </div>
          <span style="font-size: 11px; font-weight: 600; width: 30px; text-align: right; color: #a21caf;">${Math.round(d.efficiency * 100)}%</span>
          <span class="domain-band">${d.band}</span>
        </div>`).join('')}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Domain</th>
        <th>Score</th>
        <th>Band</th>
        <th>Interpretation</th>
      </tr>
    </thead>
    <tbody>
      ${domains.map(d => `
        <tr>
          <td style="font-weight: 500;">${d.label}</td>
          <td style="text-align: center; font-weight: 600; color: #a21caf;">${Math.round(d.efficiency * 100)}%</td>
          <td><span class="domain-band">${d.band}</span></td>
          <td style="color: #555;">${d.interpretation}</td>
        </tr>`).join('')}
    </tbody>
  </table>` : '<p style="color: #999;">Domain scores are available with the premium unlock.</p>'}

  <div class="footer">
    <span>roughtools.com · Adaptive IQ Assessment</span>
    <span>Ref: ${ref} · Page 3 of 4</span>
  </div>
</div>

<!-- ─── PAGE 4: METHODOLOGY & DISCLAIMER ────────────────── -->
<div class="page">
  <h2 style="color: #a21caf;">Methodology &amp; Disclaimer</h2>

  <h3 style="margin-top: 16px;">How this test works</h3>
  <p>This test uses <strong>Computerised Adaptive Testing (CAT)</strong> with a three-parameter logistic Item Response Theory model.
  Unlike fixed tests, each question is selected in real time to be maximally informative at your current estimated ability level.
  This produces a highly accurate score in fewer questions than traditional fixed-form tests.</p>

  <h3 style="margin-top: 16px;">Scoring</h3>
  <p>Each response is scored based on question difficulty (1–10 scale), discrimination index, and response time relative to the time limit.
  Domain efficiency scores are weighted by their g-factor loading: Fluid Reasoning (25%), Quantitative Reasoning (20%),
  Crystallised Intelligence (18%), Spatial Reasoning (15%), Working Memory (12%), Processing Speed (10%).
  The composite score is converted to the Wechsler IQ scale (mean 100, standard deviation 15) using age-adjusted norms.</p>

  <h3 style="margin-top: 16px;">What IQ measures</h3>
  <p>IQ tests measure a sample of cognitive abilities and are a reliable predictor of certain outcomes (academic performance, complex job performance).
  They do not measure creativity, emotional intelligence, wisdom, practical skills, or the full range of human cognitive abilities.
  A single test score should not be used to define or limit a person's potential.</p>

  <h3 style="margin-top: 16px;">Norming</h3>
  <p>Scores are compared against age-matched population norms (version: ${p.normingVersion ?? 'v0.1-simulated'}).
  Initial norms are derived from simulation; norms are updated as population data accumulates.
  The norming version is recorded with your result for audit purposes.</p>

  <div class="disclaimer">
    <strong>Important disclaimer:</strong> This assessment is provided for self-educational purposes only. It is not a clinical
    psychological evaluation and must not be used for diagnostic, employment, educational placement, or legal purposes without
    qualified professional oversight. If you have concerns about your cognitive health, please consult a licensed psychologist
    or neuropsychologist. Results may be affected by fatigue, anxiety, illness, or environmental conditions at the time of testing.
  </div>

  <div style="margin-top: 20px; font-size: 11px; color: #aaa;">
    <p>© ${new Date().getFullYear()} RoughTools.com · Assessment reference: ${ref} · Generated: ${date}</p>
    <p style="margin-top: 4px;">Contact: shahidwattoo0111@gmail.com</p>
  </div>

  <div class="footer">
    <span>roughtools.com · Adaptive IQ Assessment</span>
    <span>Ref: ${ref} · Page 4 of 4</span>
  </div>
</div>

</body>
</html>`
}

// ─── Call Gotenberg ───────────────────────────────────────────────────────────

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  const GOTENBERG_URL = process.env.GOTENBERG_URL ?? 'http://localhost:3030'

  const form = new FormData()
  form.append('index.html', new Blob([html], { type: 'text/html' }), 'index.html')
  form.append('paperWidth', '8.27')
  form.append('paperHeight', '11.69')
  form.append('marginTop', '0')
  form.append('marginBottom', '0')
  form.append('marginLeft', '0')
  form.append('marginRight', '0')
  form.append('printBackground', 'true')
  form.append('scale', '1.0')

  const res = await fetch(`${GOTENBERG_URL}/forms/chromium/convert/html`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => `HTTP ${res.status}`)
    throw new Error(`Gotenberg error: ${msg}`)
  }

  return Buffer.from(await res.arrayBuffer())
}
