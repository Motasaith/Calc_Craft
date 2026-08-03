'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CostPerMileCalculator() {
  const [fixedCostsStr, setFixedCostsStr] = useState('300') // $ monthly
  const [varCostsStr, setVarCostsStr] = useState('200') // $ monthly
  const [milesStr, setMilesStr] = useState('1000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, costPerMile: 0, steps: [] as string[] }
    const f = parseFloat(fixedCostsStr)
    const v = parseFloat(varCostsStr)
    const m = parseFloat(milesStr)
    if (isNaN(f) || isNaN(v) || isNaN(m) || f < 0 || v < 0 || m <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }
    const costPerMile = (f + v) / m
    return {
      error: null,
      costPerMile,
      steps: [
        `Total Costs = Fixed (${f}) + Variable (${v}) = ${f + v} USD`,
        `Cost Per Mile = Total / Miles = ${costPerMile.toFixed(4)} USD/mile`
      ]
    }
  }, [fixedCostsStr, varCostsStr, milesStr])

  return (
    <FormCalculatorShell title="Cost Per Mile Solver" subtitle="Calculate vehicle cost of operation per mile" badge="AUTOMOTIVE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Fixed Monthly Costs ($) - insurance, loan" value={fixedCostsStr} onChange={setFixedCostsStr} id="cpm-f" />
          <RetroInput label="Variable Monthly Costs ($) - fuel, tires" value={varCostsStr} onChange={setVarCostsStr} id="cpm-v" />
          <RetroInput label="Monthly Miles Driven" value={milesStr} onChange={setMilesStr} id="cpm-m" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Cost per Mile" value={`$${results.costPerMile.toFixed(2)}`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
