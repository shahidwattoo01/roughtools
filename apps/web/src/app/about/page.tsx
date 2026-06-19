import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About RoughTools</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              RoughTools is dedicated to providing free, high-quality online tools powered by modern
              web technologies. We believe that everyone should have access to powerful tools that
              can help them in their daily lives, work, and personal projects.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-gray-700 mb-4">
              Our platform features 611+ free tools across multiple categories:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>
                <strong>PDF Tools:</strong> Convert, compress, merge, split, and edit PDFs
              </li>
              <li>
                <strong>Calculators:</strong> Financial, health, and mathematical calculators
              </li>
              <li>
                <strong>Developer Tools:</strong> JSON formatters, encoders, regex testers, and more
              </li>
              <li>
                <strong>Text Tools:</strong> Word counters, case converters, grammar checkers
              </li>
              <li>
                <strong>Image Tools:</strong> Background remover, compressor, resizer, and more
              </li>
              <li>
                <strong>Unit Converters:</strong> Length, weight, temperature, and more
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Providing accurate and reliable tools</li>
              <li>Maintaining user privacy and data security</li>
              <li>Continuous improvement and addition of new tools</li>
              <li>Offering all core tools completely free of charge</li>
              <li>Ensuring our platform works seamlessly across all devices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technology</h2>
            <p className="text-gray-700 mb-4">
              Built with Next.js, React, and TypeScript, RoughTools delivers fast, responsive, and
              secure user experiences. All tools run in your browser — your files never leave your
              device.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Involved</h2>
            <p className="text-gray-700 mb-4">
              We welcome feedback and suggestions. If you have ideas for new tools or improvements
              to existing ones, please{' '}
              <Link href="/contact" className="text-blue-600 hover:text-blue-800">
                contact us
              </Link>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              While we strive for accuracy, our tools provide estimates and should not be used as a
              substitute for professional advice. Always consult qualified professionals for
              important decisions.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
