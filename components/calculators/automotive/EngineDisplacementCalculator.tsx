'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function EngineDisplacementCalculator() {
  const [boreStr, setBoreStr] = useState('85') // mm
  const [strokeStr, setStrokeStr] = useState('88') // mm
  const [cylindersStr, setCylindersStr] = useState('4')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, cc: 0, liters: 0, steps: [] as string[] }
    const bore = parseFloat(boreStr)
    const stroke = parseFloat(strokeStr)
    const cyl = parseInt(cylindersStr)
    if (isNaN(bore) || isNaN(stroke) || isNaN(cyl) || bore <= 0 || stroke <= 0 || cyl <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }
    // Area of cylinder = pi * (bore/2)^2
    // Displacement = Area * stroke * cylinders
    // Convert mm to cm for cc: mm/10 = cm
    const rCm = bore / 20
    const sCm = stroke / 10
    const cc = Math.PI * rCm * rCm * sCm * cyl
    const liters = cc / 1000
    return {
      error: null,
      cc, liters,
      steps: [
        `Bore radius = ${rCm.toFixed(3)} cm | Stroke = ${sCm.toFixed(3)} cm`,
        `Displacement = π × r² × stroke × cylinders`,
        `CC displacement = ${cc.toFixed(1)} cc (${liters.toFixed(2)} Liters)`
      ]
    }
  }, [boreStr, strokeStr, cylindersStr])

  return (
    <FormCalculatorShell title="Engine Displacement Solver" subtitle="Calculate engine cubic capacity displacement from cylinder metrics" badge="AUTOMOTIVE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Cylinder Bore diameter (mm)" value={boreStr} onChange={setBoreStr} id="ed-b" />
          <RetroInput label="Piston Stroke length (mm)" value={strokeStr} onChange={setStrokeStr} id="ed-s" />
          <RetroInput label="Cylinders count" value={cylindersStr} onChange={setCylindersStr} id="ed-c" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Cubic Capacity (cc)" value={results.cc.toFixed(1)} large />
              <ResultDisplay label="Engine Volume (Liters)" value={results.liters.toFixed(2)} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
