'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function CommissionCalculator() {
  const [sales, setSales] = useState('10000')
  const [rate, setRate] = useState('10')
  const [bonus, setBonus] = useState('0')
  const [result, setResult] = useState<{commission:number,total:number}|null>(null)

  const calculate = () => {
    const s = parseFloat(sales), r = parseFloat(rate), b = parseFloat(bonus)
    if (isNaN(s)||isNaN(r)) { setResult(null); return }
    const comm = s * (r / 100)
    setResult({ commission: comm, total: comm + (isNaN(b) ? 0 : b) })
  }

  return (
    <FormCalculatorShell title="Commission Calculator" badge="FINANCE">
      <RetroInput label="Sales Amount" value={sales} onChange={setSales} placeholder="10000" id="comm-sales" unit="$" />
      <RetroInput label="Commission Rate" value={rate} onChange={setRate} placeholder="10" id="comm-rate" unit="%" />
      <RetroInput label="Bonus" value={bonus} onChange={setBonus} placeholder="0" id="comm-bonus" unit="$" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Commission" value={formatCurrency(result.commission)} />
          <ResultDisplay label="Total Earnings" value={formatCurrency(result.total)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
