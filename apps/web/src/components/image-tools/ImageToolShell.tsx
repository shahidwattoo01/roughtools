import type React from 'react';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import ToolAdUnit from '@/components/ToolAdUnit';
import RelatedToolCard from '@/components/RelatedToolCard';
import { ToolPageExtras } from '@/components/ToolPageExtras';
import ProTipsSection from '@/components/image-tools/ProTipsSection';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ImageToolFAQ {
  q: string;
  a: string;
}
export interface ImageToolStep {
  name: string;
  text: string;
}
export interface ImageToolUseCase {
  title: string;
  description: string;
}
export interface ImageToolSpec {
  label: string;
  value: string;
}
export interface ImageRelatedTool {
  name: string;
  href: string;
  icon: string;
  description: string;
}

export interface ImageToolShellProps {
  // Identity
  toolName: string;
  toolSlug: string;
  description: string;
  icon: string; // emoji

  // Page content
  children: React.ReactNode; // the actual tool widget

  // Structured content
  howToSteps: ImageToolStep[]; // "How to use" numbered steps
  useCases: ImageToolUseCase[]; // "When to use" examples (3–5)
  specs: ImageToolSpec[]; // quick reference table rows
  faqs: ImageToolFAQ[]; // FAQ accordion items — pass all 12 here
  relatedTools: ImageRelatedTool[]; // related tool cards (4–6)

  // Rich content (new — from imageTools.ts)
  aboutHTML?: string; // 400-600 word HTML about section
  proTips?: string[]; // 4 expert tips
  // Optional
  category?: string;
  categoryHref?: string;
  note?: string; // extra note under the tool (optional)
}

// ─── Trust badges ─────────────────────────────────────────────────────────────

const BADGES = [
  { icon: '🔒', label: '100% private — never uploaded' },
  { icon: '⚡', label: 'Instant results' },
  { icon: '🆓', label: 'Always free' },
  { icon: '🚫', label: 'No signup required' },
  { icon: '🖥️', label: 'Runs in your browser' },
];

function TrustBadges() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '16px 0 24px' }}>
      {BADGES.map((b) => (
        <span
          key={b.label}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: 'rgba(236,72,153,0.10)',
            border: '1px solid rgba(236,72,153,0.22)',
            borderRadius: 20,
            padding: '5px 12px',
            fontSize: 12,
            color: '#f9a8d4',
            fontWeight: 500,
          }}
        >
          {b.icon} {b.label}
        </span>
      ))}
    </div>
  );
}

// ─── FAQ accordion (client-side toggle handled with CSS :target trick — no JS) ─

function FAQSection({ faqs }: { faqs: ImageToolFAQ[] }) {
  return (
    <section style={{ marginTop: 48 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg)', marginBottom: 20 }}>
        Frequently Asked Questions
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {faqs.map((faq, i) => (
          <details
            key={i}
            style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--line-strong)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <summary
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--fg)',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {faq.q}
              <span style={{ fontSize: 18, color: '#7c3aed', flexShrink: 0, marginLeft: 12 }}>
                +
              </span>
            </summary>
            <div
              style={{
                padding: '0 20px 16px',
                fontSize: 14,
                color: 'var(--fg-2)',
                lineHeight: 1.7,
              }}
            >
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

// ─── Related tools grid ───────────────────────────────────────────────────────

function RelatedSection({ tools }: { tools: ImageRelatedTool[] }) {
  return (
    <section style={{ marginTop: 48 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg)', marginBottom: 20 }}>
        Related Image Tools
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
          gap: 12,
        }}
      >
        {tools.map((t) => (
          <RelatedToolCard
            key={t.href}
            href={t.href}
            icon={t.icon}
            name={t.name}
            description={t.description}
          />
        ))}
      </div>
    </section>
  );
}

// ─── JSON-LD builder ──────────────────────────────────────────────────────────

function buildJsonLd(props: ImageToolShellProps) {
  const url = `https://roughtools.com/tools/image-tools/${props.toolSlug}`;

  const softwareApp: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: props.toolName,
    url,
    description: props.description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'RoughTools', url: 'https://roughtools.com' },
  };

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${props.toolName}`,
    description: props.description,
    tool: { '@type': 'HowToTool', name: props.toolName },
    step: props.howToSteps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: props.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const category = props.category ?? 'Image Tools';
  const categoryHref = props.categoryHref ?? '/tools/image-tools';

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: category,
        item: `https://roughtools.com${categoryHref}`,
      },
      { '@type': 'ListItem', position: 3, name: props.toolName, item: url },
    ],
  };

  return [softwareApp, howTo, faqPage, breadcrumb];
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function ImageToolShell(props: ImageToolShellProps) {
  const {
    toolName,
    toolSlug,
    description,
    icon,
    children,
    howToSteps,
    useCases,
    specs,
    faqs,
    relatedTools,
    aboutHTML,
    proTips,
    category = 'Image Tools',
    categoryHref = '/tools/image-tools',
  } = props;

  return (
    <>
      <JsonLd data={buildJsonLd(props)} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
        {/* Breadcrumb */}
        <nav
          style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 20 }}
          aria-label="Breadcrumb"
        >
          <Link href="/" style={{ color: 'var(--fg-3)', textDecoration: 'none' }}>
            Home
          </Link>
          {' › '}
          <Link href={categoryHref} style={{ color: 'var(--fg-3)', textDecoration: 'none' }}>
            {category}
          </Link>
          {' › '}
          <span style={{ color: 'var(--fg-2)' }}>{toolName}</span>
        </nav>

        {/* Hero */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            background: 'rgba(236,72,153,0.12)',
            borderRadius: 14,
            padding: '10px 14px',
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          {icon}
        </div>
        <h1
          style={{
            fontSize: 'clamp(22px,4vw,32px)',
            fontWeight: 800,
            color: 'var(--fg)',
            margin: '0 0 10px',
            letterSpacing: '-0.5px',
          }}
        >
          {toolName}
        </h1>
        <p
          style={{
            color: 'var(--fg-2)',
            fontSize: 15,
            lineHeight: 1.7,
            margin: '0 0 4px',
            maxWidth: 680,
          }}
        >
          {description}
        </p>

        {/* Trust badges */}
        <TrustBadges />

        {/* ── Tool widget ── */}
        <div id="tool-widget">{children}</div>

        {/* A1 — between tool and How to Use */}
        <ToolAdUnit position="middle" />

        {/* How to Use */}
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg)', marginBottom: 20 }}>
            How to Use {toolName}
          </h2>
          <ol
            style={{
              paddingLeft: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {howToSteps.map((step, i) => (
              <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'rgba(236,72,153,0.15)',
                    border: '1px solid rgba(236,72,153,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#f9a8d4',
                  }}
                >
                  {i + 1}
                </span>
                <div style={{ paddingTop: 4 }}>
                  <p
                    style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg)', margin: '0 0 3px' }}
                  >
                    {step.name}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6, margin: 0 }}>
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* When to Use */}
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg)', marginBottom: 20 }}>
            When to Use This Tool
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
              gap: 14,
            }}
          >
            {useCases.map((uc, i) => (
              <div
                key={i}
                style={{
                  padding: '18px 20px',
                  background: 'var(--bg-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ec4899', marginBottom: 6 }}>
                  {uc.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
                  {uc.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick reference specs table */}
        {specs.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg)', marginBottom: 20 }}>
              Quick Reference
            </h2>
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--line-strong)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(236,72,153,0.08)' }}>
                    <th
                      style={{
                        padding: '12px 18px',
                        textAlign: 'left',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#ec4899',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Feature
                    </th>
                    <th
                      style={{
                        padding: '12px 18px',
                        textAlign: 'left',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#ec4899',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Detail
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {specs.map((s, i) => (
                    <tr
                      key={i}
                      style={{
                        borderTop: '1px solid var(--line)',
                        background: i % 2 === 0 ? 'transparent' : 'var(--bg-1)',
                      }}
                    >
                      <td
                        style={{
                          padding: '12px 18px',
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--fg)',
                        }}
                      >
                        {s.label}
                      </td>
                      <td style={{ padding: '12px 18px', fontSize: 13, color: 'var(--fg-2)' }}>
                        {s.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* About this tool */}
        {aboutHTML && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg)', marginBottom: 16 }}>
              About {toolName}
            </h2>
            <div
              style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75 }}
              dangerouslySetInnerHTML={{ __html: aboutHTML }}
            />
          </section>
        )}

        {/* Pro Tips */}
        {proTips && proTips.length > 0 && <ProTipsSection toolName={toolName} tips={proTips} />}

        {/* A2 — between content and FAQ */}
        <ToolAdUnit position="bottom" />

        {/* FAQ */}
        <FAQSection faqs={faqs} />

        {/* Related tools */}
        {relatedTools.length > 0 && <RelatedSection tools={relatedTools} />}

        {/* Compliance extras: disclaimer, privacy notice, PDF export, star rating, feedback, social share */}
        <ToolPageExtras
          toolName={toolName}
          toolSlug={toolSlug}
          toolUrl={`https://roughtools.com/tools/image-tools/${toolSlug}`}
          type="general"
          showPDF
        />
      </div>
    </>
  );
}
