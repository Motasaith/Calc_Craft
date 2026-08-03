'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'moles' | 'mass' | 'molarMass'

export default function MolesCalculator() {
  const [mode, setMode] = useState<Mode>('moles')
  const [massStr, setMassStr] = useState('10')
  const [molarMassStr, setMolarMassStr] = useState('58.44') // default NaCl molar mass
  const [molesStr, setMolesStr] = useState('0.171')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      moles: 0,
      mass: 0,
      molarMass: 0,
      steps: [] as string[]
    }

    const mass = parseFloat(massStr)
    const molarMass = parseFloat(molarMassStr)
    const moles = parseFloat(molesStr)

    let steps: string[] = []
    let ansMoles = 0, ansMass = 0, ansMolarMass = 0

    if (mode === 'moles') {
      if (isNaN(mass) || isNaN(molarMass) || mass <= 0 || molarMass <= 0) {
        return { ...defaultObj, error: 'Please enter valid mass and molar mass.' }
      }
      ansMoles = mass / molarMass
      ansMass = mass
      ansMolarMass = molarMass
      steps = [
        `Formula: Moles (n) = Mass (m) / Molar Mass (M)`,
        `n = ${mass} g / ${molarMass} g/mol = ${ansMoles.toFixed(4)} mol`
      ]
    } else if (mode === 'mass') {
      if (isNaN(moles) || isNaN(molarMass) || moles <= 0 || molarMass <= 0) {
        return { ...defaultObj, error: 'Please enter valid moles and molar mass.' }
      }
      ansMass = moles * molarMass
      ansMoles = moles
      ansMolarMass = molarMass
      steps = [
        `Formula: Mass (m) = Moles (n) × Molar Mass (M)`,
        `m = ${moles} mol × ${molarMass} g/mol = ${ansMass.toFixed(4)} g`
      ]
    } else {
      if (isNaN(mass) || isNaN(moles) || mass <= 0 || moles <= 0) {
        return { ...defaultObj, error: 'Please enter valid mass and moles.' }
      }
      ansMolarMass = mass / moles
      ansMass = mass
      ansMoles = moles
      steps = [
        `Formula: Molar Mass (M) = Mass (m) / Moles (n)`,
        `M = ${mass} g / ${moles} mol = ${ansMolarMass.toFixed(4)} g/mol`
      ]
    }

    return {
      error: null,
      moles: ansMoles,
      mass: ansMass,
      molarMass: ansMolarMass,
      steps
    }
  }, [mode, massStr, molarMassStr, molesStr])

  return (
    <FormCalculatorShell title="Moles Calculator" subtitle="Solve mass, molar mass, and mole relations" badge="CHEMISTRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Solve For"
            value={mode}
            onChange={(v) => setMode(v as Mode)}
            id="mole-mode"
            options={[
              { value: 'moles', label: 'Moles (n)' },
              { value: 'mass', label: 'Mass (m)' },
              { value: 'molarMass', label: 'Molar Mass (M)' }
            ]}
          />
          {mode !== 'mass' && <RetroInput label="Mass (g)" value={massStr} onChange={setMassStr} id="mole-mass" />}
          {mode !== 'molarMass' && <RetroInput label="Molar Mass (g/mol)" value={molarMassStr} onChange={setMolarMassStr} id="mole-mm" />}
          {mode !== 'moles' && <RetroInput label="Moles (mol)" value={molesStr} onChange={setMolesStr} id="mole-mol" />}
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Moles" value={`${results.moles.toFixed(4)} mol`} large={mode === 'moles'} />
                <ResultDisplay label="Mass" value={`${results.mass.toFixed(4)} g`} large={mode === 'mass'} />
                <ResultDisplay label="Molar Mass" value={`${results.molarMass.toFixed(4)} g/mol`} large={mode === 'molarMass'} />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Chemical Steps</p>
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
