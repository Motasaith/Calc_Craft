'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function SleepCalculator() {
  const [mode, setMode] = useState<'wake' | 'bed'>('wake')
  const [time, setTime] = useState('22:00')
  const [result, setResult] = useState<string[]>([])

  const calculate = () => {
    const [h, m] = time.split(':').map(Number)
    if (isNaN(h)||isNaN(m)) { setResult([]); return }
    const base = new Date()
    base.setHours(h, m, 0, 0)
    const times: string[] = []
    for (let cycles = 4; cycles <= 6; cycles++) {
      const t = new Date(base)
      if (mode === 'wake') {
        t.setMinutes(t.getMinutes() - cycles * 90)
      } else {
        t.setMinutes(t.getMinutes() + cycles * 90 + 15)
      }
      const label = cycles === 4 ? '6 hrs' : cycles === 5 ? '7.5 hrs' : '9 hrs'
      times.push(`${label}: ${t.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}`)
    }
    setResult(times)
  }

  return (
    <FormCalculatorShell title="Sleep Calculator" badge="DATE & TIME">
      <RetroSelect label="I want to..." value={mode} onChange={(v) => { setMode(v as any); setResult([]) }} options={[{value:'wake',label:'Wake up at...'},{value:'bed',label:'Go to bed at...'}]} id="sleep-mode" />
      <RetroInput label={mode === 'wake' ? 'Wake-up Time' : 'Bedtime'} value={time} onChange={setTime} type="time" id="sleep-time" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result.length > 0 && (
        <div className="mt-4 space-y-2">
          {result.map((r,i) => <ResultDisplay key={i} label={i===0?'Recommended':i===1?'Alternative':'Extra Sleep'} value={r} />)}
        </div>
      )}
    </FormCalculatorShell>
  )
}
