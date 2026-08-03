'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CreditUtilizationCalculator() {
  const [balanceStr, setBalanceStr] = useState('1500')
  const [limitStr, setLimitStr] = useState('5000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, utilization: 0 }
    const bal = parseFloat(balanceStr)
    const lim = parseFloat(limitStr)

    if (isNaN(bal) || isNaN(lim) || bal < 0 || lim <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const utilization = (bal / lim) * 100
    return { error: null, utilization }
  }, [balanceStr, limitStr])

  return (
    <FormCalculatorShell title="Credit Utilization Ratio Solver" subtitle="Calculate credit utilization percentages" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Credit Card Balance ($)" value={balanceStr} onChange={setBalanceStr} id="cu-b" />
          <RetroInput label="Total Credit Limit ($)" value={limitStr} onChange={setLimitStr} id="cu-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Utilization Ratio" value={`${results.utilization.toFixed(2)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
