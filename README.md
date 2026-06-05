# Calc_Craft 🧮

**Calc_Craft** is a premium, modern, and highly interactive **free online calculator platform** built with Next.js 15, React 19, TypeScript, Tailwind CSS, GSAP, and Framer Motion. It blends modern minimal flat aesthetics with nostalgic digital hardware designs, offering **50+ free online calculators** across **9 categories** — all powered by a single high-precision math engine.

---

## 🌐 Live Website

**URL**: [https://calc_craft.com](https://calc_craft.com)

Calc_Craft is a **statically exported Next.js application** optimized for search engines (Google, Bing, Yahoo, DuckDuckGo) and AI-powered search engines (ChatGPT, Perplexity, Google AI Mode, Bing Copilot, Claude).

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

> **43 calculator components** share this single engine — no duplicated math, no float drift, no inconsistent rounding.

### 🆕 New Categories
- **Statistics** — descriptive stats (mean, median, mode, std dev, variance, range)
- **Trigonometry** — sin / cos / tan / asin / acos / atan with DEG/RAD toggle
- **Geometry** — area & volume of 13 shapes (rectangle, circle, triangle, trapezoid, ellipse, parallelogram, rhombus, cube, sphere, cylinder, cone, pyramid, prism)

---

## 🚀 Key Features

### 1. Free Online Calculators (50+ across 9 categories)
| Category | Calculators |
|---|---|
| **Math** | Basic, Scientific, Percentage, Fraction, Exponent, Logarithm, Quadratic, GCD & LCM, Permutation & Combination, Ratio, Number Base Converter, Statistics, Volume, Area |
| **Finance** | Loan EMI, Mortgage, Compound Interest, Simple Interest, SIP, ROI, Inflation, Discount, Profit Margin, Break-Even, Tip, Salary, Savings Goal, Currency |
| **Health** | BMI, Body Fat, Calorie (BMR + TDEE), Ideal Weight, Heart Rate, Macro, Water Intake, Pregnancy |
| **Conversion** | Length, Weight, Temperature, Speed, Energy, Data Storage, Cooking |
| **Datetime** | Age, Date Difference, Time, Countdown |
| **Everyday** | GPA, Password Generator, Random Number, Color Converter, Word Counter |
| **Statistics** | Descriptive statistics (mean / median / mode / std dev / variance / range) |
| **Trigonometry** | sin / cos / tan + inverses (DEG/RAD) |
| **Geometry** | Area & Volume of 13 shapes |

### 2. Flat Digital Calculator Text Rendering Engine
Calc_Craft features a custom, high-fidelity SVG-based **14-segment digital text display system** that recreates the look and feel of physical LED/LCD calculator displays without relying on third-party fonts:
- **Beveled SVG Polygons**: Hand-crafted coordinates for all 14 segments and a decimal point, providing clean and sharp edges at any scale.
- **Physical Display Characteristics**: Simulates a physical screen with a subtle forward slant (`skewX(-8deg)`) and light-grey segment shadows (`rgba(0,0,0,0.06)`) for inactive background elements.
- **Intellectual Decimal Parsing**: Automatically merges period (`.`) characters with their preceding digits into a single character cell, rendering decimals (e.g., `50+` or `12.5`) exactly like real hardware displays.
- **Power-On Startup Flicker**: Triggers a staggered vacuum-fluorescent VFD/LED flicker animation using Framer Motion when characters mount.
- **Multiple Styling Themes**:
  - `minimal` (Default): Floating, transparent background adapting to `currentColor`.
  - `lcd`: Classic Casio olive-green backing with dark slate segments.
  - `led-red` / `led-green` / `led-blue`: Glowing, high-contrast retro neon displays.

### 3. Animated Floating Header
The navigation menu has been fully upgraded to stand out cleanly from the Hero canvas:
- **Mount Slide Transition**: Slides smoothly from the top of the viewport on initial page load.
- **Dynamic Scroll States**: The header transitionally adjusts border sharpness, background opacity (`bg-white/85` vs `bg-white/95`), and shadow depth as the user scrolls, creating layered separation.
- **Magnetic Hover Pill**: Uses Framer Motion `layoutId` to slide a highlighting capsule smoothly behind menu items as you hover over links.
- **Streamlined CTA**: Features a high-contrast black `"Start Building"` action button with micro-scale click transitions.
- **Accessibility & SEO**: Semantic `<nav>` with `aria-label`, skip-to-content link, and keyboard-navigable dropdowns.

### 4. Fully Responsive Design
- **Mobile-first** approach with breakpoints for `sm`, `md`, `lg`, `xl`, and `2xl`
- Touch-optimized carousel and calculator interactions
- Horizontal snap-scroll for calculator cards on mobile
- Adaptive typography and spacing across all devices

### 5. Custom Calculator Builder
A drag-and-drop builder lets users create and share their own calculators without writing code:
- **Form fields** — number, text, select, slider
- **Formula parser** — mathjs-based with shared engine helpers
- **Export & share** — generate a shareable URL via the URL serializer
- **Embed** — paste the calculator into any page via the `/embed` route

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router, static export, and built-in SEO optimizations |
| **React 19** | UI library with concurrent features |
| **TypeScript** | Type-safe development across the engine and UI |
| **Tailwind CSS 3.4** | Utility-first CSS framework with custom color palette |
| **mathjs (BigNumber)** | Core calculation engine — 64/128-digit precision |
| **GSAP + ScrollTrigger** | High-performance scroll animations |
| **Framer Motion** | React animations and gestures |
| **Lucide React** | Modern icon library |

---

## 📂 Project Structure
├── manifest.ts         # PWA manifest with calculator shortcuts
│   ├── builder/            # Custom calculator builder
│   ├── calculators/        # Catalog + dynamic [slug] routes
│   ├── cookies/            # Cookie policy
│   ├── embed/              # Embeddable calculator iframe
│   ├── privacy-policy/     # Privacy policy
│   └── terms-of-use/       # Terms of use
├── components/
│   ├── Navbar.tsx          # Animated floating header with semantic nav
│   ├── Hero.tsx            # Landing section with ARIA labels and schema markup
│   ├── Features.tsx        # Feature cards with ItemList schema
│   ├── WhyChooseUs.tsx     # Service schema and rich descriptive content
│   ├── HowItWorks.tsx      # HowTo schema with step-by-step instructions
│   ├── PopularCalculators.tsx # SoftwareApplication schema for each calculator
│   ├── CalculatorStack.tsx # Interactive calculator stack with schema
│   ├── Testimonials.tsx    # Review schema and accessible carousel
│   ├── FAQ.tsx             # FAQPage schema with Question/Answer markup
│   ├── CTA.tsx             # Call-to-action with SoftwareApplication schema
│   ├── Footer.tsx          # Organization schema and semantic footer
│   ├── SegmentDisplay.tsx  # SVG drawing component for 14-segment characters
│   ├── DigitalText.tsx     # Decimal-parsing parser wrapper for strings
│   └── calculators/
│       ├── finance/        # 14 financial calculators (EMI, SIP, mortgage, …)
│       ├── health/         # 8 health calculators (BMI, BMR, body fat, …)
│       ├── conversion/     # 7 unit converters (length, weight, …)
│       ├── datetime/       # 4 date/time calculators
│       ├── math/           # 13 math calculators (algebra, stats, …)
│       ├── everyday/       # 5 everyday utilities
│       ├── statistics/     # Descriptive statistics
│       ├── trigonometry/   # Trig with DEG/RAD
│       ├── geometry/       # Area & volume
│       └── shared/         # FormCalculatorShell, RetroInput, ResultDisplay, …
├── hooks/
│   └── useKeyboardInput.ts # Keyboard input hook (used by Basic & Scientific)
├── lib/
│   ├── calc-engine.ts      # ⭐ Central calculation engine (mathjs, BigNumber)
│   ├── calculators.ts      # Catalog of every calculator (slug, category, …)
│   ├── calculator-components.tsx # Lazy resolver: slug → React component
│   ├── export-utils.ts     # Export calculated results to CSV / JSON
│   ├── formula-parser.ts   # Custom-formula parser used by the builder
│   └── url-serializer.ts   # Encode / decode calculator state in URLs
├── test/
│   └── engine.test.mjs     # 96 engine tests (run with `npx tsx`)
└── public/                 # Static assets (hero, icons, etc.)
```

---

## 🧪 Testing the Engine

The engine ships with **96 unit tests** covering unit conversion, financial formulas, health formulas, statistics, and BigNumber precision:

```bash
npx tsx test/engine.test.mjs
```

Expected output:

```
96 passed, 0 failed out of 96 tests
```

A typical `npx tsc --noEmit` should also pass with **no output**. ├── Testimonials.tsx    # Review schema and accessible carousel
│   ├── FAQ.tsx             # FAQPage schema with Question/Answer markup
│   ├── CTA.tsx             # Call-to-action with SoftwareApplication schema
│   ├── Footer.tsx          # Organization schema and semantic footer
│   ├── SegmentDisplay.tsx  # SVG drawing component for 14-segment characters
│   └── DigitalText.tsx     # Decimal-parsing parser wrapper for strings
└── public/
    └── hero.png            # Hero section background workspace image
```

---

## 🔍 SEO & GEO Optimization Guide

This project implements **comprehensive Search Engine Optimization (SEO)** and **Generative Engine Optimization (GEO)** techniques to maximize visibility on traditional search engines (Google, Bing, Yahoo, DuckDuckGo) and AI-powered search engines (ChatGPT, Perplexity, Google AI Mode, Bing Copilot, Claude).

### Technical SEO

#### 1. Metadata & Open Graph (`app/layout.tsx`)
- **Title Template**: `"%s | Calc_Craft — Free Online Calculators"`
- **Meta Description**: Optimized for keywords like "free online calculators", "BMI calculator", "loan calculator"
- **Open Graph**: `og:title`, `og:description`, `og:type=website`, `og:image` (1200x630), `og:locale=en_US`
- **Twitter Card**: `summary_large_image` with title, description, and image
- **Keywords**: 50+ targeted keywords including "free calculator", "online math tools", "percentage calculator", "scientific calculator online"
- **Robots**: `index, follow` with `max-image-preview:large`, `max-snippet:-1`, `max-video-preview:-1`
- **Verification Placeholders**: Google, Bing, Yandex site verification ready
- **Apple Web App**: `capable=yes`, `statusBarStyle=black-translucent`
- **Viewport Export**: `width=device-width, initial-scale=1, maximum-scale=5`

#### 2. Structured Data (JSON-LD)
Six Schema.org types are embedded in `app/layout.tsx` using `@graph`:

| Schema Type | Purpose |
|-------------|---------|
| **WebSite** | Site name, URL, search action (Sitelinks Searchbox) |
| **Organization** | Brand name, logo, URL, sameAs (social profiles) |
| **WebPage** | Page title, description, URL, breadcrumb reference |
| **BreadcrumbList** | Navigation hierarchy for rich snippets |
| **SoftwareApplication** | Application category, operating system, offers (Free) |
| **FAQPage** | Frequently asked questions for rich results |

#### 3. Microdata (Inline Schema Markup)
Each component includes inline Schema.org microdata:

- **Hero.tsx**: `itemScope itemType="https://schema.org/WebPageElement"` on H1
- **Features.tsx**: `itemScope itemType="https://schema.org/ItemList"` with `itemProp="name"`
- **WhyChooseUs.tsx**: `itemScope itemType="https://schema.org/Service"` with `ListItem` schema
- **HowItWorks.tsx**: `itemScope itemType="https://schema.org/HowTo"` with `HowToStep` items
- **PopularCalculators.tsx**: `itemScope itemType="https://schema.org/ItemList"` with `SoftwareApplication` per calculator
- **Testimonials.tsx**: `itemScope itemType="https://schema.org/Review"` on carousel
- **FAQ.tsx**: `itemScope itemType="https://schema.org/FAQPage"` with `Question` and `Answer` items
- **CTA.tsx**: `itemScope itemType="https://schema.org/SoftwareApplication"`
- **Footer.tsx**: `itemScope itemType="https://schema.org/Organization"` and `WPFooter`
- **CalculatorStack.tsx**: `itemScope itemType="https://schema.org/ItemList"`

#### 4. Crawler Management (`app/robots.ts`)
Custom rules for search engines and AI bots:
- **All bots**: `Allow: /`, `Disallow: /api/`, `Disallow: /admin/`
- **Googlebot**: Same rules with crawl delay hint
- **Bingbot**: Same rules
- **ChatGPT-User / GPTBot**: Allow all (GEO optimization)
- **PerplexityBot / Claude-Web**: Allow all (GEO optimization)

#### 5. XML Sitemap (`app/sitemap.ts`)
14 URLs with priorities and change frequencies:
- Homepage: `priority: 1.0`, `changefreq: 'daily'`
- Calculator categories: `priority: 0.8`, `changefreq: 'weekly'`
- Individual calculators: `priority: 0.6`, `changefreq: 'monthly'`
- Blog/About pages: `priority: 0.5`, `changefreq: 'weekly'`

#### 6. PWA Manifest (`app/manifest.ts`)
- App name, short name, description
- Theme colors and background colors
- Icons for all platforms
- **Calculator shortcuts**: Basic Calculator, BMI Calculator, Loan Calculator

### On-Page SEO

#### Semantic HTML
- `<main id="main-content" role="main" aria-label="Main content">` in `page.tsx`
- `<section>` with `aria-label` on every component
- `<nav>` with `aria-label` in `Navbar.tsx`
- `<footer>` with `itemType="https://schema.org/WPFooter"`
- SkLazy engine loading** — mathjs is only loaded on calculator pages, not the landing page
- **ip-to-content link for accessibility

#### Heading Hierarchy
- Single `<h1>` per page (Hero section)
- `<h2>` for section titles (Features, How It Works, Testimonials, FAQ, CTA)
- `<h3>` for card titles and subsections
- `<h4>` for footer link categories

#### Image Optimization
- All decorative icons have `aria-hidden="true"`
- Hero image has `role="img"` and `aria-label`
- WhyChooseUs image has descriptive `alt` text with keywords
- `loading="lazy"` and `sizes` attributes for performance

#### Internal Linking
- Anchor links (`#calculators`, `#builder`) for smooth scrolling
- Breadcrumb navigation structure in JSON-LD
- Related calculator suggestions in PopularCalculators

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

#### Entity SEO
- **Brand entity**: "Calc_Craft" consistently referenced across all schemas
4. Run the engine test suite:
   ```bash
   npx tsx test/engine.test.mjs
   ```

5. Type-check the project:
   ```bash
   npx tsc --noEmit
   ```

- **Product entities**: Each calculator defined as `SoftwareApplication`
- **Organization entity**: Full business details in Organization schema
- **WebSite entity**: Search action for Sitelinks Searchbox

### Performance SEO

#### Core Web Vitals
- **Static export** (`output: 'export'`) for instant page loads
- **Image optimization**: `images.unoptimized: true` with manual optimization
- **CSS optimization**: Tailwind purges unused styles
- **Animation performance**: GSAP and Framer Motion use `transform` and `opacity`
- **Lazy loading**: Images and below-fold components load on demand

#### Mobile Optimization
- **Responsive breakpoints**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- **Touch targets**: Minimum 44px for buttons and links
- **Viewport meta**: Proper scaling and zoom behavior
- **Mobile-first CSS**: Base styles for mobile, enhancements for desktop

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

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
This command compiles TypeScript and generates fully optimized static assets in the `.next` and `out` directories.

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

---

**Made with ❤️ by the Calc_Craft Team**

*Free online calculators for everyone, everywhere.*
