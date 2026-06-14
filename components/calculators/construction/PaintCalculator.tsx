'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function PaintCalculator() {
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('4')
  const [height, setHeight] = useState('2.5')
  const [doors, setDoors] = useState('1')
  const [windows, setWindows] = useState('1')
  const [coats, setCoats] = useState('2')
  const [coverage, setCoverage] = useState('10')
  const [result, setResult] = useState<{area:number,liters:number}|null>(null)

  const calculate = () => {
    const l = parseFloat(length), w = parseFloat(width), h = parseFloat(height)
    const d = parseFloat(doors), win = parseFloat(windows), c = parseFloat(coats), cov = parseFloat(coverage)
    if (isNaN(l)||isNaN(w)||isNaN(h)) { setResult(null); return }
    const wallArea = 2 * (l + w) * h
    const subtract = d * 2 + win * 1.5
    const netArea = Math.max(0, wallArea - subtract)
    const liters = (netArea * c) / cov
    setResult({ area: netArea, liters })
  }

  return (
    <FormCalculatorShell title="Paint Calculator" badge="CONSTRUCTION">
      <div className="grid grid-cols-3 gap-3"><RetroInput label="Length (m)" value={length} onChange={setLength} placeholder="5" id="paint-l" /><RetroInput label="Width (m)" value={width} onChange={setWidth} placeholder="4" id="paint-w" /><RetroInput label="Height (m)" value={height} onChange={setHeight} placeholder="2.5" id="paint-h" /></div>
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Doors" value={doors} onChange={setDoors} placeholder="1" id="paint-d" /><RetroInput label="Windows" value={windows} onChange={setWindows} placeholder="1" id="paint-win" /></div>
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Coats" value={coats} onChange={setCoats} placeholder="2" id="paint-c" /><RetroInput label="Coverage (m²/L)" value={coverage} onChange={setCoverage} placeholder="10" id="paint-cov" /></div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Paintable Area" value={`${result.area.toFixed(2)} m²`} />
          <ResultDisplay label="Paint Needed" value={`${result.liters.toFixed(2)} L`} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
