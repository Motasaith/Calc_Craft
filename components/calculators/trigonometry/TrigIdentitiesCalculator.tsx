'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function TrigIdentitiesCalculator() {
  const [identity, setIdentity] = useState<'pythagorean' | 'double-angle' | 'half-angle' | 'sum'>('pythagorean')
  const [angle, setAngle] = useState('30')
  const [result, setResult] = useState('')

  const calculate = () => {
    const a = parseFloat(angle) * Math.PI / 180
    if (isNaN(a)) { setResult('Invalid'); return }
    switch (identity) {
      case 'pythagorean':
        const sin2 = Math.sin(a)**2, cos2 = Math.cos(a)**2
        setResult(`sin² + cos² = ${(sin2+cos2).toFixed(6)} (should be 1)`)
        break
      case 'double-angle':
        setResult(`sin(2θ)=${Math.sin(2*a).toFixed(6)}, cos(2θ)=${Math.cos(2*a).toFixed(6)}`)
        break
      case 'half-angle':
        setResult(`sin(θ/2)=${Math.sin(a/2).toFixed(6)}, cos(θ/2)=${Math.cos(a/2).toFixed(6)}`)
        break
      case 'sum':
        setResult(`sin(2θ)=${Math.sin(2*a).toFixed(6)}, cos(2θ)=${Math.cos(2*a).toFixed(6)}`)
        break
    }
  }

  return (
    <FormCalculatorShell title="Trig Identities" badge="TRIGONOMETRY">
      <RetroSelect label="Identity" value={identity} onChange={(v) => { setIdentity(v as any); setResult('') }} options={[{value:'pythagorean',label:'Pythagorean'},{value:'double-angle',label:'Double Angle'},{value:'half-angle',label:'Half Angle'},{value:'sum',label:'Sum/Difference'}]} id="ti-id" />
      <RetroInput label="Angle (°)" value={angle} onChange={setAngle} placeholder="30" id="ti-a" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Verify</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
