'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

const DAY = 86400000
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY)
const parseDate = (value: string) => new Date(`${value}T12:00:00`)
const iso = (date: Date) => date.toISOString().slice(0, 10)
const fmt = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

type Method = 'lmp' | 'conception' | 'due' | 'ultrasound' | 'ivf'

export default function PregnancyCalculator() {
  const today = useMemo(() => new Date(), [])
  const [method, setMethod] = useState<Method>('lmp')
  const [date, setDate] = useState(iso(addDays(today, -70)))
  const [cycle, setCycle] = useState('28')
  const [scanWeeks, setScanWeeks] = useState('10')
  const [scanDays, setScanDays] = useState('0')
  const [embryoAge, setEmbryoAge] = useState('5')

  const result = useMemo(() => {
    const source = parseDate(date)
    if (!date || Number.isNaN(source.getTime())) return null
    let lmp: Date
    if (method === 'lmp') lmp = addDays(source, Number(cycle) - 28)
    else if (method === 'conception') lmp = addDays(source, -14)
    else if (method === 'due') lmp = addDays(source, -280)
    else if (method === 'ultrasound') {
      const gestationalDays = Number(scanWeeks) * 7 + Number(scanDays)
      if (gestationalDays < 28 || gestationalDays > 294) return null
      lmp = addDays(source, -gestationalDays)
    } else lmp = addDays(source, -(14 + Number(embryoAge)))

    const due = addDays(lmp, 280)
    const gestDays = Math.floor((today.getTime() - lmp.getTime()) / DAY)
    const progress = Math.min(100, Math.max(0, gestDays / 280 * 100))
    return {
      lmp, due, progress,
      conception: addDays(lmp, 14),
      firstTrimester: addDays(lmp, 13 * 7 + 6),
      secondTrimester: addDays(lmp, 27 * 7 + 6),
      termStart: addDays(lmp, 37 * 7),
      termEnd: addDays(lmp, 42 * 7),
      weeks: Math.max(0, Math.floor(gestDays / 7)),
      days: Math.max(0, gestDays % 7),
    }
  }, [cycle, date, embryoAge, method, scanDays, scanWeeks, today])

  return (
    <FormCalculatorShell title="Pregnancy Calculator" subtitle="Due date, gestational age, and milestone schedule" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
        <div className="space-y-3">
          <RetroSelect label="Calculate Based On" value={method} onChange={(value) => setMethod(value as Method)} id="preg-method" options={[
            { value: 'lmp', label: 'Last menstrual period' }, { value: 'conception', label: 'Conception date' },
            { value: 'due', label: 'Known due date' }, { value: 'ultrasound', label: 'Ultrasound date and gestational age' },
            { value: 'ivf', label: 'IVF embryo transfer' },
          ]} />
          <RetroInput label={method === 'lmp' ? 'First Day of Last Period' : method === 'conception' ? 'Conception Date' : method === 'due' ? 'Known Due Date' : method === 'ultrasound' ? 'Ultrasound Date' : 'Embryo Transfer Date'} value={date} onChange={setDate} type="date" id="preg-date" />
          {method === 'lmp' && <RetroInput label="Average Cycle Length" value={cycle} onChange={setCycle} id="preg-cycle" unit="days" min={21} max={45} />}
          {method === 'ultrasound' && <div className="grid grid-cols-2 gap-3"><RetroInput label="Pregnancy Length" value={scanWeeks} onChange={setScanWeeks} id="preg-scan-w" unit="weeks" min={4} max={42} /><RetroInput label=" " value={scanDays} onChange={setScanDays} id="preg-scan-d" unit="days" min={0} max={6} /></div>}
          {method === 'ivf' && <RetroSelect label="Embryo Age at Transfer" value={embryoAge} onChange={setEmbryoAge} id="preg-embryo" options={[{ value: '3', label: 'Day 3 embryo' }, { value: '5', label: 'Day 5 blastocyst' }, { value: '6', label: 'Day 6 blastocyst' }]} />}
          <p className="rounded-xl border border-neutral-300 bg-white/50 p-3 text-[10px] leading-5 text-neutral-600">An estimated due date is a clinical planning reference, not a prediction of the exact delivery day. Your maternity team may revise dating after an early ultrasound.</p>
        </div>

        <div className="min-h-[440px]">
          {result ? <>
            <div className="grid grid-cols-2 gap-2">
              <ResultDisplay label="Estimated Due Date" value={fmt(result.due)} large />
              <ResultDisplay label="Gestational Age Today" value={`${result.weeks} weeks, ${result.days} days`} large />
              <ResultDisplay label="Estimated Conception" value={fmt(result.conception)} />
              <ResultDisplay label="Full-Term Window" value={`${fmt(result.termStart)} – ${fmt(result.termEnd)}`} />
            </div>
            <div className="mt-4 rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-600">Pregnancy timeline</p>
              <svg viewBox="0 0 500 110" className="mt-2 h-[110px] w-full" role="img" aria-label="Calculated forty-week pregnancy timeline">
                <rect x="12" y="42" width="476" height="18" rx="9" fill="#e5e7eb" />
                <rect x="12" y="42" width={476 * 14 / 40} height="18" rx="9" fill="#9db5a5" />
                <rect x={12 + 476 * 14 / 40} y="42" width={476 * 14 / 40} height="18" fill="#dfc27a" />
                <rect x={12 + 476 * 28 / 40} y="42" width={476 * 12 / 40} height="18" rx="9" fill="#c98c78" />
                <circle cx={12 + 476 * result.progress / 100} cy="51" r="10" fill="#1a1a1f" stroke="white" strokeWidth="3" style={{ transition: 'cx 450ms ease' }} />
                <text x={12 + 476 * result.progress / 100} y="27" textAnchor="middle" fontSize="9" fontWeight="700">Today · {result.weeks}w {result.days}d</text>
                <text x="12" y="83" fontSize="9">Week 0</text><text x="179" y="83" textAnchor="middle" fontSize="9">Trimester 2</text><text x="345" y="83" textAnchor="middle" fontSize="9">Trimester 3</text><text x="488" y="83" textAnchor="end" fontSize="9">Week 40</text>
                <text x="250" y="104" textAnchor="middle" fontSize="9" fill="#5a5a62">Estimated due date: {fmt(result.due)}</text>
              </svg>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]"><div className="rounded-lg bg-white/60 p-2"><b>First trimester ends</b><br />{fmt(result.firstTrimester)}</div><div className="rounded-lg bg-white/60 p-2"><b>Second trimester ends</b><br />{fmt(result.secondTrimester)}</div></div>
          </> : <div className="flex min-h-[440px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500">Enter valid pregnancy dating information.</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
