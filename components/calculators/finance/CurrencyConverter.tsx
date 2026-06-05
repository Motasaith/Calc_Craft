'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { convertCurrency, formatNumber } from '@/lib/calc-engine'

const rates: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.36, AUD: 1.53, INR: 83.12, CNY: 7.24,
  CHF: 0.88, SGD: 1.34, HKD: 7.82, NZD: 1.64, KRW: 1298, MXN: 17.15, BRL: 4.97,
  ZAR: 18.63, SEK: 10.45, NOK: 10.52, TRY: 30.2, AED: 3.67, SAR: 3.75,
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')

  const amt = parseFloat(amount)
  const valid = !isNaN(amt) && amt > 0
  // Convert: amount → USD → target, using the engine's convertCurrency
  const rate = rates[to] / rates[from]
  const converted = valid ? convertCurrency(amt, rate) : 0
  const rateDisplay = valid ? rate : 0

  const options = Object.keys(rates).map((c) => ({ value: c, label: c }))

  return (
    <FormCalculatorShell title="Currency Converter" subtitle="Approximate rates · Not for financial decisions" badge="FINANCE">
      <RetroInput label="Amount" value={amount} onChange={setAmount} placeholder="100" id="curr-amt" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="curr-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="curr-to" />
      </div>
      {valid && (
        <div className="mt-4">
          <ResultDisplay label={`${amount} ${from} =`} value={`${formatNumber(converted, 4)} ${to}`} large />
          <div className="mt-2 text-[9px] font-mono text-neutral-500 text-center">
            Rate: 1 {from} = {formatNumber(rateDisplay, 4)} {to}
          </div>
        </div>
      )}
    </FormCalculatorShell>
  )
}
