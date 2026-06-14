import type { Metadata } from 'next'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch with Home of Calculators | Home of Calculators',
  description:
    'Have questions, feedback, bug reports, or partnership ideas? Contact the Home of Calculators team. We route support, business, and privacy requests promptly.',
  keywords: ['contact homeofcalculators', 'calculator support', 'suggest a calculator', 'feedback'],
  alternates: { canonical: 'https://homeofcalculators.com/contact' },
}

export default function ContactPage() {
  return <ContactPageClient />
}
