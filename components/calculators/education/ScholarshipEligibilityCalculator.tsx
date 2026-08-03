'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ScholarshipEligibilityCalculator() {
  const [gpaStr, setGpaStr] = useState('3.5')
  const [satStr, setSatStr] = useState('1300')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, eligible: '' }
    const gpa = parseFloat(gpaStr)
    const sat = parseInt(satStr)

    if (isNaN(gpa) || isNaN(sat) || gpa < 0 || gpa > 4.0 || sat < 400 || sat > 1600) {
      return { ...defaultObj, error: 'Please enter valid GPA (0-4.0) and SAT (400-1600).' }
    }

    let eligible = 'Needs improvement for standard grants.'
    if (gpa >= 3.5 && sat >= 1300) {
      eligible = 'Highly Eligible for Merit Scholarships'
    } else if (gpa >= 3.0 && sat >= 1100) {
      eligible = 'Eligible for General Aid and Scholarships'
    }

    return { error: null, eligible }
  }, [gpaStr, satStr])

  return (
    <FormCalculatorShell title="Scholarship Eligibility Evaluator" subtitle="Check prospective academic award levels using GPA and SAT criteria" badge="EDUCATION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Cumulative GPA (4.0 scale)" value={gpaStr} onChange={setGpaStr} id="se-g" />
          <RetroInput label="SAT Score (400 to 1600)" value={satStr} onChange={setSatStr} id="se-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Award Standing Status" value={results.eligible} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
