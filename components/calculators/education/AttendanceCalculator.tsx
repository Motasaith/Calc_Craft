'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AttendanceCalculator() {
  const [attendedStr, setAttendedStr] = useState('36')
  const [totalStr, setTotalStr] = useState('40')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ratio: 0 }
    const att = parseFloat(attendedStr)
    const tot = parseFloat(totalStr)

    if (isNaN(att) || isNaN(tot) || att < 0 || tot <= 0 || att > tot) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const ratio = (att / tot) * 100
    return { error: null, ratio }
  }, [attendedStr, totalStr])

  return (
    <FormCalculatorShell title="Class Attendance Percentage Solver" subtitle="Calculate course attendance percentages from session records" badge="EDUCATION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Sessions Attended" value={attendedStr} onChange={setAttendedStr} id="at-a" />
          <RetroInput label="Total Class Sessions" value={totalStr} onChange={setTotalStr} id="at-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Attendance Ratio" value={`${results.ratio.toFixed(1)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
