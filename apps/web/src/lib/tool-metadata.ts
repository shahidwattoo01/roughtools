// ============================================================
// ROUGHTOOLS â€” Per-Tool Metadata Helper
// Use in every tool's page.tsx generateMetadata function
// ============================================================

import type { Metadata } from 'next'
import { getToolBySlug } from '@/lib/tools-registry'
import { generateToolMetadata } from '@/lib/seo'
import { getToolPageSchema, getBreadcrumbSchema, getHowToSchema, getFAQSchema } from '@/lib/structured-data'
import { SEO_CONFIG } from '@/lib/seo-config'
import { getCategoryLabel } from '@/lib/seo'

interface ToolPageParams {
  params: { category: string; tool: string }
}

/**
 * Drop-in generateMetadata for any tool page.tsx:
 *
 * ```ts
 * export { generateToolPageMetadata as generateMetadata } from '@/lib/tool-metadata'
 * ```
 */
export async function generateToolPageMetadata({ params }: ToolPageParams): Promise<Metadata> {
  const tool = getToolBySlug(params.tool)

  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'This tool could not be found.',
      robots: { index: false, follow: false },
    }
  }

  return generateToolMetadata(tool)
}

/**
 * Get all structured data schemas for a tool page.
 * Returns an array of JSON-LD objects ready for <JsonLd data={...} />
 */
export function getToolPageSchemas(params: {
  toolSlug: string
  category: string
  howToSteps?: Array<{ name: string; text: string }>
  faqs?: Array<{ question: string; answer: string }>
}) {
  const { toolSlug, category, howToSteps, faqs } = params
  const tool = getToolBySlug(toolSlug)
  if (!tool) return []

  const toolUrl = `${SEO_CONFIG.siteUrl}/tools/${category}/${toolSlug}`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schemas: Record<string, any>[] = [
    // 1. Tool schema
    getToolPageSchema(tool),

    // 2. Breadcrumb
    getBreadcrumbSchema([
      { name: 'Home', url: SEO_CONFIG.siteUrl },
      { name: getCategoryLabel(tool.category), url: `${SEO_CONFIG.siteUrl}/tools/${category}` },
      { name: tool.name, url: toolUrl },
    ]),
  ]

  // 3. How-to (optional)
  if (howToSteps && howToSteps.length > 0) {
    schemas.push(getHowToSchema({ toolName: tool.name, toolUrl, steps: howToSteps }))
  }

  // 4. FAQ (optional)
  if (faqs && faqs.length > 0) {
    schemas.push(getFAQSchema(faqs))
  }

  return schemas
}

/**
 * Default How-To steps for common tool types.
 * Use as fallback when tool page doesn't define custom steps.
 */
export const DEFAULT_HOW_TO_STEPS: Record<string, Array<{ name: string; text: string }>> = {
  'compress-pdf': [
    { name: 'Upload your PDF', text: 'Click the upload button or drag and drop your PDF file.' },
    { name: 'Choose compression level', text: 'Select your desired compression quality: low, medium, or high.' },
    { name: 'Compress', text: 'Click the Compress PDF button and wait for processing.' },
    { name: 'Download', text: 'Download your compressed PDF file.' },
  ],
  'merge-pdf': [
    { name: 'Upload PDF files', text: 'Upload 2 or more PDF files by clicking the upload area or dragging and dropping.' },
    { name: 'Arrange order', text: 'Drag to reorder the PDFs in the desired merge sequence.' },
    { name: 'Merge', text: 'Click Merge PDF to combine all files into one.' },
    { name: 'Download', text: 'Download your merged PDF document.' },
  ],
  'bmi-calculator': [
    { name: 'Enter your height', text: 'Type your height in feet/inches or centimeters.' },
    { name: 'Enter your weight', text: 'Type your weight in pounds or kilograms.' },
    { name: 'Calculate', text: 'Click Calculate BMI to see your result instantly.' },
    { name: 'Review results', text: 'View your BMI value and category, along with health recommendations.' },
  ],
  'json-formatter': [
    { name: 'Paste your JSON', text: 'Paste or type your JSON data in the input area.' },
    { name: 'Format', text: 'Click Format JSON or use Ctrl+Enter for instant formatting.' },
    { name: 'Copy result', text: 'Copy the formatted JSON to clipboard.' },
  ],
}

/**
 * Default FAQ for common tools.
 */
export const DEFAULT_FAQS: Record<string, Array<{ question: string; answer: string }>> = {
  'compress-pdf': [
    {
      question: 'Is PDF compression free?',
      answer: 'Yes, RoughTools PDF compression is completely free with up to 20 uses per day. Pro users get unlimited compression.',
    },
    {
      question: 'How much can I compress a PDF?',
      answer: 'Depending on the original file, you can reduce PDF size by 20% to 90%. Image-heavy PDFs compress the most.',
    },
    {
      question: 'Does compression affect quality?',
      answer: 'Our tool offers 3 compression levels. Low compression keeps near-original quality. High compression reduces quality but achieves maximum size reduction.',
    },
    {
      question: 'Is my PDF secure?',
      answer: 'Yes. Files are processed in your browser when possible, and are automatically deleted from our servers within 1 hour.',
    },
  ],
  'bmi-calculator': [
    {
      question: 'What is BMI?',
      answer: 'BMI (Body Mass Index) is a measure of body fat based on height and weight. It is used to screen for weight categories that may lead to health problems.',
    },
    {
      question: 'What is a healthy BMI?',
      answer: 'A BMI between 18.5 and 24.9 is considered healthy. Below 18.5 is underweight, 25â€“29.9 is overweight, and 30+ is obese.',
    },
    {
      question: 'Is BMI accurate?',
      answer: 'BMI is a useful screening tool but not a diagnostic measure. It may overestimate body fat in athletes and underestimate it in older persons.',
    },
  ],
}