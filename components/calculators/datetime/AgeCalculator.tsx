'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { ResultDisplay } from '../shared/FormCalculatorShell'

export default function AgeCalculator() {
  const [dob, setDob] = useState('')
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])

  const d1 = dob ? new Date(dob) : null
  const d2 = toDate ? new Date(toDate) : new Date()
  const valid = d1 && !isNaN(d1.getTime()) && d2 && !isNaN(d2.getTime()) && d1 <= d2

  let years = 0, months = 0, days = 0, totalDays = 0
  if (valid) {
    totalDays = Math.floor((d2.getTime() - d1.getTime()) / 86400000)
    let y = d2.getFullYear() - d1.getFullYear()
    let m = d2.getMonth() - d1.getMonth()
    let d = d2.getDate() - d1.getDate()
    if (d < 0) { m--; const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0); d += prevMonth.getDate() }
    if (m < 0) { y--; m += 12 }
    years = y; months = m; days = d
  }

  const totalWeeks = Math.floor(totalDays / 7)
  const totalHours = totalDays * 24
  const nextBirthday = (() => {
    if (!d1) return null
    const now = d2 || new Date()
    const next = new Date(now.getFullYear(), d1.getMonth(), d1.getDate())
    if (next <= now) next.setFullYear(next.getFullYear() + 1)
    return Math.ceil((next.getTime() - now.getTime()) / 86400000)
  })()

  return (
    <FormCalculatorShell title="Age Calculator" badge="DATE & TIME">
      <div className="grid grid-cols-2 gap-3">
        <div className="mb-3">
          <label htmlFor="age-dob" className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">Date of Birth</label>
          <input type="date" id="age-dob" value={dob} onChange={(e) => setDob(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full h-10 px-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 transition-all shadow-inner" />
        </div>
        <div className="mb-3">
          <label htmlFor="age-to" className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">As Of Date</label>
          <input type="date" id="age-to" value={toDate} onChange={(e) => setToDate(e.target.value)}
            className="w-full h-10 px-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 transition-all shadow-inner" />
        </div>
      </div>

      {valid && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ResultDisplay label="Years" value={years.toString()} large />
          <ResultDisplay label="Months" value={months.toString()} large />
          <ResultDisplay label="Days" value={days.toString()} large />
          <ResultDisplay label="Total Days" value={totalDays.toLocaleString()} />
          <ResultDisplay label="Total Weeks" value={totalWeeks.toLocaleString()} />
          <ResultDisplay label="Total Hours" value={totalHours.toLocaleString()} />
          {nextBirthday !== null && <div className="col-span-3"><ResultDisplay label="Days Until Next Birthday" value={nextBirthday.toString()} /></div>}
        </div>
      )}
    </FormCalculatorShell>
  )
}
