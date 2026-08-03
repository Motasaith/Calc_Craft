'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MarkupCalculator() {
  const [costStr, setCostStr] = useState('80')
  const [markupStr, setMarkupStr] = useState('25') // %

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, sellingPrice: 0, grossProfit: 0, steps: [] as string[] }
    const c = parseFloat(costStr)
    const m = parseFloat(markupStr)
    if (isNaN(c) || isNaN(m) || c < 0 || m < 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const grossProfit = c * (m / 100)
    const sellingPrice = c + grossProfit
    return {
      error: null,
      sellingPrice,
      grossProfit,
      steps: [
        `Gross Profit = Cost × (Markup% / 100) = ${c} × (${m}/100) = ${grossProfit.toFixed(2)} USD`,
        `Selling Price = Cost + Gross Profit = ${c} + ${grossProfit.toFixed(2)} = ${sellingPrice.toFixed(2)} USD`
      ]
    }
  }, [costStr, markupStr])

  return (
    <FormCalculatorShell title="Markup Calculator" subtitle="Solve selling prices and markups from baseline costs" badge="BUSINESS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Cost ($)" value={costStr} onChange={setCostStr} id="mu-c" />
          <RetroInput label="Markup (%)" value={markupStr} onChange={setMarkupStr} id="mu-m" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Selling Price" value={results.sellingPrice.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
                <ResultDisplay label="Profit Margin Amount" value={results.grossProfit.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
