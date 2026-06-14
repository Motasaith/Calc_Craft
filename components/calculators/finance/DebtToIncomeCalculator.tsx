'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function DebtToIncomeCalculator() {
  const [income, setIncome] = useState('5000')
  const [rent, setRent] = useState('1200')
  const [car, setCar] = useState('400')
  const [creditCards, setCreditCards] = useState('200')
  const [other, setOther] = useState('300')
  const [result, setResult] = useState<{dti:number,totalDebt:number,status:string}|null>(null)

  const calculate = () => {
    const inc = parseFloat(income)
    const debt = parseFloat(rent) + parseFloat(car) + parseFloat(creditCards) + parseFloat(other)
    if (inc <= 0) { setResult(null); return }
    const dti = (debt / inc) * 100
    let status = 'Excellent'
    if (dti > 20) status = 'Good'
    if (dti > 36) status = 'Fair'
    if (dti > 43) status = 'Poor'
    setResult({ dti, totalDebt: debt, status })
  }

  return (
    <FormCalculatorShell title="Debt-to-Income Ratio" badge="FINANCE">
      <RetroInput label="Monthly Gross Income" value={income} onChange={setIncome} placeholder="5000" id="dti-inc" unit="$" />
      <RetroInput label="Rent/Mortgage" value={rent} onChange={setRent} placeholder="1200" id="dti-rent" unit="$" />
      <RetroInput label="Car Payment" value={car} onChange={setCar} placeholder="400" id="dti-car" unit="$" />
      <RetroInput label="Credit Card Min Payments" value={creditCards} onChange={setCreditCards} placeholder="200" id="dti-cc" unit="$" />
      <RetroInput label="Other Debt" value={other} onChange={setOther} placeholder="300" id="dti-other" unit="$" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate DTI</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="DTI Ratio" value={`${result.dti.toFixed(2)}%`} large />
          <ResultDisplay label="Total Debt" value={`$${result.totalDebt.toFixed(2)}`} />
          <ResultDisplay label="Rating" value={result.status} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
