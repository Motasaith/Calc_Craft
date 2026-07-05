'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function RecipeScalerCalculator() {
  const [originalServings, setOriginalServings] = useState('4')
  const [desiredServings, setDesiredServings] = useState('6')
  const [amount, setAmount] = useState('200')

  const os = parseFloat(originalServings), ds = parseFloat(desiredServings), a = parseFloat(amount)
  const valid = !isNaN(os) && !isNaN(ds) && !isNaN(a) && os > 0 && ds > 0 && a > 0
  const factor = valid ? ds / os : 0
  const newAmount = valid ? a * factor : 0

  return (
    <FormCalculatorShell title="Recipe Scaler" subtitle="New = Original × (desired/original)" badge="COOKING">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Original Servings" value={originalServings} onChange={setOriginalServings} placeholder="4" id="rs-os" unit="" />
        <RetroInput label="Desired Servings" value={desiredServings} onChange={setDesiredServings} placeholder="6" id="rs-ds" unit="" />
      </div>
      <RetroInput label="Ingredient Amount" value={amount} onChange={setAmount} placeholder="200" id="rs-a" unit="g" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Scale Factor" value={factor.toFixed(2)} unit="×" large />
            <ResultDisplay label="New Amount" value={newAmount.toFixed(1)} unit="g" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Portion Comparison</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="rsGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#rsGrid)" rx="8" />
              <path d={wobblyBar(25, 15, 40, Math.min(40, a / 10))} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="2" />
              <text x="45" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#d97706">Original</text>
              <path d={wobblyBar(95, 15 + 40 - Math.min(40, newAmount / 10), 40, Math.min(40, newAmount / 10))} fill="#f97316" fillOpacity="0.3" stroke="#ea580c" strokeWidth="2" />
              <text x="115" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#ea580c">Scaled</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}