'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function ProfitMarginCalculator() {
  const [cost, setCost] = useState(''); const [revenue, setRevenue] = useState('')

  const cv = parseFloat(cost), rv = parseFloat(revenue)
  const valid = !isNaN(cv) && !isNaN(rv) && cv >= 0 && rv > 0
  const profit = valid ? rv - cv : 0
  const margin = valid ? (profit / rv) * 100 : 0
  const markup = valid && cv > 0 ? (profit / cv) * 100 : 0

  return (
    <FormCalculatorShell title="Profit Margin Calculator" badge="FINANCE">
      <RetroInput label="Cost Price" value={cost} onChange={setCost} placeholder="e.g. 80" id="pm-cost" unit="$" />
      <RetroInput label="Selling Price / Revenue" value={revenue} onChange={setRevenue} placeholder="e.g. 120" id="pm-rev" unit="$" />
      {valid && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ResultDisplay label="Profit" value={`$${profit.toFixed(2)}`} large />
          <ResultDisplay label="Margin" value={`${margin.toFixed(2)}%`} large />
          <ResultDisplay label="Markup" value={`${markup.toFixed(2)}%`} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
