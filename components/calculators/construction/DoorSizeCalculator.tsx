'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function DoorSizeCalculator() {
  const [openingWidth, setOpeningWidth] = useState('900')
  const [openingHeight, setOpeningHeight] = useState('2100')
  const [doorType, setDoorType] = useState<'interior' | 'exterior' | 'sliding'>('interior')
  const [result, setResult] = useState<{ doorWidth: number; doorHeight: number; clearance: number } | null>(null)

  const calculate = () => {
    const ow = parseFloat(openingWidth), oh = parseFloat(openingHeight)
    if (isNaN(ow) || isNaN(oh) || ow <= 0 || oh <= 0) { setResult(null); return }
    const clearance = doorType === 'sliding' ? 20 : 10
    const doorWidth = ow - clearance * 2
    const doorHeight = oh - clearance
    setResult({ doorWidth, doorHeight, clearance })
  }

  return (
    <FormCalculatorShell title="Door Size Calculator" subtitle="Recommended door dimensions" badge="CONSTRUCTION">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Opening Width (mm)" value={openingWidth} onChange={setOpeningWidth} placeholder="900" id="ds-ow" />
        <RetroInput label="Opening Height (mm)" value={openingHeight} onChange={setOpeningHeight} placeholder="2100" id="ds-oh" />
      </div>
      <RetroSelect label="Door Type" value={doorType} onChange={(v) => { setDoorType(v as any); setResult(null) }} options={[{value:'interior',label:'Interior'},{value:'exterior',label:'Exterior'},{value:'sliding',label:'Sliding'}]} id="ds-type" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <ResultDisplay label="Door Width" value={result.doorWidth.toFixed(0)} unit="mm" large />
            <ResultDisplay label="Door Height" value={result.doorHeight.toFixed(0)} unit="mm" />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 80" className="w-full h-20 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              <path d={wobblyBar(70, 8, 60, 64)} fill="#a08060" stroke="#604030" strokeWidth="1" />
              <circle cx="120" cy="40" r="3" fill="#403020" />
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}