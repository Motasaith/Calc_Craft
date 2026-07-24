'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

const DAY = 86400000
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY)
const fmt = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function PeriodCalculator() {
  const [lastPeriod, setLastPeriod] = useState(() => new Date().toISOString().slice(0, 10))
  const [cycleLength, setCycleLength] = useState('28')
  const [periodLength, setPeriodLength] = useState('5')

  const result = useMemo(() => {
    const start = new Date(`${lastPeriod}T12:00:00`)
    const cycle = Number(cycleLength), period = Number(periodLength)
    if (!lastPeriod || Number.isNaN(start.getTime()) || cycle < 21 || cycle > 45 || period < 2 || period > 10) return null
    const cycles = [1, 2, 3].map((n) => {
      const periodStart = addDays(start, cycle * n)
      const ovulation = addDays(periodStart, cycle - 14)
      return { periodStart, periodEnd: addDays(periodStart, period - 1), fertileStart: addDays(ovulation, -5), fertileEnd: addDays(ovulation, 1), ovulation }
    })
    return { start, cycle, period, cycles }
  }, [cycleLength, lastPeriod, periodLength])

  return (
    <FormCalculatorShell title="Period Calculator" subtitle="Three-cycle period and ovulation forecast" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
        <div className="space-y-3">
          <RetroInput label="First Day of Last Period" value={lastPeriod} onChange={setLastPeriod} type="date" id="per-lmp" />
          <div className="grid grid-cols-2 gap-3">
            <RetroInput label="Average Cycle" value={cycleLength} onChange={setCycleLength} id="per-cycle" unit="days" min={21} max={45} />
            <RetroInput label="Bleeding Length" value={periodLength} onChange={setPeriodLength} id="per-len" unit="days" min={2} max={10} />
          </div>
          <p className="rounded-xl border border-neutral-300 bg-white/50 p-3 text-[10px] leading-5 text-neutral-600">Predictions assume a consistent cycle. Record several cycle start dates and use their average for a more representative estimate.</p>
        </div>
        <div className="min-h-[420px]">
          {result ? <>
            <div className="grid grid-cols-2 gap-2">
              <ResultDisplay label="Next Period Starts" value={fmt(result.cycles[0].periodStart)} large />
              <ResultDisplay label="Expected to End" value={fmt(result.cycles[0].periodEnd)} />
              <ResultDisplay label="Estimated Ovulation" value={fmt(result.cycles[0].ovulation)} />
              <ResultDisplay label="Fertile Window" value={`${fmt(result.cycles[0].fertileStart)} – ${fmt(result.cycles[0].fertileEnd)}`} />
            </div>
            <div className="mt-4 space-y-3 rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-600">Next three cycles</p>
              {result.cycles.map((cycle, index) => (
                <div key={cycle.periodStart.toISOString()}>
                  <div className="mb-1 flex justify-between text-[9px] font-bold text-neutral-600"><span>Cycle {index + 1}</span><span>{fmt(cycle.periodStart)}</span></div>
                  <svg viewBox="0 0 500 26" className="h-7 w-full" role="img" aria-label={`Forecast cycle ${index + 1}`}>
                    <rect x="2" y="7" width="496" height="12" rx="6" fill="#e5e7eb" />
                    <rect x="2" y="7" width={496 * result.period / result.cycle} height="12" rx="6" fill="#b76e79" />
                    <rect x={2 + 496 * (result.cycle - 19) / result.cycle} y="7" width={496 * 6 / result.cycle} height="12" rx="6" fill="#78a98b" />
                    <circle cx={2 + 496 * (result.cycle - 14) / result.cycle} cy="13" r="6" fill="#dfaa44" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
              ))}
              <div className="flex gap-4 text-[8px] text-neutral-600"><span>● Period</span><span className="text-[#56866a]">● Fertile window</span><span className="text-[#b88620]">● Ovulation</span></div>
            </div>
          </> : <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500">Use a 21–45 day cycle and 2–10 day period.</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
