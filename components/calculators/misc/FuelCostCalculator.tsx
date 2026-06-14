'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState('500')
  const [efficiency, setEfficiency] = useState('15')
  const [price, setPrice] = useState('1.5')
  const [result, setResult] = useState<{fuel:number,cost:number}|null>(null)

  const calculate = () => {
    const d = parseFloat(distance), e = parseFloat(efficiency), p = parseFloat(price)
    if (isNaN(d)||isNaN(e)||isNaN(p) || e<=0) { setResult(null); return }
    const fuel = d / e
    const cost = fuel * p
    setResult({ fuel, cost })
  }

  return (
    <FormCalculatorShell title="Fuel Cost" badge="MISC">
      <RetroInput label="Distance (km)" value={distance} onChange={setDistance} placeholder="500" id="fuel-d" />
      <RetroInput label="Efficiency (km/L)" value={efficiency} onChange={setEfficiency} placeholder="15" id="fuel-e" />
      <RetroInput label="Price per Liter" value={price} onChange={setPrice} placeholder="1.5" id="fuel-p" unit="$" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Fuel Needed" value={`${result.fuel.toFixed(2)} L`} />
          <ResultDisplay label="Total Cost" value={formatCurrency(result.cost)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
