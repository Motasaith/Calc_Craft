import type { Metadata } from 'next'
import LegalPage from '@/components/legal/LegalPage'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Legal pages are fully static — prerendered at build time for SEO.
export const dynamic = 'force-static'
export const revalidate = false

export const metadata: Metadata = {
  title: 'Privacy Policy - How Home of Calculators Protects Your Data | Home of Calculators',
  description:
    'Read the Home of Calculators Privacy Policy. Learn how we protect your calculation data, what we collect (and don\'t), your GDPR and CCPA rights, and our zero-tracking approach.',
  keywords: [
    'homeofcalculators privacy policy',
    'calculator privacy',
    'GDPR',
    'CCPA',
    'data protection',
    'no tracking calculator',
    'browser calculations privacy',
  ],
  openGraph: {
    title: 'Privacy Policy | Home of Calculators',
    description: 'How Home of Calculators protects your data with browser-only calculations and zero server storage.',
    type: 'article',
  },
  alternates: { canonical: 'https://homeofcalculators.com/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" role="main" aria-label="Privacy Policy" className="min-h-screen bg-white">
        <LegalPage
          title="Privacy Policy"
          subtitle="How Home of Calculators protects your data and respects your privacy."
          badge="Privacy"
          icon="shield"
          lastUpdated="June 5, 2026"
          contactEmail="privacy@homeofcalculators.com"
          intro="Home of Calculators is built on a zero-server-storage principle: every calculation you perform runs entirely in your browser, and we never see or store your inputs. This Privacy Policy explains exactly what data we do and don't collect, how we use it, and the rights you have over your information under GDPR, CCPA, and other major privacy frameworks."
          sections={[
        {
          heading: 'Our Privacy-First Philosophy',
          body: (
            <>
              <p>
                Most "free" online calculators quietly harvest your inputs and ship them to analytics servers, advertising networks, or third-party data brokers. <strong>Home of Calculators was designed from day one to be different.</strong>
              </p>
              <p>
                Every one of our 190 calculators (and every calculator you build with our visual builder) executes entirely in your web browser using client-side JavaScript. Your inputs never leave your device. Your results never touch a server. We don't have logs to comb through, breaches to disclose, or databases to leak, because <strong>the data never existed on our infrastructure in the first place</strong>.
              </p>
              <p>
                This isn't marketing; it's a fundamental architectural choice. The Home of Calculators calculation engine is bundled into the JavaScript that your browser downloads, then runs locally. We use a BigNumber-precision math library (mathjs) so your calculations are accurate to 128 digits without ever contacting a remote math service.
              </p>
            </>
          ),
        },
        {
          heading: 'What We Do NOT Collect',
          body: (
            <>
              <p>Let us be explicit. We do <strong>not</strong> collect:</p>
              <ul>
                <li>The numbers, formulas, or values you enter into any calculator</li>
                <li>The results, outputs, or intermediate values produced by any calculation</li>
                <li>The configurations, formulas, or field values of calculators you build with the visual builder</li>
                <li>Your financial, health, or any other personal data you process through our tools</li>
                <li>Biometric, genetic, or any special-category data under GDPR Article 9</li>
                <li>Financial account numbers, credit card information, or payment data (we have no paid features)</li>
                <li>Location data, IP addresses, or device fingerprints for advertising purposes</li>
              </ul>
              <p>
                <strong>Custom calculators you build</strong> are stored in your browser's localStorage (a sandboxed key-value store on your device). They are never uploaded to our servers. If you clear your browser data, your custom calculators will be lost, which is why we provide a JSON export feature.
              </p>
            </>
          ),
        },
        {
          heading: 'What We Do Collect (And Why)',
          body: (
            <>
              <p>We collect a minimal amount of anonymous usage data, aggregated in a way that cannot identify you personally. This data helps us understand which calculators are useful, where to invest engineering time, and how to improve the user experience.</p>
              <p>The data we collect falls into these categories:</p>
              <ul>
                <li>
                  <strong>Aggregated page-view counts:</strong> We use privacy-respecting analytics (Plausible or a self-hosted equivalent) to count how many people visit each calculator page. These counts are aggregated: we don't track individual sessions, we don't set cross-site identifiers, and we don't build user profiles.
                </li>
                <li>
                  <strong>Aggregate calculator usage:</strong> We may count, in aggregate, how many times each calculator type is used per day. We do not see the actual values.
                </li>
                <li>
                  <strong>Server logs (standard):</strong> Like every website, our hosting provider's servers generate standard access logs (timestamp, request path, HTTP status code) for operational and security purposes. These logs are retained for 30 days and contain no personal data.
                </li>
                <li>
                  <strong>Newsletter email (optional):</strong> If you voluntarily subscribe to our newsletter, we store your email address to send you updates. You can unsubscribe with one click in any email.
                </li>
                <li>
                  <strong>Contact form submissions (optional):</strong> If you contact us through our form, we receive the message and the email address you provide. We use this only to respond to you.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Cookies & Local Storage',
          body: (
            <>
              <p>
                Home of Calculators uses a minimal set of cookies and browser storage. For complete details, see our <a href="/cookies">Cookies Policy</a>. In summary:
              </p>
              <ul>
                <li><strong>Strictly necessary localStorage:</strong> Stores your custom-built calculators and builder drafts. Essential to the service.</li>
                <li><strong>No advertising cookies:</strong> We do not use Google Ads, Facebook Pixel, or any advertising trackers.</li>
                <li><strong>No cross-site tracking:</strong> We do not share data with third parties for cross-site behavioral advertising.</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'GDPR Rights (European Economic Area)',
          body: (
            <>
              <p>If you are in the EEA, UK, or Switzerland, you have the following rights under the General Data Protection Regulation:</p>
              <ul>
                <li><strong>Right of access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Right to rectification:</strong> Correct inaccurate personal data</li>
                <li><strong>Right to erasure ("right to be forgotten"):</strong> Request deletion of your data</li>
                <li><strong>Right to restrict processing:</strong> Limit how we use your data</li>
                <li><strong>Right to data portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Right to object:</strong> Object to certain types of processing</li>
                <li><strong>Right to withdraw consent:</strong> Withdraw consent at any time where processing is based on consent</li>
                <li><strong>Right to lodge a complaint:</strong> Lodge a complaint with your local data protection authority</li>
              </ul>
              <p>
                Because we don't collect most categories of data, most of these rights are moot: there's nothing to access, port, or delete. For the limited data we do hold (newsletter email, contact submissions), email <a href="mailto:privacy@homeofcalculators.com">privacy@homeofcalculators.com</a> and we will respond within 30 days.
              </p>
            </>
          ),
        },
        {
          heading: 'CCPA Rights (California)',
          body: (
            <>
              <p>If you are a California resident, the California Consumer Privacy Act (CCPA) gives you the right to:</p>
              <ul>
                <li>Know what personal information we collect, use, share, or sell (we don't sell any)</li>
                <li>Delete personal information we have collected</li>
                <li>Opt out of the sale of personal information (N/A, we don't sell)</li>
                <li>Non-discrimination for exercising your CCPA rights</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Children\'s Privacy (COPPA)',
          body: (
            <p>
              Home of Calculators is designed to be safe for all ages, including children. We do not knowingly collect personal information from children under 13. Because calculations happen in the browser, no child-entered data is transmitted to our servers. If you believe we have inadvertently collected information from a child, please contact us so we can promptly address it.
            </p>
          ),
        },
        {
          heading: 'Data Security',
          body: (
            <>
              <p>
                Our entire site is served over HTTPS with TLS 1.3 encryption. We use modern security headers (HSTS, X-Frame-Options, Content-Security-Policy) to defend against common attacks. We engage in regular security reviews and keep dependencies updated.
              </p>
              <p>
                However, no system is 100% secure. If you discover a security vulnerability, please report it responsibly to <a href="mailto:security@homeofcalculators.com">security@homeofcalculators.com</a>.
              </p>
            </>
          ),
        },
        {
          heading: 'Third-Party Services We Use',
          body: (
            <>
              <p>We use a small set of carefully chosen third-party services, each governed by its own privacy policy:</p>
              <ul>
                <li><strong>Hosting & CDN:</strong> Vercel / Netlify / Cloudflare (or similar), which serves our static site at the edge</li>
                <li><strong>Privacy-respecting analytics:</strong> Plausible Analytics or self-hosted (no cookies, no personal data, GDPR-compliant out of the box)</li>
                <li><strong>Email service:</strong> For newsletter delivery and contact form responses</li>
                <li><strong>DNS provider:</strong> Standard DNS resolution</li>
              </ul>
              <p>We do not use Google Analytics, Facebook Pixel, or any advertising/tracking services.</p>
            </>
          ),
        },
        {
          heading: 'International Data Transfers',
          body: (
            <p>
              Home of Calculators is a global service. Our hosting and analytics providers may process aggregated, non-personal technical data in data centers around the world. Because the data we collect is anonymous and aggregated, no personal information crosses borders.
            </p>
          ),
        },
        {
          heading: 'Changes to This Policy',
          body: (
            <p>
              We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page reflects when the most recent changes were made. Material changes will be announced via a banner on the site for at least 30 days. Your continued use of Home of Calculators after changes take effect constitutes acceptance of the updated policy.
            </p>
          ),
        },
        {
          heading: 'Contact Our Privacy Team',
          body: (
            <p>
              For any privacy-related questions, data requests, or concerns, contact our Data Protection Officer at <a href="mailto:privacy@homeofcalculators.com">privacy@homeofcalculators.com</a>. We respond to all legitimate requests within 30 days.
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
