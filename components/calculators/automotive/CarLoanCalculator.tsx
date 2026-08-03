'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CarLoanCalculator() {
  const [priceStr, setPriceStr] = useState('25000')
  const [downStr, setDownStr] = useState('3000')
  const [rateStr, setRateStr] = useState('5.5') // annual interest rate
  const [termStr, setTermStr] = useState('60') // months

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, monthlyPayment: 0, steps: [] as string[] }
    const p = parseFloat(priceStr)
    const d = parseFloat(downStr)
    const r = parseFloat(rateStr)
    const t = parseInt(termStr)

    if (isNaN(p) || isNaN(d) || isNaN(r) || isNaN(t) || p <= 0 || d < 0 || r < 0 || t <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive parameters.' }
    }

    const principal = p - d
    if (principal <= 0) return { ...defaultObj, error: 'Down payment exceeds or matches purchase price.' }

    const monthlyRate = (r / 100) / 12
    const payment = monthlyRate > 0 
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, t)) / (Math.pow(1 + monthlyRate, t) - 1)
      : principal / t

    return {
      error: null,
      monthlyPayment: payment,
      steps: [
        `Principal amount = Price - Down Payment = ${principal.toLocaleString()}`,
        `Monthly Interest Rate = ${(monthlyRate * 100).toFixed(4)}%`,
        `Monthly Amortized Payment = ${payment.toLocaleString(undefined, {style: 'currency', currency: 'USD'})}`
      ]
    }
  }, [priceStr, downStr, rateStr, termStr])

  return (
    <FormCalculatorShell title="Car Loan Payment Solver" subtitle="Calculate monthly amortized car payments" badge="AUTOMOTIVE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Purchase Price ($)" value={priceStr} onChange={setPriceStr} id="cl-p" />
          <RetroInput label="Down Payment ($)" value={downStr} onChange={setDownStr} id="cl-d" />
          <RetroInput label="Interest Rate (APR %)" value={rateStr} onChange={setRateStr} id="cl-r" />
          <RetroInput label="Loan Term (months)" value={termStr} onChange={setTermStr} id="cl-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Monthly Payment" value={results.monthlyPayment.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
