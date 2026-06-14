'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function DrywallCalculator() {
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('4')
  const [height, setHeight] = useState('2.5')
  const [sheetSize, setSheetSize] = useState('2.88')
  const [result, setResult] = useState<{sheets:number,mud:number,tape:number,screws:number}|null>(null)

  const calculate = () => {
    const l = parseFloat(length), w = parseFloat(width), h = parseFloat(height)
    const ss = parseFloat(sheetSize)
    if (isNaN(l)||isNaN(w)||isNaN(h)||isNaN(ss) || ss <= 0) { setResult(null); return }
    const wallArea = 2 * (l + w) * h
    const ceilingArea = l * w
    const totalArea = wallArea + ceilingArea
    const sheets = Math.ceil(totalArea / ss * 1.1)
    setResult({ sheets, mud: sheets * 2.5, tape: totalArea * 0.3, screws: sheets * 50 })
  }

  return (
    <FormCalculatorShell title="Drywall Calculator" badge="CONSTRUCTION">
      <div className="grid grid-cols-3 gap-3"><RetroInput label="Length (m)" value={length} onChange={setLength} placeholder="5" id="dw-l" /><RetroInput label="Width (m)" value={width} onChange={setWidth} placeholder="4" id="dw-w" /><RetroInput label="Height (m)" value={height} onChange={setHeight} placeholder="2.5" id="dw-h" /></div>
      <RetroInput label="Sheet Area (m²)" value={sheetSize} onChange={setSheetSize} placeholder="2.88" id="dw-sheet" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Sheets" value={result.sheets} large />
          <ResultDisplay label="Joint Compound (kg)" value={result.mud.toFixed(1)} />
          <ResultDisplay label="Tape (m)" value={result.tape.toFixed(1)} />
          <ResultDisplay label="Screws" value={result.screws} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
