'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

// Simple safe expression evaluator supporting + - * / ^ and Math functions
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

export default function DerivativeCalculator() {
  const [expr, setExpr] = useState('x^2')
  const [xVal, setXVal] = useState('1')
  const [hVal, setHVal] = useState('0.001')

  const x = parseFloat(xVal), h = parseFloat(hVal)
  const valid = expr.trim() !== '' && !isNaN(x) && !isNaN(h) && h > 0
  const f = (v: number) => evalExpr(expr, v)
  const deriv = valid ? (f(x + h) - f(x - h)) / (2 * h) : 0
  const derivOk = valid && isFinite(deriv) && !isNaN(deriv)

  return (
    <FormCalculatorShell title="Derivative Calculator" subtitle="Numerical derivative via central difference" badge="MATH">
      <RetroInput label="Function f(x)" value={expr} onChange={setExpr} type="text" placeholder="e.g. x^2" id="drv-expr" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="x value" value={xVal} onChange={setXVal} placeholder="1" id="drv-x" />
        <RetroInput label="Step size h" value={hVal} onChange={setHVal} placeholder="0.001" id="drv-h" />
      </div>
      {valid && !derivOk && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">Cannot evaluate function</div>}
      {derivOk && (
        <>
          <div className="mt-4">
            <ResultDisplay label={`f'(${x}) ≈`} value={deriv.toFixed(6)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Tangent Slope</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="drvGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#drvGrid)" rx="8" />
              <line x1="20" y1="60" x2="160" y2="60" stroke="#9ca3af" strokeWidth="1" />
              <line x1="90" y1="10" x2="90" y2="70" stroke="#9ca3af" strokeWidth="1" />
              <path d={wobblyBar(40, 50, 100, 1)} fill="none" stroke="#dfaa44" strokeWidth="2" />
              <line x1="50" y1="55" x2="130" y2={55 - Math.max(-30, Math.min(30, deriv * 10))} stroke="#ab3232" strokeWidth="2" />
              <circle cx="90" cy="50" r="3" fill="#1a2019" />
              <text x="150" y="20" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">slope={deriv.toFixed(2)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}