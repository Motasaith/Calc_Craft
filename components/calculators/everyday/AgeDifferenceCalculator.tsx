'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function AgeDifferenceCalculator() {
  const [date1, setDate1] = useState('1990-05-15')
  const [date2, setDate2] = useState('1995-08-20')
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number } | null>(null)

  const calculate = () => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return
    let earlier = d1 < d2 ? d1 : d2
    let later = d1 < d2 ? d2 : d1
    let years = later.getFullYear() - earlier.getFullYear()
    let months = later.getMonth() - earlier.getMonth()
    let days = later.getDate() - earlier.getDate()
    if (days < 0) {
      months--
      const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0)
      days += prevMonth.getDate()
    }
    if (months < 0) {
      years--
      months += 12
    }
    const totalDays = Math.floor((later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24))
    setResult({ years, months, days, totalDays })
  }

  return (
    <FormCalculatorShell title="Age Difference Calculator" subtitle="Compare two birth dates" badge="EVERYDAY">
      <RetroInput label="Birth Date 1" value={date1} onChange={setDate1} type="date" id="age-d1" />
      <RetroInput label="Birth Date 2" value={date2} onChange={setDate2} type="date" id="age-d2" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Difference</RetroActionButton></div>
      {result && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label="Age Difference" value={`${result.years}y ${result.months}m ${result.days}d`} large />
          <ResultDisplay label="Total Days" value={result.totalDays.toLocaleString()} unit="days" />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 10, 50, 30)} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <path d={wobblyBar(70, 5, 50, 35)} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(130, 15, 50, 25)} fill="#dad6cd" stroke="#b0bdae" strokeWidth="2" />
            <text x="35" y="50" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#4c5c4a">Years</text>
            <text x="95" y="50" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#4c5c4a">Months</text>
            <text x="155" y="50" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#4c5c4a">Days</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}