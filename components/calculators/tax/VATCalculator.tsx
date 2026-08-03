'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function VATCalculator() {
  const [netStr, setNetStr] = useState('100')
  const [rateStr, setRateStr] = useState('20') // %

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, vatAmount: 0, grossAmount: 0, steps: [] as string[] }
    const net = parseFloat(netStr)
    const rate = parseFloat(rateStr)
    if (isNaN(net) || isNaN(rate) || net < 0 || rate < 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const vatAmount = net * (rate / 100)
    const grossAmount = net + vatAmount
    return {
      error: null,
      vatAmount,
      grossAmount,
      steps: [
        `VAT Amount = Net Amount × (VAT Rate / 100) = ${net} × (${rate}/100) = ${vatAmount.toFixed(2)} USD`,
        `Gross Amount = Net Amount + VAT Amount = ${net} + ${vatAmount.toFixed(2)} = ${grossAmount.toFixed(2)} USD`
      ]
    }
  }, [netStr, rateStr])

  return (
    <FormCalculatorShell title="VAT Tax Solver" subtitle="Calculate Value Added Tax (VAT) amounts and gross pricing" badge="TAX">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Net Amount (Before Tax)" value={netStr} onChange={setNetStr} id="vat-net" />
          <RetroInput label="VAT Rate (%)" value={rateStr} onChange={setRateStr} id="vat-rate" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="VAT Amount" value={results.vatAmount.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
                <ResultDisplay label="Gross Amount" value={results.grossAmount.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
