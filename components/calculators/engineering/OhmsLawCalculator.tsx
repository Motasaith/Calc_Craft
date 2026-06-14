'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function OhmsLawCalculator() {
  const [solveFor, setSolveFor] = useState<'voltage' | 'current' | 'resistance' | 'power'>('power')
  const [voltage, setVoltage] = useState('12')
  const [current, setCurrent] = useState('2')
  const [resistance, setResistance] = useState('6')
  const [result, setResult] = useState('')

  const calculate = () => {
    const v = parseFloat(voltage), i = parseFloat(current), r = parseFloat(resistance)
    switch (solveFor) {
      case 'voltage': if (!isNaN(i)&&!isNaN(r)) setResult(`${(i*r).toFixed(2)} V`); else setResult('Invalid'); break
      case 'current': if (!isNaN(v)&&!isNaN(r) && r!==0) setResult(`${(v/r).toFixed(2)} A`); else setResult('Invalid'); break
      case 'resistance': if (!isNaN(v)&&!isNaN(i) && i!==0) setResult(`${(v/i).toFixed(2)} Ω`); else setResult('Invalid'); break
      case 'power': if (!isNaN(v)&&!isNaN(i)) setResult(`${(v*i).toFixed(2)} W`); else setResult('Invalid'); break
    }
  }

  return (
    <FormCalculatorShell title="Ohm's Law" badge="ENGINEERING">
      <RetroSelect label="Solve For" value={solveFor} onChange={(v) => { setSolveFor(v as any); setResult('') }} options={[{value:'voltage',label:'Voltage (V)'},{value:'current',label:'Current (A)'},{value:'resistance',label:'Resistance (Ω)'},{value:'power',label:'Power (W)'}]} id="ohm-mode" />
      {solveFor !== 'voltage' && <RetroInput label="Voltage (V)" value={voltage} onChange={setVoltage} placeholder="12" id="ohm-v" />}
      {solveFor !== 'current' && <RetroInput label="Current (A)" value={current} onChange={setCurrent} placeholder="2" id="ohm-i" />}
      {solveFor !== 'resistance' && <RetroInput label="Resistance (Ω)" value={resistance} onChange={setResistance} placeholder="6" id="ohm-r" />}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label={solveFor.charAt(0).toUpperCase()+solveFor.slice(1)} value={result} large /></div>}
    </FormCalculatorShell>
  )
}
