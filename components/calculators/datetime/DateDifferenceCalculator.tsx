'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { ResultDisplay } from '../shared/FormCalculatorShell'

export default function DateDifferenceCalculator() {
  const [d1, setD1] = useState(''); const [d2, setD2] = useState('')

  const date1 = d1 ? new Date(d1) : null, date2 = d2 ? new Date(d2) : null
  const valid = date1 && date2 && !isNaN(date1.getTime()) && !isNaN(date2.getTime())

  const diff = valid ? Math.abs(date2.getTime() - date1.getTime()) : 0
  const days = Math.floor(diff / 86400000)
  const weeks = Math.floor(days / 7)
  const months = valid ? Math.abs((date2.getFullYear() - date1.getFullYear()) * 12 + date2.getMonth() - date1.getMonth()) : 0
  const years = valid ? Math.abs(date2.getFullYear() - date1.getFullYear()) : 0
  const hours = days * 24
  const minutes = hours * 60

  return (
    <FormCalculatorShell title="Date Difference Calculator" badge="DATE & TIME">
      <div className="grid grid-cols-2 gap-3">
        <div className="mb-3">
          <label htmlFor="dd-d1" className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">Start Date</label>
          <input type="date" id="dd-d1" value={d1} onChange={(e) => setD1(e.target.value)}
            className="w-full h-10 px-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 transition-all shadow-inner" />
        </div>
        <div className="mb-3">
          <label htmlFor="dd-d2" className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">End Date</label>
          <input type="date" id="dd-d2" value={d2} onChange={(e) => setD2(e.target.value)}
            className="w-full h-10 px-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 transition-all shadow-inner" />
        </div>
      </div>

      {valid && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ResultDisplay label="Days" value={days.toLocaleString()} large />
          <ResultDisplay label="Weeks" value={weeks.toLocaleString()} large />
          <ResultDisplay label="Months" value={months.toString()} large />
          <ResultDisplay label="Years" value={years.toString()} />
          <ResultDisplay label="Hours" value={hours.toLocaleString()} />
          <ResultDisplay label="Minutes" value={minutes.toLocaleString()} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
