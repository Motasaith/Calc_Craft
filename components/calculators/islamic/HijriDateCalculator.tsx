'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HijriDateCalculator() {
  const [gregStr, setGregStr] = useState('2026-08-03')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, hijri: '' }
    const date = new Date(gregStr)
    if (isNaN(date.getTime())) return { ...defaultObj, error: 'Please enter a valid Gregorian date.' }
    // Approximation: base epoch diff
    const baseDate = new Date(622, 6, 16) // Hijri Epoch
    const diffTime = date.getTime() - baseDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    const hijriYear = Math.floor(diffDays / 354.367)
    const remDays = diffDays - hijriYear * 354.367
    const hijriMonth = Math.floor(remDays / 29.53) + 1
    const hijriDay = Math.floor(remDays % 29.53) + 1
    return { error: null, hijri: `${hijriDay} Muharram ${hijriYear + 1} AH` }
  }, [gregStr])

  return (
    <FormCalculatorShell title="Gregorian to Hijri Date Solver" subtitle="Convert western dates to the Islamic Hijri calendar format" badge="ISLAMIC">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Gregorian Date (YYYY-MM-DD)" value={gregStr} onChange={setGregStr} id="hjc-g" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Hijri Date Equivalent" value={results.hijri} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
