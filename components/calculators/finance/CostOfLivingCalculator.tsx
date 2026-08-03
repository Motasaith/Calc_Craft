'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CostOfLivingCalculator() {
  const [salaryStr, setSalaryStr] = useState('50000')
  const [indexA, setIndexA] = useState('100')
  const [indexB, setIndexB] = useState('120')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, needed: 0 }
    const s = parseFloat(salaryStr)
    const ia = parseFloat(indexA)
    const ib = parseFloat(indexB)

    if (isNaN(s) || isNaN(ia) || isNaN(ib) || s <= 0 || ia <= 0 || ib <= 0) {
      return { ...defaultObj, error: 'Please enter valid indices and salaries.' }
    }

    const needed = s * (ib / ia)
    return { error: null, needed }
  }, [salaryStr, indexA, indexB])

  return (
    <FormCalculatorShell title="Cost of Living Solver" subtitle="Compare purchasing power equivalency between index rates of two cities" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Current Salary ($)" value={salaryStr} onChange={setSalaryStr} id="col-s" />
          <RetroInput label="Current City Index (A)" value={indexA} onChange={setIndexA} id="col-ia" />
          <RetroInput label="Target City Index (B)" value={indexB} onChange={setIndexB} id="col-ib" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Equivalent Salary Required" value={results.needed.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
