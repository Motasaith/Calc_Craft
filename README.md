# Home of Calculators 🧮

**Home of Calculators** is a premium, modern, and highly interactive **free online calculator platform** built with Next.js 15, React 19, TypeScript, Tailwind CSS, GSAP, and Framer Motion. It blends modern minimal flat aesthetics with nostalgic digital hardware designs, offering **190 free online calculators** across **13 categories** — all powered by a single high-precision math engine — plus a no-code visual builder and embeddable widgets.

---

## 🌐 Live Website

**URL**: [https://homeofcalculators.com](https://homeofcalculators.com)

Home of Calculators is a **statically exported Next.js application** optimized for search engines (Google, Bing, Yahoo, DuckDuckGo) and AI-powered search engines (ChatGPT, Perplexity, Google AI Mode, Bing Copilot, Claude). It deploys to **Cloudflare Pages** as a static site with a single Pages Function for the contact API.

### Rendering strategy
- **SSG (static generation)** — all SEO pages are prerendered at build time via `output: 'export'` + `export const dynamic = 'force-static'`, so Google gets fully-rendered HTML with zero JavaScript execution (the gold standard for SEO):
  - Home (`/`), About (`/about`), Blog index (`/blog`) and all blog posts (`/blog/[slug]`)
  - Calculators directory (`/calculators`) and every calculator page (`/calculators/[slug]`) via `generateStaticParams`
  - Legal pages (`/privacy-policy`, `/terms-of-use`, `/cookies`)
  - `sitemap.ts`, `robots.ts`, `manifest.ts`
- **Client-hydrated shells** — interactive tools are exported as static HTML shells that hydrate in the browser (no server runtime needed):
  - Visual Builder (`/builder`), Contact (`/contact`), Embed (`/embed`), Custom calculator (`/calculators/custom`)
- **Cloudflare Pages Function** — `functions/api/contact.ts` handles `POST /api/contact` at the edge. The contact form also has a hidden-iframe fallback to FormSubmit.co so it works even without the Function.

### Fonts
All three font families are self-hosted via `next/font/google` in `app/layout.tsx` — no render-blocking `@import` requests, zero layout shift (automatic `size-adjust`), served same-origin from Cloudflare's edge:
- **Plus Jakarta Sans** (`--font-jakarta`) → body text
- **Inter** (`--font-inter`) → headings
- **Share Tech Mono** (`--font-mono`) → calculator displays only (scoped via `casio-hardware.module.css` and Tailwind's `font-mono` utility)

Build with `npm run build` (outputs to `out/`) and deploy the `out/` directory to Cloudflare Pages. No Node server required.

---

## ✨ What's New

### 🧠 State-of-the-Art Calculation Engine ([lib/calc-engine.ts](lib/calc-engine.ts))
Every numeric result on the site is produced by a single, centralized engine built on top of **mathjs (BigNumber, 64–128 digits of precision)**.

- **`evaluate()` / `evaluateBig()`** — async expression evaluators with friendly error messages
- **Domain-specific helpers** — `calculateEMI`, `calculateCompoundInterest`, `calculateSIP`, `calculateBMI`, `calculateBMR`, `calculateBodyFatNavy`, `calculateIdealWeight`, `calculateHeartRate`, `calculateWaterIntake`, `calculateMacros`, `calculateDueDate`, `calculateAge`, `calculateDateDifference`, `calculateROI`, `calculateInflation`, `calculateBreakEven`, `calculateProfitMargin`, `calculateTip`, `calculateSalary`, `calculateSavingsGoal`, `calculateSimpleInterest`, `calculateDiscount`
- **Unit & currency conversion** — `convertUnits`, `convertTemperature`, `convertCooking`, `convertCurrency`
- **Time helpers** — `hmsToSeconds`, `secondsToHMS`
- **Statistics** — `mean`, `median`, `mode`, `stddev`, `variance`, `sum`, `range_`
- **Formatting** — `formatNumber`, `formatCurrency`, `formatPercent`
- **Lazy-loaded** — mathjs is dynamically imported on calculator pages only, keeping the landing-page bundle small
- **Type-safe** — every helper returns either `EvalResult` (with `value` + `formatted`) or `EvalError`

> **43+ calculator components** share this single engine — no duplicated math, no float drift, no inconsistent rounding.

### 🧮 Shared Scientific Engine ([lib/scientific-engine.ts](lib/scientific-engine.ts))
A pure, dependency-free math engine (tokenizer → recursive-descent parser → evaluator) powers both the hero Casio calculator and the Scientific Calculator. No mathjs dependency, identical behavior, zero drift. Exports: `tokenize`, `evaluate`, `balanceParens`, `formatNumberForDisplay`, `prettifyExpr`, `tryEvaluate`, type `AngleMode`.

### 🆕 Categories
- **Statistics** — descriptive stats (mean, median, mode, std dev, variance, range)
- **Trigonometry** — sin / cos / tan / asin / acos / atan with DEG/RAD toggle
- **Geometry** — area & volume of 13 shapes (rectangle, circle, triangle, trapezoid, ellipse, parallelogram, rhombus, cube, sphere, cylinder, cone, pyramid, prism)
- **Construction** — concrete, drywall, flooring, gravel, mulch, paint, roofing, square footage, stair, tile
- **Engineering** — engineering-specific calculators
- **Islamic** — Islamic finance and date calculators

---

## 🚀 Key Features

### 1. Free Online Calculators (190 across 13 categories)
| Category | Calculators |
|---|---|
| **Math** | Basic, Scientific, Percentage, Fraction, Exponent, Logarithm, Quadratic, GCD & LCM, Permutation & Combination, Ratio, Number Base Converter, Statistics, Volume, Area |
| **Finance** | Loan EMI, Mortgage, Compound Interest, Simple Interest, SIP, ROI, Inflation, Discount, Profit Margin, Break-Even, Tip, Salary, Savings Goal, Currency |
| **Health** | BMI, Body Fat, Calorie (BMR + TDEE), Ideal Weight, Heart Rate, Macro, Water Intake, Pregnancy |
| **Conversion** | Length, Weight, Temperature, Speed, Energy, Data Storage, Cooking, Angle, Power, Pressure, Fuel, Roman Numeral |
| **Date & Time** | Age, Date Difference, Time, Countdown |
| **Everyday** | GPA, Password Generator, Random Number, Color Converter, Word Counter |
| **Construction** | Concrete, Drywall, Flooring, Gravel, Mulch, Paint, Roofing, Square Footage, Stair, Tile |
| **Statistics** | Descriptive statistics (mean / median / mode / std dev / variance / range) |
| **Trigonometry** | sin / cos / tan + inverses (DEG/RAD) |
| **Geometry** | Area & Volume of 13 shapes |
| **Engineering** | Engineering-specific calculators |
| **Islamic** | Islamic finance and date calculators |
| **Misc** | Miscellaneous utilities |

### 2. Flat Digital Calculator Text Rendering Engine
Home of Calculators features a custom, high-fidelity SVG-based **14-segment digital text display system** that recreates the look and feel of physical LED/LCD calculator displays without relying on third-party fonts:
- **Beveled SVG Polygons**: Hand-crafted coordinates for all 14 segments and a decimal point, providing clean and sharp edges at any scale.
- **Physical Display Characteristics**: Simulates a physical screen with a subtle forward slant (`skewX(-8deg)`) and light-grey segment shadows for inactive background elements.
- **Intellectual Decimal Parsing**: Automatically merges period (`.`) characters with their preceding digits into a single character cell, rendering decimals exactly like real hardware displays.
- **Power-On Startup Flicker**: Triggers a staggered vacuum-fluorescent VFD/LED flicker animation using Framer Motion when characters mount.
- **Multiple Styling Themes**: `minimal` (default), `lcd` (Casio olive-green), `led-red` / `led-green` / `led-blue` (glowing retro neon).

### 3. Pixel-Perfect Casio Hardware Replica
`components/CasioHeroCalculator.tsx` is a pixel-perfect Casio fx-991EX ClassWiz replica styled via `components/casio-hardware.module.css` — 3D bevels, sage LCD, solar panel, amber/orange accent keys. The hero calculator floats via Tailwind `animate-float` and uses the shared scientific engine for identical behavior to the standalone Scientific Calculator.

### 4. Animated Floating Header
The navigation menu has been fully upgraded to stand out cleanly from the Hero canvas:
- **Mount Slide Transition**: Slides smoothly from the top of the viewport on initial page load.
- **Dynamic Scroll States**: The header transitionally adjusts border sharpness, background opacity, and shadow depth as the user scrolls.
- **Magnetic Hover Pill**: Uses Framer Motion `layoutId` to slide a highlighting capsule smoothly behind menu items as you hover.
- **Mega Menu**: Category-based dropdown for browsing all 190 calculators.
- **Accessibility & SEO**: Semantic `<nav>` with `aria-label`, skip-to-content link, and keyboard-navigable dropdowns.

### 5. Fully Responsive Design
- **Mobile-first** approach with breakpoints for `sm`, `md`, `lg`, `xl`, and `2xl`
- Touch-optimized carousel and calculator interactions
- Horizontal snap-scroll for calculator cards on mobile
- Adaptive typography and spacing across all devices

### 6. Custom Calculator Builder
A drag-and-drop builder lets users create and share their own calculators without writing code:
- **Form fields** — number, text, select, slider, checkbox
- **Formula parser** — mathjs-based with shared engine helpers
- **Templates** — pre-built starting points (BMI, Tip, Compound Interest, Discount, and more)
- **Themes** — Retro, Dark, Modern, Pastel, Cyberpunk + custom colors
- **White-labeling** — custom logo, brand name, and colors
- **Export & share** — generate a shareable URL via the URL serializer, or export as JSON
- **Embed** — paste the calculator into any page via the `/embed` route with a one-line iframe

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router, static export, `next/font`, and built-in SEO optimizations |
| **React 19** | UI library with concurrent features |
| **TypeScript** | Type-safe development across the engine and UI |
| **Tailwind CSS 3.4** | Utility-first CSS framework with custom color palette |
| **mathjs (BigNumber)** | Core calculation engine — 64/128-digit precision |
| **GSAP + ScrollTrigger** | High-performance scroll animations |
| **Framer Motion** | React animations and gestures |
| **Lucide React** | Modern icon library |
| **Cloudflare Pages** | Static hosting + Pages Functions for the contact API |

---

## 📂 Project Structure
```
├── app/
│   ├── layout.tsx              # Root layout: metadata, JSON-LD, next/font setup
│   ├── page.tsx                # Home (SSG)
│   ├── globals.css             # Tailwind + font CSS variables
│   ├── manifest.ts             # PWA manifest (force-static)
│   ├── robots.ts               # Crawler rules (force-static)
│   ├── sitemap.ts              # XML sitemap (force-static)
│   ├── about/page.tsx          # About (SSG)
│   ├── blog/
│   │   ├── page.tsx            # Blog index (SSG)
│   │   └── [slug]/page.tsx     # Blog posts (SSG via generateStaticParams)
│   ├── builder/
│   │   ├── page.tsx            # Builder entry
│   │   └── BuilderPageClient.tsx # Drag-and-drop editor (client)
│   ├── calculators/
│   │   ├── page.tsx            # Catalog (SSG)
│   │   ├── CalculatorsPageClient.tsx # Search/filter (client)
│   │   ├── [slug]/
│   │   │   ├── page.tsx        # Calculator page (SSG via generateStaticParams)
│   │   │   └── CalculatorPageClient.tsx
│   │   └── custom/
│   │       ├── page.tsx        # Custom calc entry
│   │       └── CustomCalculatorPageClient.tsx # Reads URL hash (client)
│   ├── contact/
│   │   ├── page.tsx            # Contact entry
│   │   └── ContactPageClient.tsx # Form with iframe fallback (client)
│   ├── embed/
│   │   ├── page.tsx            # Embed entry
│   │   └── EmbedPageClient.tsx # Iframe widget (client)
│   ├── cookies/page.tsx        # Cookies policy (SSG)
│   ├── privacy-policy/page.tsx # Privacy policy (SSG)
│   └── terms-of-use/page.tsx   # Terms of use (SSG)
├── components/
│   ├── Navbar.tsx              # Animated floating header with mega menu
│   ├── Hero.tsx                # Landing section with live Casio calculator
│   ├── CasioHeroCalculator.tsx # Pixel-perfect Casio fx-991EX replica
│   ├── casio-hardware.module.css # Casio hardware styling (uses --font-mono)
│   ├── Features.tsx            # Feature ticker with ItemList schema
│   ├── WhyChooseUs.tsx         # Service schema and rich content
│   ├── HowItWorks.tsx          # HowTo schema with step-by-step
│   ├── PopularCalculators.tsx  # SoftwareApplication schema
│   ├── CalculatorStack.tsx     # Interactive calculator showcase
│   ├── Testimonials.tsx        # Review schema and carousel
│   ├── FAQ.tsx                 # FAQPage schema
│   ├── CTA.tsx                 # Call-to-action
│   ├── Footer.tsx              # Organization schema and semantic footer
│   ├── SegmentDisplay.tsx      # SVG 14-segment character renderer
│   ├── DigitalText.tsx         # Decimal-parsing wrapper for strings
│   ├── CalculatorSEOContent.tsx # Per-calculator SEO copy block
│   ├── legal/LegalPage.tsx     # Reusable legal page layout
│   └── calculators/
│       ├── construction/       # 10 construction calculators
│       ├── conversion/         # 12 unit converters
│       ├── datetime/           # Date/time calculators
│       ├── engineering/        # Engineering calculators
│       ├── everyday/           # Everyday utilities
│       ├── finance/            # Financial calculators
│       ├── geometry/           # Area & volume
│       ├── health/             # Health & fitness
│       ├── islamic/            # Islamic calculators
│       ├── math/               # Math calculators (incl. Scientific)
│       ├── misc/               # Miscellaneous
│       ├── shared/             # FormCalculatorShell, RetroInput, ResultDisplay, CustomCalculatorRenderer
│       ├── statistics/         # Descriptive statistics
│       └── trigonometry/       # Trig with DEG/RAD
├── functions/
│   └── api/contact.ts          # Cloudflare Pages Function — POST /api/contact
├── hooks/
│   └── useKeyboardInput.ts     # Keyboard input hook (Basic & Scientific)
├── lib/
│   ├── brand.ts                # Central brand config (single source of truth)
│   ├── calc-engine.ts          # mathjs-backed engine (lazy-loaded)
│   ├── scientific-engine.ts    # Pure dependency-free scientific engine
│   ├── calculators.ts          # Catalog of all 190 calculators
│   ├── calculator-components.tsx # Lazy resolver: slug → React component
│   ├── export-utils.ts         # Export results to CSV / JSON
│   ├── formula-parser.ts       # Custom-formula parser for the builder
│   └── url-serializer.ts       # Encode/decode calculator state in URLs
├── test/
│   └── engine.test.mjs         # Engine tests (run with `npx tsx`)
└── public/                     # Static assets (icons, og-image, etc.)
```

---

## 🧪 Testing the Engine

The engine ships with unit tests covering unit conversion, financial formulas, health formulas, statistics, and BigNumber precision:

```bash
npx tsx test/engine.test.mjs
```

Type-check the project:

```bash
npx tsc --noEmit
```

---

## 🔍 SEO & GEO Optimization

This project implements **comprehensive Search Engine Optimization (SEO)** and **Generative Engine Optimization (GEO)** techniques to maximize visibility on traditional search engines (Google, Bing, Yahoo, DuckDuckGo) and AI-powered search engines (ChatGPT, Perplexity, Google AI Mode, Bing Copilot, Claude).

### Technical SEO

#### Metadata & Open Graph (`app/layout.tsx`)
- **Title Template**: `"%s | Home of Calculators"`
- **Meta Description**: Optimized for keywords like "free online calculators", "BMI calculator", "loan calculator"
- **Open Graph**: `og:title`, `og:description`, `og:type=website`, `og:image` (1200x630), `og:locale=en_US`
- **Twitter Card**: `summary_large_image` with title, description, and image
- **Keywords**: 50+ targeted keywords
- **Robots**: `index, follow` with `max-image-preview:large`, `max-snippet:-1`, `max-video-preview:-1`
- **Verification Placeholders**: Google, Bing, Yandex site verification ready
- **Apple Web App**: `capable=yes`, `statusBarStyle=black-translucent`

#### Structured Data (JSON-LD)
Six Schema.org types are embedded in `app/layout.tsx` using `@graph`:

| Schema Type | Purpose |
|-------------|---------|
| **WebSite** | Site name, URL, search action (Sitelinks Searchbox) |
| **Organization** | Brand name, logo, URL, contact point |
| **WebPage** | Page title, description, URL, breadcrumb reference |
| **BreadcrumbList** | Navigation hierarchy for rich snippets |
| **SoftwareApplication** | Application category, offers (Free), aggregateRating |
| **FAQPage** | Frequently asked questions for rich results |

#### Microdata (Inline Schema Markup)
Each component includes inline Schema.org microdata:
- **Hero.tsx**: `WebPageElement` on H1
- **Features.tsx**: `ItemList` with `itemProp="name"`
- **WhyChooseUs.tsx**: `Service` with `ListItem` schema
- **HowItWorks.tsx**: `HowTo` with `HowToStep` items
- **PopularCalculators.tsx**: `ItemList` with `SoftwareApplication` per calculator
- **Testimonials.tsx**: `Review` on carousel
- **FAQ.tsx**: `FAQPage` with `Question` and `Answer` items
- **CTA.tsx**: `SoftwareApplication`
- **Footer.tsx**: `Organization` and `WPFooter`
- **CalculatorStack.tsx**: `ItemList`

#### Crawler Management (`app/robots.ts`)
Custom rules for search engines and AI bots:
- **All bots**: `Allow: /`, `Disallow: /api/`, `Disallow: /_next/`, `Disallow: /embed`
- **Googlebot / Bingbot**: Allow with crawl delay hint
- **Googlebot-Image**: Allow all
- **ChatGPT-User / GPTBot**: Allow all (GEO optimization)
- **PerplexityBot / Claude-Web**: Allow all (GEO optimization)

#### XML Sitemap (`app/sitemap.ts`)
All 190+ URLs with priorities and change frequencies:
- Homepage: `priority: 1.0`, `changefreq: 'daily'`
- Calculator catalog: `priority: 0.9`, `changefreq: 'weekly'`
- Individual calculators: `priority: 0.6`, `changefreq: 'monthly'`
- Blog/About pages: `priority: 0.8`, `changefreq: 'weekly'`

#### PWA Manifest (`app/manifest.ts`)
- App name, short name, description
- Theme colors and background colors
- Icons for all platforms
- Calculator shortcuts

### On-Page SEO

#### Semantic HTML
- `<main id="main-content" role="main" aria-label="...">` on every page
- `<section>` with `aria-label` on every component
- `<nav>` with `aria-label` in `Navbar.tsx`
- `<footer>` with `itemType="https://schema.org/WPFooter"`
- Skip-to-content link for accessibility

#### Heading Hierarchy
- Single `<h1>` per page
- `<h2>` for section titles
- `<h3>` for card titles and subsections
- `<h4>` for footer link categories

#### Image Optimization
- All decorative icons have `aria-hidden="true"`
- `loading="lazy"` and `sizes` attributes for performance
- `images.unoptimized: true` (static export — manual optimization)

### Generative Engine Optimization (GEO)

#### AI Search Engine Visibility
- **ChatGPT / GPTBot**: Allowed in `robots.ts` with rich structured data
- **PerplexityBot**: Allowed with FAQ schema for direct answers
- **Google AI Mode / SGE**: Enhanced with HowTo, FAQPage, and Review schemas
- **Bing Copilot**: Optimized with Organization and SoftwareApplication schemas
- **Claude (Anthropic)**: Allowed with comprehensive JSON-LD context

#### Content Optimization for AI
- **Natural language descriptions** in all schema markup
- **Question-Answer pairs** in FAQ schema for direct AI responses
- **Step-by-step instructions** in HowTo schema for procedural queries
- **Entity relationships** defined via `@graph` in JSON-LD
- **E-E-A-T signals**: Authoritative content, clear organization, trust signals

### Performance SEO

#### Core Web Vitals
- **Static export** (`output: 'export'`) for instant page loads
- **Self-hosted fonts** via `next/font/google` — no render-blocking requests, zero layout shift
- **CSS optimization**: Tailwind purges unused styles
- **Animation performance**: GSAP and Framer Motion use `transform` and `opacity`
- **Lazy loading**: mathjs dynamically imported on calculator pages only; images and below-fold components load on demand

#### Mobile Optimization
- **Responsive breakpoints**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- **Touch targets**: Minimum 44px for buttons and links
- **Viewport meta**: Proper scaling and zoom behavior
- **Mobile-first CSS**: Base styles for mobile, enhancements for desktop

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Motasaith/Calc_Craft.git
   cd Calc_Craft
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build and Deployment
To build the optimized static production bundle:
```bash
npm run build
```
This generates fully optimized static assets in the `out/` directory. Deploy `out/` to Cloudflare Pages — no Node server required.

### Deploy to Cloudflare Pages
1. Run `npm run build` locally (or via CI)
2. Set the build output directory to `out` in your Cloudflare Pages project settings
3. The Pages Function in `functions/api/contact.ts` is automatically deployed alongside the static assets

### SEO Validation
After building, validate your SEO implementation:
1. **Google Rich Results Test**: [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
2. **Schema.org Validator**: [https://validator.schema.org](https://validator.schema.org)
3. **PageSpeed Insights**: [https://pagespeed.web.dev](https://pagespeed.web.dev)
4. **Mobile-Friendly Test**: [https://search.google.com/test/mobile-friendly](https://search.google.com/test/mobile-friendly)

---

## 📈 SEO Checklist

- [x] Meta title and description optimized
- [x] Open Graph and Twitter Card tags
- [x] Canonical URLs
- [x] JSON-LD structured data (6 schema types)
- [x] Inline microdata on all components
- [x] XML sitemap with priorities
- [x] Robots.txt with AI bot rules
- [x] PWA manifest with shortcuts
- [x] Semantic HTML5 elements
- [x] ARIA labels and roles
- [x] Skip-to-content link
- [x] Responsive design (mobile-first)
- [x] Image alt text and lazy loading
- [x] Internal linking structure
- [x] Heading hierarchy (H1 → H6)
- [x] Keyword-rich content
- [x] FAQ schema for AI search engines
- [x] HowTo schema for procedural queries
- [x] Review schema for testimonials
- [x] Organization schema for brand entity
- [x] SoftwareApplication schema for calculators
- [x] BreadcrumbList schema for navigation
- [x] WebSite schema with search action
- [x] Self-hosted fonts via `next/font` (no render-blocking)
- [x] Static export for instant edge delivery

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Tailwind CSS Team** for the utility-first CSS framework
- **mathjs Team** for the high-precision math library that powers the engine
- **GSAP Team** for industry-standard animations
- **Framer Motion Team** for React animation library
- **Lucide** for the beautiful icon set
- **Cloudflare** for edge hosting and Pages Functions

---

**Made with ❤️ by the Home of Calculators Team**

*Free online calculators for everyone, everywhere.*