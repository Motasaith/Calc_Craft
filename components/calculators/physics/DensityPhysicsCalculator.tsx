'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'density' | 'mass' | 'volume'

export default function DensityPhysicsCalculator() {
  const [mode, setMode] = useState<Mode>('density')
  const [densityStr, setDensityStr] = useState('1000') // kg/m³
  const [massStr, setMassStr] = useState('5000') // kg
  const [volumeStr, setVolumeStr] = useState('5') // m³

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      density: 0,
      mass: 0,
      volume: 0,
      steps: [] as string[]
    }

    const d = parseFloat(densityStr)
    const m = parseFloat(massStr)
    const v = parseFloat(volumeStr)

    let ansD = d, ansM = m, ansV = v
    let steps: string[] = []

    if (mode === 'density') {
      if (isNaN(m) || isNaN(v) || m <= 0 || v <= 0) {
        return { ...defaultObj, error: 'Please enter valid positive mass and volume values.' }
      }
      ansD = m / v
      steps = [
        `Formula: Density (ρ) = Mass (m) / Volume (V)`,
        `ρ = ${m} kg / ${v} m³ = ${ansD.toFixed(2)} kg/m³`
      ]
    } else if (mode === 'mass') {
      if (isNaN(d) || isNaN(v) || d <= 0 || v <= 0) {
        return { ...defaultObj, error: 'Please enter valid positive density and volume values.' }
      }
      ansM = d * v
      steps = [
        `Formula: Mass (m) = Density (ρ) × Volume (V)`,
        `m = ${d} kg/m³ × ${v} m³ = ${ansM.toFixed(2)} kg`
      ]
    } else {
      if (isNaN(m) || isNaN(d) || m <= 0 || d <= 0) {
        return { ...defaultObj, error: 'Please enter valid positive mass and density values.' }
      }
      ansV = m / d
      steps = [
        `Formula: Volume (V) = Mass (m) / Density (ρ)`,
        `V = ${m} kg / ${d} kg/m³ = ${ansV.toFixed(4)} m³`
      ]
    }

    return {
      error: null,
      density: ansD,
      mass: ansM,
      volume: ansV,
      steps
    }
  }, [mode, densityStr, massStr, volumeStr])

  return (
    <FormCalculatorShell title="Density Calculator (Physics)" subtitle="Solve mass, volume, and density relations" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Solve For"
            value={mode}
            onChange={(val) => setMode(val as Mode)}
            id="dens-mode"
            options={[
              { value: 'density', label: 'Density (ρ)' },
              { value: 'mass', label: 'Mass (m)' },
              { value: 'volume', label: 'Volume (V)' }
            ]}
          />
          {mode !== 'density' && <RetroInput label="Density (kg/m³)" value={densityStr} onChange={setDensityStr} id="dens-d" />}
          {mode !== 'mass' && <RetroInput label="Mass (kg)" value={massStr} onChange={setMassStr} id="dens-m" />}
          {mode !== 'volume' && <RetroInput label="Volume (m³)" value={volumeStr} onChange={setVolumeStr} id="dens-v" />}
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Density (ρ)" value={`${results.density.toFixed(2)} kg/m³`} large={mode === 'density'} />
                <ResultDisplay label="Mass (m)" value={`${results.mass.toFixed(2)} kg`} large={mode === 'mass'} />
                <ResultDisplay label="Volume (V)" value={`${results.volume.toFixed(4)} m³`} large={mode === 'volume'} />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Formula Steps</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results.error}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
