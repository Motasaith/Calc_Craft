'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function SalesTaxCalculator() {
  const [price, setPrice] = useState('100')
  const [taxRate, setTaxRate] = useState('8.25')
  const [result, setResult] = useState<{tax:number,total:number}|null>(null)

  const calculate = () => {
    const p = parseFloat(price), t = parseFloat(taxRate)
    if (isNaN(p)||isNaN(t)) { setResult(null); return }
    const tax = p * (t / 100)
    setResult({ tax, total: p + tax })
  }

  return (
    <FormCalculatorShell title="Sales Tax Calculator" badge="FINANCE">
      <RetroInput label="Price" value={price} onChange={setPrice} placeholder="100" id="st-price" unit="$" />
      <RetroInput label="Tax Rate" value={taxRate} onChange={setTaxRate} placeholder="8.25" id="st-rate" unit="%" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Tax Amount" value={formatCurrency(result.tax)} />
          <ResultDisplay label="Total" value={formatCurrency(result.total)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
