#!/usr/bin/env python3
"""
Add BreadcrumbList JSON-LD to pages using <JsonLd data={[...]} /> pattern.
"""
import os
import re

BASE = "C:/Users/shahid/ai-tools-platform/apps/web/src/app/tools"

# Pages using JsonLd component that need BreadcrumbList added
tool_pages = [
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
    # Developer tools - those using JsonLd pattern
    ("developer", "uuid-generator", "UUID Generator", "Developer Tools"),
    ("developer", "timestamp-converter", "Timestamp Converter", "Developer Tools"),
    ("developer", "url-encoder", "URL Encoder", "Developer Tools"),
    ("developer", "xml-formatter", "XML Formatter", "Developer Tools"),
    ("developer", "yaml-validator", "YAML Validator", "Developer Tools"),
]

def add_breadcrumb_jsonld(filepath, category_path, slug, tool_name, category_name):
    """Add BreadcrumbList to a page using <JsonLd data={...} /> pattern."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"NOT FOUND: {filepath}")
        return False

    if 'BreadcrumbList' in content:
        print(f"SKIP (already has breadcrumb): {slug}")
        return False

    canonical = f"https://roughtools.com/tools/{category_path}/{slug}"
    category_url = f"https://roughtools.com/tools/{category_path}"

    breadcrumb_const = (
        f"\nconst breadcrumbLd = {{\n"
        f"  '@context': 'https://schema.org',\n"
        f"  '@type': 'BreadcrumbList',\n"
        f"  itemListElement: [\n"
        f"    {{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' }},\n"
        f"    {{ '@type': 'ListItem', position: 2, name: '{category_name}', item: '{category_url}' }},\n"
        f"    {{ '@type': 'ListItem', position: 3, name: '{tool_name}', item: '{canonical}' }},\n"
        f"  ],\n"
        f"}}\n"
    )

    # Pattern 1: <JsonLd data={[jsonLd, faqJsonLd]} />
    # Find and update to include breadcrumbLd
    pattern1 = re.search(r'<JsonLd data=\{\[([^\]]+)\]\} />', content)
    if pattern1:
        schemas_str = pattern1.group(1)
        if 'breadcrumbLd' not in schemas_str:
            new_schemas = schemas_str.rstrip() + ', breadcrumbLd'
            new_tag = f'<JsonLd data={{[{new_schemas}]}} />'
            new_content = content[:pattern1.start()] + new_tag + content[pattern1.end():]

            # Find where to insert the breadcrumbLd const
            # Insert before "export default function Page"
            export_match = re.search(r'export default function', new_content)
            if export_match:
                new_content = new_content[:export_match.start()] + breadcrumb_const + new_content[export_match.start():]

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"FIXED (JsonLd array): {slug}")
                return True

    # Pattern 2: <JsonLd data={jsonLd} />
    pattern2 = re.search(r'<JsonLd data=\{(\w+)\} />', content)
    if pattern2:
        var_name = pattern2.group(1)
        new_tag = f'<JsonLd data={{[{var_name}, breadcrumbLd]}} />'
        new_content = content[:pattern2.start()] + new_tag + content[pattern2.end():]

        export_match = re.search(r'export default function', new_content)
        if export_match:
            new_content = new_content[:export_match.start()] + breadcrumb_const + new_content[export_match.start():]

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"FIXED (JsonLd single): {slug}")
            return True

    # Pattern 3: these might not have JsonLd at all yet - add it
    if 'JsonLd' not in content and '@context' not in content:
        # Need to add JsonLd import and usage
        # Find existing imports
        import_section = re.search(r'^import.*\n', content, re.MULTILINE)
        if not import_section:
            print(f"SKIP (no imports): {slug}")
            return False

        # Find end of imports
        last_import = None
        for m in re.finditer(r'^import .*\n', content, re.MULTILINE):
            last_import = m
        if not last_import:
            print(f"SKIP (no last import): {slug}")
            return False

        # Insert JsonLd import after last import
        jsonld_import = "import { JsonLd } from '@/components/JsonLd'\n"
        if jsonld_import not in content:
            new_content = content[:last_import.end()] + jsonld_import + content[last_import.end():]
        else:
            new_content = content

        # Add schemas const before export default
        export_match = re.search(r'export default function', new_content)
        if export_match:
            schema_const = (
                breadcrumb_const +
                f"\nconst webappLd = {{\n"
                f"  '@context': 'https://schema.org',\n"
                f"  '@type': 'WebApplication',\n"
                f"  name: '{tool_name}',\n"
                f"  url: '{canonical}',\n"
                f"  applicationCategory: 'UtilitiesApplication',\n"
                f"  operatingSystem: 'Any',\n"
                f"  offers: {{ '@type': 'Offer', price: '0', priceCurrency: 'USD' }},\n"
                f"}}\n"
            )
            new_content = new_content[:export_match.start()] + schema_const + new_content[export_match.start():]

            # Find the return ( and add JsonLd tag
            return_match = re.search(r'return \(\s*\n(\s*)<', new_content)
            if return_match:
                insert_after = return_match.start() + len(return_match.group(0)) - 1
                indent = return_match.group(1)
                jsonld_tag = f"<JsonLd data={{[webappLd, breadcrumbLd]}} />\n{indent}"
                new_content = new_content[:insert_after] + jsonld_tag + new_content[insert_after:]

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"FIXED (added JsonLd): {slug}")
                return True

    print(f"SKIP (pattern not found): {slug}")
    return False

fixed = 0
for cat_path, slug, tool_name, cat_name in tool_pages:
    path = os.path.join(BASE, cat_path, slug, "page.tsx")
    if add_breadcrumb_jsonld(path, cat_path, slug, tool_name, cat_name):
        fixed += 1

print(f"\n=== Summary ===")
print(f"Fixed: {fixed}")
