'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function BrineCalculator() {
  const [meatWeight, setMeatWeight] = useState('1000')
  const [saltPct, setSaltPct] = useState('5')

  const mw = parseFloat(meatWeight), sp = parseFloat(saltPct)
  const valid = !isNaN(mw) && !isNaN(sp) && mw > 0 && sp > 0
  const water = valid ? mw * 4 : 0 // 4x water to meat weight
  const salt = valid ? (water * sp) / 100 : 0
  const sugar = valid ? salt * 0.5 : 0

  return (
    <FormCalculatorShell title="Brine Calculator" subtitle="Salt water for meat" badge="COOKING">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Meat Weight" value={meatWeight} onChange={setMeatWeight} placeholder="1000" id="br-mw" unit="g" />
        <RetroInput label="Salt %" value={saltPct} onChange={setSaltPct} placeholder="5" id="br-sp" unit="%" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ResultDisplay label="Water" value={water.toFixed(0)} unit="g" />
            <ResultDisplay label="Salt" value={salt.toFixed(0)} unit="g" />
            <ResultDisplay label="Sugar" value={sugar.toFixed(0)} unit="g" />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Brine Mix</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="brGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#brGrid)" rx="8" />
              <path d={wobblyBar(20, 15, 50, Math.min(40, water / 50))} fill="#60a5fa" fillOpacity="0.3" stroke="#2563eb" strokeWidth="2" />
              <text x="45" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#2563eb">Water</text>
              <path d={wobblyBar(80, 15 + 40 - Math.min(40, salt * 2), 30, Math.min(40, salt * 2))} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
              <text x="95" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#9ca3af">Salt</text>
              <path d={wobblyBar(120, 15 + 40 - Math.min(40, sugar * 2), 30, Math.min(40, sugar * 2))} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="2" />
              <text x="135" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#d97706">Sugar</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}