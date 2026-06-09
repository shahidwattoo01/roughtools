import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service | RoughTools',
  description: 'Read the Terms of Service for RoughTools. Understand your rights and responsibilities when using our free online tools.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using RoughTools, you accept and agree to be bound by the
              terms and provisions of this agreement. If you do not agree to these terms,
              please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to use our tools for personal and commercial purposes.
              Under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Attempt to decompile or reverse engineer any software contained on RoughTools</li>
              <li>Remove any copyright or other proprietary notations from our materials</li>
              <li>Use automated bots or scrapers to access our services in a way that degrades performance</li>
              <li>Resell or sublicense access to RoughTools as a standalone service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              The tools on this website are provided on an &apos;as is&apos; basis. RoughTools makes
              no warranties, expressed or implied, and hereby disclaims and negates all other
              warranties including without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Limitations</h2>
            <p className="text-gray-700 mb-4">
              In no event shall RoughTools or its suppliers be liable for any damages
              (including, without limitation, damages for loss of data or profit, or due to
              business interruption) arising out of the use or inability to use the tools,
              even if RoughTools has been notified of the possibility of such damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Accuracy of Tools</h2>
            <p className="text-gray-700 mb-4">
              While we strive for accuracy, the results provided by our calculators and tools
              are estimates only. Users should verify results independently and consult
              qualified professionals for important financial, medical, legal, or engineering decisions.
              Medical calculators are for educational purposes only and not a substitute for professional advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              Users are responsible for ensuring that their use of our tools complies with
              applicable laws and regulations. You agree not to use our services for any
              illegal or unauthorized purpose, including but not limited to transmitting harmful,
              offensive, or fraudulent content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy</h2>
            <p className="text-gray-700 mb-4">
              Most tools process data entirely in your browser — your files and inputs never leave your device.
              Where server processing is required (PDF tools, AI-powered tools), data is processed transiently
              and not stored. Please review our{' '}
              <a href="/privacy-policy" className="text-indigo-600 hover:underline">Privacy Policy</a>{' '}
              for full details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend access to our service immediately, without prior
              notice or liability, for any reason whatsoever, including without limitation
              if you breach the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These terms shall be interpreted and governed by applicable law,
              without regard to conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
              <br />
              Email:{' '}
              <a href="mailto:support@roughtools.com" className="text-indigo-600 hover:underline">
                support@roughtools.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
