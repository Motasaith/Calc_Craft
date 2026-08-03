'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'moles-to-particles' | 'particles-to-moles'

export default function AvogadrosNumberCalculator() {
  const [mode, setMode] = useState<Mode>('moles-to-particles')
  const [valStr, setValStr] = useState('2')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      moles: 0,
      particles: '',
      steps: [] as string[]
    }

    const v = parseFloat(valStr)
    if (isNaN(v) || v < 0) {
      return { ...defaultObj, error: 'Please enter a valid positive value.' }
    }

    const AVOGADRO = 6.02214076e23
    let moles = 0
    let particles = ''
    let steps: string[] = []

    if (mode === 'moles-to-particles') {
      moles = v
      const particleCount = v * AVOGADRO
      particles = particleCount.toExponential(4)
      steps = [
        `Formula: Particles = Moles × 6.02214e23`,
        `${v} mol × 6.02214e23 = ${particles}`
      ]
    } else {
      moles = v / AVOGADRO
      particles = v.toExponential(4)
      steps = [
        `Formula: Moles = Particles / 6.02214e23`,
        `${v} / 6.02214e23 = ${moles.toExponential(6)} mol`
      ]
    }

    return {
      error: null,
      moles,
      particles,
      steps
    }
  }, [mode, valStr])

  return (
    <FormCalculatorShell title="Avogadro's Number Converter" subtitle="Convert between moles and total molecules/atoms" badge="CHEMISTRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Conversion Mode"
            value={mode}
            onChange={(v) => setMode(v as Mode)}
            id="avog-mode"
            options={[
              { value: 'moles-to-particles', label: 'Moles → Molecules/Atoms' },
              { value: 'particles-to-moles', label: 'Molecules/Atoms → Moles' }
            ]}
          />
          <RetroInput label="Input Quantity" value={valStr} onChange={setValStr} id="avog-v" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Moles" value={results.moles.toExponential(4)} large />
                <ResultDisplay label="Total Particles" value={results.particles} large />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Avogadro Conversion Steps</p>
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
