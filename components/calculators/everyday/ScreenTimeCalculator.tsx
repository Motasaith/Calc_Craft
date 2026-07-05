'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ScreenTimeCalculator() {
  const [phone, setPhone] = useState('4')
  const [computer, setComputer] = useState('6')
  const [tv, setTv] = useState('2')
  const [days, setDays] = useState('7')
  const [result, setResult] = useState<{ weekly: number; pct: number; daily: number } | null>(null)

  const calculate = () => {
    const p = parseFloat(phone)
    const c = parseFloat(computer)
    const t = parseFloat(tv)
    const d = parseInt(days)
    if (isNaN(p) || isNaN(c) || isNaN(t) || isNaN(d) || d <= 0) return
    const daily = p + c + t
    const weekly = daily * d
    const wakingHours = 16 * d
    const pct = (weekly / wakingHours) * 100
    setResult({ weekly, pct, daily })
  }

  return (
    <FormCalculatorShell title="Screen Time Calculator" subtitle="Track daily device usage" badge="EVERYDAY">
      <RetroInput label="Phone Hours / Day" value={phone} onChange={setPhone} unit="hrs" id="screen-phone" />
      <RetroInput label="Computer Hours / Day" value={computer} onChange={setComputer} unit="hrs" id="screen-comp" />
      <RetroInput label="TV Hours / Day" value={tv} onChange={setTv} unit="hrs" id="screen-tv" />
      <RetroInput label="Days" value={days} onChange={setDays} id="screen-days" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Screen Time</RetroActionButton></div>
      {result && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label="Weekly Screen Time" value={`${result.weekly.toFixed(1)} hrs`} large />
          <ResultDisplay label="% of Waking Hours" value={`${result.pct.toFixed(1)}%`} />
          <ResultDisplay label="Daily Average" value={`${result.daily.toFixed(1)} hrs`} />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 40 - Math.min(parseFloat(phone) * 4, 35), 50, Math.min(parseFloat(phone) * 4, 35))} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(70, 40 - Math.min(parseFloat(computer) * 4, 35), 50, Math.min(parseFloat(computer) * 4, 35))} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <path d={wobblyBar(130, 40 - Math.min(parseFloat(tv) * 4, 35), 50, Math.min(parseFloat(tv) * 4, 35))} fill="#dad6cd" stroke="#b0bdae" strokeWidth="2" />
            <text x="35" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Phone</text>
            <text x="95" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">PC</text>
            <text x="155" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">TV</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}