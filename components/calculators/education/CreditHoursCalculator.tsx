'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

interface Course {
  name: string
  credits: string
}

export default function CreditHoursCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { name: 'Math', credits: '3' },
    { name: 'English', credits: '3' },
    { name: 'Lab', credits: '4' },
  ])

  const update = (i: number, field: keyof Course, val: string) =>
    setCourses((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)))

  const add = () => setCourses((prev) => [...prev, { name: '', credits: '3' }])
  const remove = (i: number) => setCourses((prev) => prev.filter((_, idx) => idx !== i))

  const parsed = courses
    .map((c) => parseFloat(c.credits))
    .filter((v) => !isNaN(v) && v > 0)

  const total = parsed.reduce((s, v) => s + v, 0)
  const valid = parsed.length > 0
  const status = total >= 12 ? 'Full-Time' : total >= 6 ? 'Part-Time' : 'Less than Part-Time'

  return (
    <FormCalculatorShell
      title="Credit Hours"
      subtitle="Total credits & enrollment status"
      badge="EDUCATION"
    >
      <div>
        {courses.map((c, i) => (
          <div key={i} className="flex gap-2 items-end mb-2">
            <div className="flex-1">
              <RetroInput
                label={`Course ${i + 1} Name`}
                value={c.name}
                onChange={(v) => update(i, 'name', v)}
                type="text"
                placeholder="Name"
              />
            </div>
            <div className="w-24">
              <RetroInput
                label="Credits"
                value={c.credits}
                onChange={(v) => update(i, 'credits', v)}
                type="number"
                min={0}
                max={10}
              />
            </div>
            <button
              onClick={() => remove(i)}
              className="h-10 px-3 text-xs font-bold bg-neutral-300 border border-neutral-400 rounded-lg mb-3"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={add}
          className="mb-3 h-9 px-4 text-xs font-extrabold font-mono bg-[#dfaa44] border border-[#be8b32] rounded-lg uppercase tracking-wider"
        >
          + Add Course
        </button>
      </div>

      {valid && (
        <div className="space-y-2 mb-3">
          <ResultDisplay label="Total Credit Hours" value={total} unit="cr" large />
          <ResultDisplay label="Status" value={status} />
        </div>
      )}

      {valid && (
        <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
          {parsed.map((v, i) => (
            <path
              key={i}
              d={wobblyBar(i * 25 + 10, 55 - (v / 5) * 50, 18, (v / 5) * 50)}
              fill="#dfaa44"
              stroke="#be8b32"
              strokeWidth="1"
            />
          ))}
        </svg>
      )}
    </FormCalculatorShell>
  )
}