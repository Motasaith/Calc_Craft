'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SleepCalculator() {
  const [wakeStr, setWakeStr] = useState('07:00')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, cycles: [] as string[] }
    if (!wakeStr) return { ...defaultObj, error: 'Please enter a wakeup time.' }
    const [wh, wm] = wakeStr.split(':').map(Number)
    if (isNaN(wh) || isNaN(wm)) return { ...defaultObj, error: 'Invalid time format.' }
    
    // Calculate backwards 90 minute REM cycles (6 cycles)
    let cycles: string[] = []
    const baseMinutes = wh * 60 + wm
    for (let i = 6; i >= 3; i--) {
      const cycleMins = (baseMinutes - i * 90 + 24 * 60) % (24 * 60)
      const h = Math.floor(cycleMins / 60)
      const m = Math.round(cycleMins % 60)
      const ampm = h >= 12 ? 'PM' : 'AM'
      const displayH = h % 12 || 12
      cycles.push(`${displayH}:${m < 10 ? '0' : ''}${m} ${ampm}`)
    }
    return { error: null, cycles }
  }, [wakeStr])

  return (
    <FormCalculatorShell title="Sleep Cycles REM Solver" subtitle="Estimate ideal bedtime slots using 90-minute REM cycles" badge="DATE-TIME">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Desired Wakeup Time (HH:MM)" value={wakeStr} onChange={setWakeStr} id="slc-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="space-y-2">
              <p className="text-xs font-bold text-neutral-600 font-mono">Suggested Bedtimes</p>
              <div className="grid grid-cols-2 gap-2">
                {results.cycles.map((t, idx) => (
                  <ResultDisplay key={idx} label={`Cycle ${idx + 3}`} value={t} />
                ))}
              </div>
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
