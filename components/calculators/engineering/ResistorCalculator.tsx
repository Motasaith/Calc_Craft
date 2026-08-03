'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

const colorCodes: Record<string, { val: number; color: string }> = {
  black: { val: 0, color: '#000000' },
  brown: { val: 1, color: '#964B00' },
  red: { val: 2, color: '#FF0000' },
  orange: { val: 3, color: '#FFA500' },
  yellow: { val: 4, color: '#FFFF00' },
  green: { val: 5, color: '#008000' },
  blue: { val: 6, color: '#0000FF' },
  violet: { val: 7, color: '#EE82EE' },
  grey: { val: 8, color: '#808080' },
  white: { val: 9, color: '#FFFFFF' }
};

export default function ResistorCalculator() {
  const [band1, setBand1] = useState('brown')
  const [band2, setBand2] = useState('black')
  const [band3, setBand3] = useState('red') // multiplier

  const results = useMemo(() => {
    const v1 = colorCodes[band1].val
    const v2 = colorCodes[band2].val
    const mult = Math.pow(10, colorCodes[band3].val)
    const resistance = (v1 * 10 + v2) * mult
    return { resistance }
  }, [band1, band2, band3])

  const options = Object.keys(colorCodes).map(k => ({ value: k, label: k.charAt(0).toUpperCase() + k.slice(1) }))

  return (
    <FormCalculatorShell title="Resistor Color Band Solver" subtitle="Calculate resistor resistance values from color bands" badge="ENGINEERING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect label="Band 1" value={band1} onChange={setBand1} id="res-b1" options={options} />
          <RetroSelect label="Band 2" value={band2} onChange={setBand2} id="res-b2" options={options} />
          <RetroSelect label="Band 3 (Multiplier)" value={band3} onChange={setBand3} id="res-b3" options={options} />
        </div>
        <div className="min-h-[440px] space-y-4">
          <ResultDisplay label="Resistance" value={`${results.resistance.toLocaleString()} Ohms (Ω)`} large />
        </div>
      </div>
    </FormCalculatorShell>
  )
}
