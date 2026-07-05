'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function MegapixelCalculator() {
  const [width, setWidth] = useState('4000')
  const [height, setHeight] = useState('3000')

  const w = parseFloat(width), h = parseFloat(height)
  const valid = !isNaN(w) && !isNaN(h) && w > 0 && h > 0
  const totalPixels = valid ? w * h : 0
  const megapixels = valid ? totalPixels / 1e6 : 0

  return (
    <FormCalculatorShell title="Megapixel Calculator" subtitle="MP = (W × H) / 1,000,000" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Width" value={width} onChange={setWidth} placeholder="4000" id="mp-w" unit="px" />
        <RetroInput label="Height" value={height} onChange={setHeight} placeholder="3000" id="mp-h" unit="px" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Megapixels" value={megapixels.toFixed(2)} unit="MP" large />
            <ResultDisplay label="Total Pixels" value={totalPixels.toFixed(0)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Resolution Grid</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="mpGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#mpGrid)" rx="8" />
              <path d={wobblyRect(20, 10, 120, 55)} fill="#78716c" fillOpacity="0.1" stroke="#57534e" strokeWidth="2" />
              {/* Pixel grid pattern */}
              {Array.from({ length: 5 }).map((_, row) => (
                Array.from({ length: 8 }).map((_, col) => (
                  <rect key={`${row}-${col}`} x={22 + col * 14.5} y={12 + row * 10} width="3" height="3" fill="#57534e" fillOpacity="0.3" />
                ))
              ))}
              <text x="80" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#57534e" fontWeight="bold">{megapixels.toFixed(1)} MP</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}