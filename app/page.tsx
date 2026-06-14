import type { Metadata } from 'next'
import { BRAND } from '@/lib/brand'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import WhyChooseUs from '@/components/WhyChooseUs'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  alternates: {
    canonical: BRAND.url,
    languages: {
      'en-US': BRAND.url,
      'en-GB': BRAND.url,
      'en-CA': BRAND.url,
      'en-AU': BRAND.url,
    },
  },
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" role="main" aria-label="Main content">
        <Hero />
        <WhyChooseUs />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
