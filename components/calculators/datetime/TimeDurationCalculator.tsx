'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function TimeDurationCalculator() {
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('17:30')
  const [result, setResult] = useState('')

  const calculate = () => {
    const [sh, sm] = start.split(':').map(Number)
    const [eh, em] = end.split(':').map(Number)
    if (isNaN(sh)||isNaN(sm)||isNaN(eh)||isNaN(em)) { setResult('Invalid'); return }
    let startMin = sh * 60 + sm
    let endMin = eh * 60 + em
    if (endMin < startMin) endMin += 24 * 60
    const diff = endMin - startMin
    const h = Math.floor(diff / 60)
    const m = diff % 60
    setResult(`${h}h ${m}m (${diff} minutes)`)
  }

  return (
    <FormCalculatorShell title="Time Duration" badge="DATE & TIME">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Start Time" value={start} onChange={setStart} type="time" id="td-start" />
        <RetroInput label="End Time" value={end} onChange={setEnd} type="time" id="td-end" />
      </div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Duration</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Duration" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
