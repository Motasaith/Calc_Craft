'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function DiscountCalculator() {
  const [price, setPrice] = useState(''); const [discount, setDiscount] = useState('')

  const pv = parseFloat(price), dv = parseFloat(discount)
  const valid = !isNaN(pv) && !isNaN(dv) && pv > 0 && dv >= 0 && dv <= 100
  const saved = valid ? pv * (dv / 100) : 0
  const final_ = valid ? pv - saved : 0

  return (
    <FormCalculatorShell title="Discount Calculator" badge="FINANCE">
      <RetroInput label="Original Price" value={price} onChange={setPrice} placeholder="e.g. 199.99" id="disc-p" unit="$" />
      <RetroInput label="Discount" value={discount} onChange={setDiscount} placeholder="e.g. 20" id="disc-d" unit="%" />
      {valid && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ResultDisplay label="You Save" value={`$${saved.toFixed(2)}`} />
          <ResultDisplay label="Final Price" value={`$${final_.toFixed(2)}`} large />
          <ResultDisplay label="Discount" value={`${dv}%`} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
