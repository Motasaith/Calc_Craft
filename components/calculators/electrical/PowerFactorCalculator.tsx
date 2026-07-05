'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`
}

export default function PowerFactorCalculator() {
  const [realPower, setRealPower] = useState('8')
  const [apparentPower, setApparentPower] = useState('10')

  const real = parseFloat(realPower) || 0
  const apparent = parseFloat(apparentPower) || 0

  const pf = apparent > 0 ? real / apparent : 0
  const reactive = apparent > 0 ? Math.sqrt(Math.max(0, apparent * apparent - real * real)) : 0

  const valid = real > 0 && apparent > 0 && apparent >= real

  const radius = Math.min(40, pf * 40)

  return (
    <FormCalculatorShell
      title="Power Factor Calculator"
      subtitle="Real power vs apparent power"
      badge="ELECTRICAL"
    >
      <div>
        <RetroInput label="Real Power" value={realPower} onChange={setRealPower} unit="kW" min={0} />
        <RetroInput label="Apparent Power" value={apparentPower} onChange={setApparentPower} unit="kVA" min={0} />
      </div>

      <div className="space-y-2 mt-2">
        {valid && (
          <>
            <ResultDisplay label="Power Factor" value={pf.toFixed(3)} large />
            <ResultDisplay label="Reactive Power" value={reactive.toFixed(3)} unit="kVAR" />
          </>
        )}
      </div>

      {valid && (
        <div className="mt-3 flex justify-center">
          <svg width="120" height="100" viewBox="0 0 120 100">
            <path d={wobblyCircle(60, 50, 40)} fill="none" stroke="#b0bdae" strokeWidth="2" />
            <path d={wobblyCircle(60, 50, radius)} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}