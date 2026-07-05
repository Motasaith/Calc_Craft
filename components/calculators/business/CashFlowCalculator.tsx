'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CashFlowCalculator() {
  const [inflows, setInflows] = useState('10000')
  const [outflows, setOutflows] = useState('7000')

  const inf = parseFloat(inflows) || 0
  const outf = parseFloat(outflows) || 0
  const net = inf - outf
  const valid = inf > 0 || outf > 0

  const inW = Math.min(80, Math.max(5, inf / 200))
  const outW = Math.min(80, Math.max(5, outf / 200))

  return (
    <FormCalculatorShell
      title="Cash Flow Calculator"
      subtitle="Net cash flow from in & out"
      badge="BUSINESS"
    >
      <div>
        <RetroInput label="Cash Inflows" value={inflows} onChange={setInflows} unit="$" />
        <RetroInput label="Cash Outflows" value={outflows} onChange={setOutflows} unit="$" />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay
            label="Net Cash Flow"
            value={`${net >= 0 ? '+' : ''}${net.toFixed(2)}`}
            unit="$"
            large
          />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <path d={wobblyBar(20, 30, inW, 15)} fill="#5a8a5a" opacity="0.8" />
        <path d={wobblyBar(20, 50, outW, 15)} fill="#ab3232" opacity="0.8" />
        <text x="20" y="22" className="fill-neutral-600" fontSize="8" fontFamily="monospace">IN</text>
        <text x="20" y="78" className="fill-neutral-600" fontSize="8" fontFamily="monospace">OUT</text>
      </svg>
    </FormCalculatorShell>
  )
}