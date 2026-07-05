'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function StudyTimeCalculator() {
  const [pages, setPages] = useState('120')
  const [speed, setSpeed] = useState('20')
  const [sessions, setSessions] = useState('3')
  const [days, setDays] = useState('7')

  const p = parseFloat(pages)
  const s = parseFloat(speed)
  const sess = parseFloat(sessions)
  const d = parseFloat(days)

  const valid = !isNaN(p) && !isNaN(s) && !isNaN(sess) && !isNaN(d) && p > 0 && s > 0 && d > 0

  const readingHours = valid ? p / s : 0
  const reviewHours = valid ? sess * 1.5 : 0
  const totalHours = readingHours + reviewHours
  const hoursPerDay = valid ? totalHours / d : 0

  return (
    <FormCalculatorShell
      title="Study Time"
      subtitle="Plan study hours for exams"
      badge="EDUCATION"
    >
      <div>
        <RetroInput label="Pages to Read" value={pages} onChange={setPages} unit="pages" />
        <RetroInput label="Reading Speed" value={speed} onChange={setSpeed} unit="pg/hr" />
        <RetroInput label="Review Sessions" value={sessions} onChange={setSessions} unit="sessions" />
        <RetroInput label="Days Until Exam" value={days} onChange={setDays} unit="days" />
      </div>

      {valid && (
        <div className="space-y-2 mb-3">
          <ResultDisplay label="Total Study Hours" value={totalHours.toFixed(1)} unit="hrs" large />
          <ResultDisplay label="Hours Per Day" value={hoursPerDay.toFixed(2)} unit="hrs/day" />
        </div>
      )}

      {valid && (
        <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
          <path d={wobblyBar(20, 55 - (readingHours / totalHours) * 50, 60, (readingHours / totalHours) * 50)} fill="#dfaa44" stroke="#be8b32" strokeWidth="1" />
          <path d={wobblyBar(110, 55 - (reviewHours / totalHours) * 50, 60, (reviewHours / totalHours) * 50)} fill="#7a9a7a" stroke="#5a7a5a" strokeWidth="1" />
        </svg>
      )}
    </FormCalculatorShell>
  )
}