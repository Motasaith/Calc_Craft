'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroSlider, ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateTip, formatCurrency } from '@/lib/calc-engine'

export default function TipCalculator() {
  const [bill, setBill] = useState(50)
  const [tipPct, setTipPct] = useState(15)
  const [people, setPeople] = useState(1)

  const r = calculateTip(bill, tipPct, people)

  return (
    <FormCalculatorShell title="Tip Calculator" badge="FINANCE">
      <RetroSlider label="Bill Amount" value={bill} onChange={setBill} min={1} max={1000} step={1} displayValue={`$${bill}`} id="tip-bill" />
      <RetroSlider label="Tip Percentage" value={tipPct} onChange={setTipPct} min={0} max={50} step={1} displayValue={`${tipPct}%`} id="tip-pct" />
      <RetroSlider label="Split Between" value={people} onChange={setPeople} min={1} max={20} step={1} displayValue={`${people} ${people === 1 ? 'person' : 'people'}`} id="tip-ppl" />

      <div className="grid grid-cols-3 gap-2 mt-4">
        <ResultDisplay label="Tip Amount" value={formatCurrency(r.tip)} />
        <ResultDisplay label="Total Bill" value={formatCurrency(r.total)} />
        <ResultDisplay label="Per Person" value={formatCurrency(r.perPerson)} large />
      </div>
    </FormCalculatorShell>
  )
}
