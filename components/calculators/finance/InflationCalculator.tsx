'use client'
import React, { useEffect, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateInflation, formatCurrency } from '@/lib/calc-engine'

export default function InflationCalculator() {
  const [amount, setAmount] = useState(''); const [rate, setRate] = useState(''); const [years, setYears] = useState('')

  const av = parseFloat(amount), rv = parseFloat(rate), yv = parseFloat(years)
  const valid = !isNaN(av) && !isNaN(rv) && !isNaN(yv) && av > 0 && rv > 0 && yv > 0

  const [future, setFuture] = useState(0)
  const [purchasing, setPurchasing] = useState(0)

  useEffect(() => {
    let cancelled = false
    if (!valid) { setFuture(0); setPurchasing(0); return }
    calculateInflation(av, rv, yv).then((r) => {
      if (cancelled) return
      setFuture(r.futureValue)
      setPurchasing(av - r.purchasingPowerLoss) // current value of future purchasing power
    })
    return () => { cancelled = true }
  }, [av, rv, yv, valid])

  return (
    <FormCalculatorShell title="Inflation Calculator" badge="FINANCE">
      <RetroInput label="Current Amount" value={amount} onChange={setAmount} placeholder="e.g. 10000" id="inf-a" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Inflation Rate" value={rate} onChange={setRate} placeholder="e.g. 3" id="inf-r" unit="% / yr" />
        <RetroInput label="Years" value={years} onChange={setYears} placeholder="e.g. 10" id="inf-y" />
      </div>
      {valid && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ResultDisplay label="Future Cost" value={formatCurrency(future)} large />
          <ResultDisplay label="Purchasing Power" value={formatCurrency(purchasing)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
