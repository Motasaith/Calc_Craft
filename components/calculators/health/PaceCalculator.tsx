'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function PaceCalculator() {
  const [mode, setMode] = useState<'pace' | 'time' | 'distance'>('pace')
  const [distance, setDistance] = useState('5')
  const [hours, setHours] = useState('0')
  const [minutes, setMinutes] = useState('25')
  const [seconds, setSeconds] = useState('0')
  const [paceMin, setPaceMin] = useState('5')
  const [paceSec, setPaceSec] = useState('0')
  const [result, setResult] = useState('')

  const calculate = () => {
    const dist = parseFloat(distance)
    if (isNaN(dist) || dist <= 0) { setResult('Invalid distance'); return }
    if (mode === 'pace') {
      const totalSec = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
      if (totalSec <= 0) { setResult('Invalid time'); return }
      const paceSec = totalSec / dist
      const pMin = Math.floor(paceSec / 60)
      const pSec = Math.round(paceSec % 60)
      setResult(`${pMin}:${pSec.toString().padStart(2,'0')} /km`)
    } else if (mode === 'time') {
      const pSecTotal = parseInt(paceMin) * 60 + parseInt(paceSec)
      if (pSecTotal <= 0) { setResult('Invalid pace'); return }
      const totalSec = pSecTotal * dist
      const h = Math.floor(totalSec / 3600)
      const m = Math.floor((totalSec % 3600) / 60)
      const s = Math.round(totalSec % 60)
      setResult(`${h}h ${m}m ${s}s`)
    } else {
      const totalSec = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
      const pSecTotal = parseInt(paceMin) * 60 + parseInt(paceSec)
      if (totalSec <= 0 || pSecTotal <= 0) { setResult('Invalid input'); return }
      setResult(`${(totalSec / pSecTotal).toFixed(2)} km`)
    }
  }

  return (
    <FormCalculatorShell title="Running Pace Calculator" badge="HEALTH">
      <RetroSelect label="Mode" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'pace',label:'Find Pace'},{value:'time',label:'Find Time'},{value:'distance',label:'Find Distance'}]} id="pace-mode" />
      <RetroInput label="Distance (km)" value={distance} onChange={setDistance} placeholder="5" id="pace-dist" />
      {mode === 'pace' && <div className="grid grid-cols-3 gap-2"><RetroInput label="Hours" value={hours} onChange={setHours} placeholder="0" id="pace-h" /><RetroInput label="Minutes" value={minutes} onChange={setMinutes} placeholder="25" id="pace-m" /><RetroInput label="Seconds" value={seconds} onChange={setSeconds} placeholder="0" id="pace-s" /></div>}
      {(mode === 'time' || mode === 'distance') && <div className="grid grid-cols-2 gap-2"><RetroInput label="Pace Min" value={paceMin} onChange={setPaceMin} placeholder="5" id="pace-pm" /><RetroInput label="Pace Sec" value={paceSec} onChange={setPaceSec} placeholder="0" id="pace-ps" /></div>}
      {mode === 'distance' && <div className="grid grid-cols-3 gap-2"><RetroInput label="Hours" value={hours} onChange={setHours} placeholder="0" id="pace-h2" /><RetroInput label="Minutes" value={minutes} onChange={setMinutes} placeholder="25" id="pace-m2" /><RetroInput label="Seconds" value={seconds} onChange={setSeconds} placeholder="0" id="pace-s2" /></div>}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
