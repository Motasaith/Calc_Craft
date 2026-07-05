'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ComplexNumberCalculator() {
  const [r1, setR1] = useState('3')
  const [i1, setI1] = useState('2')
  const [r2, setR2] = useState('1')
  const [i2, setI2] = useState('-4')
  const [op, setOp] = useState('add')

  const a = parseFloat(r1), b = parseFloat(i1), c = parseFloat(r2), d = parseFloat(i2)
  const valid = [a, b, c, d].every((v) => !isNaN(v))
  let re = 0, im = 0
  if (valid) {
    switch (op) {
      case 'add': re = a + c; im = b + d; break
      case 'sub': re = a - c; im = b - d; break
      case 'mul': re = a * c - b * d; im = a * d + b * c; break
      case 'div': { const den = c * c + d * d; re = (a * c + b * d) / den; im = (b * c - a * d) / den; break }
    }
  }
  const ok = valid && isFinite(re) && isFinite(im)
  const mag = ok ? Math.sqrt(re * re + im * im) : 0

  return (
    <FormCalculatorShell title="Complex Number Calculator" subtitle="Add, subtract, multiply, divide" badge="MATH">
      <div className="text-[10px] font-mono text-neutral-500 mb-2">z₁ = a + bi &nbsp; z₂ = c + di</div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Real a (z₁)" value={r1} onChange={setR1} id="cn-r1" />
        <RetroInput label="Imag b (z₁)" value={i1} onChange={setI1} id="cn-i1" />
        <RetroInput label="Real c (z₂)" value={r2} onChange={setR2} id="cn-r2" />
        <RetroInput label="Imag d (z₂)" value={i2} onChange={setI2} id="cn-i2" />
      </div>
      <RetroSelect label="Operation" value={op} onChange={setOp} id="cn-op" options={[
        { value: 'add', label: 'z₁ + z₂' },
        { value: 'sub', label: 'z₁ − z₂' },
        { value: 'mul', label: 'z₁ × z₂' },
        { value: 'div', label: 'z₁ ÷ z₂' },
      ]} />
      {ok && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Real part" value={re.toFixed(4)} large />
            <ResultDisplay label="Imaginary part" value={im.toFixed(4)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Complex Plane</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="cnGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#cnGrid)" rx="8" />
              <line x1="20" y1="40" x2="160" y2="40" stroke="#9ca3af" strokeWidth="1" />
              <line x1="90" y1="10" x2="90" y2="70" stroke="#9ca3af" strokeWidth="1" />
              <line x1="90" y1="40" x2={90 + Math.max(-60, Math.min(60, re * 10))} y2={40 - Math.max(-25, Math.min(25, im * 10))} stroke="#dfaa44" strokeWidth="2" />
              <circle cx={90 + Math.max(-60, Math.min(60, re * 10))} cy={40 - Math.max(-25, Math.min(25, im * 10))} r="3" fill="#ab3232" />
              <text x="150" y="20" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">|z|={mag.toFixed(2)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}