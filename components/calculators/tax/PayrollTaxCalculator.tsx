'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PayrollTaxCalculator() {
  const [salaryStr, setSalaryStr] = useState('60000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, fica: 0, medicare: 0 }
    const sal = parseFloat(salaryStr)
    if (isNaN(sal) || sal < 0) return { ...defaultObj, error: 'Please enter a valid salary.' }
    // FICA: 6.2% up to wage base limits. Medicare: 1.45%
    const fica = sal * 0.062
    const medicare = sal * 0.0145
    return { error: null, fica, medicare }
  }, [salaryStr])

  return (
    <FormCalculatorShell title="FICA Payroll Tax Solver" subtitle="Calculate employee payroll FICA and Medicare withholdings" badge="TAX">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Gross Annual Salary ($)" value={salaryStr} onChange={setSalaryStr} id="pr-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Social Security (6.2%)" value={results.fica.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
              <ResultDisplay label="Medicare (1.45%)" value={results.medicare.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
