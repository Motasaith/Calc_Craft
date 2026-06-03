import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Calc_Craft Privacy Policy - Learn how we protect your data and privacy while using our free online calculators.',
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-700 mb-4 shadow-sm">
            Legal
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400">
            Last updated: June 3, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Introduction</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Welcome to Calc_Craft. We respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, store, and safeguard your information when you use our free online calculators.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              By using Calc_Craft, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Information We Collect</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              <strong className="text-slate-700">Calculation Data:</strong> All calculations are performed locally in your browser. 
              We do not collect, store, or transmit your calculation inputs or results to our servers.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              <strong className="text-slate-700">Usage Data:</strong> We may collect anonymous usage statistics such as page views, 
              calculator usage patterns, and device information to improve our services. This data does not identify you personally.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              <strong className="text-slate-700">Newsletter Subscriptions:</strong> If you subscribe to our newsletter, 
              we collect your email address solely for the purpose of sending updates and tips.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. How We Use Your Information</h2>
            <ul className="space-y-2 text-sm text-slate-500 leading-relaxed list-disc list-inside">
              <li>To provide and maintain our calculator services</li>
              <li>To improve and optimize website performance</li>
              <li>To send newsletters and updates (only if subscribed)</li>
              <li>To analyze usage trends and enhance user experience</li>
              <li>To detect and prevent technical issues</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Data Security</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              We implement appropriate security measures to protect your information. However, no method of transmission over 
              the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Third-Party Services</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              We may use third-party analytics services to understand how visitors interact with our website. 
              These services may collect anonymous usage data subject to their own privacy policies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. Cookies</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Calc_Craft uses cookies to enhance your browsing experience. For detailed information about our cookie usage, 
              please refer to our <a href="/cookies" className="text-slate-700 font-semibold hover:underline">Cookies Policy</a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">7. Your Rights</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="space-y-2 text-sm text-slate-500 leading-relaxed list-disc list-inside">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of newsletter communications at any time</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">8. Contact Us</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:support@calc_craft.com" className="text-slate-700 font-semibold hover:underline">
                support@calc_craft.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
