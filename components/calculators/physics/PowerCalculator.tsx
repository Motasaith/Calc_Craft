'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'power' | 'work' | 'time'

export default function PowerCalculator() {
  const [mode, setMode] = useState<Mode>('power')
  const [powerStr, setPowerStr] = useState('100') // Watts
  const [workStr, setWorkStr] = useState('500') // Joules
  const [timeStr, setTimeStr] = useState('5') // Seconds

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      power: 0,
      work: 0,
      time: 0,
      steps: [] as string[]
    }

    const p = parseFloat(powerStr)
    const w = parseFloat(workStr)
    const t = parseFloat(timeStr)

    let ansP = p, ansW = w, ansT = t
    let steps: string[] = []

    if (mode === 'power') {
      if (isNaN(w) || isNaN(t) || t <= 0) {
        return { ...defaultObj, error: 'Please enter valid work and positive time values.' }
      }
      ansP = w / t
      steps = [
        `Formula: Power (P) = Work (W) / Time (t)`,
        `P = ${w} J / ${t} s = ${ansP.toFixed(2)} W`
      ]
    } else if (mode === 'work') {
      if (isNaN(p) || isNaN(t) || p < 0 || t <= 0) {
        return { ...defaultObj, error: 'Please enter valid positive power and time values.' }
      }
      ansW = p * t
      steps = [
        `Formula: Work (W) = Power (P) × Time (t)`,
        `W = ${p} W × ${t} s = ${ansW.toFixed(2)} J`
      ]
    } else {
      if (isNaN(w) || isNaN(p) || p <= 0) {
        return { ...defaultObj, error: 'Please enter valid work and positive power.' }
      }
      ansT = w / p
      steps = [
        `Formula: Time (t) = Work (W) / Power (P)`,
        `t = ${w} J / ${p} W = ${ansT.toFixed(4)} s`
      ]
    }

    return {
      error: null,
      power: ansP,
      work: ansW,
      time: ansT,
      steps
    }
  }, [mode, powerStr, workStr, timeStr])

  return (
    <FormCalculatorShell title="Power Calculator (Physics)" subtitle="Solve Power = Work / Time parameter relations" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Solve For"
            value={mode}
            onChange={(val) => setMode(val as Mode)}
            id="pow-mode"
            options={[
              { value: 'power', label: 'Power (P)' },
              { value: 'work', label: 'Work (W)' },
              { value: 'time', label: 'Time (t)' }
            ]}
          />
          {mode !== 'power' && <RetroInput label="Power (Watts)" value={powerStr} onChange={setPowerStr} id="pow-p" />}
          {mode !== 'work' && <RetroInput label="Work (Joules)" value={workStr} onChange={setWorkStr} id="pow-w" />}
          {mode !== 'time' && <RetroInput label="Time (Seconds)" value={timeStr} onChange={setTimeStr} id="pow-t" />}
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Power" value={`${results.power.toFixed(2)} W`} large={mode === 'power'} />
                <ResultDisplay label="Work" value={`${results.work.toFixed(2)} J`} large={mode === 'work'} />
                <ResultDisplay label="Time" value={`${results.time.toFixed(4)} s`} large={mode === 'time'} />
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
