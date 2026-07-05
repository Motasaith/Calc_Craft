'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function BrickCalculator() {
  const [wallLength, setWallLength] = useState('10')
  const [wallHeight, setWallHeight] = useState('3')
  const [brickType, setBrickType] = useState<'standard' | 'modular' | 'queen'>('standard')
  const [mortarGap, setMortarGap] = useState('10')
  const [result, setResult] = useState<{ bricks: number; courses: number; bricksPerCourse: number } | null>(null)

  const brickDims: Record<string, { l: number; h: number }> = {
    standard: { l: 190, h: 57 },
    modular: { l: 194, h: 57 },
    queen: { l: 244, h: 71 },
  }

  const calculate = () => {
    const wl = parseFloat(wallLength), wh = parseFloat(wallHeight), mg = parseFloat(mortarGap)
    if (isNaN(wl) || isNaN(wh) || isNaN(mg) || wl <= 0 || wh <= 0) { setResult(null); return }
    const dims = brickDims[brickType]
    const effL = dims.l + mg
    const effH = dims.h + mg
    const wallMm = wl * 1000
    const wallHmm = wh * 1000
    const bricksPerCourse = Math.ceil(wallMm / effL)
    const courses = Math.ceil(wallHmm / effH)
    const bricks = bricksPerCourse * courses
    setResult({ bricks, courses, bricksPerCourse })
  }

  return (
    <FormCalculatorShell title="Brick Calculator" subtitle="Bricks needed for a wall" badge="CONSTRUCTION">
      <RetroInput label="Wall Length (m)" value={wallLength} onChange={setWallLength} placeholder="10" id="brick-wl" />
      <RetroInput label="Wall Height (m)" value={wallHeight} onChange={setWallHeight} placeholder="3" id="brick-wh" />
      <RetroSelect label="Brick Size" value={brickType} onChange={(v) => { setBrickType(v as any); setResult(null) }} options={[{value:'standard',label:'Standard (190mm)'},{value:'modular',label:'Modular (194mm)'},{value:'queen',label:'Queen (244mm)'}]} id="brick-type" />
      <RetroInput label="Mortar Gap (mm)" value={mortarGap} onChange={setMortarGap} placeholder="10" id="brick-mg" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <ResultDisplay label="Bricks Needed" value={result.bricks} large />
            <ResultDisplay label="Courses" value={result.courses} />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 80" className="w-full h-24 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              {Array.from({ length: Math.min(result.courses, 5) }).map((_, r) =>
                Array.from({ length: Math.min(result.bricksPerCourse, 10) }).map((_, c) => (
                  <path key={`${r}-${c}`} d={wobblyBar(2 + c * 19, 2 + r * 15, 17, 12)} fill="#b85c3a" stroke="#7a3a22" strokeWidth="0.5" />
                ))
              )}
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}