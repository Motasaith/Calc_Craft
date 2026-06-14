'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function DayOfWeekCalculator() {
  const [date, setDate] = useState('')
  const [result, setResult] = useState('')

  const calculate = () => {
    if (!date) { setResult(''); return }
    const d = new Date(date)
    if (isNaN(d.getTime())) { setResult('Invalid date'); return }
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    setResult(days[d.getDay()])
  }

  return (
    <FormCalculatorShell title="Day of the Week" badge="DATE & TIME">
      <RetroInput label="Date" value={date} onChange={setDate} type="date" id="dow-date" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Find Day</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Day of Week" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
