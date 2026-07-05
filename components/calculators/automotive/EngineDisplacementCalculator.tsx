'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function EngineDisplacementCalculator() {
  const [bore, setBore] = useState('86')
  const [stroke, setStroke] = useState('86')
  const [cylinders, setCylinders] = useState('4')

  const b = parseFloat(bore), s = parseFloat(stroke), c = parseInt(cylinders)
  const valid = !isNaN(b) && !isNaN(s) && !isNaN(c) && b > 0 && s > 0 && c > 0
  // Displacement = π/4 × bore² × stroke × cylinders (in mm → convert to cc)
  const displacement = valid ? (Math.PI / 4) * b * b * s * c / 1000 : 0 // cc
  const liters = valid ? displacement / 1000 : 0

  return (
    <FormCalculatorShell title="Engine Displacement" subtitle="V = π/4 × B² × S × C" badge="AUTOMOTIVE">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Bore" value={bore} onChange={setBore} placeholder="86" id="ed-b" unit="mm" />
        <RetroInput label="Stroke" value={stroke} onChange={setStroke} placeholder="86" id="ed-s" unit="mm" />
      </div>
      <RetroInput label="Cylinders" value={cylinders} onChange={setCylinders} placeholder="4" id="ed-c" unit="" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Displacement" value={displacement.toFixed(0)} unit="cc" large />
            <ResultDisplay label="Liters" value={liters.toFixed(2)} unit="L" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Engine Cylinders</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="edGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#edGrid)" rx="8" />
              {Array.from({ length: Math.min(c, 6) }).map((_, i) => (
                <g key={i}>
                  <path d={wobblyBar(20 + i * 22, 20, 18, 30)} fill="#a78bfa" fillOpacity="0.2" stroke="#7c3aed" strokeWidth="1.5" />
                  <circle cx={29 + i * 22} cy="35" r="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                </g>
              ))}
              <text x="80" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">{displacement.toFixed(0)}cc / {liters.toFixed(1)}L</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}