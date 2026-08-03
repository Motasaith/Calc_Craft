'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SalaryCalculator() {
  const [hourlyStr, setHourlyStr] = useState('25')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, weekly: 0, monthly: 0, annual: 0 }
    const h = parseFloat(hourlyStr)
    if (isNaN(h) || h <= 0) return { ...defaultObj, error: 'Please enter a valid hourly rate.' }
    const weekly = h * 40
    const annual = weekly * 52
    const monthly = annual / 12
    return { error: null, weekly, monthly, annual }
  }, [hourlyStr])

  return (
    <FormCalculatorShell title="Salary Converter" subtitle="Convert hourly wages to annual or monthly equivalencies" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Hourly Rate ($)" value={hourlyStr} onChange={setHourlyStr} id="sal-h" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-3 gap-2">
              <ResultDisplay label="Weekly (40h)" value={results.weekly.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
              <ResultDisplay label="Monthly" value={results.monthly.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
              <ResultDisplay label="Annual" value={results.annual.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
