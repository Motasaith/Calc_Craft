'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'force' | 'mass' | 'acceleration'

export default function NewtonForceCalculator() {
  const [mode, setMode] = useState<Mode>('force')
  const [forceStr, setForceStr] = useState('50')
  const [massStr, setMassStr] = useState('10')
  const [accelStr, setAccelStr] = useState('5')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      force: 0,
      mass: 0,
      acceleration: 0,
      steps: [] as string[]
    }

    const f = parseFloat(forceStr)
    const m = parseFloat(massStr)
    const a = parseFloat(accelStr)

    let ansF = f, ansM = m, ansA = a
    let steps: string[] = []

    if (mode === 'force') {
      if (isNaN(m) || isNaN(a) || m <= 0) {
        return { ...defaultObj, error: 'Please enter a valid positive mass and acceleration.' }
      }
      ansF = m * a
      steps = [
        `Formula: Force (F) = Mass (m) × Acceleration (a)`,
        `F = dots = ${ansF.toFixed(2)} N`
      ]
    } else if (mode === 'mass') {
      if (isNaN(f) || isNaN(a) || a === 0) {
        return { ...defaultObj, error: 'Please enter valid force and non-zero acceleration.' }
      }
      ansM = f / a
      steps = [
        `Formula: Mass (m) = Force (F) / Acceleration (a)`,
        `m = dots = ${ansM.toFixed(4)} kg`
      ]
    } else {
      if (isNaN(f) || isNaN(m) || m <= 0) {
        return { ...defaultObj, error: 'Please enter valid force and positive mass.' }
      }
      ansA = f / m
      steps = [
        `Formula: Acceleration (a) = Force (F) / Mass (m)`,
        `a = dots = ${ansA.toFixed(4)} m/s²`
      ]
    }

    return {
      error: null,
      force: ansF,
      mass: ansM,
      acceleration: ansA,
      steps
    }
  }, [mode, forceStr, massStr, accelStr])

  return (
    <FormCalculatorShell title="Newton's Second Law Force Calculator" subtitle="Solve Force = Mass × Acceleration relations" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Solve For"
            value={mode}
            onChange={(val) => setMode(val as Mode)}
            id="newt-mode"
            options={[
              { value: 'force', label: 'Force (F)' },
              { value: 'mass', label: 'Mass (m)' },
              { value: 'acceleration', label: 'Acceleration (a)' }
            ]}
          />
          {mode !== 'force' && <RetroInput label="Force (N)" value={forceStr} onChange={setForceStr} id="newt-f" />}
          {mode !== 'mass' && <RetroInput label="Mass (kg)" value={massStr} onChange={setMassStr} id="newt-m" />}
          {mode !== 'acceleration' && <RetroInput label="Acceleration (m/s²)" value={accelStr} onChange={setAccelStr} id="newt-a" />}
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Force" value={`${results.force.toFixed(2)} N`} large={mode === 'force'} />
                <ResultDisplay label="Mass" value={`${results.mass.toFixed(2)} kg`} large={mode === 'mass'} />
                <ResultDisplay label="Acceleration" value={`${results.acceleration.toFixed(4)} m/s²`} large={mode === 'acceleration'} />
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
