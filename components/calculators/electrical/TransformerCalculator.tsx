'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(x1: number, y1: number, x2: number, y2: number) {
  return `M ${x1} ${y1} L ${x2} ${y2}`
}

export default function TransformerCalculator() {
  const [primary, setPrimary] = useState('240')
  const [secondary, setSecondary] = useState('24')

  const vp = parseFloat(primary) || 0
  const vs = parseFloat(secondary) || 0

  const turnsRatio = vs > 0 ? vp / vs : 0
  const currentRatio = vp > 0 ? vs / vp : 0

  const valid = vp > 0 && vs > 0

  return (
    <FormCalculatorShell
      title="Transformer Calculator"
      subtitle="Turns ratio and current ratio"
      badge="ELECTRICAL"
    >
      <div>
        <RetroInput label="Primary Voltage" value={primary} onChange={setPrimary} unit="V" min={0} />
        <RetroInput label="Secondary Voltage" value={secondary} onChange={setSecondary} unit="V" min={0} />
      </div>

      <div className="space-y-2 mt-2">
        {valid && (
          <>
            <ResultDisplay label="Turns Ratio (Np:Ns)" value={`${turnsRatio.toFixed(2)} : 1`} large />
            <ResultDisplay label="Current Ratio (Is:Ip)" value={`${(1 / turnsRatio).toFixed(3)} : 1`} />
          </>
        )}
      </div>

      {valid && (
        <div className="mt-3 flex justify-center">
          <svg width="120" height="100" viewBox="0 0 120 100">
            <path d={wobblyLine(30, 20, 30, 80)} stroke="#dfaa44" strokeWidth="3" fill="none" />
            <path d={wobblyLine(90, 20, 90, 80)} stroke="#cbd8ca" strokeWidth="3" fill="none" />
            <line x1="30" y1="50" x2="90" y2="50" stroke="#888" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}