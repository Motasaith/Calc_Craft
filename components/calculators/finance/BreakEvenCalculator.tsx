'use client'
import React from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateBreakEven, formatCurrency } from '@/lib/calc-engine'

export default function BreakEvenCalculator() {
  const [fixed, setFixed] = React.useState(''); const [varCost, setVarCost] = React.useState(''); const [price, setPrice] = React.useState('')

  const f = parseFloat(fixed), v = parseFloat(varCost), p = parseFloat(price)
  const valid = !isNaN(f) && !isNaN(v) && !isNaN(p) && f > 0 && v >= 0 && p > v
  const rawUnits = valid ? calculateBreakEven(f, p, v) : 0
  const units = valid && isFinite(rawUnits) ? Math.ceil(rawUnits) : 0
  const revenue = valid ? units * p : 0
  const contribution = valid ? p - v : 0

  return (
    <FormCalculatorShell title="Break-Even Calculator" badge="FINANCE">
      <RetroInput label="Fixed Costs" value={fixed} onChange={setFixed} placeholder="e.g. 10000" id="be-f" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Variable Cost / Unit" value={varCost} onChange={setVarCost} placeholder="e.g. 15" id="be-v" unit="$" />
        <RetroInput label="Selling Price / Unit" value={price} onChange={setPrice} placeholder="e.g. 50" id="be-p" unit="$" />
      </div>
      {!valid && p <= v && !isNaN(p) && !isNaN(v) && p > 0 && (
        <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">Price must exceed variable cost</div>
      )}
      {valid && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ResultDisplay label="Break-Even Units" value={units.toString()} large />
          <ResultDisplay label="Break-Even Revenue" value={formatCurrency(revenue)} />
          <ResultDisplay label="Contribution/Unit" value={formatCurrency(contribution)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
