#!/usr/bin/env python3
"""
Add BreadcrumbList + WebApplication JSON-LD schema to tool pages.
Targets pages that have FAQPage schema but lack BreadcrumbList.
"""
import os
import re

BASE = "C:/Users/shahid/ai-tools-platform/apps/web/src/app/tools"

# Tool pages: (category_path, slug, display_name, category_display)
tool_pages = [
    # Developer tools
    ("developer", "json-formatter", "JSON Formatter & Validator", "Developer Tools"),
    ("developer", "base64-encoder", "Base64 Encoder & Decoder", "Developer Tools"),
    ("developer", "hash-generator", "Hash Generator", "Developer Tools"),
    ("developer", "uuid-generator", "UUID Generator", "Developer Tools"),
    ("developer", "regex-tester", "Regex Tester", "Developer Tools"),
    ("developer", "chmod-calculator", "chmod Calculator", "Developer Tools"),
    ("developer", "color-picker", "Color Picker", "Developer Tools"),
    ("developer", "cron-parser", "Cron Parser", "Developer Tools"),
    ("developer", "css-minifier", "CSS Minifier", "Developer Tools"),
    ("developer", "diff-checker", "Diff Checker", "Developer Tools"),
    ("developer", "html-encoder", "HTML Encoder", "Developer Tools"),
    ("developer", "js-beautifier", "JavaScript Beautifier", "Developer Tools"),
    ("developer", "jwt-decoder", "JWT Decoder", "Developer Tools"),
    ("developer", "markdown-editor", "Markdown Editor", "Developer Tools"),
    ("developer", "sql-formatter", "SQL Formatter", "Developer Tools"),
    ("developer", "timestamp-converter", "Timestamp Converter", "Developer Tools"),
    ("developer", "url-encoder", "URL Encoder", "Developer Tools"),
    ("developer", "xml-formatter", "XML Formatter", "Developer Tools"),
    ("developer", "yaml-validator", "YAML Validator", "Developer Tools"),
    # Converters
    ("converters", "temperature-converter", "Temperature Converter", "Unit Converters"),
    ("converters", "length-converter", "Length Converter", "Unit Converters"),
    ("converters", "weight-converter", "Weight Converter", "Unit Converters"),
    ("converters", "area-converter", "Area Converter", "Unit Converters"),
    ("converters", "volume-converter", "Volume Converter", "Unit Converters"),
    ("converters", "speed-converter", "Speed Converter", "Unit Converters"),
    ("converters", "time-converter", "Time Converter", "Unit Converters"),
    ("converters", "digital-storage-converter", "Digital Storage Converter", "Unit Converters"),
    # Text tools
    ("text", "word-counter", "Word Counter", "Text Tools"),
    ("text", "case-converter", "Case Converter", "Text Tools"),
    ("text", "grammar-checker", "Grammar Checker", "Text Tools"),
    ("text", "text-summarizer", "Text Summarizer", "Text Tools"),
    ("text", "lorem-ipsum-generator", "Lorem Ipsum Generator", "Text Tools"),
    ("text", "readability-score", "Readability Score", "Text Tools"),
    ("text", "text-reverser", "Text Reverser", "Text Tools"),
    ("text", "remove-duplicate-lines", "Remove Duplicate Lines", "Text Tools"),
    ("text", "find-replace", "Find & Replace", "Text Tools"),
    ("text", "text-to-speech", "Text to Speech", "Text Tools"),
    # Network tools
    ("network", "ip-checker", "IP Address Checker", "Network Tools"),
    ("network", "dns-lookup", "DNS Lookup", "Network Tools"),
    ("network", "whois-lookup", "WHOIS Lookup", "Network Tools"),
    ("network", "ping-tool", "Ping Tool", "Network Tools"),
    ("network", "port-checker", "Port Checker", "Network Tools"),
    ("network", "http-headers-checker", "HTTP Headers Checker", "Network Tools"),
    ("network", "website-speed-test", "Website Speed Test", "Network Tools"),
    # Business tools
    ("business", "social-media-scheduler", "Social Media Scheduler", "Business Tools"),
    ("business", "seo-optimizer", "SEO Optimizer", "Business Tools"),
    ("business", "email-marketing-ai", "Email Marketing AI", "Business Tools"),
    ("business", "ad-creative-generator", "Ad Creative Generator", "Business Tools"),
    ("business", "sales-copy-ai", "Sales Copy AI", "Business Tools"),
    ("business", "landing-page-builder", "Landing Page Builder", "Business Tools"),
    # Real estate
    ("real-estate", "home-value-estimator", "Home Value Estimator", "Real Estate Tools"),
    ("real-estate", "cap-rate-calculator", "Cap Rate Calculator", "Real Estate Tools"),
    ("real-estate", "rental-yield-calculator", "Rental Yield Calculator", "Real Estate Tools"),
    ("real-estate", "rent-vs-buy-calculator", "Rent vs Buy Calculator", "Real Estate Tools"),
    ("real-estate", "closing-costs-calculator", "Closing Costs Calculator", "Real Estate Tools"),
    ("real-estate", "down-payment-calculator", "Down Payment Calculator", "Real Estate Tools"),
    ("real-estate", "home-affordability-calculator", "Home Affordability Calculator", "Real Estate Tools"),
    ("real-estate", "property-tax-calculator", "Property Tax Calculator", "Real Estate Tools"),
    # Environment tools
    ("environment", "carbon-footprint-calculator", "Carbon Footprint Calculator", "Environment Tools"),
    ("environment", "ev-carbon-offset", "EV Carbon Offset Calculator", "Environment Tools"),
    ("environment", "flight-carbon-calculator", "Flight Carbon Calculator", "Environment Tools"),
    ("environment", "home-energy-audit", "Home Energy Audit", "Environment Tools"),
    ("environment", "solar-savings-calculator", "Solar Savings Calculator", "Environment Tools"),
    ("environment", "waste-reduction-planner", "Waste Reduction Planner", "Environment Tools"),
    # Legal tools
    ("legal-tools", "cease-and-desist-generator", "Cease and Desist Generator", "Legal Tools"),
    ("legal-tools", "employment-contract-generator", "Employment Contract Generator", "Legal Tools"),
    ("legal-tools", "lease-agreement-generator", "Lease Agreement Generator", "Legal Tools"),
    ("legal-tools", "nda-generator", "NDA Generator", "Legal Tools"),
    ("legal-tools", "power-of-attorney-generator", "Power of Attorney Generator", "Legal Tools"),
    ("legal-tools", "privacy-policy-generator", "Privacy Policy Generator", "Legal Tools"),
    ("legal-tools", "terms-of-service-generator", "Terms of Service Generator", "Legal Tools"),
    ("legal-tools", "will-generator", "Will Generator", "Legal Tools"),
]

def add_breadcrumb_schema(filepath, category_path, slug, tool_name, category_name):
    """Add BreadcrumbList JSON-LD to a page that already has FAQPage JSON-LD."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"NOT FOUND: {filepath}")
        return False

    if 'BreadcrumbList' in content:
        print(f"SKIP (already has breadcrumb): {slug}")
        return False

    if '@context' not in content and 'jsonLd' not in content:
        print(f"SKIP (no existing schema): {slug}")
        return False

    canonical = f"https://roughtools.com/tools/{category_path}/{slug}"
    category_url = f"https://roughtools.com/tools/{category_path}"

    breadcrumb_schema = f"""{{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' }},
      {{ '@type': 'ListItem', position: 2, name: '{category_name}', item: '{category_url}' }},
      {{ '@type': 'ListItem', position: 3, name: '{tool_name}', item: '{canonical}' }},
    ],
  }}"""

    webapp_schema = f"""{{
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '{tool_name}',
    url: '{canonical}',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {{ '@type': 'Offer', price: '0', priceCurrency: 'USD' }},
    description: 'Free online {tool_name.lower()} tool by RoughTools.',
  }}"""

    # Find the jsonLd variable definition and replace it with an array
    # Pattern: const jsonLd = { '@context': ...
    # We'll add a breadcrumb const alongside it

    # Strategy: find the first JSON-LD script tag line and add before it
    script_pattern = re.search(
        r'(<script type="application/ld\+json"[^>]*>\s*\{__html: JSON\.stringify\()(jsonLd)(\)\}\s*/?>)',
        content
    )

    if not script_pattern:
        # Try alternative pattern
        script_pattern2 = re.search(
            r'<script type="application/ld\+json"',
            content
        )
        if not script_pattern2:
            print(f"SKIP (no script tag): {slug}")
            return False

    # Find "const jsonLd = {" and add breadcrumb + webapp schemas before it,
    # then modify the render to include all three
    jsonld_const_match = re.search(r'(\s+const jsonLd = \{)', content)
    if not jsonld_const_match:
        print(f"SKIP (no const jsonLd): {slug}")
        return False

    # Insert breadcrumb and webapp consts before jsonLd
    insert_pos = jsonld_const_match.start()
    insert_text = (
        f"\n  const breadcrumbLd = {breadcrumb_schema}\n"
        f"\n  const webappLd = {webapp_schema}\n"
    )
    new_content = content[:insert_pos] + insert_text + content[insert_pos:]

    # Now update the script rendering - change single script to multiple
    # Find: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    # Replace with array of three scripts
    old_script = r'<script type="application/ld\+json" dangerouslySetInnerHTML=\{\{ __html: JSON\.stringify\(jsonLd\) \}\} />'
    new_scripts = (
        '<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />\n'
        '      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />\n'
        '      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />'
    )
    new_content = re.sub(old_script, new_scripts, new_content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"FIXED: {slug}")
    return True

fixed = 0
for cat_path, slug, tool_name, cat_name in tool_pages:
    path = os.path.join(BASE, cat_path, slug, "page.tsx")
    if add_breadcrumb_schema(path, cat_path, slug, tool_name, cat_name):
        fixed += 1

print(f"\n=== Summary ===")
print(f"Fixed: {fixed}")
