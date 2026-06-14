import type { Metadata } from 'next'
import LegalPage from '@/components/legal/LegalPage'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Cookies Policy - How Home of Calculators Uses Cookies | Home of Calculators',
  description:
    'Learn how Home of Calculators uses cookies and browser storage. Minimal, privacy-respecting, GDPR-compliant. No advertising cookies, no third-party tracking.',
  keywords: [
    'homeofcalculators cookies',
    'cookie policy',
    'browser storage',
    'localStorage',
    'GDPR cookies',
    'privacy-respecting analytics',
  ],
  openGraph: {
    title: 'Cookies Policy | Home of Calculators',
    description: 'Minimal, privacy-respecting cookie usage; no advertising, no third-party tracking.',
    type: 'article',
  },
  alternates: { canonical: 'https://homeofcalculators.com/cookies' },
}

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" role="main" aria-label="Cookies Policy" className="min-h-screen bg-white">
        <LegalPage
          title="Cookies Policy"
          subtitle="A minimal, honest list of everything Home of Calculators stores in your browser."
          badge="Cookies"
          icon="cookie"
          lastUpdated="June 5, 2026"
          contactEmail="privacy@homeofcalculators.com"
          intro="Most websites bury their cookie usage in legal jargon. We won't. Here's the complete list of what Home of Calculators stores on your device, why, and how to control it, in plain English."
          sections={[
        {
          heading: '1. What Are Cookies?',
          body: (
            <p>
              Cookies are small text files that websites ask your browser to store. They are sent back to the website on subsequent visits. Browsers also offer other local-storage mechanisms (like <code>localStorage</code> and <code>sessionStorage</code>) that serve a similar purpose. This policy covers all of these.
            </p>
          ),
        },
        {
          heading: '2. The Short Version',
          body: (
            <>
              <p>Home of Calculators uses cookies and browser storage for <strong>only three things</strong>:</p>
              <ul>
                <li>Saving your custom-built calculators and builder drafts (so they don't disappear when you close the tab)</li>
                <li>Anonymous, aggregated analytics (counting page views, with no individual tracking)</li>
                <li>Standard browser session management</li>
              </ul>
              <p>
                <strong>We do not</strong> use advertising cookies. We do not sell data. We do not let third parties set cross-site tracking cookies. We do not use Google Analytics, Facebook Pixel, or any equivalent surveillance technology.
              </p>
            </>
          ),
        },
        {
          heading: '3. Detailed Cookie & Storage Inventory',
          body: (
            <>
              <p>Here is every cookie and storage entry Home of Calculators uses:</p>
              <div className="overflow-x-auto -mx-2 my-4">
                <table className="w-full text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-neutral-200">
                      <th className="text-left py-2 px-2 font-bold text-dark-800">Name</th>
                      <th className="text-left py-2 px-2 font-bold text-dark-800">Type</th>
                      <th className="text-left py-2 px-2 font-bold text-dark-800">Purpose</th>
                      <th className="text-left py-2 px-2 font-bold text-dark-800">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-dark-600">
                    <tr className="border-b border-neutral-100">
                      <td className="py-2 px-2 font-mono text-[11px]">calc_craft_builder_draft</td>
                      <td className="py-2 px-2">localStorage</td>
                      <td className="py-2 px-2">Auto-saves your in-progress calculator while you build it</td>
                      <td className="py-2 px-2 whitespace-nowrap">Until you save or clear it</td>
                    </tr>
                    <tr className="border-b border-neutral-100">
                      <td className="py-2 px-2 font-mono text-[11px]">my_custom_calculators</td>
                      <td className="py-2 px-2">localStorage</td>
                      <td className="py-2 px-2">Stores calculators you've built and saved to your library</td>
                      <td className="py-2 px-2 whitespace-nowrap">Until you clear it</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-mono text-[11px]">plausible.io cookies</td>
                      <td className="py-2 px-2">Cookie (none set)</td>
                      <td className="py-2 px-2">Plausible Analytics does not use cookies; counts page views anonymously</td>
                      <td className="py-2 px-2 whitespace-nowrap">N/A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                That's the complete list. Two localStorage entries for our app functionality, and one analytics service that doesn't actually set cookies.
              </p>
            </>
          ),
        },
        {
          heading: '4. Why We Don\'t Use Advertising Cookies',
          body: (
            <>
              <p>
                Most "free" websites make money by showing you ads, and ad networks use cookies to track you across the web. Home of Calculators doesn't take that approach. The Service is funded by us because we believe everyone deserves access to accurate calculation tools without surveillance.
              </p>
              <p>
                This means no retargeting ads following you around the internet, no "personalized" ad targeting, and no sharing of your browsing data with advertising partners. It's a deliberate trade-off: a smaller business model in exchange for a more respectful user experience.
              </p>
            </>
          ),
        },
        {
          heading: '5. Third-Party Services That May Set Cookies',
          body: (
            <>
              <p>Home of Calculators itself sets only the entries listed above. However, we use a small number of third-party services that may set their own cookies when you interact with them:</p>
              <ul>
                <li>
                  <strong>Embedded YouTube/Vimeo videos</strong> (if present on blog posts or tutorials): Sets cookies when you play the video. We always try to use privacy-enhanced embeds where available.
                </li>
                <li>
                  <strong>Newsletter signup forms:</strong> If you click "Subscribe," you may be redirected to a third-party form that sets its own cookies. This is governed by that service's privacy policy.
                </li>
              </ul>
              <p>
                These are exceptions, not the rule. The vast majority of your interaction with Home of Calculators involves no third-party cookies.
              </p>
            </>
          ),
        },
        {
          heading: '6. How to Control Cookies',
          body: (
            <>
              <p>You have full control over cookies and browser storage. Here are your options:</p>
              <ul>
                <li>
                  <strong>Browser settings:</strong> All modern browsers let you view, block, or delete cookies and clear localStorage. Look under Settings → Privacy or Settings → Site Data.
                </li>
                <li>
                  <strong>Private/Incognito mode:</strong> Cookies and storage set during a private browsing session are automatically deleted when you close the window.
                </li>
                <li>
                  <strong>Do Not Track (DNT):</strong> Home of Calculators honors DNT signals: when DNT is enabled in your browser, we disable all non-essential analytics.
                </li>
                <li>
                  <strong>Per-site controls:</strong> Most browsers let you block specific sites from setting cookies while allowing others. You can use this to block third-party services on homeofcalculators.com while still using our core functionality.
                </li>
              </ul>
              <p>
                <strong>Note:</strong> If you block the storage entries that Home of Calculators uses for app functionality, your custom calculators and builder drafts will not be saved. The site will still work; you just won't have persistence.
              </p>
            </>
          ),
        },
        {
          heading: '7. GDPR, ePrivacy & CCPA Compliance',
          body: (
            <>
              <p>
                Under the GDPR and ePrivacy Directive, cookies and similar tracking technologies require informed consent <strong>unless they are strictly necessary</strong> to provide a service the user has explicitly requested.
              </p>
              <p>
                Our position is that the two localStorage entries we use (your custom calculators and builder drafts) are <strong>strictly necessary</strong> for the Service to function; without them, the visual builder and saved calculators would not work. Therefore, they do not require consent banners.
              </p>
              <p>
                Our privacy-respecting analytics (Plausible) does not use cookies and does not require consent under GDPR.
              </p>
              <p>
                This is why you don't see a "We use cookies!" popup on Home of Calculators, as there are no non-essential cookies to consent to.
              </p>
            </>
          ),
        },
        {
          heading: '8. Changes to This Policy',
          body: (
            <p>
              We may update this Cookies Policy from time to time. Any changes will be reflected in the "Last updated" date at the top of this page. Material changes will be announced with a banner on the Site.
            </p>
          ),
        },
        {
          heading: '9. Contact',
          body: (
            <p>
              Questions about cookies or storage? Email <a href="mailto:privacy@homeofcalculators.com">privacy@homeofcalculators.com</a>.
            </p>
          ),
        },
      ]}
    />
      </main>
      <Footer />
    </>
  )
}
