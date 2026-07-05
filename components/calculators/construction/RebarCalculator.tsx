'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function RebarCalculator() {
  const [length, setLength] = useState('6')
  const [width, setWidth] = useState('4')
  const [gridSpacing, setGridSpacing] = useState('0.3')
  const [rebarSize, setRebarSize] = useState<'10' | '13' | '16'>('13')
  const [result, setResult] = useState<{ totalLength: number; numBars: number } | null>(null)

  const calculate = () => {
    const l = parseFloat(length), w = parseFloat(width), gs = parseFloat(gridSpacing)
    if (isNaN(l) || isNaN(w) || isNaN(gs) || l <= 0 || w <= 0 || gs <= 0) { setResult(null); return }
    const barsAlongL = Math.ceil(l / gs) + 1
    const barsAlongW = Math.ceil(w / gs) + 1
    const totalLength = barsAlongL * w + barsAlongW * l
    const numBars = barsAlongL + barsAlongW
    setResult({ totalLength, numBars })
  }

  return (
    <FormCalculatorShell title="Rebar Calculator" subtitle="Total length & bar count" badge="CONSTRUCTION">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Slab Length (m)" value={length} onChange={setLength} placeholder="6" id="rb-l" />
        <RetroInput label="Slab Width (m)" value={width} onChange={setWidth} placeholder="4" id="rb-w" />
      </div>
      <RetroInput label="Grid Spacing (m)" value={gridSpacing} onChange={setGridSpacing} placeholder="0.3" id="rb-gs" />
      <RetroSelect label="Rebar Size" value={rebarSize} onChange={(v) => { setRebarSize(v as any); setResult(null) }} options={[{value:'10',label:'#10 (10mm)'},{value:'13',label:'#13 (13mm)'},{value:'16',label:'#16 (16mm)'}]} id="rb-size" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <ResultDisplay label="Total Length" value={result.totalLength.toFixed(1)} unit="m" large />
            <ResultDisplay label="Number of Bars" value={result.numBars} />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 80" className="w-full h-20 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={`h${i}`} x1="10" y1={10 + i * 12} x2="190" y2={10 + i * 12} stroke="#6a6a6a" strokeWidth="1.5" />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={`v${i}`} x1={15 + i * 25} y1="5" x2={15 + i * 25} y2="75" stroke="#6a6a6a" strokeWidth="1.5" />
              ))}
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}