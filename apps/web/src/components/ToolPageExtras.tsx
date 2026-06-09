/**
 * ToolPageExtras.tsx
 * Composite component that adds all compliance-required elements missing
 * from custom tool pages in a single import.
 *
 * Covers rules: B-6, B-8, B-9, E-1, F-1, F-2, F-3
 *
 * Usage in a custom page:
 *   import { ToolPageExtras } from '@/components/ToolPageExtras'
 *   <ToolPageExtras toolName="Mortgage Calculator" toolSlug="mortgage-calculator" type="financial" showPDF />
 */

import { ToolDisclaimer, type DisclaimerType } from '@/components/ToolDisclaimer'
import { ToolPrivacyNotice } from '@/components/ToolPrivacyNotice'
import { ToolStarRating } from '@/components/ToolStarRating'
import { ToolFeedback } from '@/components/ToolFeedback'
import { ToolSocialShare } from '@/components/ToolSocialShare'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolFeaturesList } from '@/components/ToolFeaturesList'

export interface ToolPageExtrasProps {
  toolName: string
  toolSlug: string
  toolUrl?: string
  type?: DisclaimerType
  showPDF?: boolean
  features?: string[]
  serverSide?: boolean
}

export function ToolPageExtras({
  toolName,
  toolSlug,
  toolUrl,
  type = 'general',
  showPDF = false,
  features,
  serverSide = false,
}: ToolPageExtrasProps) {
  return (
    <div style={{ marginTop: 8 }}>
      {/* B-6 Features list */}
      {features && features.length > 0 && (
        <ToolFeaturesList features={features} />
      )}

      {/* B-8 Disclaimer */}
      <ToolDisclaimer type={type} toolName={toolName} />

      {/* B-9 Data privacy notice */}
      <ToolPrivacyNotice serverSide={serverSide} />

      {/* E-1 PDF export (for result-producing tools) */}
      {showPDF && (
        <div style={{ marginBottom: 8 }}>
          <PDFExportButton toolName={toolName} />
        </div>
      )}

      {/* F-1 Star rating */}
      <ToolStarRating toolName={toolName} toolSlug={toolSlug} toolUrl={toolUrl} />

      {/* F-2 Feedback / bug report */}
      <ToolFeedback toolName={toolName} />

      {/* F-3 Social share */}
      <ToolSocialShare toolName={toolName} toolUrl={toolUrl} />
    </div>
  )
}
