# CalcCraft 🧮

**CalcCraft** is a premium, modern, and highly interactive online calculator platform built with Next.js, React, Tailwind CSS, TypeScript, and Framer Motion. It blends modern minimal flat aesthetics with nostalgic digital hardware designs.

---

## 🚀 Key Features

### 1. Flat Digital Calculator Text Rendering Engine
CalcCraft features a custom, high-fidelity SVG-based **14-segment digital text display system** that recreates the look and feel of physical LED/LCD calculator displays without relying on third-party fonts:
- **Beveled SVG Polygons**: Hand-crafted coordinates for all 14 segments and a decimal point, providing clean and sharp edges at any scale.
- **Physical Display Characteristics**: Simulates a physical screen with a subtle forward slant (`skewX(-8deg)`) and light-grey segment shadows (`rgba(0,0,0,0.06)`) for inactive background elements.
- **Intellectual Decimal Parsing**: Automatically merges period (`.`) characters with their preceding digits into a single character cell, rendering decimals (e.g., `50+` or `12.5`) exactly like real hardware displays.
- **Power-On Startup Flicker**: Triggers a staggered vacuum-fluorescent VFD/LED flicker animation using Framer Motion when characters mount.
- **Multiple Styling Themes**:
  - `minimal` (Default): Floating, transparent background adapting to `currentColor`.
  - `lcd`: Classic Casio olive-green backing with dark slate segments.
  - `led-red` / `led-green` / `led-blue`: Glowing, high-contrast retro neon displays.

### 2. Animated Floating Header
The navigation menu has been fully upgraded to stand out cleanly from the Hero canvas:
- **Mount Slide Transition**: Slides smoothly from the top of the viewport on initial page load.
- **Dynamic Scroll States**: The header transitionally adjusts border sharpness, background opacity (`bg-white/85` vs `bg-white/95`), and shadow depth as the user scrolls, creating layered separation.
- **Magnetic Hover Pill**: Uses Framer Motion `layoutId` to slide a highlighting capsule smoothly behind menu items as you hover over links.
- **Streamlined CTA**: Features a high-contrast black `"Start Building"` action button with micro-scale click transitions.
- **Accessability & SEO**: Retains a hidden `h1` outline for page index crawl search engines.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & CSS Variables
- **Animations**: Framer Motion & GSAP
- **Icons**: Lucide React

---

## 📂 Project Structure

```bash
├── app/
│   ├── globals.css         # Global stylesheets and animations
│   ├── layout.tsx          # Root HTML layout and metadata
│   └── page.tsx            # Main page composition
├── components/
│   ├── Navbar.tsx          # Animated floating header with magnetic nav pills
│   ├── Hero.tsx            # Landing section utilizing flat DigitalText
│   ├── SegmentDisplay.tsx  # SVG drawing component for 14-segment characters
│   ├── DigitalText.tsx     # Decimal-parsing parser wrapper for strings
│   ├── Features.tsx        # Features cards with GSAP ScrollTrigger
│   └── WhyChooseUs.tsx     # Badges styling with flat SegmentDisplay
└── public/
    └── hero.png            # Hero section background workspace image
```

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
