'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function TimeCardCalculator() {
  const [monIn, setMonIn] = useState('09:00'); const [monOut, setMonOut] = useState('17:00')
  const [tueIn, setTueIn] = useState('09:00'); const [tueOut, setTueOut] = useState('17:00')
  const [wedIn, setWedIn] = useState('09:00'); const [wedOut, setWedOut] = useState('17:00')
  const [thuIn, setThuIn] = useState('09:00'); const [thuOut, setThuOut] = useState('17:00')
  const [friIn, setFriIn] = useState('09:00'); const [friOut, setFriOut] = useState('17:00')
  const [hourlyRate, setHourlyRate] = useState('20')
  const [result, setResult] = useState<{total:number,regular:number,overtime:number,pay:number}|null>(null)

  const dayHours = (inn: string, outt: string) => {
    const [ih, im] = inn.split(':').map(Number)
    const [oh, om] = outt.split(':').map(Number)
    let start = ih * 60 + im, end = oh * 60 + om
    if (end < start) end += 24 * 60
    return (end - start) / 60
  }

  const calculate = () => {
    const days = [
      dayHours(monIn, monOut), dayHours(tueIn, tueOut), dayHours(wedIn, wedOut),
      dayHours(thuIn, thuOut), dayHours(friIn, friOut)
    ]
    const total = days.reduce((a,b) => a+b, 0)
    const regular = Math.min(total, 40)
    const overtime = Math.max(0, total - 40)
    const rate = parseFloat(hourlyRate)
    const pay = isNaN(rate) ? 0 : regular * rate + overtime * rate * 1.5
    setResult({ total, regular, overtime, pay })
  }

  const DayRow = ({ label, inn, outt, setIn, setOut }: any) => (
    <div className="grid grid-cols-3 gap-2 mb-2">
      <span className="text-[10px] font-bold text-neutral-600 font-mono self-center">{label}</span>
      <RetroInput label="" value={inn} onChange={setIn} type="time" id={`tc-${label}-in`} />
      <RetroInput label="" value={outt} onChange={setOut} type="time" id={`tc-${label}-out`} />
    </div>
  )

  return (
    <FormCalculatorShell title="Time Card Calculator" badge="DATE & TIME">
      <div className="grid grid-cols-3 gap-2 mb-1">
        <span className="text-[9px] font-bold text-neutral-500 font-mono">Day</span>
        <span className="text-[9px] font-bold text-neutral-500 font-mono">In</span>
        <span className="text-[9px] font-bold text-neutral-500 font-mono">Out</span>
      </div>
      <DayRow label="Mon" inn={monIn} outt={monOut} setIn={setMonIn} setOut={setMonOut} />
      <DayRow label="Tue" inn={tueIn} outt={tueOut} setIn={setTueIn} setOut={setTueOut} />
      <DayRow label="Wed" inn={wedIn} outt={wedOut} setIn={setWedIn} setOut={setWedOut} />
      <DayRow label="Thu" inn={thuIn} outt={thuOut} setIn={setThuIn} setOut={setThuOut} />
      <DayRow label="Fri" inn={friIn} outt={friOut} setIn={setFriIn} setOut={setFriOut} />
      <RetroInput label="Hourly Rate ($)" value={hourlyRate} onChange={setHourlyRate} placeholder="20" id="tc-rate" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Total Hours" value={`${result.total.toFixed(2)}h`} />
          <ResultDisplay label="Regular" value={`${result.regular.toFixed(2)}h`} />
          <ResultDisplay label="Overtime" value={`${result.overtime.toFixed(2)}h`} />
          <ResultDisplay label="Total Pay" value={`$${result.pay.toFixed(2)}`} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
