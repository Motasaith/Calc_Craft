'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RentVsBuyCalculator() {
  const [rentStr, setRentStr] = useState('1500')
  const [mortgageStr, setMortgageStr] = useState('1800')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ratio: 0 }
    const rent = parseFloat(rentStr)
    const mort = parseFloat(mortgageStr)

    if (isNaN(rent) || isNaN(mort) || rent <= 0 || mort <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const ratio = (rent / mort) * 100
    return { error: null, ratio }
  }, [rentStr, mortgageStr])

  return (
    <FormCalculatorShell title="Rent vs Buy Cost Ratio Solver" subtitle="Compare monthly rental expenses to mortgage payments" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Monthly Rental Rate ($)" value={rentStr} onChange={setRentStr} id="rvb-r" />
          <RetroInput label="Monthly Mortgage Equivalent ($)" value={mortgageStr} onChange={setMortgageStr} id="rvb-m" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Rent-to-Buy Ratio" value={`${results.ratio.toFixed(1)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
