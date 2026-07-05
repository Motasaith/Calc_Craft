'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function AspectRatioCalculator() {
  const [width, setWidth] = useState('1920')
  const [height, setHeight] = useState('1080')

  const w = parseFloat(width), h = parseFloat(height)
  const valid = !isNaN(w) && !isNaN(h) && w > 0 && h > 0
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
  const g = valid ? gcd(Math.round(w), Math.round(h)) : 1
  const ratioW = valid ? Math.round(w) / g : 0
  const ratioH = valid ? Math.round(h) / g : 0
  const decimal = valid ? w / h : 0

  return (
    <FormCalculatorShell title="Aspect Ratio" subtitle="Simplify W:H ratio" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Width" value={width} onChange={setWidth} placeholder="1920" id="ar-w" unit="px" />
        <RetroInput label="Height" value={height} onChange={setHeight} placeholder="1080" id="ar-h" unit="px" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Ratio" value={`${ratioW}:${ratioH}`} large />
            <ResultDisplay label="Decimal" value={decimal.toFixed(4)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Aspect Visual</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="arGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#arGrid)" rx="8" />
              <path d={wobblyRect(20, 10, Math.min(120, (w / Math.max(w, h)) * 120), Math.min(55, (h / Math.max(w, h)) * 55))} fill="#78716c" fillOpacity="0.15" stroke="#57534e" strokeWidth="2" />
              <text x="80" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#57534e" fontWeight="bold">{ratioW}:{ratioH}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}