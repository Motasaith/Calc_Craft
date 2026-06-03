'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SalaryCalculator() {
  const [hourly, setHourly] = useState('')
  const [hoursWeek, setHoursWeek] = useState('40')

  const h = parseFloat(hourly), hw = parseFloat(hoursWeek)
  const valid = !isNaN(h) && !isNaN(hw) && h > 0 && hw > 0
  const daily = valid ? h * (hw / 5) : 0
  const weekly = valid ? h * hw : 0
  const biweekly = weekly * 2
  const monthly = valid ? (h * hw * 52) / 12 : 0
  const annual = valid ? h * hw * 52 : 0

  return (
    <FormCalculatorShell title="Salary Calculator" subtitle="Convert between pay periods" badge="FINANCE">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Hourly Rate" value={hourly} onChange={setHourly} placeholder="e.g. 25" id="sal-hr" unit="$/hr" />
        <RetroInput label="Hours/Week" value={hoursWeek} onChange={setHoursWeek} placeholder="40" id="sal-hw" unit="hrs" />
      </div>
      {valid && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <ResultDisplay label="Daily" value={`$${daily.toFixed(2)}`} />
          <ResultDisplay label="Weekly" value={`$${weekly.toFixed(2)}`} />
          <ResultDisplay label="Bi-Weekly" value={`$${biweekly.toFixed(2)}`} />
          <ResultDisplay label="Monthly" value={`$${monthly.toFixed(2)}`} />
          <ResultDisplay label="Annual" value={`$${Math.round(annual).toLocaleString()}`} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
