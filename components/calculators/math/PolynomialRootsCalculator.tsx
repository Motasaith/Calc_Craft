'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PolynomialRootsCalculator() {
  const [degree, setDegree] = useState('2')
  const [a, setA] = useState('1'), [b, setB] = useState('-3'), [cV, setC] = useState('2')
  const [d, setD] = useState('1'), [e, setE] = useState('0')

  const A = parseFloat(a), B = parseFloat(b), C = parseFloat(cV), D = parseFloat(d), E = parseFloat(e)
  const deg = parseInt(degree, 10)
  const valid = deg === 1 ? [A, B].every((v) => !isNaN(v)) && A !== 0
    : deg === 2 ? [A, B, C].every((v) => !isNaN(v)) && A !== 0
    : deg === 3 ? [A, B, C, D].every((v) => !isNaN(v)) && A !== 0
    : false

  const roots: number[] = []
  if (valid) {
    if (deg === 1) roots.push(-B / A)
    else if (deg === 2) {
      const disc = B * B - 4 * A * C
      if (disc >= 0) { roots.push((-B + Math.sqrt(disc)) / (2 * A)); roots.push((-B - Math.sqrt(disc)) / (2 * A)) }
    } else if (deg === 3) {
      // depressed cubic via Cardano
      const p = (3 * A * C - B * B) / (3 * A * A)
      const q = (2 * B * B * B - 9 * A * B * C + 27 * A * A * D) / (27 * A * A * A)
      const disc = q * q / 4 + p * p * p / 27
      if (disc > 0) {
        const u = Math.cbrt(-q / 2 + Math.sqrt(disc))
        roots.push(u - p / (3 * u) - B / (3 * A))
      } else if (disc === 0) {
        roots.push(3 * q / p - B / (3 * A))
        roots.push(-3 * q / (2 * p) - B / (3 * A))
      } else {
        const r = Math.sqrt(-p * p * p / 27)
        const phi = Math.acos(-q / (2 * r))
        for (let k = 0; k < 3; k++) {
          roots.push(2 * Math.cbrt(r) * Math.cos((phi + 2 * Math.PI * k) / 3) - B / (3 * A))
        }
      }
    }
  }

  return (
    <FormCalculatorShell title="Polynomial Roots" subtitle="Real roots up to degree 3" badge="MATH">
      <RetroSelect label="Degree" value={degree} onChange={setDegree} id="pr-deg" options={[
        { value: '1', label: 'Linear (ax+b)' },
        { value: '2', label: 'Quadratic (ax²+bx+c)' },
        { value: '3', label: 'Cubic (ax³+bx²+cx+d)' },
      ]} />
      <div className="grid grid-cols-2 gap-2">
        <RetroInput label="a" value={a} onChange={setA} id="pr-a" />
        <RetroInput label="b" value={b} onChange={setB} id="pr-b" />
        {deg >= 2 && <RetroInput label="c" value={cV} onChange={setC} id="pr-c" />}
        {deg >= 3 && <RetroInput label="d" value={d} onChange={setD} id="pr-d" />}
      </div>
      {valid && roots.length === 0 && <div className="mt-3 text-xs font-mono text-amber-600 text-center font-bold">No real roots</div>}
      {valid && roots.length > 0 && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Real roots" value={roots.map((r) => r.toFixed(4)).join(', ')} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Roots on Axis</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="prGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#prGrid)" rx="8" />
              <line x1="20" y1="40" x2="160" y2="40" stroke="#9ca3af" strokeWidth="1" />
              {roots.slice(0, 4).map((r, idx) => (
                <circle key={idx} cx={Math.max(25, Math.min(155, 90 + r * 10))} cy="40" r="4" fill="#ab3232" />
              ))}
              <text x="90" y="70" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">{roots.length} root(s)</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}