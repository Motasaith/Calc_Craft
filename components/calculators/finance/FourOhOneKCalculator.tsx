'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FourOhOneKCalculator() {
  const [salaryStr, setSalaryStr] = useState('60000')
  const [contribStr, setContribStr] = useState('6') // % contribution
  const [matchStr, setMatchStr] = useState('50') // % employer match on first 6%

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, annual: 0, employer: 0 }
    const sal = parseFloat(salaryStr)
    const pct = parseFloat(contribStr)
    const match = parseFloat(matchStr)

    if (isNaN(sal) || isNaN(pct) || isNaN(match) || sal <= 0 || pct < 0 || match < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const annual = sal * (pct / 100)
    const matchLimit = Math.min(pct, 6)
    const employer = sal * (matchLimit / 100) * (match / 100)

    return { error: null, annual, employer }
  }, [salaryStr, contribStr, matchStr])

  return (
    <FormCalculatorShell title="401(k) Employer Match Solver" subtitle="Calculate employee contributions and employer matching allocations" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Gross Annual Salary ($)" value={salaryStr} onChange={setSalaryStr} id="k-s" />
          <RetroInput label="Your Contribution (%)" value={contribStr} onChange={setContribStr} id="k-c" />
          <RetroInput label="Employer Match (%) (e.g. 50% on first 6%)" value={matchStr} onChange={setMatchStr} id="k-m" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Your Annual Deposit" value={results.annual.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
              <ResultDisplay label="Employer Match Share" value={results.employer.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
