'use client'

import React, { useEffect, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSlider } from '../shared/FormCalculatorShell'
import { calculateEMI, formatCurrency } from '@/lib/calc-engine'

export default function LoanEmiCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(7.5)
  const [tenure, setTenure] = useState(15)

  const [emi, setEmi] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  useEffect(() => {
    let cancelled = false
    calculateEMI(principal, rate, tenure * 12).then((r) => {
      if (cancelled) return
      setEmi(r.emi)
      setTotalPayment(r.totalPayment)
      setTotalInterest(r.totalInterest)
    })
    return () => { cancelled = true }
  }, [principal, rate, tenure])

  const P = principal

  return (
    <FormCalculatorShell title="Loan EMI Calculator" badge="FINANCE">
      <RetroSlider label="Loan Amount" value={principal} onChange={setPrincipal} min={1000} max={1000000} step={1000} displayValue={`$${principal.toLocaleString()}`} id="emi-p" />
      <RetroSlider label="Interest Rate" value={rate} onChange={setRate} min={0.5} max={30} step={0.1} displayValue={`${rate}%`} id="emi-r" />
      <RetroSlider label="Tenure" value={tenure} onChange={setTenure} min={1} max={30} step={1} displayValue={`${tenure} Years`} id="emi-t" />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <ResultDisplay label="Monthly EMI" value={formatCurrency(emi)} large />
        <ResultDisplay label="Total Interest" value={formatCurrency(totalInterest)} large />
      </div>

      <div className="mt-3">
        <ResultDisplay label="Total Payment" value={formatCurrency(totalPayment)} />
      </div>

      {/* Visual breakdown bar */}
      {totalPayment > 0 && (
        <>
          <div className="mt-4 h-4 rounded-full overflow-hidden bg-neutral-200 border border-neutral-300 flex">
            <div className="bg-[#4c5c4a] h-full transition-all" style={{ width: `${(P / totalPayment) * 100}%` }} />
            <div className="bg-[#dfaa44] h-full transition-all" style={{ width: `${(totalInterest / totalPayment) * 100}%` }} />
          </div>
          <div className="flex justify-between mt-1 text-[9px] font-mono font-bold text-neutral-600">
            <span>■ Principal ({((P / totalPayment) * 100).toFixed(1)}%)</span>
            <span>■ Interest ({((totalInterest / totalPayment) * 100).toFixed(1)}%)</span>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}
