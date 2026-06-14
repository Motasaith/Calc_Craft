'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function TipSpeedCalculator() {
  const [diameter, setDiameter] = useState('1.5')
  const [rpm, setRpm] = useState('3000')
  const [result, setResult] = useState<{tipSpeed:number,mach:number}|null>(null)

  const calculate = () => {
    const d = parseFloat(diameter), r = parseFloat(rpm)
    if (isNaN(d)||isNaN(r) || d<=0) { setResult(null); return }
    const tipSpeed = (Math.PI * d * r) / 60
    const mach = tipSpeed / 343
    setResult({ tipSpeed, mach })
  }

  return (
    <FormCalculatorShell title="Propeller Tip Speed" badge="ENGINEERING">
      <RetroInput label="Diameter (m)" value={diameter} onChange={setDiameter} placeholder="1.5" id="ts-d" />
      <RetroInput label="RPM" value={rpm} onChange={setRpm} placeholder="3000" id="ts-rpm" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Tip Speed" value={`${result.tipSpeed.toFixed(2)} m/s`} />
          <ResultDisplay label="Mach Number" value={result.mach.toFixed(3)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
