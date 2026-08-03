'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function LTVCalculator() {
  const [loanStr, setLoanStr] = useState('240000')
  const [valueStr, setValueStr] = useState('300000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ltv: 0, steps: [] as string[] }
    const loan = parseFloat(loanStr)
    const val = parseFloat(valueStr)
    if (isNaN(loan) || isNaN(val) || loan < 0 || val <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const ltv = (loan / val) * 100
    return {
      error: null,
      ltv,
      steps: [
        `Formula: Loan-to-Value (LTV) = (Loan Amount / Appraised Value) × 100`,
        `LTV = (${loan.toLocaleString()} / ${val.toLocaleString()}) × 100 = ${ltv.toFixed(2)}%`
      ]
    }
  }, [loanStr, valueStr])

  return (
    <FormCalculatorShell title="Loan-to-Value LTV Solver" subtitle="Calculate LTV ratio percentages for mortgages" badge="REAL ESTATE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Loan Amount ($)" value={loanStr} onChange={setLoanStr} id="ltv-l" />
          <RetroInput label="Property Appraised Value ($)" value={valueStr} onChange={setValueStr} id="ltv-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Loan-to-Value Ratio" value={`${results.ltv.toFixed(2)}%`} large />
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
