'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AnimalFeedCalculator() {
  const [headCountStr, setHeadCountStr] = useState('20')
  const [dailyFeedStr, setDailyFeedStr] = useState('15') // lbs per animal
  const [daysStr, setDaysStr] = useState('30')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, total: 0, steps: [] as string[] }
    const hc = parseInt(headCountStr)
    const df = parseFloat(dailyFeedStr)
    const d = parseInt(daysStr)
    if (isNaN(hc) || isNaN(df) || isNaN(d) || hc <= 0 || df <= 0 || d <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const total = hc * df * d
    return {
      error: null,
      total,
      steps: [
        `Daily Feed per Herd = Headcount × Daily Feed per Animal`,
        `Daily Feed = ${hc} × ${df} = ${hc * df} lbs/day`,
        `Total Feed = Daily Feed × Days = ${hc * df} × ${d} = ${total} lbs`
      ]
    }
  }, [headCountStr, dailyFeedStr, daysStr])

  return (
    <FormCalculatorShell title="Animal Feed Solver" subtitle="Calculate total feed required for livestock herds" badge="AGRICULTURE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Animals count (head)" value={headCountStr} onChange={setHeadCountStr} id="af-hc" />
          <RetroInput label="Daily Feed per Animal (lbs)" value={dailyFeedStr} onChange={setDailyFeedStr} id="af-df" />
          <RetroInput label="Feed Duration (days)" value={daysStr} onChange={setDaysStr} id="af-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Total Feed Needed (lbs)" value={results.total.toLocaleString()} large />
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
