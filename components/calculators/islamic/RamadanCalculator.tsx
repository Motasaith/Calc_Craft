'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function RamadanCalculator() {
  const [year, setYear] = useState('2026')
  const [result, setResult] = useState<{start:string,end:string,days:number}|null>(null)

  const calculate = () => {
    const y = parseInt(year)
    if (isNaN(y)) { setResult(null); return }
    const hijriYear = y - 622 + Math.floor((y - 622) / 33)
    const ramadanStart = new Date(y, 1, 15)
    ramadanStart.setDate(ramadanStart.getDate() + ((hijriYear % 33) * 11) % 354)
    const ramadanEnd = new Date(ramadanStart); ramadanEnd.setDate(ramadanStart.getDate() + 29)
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    setResult({ start: fmt(ramadanStart), end: fmt(ramadanEnd), days: 30 })
  }

  return (
    <FormCalculatorShell title="Ramadan Calendar" badge="ISLAMIC">
      <RetroInput label="Gregorian Year" value={year} onChange={setYear} placeholder="2026" id="ram-yr" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Estimate Dates</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Start Date" value={result.start} />
          <ResultDisplay label="End Date" value={result.end} />
          <ResultDisplay label="Fasting Days" value={result.days} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
