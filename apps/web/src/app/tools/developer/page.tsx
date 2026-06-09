/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { generateCategoryMetadata } from '@/lib/seo'
import DeveloperClient from './DeveloperClient'

export const metadata: Metadata = generateCategoryMetadata('developer')

export default function DeveloperPage() {
  return <DeveloperClient />
}