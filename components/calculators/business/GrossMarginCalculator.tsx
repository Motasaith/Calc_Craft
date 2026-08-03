'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GrossMarginCalculator() {
  const [costStr, setCostStr] = useState('60')
  const [revenueStr, setRevenueStr] = useState('100')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, margin: 0, grossProfit: 0, markup: 0, steps: [] as string[] }
    const c = parseFloat(costStr)
    const r = parseFloat(revenueStr)
    if (isNaN(c) || isNaN(r) || c < 0 || r <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const grossProfit = r - c
    const margin = (grossProfit / r) * 100
    const markup = c > 0 ? (grossProfit / c) * 100 : 0
    return {
      error: null,
      margin,
      grossProfit,
      markup,
      steps: [
        `Gross Profit = Revenue - Cost = ${r} - ${c} = ${grossProfit} USD`,
        `Gross Margin = (Gross Profit / Revenue) × 100 = (${grossProfit} / ${r}) × 100 = ${margin.toFixed(2)}%`,
        `Markup = (Gross Profit / Cost) × 100 = (${grossProfit} / ${c}) × 100 = ${markup.toFixed(2)}%`
      ]
    }
  }, [costStr, revenueStr])

  return (
    <FormCalculatorShell title="Gross Margin & Profit Solver" subtitle="Calculate margins, gross profit, and markups from costs and revenues" badge="BUSINESS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Cost ($)" value={costStr} onChange={setCostStr} id="gm-c" />
          <RetroInput label="Revenue ($)" value={revenueStr} onChange={setRevenueStr} id="gm-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Gross Margin" value={`${results.margin.toFixed(2)}%`} large />
                <ResultDisplay label="Gross Profit" value={results.grossProfit.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
                <ResultDisplay label="Markup" value={`${results.markup.toFixed(2)}%`} />
              </div>
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
