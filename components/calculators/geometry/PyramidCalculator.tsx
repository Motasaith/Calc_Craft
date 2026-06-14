'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function PyramidCalculator() {
  const [type, setType] = useState<'square' | 'triangular'>('square')
  const [base, setBase] = useState('6')
  const [height, setHeight] = useState('8')
  const [result, setResult] = useState<{volume:number,area:number}|null>(null)

  const calculate = () => {
    const b = parseFloat(base), h = parseFloat(height)
    if (isNaN(b)||isNaN(h) || b<=0 || h<=0) { setResult(null); return }
    if (type === 'square') {
      const volume = (1/3) * b * b * h
      const slant = Math.sqrt((b/2)*(b/2) + h*h)
      const area = b*b + 2*b*slant
      setResult({ volume, area })
    } else {
      const volume = (1/3) * (Math.sqrt(3)/4) * b * b * h
      const slant = Math.sqrt((b/(2*Math.sqrt(3)))*(b/(2*Math.sqrt(3))) + h*h)
      const area = (Math.sqrt(3)/4)*b*b + (3/2)*b*slant
      setResult({ volume, area })
    }
  }

  return (
    <FormCalculatorShell title="Pyramid Calculator" badge="GEOMETRY">
      <RetroSelect label="Type" value={type} onChange={(v) => { setType(v as any); setResult(null) }} options={[{value:'square',label:'Square Base'},{value:'triangular',label:'Triangular Base'}]} id="pyr-type" />
      <RetroInput label="Base Side" value={base} onChange={setBase} placeholder="6" id="pyr-b" />
      <RetroInput label="Height" value={height} onChange={setHeight} placeholder="8" id="pyr-h" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Volume" value={result.volume.toFixed(2)} />
          <ResultDisplay label="Surface Area" value={result.area.toFixed(2)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
