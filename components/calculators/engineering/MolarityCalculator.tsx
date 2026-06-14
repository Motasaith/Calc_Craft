'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function MolarityCalculator() {
  const [solveFor, setSolveFor] = useState<'molarity' | 'moles' | 'volume'>('molarity')
  const [moles, setMoles] = useState('0.5')
  const [volume, setVolume] = useState('1')
  const [molarity, setMolarity] = useState('0.5')
  const [result, setResult] = useState('')

  const calculate = () => {
    const n = parseFloat(moles), v = parseFloat(volume), m = parseFloat(molarity)
    switch (solveFor) {
      case 'molarity': if (!isNaN(n)&&!isNaN(v) && v!==0) setResult(`${(n/v).toFixed(3)} M`); else setResult('Invalid'); break
      case 'moles': if (!isNaN(m)&&!isNaN(v)) setResult(`${(m*v).toFixed(3)} mol`); else setResult('Invalid'); break
      case 'volume': if (!isNaN(n)&&!isNaN(m) && m!==0) setResult(`${(n/m).toFixed(3)} L`); else setResult('Invalid'); break
    }
  }

  return (
    <FormCalculatorShell title="Molarity Calculator" badge="ENGINEERING">
      <RetroSelect label="Solve For" value={solveFor} onChange={(v) => { setSolveFor(v as any); setResult('') }} options={[{value:'molarity',label:'Molarity (M)'},{value:'moles',label:'Moles (n)'},{value:'volume',label:'Volume (L)'}]} id="mol-mode" />
      {solveFor !== 'moles' && <RetroInput label="Moles (mol)" value={moles} onChange={setMoles} placeholder="0.5" id="mol-n" />}
      {solveFor !== 'molarity' && <RetroInput label="Volume (L)" value={volume} onChange={setVolume} placeholder="1" id="mol-v" />}
      {solveFor !== 'volume' && <RetroInput label="Molarity (M)" value={molarity} onChange={setMolarity} placeholder="0.5" id="mol-m" />}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label={solveFor.charAt(0).toUpperCase()+solveFor.slice(1)} value={result} large /></div>}
    </FormCalculatorShell>
  )
}
