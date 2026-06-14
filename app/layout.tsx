import type { Metadata, Viewport } from 'next'
import './globals.css'
import { BRAND } from '@/lib/brand'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1f' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.name} — 50+ Free Online Calculators for Math, Finance, Health & Everyday Use`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    'Free online calculators for math, finance, health, conversion, and everyday needs. 50+ accurate, privacy-first calculators with no signup. Built-in visual builder to create and embed custom calculators on any website.',
  keywords: [
    'calculator', 'online calculator', 'free calculator', 'math calculator', 'finance calculator',
    'BMI calculator', 'loan calculator', 'EMI calculator', 'scientific calculator',
    'percentage calculator', 'age calculator', 'health calculator', 'mortgage calculator',
    'currency converter', 'unit converter', 'custom calculator builder', 'embed calculator',
    'white label calculator', 'calculator widget', 'no code calculator', 'visual builder',
    'drag and drop calculator', 'online math tools', 'financial planning tools',
    'compound interest calculator', 'tip calculator', 'discount calculator',
    'date calculator', 'time calculator', 'calorie calculator', 'retirement calculator',
    'savings calculator', 'investment calculator', 'GPA calculator', 'random number generator',
    'password generator', 'area calculator', 'volume calculator', 'speed calculator',
    'temperature converter', 'weight converter', 'length converter', 'data converter',
    'free online calculator', 'calculator website', 'best calculator site',
    'privacy calculator', 'browser calculator', 'offline calculator',
  ],
  authors: [{ name: BRAND.author, url: `${BRAND.url}/about` }],
  creator: BRAND.name,
  publisher: BRAND.name,
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BRAND.url,
    languages: {
      'en-US': BRAND.url,
      'en-GB': BRAND.url,
      'en-CA': BRAND.url,
      'en-AU': BRAND.url,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BRAND.url,
    siteName: BRAND.name,
    title: `${BRAND.name} - Free Online Calculators for Math, Finance & Health`,
    description:
      '50+ free online calculators for math, finance, health, and everyday needs. No signup required. Fast, accurate, and mobile-friendly.',
    images: [
      {
        url: 'https://homeofcalculators.com/og-image.png',
        width: 1200,
        height: 630,
        alt: `${BRAND.name} - Smart Calculators for Every Calculation`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: BRAND.handle,
    creator: BRAND.handle,
    title: 'Home of Calculators - Free Online Calculators for Math, Finance & Health',
    description:
      '50+ free online calculators. No signup required. Fast, accurate, and mobile-friendly.',
    images: ['https://homeofcalculators.com/twitter-image.png'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'Technology',
  classification: 'Calculator Tools',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  itunes: {
    appId: 'homeofcalculators',
    appArgument: 'https://homeofcalculators.com',
  },
  appleWebApp: {
    capable: true,
    title: 'Home of Calculators',
    statusBarStyle: 'black-translucent',
  },
  applicationName: 'Home of Calculators',
  manifest: 'https://homeofcalculators.com/manifest.webmanifest',
  archives: ['https://homeofcalculators.com/blog'],
  assets: ['https://homeofcalculators.com'],
  bookmarks: ['https://homeofcalculators.com'],
  other: {
    'msapplication-TileColor': '#1a1a1f',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileImage': '/mstile-144x144.png',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/logo.png', color: '#1a1a1f' },
    ],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://homeofcalculators.com/#website',
      url: 'https://homeofcalculators.com',
      name: 'Home of Calculators',
      description:
        'Free online calculators for math, finance, health, and everyday needs. 50+ smart calculators with no signup required.',
      publisher: {
        '@id': 'https://homeofcalculators.com/#organization',
      },
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://homeofcalculators.com/search?q={search_term_string}',
          },
          'query-input': {
            '@type': 'PropertyValueSpecification',
            valueRequired: true,
            valueName: 'search_term_string',
          },
        },
      ],
      inLanguage: 'en-US',
    },
    {
      '@type': 'Organization',
      '@id': 'https://homeofcalculators.com/#organization',
      name: 'Home of Calculators',
      url: 'https://homeofcalculators.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://homeofcalculators.com/logo.png',
        width: 512,
        height: 512,
        caption: 'Home of Calculators Logo',
      },
      image: {
        '@type': 'ImageObject',
        url: 'https://homeofcalculators.com/og-image.png',
        width: 1200,
        height: 630,
        caption: 'Home of Calculators - Smart Calculators for Every Calculation',
      },
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-800-HOC-TOOLS',
        contactType: 'customer support',
        email: 'support@homeofcalculators.com',
        availableLanguage: ['English'],
        areaServed: 'Worldwide',
      },
      foundingDate: '2024',
      slogan: 'Smart Calculators for Every Calculation',
      description:
        'Home of Calculators provides free, accurate online calculators for math, finance, health, and everyday calculations. Built for students, professionals, and everyone in between.',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://homeofcalculators.com/#webpage',
      url: 'https://homeofcalculators.com',
      name: 'Home of Calculators - Free Online Calculators for Math, Finance & Health',
      isPartOf: {
        '@id': 'https://homeofcalculators.com/#website',
      },
      about: {
        '@id': 'https://homeofcalculators.com/#organization',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://homeofcalculators.com/og-image.png',
      },
      datePublished: '2024-01-01T00:00:00+00:00',
      dateModified: '2024-01-01T00:00:00+00:00',
      breadcrumb: {
        '@id': 'https://homeofcalculators.com/#breadcrumb',
      },
      inLanguage: 'en-US',
      potentialAction: [
        {
          '@type': 'ReadAction',
          target: ['https://homeofcalculators.com'],
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://homeofcalculators.com/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://homeofcalculators.com',
        },
      ],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Home of Calculators',
      applicationCategory: 'CalculatorApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1250',
        bestRating: '5',
        worstRating: '1',
      },
      featureList: [
        'Basic Calculator',
        'Scientific Calculator',
        'BMI Calculator',
        'Loan EMI Calculator',
        'Percentage Calculator',
        'Age Calculator',
        'Currency Converter',
        'Unit Converter',
      ],
      screenshot: {
        '@type': 'ImageObject',
        url: 'https://homeofcalculators.com/screenshot.png',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Are all calculators on Home of Calculators really free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! All calculators on Home of Calculators are 100% free to use. No sign-up required, no hidden fees, and no usage limits. Simply choose a calculator and start calculating.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to create an account to use Home of Calculators calculators?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Not at all. You can use every calculator without creating an account. All calculations run locally in your browser.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use Home of Calculators calculators on my phone?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutely. Home of Calculators is fully responsive and works great on mobile, tablet, and desktop devices.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is my data safe when using Home of Calculators calculators?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. All calculations happen in your browser. We do not store or transmit your input data to any server.',
          },
        },
        {
          '@type': 'Question',
          name: 'How often are new calculators added to Home of Calculators?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We add new calculators regularly based on user feedback and trending needs. Check back often or subscribe to our newsletter.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I embed Home of Calculators calculators on my website?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! We offer embed codes for all calculators. You can also white-label them with your own branding.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
