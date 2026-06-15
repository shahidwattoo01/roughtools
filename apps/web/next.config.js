/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  output: 'standalone',

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'roughtools.com' },
      { protocol: 'https', hostname: '**.roughtools.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    const isProd = process.env.NODE_ENV === 'production'
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://adservice.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google",
            ].join('; '),
          },
        ],
      },
      // Production: long-lived immutable cache (filenames are content-hashed, safe).
      // Development: no-store so webpack.js / main-app.js are never cached;
      //   stale chunks cause the "factory undefined" webpack error on hot reload.
      ...(isProd
        ? [{ source: '/_next/static/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }]
        : [{ source: '/_next/static/chunks/(.*)', headers: [{ key: 'Cache-Control', value: 'no-store' }] }]
      ),
      {
        source: '/tools/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },

  async redirects() {
    const PDF_TOOL_REDIRECTS = [
      'compress-pdf', 'merge-pdf', 'split-pdf',
      'pdf-to-word', 'pdf-to-excel', 'pdf-to-powerpoint',
      'pdf-to-jpg', 'pdf-to-html', 'pdf-to-pdfa',
      'word-to-pdf', 'excel-to-pdf', 'powerpoint-to-pdf',
      'jpg-to-pdf', 'html-to-pdf', 'scan-to-pdf',
      'protect-pdf', 'unlock-pdf', 'sign-pdf',
      'rotate-pdf', 'crop-pdf', 'redact-pdf',
      'extract-pdf-pages', 'remove-pdf-pages', 'organize-pdf',
      'compare-pdf', 'ocr-pdf', 'repair-pdf',
      'pdf-converter', 'pdf-editor',
    ];
    // Orphan /security/ pages → canonical /tools/security/ paths
    const SECURITY_TOOL_REDIRECTS = [
      'url-shortener', 'temporary-email', 'file-encryptor',
      'metadata-remover', 'ssl-checker', 'vpn-checker',
      'qr-code-generator', 'password-generator', 'barcode-generator',
    ];

    return [
      { source: '/home', destination: '/', permanent: true },
      // Old (auth) route group URLs → canonical /auth/ paths
      { source: '/signin',  destination: '/auth/signin',  permanent: true },
      { source: '/signup',  destination: '/auth/signup',  permanent: true },
      { source: '/signout', destination: '/auth/signout', permanent: true },
      ...SECURITY_TOOL_REDIRECTS.map(slug => ({
        source: `/security/${slug}`,
        destination: `/tools/security/${slug}`,
        permanent: true,
      })),
      ...PDF_TOOL_REDIRECTS.map(slug => ({
        source: `/tools/document-tools/${slug}`,
        destination: `/tools/pdf/${slug}`,
        permanent: true,
      })),
    ];
  },

  webpack: (config, { dev, isServer }) => {
    if (isServer) {
      const serverOnlyPkgs = ['pdfjs-dist', 'canvas', 'pdf-parse', 'mammoth', 'docx', 'xlsx', 'jszip', 'pdf-lib', 'pptxgenjs']
      const existingExternals = Array.isArray(config.externals)
        ? config.externals
        : config.externals
        ? [config.externals]
        : []
      config.externals = [
        ...existingExternals,
        ({ request }, callback) => {
          if (request && serverOnlyPkgs.some(pkg => request === pkg || request.startsWith(pkg + '/'))) {
            return callback(null, `commonjs ${request}`)
          }
          callback()
        },
      ]
    }

    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test: (module) => module.size() > 160000,
              name: (module) => {
                const hash = Buffer.from(module.identifier()).toString('hex').slice(0, 8);
                return `lib-${hash}`;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
          },
        },
      };
    }

    return config;
  },

  experimental: {
    // ── Turbopack-specific module resolution rules ─────────────
    // These mirror what webpack resolves so switching --turbo is seamless.
    turbo: {
      resolveAlias: {
        // keep canvas as server-only (same as webpack externals below)
        canvas: './empty-module.js',
      },
      rules: {
        // Turbopack tree-shakes these the same way optimizePackageImports
        // does for webpack — no separate list needed here; handled below.
      },
    },

    // ── Barrel-export tree-shaking ─────────────────────────────
    // Tell Next.js which barrel-export packages to tree-shake.
    // Without this, Next.js must parse ALL exports (e.g. all 5 000+
    // @tabler icons) on every page — the single biggest dev-mode culprit.
    optimizePackageImports: [
      '@workspace/ui',
      'lucide-react',
      '@tabler/icons-react',        // 5 000+ icons — critical
      'recharts',                    // large chart lib
      '@tanstack/react-table',
      '@tanstack/react-virtual',
      'date-fns',
    ],

    // ── Server-only heavy packages ─────────────────────────────
    // Pre-bundle so each cold-start doesn't re-parse them.
    serverComponentsExternalPackages: [
      'pdfjs-dist', 'canvas', 'pdf-parse',
      'mammoth', 'docx', 'xlsx', 'jszip',
      'pdf-lib', 'pptxgenjs', 'fabric',
    ],

    // ── Webpack fallback (when not using --turbo) ──────────────
    // Runs webpack in a separate worker thread — keeps the main
    // Next.js process responsive during compilation.
    webpackBuildWorker: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

module.exports = nextConfig;
