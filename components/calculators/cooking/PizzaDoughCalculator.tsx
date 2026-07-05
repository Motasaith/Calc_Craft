'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PizzaDoughCalculator() {
  const [pizzas, setPizzas] = useState('2')
  const [size, setSize] = useState('300')

  const p = parseFloat(pizzas), s = parseFloat(size)
  const valid = !isNaN(p) && !isNaN(s) && p > 0 && s > 0
  // Dough ball weight ~ size in mm × 0.5 per pizza
  const doughPerPizza = valid ? s * 0.5 : 0
  const totalDough = valid ? doughPerPizza * p : 0
  // Baker's percentages: flour 100%, water 65%, salt 2%, yeast 1%
  const flour = valid ? totalDough * 0.613 : 0
  const water = valid ? totalDough * 0.398 : 0
  const salt = valid ? totalDough * 0.012 : 0
  const yeast = valid ? totalDough * 0.006 : 0

  return (
    <FormCalculatorShell title="Pizza Dough" subtitle="Baker's percentages" badge="COOKING">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Number of Pizzas" value={pizzas} onChange={setPizzas} placeholder="2" id="pd-p" unit="" />
        <RetroInput label="Pizza Size" value={size} onChange={setSize} placeholder="300" id="pd-s" unit="mm" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Flour" value={flour.toFixed(0)} unit="g" large />
            <ResultDisplay label="Water" value={water.toFixed(0)} unit="g" large />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <ResultDisplay label="Salt" value={salt.toFixed(1)} unit="g" />
            <ResultDisplay label="Yeast" value={yeast.toFixed(1)} unit="g" />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Dough Ball</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="pdGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#pdGrid)" rx="8" />
              <path d={wobblyBar(30, 15, 100, 40)} fill="none" stroke="#78716c" strokeWidth="2" />
              <path d={wobblyBar(30, 15 + 40 - Math.min(40, totalDough / 20), 100, Math.min(40, totalDough / 20))} fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
              <text x="80" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#d97706" fontWeight="bold">{totalDough.toFixed(0)}g total dough</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}