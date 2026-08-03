'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'velocity' | 'distance' | 'time'

export default function VelocityCalculator() {
  const [mode, setMode] = useState<Mode>('velocity')
  const [velStr, setVelStr] = useState('20')
  const [distStr, setDistStr] = useState('100')
  const [timeStr, setTimeStr] = useState('5')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      velocity: 0,
      distance: 0,
      time: 0,
      steps: [] as string[]
    }

    const v = parseFloat(velStr)
    const d = parseFloat(distStr)
    const t = parseFloat(timeStr)

    let ansV = v, ansD = d, ansT = t
    let steps: string[] = []

    if (mode === 'velocity') {
      if (isNaN(d) || isNaN(t) || t <= 0) {
        return { ...defaultObj, error: 'Please enter valid distance and positive time values.' }
      }
      ansV = d / t
      steps = [
        `Formula: Velocity (v) = Distance (d) / Time (t)`,
        `v = ${d} m / ${t} s = ${ansV.toFixed(2)} m/s`
      ]
    } else if (mode === 'distance') {
      if (isNaN(v) || isNaN(t) || t <= 0) {
        return { ...defaultObj, error: 'Please enter valid velocity and positive time values.' }
      }
      ansD = v * t
      steps = [
        `Formula: Distance (d) = Velocity (v) × Time (t)`,
        `d = ${v} m/s × ${t} s = ${ansD.toFixed(2)} m`
      ]
    } else {
      if (isNaN(d) || isNaN(v) || v === 0) {
        return { ...defaultObj, error: 'Please enter valid distance and non-zero velocity.' }
      }
      ansT = d / v
      steps = [
        `Formula: Time (t) = Distance (d) / Velocity (v)`,
        `t = ${d} m / ${v} m/s = ${ansT.toFixed(4)} s`
      ]
    }

    return {
      error: null,
      velocity: ansV,
      distance: ansD,
      time: ansT,
      steps
    }
  }, [mode, velStr, distStr, timeStr])

  return (
    <FormCalculatorShell title="Velocity Calculator" subtitle="Solve Velocity = Distance / Time relations" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Solve For"
            value={mode}
            onChange={(val) => setMode(val as Mode)}
            id="vel-mode"
            options={[
              { value: 'velocity', label: 'Velocity (v)' },
              { value: 'distance', label: 'Distance (d)' },
              { value: 'time', label: 'Time (t)' }
            ]}
          />
          {mode !== 'velocity' && <RetroInput label="Velocity (m/s)" value={velStr} onChange={setVelStr} id="vel-v" />}
          {mode !== 'distance' && <RetroInput label="Distance (meters)" value={distStr} onChange={setDistStr} id="vel-d" />}
          {mode !== 'time' && <RetroInput label="Time (seconds)" value={timeStr} onChange={setTimeStr} id="vel-t" />}
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Velocity" value={`${results.velocity.toFixed(2)} m/s`} large={mode === 'velocity'} />
                <ResultDisplay label="Distance" value={`${results.distance.toFixed(2)} m`} large={mode === 'distance'} />
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
