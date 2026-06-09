#!/usr/bin/env python3
"""
Refactor security tool pages from 'use client' page.tsx to:
1. Rename page.tsx -> [Name]Client.tsx
2. Create new server-component page.tsx with metadata + import of client component
"""
import os
import shutil

BASE = "C:/Users/shahid/ai-tools-platform/apps/web/src/app/tools/security"

security_tools = [
    {
        "slug": "barcode-generator",
        "component": "BarcodeGenerator",
        "title": "Barcode Generator — Create Barcodes Online Free | RoughTools",
        "description": "Generate barcodes in Code 128, EAN-13, UPC-A, QR, and more formats instantly. Free online barcode generator — no signup required.",
        "keywords": "['barcode generator', 'create barcode online', 'code 128 generator', 'ean-13 barcode', 'free barcode maker']",
        "canonical": "https://roughtools.com/tools/security/barcode-generator",
    },
    {
        "slug": "qr-code-generator",
        "component": "QRCodeGenerator",
        "title": "QR Code Generator — Create QR Codes Free Online | RoughTools",
        "description": "Generate QR codes for URLs, text, email, phone, WiFi, and contacts. Customizable colors and sizes. Free online QR code generator.",
        "keywords": "['qr code generator', 'create qr code', 'free qr code maker', 'qr code online', 'wifi qr code']",
        "canonical": "https://roughtools.com/tools/security/qr-code-generator",
    },
    {
        "slug": "ssl-checker",
        "component": "SSLChecker",
        "title": "SSL Certificate Checker — Check SSL Validity Online | RoughTools",
        "description": "Check SSL certificate validity, expiry date, issuer, and SAN entries for any domain. Free online SSL certificate checker tool.",
        "keywords": "['ssl checker', 'ssl certificate checker', 'ssl validity checker', 'check ssl certificate', 'ssl expiry checker']",
        "canonical": "https://roughtools.com/tools/security/ssl-checker",
    },
    {
        "slug": "vpn-checker",
        "component": "VPNChecker",
        "title": "VPN Checker — Check if Your VPN is Working | RoughTools",
        "description": "Check if your VPN is active and verify your IP address, location, and DNS leak status. Free online VPN detector and checker.",
        "keywords": "['vpn checker', 'vpn detector', 'dns leak test', 'vpn ip check', 'check vpn connection']",
        "canonical": "https://roughtools.com/tools/security/vpn-checker",
    },
    {
        "slug": "temporary-email",
        "component": "TemporaryEmail",
        "title": "Temporary Email — Disposable Email Address | RoughTools",
        "description": "Generate a disposable temporary email address to protect your privacy. Free throwaway email with inbox. No registration required.",
        "keywords": "['temporary email', 'disposable email', 'throwaway email', 'fake email generator', 'temp mail']",
        "canonical": "https://roughtools.com/tools/security/temporary-email",
    },
    {
        "slug": "url-shortener",
        "component": "URLShortener",
        "title": "URL Shortener — Shorten Long URLs Free | RoughTools",
        "description": "Shorten long URLs instantly with a free URL shortener. Create short links with click tracking. No signup required.",
        "keywords": "['url shortener', 'link shortener', 'shorten url', 'short link generator', 'free url shortener']",
        "canonical": "https://roughtools.com/tools/security/url-shortener",
    },
    {
        "slug": "metadata-remover",
        "component": "MetadataRemover",
        "title": "Metadata Remover — Remove EXIF Data from Images | RoughTools",
        "description": "Remove EXIF metadata and location data from photos and files privately in your browser. Free online metadata remover tool.",
        "keywords": "['metadata remover', 'exif remover', 'remove exif data', 'strip metadata from image', 'photo metadata cleaner']",
        "canonical": "https://roughtools.com/tools/security/metadata-remover",
    },
    {
        "slug": "file-encryptor",
        "component": "FileEncryptor",
        "title": "File Encryptor — Encrypt Files Online Free | RoughTools",
        "description": "Encrypt and decrypt files in your browser using AES-256 encryption. Fully client-side — your files never leave your device. Free tool.",
        "keywords": "['file encryptor', 'encrypt file online', 'aes file encryption', 'browser file encryption', 'decrypt file online']",
        "canonical": "https://roughtools.com/tools/security/file-encryptor",
    },
    {
        "slug": "password-generator",
        "component": "PasswordGenerator",
        "title": "Password Generator — Secure Random Password | RoughTools",
        "description": "Generate cryptographically secure passwords using crypto.getRandomValues(). Standard, passphrase, and PIN modes. Free online password generator.",
        "keywords": "['password generator', 'secure password generator', 'random password', 'strong password generator', 'free password generator']",
        "canonical": "https://roughtools.com/tools/security/password-generator",
    },
]

def refactor_security_tool(tool):
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

    # Check if already refactored (has metadata export)
    if "export const metadata" in content:
        print(f"SKIP (already has metadata): {slug}")
        return

    # Check if client file already exists
    if os.path.exists(client_path):
        print(f"SKIP (client already exists): {slug}")
        return

    # Rename the existing page to client component - change the export
    # Replace 'export default function X()' with 'export default function X()'
    # and add/keep 'use client' directive - it's already there
    client_content = content

    # Save client component
    with open(client_path, 'w', encoding='utf-8') as f:
        f.write(client_content)

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

for tool in security_tools:
    refactor_security_tool(tool)

print("\nDone.")
