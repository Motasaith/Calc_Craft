'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function LoveCalculator() {
  const [name1, setName1] = useState('Romeo')
  const [name2, setName2] = useState('Juliet')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, pct: 0 }
    const combined = (name1.trim() + name2.trim()).toLowerCase()
    if (!combined) return { ...defaultObj, error: 'Please enter both names.' }
    
    // Hash combined name chars to get consistent percentage
    let sum = 0
    for (let i = 0; i < combined.length; i++) {
      sum += combined.charCodeAt(i)
    }
    const pct = (sum % 51) + 50 // 50% to 100%

    return { error: null, pct }
  }, [name1, name2])

  return (
    <FormCalculatorShell title="Name Match Compatibility Solver" subtitle="Generate match percentages using name string hashes" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="First Name" value={name1} onChange={setName1} id="lv-n1" />
          <RetroInput label="Second Name" value={name2} onChange={setName2} id="lv-n2" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Compatibility Match" value={`${results.pct}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
