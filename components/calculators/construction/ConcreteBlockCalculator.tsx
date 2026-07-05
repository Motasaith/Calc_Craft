'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ConcreteBlockCalculator() {
  const [wallArea, setWallArea] = useState('50')
  const [blockType, setBlockType] = useState<'standard' | 'half' | 'jumbo'>('standard')
  const [result, setResult] = useState<{ blocks: number; mortarBags: number } | null>(null)

  const blockArea: Record<string, number> = { standard: 0.089, half: 0.044, jumbo: 0.118 }

  const calculate = () => {
    const wa = parseFloat(wallArea)
    if (isNaN(wa) || wa <= 0) { setResult(null); return }
    const blocks = Math.ceil((wa / blockArea[blockType]) * 1.05)
    const mortarBags = Math.ceil(blocks / 30)
    setResult({ blocks, mortarBags })
  }

  return (
    <FormCalculatorShell title="Concrete Block Calculator" subtitle="Blocks & mortar bags" badge="CONSTRUCTION">
      <RetroInput label="Wall Area (m²)" value={wallArea} onChange={setWallArea} placeholder="50" id="cb-wa" />
      <RetroSelect label="Block Size" value={blockType} onChange={(v) => { setBlockType(v as any); setResult(null) }} options={[{value:'standard',label:'Standard (400x200mm)'},{value:'half',label:'Half (200x200mm)'},{value:'jumbo',label:'Jumbo (590x200mm)'}]} id="cb-type" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <ResultDisplay label="Blocks Needed" value={result.blocks} large />
            <ResultDisplay label="Mortar Bags" value={result.mortarBags} />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 70" className="w-full h-20 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              {Array.from({ length: 3 }).map((_, r) =>
                Array.from({ length: 5 }).map((_, c) => (
                  <path key={`${r}-${c}`} d={wobblyBar(8 + c * 38, 8 + r * 20, 34, 16)} fill="#a0a0a0" stroke="#606060" strokeWidth="0.5" />
                ))
              )}
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}