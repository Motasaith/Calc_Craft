'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSlider } from '../shared/FormCalculatorShell'

export default function MortgageCalculator() {
  const [home, setHome] = useState(300000)
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(30)

  const loanAmt = home * (1 - down / 100)
  const R = rate / 12 / 100, N = years * 12
  const payment = R > 0 ? (loanAmt * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1) : loanAmt / N
  const total = payment * N
  const interest = total - loanAmt

  return (
    <FormCalculatorShell title="Mortgage Calculator" badge="FINANCE">
      <RetroSlider label="Home Price" value={home} onChange={setHome} min={50000} max={2000000} step={5000} displayValue={`$${home.toLocaleString()}`} id="mort-h" />
      <RetroSlider label="Down Payment" value={down} onChange={setDown} min={0} max={50} step={1} displayValue={`${down}% ($${Math.round(home * down / 100).toLocaleString()})`} id="mort-d" />
      <RetroSlider label="Interest Rate" value={rate} onChange={setRate} min={1} max={15} step={0.1} displayValue={`${rate}%`} id="mort-r" />
      <RetroSlider label="Loan Term" value={years} onChange={setYears} min={5} max={30} step={5} displayValue={`${years} Years`} id="mort-y" />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <ResultDisplay label="Monthly Payment" value={`$${Math.round(payment).toLocaleString()}`} large />
        <ResultDisplay label="Total Interest" value={`$${Math.round(interest).toLocaleString()}`} large />
        <ResultDisplay label="Loan Amount" value={`$${Math.round(loanAmt).toLocaleString()}`} />
        <ResultDisplay label="Total Cost" value={`$${Math.round(total).toLocaleString()}`} />
      </div>
    </FormCalculatorShell>
  )
}
