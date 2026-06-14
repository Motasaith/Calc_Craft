'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function RentVsBuyCalculator() {
  const [monthlyRent, setMonthlyRent] = useState('2000')
  const [homePrice, setHomePrice] = useState('400000')
  const [downPayment, setDownPayment] = useState('80000')
  const [mortgageRate, setMortgageRate] = useState('6.5')
  const [years, setYears] = useState('10')
  const [appreciation, setAppreciation] = useState('3')
  const [result, setResult] = useState<{rentTotal:number,buyTotal:number,equity:number,netBuy:number}|null>(null)

  const calculate = () => {
    const rent = parseFloat(monthlyRent)
    const price = parseFloat(homePrice)
    const down = parseFloat(downPayment)
    const rate = parseFloat(mortgageRate) / 12 / 100
    const yr = parseInt(years)
    const appr = parseFloat(appreciation) / 100
    const months = yr * 12
    const loan = price - down
    const payment = rate === 0 ? loan / (yr * 12) : loan * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1)
    const rentTotal = rent * months
    const buyTotal = down + payment * months
    const futureValue = price * Math.pow(1 + appr, yr)
    const equity = futureValue - (loan - (payment * months - loan * rate * months))
    setResult({ rentTotal, buyTotal, equity, netBuy: buyTotal - equity })
  }

  return (
    <FormCalculatorShell title="Rent vs. Buy" badge="FINANCE">
      <RetroInput label="Monthly Rent" value={monthlyRent} onChange={setMonthlyRent} placeholder="2000" id="rvb-rent" unit="$" />
      <RetroInput label="Home Price" value={homePrice} onChange={setHomePrice} placeholder="400000" id="rvb-price" unit="$" />
      <RetroInput label="Down Payment" value={downPayment} onChange={setDownPayment} placeholder="80000" id="rvb-down" unit="$" />
      <RetroInput label="Mortgage Rate" value={mortgageRate} onChange={setMortgageRate} placeholder="6.5" id="rvb-rate" unit="%" />
      <RetroInput label="Years to Compare" value={years} onChange={setYears} placeholder="10" id="rvb-yr" unit="yr" />
      <RetroInput label="Home Appreciation" value={appreciation} onChange={setAppreciation} placeholder="3" id="rvb-app" unit="%" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Compare</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Total Rent Cost" value={formatCurrency(result.rentTotal)} />
          <ResultDisplay label="Total Buy Cost" value={formatCurrency(result.buyTotal)} />
          <ResultDisplay label="Est. Equity" value={formatCurrency(result.equity)} large />
          <ResultDisplay label="Net Buy Cost" value={formatCurrency(result.netBuy)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
