'use client'
import React from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateDiscount, formatCurrency } from '@/lib/calc-engine'

export default function DiscountCalculator() {
  const [price, setPrice] = React.useState(''); const [discount, setDiscount] = React.useState('')

  const pv = parseFloat(price), dv = parseFloat(discount)
  const valid = !isNaN(pv) && !isNaN(dv) && pv > 0 && dv >= 0 && dv <= 100
  const result = valid ? calculateDiscount(pv, dv) : { finalPrice: 0, saved: 0 }

  return (
    <FormCalculatorShell title="Discount Calculator" badge="FINANCE">
      <RetroInput label="Original Price" value={price} onChange={setPrice} placeholder="e.g. 199.99" id="disc-p" unit="$" />
      <RetroInput label="Discount" value={discount} onChange={setDiscount} placeholder="e.g. 20" id="disc-d" unit="%" />
      {valid && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ResultDisplay label="You Save" value={formatCurrency(result.saved)} />
          <ResultDisplay label="Final Price" value={formatCurrency(result.finalPrice)} large />
          <ResultDisplay label="Discount" value={`${dv}%`} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
