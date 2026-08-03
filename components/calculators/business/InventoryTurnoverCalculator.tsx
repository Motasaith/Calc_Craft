'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function InventoryTurnoverCalculator() {
  const [cogsStr, setCogsStr] = useState('50000') // cost of goods sold
  const [invStr, setInvStr] = useState('10000') // average inventory

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, turnover: 0, days: 0 }
    const cogs = parseFloat(cogsStr)
    const inv = parseFloat(invStr)

    if (isNaN(cogs) || isNaN(inv) || cogs < 0 || inv <= 0) {
      return { ...defaultObj, error: 'Please enter valid financial parameters.' }
    }

    const turnover = cogs / inv
    const days = 365 / turnover
    return { error: null, turnover, days }
  }, [cogsStr, invStr])

  return (
    <FormCalculatorShell title="Inventory Turnover Solver" subtitle="Calculate turnover speed ratio and days sales of inventory (DSI)" badge="BUSINESS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Cost of Goods Sold (COGS, $)" value={cogsStr} onChange={setCogsStr} id="it-c" />
          <RetroInput label="Average Inventory Value ($)" value={invStr} onChange={setInvStr} id="it-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Turnover Ratio" value={results.turnover.toFixed(2)} />
              <ResultDisplay label="Days Sales of Inventory (DSI)" value={`${results.days.toFixed(1)} days`} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
