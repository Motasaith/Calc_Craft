'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function FourOhOneKCalculator() {
  const [salary, setSalary] = useState('75000')
  const [contribution, setContribution] = useState('6')
  const [employerMatch, setEmployerMatch] = useState('3')
  const [currentBalance, setCurrentBalance] = useState('25000')
  const [rate, setRate] = useState('7')
  const [years, setYears] = useState('30')
  const [result, setResult] = useState('')

  const calculate = () => {
    const sal = parseFloat(salary), contrib = parseFloat(contribution) / 100
    const match = parseFloat(employerMatch) / 100, bal = parseFloat(currentBalance)
    const r = parseFloat(rate) / 100, yr = parseInt(years)
    const employeeContrib = sal * contrib
    const employerContrib = sal * Math.min(match, contrib)
    const totalAnnual = employeeContrib + employerContrib
    const fv = bal * Math.pow(1 + r, yr) + totalAnnual * (Math.pow(1 + r, yr) - 1) / r
    setResult(formatCurrency(fv))
  }

  return (
    <FormCalculatorShell title="401(k) Calculator" badge="FINANCE">
      <RetroInput label="Annual Salary" value={salary} onChange={setSalary} placeholder="75000" id="401k-sal" unit="$" />
      <RetroInput label="Your Contribution %" value={contribution} onChange={setContribution} placeholder="6" id="401k-con" unit="%" />
      <RetroInput label="Employer Match %" value={employerMatch} onChange={setEmployerMatch} placeholder="3" id="401k-match" unit="%" />
      <RetroInput label="Current Balance" value={currentBalance} onChange={setCurrentBalance} placeholder="25000" id="401k-bal" unit="$" />
      <RetroInput label="Expected Return" value={rate} onChange={setRate} placeholder="7" id="401k-rate" unit="%" />
      <RetroInput label="Years Until Retirement" value={years} onChange={setYears} placeholder="30" id="401k-yr" unit="yr" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Project Balance</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Projected 401(k) Balance" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
