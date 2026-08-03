'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'momentum' | 'mass' | 'velocity'

export default function MomentumCalculator() {
  const [mode, setMode] = useState<Mode>('momentum')
  const [momStr, setMomStr] = useState('50')
  const [massStr, setMassStr] = useState('10')
  const [velStr, setVelStr] = useState('5')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      momentum: 0,
      mass: 0,
      velocity: 0,
      steps: [] as string[]
    }

    const p = parseFloat(momStr)
    const m = parseFloat(massStr)
    const v = parseFloat(velStr)

    let ansP = p, ansM = m, ansV = v
    let steps: string[] = []

    if (mode === 'momentum') {
      if (isNaN(m) || isNaN(v) || m <= 0) {
        return { ...defaultObj, error: 'Please enter valid positive mass and velocity values.' }
      }
      ansP = m * v
      steps = [
        `Formula: Momentum (p) = Mass (m) × Velocity (v)`,
        `p = dots = dots kg·m/s`
      ]
    } else if (mode === 'mass') {
      if (isNaN(p) || isNaN(v) || v === 0) {
        return { ...defaultObj, error: 'Please enter valid momentum and non-zero velocity.' }
      }
      ansM = p / v
      steps = [
        `Formula: Mass (m) = Momentum (p) / Velocity (v)`,
        `m = dots = dots kg`
      ]
    } else {
      if (isNaN(p) || isNaN(m) || m <= 0) {
        return { ...defaultObj, error: 'Please enter valid momentum and positive mass.' }
      }
      ansV = p / m
      steps = [
        `Formula: Velocity (v) = Momentum (p) / Mass (m)`,
        `v = dots = dots m/s`
      ]
    }

    return {
      error: null,
      momentum: ansP,
      mass: ansM,
      velocity: ansV,
      steps
    }
  }, [mode, momStr, massStr, velStr])

  return (
    <FormCalculatorShell title="Momentum Calculator" subtitle="Solve linear momentum p = m × v parameter relations" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Solve For"
            value={mode}
            onChange={(val) => setMode(val as Mode)}
            id="mom-mode"
            options={[
              { value: 'momentum', label: 'Momentum (p)' },
              { value: 'mass', label: 'Mass (m)' },
              { value: 'velocity', label: 'Velocity (v)' }
            ]}
          />
          {mode !== 'momentum' && <RetroInput label="Momentum (kg·m/s)" value={momStr} onChange={setMomStr} id="mom-p" />}
          {mode !== 'mass' && <RetroInput label="Mass (kg)" value={massStr} onChange={setMassStr} id="mom-m" />}
          {mode !== 'velocity' && <RetroInput label="Velocity (m/s)" value={velStr} onChange={setVelStr} id="mom-v" />}
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Momentum (p)" value={`sm${results.momentum.toFixed(2)} kg·m/s`} large={mode === 'momentum'} />
                <ResultDisplay label="Mass (m)" value={`sm${results.mass.toFixed(2)} kg`} large={mode === 'mass'} />
                <ResultDisplay label="Velocity (v)" value={`sm${results.velocity.toFixed(4)} m/s`} large={mode === 'velocity'} />
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
