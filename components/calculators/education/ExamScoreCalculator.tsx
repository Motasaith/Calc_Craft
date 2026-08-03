'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ExamScoreCalculator() {
  const [questionsStr, setQuestionsStr] = useState('50')
  const [wrongStr, setWrongStr] = useState('5')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, score: 0, steps: [] as string[] }
    const q = parseInt(questionsStr)
    const w = parseInt(wrongStr)
    if (isNaN(q) || isNaN(w) || q <= 0 || w < 0 || w > q) return { ...defaultObj, error: 'Please enter valid questions counts.' }
    const score = ((q - w) / q) * 100
    return {
      error: null,
      score,
      steps: [
        `Correct Questions = Total - Wrong = ${q} - ${w} = ${q - w}`,
        `Score Percentage = (Correct / Total) × 100 = ${score.toFixed(2)}%`
      ]
    }
  }, [questionsStr, wrongStr])

  return (
    <FormCalculatorShell title="Exam Score Solver" subtitle="Calculate grade percentage from total and incorrect question counts" badge="EDUCATION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Questions" value={questionsStr} onChange={setQuestionsStr} id="exs-q" />
          <RetroInput label="Incorrect Questions" value={wrongStr} onChange={setWrongStr} id="exs-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Grade Percentage" value={`${results.score.toFixed(2)}%`} large />
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
