#!/usr/bin/env python3
"""
Refactor document-tool pages from 'use client' page.tsx to server component wrappers.
"""
import os

BASE = "C:/Users/shahid/ai-tools-platform/apps/web/src/app/tools/document-tools"

doc_tools = [
    {
        "slug": "invoice-generator",
        "component": "InvoiceGenerator",
        "title": "Invoice Generator — Create Professional Invoices Free | RoughTools",
        "description": "Create professional invoices with customizable templates, line items, tax, and discounts. Export to PDF. Free online invoice generator.",
        "keywords": "['invoice generator', 'free invoice maker', 'invoice template', 'create invoice online', 'professional invoice creator']",
        "canonical": "https://roughtools.com/tools/document-tools/invoice-generator",
    },
    {
        "slug": "resume-builder",
        "component": "ResumeBuilder",
        "title": "Resume Builder — Create a Professional Resume Free | RoughTools",
        "description": "Build a professional resume with multiple templates. Export to PDF. Free online resume builder — no signup required.",
        "keywords": "['resume builder', 'free resume maker', 'resume template', 'cv builder online', 'create resume free']",
        "canonical": "https://roughtools.com/tools/document-tools/resume-builder",
    },
    {
        "slug": "nda-generator",
        "component": "NDAGenerator",
        "title": "NDA Generator — Free Non-Disclosure Agreement | RoughTools",
        "description": "Generate a non-disclosure agreement (NDA) for mutual or one-way confidentiality. Export to PDF. Free online NDA generator.",
        "keywords": "['nda generator', 'non-disclosure agreement', 'confidentiality agreement', 'nda template', 'free nda maker']",
        "canonical": "https://roughtools.com/tools/document-tools/nda-generator",
    },
    {
        "slug": "contract-creator",
        "component": "ContractCreator",
        "title": "Contract Creator — Create Business Contracts Free | RoughTools",
        "description": "Create professional business contracts and service agreements online. Export to PDF. Free contract creator with customizable templates.",
        "keywords": "['contract creator', 'contract generator', 'business contract template', 'service agreement generator', 'free contract maker']",
        "canonical": "https://roughtools.com/tools/document-tools/contract-creator",
    },
    {
        "slug": "cover-letter-builder",
        "component": "CoverLetterBuilder",
        "title": "Cover Letter Builder — Create Cover Letters Free | RoughTools",
        "description": "Build a professional cover letter with customizable templates. Export to PDF. Free online cover letter builder — no signup required.",
        "keywords": "['cover letter builder', 'cover letter generator', 'free cover letter maker', 'cover letter template', 'create cover letter online']",
        "canonical": "https://roughtools.com/tools/document-tools/cover-letter-builder",
    },
    {
        "slug": "business-letter",
        "component": "BusinessLetterGenerator",
        "title": "Business Letter Generator — Professional Letter Template | RoughTools",
        "description": "Create professional business letters with proper formatting and templates. Export to PDF. Free online business letter generator.",
        "keywords": "['business letter generator', 'professional letter template', 'business letter format', 'formal letter generator', 'free letter maker']",
        "canonical": "https://roughtools.com/tools/document-tools/business-letter",
    },
    {
        "slug": "meeting-minutes",
        "component": "MeetingMinutes",
        "title": "Meeting Minutes Generator — Free Meeting Notes Template | RoughTools",
        "description": "Create professional meeting minutes with action items, attendees, and decisions. Export to PDF. Free online meeting minutes generator.",
        "keywords": "['meeting minutes generator', 'meeting notes template', 'meeting minutes template', 'create meeting minutes', 'free minutes maker']",
        "canonical": "https://roughtools.com/tools/document-tools/meeting-minutes",
    },
    {
        "slug": "expense-report",
        "component": "ExpenseReportGenerator",
        "title": "Expense Report Generator — Create Expense Reports Free | RoughTools",
        "description": "Create professional expense reports with itemized costs and totals. Export to PDF. Free online expense report generator tool.",
        "keywords": "['expense report generator', 'expense report template', 'create expense report', 'business expense tracker', 'free expense report maker']",
        "canonical": "https://roughtools.com/tools/document-tools/expense-report",
    },
    {
        "slug": "proposal-generator",
        "component": "ProposalGenerator",
        "title": "Proposal Generator — Create Business Proposals Free | RoughTools",
        "description": "Create professional business proposals and project proposals online. Export to PDF. Free online proposal generator tool.",
        "keywords": "['proposal generator', 'business proposal template', 'project proposal generator', 'free proposal maker', 'create business proposal']",
        "canonical": "https://roughtools.com/tools/document-tools/proposal-generator",
    },
    {
        "slug": "reference-letter",
        "component": "ReferenceLetterGenerator",
        "title": "Reference Letter Generator — Free Reference Letter | RoughTools",
        "description": "Create professional reference and recommendation letters online. Export to PDF. Free reference letter generator tool.",
        "keywords": "['reference letter generator', 'recommendation letter template', 'reference letter template', 'create reference letter', 'free letter generator']",
        "canonical": "https://roughtools.com/tools/document-tools/reference-letter",
    },
    {
        "slug": "terms-of-service",
        "component": "TermsOfServiceGenerator",
        "title": "Terms of Service Generator — Free ToS Creator | RoughTools",
        "description": "Generate terms of service for your website or app. Customizable template with key clauses. Free online terms of service generator.",
        "keywords": "['terms of service generator', 'terms of service template', 'tos generator', 'website terms generator', 'free tos creator']",
        "canonical": "https://roughtools.com/tools/document-tools/terms-of-service",
    },
    {
        "slug": "add-page-numbers",
        "component": "AddPageNumbers",
        "title": "Add Page Numbers to PDF — Free Online Tool | RoughTools",
        "description": "Add page numbers to PDF files online. Customize position, font, and starting number. Free browser-based PDF page numbering tool.",
        "keywords": "['add page numbers to pdf', 'pdf page numbering', 'number pdf pages online', 'free pdf page numbers', 'page number pdf tool']",
        "canonical": "https://roughtools.com/tools/document-tools/add-page-numbers",
    },
    {
        "slug": "add-watermark",
        "component": "AddWatermark",
        "title": "Add Watermark to PDF — Free Online Watermark Tool | RoughTools",
        "description": "Add text or image watermarks to PDF files online. Customize position, opacity, and rotation. Free PDF watermark tool.",
        "keywords": "['add watermark to pdf', 'pdf watermark tool', 'watermark pdf online', 'free pdf watermarker', 'stamp pdf online']",
        "canonical": "https://roughtools.com/tools/document-tools/add-watermark",
    },
]

def refactor_doc_tool(tool):
    slug = tool["slug"]
    component = tool["component"]
    title = tool["title"]
    description = tool["description"]
    keywords = tool["keywords"]
    canonical = tool["canonical"]

    page_path = os.path.join(BASE, slug, "page.tsx")
    client_path = os.path.join(BASE, slug, f"{component}Client.tsx")

    if not os.path.exists(page_path):
        print(f"NOT FOUND: {page_path}")
        return

    # Read original content
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already has metadata
    if "export const metadata" in content:
        print(f"SKIP (already has metadata): {slug}")
        return

    # Check if it's a redirect
    if "redirect(" in content and len(content) < 200:
        print(f"SKIP (redirect): {slug}")
        return

    # Check if client file already exists
    if os.path.exists(client_path):
        print(f"SKIP (client already exists): {slug}")
        return

    # Save as client component
    with open(client_path, 'w', encoding='utf-8') as f:
        f.write(content)

    # Create new server-component page.tsx
    new_page = f"""import type {{ Metadata }} from 'next'
import {component}Client from './{component}Client'

export const metadata: Metadata = {{
  title: `{title}`,
  description: `{description}`,
  keywords: {keywords},
  alternates: {{ canonical: '{canonical}' }},
  openGraph: {{
    title: `{title}`,
    description: `{description}`,
    url: '{canonical}',
    type: 'website',
    siteName: 'RoughTools',
  }},
  twitter: {{
    card: 'summary_large_image',
    title: `{title}`,
    description: `{description}`,
  }},
  robots: {{ index: true, follow: true }},
}}

export default function Page() {{
  return <{component}Client />
}}
"""

    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(new_page)

    print(f"REFACTORED: {slug}")

for tool in doc_tools:
    refactor_doc_tool(tool)

print("\nDone.")
