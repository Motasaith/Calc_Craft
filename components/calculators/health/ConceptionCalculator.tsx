'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function ConceptionCalculator() {
  const [mode, setMode] = useState<'lmp' | 'due'>('lmp')
  const [date, setDate] = useState('')
  const [cycleLength, setCycleLength] = useState('28')
  const [result, setResult] = useState<{conception:string,dueDate:string,fertileStart:string,fertileEnd:string}|null>(null)

  const calculate = () => {
    if (!date) { setResult(null); return }
    const d = new Date(date)
    const cycle = parseInt(cycleLength)
    if (isNaN(cycle)) { setResult(null); return }
    let lmp: Date
    if (mode === 'lmp') { lmp = new Date(d) } else { lmp = new Date(d); lmp.setDate(lmp.getDate() - 280) }
    const conception = new Date(lmp); conception.setDate(lmp.getDate() + cycle - 14)
    const fertileStart = new Date(conception); fertileStart.setDate(conception.getDate() - 5)
    const fertileEnd = new Date(conception); fertileEnd.setDate(conception.getDate() + 1)
    const dueDate = new Date(lmp); dueDate.setDate(lmp.getDate() + 280)
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    setResult({ conception: fmt(conception), dueDate: fmt(dueDate), fertileStart: fmt(fertileStart), fertileEnd: fmt(fertileEnd) })
  }

  return (
    <FormCalculatorShell title="Conception Calculator" badge="HEALTH">
      <RetroSelect label="Based On" value={mode} onChange={(v) => { setMode(v as any); setResult(null) }} options={[{value:'lmp',label:'Last Period'},{value:'due',label:'Due Date'}]} id="conc-mode" />
      <RetroInput label={mode === 'lmp' ? 'First Day of Last Period' : 'Due Date'} value={date} onChange={setDate} type="date" id="conc-date" />
      <RetroInput label="Cycle Length (days)" value={cycleLength} onChange={setCycleLength} placeholder="28" id="conc-cycle" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Conception Date" value={result.conception} />
          <ResultDisplay label="Due Date" value={result.dueDate} />
          <ResultDisplay label="Fertile Start" value={result.fertileStart} />
          <ResultDisplay label="Fertile End" value={result.fertileEnd} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
