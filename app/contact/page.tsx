import type { Metadata } from 'next'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Have questions, feedback, or partnership ideas? Contact the Home of Calculators team. We respond to all requests within 24-48 hours.',
  keywords: ['contact homeofcalculators', 'calculator support', 'suggest a calculator', 'feedback'],
  alternates: { canonical: 'https://homeofcalculators.com/contact' },
  openGraph: {
    title: 'Contact Us | Home of Calculators',
    description:
      'Have questions, feedback, or partnership ideas? Contact the Home of Calculators team. We respond to all requests within 24-48 hours.',
    url: 'https://homeofcalculators.com/contact',
    siteName: 'Home of Calculators',
    type: 'website',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
