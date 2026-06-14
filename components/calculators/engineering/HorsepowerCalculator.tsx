'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function HorsepowerCalculator() {
  const [mode, setMode] = useState<'hp-to-kw' | 'kw-to-hp' | 'torque'>('hp-to-kw')
  const [value, setValue] = useState('100')
  const [torque, setTorque] = useState('200')
  const [rpm, setRpm] = useState('3000')
  const [result, setResult] = useState('')

  const calculate = () => {
    const v = parseFloat(value), t = parseFloat(torque), r = parseFloat(rpm)
    switch (mode) {
      case 'hp-to-kw': if (!isNaN(v)) setResult(`${(v * 0.7457).toFixed(2)} kW`); else setResult('Invalid'); break
      case 'kw-to-hp': if (!isNaN(v)) setResult(`${(v * 1.341).toFixed(2)} HP`); else setResult('Invalid'); break
      case 'torque': if (!isNaN(t)&&!isNaN(r)) setResult(`${((t * r) / 5252).toFixed(2)} HP`); else setResult('Invalid'); break
    }
  }

  return (
    <FormCalculatorShell title="Horsepower Calculator" badge="ENGINEERING">
      <RetroSelect label="Mode" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'hp-to-kw',label:'HP → kW'},{value:'kw-to-hp',label:'kW → HP'},{value:'torque',label:'Torque & RPM → HP'}]} id="hp-mode" />
      {mode !== 'torque' && <RetroInput label="Value" value={value} onChange={setValue} placeholder="100" id="hp-val" />}
      {mode === 'torque' && <><RetroInput label="Torque (lb-ft)" value={torque} onChange={setTorque} placeholder="200" id="hp-t" /><RetroInput label="RPM" value={rpm} onChange={setRpm} placeholder="3000" id="hp-rpm" /></>}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
