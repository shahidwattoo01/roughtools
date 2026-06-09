/**
 * exportCalcPDF — god node with 27 edges.
 * Every calculator's "Export PDF" button calls this. A regression here breaks
 * PDF export across the entire site simultaneously.
 *
 * Strategy: mock jsPDF and jspdf-autotable at the module level so the function
 * runs to completion in jsdom without a real canvas or download trigger. Assert
 * that `save` is called with a filename ending in `.pdf` and that the function
 * does not throw with valid minimal input.
 */

// ── jsPDF mock ────────────────────────────────────────────────────────────────
// Must be declared before jest.mock() calls. Variable name starts with "mock"
// so Jest's hoisting can see it inside the factory function.
const mockSave            = jest.fn()
const mockText            = jest.fn()
const mockAutoTableFn     = jest.fn().mockImplementation((doc: any) => {
  // jspdf-autotable sets doc.lastAutoTable.finalY after each call
  if (!doc.lastAutoTable) doc.lastAutoTable = {}
  doc.lastAutoTable.finalY = 80
})

jest.mock('jspdf', () => ({
  default: jest.fn().mockImplementation(() => ({
    rect:              jest.fn(),
    setFillColor:      jest.fn(),
    setTextColor:      jest.fn(),
    setFontSize:       jest.fn().mockReturnThis(), // allows chaining .splitTextToSize after setFontSize
    setFont:           jest.fn(),
    text:              mockText,
    addPage:           jest.fn(),
    setPage:           jest.fn(),
    getNumberOfPages:  jest.fn().mockReturnValue(1),
    splitTextToSize:   jest.fn().mockReturnValue(['line one', 'line two']),
    setDrawColor:      jest.fn(),
    save:              mockSave,
    addImage:          jest.fn(),
    lastAutoTable:     { finalY: 80 },
  })),
}))

jest.mock('jspdf-autotable', () => ({ default: mockAutoTableFn }))

// ─────────────────────────────────────────────────────────────────────────────

import { exportCalcPDF, CalcPDFConfig } from '@/lib/calcPdf'

const MINIMAL_CONFIG: CalcPDFConfig = {
  toolName: 'Loan Calculator',
  inputs:  [{ label: 'Loan Amount',   value: 10000,  unit: '$' }],
  results: [{ label: 'Monthly Payment', value: 188.71, unit: '$', highlight: true }],
}

beforeEach(() => {
  jest.clearAllMocks()
  // Reset mockAutoTableFn side-effect each test
  mockAutoTableFn.mockImplementation((doc: any) => {
    if (!doc.lastAutoTable) doc.lastAutoTable = {}
    doc.lastAutoTable.finalY = 80
  })
})

describe('exportCalcPDF', () => {

  // ── Core contract ─────────────────────────────────────────────────────────

  it('resolves without throwing for a minimal valid config', async () => {
    await expect(exportCalcPDF(MINIMAL_CONFIG)).resolves.toBeUndefined()
  })

  it('calls doc.save() exactly once', async () => {
    await exportCalcPDF(MINIMAL_CONFIG)
    expect(mockSave).toHaveBeenCalledTimes(1)
  })

  it('saves with a filename that ends in .pdf', async () => {
    await exportCalcPDF(MINIMAL_CONFIG)
    const filename: string = mockSave.mock.calls[0][0]
    expect(filename).toMatch(/\.pdf$/)
  })

  it('filename contains the tool name in kebab-case', async () => {
    await exportCalcPDF(MINIMAL_CONFIG)
    const filename: string = mockSave.mock.calls[0][0]
    // "Loan Calculator" → "loan-calculator"
    expect(filename).toContain('loan-calculator')
  })

  it('accepts a custom fileName override', async () => {
    await exportCalcPDF({ ...MINIMAL_CONFIG, fileName: 'my-custom-report' })
    const filename: string = mockSave.mock.calls[0][0]
    expect(filename).toContain('my-custom-report')
  })

  // ── Tables ────────────────────────────────────────────────────────────────

  it('calls autoTable at least twice (inputs + results)', async () => {
    await exportCalcPDF(MINIMAL_CONFIG)
    expect(mockAutoTableFn).toHaveBeenCalledTimes(2)
  })

  it('includes a third autoTable call when tableHeaders + tableRows are provided', async () => {
    await exportCalcPDF({
      ...MINIMAL_CONFIG,
      tableHeaders: ['Month', 'Balance'],
      tableRows:    [{ Month: 1, Balance: 9900 }],
    })
    expect(mockAutoTableFn).toHaveBeenCalledTimes(3)
  })

  // ── Formula ───────────────────────────────────────────────────────────────

  it('does not throw when formula string is provided', async () => {
    await expect(
      exportCalcPDF({ ...MINIMAL_CONFIG, formula: 'M = P * r / (1 - (1+r)^-n)' })
    ).resolves.toBeUndefined()
  })

  // ── Multiple results / inputs ─────────────────────────────────────────────

  it('handles multiple input and result rows', async () => {
    const config: CalcPDFConfig = {
      toolName: 'BMI Calculator',
      inputs: [
        { label: 'Weight', value: 70,  unit: 'kg' },
        { label: 'Height', value: 175, unit: 'cm' },
      ],
      results: [
        { label: 'BMI',      value: 22.9,            highlight: true },
        { label: 'Category', value: 'Normal weight' },
      ],
    }
    await expect(exportCalcPDF(config)).resolves.toBeUndefined()
    expect(mockSave).toHaveBeenCalledTimes(1)
  })

  // ── No chart capture in test environment ─────────────────────────────────

  it('does not throw when chartElementId is provided but element does not exist in DOM', async () => {
    await expect(
      exportCalcPDF({ ...MINIMAL_CONFIG, chartElementId: 'non-existent-chart' })
    ).resolves.toBeUndefined()
  })
})
