'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DSCRCalculator() {
  const [noiStr, setNoiStr] = useState('36000') // net operating income
  const [debtStr, setDebtStr] = useState('24000') // annual debt service

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, dscr: 0 }
    const noi = parseFloat(noiStr)
    const debt = parseFloat(debtStr)

    if (isNaN(noi) || isNaN(debt) || noi < 0 || debt <= 0) {
      return { ...defaultObj, error: 'Please enter valid operating and debt values.' }
    }

    const dscr = noi / debt
    return { error: null, dscr }
  }, [noiStr, debtStr])

  return (
    <FormCalculatorShell title="Debt Service Coverage DSCR Solver" subtitle="Calculate DSCR index ratios for commercial property loans" badge="REAL ESTATE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Net Operating Income (NOI, $)" value={noiStr} onChange={setNoiStr} id="dscr-noi" />
          <RetroInput label="Annual Debt Service Obligations ($)" value={debtStr} onChange={setDebtStr} id="dscr-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="DSCR Ratio Index" value={results.dscr.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
