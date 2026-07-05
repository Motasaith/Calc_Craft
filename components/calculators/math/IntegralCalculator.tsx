'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

function evalExpr(expr: string, x: number): number {
  try {
    const replaced = expr
      .replace(/\^/g, '**')
      .replace(/\bsin\b/g, 'Math.sin')
      .replace(/\bcos\b/g, 'Math.cos')
      .replace(/\btan\b/g, 'Math.tan')
      .replace(/\bsqrt\b/g, 'Math.sqrt')
      .replace(/\bexp\b/g, 'Math.exp')
      .replace(/\blog\b/g, 'Math.log')
      .replace(/\babs\b/g, 'Math.abs')
    // eslint-disable-next-line no-new-func
    const fn = new Function('x', `return (${replaced});`)
    const r = fn(x)
    return typeof r === 'number' && isFinite(r) ? r : NaN
  } catch {
    return NaN
  }
}

export default function IntegralCalculator() {
  const [expr, setExpr] = useState('x^2')
  const [aVal, setAVal] = useState('0')
  const [bVal, setBVal] = useState('1')
  const [nVal, setNVal] = useState('100')

  const a = parseFloat(aVal), b = parseFloat(bVal), n = parseInt(nVal, 10)
  const valid = expr.trim() !== '' && !isNaN(a) && !isNaN(b) && !isNaN(n) && n > 0 && a !== b
  const f = (v: number) => evalExpr(expr, v)

  let integral = 0
  let ok = valid
  if (valid) {
    const h = (b - a) / n
    let sum = 0
    for (let i = 0; i <= n; i++) {
      const xi = a + i * h
      const fi = f(xi)
      if (isNaN(fi)) { ok = false; break }
      sum += (i === 0 || i === n) ? fi : 2 * fi
    }
    if (ok) integral = (h / 2) * sum
  }

  return (
    <FormCalculatorShell title="Integral Calculator" subtitle="Definite integral via trapezoidal rule" badge="MATH">
      <RetroInput label="Function f(x)" value={expr} onChange={setExpr} type="text" placeholder="e.g. x^2" id="int-expr" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Lower bound a" value={aVal} onChange={setAVal} placeholder="0" id="int-a" />
        <RetroInput label="Upper bound b" value={bVal} onChange={setBVal} placeholder="1" id="int-b" />
      </div>
      <RetroInput label="Intervals n" value={nVal} onChange={setNVal} placeholder="100" id="int-n" />
      {valid && !ok && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">Cannot evaluate function</div>}
      {ok && (
        <>
          <div className="mt-4">
            <ResultDisplay label={`∫(${a}→${b}) ${expr} dx ≈`} value={integral.toFixed(6)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Area Under Curve</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="intGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#intGrid)" rx="8" />
              <line x1="20" y1="60" x2="160" y2="60" stroke="#9ca3af" strokeWidth="1" />
              <path d={wobblyBar(40, 30, 100, 30)} fill="#dfaa44" fillOpacity="0.25" stroke="#be8b32" strokeWidth="1.5" />
              <path d="M 40 50 Q 90 20 140 40" fill="none" stroke="#1a2019" strokeWidth="2" />
              <text x="90" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">area={integral.toFixed(3)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}