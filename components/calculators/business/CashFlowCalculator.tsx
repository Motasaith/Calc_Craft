'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CashFlowCalculator() {
  const [opsStr, setOpsStr] = useState('20000') // operating cash flow
  const [invStr, setInvStr] = useState('-5000') // investing
  const [finStr, setFinStr] = useState('-3000') // financing

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, netCash: 0 }
    const ops = parseFloat(opsStr)
    const inv = parseFloat(invStr)
    const fin = parseFloat(finStr)

    if (isNaN(ops) || isNaN(inv) || isNaN(fin)) {
      return { ...defaultObj, error: 'Please enter valid flows.' }
    }

    const netCash = ops + inv + fin
    return { error: null, netCash }
  }, [opsStr, invStr, finStr])

  return (
    <FormCalculatorShell title="Net Cash Flow Solver" subtitle="Calculate net cash changes from business activity divisions" badge="BUSINESS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Operating Activities ($)" value={opsStr} onChange={setOpsStr} id="cf-o" />
          <RetroInput label="Investing Activities ($)" value={invStr} onChange={setInvStr} id="cf-i" />
          <RetroInput label="Financing Activities ($)" value={finStr} onChange={setFinStr} id="cf-f" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Net Cash Flow" value={results.netCash.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
