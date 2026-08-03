'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TTestCalculator() {
  const [mean1Str, setMean1Str] = useState('10')
  const [mean2Str, setMean2Str] = useState('12')
  const [sd1Str, setSd1Str] = useState('2')
  const [sd2Str, setSd2Str] = useState('2.5')
  const [n1Str, setN1Str] = useState('30')
  const [n2Str, setN2Str] = useState('30')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, t: 0 }
    const m1 = parseFloat(mean1Str)
    const m2 = parseFloat(mean2Str)
    const s1 = parseFloat(sd1Str)
    const s2 = parseFloat(sd2Str)
    const n1 = parseFloat(n1Str)
    const n2 = parseFloat(n2Str)

    if (isNaN(m1) || isNaN(m2) || isNaN(s1) || isNaN(s2) || isNaN(n1) || isNaN(n2) || n1 <= 1 || n2 <= 1) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const num = m1 - m2
    const den = Math.sqrt((s1 * s1) / n1 + (s2 * s2) / n2)

    if (den === 0) return { ...defaultObj, error: 'Denominator is zero.' }
    const t = num / den

    return { error: null, t }
  }, [mean1Str, mean2Str, sd1Str, sd2Str, n1Str, n2Str])

  return (
    <FormCalculatorShell title="Student's Independent T-Test Solver" subtitle="Calculate independent sample t-statistics indices" badge="STATISTICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Mean 1" value={mean1Str} onChange={setMean1Str} id="tt-m1" />
            <RetroInput label="Mean 2" value={mean2Str} onChange={setMean2Str} id="tt-m2" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Std Dev 1" value={sd1Str} onChange={setSd1Str} id="tt-s1" />
            <RetroInput label="Std Dev 2" value={sd2Str} onChange={setSd2Str} id="tt-s2" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Sample Size 1" value={n1Str} onChange={setN1Str} id="tt-n1" />
            <RetroInput label="Sample Size 2" value={n2Str} onChange={setN2Str} id="tt-n2" />
          </div>
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="t-Statistic Value" value={results.t.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
