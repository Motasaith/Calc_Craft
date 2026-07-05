'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

interface Course {
  grade: string
  credits: string
}

export default function GpaSemesterCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { grade: '4.0', credits: '3' },
    { grade: '3.7', credits: '4' },
    { grade: '3.3', credits: '3' },
  ])

  const updateCourse = (i: number, field: keyof Course, val: string) => {
    setCourses((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)))
  }

  const addCourse = () => setCourses((prev) => [...prev, { grade: '4.0', credits: '3' }])
  const removeCourse = (i: number) => setCourses((prev) => prev.filter((_, idx) => idx !== i))

  const parsed = courses
    .map((c) => ({ g: parseFloat(c.grade), cr: parseFloat(c.credits) }))
    .filter((c) => !isNaN(c.g) && !isNaN(c.cr) && c.cr > 0)

  const totalCredits = parsed.reduce((s, c) => s + c.cr, 0)
  const totalPoints = parsed.reduce((s, c) => s + c.g * c.cr, 0)
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0
  const valid = parsed.length > 0

  return (
    <FormCalculatorShell
      title="GPA Semester"
      subtitle="Calculate semester GPA from courses"
      badge="EDUCATION"
    >
      <div>
        {courses.map((c, i) => (
          <div key={i} className="flex gap-2 items-end mb-2">
            <div className="flex-1">
              <RetroInput
                label={`Course ${i + 1} Grade`}
                value={c.grade}
                onChange={(v) => updateCourse(i, 'grade', v)}
                type="number"
                step="0.1"
                min={0}
                max={4}
              />
            </div>
            <div className="flex-1">
              <RetroInput
                label="Credits"
                value={c.credits}
                onChange={(v) => updateCourse(i, 'credits', v)}
                type="number"
                min={0}
                max={10}
              />
            </div>
            <button
              onClick={() => removeCourse(i)}
              className="h-10 px-3 text-xs font-bold bg-neutral-300 border border-neutral-400 rounded-lg mb-3"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={addCourse}
          className="mb-3 h-9 px-4 text-xs font-extrabold font-mono bg-[#dfaa44] border border-[#be8b32] rounded-lg uppercase tracking-wider"
        >
          + Add Course
        </button>
      </div>

      {valid && (
        <div className="space-y-2 mb-3">
          <ResultDisplay label="Semester GPA" value={gpa.toFixed(2)} large />
          <ResultDisplay label="Total Credits" value={totalCredits} unit="cr" />
        </div>
      )}

      {valid && (
        <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
          {parsed.map((c, i) => {
            const h = Math.min(50, (c.g / 4) * 50)
            return (
              <path
                key={i}
                d={wobblyBar(i * 30 + 10, 55 - h, 20, h)}
                fill="#dfaa44"
                stroke="#be8b32"
                strokeWidth="1"
              />
            )
          })}
        </svg>
      )}
    </FormCalculatorShell>
  )
}