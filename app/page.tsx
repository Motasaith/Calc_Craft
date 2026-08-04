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

// Landing page is fully static — prerendered at build time for SEO.
export const dynamic = 'force-static'
export const revalidate = false

export const metadata: Metadata = {
  alternates: {
    canonical: BRAND.url,
    // The four regional variants that used to sit here (en-US, en-GB, en-CA,
    // en-AU) all pointed at this same URL, so they declared no alternative
    // anything — while omitting x-default, which is the one annotation a
    // set of hreflang tags is required to carry. One language, one URL.
    languages: {
      'x-default': BRAND.url,
      en: BRAND.url,
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
