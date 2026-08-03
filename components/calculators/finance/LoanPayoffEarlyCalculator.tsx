'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function LoanPayoffEarlyCalculator() {
  const [balanceStr, setBalanceStr] = useState('20000')
  const [paymentStr, setPaymentStr] = useState('400')
  const [rateStr, setRateStr] = useState('6.0')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, months: 0 }
    const bal = parseFloat(balanceStr)
    const pmt = parseFloat(paymentStr)
    const rate = parseFloat(rateStr)

    if (isNaN(bal) || isNaN(pmt) || isNaN(rate) || bal <= 0 || pmt <= 0 || rate < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const r = (rate / 100) / 12
    if (pmt <= bal * r) return { ...defaultObj, error: 'Monthly payment must exceed interest charges to reduce principal.' }
    
    // Formula: N = -ln(1 - r * PV / PMT) / ln(1 + r)
    const months = -Math.log(1 - (r * bal) / pmt) / Math.log(1 + r)
    return { error: null, months }
  }, [balanceStr, paymentStr, rateStr])

  return (
    <FormCalculatorShell title="Early Loan Payoff Solver" subtitle="Calculate time needed to pay off loan balances with custom payments" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Remaining Balance ($)" value={balanceStr} onChange={setBalanceStr} id="lpe-b" />
          <RetroInput label="Monthly Payment Amount ($)" value={paymentStr} onChange={setPaymentStr} id="lpe-p" />
          <RetroInput label="Interest Rate (%)" value={rateStr} onChange={setRateStr} id="lpe-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Months to Pay Off" value={Math.ceil(results.months).toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
