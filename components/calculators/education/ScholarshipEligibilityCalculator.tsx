'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy}`
}

export default function ScholarshipEligibilityCalculator() {
  const [gpa, setGpa] = useState('3.6')
  const [sat, setSat] = useState('1280')
  const [service, setService] = useState('50')

  const g = parseFloat(gpa)
  const s = parseFloat(sat)
  const sv = parseFloat(service)

  const valid = !isNaN(g) && !isNaN(s) && !isNaN(sv) && g >= 0 && g <= 4 && s >= 0 && sv >= 0

  // Score: gpa/4 * 40 + sat/1600 * 40 + min(service,100)/100 * 20
  const score = valid ? (g / 4) * 40 + (s / 1600) * 40 + Math.min(sv, 100) / 100 * 20 : 0
  let status = 'Not Eligible'
  if (score >= 85) status = 'Full Scholarship'
  else if (score >= 70) status = 'Partial Scholarship'
  else if (score >= 55) status = 'Honorable Mention'

  return (
    <FormCalculatorShell
      title="Scholarship Eligibility"
      subtitle="Check eligibility from GPA & scores"
      badge="EDUCATION"
    >
      <div>
        <RetroInput label="GPA" value={gpa} onChange={setGpa} unit="/4.0" step="0.1" min={0} max={4} />
        <RetroInput label="SAT Score" value={sat} onChange={setSat} unit="/1600" min={0} max={1600} />
        <RetroInput label="Community Service" value={service} onChange={setService} unit="hrs" />
      </div>

      {valid && (
        <div className="space-y-2 mb-3">
          <ResultDisplay label="Eligibility Score" value={score.toFixed(1)} unit="/100" large />
          <ResultDisplay label="Status" value={status} />
        </div>
      )}

      {valid && (
        <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
          <path d={wobblyCircle(100, 30, Math.min(25, (score / 100) * 25))} fill="#dfaa44" stroke="#be8b32" strokeWidth="1" opacity="0.7" />
        </svg>
      )}
    </FormCalculatorShell>
  )
}