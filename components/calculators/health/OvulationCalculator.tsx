'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

const DAY = 86400000
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY)
const fmt = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function OvulationCalculator() {
  const [lastPeriod, setLastPeriod] = useState(() => new Date(Date.now() - 10 * DAY).toISOString().slice(0, 10))
  const [cycleLength, setCycleLength] = useState('28')
  const [lutealLength, setLutealLength] = useState('14')

  const result = useMemo(() => {
    const start = new Date(`${lastPeriod}T12:00:00`)
    const cycle = Number(cycleLength)
    const luteal = Number(lutealLength)
    if (!lastPeriod || Number.isNaN(start.getTime()) || cycle < 21 || cycle > 45 || luteal < 10 || luteal > 16) return null
    const ovulationDay = cycle - luteal
    const ovulation = addDays(start, ovulationDay)
    return {
      start, cycle, ovulationDay, ovulation,
      fertileStart: addDays(ovulation, -5),
      fertileEnd: addDays(ovulation, 1),
      implantationStart: addDays(ovulation, 6),
      implantationEnd: addDays(ovulation, 12),
      nextPeriod: addDays(start, cycle),
      dueDate: addDays(ovulation, 266),
    }
  }, [cycleLength, lastPeriod, lutealLength])

  return (
    <FormCalculatorShell title="Ovulation Calculator" subtitle="Fertile-window and cycle timeline estimate" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
        <div className="space-y-3">
          <RetroInput label="First Day of Last Period" value={lastPeriod} onChange={setLastPeriod} type="date" id="ov-lmp" />
          <RetroInput label="Average Cycle Length" value={cycleLength} onChange={setCycleLength} id="ov-cycle" unit="days" min={21} max={45} />
          <details className="rounded-xl border border-neutral-300 bg-white/45 p-3">
            <summary className="cursor-pointer text-xs font-extrabold text-neutral-700">Advanced settings</summary>
            <div className="mt-3"><RetroInput label="Luteal Phase Length" value={lutealLength} onChange={setLutealLength} id="ov-luteal" unit="days" min={10} max={16} /></div>
          </details>
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[10px] leading-5 text-amber-900">Calendar estimates are most useful for regular cycles. Do not use this calculator as contraception.</p>
        </div>

        <div className="min-h-[410px]">
          {result ? <>
            <div className="grid grid-cols-2 gap-2">
              <ResultDisplay label="Estimated Ovulation" value={fmt(result.ovulation)} large />
              <ResultDisplay label="Next Period" value={fmt(result.nextPeriod)} />
              <ResultDisplay label="Fertile Window Begins" value={fmt(result.fertileStart)} />
              <ResultDisplay label="Fertile Window Ends" value={fmt(result.fertileEnd)} />
              <ResultDisplay label="Possible Implantation" value={`${fmt(result.implantationStart)} – ${fmt(result.implantationEnd)}`} />
              <ResultDisplay label="If Conceived, Est. Due Date" value={fmt(result.dueDate)} />
            </div>
            <div className="mt-4 rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-3">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600">Your estimated cycle</p>
              <svg viewBox="0 0 500 92" className="h-[92px] w-full" role="img" aria-label="Calculated menstrual cycle and fertile window">
                <rect x="14" y="30" width="472" height="18" rx="9" fill="#e5e7eb" />
                <rect x="14" y="30" width={472 * Math.min(7, result.cycle) / result.cycle} height="18" rx="9" fill="#b76e79" />
                <rect x={14 + 472 * (result.ovulationDay - 5) / result.cycle} y="30" width={472 * 6 / result.cycle} height="18" rx="9" fill="#78a98b" />
                <circle cx={14 + 472 * result.ovulationDay / result.cycle} cy="39" r="10" fill="#dfaa44" stroke="white" strokeWidth="3" style={{ transition: 'cx 400ms ease' }} />
                <text x="14" y="70" fontSize="9" fill="#5a5a62">Period</text>
                <text x={14 + 472 * result.ovulationDay / result.cycle} y="18" textAnchor="middle" fontSize="9" fontWeight="700">Ovulation · day {result.ovulationDay + 1}</text>
                <text x="486" y="70" textAnchor="end" fontSize="9" fill="#5a5a62">Day {result.cycle}</text>
              </svg>
            </div>
          </> : <div className="flex min-h-[410px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500">Enter a cycle length between 21 and 45 days.</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
