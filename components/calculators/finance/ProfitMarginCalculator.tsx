'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ProfitMarginCalculator() {
  const [costStr, setCostStr] = useState('60')
  const [revenueStr, setRevenueStr] = useState('100')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, margin: 0, profit: 0, steps: [] as string[] }
    const cost = parseFloat(costStr)
    const rev = parseFloat(revenueStr)
    if (isNaN(cost) || isNaN(rev) || cost < 0 || rev <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive cost and revenue values.' }
    }
    const profit = rev - cost
    const margin = (profit / rev) * 100
    return {
      error: null,
      margin,
      profit,
      steps: [
        `Gross Profit = Revenue - Cost = $${rev} - $${cost} = $${profit.toFixed(2)}`,
        `Profit Margin = (Profit / Revenue) × 100 = ($${profit.toFixed(2)} / $${rev}) × 100 = ${margin.toFixed(2)}%`
      ]
    }
  }, [costStr, revenueStr])

  return (
    <FormCalculatorShell title="Profit Margin Solver" subtitle="Calculate margins and net profits from sales data" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Cost ($)" value={costStr} onChange={setCostStr} id="pm-c" />
          <RetroInput label="Revenue ($)" value={revenueStr} onChange={setRevenueStr} id="pm-r" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Profit Margin" value={`${results.margin.toFixed(2)}%`} large />
                <ResultDisplay label="Gross Profit" value={results.profit.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
