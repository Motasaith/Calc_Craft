'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HorsepowerCalculator() {
  const [wattsStr, setWattsStr] = useState('746')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, hp: 0 }
    const w = parseFloat(wattsStr)
    if (isNaN(w) || w < 0) return { ...defaultObj, error: 'Please enter valid power values.' }
    // 1 horsepower = 745.6998 Watts
    const hp = w / 745.6998
    return { error: null, hp }
  }, [wattsStr])

  return (
    <FormCalculatorShell title="Horsepower to Watts Solver" subtitle="Convert electrical wattage rates to mechanical horsepower" badge="ENGINEERING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Electrical Power (Watts)" value={wattsStr} onChange={setWattsStr} id="hpc-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Mechanical Power (HP)" value={`${results.hp.toFixed(2)} HP`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
