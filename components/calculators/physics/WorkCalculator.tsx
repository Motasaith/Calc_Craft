'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'work' | 'force' | 'distance'

export default function WorkCalculator() {
  const [mode, setMode] = useState<Mode>('work')
  const [workStr, setWorkStr] = useState('100')
  const [forceStr, setForceStr] = useState('20')
  const [distStr, setDistStr] = useState('5')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      work: 0,
      force: 0,
      distance: 0,
      steps: [] as string[]
    }

    const w = parseFloat(workStr)
    const f = parseFloat(forceStr)
    const d = parseFloat(distStr)

    let ansW = w, ansF = f, ansD = d
    let steps: string[] = []

    if (mode === 'work') {
      if (isNaN(f) || isNaN(d) || d < 0) {
        return { ...defaultObj, error: 'Please enter valid force and positive distance values.' }
      }
      ansW = f * d
      steps = [
        `Formula: Work (W) = Force (F) × Distance (d)`,
        `W = ${f} N × ${d} m = ${ansW.toFixed(2)} J`
      ]
    } else if (mode === 'force') {
      if (isNaN(w) || isNaN(d) || d <= 0) {
        return { ...defaultObj, error: 'Please enter valid work and positive distance.' }
      }
      ansF = w / d
      steps = [
        `Formula: Force (F) = Work (W) / Distance (d)`,
        `F = ${w} J / ${d} m = ${ansF.toFixed(4)} N`
      ]
    } else {
      if (isNaN(w) || isNaN(f) || f === 0) {
        return { ...defaultObj, error: 'Please enter valid work and non-zero force.' }
      }
      ansD = w / f
      steps = [
        `Formula: Distance (d) = Work (W) / Force (F)`,
        `d = ${w} J / ${f} N = ${ansD.toFixed(4)} m`
      ]
    }

    return {
      error: null,
      work: ansW,
      force: ansF,
      distance: ansD,
      steps
    }
  }, [mode, workStr, forceStr, distStr])

  return (
    <FormCalculatorShell title="Work Calculator (Physics)" subtitle="Solve Work = Force × Distance parameters" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Solve For"
            value={mode}
            onChange={(val) => setMode(val as Mode)}
            id="work-mode"
            options={[
              { value: 'work', label: 'Work (W)' },
              { value: 'force', label: 'Force (F)' },
              { value: 'distance', label: 'Distance (d)' }
            ]}
          />
          {mode !== 'work' && <RetroInput label="Work (J)" value={workStr} onChange={setWorkStr} id="work-w" />}
          {mode !== 'force' && <RetroInput label="Force (N)" value={forceStr} onChange={setForceStr} id="work-f" />}
          {mode !== 'distance' && <RetroInput label="Distance (m)" value={distStr} onChange={setDistStr} id="work-d" />}
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Work (W)" value={`${results.work.toFixed(2)} J`} large={mode === 'work'} />
                <ResultDisplay label="Force (F)" value={`${results.force.toFixed(2)} N`} large={mode === 'force'} />
                <ResultDisplay label="Distance (d)" value={`${results.distance.toFixed(4)} m`} large={mode === 'distance'} />
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
