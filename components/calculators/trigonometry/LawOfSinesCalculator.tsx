'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function LawOfSinesCalculator() {
  const [sideAStr, setSideAStr] = useState('5')
  const [angAStr, setAngAStr] = useState('30') // degrees
  const [angBStr, setAngBStr] = useState('45') // degrees

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, sideB: 0 }
    const a = parseFloat(sideAStr)
    const alpha = parseFloat(angAStr)
    const beta = parseFloat(angBStr)

    if (isNaN(a) || isNaN(alpha) || isNaN(beta) || a <= 0 || alpha <= 0 || beta <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const alphaRad = (alpha * Math.PI) / 180
    const betaRad = (beta * Math.PI) / 180

    if (Math.sin(alphaRad) === 0) return { ...defaultObj, error: 'sin(A) cannot be zero.' }
    // Law of Sines: b = a * sin(B) / sin(A)
    const sideB = (a * Math.sin(betaRad)) / Math.sin(alphaRad)

    return { error: null, sideB }
  }, [sideAStr, angAStr, angBStr])

  return (
    <FormCalculatorShell title="Law of Sines Triangle Solver" subtitle="Calculate unknown side b from side a and opposite angles" badge="TRIGONOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Side a Length" value={sideAStr} onChange={setSideAStr} id="los-a" />
          <RetroInput label="Angle A (Degrees °)" value={angAStr} onChange={setAngAStr} id="los-aa" />
          <RetroInput label="Angle B (Degrees °)" value={angBStr} onChange={setAngBStr} id="los-ab" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Side b Length" value={results.sideB.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
