'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

interface Course {
  grade: string
  weight: string
}

export default function GradePointAverageCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { grade: '3.7', weight: '1.0' },
    { grade: '4.0', weight: '1.5' },
    { grade: '3.3', weight: '1.0' },
  ])

  const update = (i: number, field: keyof Course, val: string) =>
    setCourses((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)))

  const add = () => setCourses((prev) => [...prev, { grade: '3.0', weight: '1.0' }])
  const remove = (i: number) => setCourses((prev) => prev.filter((_, idx) => idx !== i))

  const parsed = courses
    .map((c) => ({ g: parseFloat(c.grade), w: parseFloat(c.weight) }))
    .filter((c) => !isNaN(c.g) && !isNaN(c.w) && c.w > 0)

  const totalWeight = parsed.reduce((s, c) => s + c.w, 0)
  const weightedSum = parsed.reduce((s, c) => s + c.g * c.w, 0)
  const gpa = totalWeight > 0 ? weightedSum / totalWeight : 0
  const valid = parsed.length > 0

  return (
    <FormCalculatorShell
      title="Weighted GPA"
      subtitle="Calculate weighted grade point average"
      badge="EDUCATION"
    >
      <div>
        {courses.map((c, i) => (
          <div key={i} className="flex gap-2 items-end mb-2">
            <div className="flex-1">
              <RetroInput
                label={`Course ${i + 1} Grade`}
                value={c.grade}
                onChange={(v) => update(i, 'grade', v)}
                type="number"
                step={0.1}
                min={0}
                max={4}
              />
            </div>
            <div className="flex-1">
              <RetroInput
                label="Weight"
                value={c.weight}
                onChange={(v) => update(i, 'weight', v)}
                type="number"
                step={0.1}
                min={0}
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
          <ResultDisplay label="Weighted GPA" value={gpa.toFixed(2)} large />
          <ResultDisplay label="Total Weight" value={totalWeight.toFixed(1)} />
        </div>
      )}

      {valid && (
        <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
          {parsed.map((c, i) => (
            <path
              key={i}
              d={wobblyBar(i * 30 + 10, 55 - (c.g / 4) * 50, 20, (c.g / 4) * 50)}
              fill="#dfaa44"
              stroke="#be8b32"
              strokeWidth="1"
              opacity={0.5 + c.w / 4}
            />
          ))}
        </svg>
      )}
    </FormCalculatorShell>
  )
}