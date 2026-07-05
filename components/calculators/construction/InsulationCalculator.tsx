'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function InsulationCalculator() {
  const [area, setArea] = useState('100')
  const [rValue, setRValue] = useState('13')
  const [insulationType, setInsulationType] = useState<'fiberglass' | 'cellulose' | 'foam'>('fiberglass')
  const [result, setResult] = useState<{ thickness: number; bags: number } | null>(null)

  const rPerInch: Record<string, number> = { fiberglass: 3.2, cellulose: 3.5, foam: 6.0 }
  const bagCoverage: Record<string, number> = { fiberglass: 40, cellulose: 25, foam: 600 }

  const calculate = () => {
    const a = parseFloat(area), r = parseFloat(rValue)
    if (isNaN(a) || isNaN(r) || a <= 0 || r <= 0) { setResult(null); return }
    const thickness = r / rPerInch[insulationType]
    const bags = Math.ceil(a / bagCoverage[insulationType])
    setResult({ thickness, bags })
  }

  return (
    <FormCalculatorShell title="Insulation Calculator" subtitle="Thickness & bags needed" badge="CONSTRUCTION">
      <RetroInput label="Area (m²)" value={area} onChange={setArea} placeholder="100" id="ins-area" />
      <RetroInput label="Target R-Value" value={rValue} onChange={setRValue} placeholder="13" id="ins-r" />
      <RetroSelect label="Insulation Type" value={insulationType} onChange={(v) => { setInsulationType(v as any); setResult(null) }} options={[{value:'fiberglass',label:'Fiberglass Batts'},{value:'cellulose',label:'Cellulose Loose'},{value:'foam',label:'Spray Foam'}]} id="ins-type" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <ResultDisplay label="Thickness" value={result.thickness.toFixed(2)} unit="in" large />
            <ResultDisplay label="Bags Needed" value={result.bags} />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 60" className="w-full h-16 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              {Array.from({ length: 8 }).map((_, i) => (
                <path key={i} d={wobblyBar(10 + i * 23, 10, 20, 40)} fill="#e8d8a0" stroke="#a89060" strokeWidth="0.5" />
              ))}
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}