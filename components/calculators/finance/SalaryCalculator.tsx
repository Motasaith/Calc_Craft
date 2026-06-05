'use client'
import React from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateSalary, formatCurrency } from '@/lib/calc-engine'

export default function SalaryCalculator() {
  const [hourly, setHourly] = React.useState('')
  const [hoursWeek, setHoursWeek] = React.useState('40')

  const h = parseFloat(hourly), hw = parseFloat(hoursWeek)
  const valid = !isNaN(h) && !isNaN(hw) && h > 0 && hw > 0
  const annual = valid ? h * hw * 52 : 0
  const r = valid ? calculateSalary(annual, hw, 52) : { monthly: 0, weekly: 0, daily: 0, hourly: 0 }
  const biweekly = r.weekly * 2

  return (
    <FormCalculatorShell title="Salary Calculator" subtitle="Convert between pay periods" badge="FINANCE">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Hourly Rate" value={hourly} onChange={setHourly} placeholder="e.g. 25" id="sal-hr" unit="$/hr" />
        <RetroInput label="Hours/Week" value={hoursWeek} onChange={setHoursWeek} placeholder="40" id="sal-hw" unit="hrs" />
      </div>
      {valid && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <ResultDisplay label="Daily" value={formatCurrency(r.daily)} />
          <ResultDisplay label="Weekly" value={formatCurrency(r.weekly)} />
          <ResultDisplay label="Bi-Weekly" value={formatCurrency(biweekly)} />
          <ResultDisplay label="Monthly" value={formatCurrency(r.monthly)} />
          <ResultDisplay label="Annual" value={formatCurrency(annual)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
