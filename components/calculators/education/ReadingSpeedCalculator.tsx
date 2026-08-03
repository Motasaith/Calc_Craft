'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ReadingSpeedCalculator() {
  const [wordsStr, setWordsStr] = useState('3000')
  const [wpmStr, setWpmStr] = useState('250') // words per minute average

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, minutes: 0 }
    const words = parseFloat(wordsStr)
    const wpm = parseFloat(wpmStr)

    if (isNaN(words) || isNaN(wpm) || words <= 0 || wpm <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const minutes = words / wpm
    return { error: null, minutes }
  }, [wordsStr, wpmStr])

  return (
    <FormCalculatorShell title="Reading Duration Time Solver" subtitle="Estimate reading times based on text length and speed rates" badge="EDUCATION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Word Count" value={wordsStr} onChange={setWordsStr} id="rs-w" />
          <RetroInput label="Reading Speed (WPM)" value={wpmStr} onChange={setWpmStr} id="rs-sp" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Read Time" value={`${results.minutes.toFixed(1)} minutes`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
