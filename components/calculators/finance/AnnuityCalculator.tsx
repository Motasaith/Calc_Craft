'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AnnuityCalculator() {
  const [paymentStr, setPaymentStr] = useState('1000') // monthly or yearly
  const [rateStr, setRateStr] = useState('5.0')
  const [periodsStr, setPeriodsStr] = useState('10') // years

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, presentValue: 0 }
    const p = parseFloat(paymentStr)
    const r = parseFloat(rateStr)
    const n = parseFloat(periodsStr)

    if (isNaN(p) || isNaN(r) || isNaN(n) || p < 0 || r < 0 || n < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const rateDec = r / 100
    const presentValue = rateDec > 0
      ? p * ((1 - Math.pow(1 + rateDec, -n)) / rateDec)
      : p * n

    return { error: null, presentValue }
  }, [paymentStr, rateStr, periodsStr])

  return (
    <FormCalculatorShell title="Annuity Present Value Solver" subtitle="Calculate present value of annual fixed payments" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Annual Payment ($)" value={paymentStr} onChange={setPaymentStr} id="ann-p" />
          <RetroInput label="Interest Rate (%)" value={rateStr} onChange={setRateStr} id="ann-r" />
          <RetroInput label="Duration (Years)" value={periodsStr} onChange={setPeriodsStr} id="ann-n" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Present Value of Annuity" value={results.presentValue.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
