import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookies Policy',
  description: 'Calc_Craft Cookies Policy - Learn how we use cookies to enhance your experience with our free online calculators.',
}

export default function CookiesPolicy() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-700 mb-4 shadow-sm">
            Legal
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
            Cookies Policy
          </h1>
          <p className="text-sm text-slate-400">
            Last updated: June 3, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. What Are Cookies</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Cookies are small text files that are stored on your device when you visit a website. 
              They help websites remember your preferences and improve your browsing experience.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. How We Use Cookies</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Calc_Craft uses cookies for the following purposes:
            </p>
            <ul className="space-y-2 text-sm text-slate-500 leading-relaxed list-disc list-inside">
              <li><strong className="text-slate-700">Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong className="text-slate-700">Analytics Cookies:</strong> Help us understand how visitors interact with our calculators</li>
              <li><strong className="text-slate-700">Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong className="text-slate-700">Performance Cookies:</strong> Improve website speed and performance</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Types of Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500 border border-slate-200 rounded-lg">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 border-b border-slate-200">Cookie Type</th>
                    <th className="px-4 py-3 border-b border-slate-200">Purpose</th>
                    <th className="px-4 py-3 border-b border-slate-200">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-700">Session</td>
                    <td className="px-4 py-3">Maintain your session while using the site</td>
                    <td className="px-4 py-3">Browser session</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-700">Preferences</td>
                    <td className="px-4 py-3">Remember your calculator settings</td>
                    <td className="px-4 py-3">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-700">Analytics</td>
                    <td className="px-4 py-3">Track anonymous usage statistics</td>
                    <td className="px-4 py-3">2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Managing Cookies</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              You can control and manage cookies in your browser settings. Most browsers allow you to:
            </p>
            <ul className="space-y-2 text-sm text-slate-500 leading-relaxed list-disc list-inside">
              <li>View and delete stored cookies</li>
              <li>Block third-party cookies</li>
              <li>Receive notifications when cookies are set</li>
              <li>Clear all cookies when closing the browser</li>
            </ul>
            <p className="text-sm text-slate-500 leading-relaxed mt-4">
              Please note that disabling cookies may affect the functionality of Calc_Craft.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Third-Party Cookies</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              We may use third-party services (such as analytics providers) that set their own cookies. 
              These cookies are subject to the respective third-party privacy policies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. Updates to This Policy</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              We may update this Cookies Policy from time to time. Any changes will be posted on this page 
              with an updated revision date.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">7. Contact Us</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              If you have any questions about our Cookies Policy, please contact us at{' '}
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
