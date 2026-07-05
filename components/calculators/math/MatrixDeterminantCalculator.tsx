'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function MatrixDeterminantCalculator() {
  const [size, setSize] = useState('2')
  const [a, setA] = useState('1'), [b, setB] = useState('2')
  const [c, setC] = useState('3'), [d, setD] = useState('4')
  const [e, setE] = useState('5'), [f, setF] = useState('6')
  const [g, setG] = useState('7'), [hV, setH] = useState('8'), [iV, setI] = useState('9')

  const A = parseFloat(a), B = parseFloat(b), C = parseFloat(c), D = parseFloat(d)
  const E = parseFloat(e), F = parseFloat(f), G = parseFloat(g), H = parseFloat(hV), I = parseFloat(iV)
  const is3 = size === '3'
  const vals = is3 ? [A, B, C, D, E, F, G, H, I] : [A, B, C, D]
  const valid = vals.every((v) => !isNaN(v))
  let det = 0
  if (valid) {
    det = is3
      ? A * (E * I - F * H) - B * (D * I - F * G) + C * (D * H - E * G)
      : A * D - B * C
  }

  return (
    <FormCalculatorShell title="Matrix Determinant" subtitle="2×2 or 3×3 determinant" badge="MATH">
      <RetroSelect label="Matrix size" value={size} onChange={setSize} id="md-size" options={[
        { value: '2', label: '2 × 2' },
        { value: '3', label: '3 × 3' },
      ]} />
      <div className="grid grid-cols-2 gap-2">
        <RetroInput label="a" value={a} onChange={setA} id="md-a" />
        <RetroInput label="b" value={b} onChange={setB} id="md-b" />
        <RetroInput label="c" value={c} onChange={setC} id="md-c" />
        <RetroInput label="d" value={d} onChange={setD} id="md-d" />
      </div>
      {is3 && (
        <div className="grid grid-cols-3 gap-2">
          <RetroInput label="e" value={e} onChange={setE} id="md-e" />
          <RetroInput label="f" value={f} onChange={setF} id="md-f" />
          <RetroInput label="g" value={g} onChange={setG} id="md-g" />
          <RetroInput label="h" value={hV} onChange={setH} id="md-h" />
          <RetroInput label="i" value={iV} onChange={setI} id="md-i" />
        </div>
      )}
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Determinant" value={det.toFixed(4)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Matrix</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="mdGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#mdGrid)" rx="8" />
              <path d={wobblyBar(50, 15, 80, is3 ? 50 : 35)} fill="none" stroke="#1a2019" strokeWidth="2" />
              <text x="90" y={is3 ? 35 : 38} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#1a2019" fontWeight="bold">det = {det.toFixed(2)}</text>
              <text x="90" y="70" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">{is3 ? '3×3' : '2×2'}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}