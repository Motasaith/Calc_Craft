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

export default function LimitCalculator() {
  const [num, setNum] = useState('x^2 - 1')
  const [den, setDen] = useState('x - 1')
  const [approach, setApproach] = useState('1')

  const a = parseFloat(approach)
  const valid = num.trim() !== '' && den.trim() !== '' && !isNaN(a)
  const eps = 1e-6
  const leftVal = valid ? evalExpr(num, a - eps) / evalExpr(den, a - eps) : NaN
  const rightVal = valid ? evalExpr(num, a + eps) / evalExpr(den, a + eps) : NaN
  const ok = valid && isFinite(leftVal) && isFinite(rightVal) && !isNaN(leftVal) && !isNaN(rightVal)
  const limit = ok ? (leftVal + rightVal) / 2 : 0
  const converges = ok && Math.abs(leftVal - rightVal) < 1e-3

  return (
    <FormCalculatorShell title="Limit Calculator" subtitle="Numerical limit estimation" badge="MATH">
      <RetroInput label="Numerator f(x)" value={num} onChange={setNum} type="text" placeholder="e.g. x^2 - 1" id="lim-num" />
      <RetroInput label="Denominator g(x)" value={den} onChange={setDen} type="text" placeholder="e.g. x - 1" id="lim-den" />
      <RetroInput label="x approaches" value={approach} onChange={setApproach} placeholder="1" id="lim-a" />
      {valid && !ok && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">Cannot evaluate expression</div>}
      {ok && !converges && <div className="mt-3 text-xs font-mono text-amber-600 text-center font-bold">Limit may not exist (left ≠ right)</div>}
      {ok && (
        <>
          <div className="mt-4">
            <ResultDisplay label={`lim(x→${a}) ${num}/${den} ≈`} value={limit.toFixed(6)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Approach</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="limGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#limGrid)" rx="8" />
              <line x1="90" y1="10" x2="90" y2="70" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
              <path d={wobblyBar(30, 40, 50, 1)} fill="none" stroke="#3b82f6" strokeWidth="2" />
              <path d={wobblyBar(100, 40, 50, 1)} fill="none" stroke="#ef4444" strokeWidth="2" />
              <circle cx="90" cy={40 - Math.max(-20, Math.min(20, limit * 5))} r="3" fill="#059669" />
              <text x="45" y="72" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#3b82f6">left</text>
              <text x="135" y="72" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#ef4444">right</text>
              <text x="90" y="20" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">L={limit.toFixed(2)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}