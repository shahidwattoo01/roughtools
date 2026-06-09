import type { Metadata } from 'next'
import Link from 'next/link'
import SqlFormatterClient from './SqlFormatterClient'

export const metadata: Metadata = {
  title: 'SQL Formatter — Beautify & Format SQL Queries Online | RoughTools',
  description: 'Format and beautify SQL queries for better readability. Supports SELECT, INSERT, UPDATE, DELETE, CREATE TABLE and more. Free, private, no upload required.',
  keywords: ['sql formatter', 'sql beautifier', 'format sql online', 'sql pretty print', 'sql query formatter'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/sql-formatter' },
  openGraph: {
    title: `SQL Formatter — Format & Beautify SQL Queries | RoughTools`,
    description: `Format and beautify SQL queries online with proper indentation and keyword casing. Free online SQL formatter tool.`,
    url: 'https://roughtools.com/tools/developer/sql-formatter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `SQL Formatter — Format & Beautify SQL Queries | RoughTools`,
    description: `Format and beautify SQL queries online with proper indentation and keyword casing. Free online SQL formatter tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this SQL formatter free to use?', a: 'Yes, the RoughTools SQL Formatter is completely free with no account, subscription, or payment required. You can format unlimited SQL queries and statements at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no usage limits, no query length restrictions beyond browser memory, and no registration required.' },
  { q: 'Do I need to sign up to format SQL queries?', a: 'No account, email, or registration is required. Paste your SQL and click Format — the beautified query appears instantly. There is no login wall, no paywall on any SQL feature, and no data stored about the queries you format. The tool is entirely anonymous — your SQL, table names, and column names are never transmitted or retained.' },
  { q: 'Is my SQL query sent to a server for formatting?', a: 'No. All SQL formatting runs entirely within your browser using a client-side JavaScript SQL parser. Your queries — which may contain internal table names, business logic, sensitive schema information, or production database structures — never leave your device. This is important for developers who cannot share schema details externally. Once you close the tab, all data is gone.' },
  { q: 'Does the SQL formatter work on mobile and tablet?', a: 'Yes, the formatter is fully responsive and works on all modern smartphones and tablets. The input and output SQL panels are optimised for mobile screens. This is useful when reviewing query performance in a database console on your phone, checking SQL in a code review notification, or formatting a query snippet received via message while away from your desktop.' },
  { q: 'Which browsers support this SQL formatter?', a: 'The SQL Formatter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. No plugins or extensions are required. The formatter uses a client-side SQL parser implemented in JavaScript, available in all current browsers. For large queries with many joins and subqueries, Chrome and Firefox provide the best performance.' },
  { q: 'What SQL dialects and statements does this formatter support?', a: 'The formatter supports standard SQL syntax used across most relational databases: SELECT with JOINs, WHERE, GROUP BY, HAVING, ORDER BY, and LIMIT. INSERT, UPDATE, and DELETE statements. CREATE TABLE and ALTER TABLE. CTEs (WITH clauses). Subqueries and nested SELECT statements. It is largely dialect-neutral and works with MySQL, PostgreSQL, SQLite, SQL Server (T-SQL), and Oracle SQL for standard ANSI SQL constructs. Highly database-specific syntax is formatted as best-effort.' },
  { q: 'Can I use the SQL formatter without an internet connection?', a: 'Once the page has fully loaded, all formatting runs in JavaScript without requiring an active internet connection. You can paste and format SQL queries offline after the initial page load. This is useful when reviewing database migrations on disconnected environments, working on SQL scripts during travel, or formatting queries in a network-restricted development environment.' },
  { q: 'How do I format a SQL query step by step?', a: 'To format SQL: (1) Paste your SQL — whether a minified one-liner, a complex multi-join query, or a schema definition — into the input area. (2) Click "Format" to apply keyword capitalisation, consistent indentation, and line breaks at clause boundaries (FROM, WHERE, JOIN, GROUP BY, etc.). (3) The formatted query appears in the output panel. (4) Click "Copy" to copy to clipboard. (5) Paste into your database client, code file, or documentation.' },
  { q: 'Why should I use RoughTools instead of database IDE formatters?', a: 'Database-specific clients (pgAdmin, MySQL Workbench, SSMS) have built-in SQL formatters but require an active database connection or a full installation. RoughTools SQL Formatter works without any database connection, any installed software, or any configuration. It is ideal for formatting SQL in code reviews, Confluence documentation, blog posts, or when you only have a browser available and need quick readable output.' },
  { q: 'How do I report a bug or request a new SQL feature?', a: 'To report a bug or request a feature — such as dialect-specific formatting (MySQL vs PostgreSQL), SQL minification, keyword case toggle (upper vs lower), configurable indent size, or stored procedure formatting — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the SQL snippet that formatted incorrectly (sanitised), the browser and OS, and what you expected.' },
  { q: 'What does SQL formatting change in my query?', a: 'SQL formatting applies several transformations for readability: keyword capitalisation — SELECT, FROM, WHERE, JOIN, ON become uppercase for visual distinction from identifiers. Consistent indentation — subqueries, JOIN conditions, and WHERE clauses are indented to show logical hierarchy. Line breaks — each major clause starts on a new line. Column lists — one column per line when selecting multiple columns. Comma placement — commas at the end or start of lines depending on convention. The query logic and semantics are never changed — only whitespace presentation.' },
  { q: 'What is the difference between a SQL formatter and a SQL linter?', a: 'A SQL formatter (like this tool) only changes whitespace and formatting — keyword capitalisation, indentation, line breaks — without modifying the query logic. A SQL linter checks for stylistic inconsistencies, potential bugs, or anti-patterns: unused columns, implicit type conversions, cartesian joins, use of SELECT *, missing WHERE clauses on UPDATE/DELETE, or deprecated syntax. Formatters improve readability; linters improve correctness and maintainability. For SQL linting in production codebases, tools like SQLFluff (Python, open source) provide dialect-aware linting rules.' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'SQL Formatter', item: 'https://roughtools.com/tools/developer/sql-formatter' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SQL Formatter',
    url: 'https://roughtools.com/tools/developer/sql-formatter',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online sql formatter tool by RoughTools.',
  }

  const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/developer" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Developer Tools
          </Link>
          <span className="text-gray-700">|</span>
          <h1 className="font-bold text-white text-sm">SQL Formatter</h1>
          <span className="ml-auto text-xs bg-teal-900/50 text-teal-400 border border-teal-800 px-2 py-0.5 rounded-full">🗃️ Keyword · Indent · Clause</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-teal-900/60 to-emerald-900/60 border-b border-teal-800/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['SELECT', 'JOIN', 'WHERE', 'CREATE TABLE', 'CTEs', 'Private', 'Free'].map(b => (
              <span key={b} className="text-xs bg-teal-900/50 text-teal-300 border border-teal-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">SQL Formatter & Beautifier</h2>
          <p className="text-teal-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">Format and beautify SQL queries instantly in your browser — no upload, no server, no database connection required. Applies keyword capitalisation, consistent indentation, and logical line breaks at each clause boundary to transform unreadable one-liners into clearly structured, reviewable queries. Supports SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, CTEs, and complex multi-JOIN queries. All processing is client-side — your table names, schema, and business logic never leave your device.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-teal-900/20 rounded-2xl p-1"><SqlFormatterClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '🔒', title: 'Private', desc: 'Schema and query logic never leave your browser' }, { icon: '📐', title: 'Structured Output', desc: 'Keywords uppercase, each clause on its own line' }, { icon: '⚡', title: 'Instant', desc: 'Format any query — simple or complex — in milliseconds' }].map(c => (
            <div key={c.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div><div className="font-bold text-white text-xs mb-1">{c.title}</div><div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
        <section><h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">{FAQS.map((faq, i) => (
            <details key={i} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <h3 className="text-sm font-semibold text-white text-left pr-4">{faq.q}</h3>
                <span className="text-teal-400 font-bold text-lg flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800">{faq.a}</div>
            </details>
          ))}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Related Developer Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[{ href: '/tools/developer/json-formatter', label: '{ } JSON Formatter' }, { href: '/tools/developer/xml-formatter', label: '📋 XML Formatter' }, { href: '/tools/developer/yaml-validator', label: '📄 YAML Validator' }, { href: '/tools/developer/diff-checker', label: '↔️ Diff Checker' }, { href: '/tools/developer/js-beautifier', label: '✨ JS Beautifier' }].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-teal-500 hover:text-teal-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
