'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CubeRootCalculator() {
  const [num, setNum] = useState('27')

  const x = parseFloat(num)
  const valid = !isNaN(x)
  const cubeRoot = valid ? Math.cbrt(x) : 0

  return (
    <FormCalculatorShell title="Cube Root Calculator" subtitle="∛x" badge="MATH">
      <RetroInput label="Number x" value={num} onChange={setNum} placeholder="e.g. 27" id="cb-x" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label={`∛${x} =`} value={cubeRoot.toFixed(6)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Cube Volume</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="cbGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#cbGrid)" rx="8" />
              <path d={wobblyBar(60, 20, 50, 50)} fill="#dfaa44" fillOpacity="0.3" stroke="#be8b32" strokeWidth="2" />
              <line x1="60" y1="20" x2="75" y2="10" stroke="#be8b32" strokeWidth="2" />
              <line x1="110" y1="20" x2="125" y2="10" stroke="#be8b32" strokeWidth="2" />
              <line x1="75" y1="10" x2="125" y2="10" stroke="#be8b32" strokeWidth="2" />
              <line x1="125" y1="10" x2="125" y2="60" stroke="#be8b32" strokeWidth="2" />
              <text x="90" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">side={cubeRoot.toFixed(2)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}