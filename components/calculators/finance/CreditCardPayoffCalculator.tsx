'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CreditCardPayoffCalculator() {
  const [balanceStr, setBalanceStr] = useState('5000')
  const [rateStr, setRateStr] = useState('18') // APR %
  const [monthlyStr, setMonthlyStr] = useState('150')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, months: 0, interest: 0 }
    const bal = parseFloat(balanceStr)
    const apr = parseFloat(rateStr)
    const pm = parseFloat(monthlyStr)

    if (isNaN(bal) || isNaN(apr) || isNaN(pm) || bal <= 0 || apr < 0 || pm <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const r = apr / 12 / 100
    if (pm <= bal * r) {
      return { ...defaultObj, error: 'Monthly payment must be greater than monthly interest charges.' }
    }

    let tempBal = bal
    let months = 0
    let interest = 0
    while (tempBal > 0 && months < 360) {
      const interestCharge = tempBal * r
      interest += interestCharge
      tempBal = tempBal + interestCharge - pm
      months++
    }

    return { error: null, months, interest }
  }, [balanceStr, rateStr, monthlyStr])

  return (
    <FormCalculatorShell title="Credit Card Payoff Solver" subtitle="Calculate total payback months and interest charges for credit balances" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Card Balance ($)" value={balanceStr} onChange={setBalanceStr} id="ccp-b" />
          <RetroInput label="Card APR (%)" value={rateStr} onChange={setRateStr} id="ccp-r" />
          <RetroInput label="Target Monthly Payment ($)" value={monthlyStr} onChange={setMonthlyStr} id="ccp-m" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Months to Pay Off" value={results.months.toString()} />
              <ResultDisplay label="Total Interest Charges" value={results.interest.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
