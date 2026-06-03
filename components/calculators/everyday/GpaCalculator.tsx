'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

const gradePoints: Record<string, number> = { 'A+': 4.0, A: 4.0, 'A-': 3.7, 'B+': 3.3, B: 3.0, 'B-': 2.7, 'C+': 2.3, C: 2.0, 'C-': 1.7, 'D+': 1.3, D: 1.0, 'D-': 0.7, F: 0.0 }
const gradeOptions = Object.keys(gradePoints).map((g) => ({ value: g, label: `${g} (${gradePoints[g]})` }))

export default function GpaCalculator() {
  const [courses, setCourses] = useState([{ grade: 'A', credits: '3' }, { grade: 'B+', credits: '4' }])
  const [result, setResult] = useState<string | null>(null)

  const addCourse = () => setCourses([...courses, { grade: 'A', credits: '3' }])
  const removeCourse = (i: number) => { if (courses.length > 1) setCourses(courses.filter((_, idx) => idx !== i)) }
  const update = (i: number, field: 'grade' | 'credits', val: string) => {
    const c = [...courses]; c[i] = { ...c[i], [field]: val }; setCourses(c)
  }

  const calculate = () => {
    let totalPoints = 0, totalCredits = 0
    for (const c of courses) {
      const cr = parseFloat(c.credits)
      if (isNaN(cr) || cr <= 0) continue
      totalPoints += gradePoints[c.grade] * cr
      totalCredits += cr
    }
    if (totalCredits === 0) return
    setResult((totalPoints / totalCredits).toFixed(2))
  }

  return (
    <FormCalculatorShell title="GPA Calculator" badge="EVERYDAY">
      <div className="space-y-2 mb-4">
        {courses.map((c, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1">
              <RetroSelect label={i === 0 ? 'Grade' : ''} value={c.grade} onChange={(v) => update(i, 'grade', v)} options={gradeOptions} id={`gpa-g-${i}`} />
            </div>
            <div className="w-20">
              <RetroInput label={i === 0 ? 'Credits' : ''} value={c.credits} onChange={(v) => update(i, 'credits', v)} id={`gpa-c-${i}`} />
            </div>
            {courses.length > 1 && (
              <button onClick={() => removeCourse(i)} className="h-10 w-10 text-xs font-bold bg-[#cc6666] text-white rounded border border-red-800 active:scale-95 transition-all mb-3">✕</button>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={addCourse} className="flex-1 h-9 text-xs font-bold font-mono bg-neutral-300 text-neutral-800 rounded border border-neutral-400 hover:bg-neutral-250 transition-all">+ Add Course</button>
        <RetroActionButton onClick={calculate} variant="primary">Calculate GPA</RetroActionButton>
      </div>
      {result && <ResultDisplay label="Your GPA" value={result} unit="/ 4.0" large />}
    </FormCalculatorShell>
  )
}
