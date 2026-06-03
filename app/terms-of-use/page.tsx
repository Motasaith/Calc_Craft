import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Calc_Craft Terms of Use - Read the terms and conditions for using our free online calculators and services.',
}

export default function TermsOfUse() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-700 mb-4 shadow-sm">
            Legal
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
            Terms of Use
          </h1>
          <p className="text-sm text-slate-400">
            Last updated: June 3, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              By accessing and using Calc_Craft, you accept and agree to be bound by these Terms of Use. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Description of Service</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Calc_Craft provides free online calculators for math, finance, health, and everyday calculations. 
              All calculators are provided "as is" without warranties of any kind.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. User Responsibilities</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              When using Calc_Craft, you agree to:
            </p>
            <ul className="space-y-2 text-sm text-slate-500 leading-relaxed list-disc list-inside">
              <li>Use the calculators for lawful purposes only</li>
              <li>Not attempt to disrupt or interfere with our services</li>
              <li>Not use automated systems to access our calculators excessively</li>
              <li>Verify critical calculations independently when accuracy is essential</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Disclaimer of Warranties</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Calc_Craft makes no warranties about the accuracy, reliability, or completeness of calculator results. 
              Results are provided for informational purposes only. Always consult a professional for critical financial, 
              medical, or legal decisions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Limitation of Liability</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              In no event shall Calc_Craft be liable for any indirect, incidental, special, consequential, or punitive damages 
              arising from your use of our calculators.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. Intellectual Property</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              All content, designs, and code on Calc_Craft are the property of Calc_Craft and are protected by copyright 
              and other intellectual property laws. You may not reproduce, distribute, or create derivative works without permission.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">7. Modifications to Terms</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting. 
              Your continued use of Calc_Craft constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">8. Governing Law</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              These Terms of Use shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">9. Contact Information</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              For questions about these Terms of Use, please contact us at{' '}
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
