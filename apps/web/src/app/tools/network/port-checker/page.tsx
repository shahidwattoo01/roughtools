/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import PortCheckerClient from './PortCheckerClient'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Port Checker â€” Common Ports Reference & Port Status Tool | RoughTools',
  description: 'Look up common TCP/UDP port numbers and their services. Reference for well-known ports including HTTP, HTTPS, SSH, FTP, MySQL, PostgreSQL, Redis, and MongoDB. Free.',
  keywords: ['port checker', 'tcp port checker', 'open port checker', 'check if port is open', 'common port numbers', 'port number list', 'well-known ports'],
  alternates: { canonical: 'https://roughtools.com/tools/network/port-checker' },
  openGraph: {
    title: `Port Checker â€” Check if Port is Open | RoughTools`,
    description: `Check if a specific port is open on any server or IP address. Free online port checker and scanner tool.`,
    url: 'https://roughtools.com/tools/network/port-checker',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Port Checker â€” Check if Port is Open | RoughTools`,
    description: `Check if a specific port is open on any server or IP address. Free online port checker and scanner tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Port Checker tool free to use?',
    a: 'Yes, the Port Checker and port reference guide on RoughTools is completely free with no subscription, registration fee, or premium tier. You can search and look up common port numbers, service names, and protocol types at no cost. RoughTools is funded through non-intrusive advertising, keeping every tool on the platform permanently free for network administrators, developers, and security engineers.',
  },
  {
    q: 'Do I need to sign up or create an account to use this tool?',
    a: 'No account or registration is required. Open the Port Checker page, search for a port number or service name, and get instant information about which protocol uses that port. There is no email address, password, or profile needed. RoughTools is designed for professionals who need fast access to technical reference data without any sign-up barrier.',
  },
  {
    q: 'Does this tool store or log what I search?',
    a: 'No. The port reference lookup is powered entirely by a static dataset stored in your browser â€” no search queries are sent to any server, and nothing you look up is logged or stored. The tool works like a local reference guide that runs entirely on your device. Your port searches and network diagnostic activities are completely private.',
  },
  {
    q: 'Does the Port Checker work on mobile phones and tablets?',
    a: 'Yes. The port reference tool is fully responsive and works correctly on smartphones, tablets, and desktop computers. The search input and results table adapt to all screen sizes. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. For command-line port testing instructions displayed by the tool, you will need a terminal application on your device.',
  },
  {
    q: 'Which browsers are supported by this port checker?',
    a: 'The Port Checker works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The tool uses standard HTML and JavaScript that are universally supported. Internet Explorer is not supported, as it reached end-of-life in June 2022 and is no longer suitable for any professional web workflow.',
  },
  {
    q: 'How accurate is the port information in this tool?',
    a: 'The port reference data is based on the IANA (Internet Assigned Numbers Authority) official Service Name and Transport Protocol Port Number Registry, which is the authoritative global registry for port number assignments. Well-known port assignments are standardized and do not change frequently. Port numbers for common services like HTTP (80), HTTPS (443), SSH (22), and MySQL (3306) are highly accurate and stable.',
  },
  {
    q: 'Can I use the Port Checker offline?',
    a: 'Yes. The port reference lookup works offline once the page has loaded, because all port data is included in the page and processed locally in your browser. No internet connection is needed to search for port numbers after the initial load. The command-line examples for testing open ports with netcat or PowerShell are also available offline as they are static text instructions.',
  },
  {
    q: 'How do I look up a port number or check if a port is open? Step-by-step.',
    a: 'Step one: open the Port Checker on this page. Step two: type a port number (like 3306) or a service name (like "mysql") into the search field to look up what service uses that port and whether it uses TCP, UDP, or both. Step three: to actually test if a specific port is open on a server, use the command-line instructions provided â€” on Linux or macOS run nc -zv hostname port, and on Windows run Test-NetConnection -ComputerName hostname -Port port in PowerShell. Step four: review the output to see whether the connection succeeded.',
  },
  {
    q: 'Why use RoughTools Port Checker instead of other websites?',
    a: 'RoughTools provides a searchable, filterable port reference that covers all well-known and registered IANA ports in a fast, offline-capable interface. Unlike many port lookup sites, the tool also includes ready-to-run command-line instructions for actually testing whether a port is open on a specific host using netcat, PowerShell, and telnet. This makes it useful both for quick reference and as a starting point for real network diagnostics.',
  },
  {
    q: 'How do I report a bug or suggest a new feature for this tool?',
    a: 'Use the Contact page on RoughTools to report inaccurate port data, missing ports, or bugs in the search functionality. When reporting an issue, include the port number or service name that caused the problem and what you expected the tool to show. Suggestions for additional services, protocol details, or new diagnostic features are welcome and reviewed by the development team for future updates.',
  },
  {
    q: 'What is a network port and how does it work?',
    a: 'A network port is a 16-bit number (0 to 65535) that identifies a specific service or process running on a host. When a client connects to a server, it specifies both an IP address and a port number. The IP address routes traffic to the correct machine, and the port number routes it to the correct service on that machine. For example, connecting to port 80 reaches the web server, while connecting to port 22 reaches the SSH daemon â€” even though both services share the same IP address.',
  },
  {
    q: 'What is the difference between TCP and UDP ports?',
    a: 'TCP (Transmission Control Protocol) is a connection-oriented protocol that establishes a handshake before sending data and guarantees that packets arrive in order and without corruption. It is used for services where reliability matters â€” HTTP, HTTPS, SSH, FTP, and database connections. UDP (User Datagram Protocol) is connectionless and sends packets without guaranteeing delivery or order â€” it is faster and used where low latency matters more than perfect reliability, such as DNS lookups, video streaming, VoIP, and online games. A single port number can refer to both a TCP and UDP service independently.',
  },
  {
    q: 'What does open, closed, or filtered mean for a port?',
    a: 'An open port means a service is actively listening on that port and will accept incoming connections. A closed port means no service is currently listening, but the host is reachable and the operating system is responding â€” it actively sends a TCP RST packet. A filtered port means a firewall is blocking the connection entirely, so no response is received and the requester must wait for a timeout. Filtered ports are a common source of confusion because the lack of response can look like a slow server rather than a blocked port.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Port Checker & Port Reference',
  url: 'https://roughtools.com/tools/network/port-checker',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Searchable TCP/UDP port reference guide with IANA port assignments and command-line instructions for testing open ports. Free, offline-capable.',
}
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Network Tools', item: 'https://roughtools.com/tools/network' },
    { '@type': 'ListItem', position: 3, name: 'Port Checker', item: 'https://roughtools.com/tools/network/port-checker' },
  ],
}
export default function Page() {
  return (
    <>
      <JsonLd data={[jsonLd, faqJsonLd, breadcrumbLd]} />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px 64px' }}>
        <ToolAdUnit position="top" />
        <nav style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link> â€º{' '}
          <Link href="/tools/network" style={{ color: '#888', textDecoration: 'none' }}>Network Tools</Link> â€º Port Checker
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Port Checker</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Search and look up common TCP/UDP port numbers and their associated services. Based on the IANA official port registry, covering HTTP, HTTPS, SSH, FTP, MySQL, PostgreSQL, Redis, MongoDB, and hundreds more. Includes command-line instructions for testing whether a specific port is open on any host. Free, no account required.
        </p>
        <div data-print-section="calculator">
        <PortCheckerClient />
        </div>
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Port Checker</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            Network ports are numbered communication channels that allow multiple services to run on a single IP address. When you deploy a web application, database, or any network service, it binds to a specific port number. Knowing which ports are assigned to which services is essential for network administration, security audits, firewall configuration, and troubleshooting connectivity issues.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            Because browsers operate in a restricted security sandbox, they cannot make raw TCP connections to test port availability â€” this requires system-level tools like nmap, netcat, or PowerShell&apos;s Test-NetConnection. This reference guide covers all well-known IANA-assigned ports and provides ready-to-run command-line examples for checking port status from your terminal, making it useful for both quick reference and real network diagnostics.
          </p>
        </section>
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Frequently Asked Questions</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ marginBottom: 16, padding: 16, background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--line)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--fg)' }}>{q}</h3>
              <p style={{ fontSize: 14, color: 'var(--fg-2)', margin: 0, lineHeight: 1.7 }}>{a}</p>
            </div>
          ))}
        </section>
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', marginBottom: 16 }}>Related Network Tools</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { name: 'IP Checker', href: '/tools/network/ip-checker', desc: 'Find your public IP address' },
              { name: 'DNS Lookup', href: '/tools/network/dns-lookup', desc: 'Query DNS records' },
              { name: 'WHOIS Lookup', href: '/tools/network/whois-lookup', desc: 'Domain registration info' },
              { name: 'Ping Tool', href: '/tools/network/ping-tool', desc: 'Test website connectivity' },
              { name: 'HTTP Headers Checker', href: '/tools/network/http-headers-checker', desc: 'Inspect HTTP response headers' },
            ].map(t => (
              <a key={t.href} href={t.href} style={{ display: 'block', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--fg)', textDecoration: 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{t.desc}</div>
              </a>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="Port Checker"
          toolSlug="port-checker"
          toolUrl="https://roughtools.com/tools/network/port-checker"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
