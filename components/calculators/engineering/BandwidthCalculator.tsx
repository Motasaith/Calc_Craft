'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function BandwidthCalculator() {
  const [mode, setMode] = useState<'data' | 'frequency'>('data')
  const [value, setValue] = useState('100')
  const [unit, setUnit] = useState('Mbps')
  const [result, setResult] = useState('')

  const units: Record<string,number> = { bps:1, Kbps:1000, Mbps:1000000, Gbps:1000000000 }
  const freqUnits: Record<string,number> = { Hz:1, kHz:1000, MHz:1000000, GHz:1000000000 }

  const calculate = () => {
    const v = parseFloat(value)
    if (isNaN(v)) { setResult('Invalid'); return }
    if (mode === 'data') {
      const bps = v * (units[unit] || 1)
      setResult(`${bps.toExponential(2)} bps = ${(bps/8).toExponential(2)} B/s`)
    } else {
      const hz = v * (freqUnits[unit] || 1)
      setResult(`${hz.toExponential(2)} Hz`)
    }
  }

  return (
    <FormCalculatorShell title="Bandwidth Calculator" badge="ENGINEERING">
      <RetroSelect label="Mode" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'data',label:'Data Rate'},{value:'frequency',label:'Frequency'}]} id="bw-mode" />
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="100" id="bw-val" />
      <RetroSelect label="Unit" value={unit} onChange={setUnit} options={mode==='data'?[{value:'bps',label:'bps'},{value:'Kbps',label:'Kbps'},{value:'Mbps',label:'Mbps'},{value:'Gbps',label:'Gbps'}]:[{value:'Hz',label:'Hz'},{value:'kHz',label:'kHz'},{value:'MHz',label:'MHz'},{value:'GHz',label:'GHz'}]} id="bw-unit" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
