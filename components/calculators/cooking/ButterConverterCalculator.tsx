'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ButterConverterCalculator() {
  const [cups, setCups] = useState('1')

  const c = parseFloat(cups)
  const valid = !isNaN(c) && c > 0
  // 1 cup butter = 227g = 2 sticks = 16 tbsp
  const grams = valid ? c * 227 : 0
  const sticks = valid ? c * 2 : 0
  const tbsp = valid ? c * 16 : 0

  return (
    <FormCalculatorShell title="Butter Converter" subtitle="Cups ↔ grams ↔ sticks ↔ tbsp" badge="COOKING">
      <RetroInput label="Cups" value={cups} onChange={setCups} placeholder="1" id="bc-c" unit="cups" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ResultDisplay label="Grams" value={grams.toFixed(0)} unit="g" />
            <ResultDisplay label="Sticks" value={sticks.toFixed(1)} />
            <ResultDisplay label="Tbsp" value={tbsp.toFixed(0)} />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Butter Sticks</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="bcGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#bcGrid)" rx="8" />
              {Array.from({ length: Math.min(4, Math.ceil(sticks)) }).map((_, i) => (
                <path key={i} d={wobblyBar(20 + i * 40, 25, 35, 20)} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="1.5" />
              ))}
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#d97706" fontWeight="bold">{sticks.toFixed(1)} sticks = {grams.toFixed(0)}g</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}