'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function SphereCalculator() {
  const [mode, setMode] = useState<'radius' | 'diameter' | 'volume' | 'area'>('radius')
  const [value, setValue] = useState('5')
  const [result, setResult] = useState<{radius:number,diameter:number,volume:number,area:number}|null>(null)

  const calculate = () => {
    const v = parseFloat(value)
    if (isNaN(v) || v<=0) { setResult(null); return }
    let r = 0
    switch (mode) {
      case 'radius': r = v; break
      case 'diameter': r = v / 2; break
      case 'volume': r = Math.pow((3 * v) / (4 * Math.PI), 1/3); break
      case 'area': r = Math.sqrt(v / (4 * Math.PI)); break
    }
    setResult({ radius: r, diameter: 2*r, volume: (4/3)*Math.PI*r*r*r, area: 4*Math.PI*r*r })
  }

  return (
    <FormCalculatorShell title="Sphere Calculator" badge="GEOMETRY">
      <RetroSelect label="Given" value={mode} onChange={(v) => { setMode(v as any); setResult(null) }} options={[{value:'radius',label:'Radius'},{value:'diameter',label:'Diameter'},{value:'volume',label:'Volume'},{value:'area',label:'Surface Area'}]} id="sph-mode" />
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="5" id="sph-v" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Radius" value={result.radius.toFixed(3)} />
          <ResultDisplay label="Diameter" value={result.diameter.toFixed(3)} />
          <ResultDisplay label="Volume" value={result.volume.toFixed(3)} />
          <ResultDisplay label="Surface Area" value={result.area.toFixed(3)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
