'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Course {
  id: number
  name: string
  credits: string
  grade: string
}

// ─── Grade Map ────────────────────────────────────────────────────────────────

const GRADE_POINTS: Record<string, number> = {
  'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0,
}
const GRADE_OPTIONS = Object.keys(GRADE_POINTS)

function getHonors(gpa: number): string {
  if (gpa >= 3.9) return 'Summa Cum Laude'
  if (gpa >= 3.7) return 'Magna Cum Laude'
  if (gpa >= 3.5) return "Cum Laude / Dean's List"
  if (gpa >= 3.0) return 'Good Standing'
  if (gpa >= 2.0) return 'Satisfactory'
  return 'Below Minimum'
}

function getHonorsColor(gpa: number): string {
  if (gpa >= 3.9) return '#f59e0b'
  if (gpa >= 3.7) return '#10b981'
  if (gpa >= 3.5) return '#6366f1'
  if (gpa >= 3.0) return '#38bdf8'
  if (gpa >= 2.0) return 'var(--fg-2)'
  return '#ef4444'
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV(courses: Course[], filename: string) {
  const header = ['Course', 'Credits', 'Grade', 'Grade Points', 'Quality Points']
  const rows = courses
    .filter(c => c.credits && c.grade)
    .map(c => {
      const gp = GRADE_POINTS[c.grade] ?? 0
      const cr = parseFloat(c.credits) || 0
      return [c.name || 'Unnamed', cr, c.grade, gp.toFixed(1), (gp * cr).toFixed(2)]
    })
  const csv = [header, ...rows].map(r => r.join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: filename,
  })
  a.click()
}

// ─── Shared style tokens ──────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)',
  color: '#fff', fontSize: 15, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = {
  padding: '6px 12px', fontSize: 12, textAlign: 'right',
  color: 'var(--fg-2)', whiteSpace: 'nowrap',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

let _nextId = 4
function newCourse(): Course {
  return { id: _nextId++, name: '', credits: '3', grade: 'A' }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GPACalculatorClient() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: 'Introduction to Computer Science', credits: '3', grade: 'A' },
    { id: 2, name: 'Calculus I', credits: '4', grade: 'B+' },
    { id: 3, name: 'English Composition', credits: '3', grade: 'A-' },
  ])

  const [prevGPA, setPrevGPA] = useState('')
  const [prevCredits, setPrevCredits] = useState('')
  const [targetGPA, setTargetGPA] = useState('')
  const [remainingCr, setRemainingCr] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // ─── Derived calculations ─────────────────────────────────────────────────

  const { semesterGPA, totalCredits, totalQualityPoints, validCourses } = useMemo(() => {
    const valid = courses.filter(c => parseFloat(c.credits) > 0 && c.grade in GRADE_POINTS)
    const totalCr = valid.reduce((s, c) => s + (parseFloat(c.credits) || 0), 0)
    const totalQP = valid.reduce((s, c) => {
      const cr = parseFloat(c.credits) || 0
      const gp = GRADE_POINTS[c.grade] ?? 0
      return s + gp * cr
    }, 0)
    const gpa = totalCr > 0 ? totalQP / totalCr : 0
    return { semesterGPA: gpa, totalCredits: totalCr, totalQualityPoints: totalQP, validCourses: valid }
  }, [courses])

  const cumulativeResult = useMemo(() => {
    const prev = parseFloat(prevGPA)
    const prevCr = parseFloat(prevCredits)
    if (!prev || !prevCr || isNaN(prev) || isNaN(prevCr) || totalCredits === 0) return null
    const prevQP = prev * prevCr
    const newQP = prevQP + totalQualityPoints
    const newCr = prevCr + totalCredits
    return { cumulativeGPA: newQP / newCr, totalCredits: newCr, totalQP: newQP }
  }, [prevGPA, prevCredits, totalQualityPoints, totalCredits])

  const reverseCalc = useMemo(() => {
    const target = parseFloat(targetGPA)
    const remCr = parseFloat(remainingCr)
    if (!target || !remCr || isNaN(target) || isNaN(remCr)) return null
    const prev = parseFloat(prevGPA)
    const prevCr = parseFloat(prevCredits)
    const existingQP = (prev && prevCr) ? prev * prevCr + totalQualityPoints : totalQualityPoints
    const existingCr = (prev && prevCr) ? prevCr + totalCredits : totalCredits
    const totalNeededQP = target * (existingCr + remCr)
    const neededQP = totalNeededQP - existingQP
    const requiredGPA = remCr > 0 ? neededQP / remCr : 0
    return { requiredGPA, feasible: requiredGPA >= 0 && requiredGPA <= 4.0 }
  }, [targetGPA, remainingCr, prevGPA, prevCredits, totalQualityPoints, totalCredits])

  const scenarios = useMemo(() => {
    const remCr = parseFloat(remainingCr) || 0
    if (!remCr) return null
    const prev = parseFloat(prevGPA)
    const prevCr = parseFloat(prevCredits)
    const existingQP = (prev && prevCr) ? prev * prevCr + totalQualityPoints : totalQualityPoints
    const existingCr = (prev && prevCr) ? prevCr + totalCredits : totalCredits
    return [2.0, 3.0, 3.5, 4.0].map(gpa => ({
      gpa,
      cumulativeGPA: (existingQP + gpa * remCr) / (existingCr + remCr),
    }))
  }, [prevGPA, prevCredits, totalQualityPoints, totalCredits, remainingCr])

  // ─── Course handlers ──────────────────────────────────────────────────────

  function updateCourse(id: number, field: keyof Course, value: string) {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }
  function addCourse() { setCourses(prev => [...prev, newCourse()]) }
  function removeCourse(id: number) { setCourses(prev => prev.filter(c => c.id !== id)) }

  const gpaColor = getHonorsColor(semesterGPA)
  const honors = getHonors(semesterGPA)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── COURSE TABLE ── */}
      <div style={CARD}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Current Semester Courses
          </h3>
          <button onClick={addCourse} style={BTN_GHOST}>+ Add Course</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Course Name', 'Credits', 'Grade', 'Grade Points', 'Quality Points', ''].map((h, i) => (
                  <th key={i} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map(course => {
                const gp = GRADE_POINTS[course.grade] ?? 0
                const cr = parseFloat(course.credits) || 0
                const qp = gp * cr
                return (
                  <tr key={course.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '6px 8px' }}>
                      <input type="text" value={course.name}
                        onChange={e => updateCourse(course.id, 'name', e.target.value)}
                        placeholder="Course name" style={{ ...INPUT_BOX, fontSize: 13 }} />
                    </td>
                    <td style={{ padding: '6px 8px', width: 80 }}>
                      <input type="number" value={course.credits}
                        onChange={e => updateCourse(course.id, 'credits', e.target.value)}
                        min={0} max={6} step={0.5} style={{ ...INPUT_BOX, fontSize: 13 }} />
                    </td>
                    <td style={{ padding: '6px 8px', width: 90 }}>
                      <select value={course.grade}
                        onChange={e => updateCourse(course.id, 'grade', e.target.value)}
                        style={{ ...INPUT_BOX, fontSize: 13 }}>
                        {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </td>
                    <td style={{ ...TD, color: '#6366f1', fontWeight: 700 }}>{gp.toFixed(1)}</td>
                    <td style={{ ...TD, color: '#10b981', fontWeight: 700 }}>{qp.toFixed(2)}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                      {courses.length > 1 && (
                        <button onClick={() => removeCourse(course.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}
                          aria-label="Remove course">×</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
                <td style={{ ...TD, textAlign: 'left', fontWeight: 700, color: 'var(--fg)' }}>TOTALS</td>
                <td style={{ ...TD, fontWeight: 700, color: 'var(--fg)' }}>{totalCredits.toFixed(1)} cr</td>
                <td />
                <td />
                <td style={{ ...TD, fontWeight: 700, color: '#10b981' }}>{totalQualityPoints.toFixed(2)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── SEMESTER RESULTS ── */}
      {totalCredits > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Semester GPA" value={semesterGPA.toFixed(3)} color={gpaColor} sub={honors} />
            <MetricCard label="Total Credits" value={totalCredits.toFixed(1)} color="#38bdf8" />
            <MetricCard label="Quality Points" value={totalQualityPoints.toFixed(2)} color="#10b981" />
            <MetricCard label="Courses" value={String(validCourses.length)} color="#e879f9" />
          </div>

          {/* Honors ladder */}
          <div style={{ ...CARD, padding: '16px 20px', borderColor: `${gpaColor}44` }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Academic Standing
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { label: 'Summa Cum Laude', threshold: 3.9, color: '#f59e0b' },
                { label: 'Magna Cum Laude', threshold: 3.7, color: '#10b981' },
                { label: "Cum Laude / Dean's List", threshold: 3.5, color: '#6366f1' },
                { label: 'Good Standing', threshold: 3.0, color: '#38bdf8' },
              ].map(({ label, threshold, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: semesterGPA >= threshold ? color : 'rgba(255,255,255,0.1)',
                    display: 'inline-block',
                  }} />
                  <span style={{ color: semesterGPA >= threshold ? color : 'var(--fg-3)', fontWeight: semesterGPA >= threshold ? 700 : 400 }}>
                    {label} (≥{threshold})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── ADVANCED TOGGLE ── */}
      <button onClick={() => setShowAdvanced(v => !v)} style={{ ...BTN_GHOST, alignSelf: 'flex-start' }} aria-expanded={showAdvanced}>
        {showAdvanced ? '▾' : '▸'} Cumulative GPA & Reverse Calculator
      </button>

      {showAdvanced && (
        <>
          {/* Cumulative GPA */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Cumulative GPA Calculator
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              <div>
                <label style={LABEL}>Previous GPA</label>
                <input type="number" value={prevGPA} onChange={e => setPrevGPA(e.target.value)}
                  placeholder="3.50" min={0} max={4} step={0.01} style={INPUT_BOX} />
              </div>
              <div>
                <label style={LABEL}>Previous Credits Earned</label>
                <input type="number" value={prevCredits} onChange={e => setPrevCredits(e.target.value)}
                  placeholder="60" min={0} step={1} style={INPUT_BOX} />
              </div>
            </div>
            {cumulativeResult && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 16 }}>
                <MetricCard label="New Cumulative GPA" value={cumulativeResult.cumulativeGPA.toFixed(3)}
                  color={getHonorsColor(cumulativeResult.cumulativeGPA)} sub={getHonors(cumulativeResult.cumulativeGPA)} />
                <MetricCard label="Total Credits" value={cumulativeResult.totalCredits.toFixed(1)} color="#38bdf8" />
                <MetricCard label="Total Quality Points" value={cumulativeResult.totalQP.toFixed(2)} color="#10b981" />
              </div>
            )}
          </div>

          {/* Reverse calculator */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              What GPA Do I Need?
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              <div>
                <label style={LABEL}>Target Cumulative GPA</label>
                <input type="number" value={targetGPA} onChange={e => setTargetGPA(e.target.value)}
                  placeholder="3.50" min={0} max={4} step={0.01} style={INPUT_BOX} />
              </div>
              <div>
                <label style={LABEL}>Remaining Credits</label>
                <input type="number" value={remainingCr} onChange={e => setRemainingCr(e.target.value)}
                  placeholder="30" min={0} step={1} style={INPUT_BOX} />
              </div>
            </div>
            {reverseCalc && (
              <div style={{
                marginTop: 16, padding: '14px 18px', borderRadius: 10,
                background: reverseCalc.feasible ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${reverseCalc.feasible ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                  You need a{' '}
                  <strong style={{ color: reverseCalc.feasible ? '#10b981' : '#ef4444', fontSize: 18 }}>
                    {reverseCalc.requiredGPA.toFixed(3)}
                  </strong>
                  {' '}GPA in your remaining {remainingCr} credits.
                </div>
                {!reverseCalc.feasible && (
                  <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>
                    {reverseCalc.requiredGPA > 4.0
                      ? 'Target not achievable — required GPA exceeds 4.0.'
                      : 'Already on track — current GPA exceeds the target.'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Scenario table */}
          {scenarios && remainingCr && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Scenario: Cumulative GPA If Remaining Courses Earn...
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                {scenarios.map(({ gpa, cumulativeGPA }) => (
                  <MetricCard key={gpa} label={`${gpa.toFixed(1)} GPA Earned`}
                    value={cumulativeGPA.toFixed(3)} color={getHonorsColor(cumulativeGPA)}
                    sub={getHonors(cumulativeGPA)} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── EXPORT ── */}
      {totalCredits > 0 && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => exportCSV(courses, 'gpa-calculation.csv')} style={BTN_GHOST}>
            ⬇ Export CSV
          </button>
          <button
            onClick={() => exportCalcPDF({
              toolName: 'GPA Calculator',
              inputs: courses.filter(c => c.credits && c.grade).map(c => ({
                label: c.name || 'Unnamed',
                value: `${c.credits} cr · ${c.grade} (${(GRADE_POINTS[c.grade] ?? 0).toFixed(1)})`,
              })),
              results: [
                { label: 'Semester GPA', value: semesterGPA.toFixed(3), highlight: true },
                { label: 'Total Credits', value: totalCredits.toFixed(1) },
                { label: 'Quality Points', value: totalQualityPoints.toFixed(2) },
                { label: 'Standing', value: honors },
                ...(cumulativeResult ? [{ label: 'Cumulative GPA', value: cumulativeResult.cumulativeGPA.toFixed(3) }] : []),
              ],
            })}
            style={BTN_GHOST}
          >
            📄 Export PDF
          </button>
        </div>
      )}

      {totalCredits === 0 && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Add courses with credits and grades above — your GPA updates instantly.
        </div>
      )}
    </div>
  )
}
