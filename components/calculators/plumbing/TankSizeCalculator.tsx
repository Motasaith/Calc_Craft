'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function TankSizeCalculator() {
  const [length, setLength] = useState('48')
  const [width, setWidth] = useState('24')
  const [height, setHeight] = useState('30')

  const l = parseFloat(length), w = parseFloat(width), h = parseFloat(height)
  const valid = !isNaN(l) && !isNaN(w) && !isNaN(h) && l > 0 && w > 0 && h > 0
  // dimensions in inches → volume in gallons: V = (l × w × h) / 231
  const volumeGal = valid ? (l * w * h) / 231 : 0
  const volumeL = volumeGal * 3.78541

  return (
    <FormCalculatorShell title="Tank Size Calculator" subtitle="V = L × W × H / 231" badge="PLUMBING">
      <RetroInput label="Tank Length" value={length} onChange={setLength} placeholder="48" id="ts-l" unit="in" />
      <RetroInput label="Tank Width" value={width} onChange={setWidth} placeholder="24" id="ts-w" unit="in" />
      <RetroInput label="Tank Height" value={height} onChange={setHeight} placeholder="30" id="ts-h" unit="in" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Volume" value={volumeGal.toFixed(2)} unit="gal" large />
            <ResultDisplay label="Volume" value={volumeL.toFixed(2)} unit="L" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Tank Shape</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="tsGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#tsGrid)" rx="8" />
              <path d={wobblyBar(30, 15, 100, 60)} fill="#60a5fa" fillOpacity="0.25" stroke="#2563eb" strokeWidth="2" />
              <path d={wobblyBar(35, 20, 90, 50)} fill="#60a5fa" fillOpacity="0.15" stroke="#2563eb" strokeWidth="1" />
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb" fontWeight="bold">{volumeGal.toFixed(0)} gal</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}