import type { Metadata } from 'next'
import LegalPage from '@/components/legal/LegalPage'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Legal pages are fully static — prerendered at build time for SEO.
export const dynamic = 'force-static'
export const revalidate = false

export const metadata: Metadata = {
  title: 'Terms of Use - Home of Calculators Calculator Service Agreement | Home of Calculators',
  description:
    'Read the Home of Calculators Terms of Use. Understand your rights and responsibilities when using our free online calculators, the visual builder, and embeddable widgets.',
  keywords: ['homeofcalculators terms', 'calculator terms of use', 'user agreement', 'service terms'],
  openGraph: {
    title: 'Terms of Use | Home of Calculators',
    description: 'Service agreement governing your use of Home of Calculators calculators and tools.',
    type: 'article',
  },
  alternates: { canonical: 'https://homeofcalculators.com/terms-of-use' },
}

export default function TermsOfUsePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" role="main" aria-label="Terms of Use" className="min-h-screen bg-white">
        <LegalPage
          title="Terms of Use"
          subtitle="The agreement that governs your use of Home of Calculators."
          badge="Legal"
          icon="file"
          lastUpdated="June 5, 2026"
          contactEmail="legal@homeofcalculators.com"
          intro="These Terms of Use form a binding agreement between you and Home of Calculators. They cover the calculators we provide, the visual builder you can use to create your own, the embeddable widgets you can place on your own site, and the relationship between us. Please read them carefully; by using Home of Calculators, you accept these terms."
          sections={[
        {
          heading: '1. Acceptance of These Terms',
          body: (
            <>
              <p>
                By accessing or using Home of Calculators at homeofcalculators.com (the "Site") or any calculator, widget, or service we provide (collectively, the "Service"), you agree to be bound by these Terms of Use, our <a href="/privacy-policy">Privacy Policy</a>, and our <a href="/cookies">Cookies Policy</a>. If you do not agree, please do not use the Service.
              </p>
              <p>
                You must be at least 13 years old to use Home of Calculators. If you are under 18, you represent that you have your parent or guardian's permission to use the Service.
              </p>
            </>
          ),
        },
        {
          heading: '2. What Home of Calculators Provides',
          body: (
            <>
              <p>Home of Calculators provides a free, browser-based calculator platform consisting of:</p>
              <ul>
                <li><strong>190 ready-made calculators</strong> across math, finance, health, conversion, datetime, and everyday categories</li>
                <li><strong>A visual calculator builder</strong>: a drag-and-drop, no-code tool for creating custom calculators with your own fields, formulas, themes, and branding</li>
                <li><strong>Embeddable widgets</strong>: iframe snippets that let you place any Home of Calculators calculator (or a custom one you build) on your own website</li>
                <li><strong>White-labeling features</strong>: your own logo, brand colors, and domain-friendly output for embedded widgets</li>
                <li><strong>JSON import/export</strong>: for backing up, sharing, or version-controlling your custom calculator configurations</li>
              </ul>
              <p>
                All of the above is provided <strong>free of charge</strong>. There are no paid tiers, no premium features, and no in-app purchases. We may introduce optional paid services in the future, but if we do, we will update these Terms and notify users in advance.
              </p>
            </>
          ),
        },
        {
          heading: '3. Your Responsibilities',
          body: (
            <>
              <p>When using Home of Calculators, you agree to:</p>
              <ul>
                <li>Use the Service for lawful purposes only</li>
                <li>Not use the Service to harass, harm, defame, or discriminate against others</li>
                <li>Not attempt to disrupt, hack, reverse-engineer, or interfere with the Service or its security</li>
                <li>Not use automated systems (bots, scrapers, crawlers) to access the Service in a way that burdens our infrastructure, except for legitimate search engine indexing (which we welcome, see our robots.txt)</li>
                <li>Not use the Service to build calculators that facilitate fraud, illegal activity, or content that violates third-party rights</li>
                <li>Verify critical calculations independently when accuracy is essential (financial, medical, legal, engineering decisions)</li>
                <li>Comply with all applicable local, state, national, and international laws</li>
              </ul>
            </>
          ),
        },
        {
          heading: '4. Calculator Accuracy & Disclaimer',
          body: (
            <>
              <p>
                Home of Calculators uses a high-precision math engine (mathjs with BigNumber arithmetic, 64-128 digits of precision) to ensure that calculations are accurate. Our engine is tested with 96+ unit tests covering unit conversion, financial formulas, health formulas, statistics, and more.
              </p>
              <p>
                <strong>However</strong>, the Service is provided "as is" and "as available" without warranties of any kind, express or implied. While we strive for accuracy, we make no guarantees about the correctness, reliability, or suitability of any calculation for any particular purpose.
              </p>
              <p>
                <strong>Always consult a qualified professional</strong> for decisions where calculation errors could cause material harm. Home of Calculators is an educational and informational tool; it is not a substitute for advice from a licensed financial advisor, doctor, lawyer, or other professional.
              </p>
            </>
          ),
        },
        {
          heading: '5. Embedded Widgets & Third-Party Sites',
          body: (
            <>
              <p>
                Home of Calculators provides iframe-based embed codes that allow you to place calculators on your own website. When you embed a Home of Calculators widget:
              </p>
              <ul>
                <li>You are responsible for the page where the widget is embedded</li>
                <li>You must not modify the iframe to misrepresent the calculator's source or hide our attribution where required by our embed policy</li>
                <li>You may not use embedded widgets to facilitate abuse, fraud, or violation of any law</li>
                <li>You agree that the calculator's data still flows through our Service (via the iframe) and is governed by our Privacy Policy</li>
              </ul>
              <p>
                We reserve the right to refuse to serve embedded widgets to specific URLs that violate these terms, but we will make reasonable efforts to notify embedders before taking such action.
              </p>
            </>
          ),
        },
        {
          heading: '6. User-Generated Content (Your Custom Calculators)',
          body: (
            <>
              <p>
                When you use the visual builder to create custom calculators, the resulting configurations are stored in your browser's localStorage and are not transmitted to our servers. You retain full ownership of these configurations.
              </p>
              <p>
                If you choose to share a custom calculator (e.g., by sending someone the embed URL), you represent that you have the right to share all the content it contains (formulas, labels, branding) and that doing so does not violate any third-party rights.
              </p>
              <p>
                <strong>You are responsible</strong> for the consequences of any custom calculator you publish or share. We do not review, endorse, or assume liability for user-built calculators.
              </p>
            </>
          ),
        },
        {
          heading: '7. Intellectual Property',
          body: (
            <>
              <p>
                <strong>Our intellectual property.</strong> The Home of Calculators name, logo, design, code, calculator engine, marketing copy, and all related materials are owned by Home of Calculators and protected by copyright, trademark, and other intellectual property laws. You may not copy, reproduce, distribute, modify, or create derivative works without our written permission, except as explicitly permitted below.
              </p>
              <p>
                <strong>Calculator engines and content.</strong> The math formulas underlying our ready-made calculators are widely-known mathematical facts and are not protected by copyright. You are free to use these formulas in your own projects.
              </p>
              <p>
                <strong>Trademark.</strong> "Home of Calculators" and our logo are our trademarks. You may not use them to suggest endorsement of your product without our permission. You <strong>may</strong> embed our widgets on your website, which may display our branding; this is permitted as part of the embed feature.
              </p>
            </>
          ),
        },
        {
          heading: '8. Limitation of Liability',
          body: (
            <>
              <p>
                To the maximum extent permitted by law, Home of Calculators and its operators, contributors, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Damages resulting from reliance on a calculation result</li>
                <li>Damages resulting from service interruptions or unavailability</li>
                <li>Damages resulting from unauthorized access to or alteration of your data</li>
              </ul>
              <p>
                In jurisdictions that do not allow the exclusion of certain damages, our liability is limited to the maximum extent permitted by law (often to USD $100 or the amount you have paid us in the past 12 months, which is $0 for the free Service).
              </p>
            </>
          ),
        },
        {
          heading: '9. Indemnification',
          body: (
            <p>
              You agree to indemnify and hold harmless Home of Calculators, its operators, and affiliates from any claims, damages, or expenses (including reasonable legal fees) arising from your use of the Service, your violation of these Terms, or your violation of any third-party rights.
            </p>
          ),
        },
        {
          heading: '10. Service Availability & Modifications',
          body: (
            <>
              <p>
                We strive to keep Home of Calculators running smoothly, but we do not guarantee uninterrupted access. We may need to modify, suspend, or discontinue the Service (or any part of it) at any time, with or without notice, for maintenance, updates, legal reasons, or other causes.
              </p>
              <p>
                We may also update these Terms of Use from time to time. Material changes will be announced with a banner on the Site for at least 30 days before they take effect. Your continued use after changes take effect constitutes acceptance of the new Terms.
              </p>
            </>
          ),
        },
        {
          heading: '11. Termination',
          body: (
            <>
              <p>
                You may stop using Home of Calculators at any time. If you wish, you can clear your browser's localStorage to remove all your custom-calculator data.
              </p>
              <p>
                We reserve the right to suspend or terminate your access to the Service if you violate these Terms or engage in activity that harms the Service or other users. Where reasonable, we will provide advance notice and an opportunity to cure.
              </p>
            </>
          ),
        },
        {
          heading: '12. Governing Law & Dispute Resolution',
          body: (
            <>
              <p>
                These Terms are governed by the laws of the jurisdiction in which Home of Calculators is established, without regard to conflict-of-law principles.
              </p>
              <p>
                We encourage you to contact us first at <a href="mailto:legal@homeofcalculators.com">legal@homeofcalculators.com</a> to resolve any dispute informally. If informal resolution fails, disputes will be resolved through binding arbitration in accordance with applicable arbitration rules, except where prohibited by law.
              </p>
            </>
          ),
        },
        {
          heading: '13. Contact',
          body: (
            <p>
              For questions about these Terms, contact us at <a href="mailto:legal@homeofcalculators.com">legal@homeofcalculators.com</a>.
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
