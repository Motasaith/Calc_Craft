'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'm2' | 'v2' | 'm1' | 'v1'

export default function DilutionCalculator() {
  const [mode, setMode] = useState<Mode>('m2')
  const [m1Str, setM1Str] = useState('12') // initial conc (e.g. 12M stock)
  const [v1Str, setV1Str] = useState('0.1') // initial vol (e.g. 100mL)
  const [m2Str, setM2Str] = useState('1') // target conc (e.g. 1M)
  const [v2Str, setV2Str] = useState('1.2') // target vol (e.g. 1.2L)

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      m1: 0, v1: 0, m2: 0, v2: 0,
      steps: [] as string[]
    }

    const m1 = parseFloat(m1Str)
    const v1 = parseFloat(v1Str)
    const m2 = parseFloat(m2Str)
    const v2 = parseFloat(v2Str)

    let steps: string[] = []
    let ansM1 = m1, ansV1 = v1, ansM2 = m2, ansV2 = v2

    if (mode === 'm2') {
      if (isNaN(m1) || isNaN(v1) || isNaN(v2) || m1 <= 0 || v1 <= 0 || v2 <= 0) {
        return { ...defaultObj, error: 'Please enter valid stock concentration and volumes.' }
      }
      ansM2 = (m1 * v1) / v2
      steps = [
        `Dilution Formula: M₁V₁ = M₂V₂`,
        `M₂ = (M₁ × V₁) / V₂ = (${m1} × ${v1}) / ${v2} = ${ansM2.toFixed(4)} M`
      ]
    } else if (mode === 'v2') {
      if (isNaN(m1) || isNaN(v1) || isNaN(m2) || m1 <= 0 || v1 <= 0 || m2 <= 0) {
        return { ...defaultObj, error: 'Please enter valid concentrations and stock volume.' }
      }
      ansV2 = (m1 * v1) / m2
      steps = [
        `Dilution Formula: M₁V₁ = M₂V₂`,
        `V₂ = (M₁ × V₁) / M₂ = (${m1} × ${v1}) / ${m2} = ${ansV2.toFixed(4)} L`
      ]
    } else if (mode === 'm1') {
      if (isNaN(m2) || isNaN(v2) || isNaN(v1) || m2 <= 0 || v2 <= 0 || v1 <= 0) {
        return { ...defaultObj, error: 'Please enter valid target values and stock volume.' }
      }
      ansM1 = (m2 * v2) / v1
      steps = [
        `Dilution Formula: M₁V₁ = M₂V₂`,
        `M₁ = (M₂ × V₂) / V₁ = (${m2} × ${v2}) / ${v1} = ${ansM1.toFixed(4)} M`
      ]
    } else {
      if (isNaN(m2) || isNaN(v2) || isNaN(m1) || m2 <= 0 || v2 <= 0 || m1 <= 0) {
        return { ...defaultObj, error: 'Please enter valid stock concentration and target values.' }
      }
      ansV1 = (m2 * v2) / m1
      steps = [
        `Dilution Formula: M₁V₁ = M₂V₂`,
        `V₁ = (M₂ × V₂) / M₁ = (${m2} × ${v2}) / ${m1} = ${ansV1.toFixed(4)} L`
      ]
    }

    return {
      error: null,
      m1: ansM1,
      v1: ansV1,
      m2: ansM2,
      v2: ansV2,
      steps
    }
  }, [mode, m1Str, v1Str, m2Str, v2Str])

  return (
    <FormCalculatorShell title="Solution Dilution Calculator" subtitle="Solve M₁V₁ = M₂V₂ for concentrations and volumes" badge="CHEMISTRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Solve For"
            value={mode}
            onChange={(v) => setMode(v as Mode)}
            id="dil-mode"
            options={[
              { value: 'm2', label: 'Final Conc. (M₂)' },
              { value: 'v2', label: 'Final Vol. (V₂)' },
              { value: 'm1', label: 'Initial Conc. (M₁)' },
              { value: 'v1', label: 'Initial Vol. (V₁)' }
            ]}
          />
          {mode !== 'm1' && <RetroInput label="Stock Conc. (M₁)" value={m1Str} onChange={setM1Str} id="dil-m1" />}
          {mode !== 'v1' && <RetroInput label="Stock Vol. (V₁)" value={v1Str} onChange={setV1Str} id="dil-v1" />}
          {mode !== 'm2' && <RetroInput label="Diluted Conc. (M₂)" value={m2Str} onChange={setM2Str} id="dil-m2" />}
          {mode !== 'v2' && <RetroInput label="Diluted Vol. (V₂)" value={v2Str} onChange={setV2Str} id="dil-v2" />}
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <ResultDisplay label="Stock M₁" value={results.m1.toFixed(3)} large={mode === 'm1'} />
                <ResultDisplay label="Stock V₁" value={results.v1.toFixed(3)} large={mode === 'v1'} />
                <ResultDisplay label="Final M₂" value={results.m2.toFixed(3)} large={mode === 'm2'} />
                <ResultDisplay label="Final V₂" value={results.v2.toFixed(3)} large={mode === 'v2'} />
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
