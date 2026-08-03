'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function LifetimeValueCalculator() {
  const [arpuStr, setArpuStr] = useState('50') // average revenue per user monthly
  const [churnStr, setChurnStr] = useState('2') // % monthly churn

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ltv: 0 }
    const arpu = parseFloat(arpuStr)
    const churn = parseFloat(churnStr)

    if (isNaN(arpu) || isNaN(churn) || arpu < 0 || churn <= 0 || churn > 100) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // LTV = ARPU / churn_rate
    const ltv = arpu / (churn / 100)
    return { error: null, ltv }
  }, [arpuStr, churnStr])

  return (
    <FormCalculatorShell title="Customer Lifetime Value LTV Solver" subtitle="Estimate total expected user lifetime revenues using churn rates" badge="BUSINESS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Monthly Average Revenue per User (ARPU, $)" value={arpuStr} onChange={setArpuStr} id="ltv-a" />
          <RetroInput label="Monthly Churn Rate (%)" value={churnStr} onChange={setChurnStr} id="ltv-c" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Customer Lifetime Value (LTV)" value={results.ltv.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
