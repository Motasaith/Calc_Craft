'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CarbonFootprintCalculator() {
  const [milesStr, setMilesStr] = useState('10000') // miles driven yearly
  const [electricStr, setElectricStr] = useState('100') // $ monthly electric bill

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, co2: 0, steps: [] as string[] }
    const m = parseFloat(milesStr)
    const e = parseFloat(electricStr)
    if (isNaN(m) || isNaN(e) || m < 0 || e < 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    
    // Simple carbon footprint factor guidelines
    const transportCO2 = m * 0.404 // kg CO2 per mile driven average car
    const electricCO2 = e * 12 * 0.39 // kg CO2 per dollar spent approximate electricity
    const totalCO2Kg = transportCO2 + electricCO2
    const totalTons = totalCO2Kg / 1000

    return {
      error: null,
      co2: totalTons,
      steps: [
        `Transportation CO₂ = ${m} miles × 0.404 kg/mile = ${transportCO2.toFixed(1)} kg`,
        `Electricity CO₂ = $${electricStr} × 12 months × 0.39 kg/$ = ${electricCO2.toFixed(1)} kg`,
        `Total CO₂ Footprint = ${totalTons.toFixed(2)} metric tons per year`
      ]
    }
  }, [milesStr, electricStr])

  return (
    <FormCalculatorShell title="Carbon Footprint Solver" subtitle="Estimate annual greenhouse gas CO₂ emissions in metric tons" badge="ENVIRONMENT">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Annual Car Miles Driven" value={milesStr} onChange={setMilesStr} id="cf-m" />
          <RetroInput label="Monthly Electric Bill ($)" value={electricStr} onChange={setElectricStr} id="cf-e" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Carbon Footprint (Metric Tons CO₂/yr)" value={results.co2.toFixed(2)} large />
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
