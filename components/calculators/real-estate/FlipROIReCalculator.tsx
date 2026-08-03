'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FlipROIReCalculator() {
  const [purchaseStr, setPurchaseStr] = useState('150000')
  const [rehabStr, setRehabStr] = useState('30000')
  const [saleStr, setSaleStr] = useState('230000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, profit: 0, roi: 0 }
    const p = parseFloat(purchaseStr)
    const r = parseFloat(rehabStr)
    const s = parseFloat(saleStr)

    if (isNaN(p) || isNaN(r) || isNaN(s) || p <= 0 || r < 0 || s <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const totalCost = p + r
    const profit = s - totalCost
    const roi = (profit / totalCost) * 100

    return { error: null, profit, roi }
  }, [purchaseStr, rehabStr, saleStr])

  return (
    <FormCalculatorShell title="Fix and Flip ROI Solver" subtitle="Calculate net return on investment percentages for house flips" badge="REAL ESTATE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Purchase Price ($)" value={purchaseStr} onChange={setPurchaseStr} id="ff-p" />
          <RetroInput label="Rehab Cost ($)" value={rehabStr} onChange={setRehabStr} id="ff-r" />
          <RetroInput label="Sale Price ($)" value={saleStr} onChange={setSaleStr} id="ff-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Net Profit" value={results.profit.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
              <ResultDisplay label="Return on Investment" value={`${results.roi.toFixed(2)}%`} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
