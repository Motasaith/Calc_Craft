'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function BtuCalculator() {
  const [mode, setMode] = useState<'room' | 'convert'>('room')
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('4')
  const [height, setHeight] = useState('2.5')
  const [insulation, setInsulation] = useState('average')
  const [value, setValue] = useState('10000')
  const [fromUnit, setFromUnit] = useState('BTU')
  const [result, setResult] = useState('')

  const calculate = () => {
    if (mode === 'room') {
      const l = parseFloat(length), w = parseFloat(width), h = parseFloat(height)
      if (isNaN(l)||isNaN(w)||isNaN(h)) { setResult(''); return }
      const volume = l * w * h
      const factor = insulation === 'poor' ? 60 : insulation === 'average' ? 40 : 25
      setResult(`${Math.ceil(volume * factor).toLocaleString()} BTU/hr`)
    } else {
      const v = parseFloat(value)
      if (isNaN(v)) { setResult(''); return }
      const watts = fromUnit === 'BTU' ? v * 0.293 : fromUnit === 'kW' ? v * 3412 : v
      setResult(`${Math.round(watts).toLocaleString()} BTU/hr = ${(watts * 0.293).toFixed(2)} W`)
    }
  }

  return (
    <FormCalculatorShell title="BTU Calculator" badge="MISC">
      <RetroSelect label="Mode" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'room',label:'Room Cooling'},{value:'convert',label:'Unit Convert'}]} id="btu-mode" />
      {mode === 'room' && <>
        <div className="grid grid-cols-3 gap-3"><RetroInput label="Length (m)" value={length} onChange={setLength} placeholder="5" id="btu-l" /><RetroInput label="Width (m)" value={width} onChange={setWidth} placeholder="4" id="btu-w" /><RetroInput label="Height (m)" value={height} onChange={setHeight} placeholder="2.5" id="btu-h" /></div>
        <RetroSelect label="Insulation" value={insulation} onChange={setInsulation} options={[{value:'poor',label:'Poor'},{value:'average',label:'Average'},{value:'good',label:'Good'}]} id="btu-ins" />
      </>}
      {mode === 'convert' && <>
        <RetroInput label="Value" value={value} onChange={setValue} placeholder="10000" id="btu-v" />
        <RetroSelect label="From" value={fromUnit} onChange={setFromUnit} options={[{value:'BTU',label:'BTU/hr'},{value:'kW',label:'kW'},{value:'W',label:'Watts'}]} id="btu-from" />
      </>}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
