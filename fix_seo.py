#!/usr/bin/env python3
"""Add openGraph, twitter, and robots to tool page.tsx files that are missing them."""

import os
import re

def add_og_twitter_robots(filepath, title, description, canonical_url):
    """Add openGraph, twitter, robots to metadata object if missing."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"NOT FOUND: {filepath}")
        return False

    if 'openGraph' in content:
        print(f"SKIP (already has OG): {os.path.basename(os.path.dirname(filepath))}")
        return False

    insert = (
        "\n"
        "  openGraph: {\n"
        f"    title: `{title}`,\n"
        f"    description: `{description}`,\n"
        f"    url: '{canonical_url}',\n"
        "    type: 'website',\n"
        "    siteName: 'RoughTools',\n"
        "  },\n"
        "  twitter: {\n"
        "    card: 'summary_large_image',\n"
        f"    title: `{title}`,\n"
        f"    description: `{description}`,\n"
        "  },\n"
        "  robots: { index: true, follow: true },"
    )

    # Strategy 1: insert after alternates line
    if "alternates: { canonical:" in content:
        alt_pos = content.index("alternates: { canonical:")
        line_end = content.index("\n", alt_pos)
        new_content = content[:line_end] + insert + content[line_end:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"FIXED (alt): {os.path.basename(os.path.dirname(filepath))}")
        return True

    # Strategy 2: find end of metadata object - insert before closing }
    # Look for keywords array ending ], then add after it
    kw_pattern = re.search(r"keywords:\s*\[.*?\],?\s*\n", content, re.DOTALL)
    if kw_pattern:
        pos = kw_pattern.end()
        # also add alternates
        insert_with_alt = (
            f"  alternates: {{ canonical: '{canonical_url}' }},\n"
            + insert.lstrip("\n")
        )
        new_content = content[:pos] + insert_with_alt + "\n" + content[pos:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"FIXED (kw): {os.path.basename(os.path.dirname(filepath))}")
        return True

    print(f"SKIPPED (no match): {filepath}")
    return False

# ── Developer tools ─────────────────────────────────────────────────────────
BASE = "C:/Users/shahid/ai-tools-platform/apps/web/src/app/tools"

dev_tools = [
    ("base64-encoder", "Base64 Encoder & Decoder — Free Online Tool | RoughTools",
     "Encode text to Base64 or decode Base64 strings instantly in your browser. Free, private Base64 encoder/decoder — no server required."),
    ("hash-generator", "Hash Generator — MD5, SHA-1, SHA-256 & More | RoughTools",
     "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text instantly in your browser. Free online hash generator tool."),
    ("uuid-generator", "UUID Generator — Generate UUID v4 Free Online | RoughTools",
     "Generate RFC-compliant UUIDs (v1, v4, v5) instantly in your browser. Bulk UUID generation, no server required. Free tool."),
    ("regex-tester", "Regex Tester — Test & Debug Regular Expressions | RoughTools",
     "Test and debug regular expressions in real time with match highlighting and named capture group support. Free online regex tester."),
    ("json-formatter", "JSON Formatter & Validator — Free Online Tool | RoughTools",
     "Format, minify, and validate JSON instantly in your browser. Beautify JSON or compress it — zero server communication, no data uploaded."),
    ("chmod-calculator", "chmod Calculator — Linux File Permission Calculator | RoughTools",
     "Calculate Linux chmod permission values. Convert between symbolic (rwx), octal, and numeric notation. Free online chmod calculator."),
    ("color-picker", "Color Picker — HEX, RGB, HSL Color Converter | RoughTools",
     "Pick colors and convert between HEX, RGB, HSL, and RGBA formats instantly. Free browser-based color picker and converter."),
    ("cron-parser", "Cron Parser — Cron Expression Tester & Explainer | RoughTools",
     "Parse and explain cron expressions in plain English. Validate cron syntax and see next run times. Free online cron expression parser."),
    ("css-minifier", "CSS Minifier — Minify CSS Online Free | RoughTools",
     "Minify CSS files instantly in your browser. Remove whitespace and comments to reduce file size. Free online CSS minifier tool."),
    ("diff-checker", "Diff Checker — Compare Text Files Online | RoughTools",
     "Compare two text files or code snippets and see differences highlighted line by line. Free online diff checker tool."),
    ("html-encoder", "HTML Encoder & Decoder — Escape HTML Entities | RoughTools",
     "Encode and decode HTML entities online. Escape special characters for safe HTML display. Free HTML encoder and decoder tool."),
    ("js-beautifier", "JavaScript Beautifier — Format JS Code Online | RoughTools",
     "Format and beautify JavaScript code online. Pretty-print minified JS and fix indentation. Free online JavaScript beautifier."),
    ("jwt-decoder", "JWT Decoder — Decode JSON Web Tokens Online | RoughTools",
     "Decode and inspect JWT tokens instantly without sending your token to any server. Free online JWT decoder and inspector."),
    ("markdown-editor", "Markdown Editor — Live Preview Markdown Online | RoughTools",
     "Write and preview Markdown in real time with a split-pane editor. Free online Markdown editor with live rendered output."),
    ("sql-formatter", "SQL Formatter — Format & Beautify SQL Queries | RoughTools",
     "Format and beautify SQL queries online with proper indentation and keyword casing. Free online SQL formatter tool."),
    ("timestamp-converter", "Timestamp Converter — Unix Time Converter | RoughTools",
     "Convert Unix timestamps to human-readable dates and back. Supports milliseconds and seconds. Free online timestamp converter."),
    ("url-encoder", "URL Encoder & Decoder — Percent-Encode URLs | RoughTools",
     "Encode and decode URLs online using percent-encoding. Convert special characters for safe URL use. Free URL encoder/decoder."),
    ("xml-formatter", "XML Formatter — Beautify & Validate XML Online | RoughTools",
     "Format, beautify, and validate XML documents online with proper indentation. Free online XML formatter and validator."),
    ("yaml-validator", "YAML Validator — Validate & Format YAML Online | RoughTools",
     "Validate and format YAML files online. Detect syntax errors and pretty-print YAML. Free online YAML validator."),
]

converter_tools = [
    ("area-converter", "Area Converter — Convert Square Meters, Acres, Sq Ft | RoughTools",
     "Convert area units instantly: square meters, square feet, acres, hectares, and more. Free online area unit converter tool."),
    ("digital-storage-converter", "Digital Storage Converter — Bytes, KB, MB, GB | RoughTools",
     "Convert digital storage units: bytes, kilobytes, megabytes, gigabytes, terabytes. Free online data storage unit converter."),
    ("length-converter", "Length Converter — Meters, Feet, Miles, Inches | RoughTools",
     "Convert length and distance units: meters, feet, miles, inches, kilometers, and more. Free online length unit converter."),
    ("speed-converter", "Speed Converter — mph, km/h, m/s, Knots | RoughTools",
     "Convert speed units: miles per hour, kilometers per hour, meters per second, and knots. Free online speed converter tool."),
    ("temperature-converter", "Temperature Converter — Celsius, Fahrenheit, Kelvin | RoughTools",
     "Convert temperatures between Celsius, Fahrenheit, Kelvin, and Rankine instantly. Free online temperature converter tool."),
    ("time-converter", "Time Converter — Seconds, Minutes, Hours, Days | RoughTools",
     "Convert time units: seconds, minutes, hours, days, weeks, and more. Free online time unit converter tool."),
    ("volume-converter", "Volume Converter — Liters, Gallons, Cups, Fluid Oz | RoughTools",
     "Convert volume units: liters, gallons, milliliters, cups, and fluid ounces. Free online volume unit converter tool."),
    ("weight-converter", "Weight Converter — Kilograms, Pounds, Ounces | RoughTools",
     "Convert weight and mass units: kilograms, pounds, ounces, grams, and tons. Free online weight converter tool."),
]

business_tools = [
    ("ad-creative-generator", "Ad Creative Generator — AI Ad Copy Writer Free | RoughTools",
     "Generate compelling ad copy for Google, Facebook, and Instagram ads. AI-powered ad creative generator — free, no signup required."),
    ("email-marketing-ai", "Email Marketing AI — Generate Email Campaigns Free | RoughTools",
     "Generate professional email marketing campaigns with AI. Subject lines, body copy, and CTAs for any audience. Free online tool."),
    ("landing-page-builder", "Landing Page Builder — Create Landing Page Copy | RoughTools",
     "Generate high-converting landing page copy with AI. Headlines, benefits, CTAs, and social proof sections. Free online tool."),
    ("sales-copy-ai", "Sales Copy AI — Generate Sales Copy Online Free | RoughTools",
     "Generate persuasive sales copy with AI. Create compelling product descriptions, sales emails, and VSL scripts. Free tool."),
    ("seo-optimizer", "SEO Optimizer — Free SEO Content Optimizer | RoughTools",
     "Optimize your content for search engines with AI. Meta titles, descriptions, headers, and keyword suggestions. Free SEO tool."),
    ("social-media-scheduler", "Social Media Post Generator — Free for All Platforms | RoughTools",
     "Generate platform-optimised posts for Twitter/X, LinkedIn, Instagram, and Facebook simultaneously. Free, no signup required."),
]

real_estate_tools = [
    ("cap-rate-calculator", "Cap Rate Calculator — Capitalization Rate Calculator | RoughTools",
     "Calculate the capitalization rate (cap rate) for any rental property. Enter NOI and property value for instant results. Free tool."),
    ("closing-costs-calculator", "Closing Costs Calculator — Estimate Home Closing Costs | RoughTools",
     "Estimate home closing costs for buyers and sellers. Calculate transfer taxes, title insurance, and escrow fees. Free calculator."),
    ("down-payment-calculator", "Down Payment Calculator — How Much to Save | RoughTools",
     "Calculate how much down payment you need and how long to save. Free online down payment and home purchase calculator."),
    ("home-affordability-calculator", "Home Affordability Calculator — How Much House Can You Afford | RoughTools",
     "Calculate how much home you can afford based on income, debts, and down payment. Free online home affordability calculator."),
    ("home-value-estimator", "Home Value Estimator — Estimate Property Value | RoughTools",
     "Estimate your home's current market value using compound appreciation. Free online home value and equity estimator tool."),
    ("property-tax-calculator", "Property Tax Calculator — Estimate Annual Property Tax | RoughTools",
     "Estimate annual property tax based on assessed value and local tax rate. Free online property tax calculator tool."),
    ("rent-vs-buy-calculator", "Rent vs Buy Calculator — Should You Rent or Buy? | RoughTools",
     "Compare the true costs of renting versus buying a home over time. Free online rent vs buy break-even calculator."),
    ("rental-yield-calculator", "Rental Yield Calculator — Gross & Net Rental Return | RoughTools",
     "Calculate gross and net rental yield for any investment property. Free online rental yield and return calculator tool."),
]

network_tools = [
    ("dns-lookup", "DNS Lookup — Query DNS Records Online | RoughTools",
     "Look up DNS records for any domain: A, AAAA, MX, TXT, NS, CNAME. Free online DNS lookup and query tool."),
    ("http-headers-checker", "HTTP Headers Checker — Inspect HTTP Response Headers | RoughTools",
     "Check HTTP response headers for any URL. Inspect security headers, redirects, and cache controls. Free online tool."),
    ("ip-checker", "IP Address Checker — Find Your IP Address | RoughTools",
     "Find your public IP address, ISP, location, and network details instantly. Free online IP address lookup tool."),
    ("ping-tool", "Ping Tool — Online Ping Test | RoughTools",
     "Test the reachability of any host with an online ping tool. Check latency and packet loss. Free online ping test."),
    ("port-checker", "Port Checker — Check if Port is Open | RoughTools",
     "Check if a specific port is open on any server or IP address. Free online port checker and scanner tool."),
    ("website-speed-test", "Website Speed Test — Test Page Load Speed | RoughTools",
     "Test the load speed of any website. Measure response time and identify performance bottlenecks. Free online speed test."),
    ("whois-lookup", "WHOIS Lookup — Domain Registration Info | RoughTools",
     "Look up WHOIS registration information for any domain. Find owner, registrar, expiry date, and nameservers. Free tool."),
]

legal_tools = [
    ("cease-and-desist-generator", "Cease and Desist Generator — Free Legal Letter Builder | RoughTools",
     "Generate a cease and desist letter for copyright, defamation, or harassment. Free online legal letter generator tool."),
    ("employment-contract-generator", "Employment Contract Generator — Free Template | RoughTools",
     "Generate an employment contract template with key terms and conditions. Free online employment contract creator."),
    ("lease-agreement-generator", "Lease Agreement Generator — Free Rental Agreement | RoughTools",
     "Generate a residential lease agreement template. Free online rental agreement and lease contract generator."),
    ("nda-generator", "NDA Generator — Free Non-Disclosure Agreement | RoughTools",
     "Generate a non-disclosure agreement (NDA) for mutual or one-way confidentiality. Free online NDA creator tool."),
    ("power-of-attorney-generator", "Power of Attorney Generator — Free POA Template | RoughTools",
     "Generate a power of attorney template for financial or healthcare decisions. Free online POA document creator."),
    ("terms-of-service-generator", "Terms of Service Generator — Free ToS Creator | RoughTools",
     "Generate terms of service for your website or app. Free online terms of service generator tool."),
    ("will-generator", "Will Generator — Free Last Will & Testament | RoughTools",
     "Generate a basic last will and testament template. Free online will generator for simple estate planning."),
]

environment_tools = [
    ("carbon-footprint-calculator", "Carbon Footprint Calculator — Calculate Your Emissions | RoughTools",
     "Calculate your annual carbon footprint from home energy, transport, and lifestyle. Free online carbon footprint calculator."),
    ("ev-carbon-offset", "EV Carbon Offset Calculator — Electric vs Gas Savings | RoughTools",
     "Calculate the carbon savings of switching from a gas car to an electric vehicle. Free EV carbon offset calculator."),
    ("flight-carbon-calculator", "Flight Carbon Calculator — Aviation Emissions | RoughTools",
     "Calculate the CO2 emissions from any flight. Estimate your aviation carbon footprint. Free online flight carbon calculator."),
    ("home-energy-audit", "Home Energy Audit — Calculate Home Energy Use | RoughTools",
     "Audit your home energy consumption and find savings opportunities. Free online home energy usage calculator."),
    ("solar-savings-calculator", "Solar Savings Calculator — Solar Panel ROI | RoughTools",
     "Calculate your solar panel savings and payback period. Estimate solar ROI for your home. Free online solar calculator."),
    ("waste-reduction-planner", "Waste Reduction Planner — Reduce Your Waste | RoughTools",
     "Plan and calculate your waste reduction goals. Track recycling, composting, and landfill diversion. Free online tool."),
]

text_tools = [
    ("case-converter", "Case Converter — Convert Text Case Online | RoughTools",
     "Convert text between uppercase, lowercase, title case, and sentence case instantly. Free online text case converter tool."),
    ("find-replace", "Find & Replace — Find and Replace Text Online | RoughTools",
     "Find and replace text online with regex support. Batch replace strings in any text. Free online find and replace tool."),
    ("grammar-checker", "Grammar Checker — Check Grammar Online Free | RoughTools",
     "Check grammar, spelling, and punctuation errors in your text. Free online grammar checker and proofreading tool."),
    ("lorem-ipsum-generator", "Lorem Ipsum Generator — Generate Placeholder Text | RoughTools",
     "Generate Lorem Ipsum placeholder text in words, sentences, or paragraphs. Free online Lorem Ipsum generator."),
    ("readability-score", "Readability Score — Check Text Readability | RoughTools",
     "Check the readability of your text using Flesch-Kincaid and other readability formulas. Free online readability checker."),
    ("remove-duplicate-lines", "Remove Duplicate Lines — Delete Duplicate Text Lines | RoughTools",
     "Remove duplicate lines from any text or list. Sort, deduplicate, and clean text data. Free online duplicate line remover."),
    ("text-reverser", "Text Reverser — Reverse Text Online | RoughTools",
     "Reverse text, words, or sentences online instantly. Free browser-based text reverser and flipper tool."),
    ("text-summarizer", "Text Summarizer — Summarize Text Online Free | RoughTools",
     "Summarize long articles, documents, and text automatically. Free online text summarizer and abstract generator."),
    ("text-to-speech", "Text to Speech — Convert Text to Audio Online | RoughTools",
     "Convert text to speech online with multiple voice options. Free browser-based text-to-speech converter tool."),
    ("word-counter", "Word Counter — Count Words, Characters & More | RoughTools",
     "Count words, characters, sentences, and paragraphs in any text. Free online word and character counter tool."),
]

# security tools (already have /tools/security path)
security_tools = [
    ("barcode-generator", "Barcode Generator — Create Barcodes Online Free | RoughTools",
     "Generate barcodes in multiple formats: Code 128, EAN-13, UPC-A, QR, and more. Free online barcode generator tool."),
]

all_fixes = []
for slug, title, desc in dev_tools:
    path = f"{BASE}/developer/{slug}/page.tsx"
    canonical = f"https://roughtools.com/tools/developer/{slug}"
    all_fixes.append((path, title, desc, canonical))

for slug, title, desc in converter_tools:
    path = f"{BASE}/converters/{slug}/page.tsx"
    canonical = f"https://roughtools.com/tools/converters/{slug}"
    all_fixes.append((path, title, desc, canonical))

for slug, title, desc in business_tools:
    path = f"{BASE}/business/{slug}/page.tsx"
    canonical = f"https://roughtools.com/tools/business/{slug}"
    all_fixes.append((path, title, desc, canonical))

for slug, title, desc in real_estate_tools:
    path = f"{BASE}/real-estate/{slug}/page.tsx"
    canonical = f"https://roughtools.com/tools/real-estate/{slug}"
    all_fixes.append((path, title, desc, canonical))

for slug, title, desc in network_tools:
    path = f"{BASE}/network/{slug}/page.tsx"
    canonical = f"https://roughtools.com/tools/network/{slug}"
    all_fixes.append((path, title, desc, canonical))

for slug, title, desc in legal_tools:
    path = f"{BASE}/legal-tools/{slug}/page.tsx"
    canonical = f"https://roughtools.com/tools/legal-tools/{slug}"
    all_fixes.append((path, title, desc, canonical))

for slug, title, desc in environment_tools:
    path = f"{BASE}/environment/{slug}/page.tsx"
    canonical = f"https://roughtools.com/tools/environment/{slug}"
    all_fixes.append((path, title, desc, canonical))

for slug, title, desc in text_tools:
    path = f"{BASE}/text/{slug}/page.tsx"
    canonical = f"https://roughtools.com/tools/text/{slug}"
    all_fixes.append((path, title, desc, canonical))

for slug, title, desc in security_tools:
    path = f"{BASE}/security/{slug}/page.tsx"
    canonical = f"https://roughtools.com/tools/security/{slug}"
    all_fixes.append((path, title, desc, canonical))

fixed = 0
skipped = 0
not_found = 0

for path, title, desc, canonical in all_fixes:
    result = add_og_twitter_robots(path, title, desc, canonical)
    if result:
        fixed += 1
    elif not os.path.exists(path):
        not_found += 1
    else:
        skipped += 1

print(f"\n=== Summary ===")
print(f"Fixed: {fixed}")
print(f"Skipped (already has OG or no match): {skipped}")
print(f"Not found: {not_found}")
