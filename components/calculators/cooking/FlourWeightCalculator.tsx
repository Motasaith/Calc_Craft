'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function FlourWeightCalculator() {
  const [cups, setCups] = useState('2')
  const [type, setType] = useState('all-purpose')

  const c = parseFloat(cups)
  const valid = !isNaN(c) && c > 0
  const densities: Record<string, number> = {
    'all-purpose': 120, 'bread': 136, 'cake': 114, 'whole-wheat': 120, 'rye': 102, 'self-raising': 120,
  }
  const gPerCup = densities[type] || 120
  const grams = valid ? c * gPerCup : 0

  return (
    <FormCalculatorShell title="Flour Weight" subtitle="Cups → grams by flour type" badge="COOKING">
      <RetroInput label="Cups" value={cups} onChange={setCups} placeholder="2" id="fw-c" unit="cups" />
      <RetroInput label="Flour Type" value={type} onChange={setType} placeholder="all-purpose" id="fw-t" unit="" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Weight" value={grams.toFixed(0)} unit="g" large />
            <ResultDisplay label="Per Cup" value={gPerCup} unit="g/cup" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Flour Weight</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="fwGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#fwGrid)" rx="8" />
              <path d={wobblyBar(30, 15, 100, 40)} fill="none" stroke="#78716c" strokeWidth="2" />
              <path d={wobblyBar(30, 15 + 40 - Math.min(40, grams / 15), 100, Math.min(40, grams / 15))} fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
              <text x="80" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#d97706" fontWeight="bold">{grams.toFixed(0)}g</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}