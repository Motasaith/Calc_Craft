'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function SystemEquationsCalculator() {
  const [a1, setA1] = useState('2')
  const [b1, setB1] = useState('3')
  const [c1, setC1] = useState('8')
  const [a2, setA2] = useState('4')
  const [b2, setB2] = useState('-1')
  const [c2, setC2] = useState('2')

  const A1 = parseFloat(a1), B1 = parseFloat(b1), C1 = parseFloat(c1)
  const A2 = parseFloat(a2), B2 = parseFloat(b2), C2 = parseFloat(c2)
  const valid = [A1, B1, C1, A2, B2, C2].every((v) => !isNaN(v))
  const det = valid ? A1 * B2 - A2 * B1 : 0
  const detX = valid ? C1 * B2 - C2 * B1 : 0
  const detY = valid ? A1 * C2 - A2 * C1 : 0
  const hasSolution = valid && det !== 0
  const x = hasSolution ? detX / det : 0
  const y = hasSolution ? detY / det : 0

  return (
    <FormCalculatorShell title="System of Equations" subtitle="2×2 linear system (Cramer's rule)" badge="MATH">
      <div className="text-[10px] font-mono text-neutral-500 mb-2">a₁x + b₁y = c₁ &nbsp;|&nbsp; a₂x + b₂y = c₂</div>
      <div className="grid grid-cols-3 gap-2">
        <RetroInput label="a₁" value={a1} onChange={setA1} id="se-a1" />
        <RetroInput label="b₁" value={b1} onChange={setB1} id="se-b1" />
        <RetroInput label="c₁" value={c1} onChange={setC1} id="se-c1" />
        <RetroInput label="a₂" value={a2} onChange={setA2} id="se-a2" />
        <RetroInput label="b₂" value={b2} onChange={setB2} id="se-b2" />
        <RetroInput label="c₂" value={c2} onChange={setC2} id="se-c2" />
      </div>
      {valid && !hasSolution && <div className="mt-3 text-xs font-mono text-amber-600 text-center font-bold">No unique solution (determinant = 0)</div>}
      {hasSolution && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="x =" value={x.toFixed(4)} large />
            <ResultDisplay label="y =" value={y.toFixed(4)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Intersection</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="seGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#seGrid)" rx="8" />
              <line x1="20" y1="60" x2="160" y2="60" stroke="#9ca3af" strokeWidth="1" />
              <line x1="90" y1="10" x2="90" y2="70" stroke="#9ca3af" strokeWidth="1" />
              <line x1="30" y1="20" x2="150" y2="65" stroke="#3b82f6" strokeWidth="2" />
              <line x1="30" y1="65" x2="150" y2="25" stroke="#ef4444" strokeWidth="2" />
              <circle cx="90" cy="45" r="4" fill="#059669" />
              <text x="100" y="42" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">({x.toFixed(1)},{y.toFixed(1)})</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}