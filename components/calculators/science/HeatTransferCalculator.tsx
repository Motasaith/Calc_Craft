'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HeatTransferCalculator() {
  const [massStr, setMassStr] = useState('10') // kg
  const [shcStr, setShcStr] = useState('4184') // specific heat J/kg*C (water)
  const [dtStr, setDtStr] = useState('10') // temperature change C

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, heat: 0 }
    const m = parseFloat(massStr)
    const c = parseFloat(shcStr)
    const dt = parseFloat(dtStr)

    if (isNaN(m) || isNaN(c) || isNaN(dt) || m < 0 || c < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const heat = m * c * dt
    return { error: null, heat }
  }, [massStr, shcStr, dtStr])

  return (
    <FormCalculatorShell title="Heat Energy Transfer Solver" subtitle="Calculate thermal heat flow Q = m·c·ΔT" badge="SCIENCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Mass (kg)" value={massStr} onChange={setMassStr} id="ht-m" />
          <RetroInput label="Specific Heat (J/kg·°C)" value={shcStr} onChange={setShcStr} id="ht-c" />
          <RetroInput label="Temp Change (ΔT, °C)" value={dtStr} onChange={setDtStr} id="ht-dt" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Heat Absorbed/Released (Q)" value={`${results.heat.toLocaleString()} Joules`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
