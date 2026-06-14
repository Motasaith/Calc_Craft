'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function HoursCalculator() {
  const [clockIn, setClockIn] = useState('09:00')
  const [clockOut, setClockOut] = useState('17:00')
  const [breakMin, setBreakMin] = useState('30')
  const [result, setResult] = useState<{total:number,regular:number,overtime:number}|null>(null)

  const calculate = () => {
    const [ih, im] = clockIn.split(':').map(Number)
    const [oh, om] = clockOut.split(':').map(Number)
    const br = parseInt(breakMin)
    if (isNaN(ih)||isNaN(im)||isNaN(oh)||isNaN(om)||isNaN(br)) { setResult(null); return }
    let start = ih * 60 + im
    let end = oh * 60 + om
    if (end < start) end += 24 * 60
    const total = (end - start - br) / 60
    const regular = Math.min(total, 8)
    const overtime = Math.max(0, total - 8)
    setResult({ total, regular, overtime })
  }

  return (
    <FormCalculatorShell title="Hours Calculator" badge="DATE & TIME">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Clock In" value={clockIn} onChange={setClockIn} type="time" id="hrs-in" />
        <RetroInput label="Clock Out" value={clockOut} onChange={setClockOut} type="time" id="hrs-out" />
      </div>
      <RetroInput label="Break (minutes)" value={breakMin} onChange={setBreakMin} placeholder="30" id="hrs-break" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Total Hours" value={`${result.total.toFixed(2)}h`} large />
          <ResultDisplay label="Regular" value={`${result.regular.toFixed(2)}h`} />
          <ResultDisplay label="Overtime" value={`${result.overtime.toFixed(2)}h`} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
