'use client'
import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { ResultDisplay, RetroSlider } from '../shared/FormCalculatorShell'
import { calculateEMI, formatCurrency } from '@/lib/calc-engine'

export default function MortgageCalculator() {
  const [home, setHome] = useState(300000)
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(30)

  const [payment, setPayment] = useState(0)
  const [total, setTotal] = useState(0)
  const [interest, setInterest] = useState(0)

  useEffect(() => {
    let cancelled = false
    const loanAmt = home * (1 - down / 100)
    calculateEMI(loanAmt, rate, years * 12).then((r) => {
      if (cancelled) return
      setPayment(r.emi)
      setTotal(r.totalPayment)
      setInterest(r.totalInterest)
    })
    return () => { cancelled = true }
  }, [home, down, rate, years])

  const loanAmt = home * (1 - down / 100)

  return (
    <FormCalculatorShell title="Mortgage Calculator" badge="FINANCE">
      <RetroSlider label="Home Price" value={home} onChange={setHome} min={50000} max={2000000} step={5000} displayValue={`$${home.toLocaleString()}`} id="mort-h" />
      <RetroSlider label="Down Payment" value={down} onChange={setDown} min={0} max={50} step={1} displayValue={`${down}% ($${Math.round(home * down / 100).toLocaleString()})`} id="mort-d" />
      <RetroSlider label="Interest Rate" value={rate} onChange={setRate} min={1} max={15} step={0.1} displayValue={`${rate}%`} id="mort-r" />
      <RetroSlider label="Loan Term" value={years} onChange={setYears} min={5} max={30} step={5} displayValue={`${years} Years`} id="mort-y" />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <ResultDisplay label="Monthly Payment" value={formatCurrency(payment)} large />
        <ResultDisplay label="Total Interest" value={formatCurrency(interest)} large />
        <ResultDisplay label="Loan Amount" value={formatCurrency(loanAmt)} />
        <ResultDisplay label="Total Cost" value={formatCurrency(total)} />
      </div>
    </FormCalculatorShell>
  )
}
