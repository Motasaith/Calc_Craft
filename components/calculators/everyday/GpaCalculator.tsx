'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GpaCalculator() {
  const [g1, setG1] = useState('4.0') // points
  const [c1, setC1] = useState('3') // credits
  const [g2, setG2] = useState('3.0')
  const [c2, setC2] = useState('4')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, gpa: 0 }
    const vg1 = parseFloat(g1)
    const vc1 = parseFloat(c1)
    const vg2 = parseFloat(g2)
    const vc2 = parseFloat(c2)

    if (isNaN(vg1) || isNaN(vc1) || isNaN(vg2) || isNaN(vc2) || vc1 <= 0 || vc2 <= 0) {
      return { ...defaultObj, error: 'Please enter valid grades and positive credits.' }
    }

    const totalPoints = vg1 * vc1 + vg2 * vc2
    const totalCredits = vc1 + vc2
    const gpa = totalPoints / totalCredits

    return { error: null, gpa }
  }, [g1, c1, g2, c2])

  return (
    <FormCalculatorShell title="GPA Course Solver" subtitle="Calculate semester Grade Point Average from credits" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 border border-neutral-300 rounded p-2">
            <RetroInput label="Class 1 Grade" value={g1} onChange={setG1} id="gp-g1" />
            <RetroInput label="Class 1 Credits" value={c1} onChange={setC1} id="gp-c1" />
          </div>
          <div className="grid grid-cols-2 gap-2 border border-neutral-300 rounded p-2">
            <RetroInput label="Class 2 Grade" value={g2} onChange={setG2} id="gp-g2" />
            <RetroInput label="Class 2 Credits" value={c2} onChange={setC2} id="gp-c2" />
          </div>
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Semester GPA" value={results.gpa.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
