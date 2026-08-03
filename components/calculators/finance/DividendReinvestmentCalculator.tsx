'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DividendReinvestmentCalculator() {
  const [sharesStr, setSharesStr] = useState('100')
  const [divStr, setDivStr] = useState('3.0') // annual dividend yield %
  const [yearsStr, setYearsStr] = useState('10')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, finalShares: 0 }
    const shares = parseFloat(sharesStr)
    const yieldRate = parseFloat(divStr)
    const years = parseFloat(yearsStr)

    if (isNaN(shares) || isNaN(yieldRate) || isNaN(years) || shares < 0 || yieldRate < 0 || years < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const finalShares = shares * Math.pow(1 + yieldRate / 100, years)
    return { error: null, finalShares }
  }, [sharesStr, divStr, yearsStr])

  return (
    <FormCalculatorShell title="Dividend Reinvestment DRIP Solver" subtitle="Project share count growth via dividend reinvestment compounding" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Initial Share Count" value={sharesStr} onChange={setSharesStr} id="drip-s" />
          <RetroInput label="Annual Dividend Yield (%)" value={divStr} onChange={setDivStr} id="drip-y" />
          <RetroInput label="Duration (Years)" value={yearsStr} onChange={setYearsStr} id="drip-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Projected Share Count" value={results.finalShares.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
