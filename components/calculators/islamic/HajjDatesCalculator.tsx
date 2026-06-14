'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function HajjDatesCalculator() {
  const [year, setYear] = useState('2026')
  const [result, setResult] = useState<{arafat:string,eid:string,starts:string}|null>(null)

  const calculate = () => {
    const y = parseInt(year)
    if (isNaN(y)) { setResult(null); return }
    const hijriYear = y - 622 + Math.floor((y - 622) / 33)
    const dhuHijjah1 = new Date(y, 5, 15)
    dhuHijjah1.setDate(dhuHijjah1.getDate() + ((hijriYear * 11) % 354))
    const arafat = new Date(dhuHijjah1); arafat.setDate(dhuHijjah1.getDate() + 8)
    const eid = new Date(dhuHijjah1); eid.setDate(dhuHijjah1.getDate() + 9)
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    setResult({ arafat: fmt(arafat), eid: fmt(eid), starts: fmt(dhuHijjah1) })
  }

  return (
    <FormCalculatorShell title="Hajj & Umrah Dates" badge="ISLAMIC">
      <RetroInput label="Gregorian Year" value={year} onChange={setYear} placeholder="2026" id="haj-yr" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Estimate Dates</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Dhul Hijjah 1" value={result.starts} />
          <ResultDisplay label="Day of Arafat" value={result.arafat} />
          <ResultDisplay label="Eid al-Adha" value={result.eid} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
