'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function DayCounter() {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [mode, setMode] = useState<'all' | 'business'>('all')
  const [result, setResult] = useState<{total:number,weeks:number,weekdays:number}|null>(null)

  const calculate = () => {
    if (!start || !end) { setResult(null); return }
    const s = new Date(start), e = new Date(end)
    if (isNaN(s.getTime())||isNaN(e.getTime())) { setResult(null); return }
    const diffTime = Math.abs(e.getTime() - s.getTime())
    const total = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    let weekdays = 0
    const cur = new Date(Math.min(s.getTime(), e.getTime()))
    const last = new Date(Math.max(s.getTime(), e.getTime()))
    while (cur <= last) {
      const day = cur.getDay()
      if (day !== 0 && day !== 6) weekdays++
      cur.setDate(cur.getDate() + 1)
    }
    setResult({ total, weeks: Math.floor(total / 7), weekdays })
  }

  return (
    <FormCalculatorShell title="Day Counter" badge="DATE & TIME">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Start Date" value={start} onChange={setStart} type="date" id="dcnt-start" />
        <RetroInput label="End Date" value={end} onChange={setEnd} type="date" id="dcnt-end" />
      </div>
      <RetroSelect label="Count Mode" value={mode} onChange={(v) => setMode(v as any)} options={[{value:'all',label:'All Days'},{value:'business',label:'Business Days'}]} id="dcnt-mode" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Count</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Total Days" value={result.total} large />
          <ResultDisplay label="Weeks" value={result.weeks} />
          <ResultDisplay label={mode==='business'?'Business Days':'Weekdays'} value={result.weekdays} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
