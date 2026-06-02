'use client'

import React from 'react'

export type SegmentTheme = 'lcd' | 'led-red' | 'led-green' | 'led-blue' | 'minimal'

interface SegmentDisplayProps {
  char: string
  theme?: SegmentTheme
  size?: number // height in px
  activeColor?: string
  inactiveColor?: string
  showDP?: boolean
}

// 14-Segment Names
export type SegmentName =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G1'
  | 'G2'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'DP'

// Character to segments mapping
const CHARACTER_MAP: Record<string, SegmentName[]> = {
  'A': ['A', 'B', 'C', 'E', 'F', 'G1', 'G2'],
  'B': ['A', 'B', 'C', 'D', 'I', 'L', 'G2'],
  'C': ['A', 'D', 'E', 'F'],
  'D': ['A', 'B', 'C', 'D', 'I', 'L'],
  'E': ['A', 'D', 'E', 'F', 'G1', 'G2'],
  'F': ['A', 'E', 'F', 'G1'],
  'G': ['A', 'C', 'D', 'E', 'F', 'G2'],
  'H': ['B', 'C', 'E', 'F', 'G1', 'G2'],
  'I': ['A', 'D', 'I', 'L'],
  'J': ['B', 'C', 'D', 'E'],
  'K': ['E', 'F', 'G1', 'J', 'M'],
  'L': ['D', 'E', 'F'],
  'M': ['B', 'C', 'E', 'F', 'H', 'J'],
  'N': ['B', 'C', 'E', 'F', 'H', 'M'],
  'O': ['A', 'B', 'C', 'D', 'E', 'F'],
  'P': ['A', 'B', 'E', 'F', 'G1', 'G2'],
  'Q': ['A', 'B', 'C', 'D', 'E', 'F', 'M'],
  'R': ['A', 'B', 'E', 'F', 'G1', 'G2', 'M'],
  'S': ['A', 'C', 'D', 'F', 'G1', 'G2'],
  'T': ['A', 'I', 'L'],
  'U': ['B', 'C', 'D', 'E', 'F'],
  'V': ['E', 'F', 'K', 'J'],
  'W': ['B', 'C', 'E', 'F', 'K', 'M'],
  'X': ['H', 'J', 'K', 'M'],
  'Y': ['H', 'J', 'L'],
  'Z': ['A', 'D', 'J', 'K'],
  '0': ['A', 'B', 'C', 'D', 'E', 'F'],
  '1': ['B', 'C'],
  '2': ['A', 'B', 'G1', 'G2', 'E', 'D'],
  '3': ['A', 'B', 'C', 'D', 'G1', 'G2'],
  '4': ['F', 'B', 'G1', 'G2', 'C'],
  '5': ['A', 'F', 'G1', 'G2', 'C', 'D'],
  '6': ['A', 'F', 'E', 'D', 'C', 'G1', 'G2'],
  '7': ['A', 'B', 'C'],
  '8': ['A', 'B', 'C', 'D', 'E', 'F', 'G1', 'G2'],
  '9': ['A', 'B', 'C', 'D', 'F', 'G1', 'G2'],
  '-': ['G1', 'G2'],
  '_': ['D'],
  '=': ['G1', 'G2', 'D'],
  '+': ['G1', 'G2', 'I', 'L'],
  '/': ['J', 'K'],
  '\\': ['H', 'M'],
  '*': ['G1', 'G2', 'I', 'L', 'H', 'J', 'K', 'M'],
  '?': ['A', 'B', 'G2', 'L'], // Close approximation
  '!': ['I', 'L', 'DP'], // Vertical line + dot
  '.': ['DP'],
  ':': ['I', 'L'],
  ' ': [],
}

// 14-Segment SVG Polygons coordinates in a 80x120 viewport
const SEGMENT_PATHS: Record<Exclude<SegmentName, 'DP'>, string> = {
  // Top horizontal
  A: '14,10 66,10 60,16 20,16',
  // Top-right vertical
  B: '70,14 70,56 64,52 64,20',
  // Bottom-right vertical
  C: '70,64 70,106 64,100 64,70',
  // Bottom horizontal
  D: '20,104 60,104 66,110 14,110',
  // Bottom-left vertical
  E: '10,64 16,70 16,100 10,106',
  // Top-left vertical
  F: '10,14 16,20 16,52 10,56',
  // Middle-left horizontal
  G1: '14,60 18,56 36,56 38,60 36,64 18,64',
  // Middle-right horizontal
  G2: '42,60 44,56 62,56 66,60 62,64 44,64',
  // Top vertical center
  I: '40,14 43,17 43,52 40,55 37,52 37,17',
  // Bottom vertical center
  L: '40,65 43,68 43,103 40,106 37,103 37,68',
  // Top-left diagonal
  H: '19,19 22,17 38,52 35,55 32,55 17,22',
  // Top-right diagonal
  J: '61,19 63,22 48,55 45,55 42,52 58,17',
  // Bottom-left diagonal
  K: '19,101 17,98 32,65 35,65 38,68 22,103',
  // Bottom-right diagonal
  M: '61,101 58,103 42,68 45,65 48,65 63,98',
}

export default function SegmentDisplay({
  char,
  theme = 'minimal',
  size,
  activeColor,
  inactiveColor,
  showDP = false,
}: SegmentDisplayProps) {
  // Normalize character to uppercase
  const upperChar = char.toUpperCase()
  const baseSegments = CHARACTER_MAP[upperChar] || []
  const activeSegments = showDP && !baseSegments.includes('DP')
    ? [...baseSegments, 'DP' as SegmentName]
    : baseSegments

  // Theme styling definitions
  let containerBg = 'bg-transparent'
  let strokeActive = activeColor || 'currentColor'
  let strokeInactive = inactiveColor || 'rgba(0,0,0,0.04)'
  let ledGlow = ''
  let displayBorder = ''
  let padding = 'p-0'
  let borderRadius = 'rounded-none'

  if (theme === 'lcd') {
    // Casio LCD style: Olive green-gray background, dark charcoal active, faint dark shadow inactive
    containerBg = 'bg-[#cad5c5] shadow-inner shadow-black/10'
    strokeActive = activeColor || '#1a1d1a'
    strokeInactive = inactiveColor || '#b8c3b3'
    displayBorder = 'border-2 border-[#a3b19e] border-b-[#d5e0d1] border-r-[#d5e0d1]'
    padding = 'p-1'
    borderRadius = 'rounded-sm'
  } else if (theme === 'led-red') {
    // Vintage glowing red LED
    containerBg = 'bg-[#120202]'
    strokeActive = activeColor || '#ff3333'
    strokeInactive = inactiveColor || 'rgba(255, 51, 51, 0.05)'
    ledGlow = 'drop-shadow([0_0_4px_rgba(255,51,51,0.6)])'
    displayBorder = 'border border-red-950'
    padding = 'p-1'
    borderRadius = 'rounded-md'
  } else if (theme === 'led-green') {
    // Glowing green LED
    containerBg = 'bg-[#021204]'
    strokeActive = activeColor || '#33ff55'
    strokeInactive = inactiveColor || 'rgba(51, 255, 85, 0.05)'
    ledGlow = 'drop-shadow([0_0_4px_rgba(51,255,85,0.6)])'
    displayBorder = 'border border-green-950'
    padding = 'p-1'
    borderRadius = 'rounded-md'
  } else if (theme === 'led-blue') {
    // Glowing cyber blue LED
    containerBg = 'bg-[#020a1c]'
    strokeActive = activeColor || '#33a3ff'
    strokeInactive = inactiveColor || 'rgba(51, 163, 255, 0.05)'
    ledGlow = 'drop-shadow([0_0_4px_rgba(51,163,255,0.6)])'
    displayBorder = 'border border-blue-950'
    padding = 'p-1'
    borderRadius = 'rounded-md'
  } else if (theme === 'minimal') {
    // Minimal transparent style
    strokeActive = activeColor || 'currentColor'
    strokeInactive = inactiveColor || 'rgba(0, 0, 0, 0.06)'
  }

  return (
    <div
      className={`inline-block select-none overflow-hidden transition-all duration-300 ${containerBg} ${displayBorder} ${padding} ${borderRadius}`}
      style={{
        height: size !== undefined ? `${size}px` : 'var(--char-height, 80px)',
        aspectRatio: '2/3',
      }}
    >
      <svg
        viewBox="0 0 80 120"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform"
        style={{
          // Calculator slanting slant display skew
          transform: 'skewX(-8deg)',
          transformOrigin: 'center',
        }}
      >
        {/* Render 14 polygon segments */}
        {Object.entries(SEGMENT_PATHS).map(([name, points]) => {
          const isActive = activeSegments.includes(name as SegmentName)
          return (
            <polygon
              key={name}
              points={points}
              fill={isActive ? strokeActive : strokeInactive}
              className={`transition-all duration-200 ${isActive ? ledGlow : ''}`}
            />
          )
        })}

        {/* Render Decimal Point */}
        <circle
          cx={75}
          cy={107}
          r={4}
          fill={activeSegments.includes('DP') ? strokeActive : strokeInactive}
          className={`transition-all duration-200 ${activeSegments.includes('DP') ? ledGlow : ''}`}
        />
      </svg>
    </div>
  )
}
