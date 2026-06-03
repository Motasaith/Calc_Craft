import type { Metadata, Viewport } from 'next'
import './globals.css'

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
  metadataBase: new URL('https://calccraft.com'),
  title: {
    default: 'CalcCraft - Free Online Calculators for Math, Finance & Health | 50+ Smart Tools',
    template: '%s | CalcCraft',
  },
  description:
    'CalcCraft offers 50+ free online calculators for math, finance, health, and everyday needs. No signup required. Fast, accurate, and mobile-friendly. Try our BMI calculator, loan EMI calculator, scientific calculator, and more.',
  keywords: [
    'calculator',
    'online calculator',
    'free calculator',
    'math calculator',
    'finance calculator',
    'BMI calculator',
    'loan calculator',
    'EMI calculator',
    'scientific calculator',
    'percentage calculator',
    'age calculator',
    'health calculator',
    'mortgage calculator',
    'tax calculator',
    'currency converter',
    'unit converter',
    'custom calculator builder',
    'embed calculator',
    'white label calculator',
    'calculator widget',
    'online math tools',
    'financial planning tools',
    'body mass index calculator',
    'loan interest calculator',
    'compound interest calculator',
    'tip calculator',
    'discount calculator',
    'date calculator',
    'time calculator',
    'calorie calculator',
    'pregnancy calculator',
    'retirement calculator',
    'savings calculator',
    'investment calculator',
    'gpa calculator',
    'grade calculator',
    'random number generator',
    'password generator',
    'percentage change calculator',
    'ratio calculator',
    'fraction calculator',
    'area calculator',
    'volume calculator',
    'distance calculator',
    'speed calculator',
    'temperature converter',
    'weight converter',
    'length converter',
    'data converter',
  ],
  authors: [{ name: 'CalcCraft Team', url: 'https://calccraft.com/about' }],
  creator: 'CalcCraft',
  publisher: 'CalcCraft',
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
    canonical: 'https://calccraft.com',
    languages: {
      'en-US': 'https://calccraft.com',
      'en-GB': 'https://calccraft.com',
      'en-CA': 'https://calccraft.com',
      'en-AU': 'https://calccraft.com',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://calccraft.com',
    siteName: 'CalcCraft',
    title: 'CalcCraft - Free Online Calculators for Math, Finance & Health',
    description:
      '50+ free online calculators for math, finance, health, and everyday needs. No signup required. Fast, accurate, and mobile-friendly.',
    images: [
      {
        url: 'https://calccraft.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CalcCraft - Smart Calculators for Every Calculation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@calccraft',
    creator: '@calccraft',
    title: 'CalcCraft - Free Online Calculators for Math, Finance & Health',
    description:
      '50+ free online calculators. No signup required. Fast, accurate, and mobile-friendly.',
    images: ['https://calccraft.com/twitter-image.png'],
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
    appId: 'calccraft',
    appArgument: 'https://calccraft.com',
  },
  appleWebApp: {
    capable: true,
    title: 'CalcCraft',
    statusBarStyle: 'black-translucent',
  },
  applicationName: 'CalcCraft',
  manifest: 'https://calccraft.com/manifest.webmanifest',
  archives: ['https://calccraft.com/blog'],
  assets: ['https://calccraft.com'],
  bookmarks: ['https://calccraft.com'],
  other: {
    'msapplication-TileColor': '#1a1a1f',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileImage': '/mstile-144x144.png',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://calccraft.com/#website',
      url: 'https://calccraft.com',
      name: 'CalcCraft',
      description:
        'Free online calculators for math, finance, health, and everyday needs. 50+ smart calculators with no signup required.',
      publisher: {
        '@id': 'https://calccraft.com/#organization',
      },
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://calccraft.com/search?q={search_term_string}',
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
      '@id': 'https://calccraft.com/#organization',
      name: 'CalcCraft',
      url: 'https://calccraft.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://calccraft.com/logo.png',
        width: 512,
        height: 512,
        caption: 'CalcCraft Logo',
      },
      image: {
        '@type': 'ImageObject',
        url: 'https://calccraft.com/og-image.png',
        width: 1200,
        height: 630,
        caption: 'CalcCraft - Smart Calculators for Every Calculation',
      },
      sameAs: [
        'https://twitter.com/calccraft',
        'https://facebook.com/calccraft',
        'https://instagram.com/calccraft',
        'https://linkedin.com/company/calccraft',
        'https://github.com/calccraft',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-800-CALC-CRAFT',
        contactType: 'customer support',
        email: 'support@calccraft.com',
        availableLanguage: ['English'],
        areaServed: 'Worldwide',
      },
      foundingDate: '2024',
      slogan: 'Smart Calculators for Every Calculation',
      description:
        'CalcCraft provides free, accurate online calculators for math, finance, health, and everyday calculations. Built for students, professionals, and everyone in between.',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://calccraft.com/#webpage',
      url: 'https://calccraft.com',
      name: 'CalcCraft - Free Online Calculators for Math, Finance & Health',
      isPartOf: {
        '@id': 'https://calccraft.com/#website',
      },
      about: {
        '@id': 'https://calccraft.com/#organization',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://calccraft.com/og-image.png',
      },
      datePublished: '2024-01-01T00:00:00+00:00',
      dateModified: new Date().toISOString(),
      breadcrumb: {
        '@id': 'https://calccraft.com/#breadcrumb',
      },
      inLanguage: 'en-US',
      potentialAction: [
        {
          '@type': 'ReadAction',
          target: ['https://calccraft.com'],
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://calccraft.com/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://calccraft.com',
        },
      ],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'CalcCraft',
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
        url: 'https://calccraft.com/screenshot.png',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Are all calculators on CalcCraft really free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! All calculators on CalcCraft are 100% free to use. No sign-up required, no hidden fees, and no usage limits. Simply choose a calculator and start calculating.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to create an account to use CalcCraft calculators?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Not at all. You can use every calculator without creating an account. However, signing up lets you save favorites and access your history.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use CalcCraft calculators on my phone?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutely. CalcCraft is fully responsive and works great on mobile, tablet, and desktop devices.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is my data safe when using CalcCraft calculators?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. All calculations happen in your browser. We do not store or transmit your input data to any server.',
          },
        },
        {
          '@type': 'Question',
          name: 'How often are new calculators added to CalcCraft?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We add new calculators regularly based on user feedback and trending needs. Check back often or subscribe to our newsletter.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I embed CalcCraft calculators on my website?',
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
    <html lang="en">
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
