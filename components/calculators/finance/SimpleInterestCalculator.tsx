'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { Landmark, Calendar, TrendingUp, HelpCircle } from 'lucide-react'

type TimeMode = 'duration' | 'dates'
type TimeUnit = 'days' | 'weeks' | 'months' | 'quarters' | 'years'
type Convention = 'ordinary' | 'exact'

export default function SimpleInterestCalculator() {
  // Principal & Rate
  const [principalStr, setPrincipalStr] = useState('10000')
  const [rateStr, setRateStr] = useState('6')

  // Time Inputs
  const [timeMode, setTimeMode] = useState<TimeMode>('duration')
  const [timeValueStr, setTimeValueStr] = useState('3')
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('years')

  // Date Range Inputs
  const [startDateStr, setStartDateStr] = useState(() => new Date().toISOString().split('T')[0])
  const [endDateStr, setEndDateStr] = useState(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 3)
    return d.toISOString().split('T')[0]
  })

  // Calculation Settings
  const [convention, setConvention] = useState<Convention>('exact')

  // Calculations
  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      interest: 0,
      totalAmount: 0,
      totalDays: 0,
      yearsEquivalent: 0,
      schedule: [] as { period: string; accumulatedInterest: number; total: number }[],
      principal: 0
    }

    const principal = parseFloat(principalStr)
    const rate = parseFloat(rateStr)

    if (isNaN(principal) || isNaN(rate) || principal <= 0 || rate < 0) {
      return { ...defaultObj, error: 'Please enter valid positive principal and rate values.' }
    }

    let tInYears = 0
    let totalDays = 0

    if (timeMode === 'duration') {
      const durationVal = parseFloat(timeValueStr)
      if (isNaN(durationVal) || durationVal <= 0) {
        return { ...defaultObj, error: 'Please enter a valid positive duration value.' }
      }

      if (timeUnit === 'years') {
        tInYears = durationVal
        totalDays = durationVal * 365
      } else if (timeUnit === 'quarters') {
        tInYears = durationVal / 4
        totalDays = durationVal * 91.25
      } else if (timeUnit === 'months') {
        tInYears = durationVal / 12
        totalDays = durationVal * 30.42
      } else if (timeUnit === 'weeks') {
        tInYears = durationVal / 52
        totalDays = durationVal * 7
      } else {
        // days
        totalDays = durationVal
        tInYears = durationVal / (convention === 'ordinary' ? 360 : 365)
      }
    } else {
      // dates range
      const start = new Date(startDateStr + 'T00:00:00')
      const end = new Date(endDateStr + 'T00:00:00')

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return { ...defaultObj, error: 'Please select valid start and end dates.' }
      }

      if (end <= start) {
        return { ...defaultObj, error: 'End Date must be after Start Date.' }
      }

      // Ordinary 360-day vs Exact 365-day
      if (convention === 'ordinary') {
        const y1 = start.getFullYear()
        const y2 = end.getFullYear()
        const m1 = start.getMonth() + 1
        const m2 = end.getMonth() + 1
        const d1 = start.getDate()
        const d2 = end.getDate()

        totalDays = (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1)
        tInYears = totalDays / 360
      } else {
        // Exact
        const diffMs = end.getTime() - start.getTime()
        totalDays = Math.round(diffMs / 86400000)
        tInYears = totalDays / 365
      }
    }

    const interest = principal * (rate / 100) * tInYears
    const totalAmount = principal + interest

    // Generate period schedule table (limit to 12 rows for UI neatness)
    const schedule = []
    const steps = Math.min(12, Math.max(2, Math.ceil(tInYears)))
    const stepDuration = tInYears / steps

    for (let i = 1; i <= steps; i++) {
      const currentT = stepDuration * i
      const currentInterest = principal * (rate / 100) * currentT
      schedule.push({
        period: `Year ${((currentT)).toFixed(1)}`,
        accumulatedInterest: currentInterest,
        total: principal + currentInterest
      })
    }

    return {
      error: null,
      interest,
      totalAmount,
      totalDays,
      yearsEquivalent: tInYears,
      schedule,
      principal
    }
  }, [principalStr, rateStr, timeMode, timeValueStr, timeUnit, startDateStr, endDateStr, convention])

  // SVG Chart: simple growth curve
  const chartPoints = useMemo(() => {
    if (results.error || !results.schedule) return ''
    const width = 460
    const height = 120
    const maxVal = results.totalAmount

    // scale coordinates
    const scaleX = (idx: number, len: number) => 20 + (idx / (len - 1)) * width
    const scaleY = (val: number) => 135 - (val / maxVal) * 110

    const pts = results.schedule.map((row, idx) => {
      return `${scaleX(idx, results.schedule.length)},${scaleY(row.total)}`
    })

    // prepend starting principal point
    return `${scaleX(0, results.schedule.length + 1)},${scaleY(results.principal)} ` + pts.join(' ')
  }, [results])

  return (
    <FormCalculatorShell title="Simple Interest Calculator" subtitle="Calculate basic interest accrual with custom calendar conventions" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        
        {/* ── Left Column: Inputs ── */}
        <div className="space-y-4">
          <RetroInput
            label="Principal Deposit ($)"
            value={principalStr}
            onChange={setPrincipalStr}
            placeholder="10,000"
            id="si-principal"
            unit="$"
          />

          <RetroInput
            label="Annual Interest Rate (%)"
            value={rateStr}
            onChange={setRateStr}
            placeholder="6.0"
            id="si-rate"
            unit="%"
          />

          {/* Time Selector Mode Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-200 p-1">
            <button
              onClick={() => setTimeMode('duration')}
              className={`py-1.5 text-xs font-mono font-bold uppercase rounded-lg transition ${
                timeMode === 'duration' ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              By Duration
            </button>
            <button
              onClick={() => setTimeMode('dates')}
              className={`py-1.5 text-xs font-mono font-bold uppercase rounded-lg transition ${
                timeMode === 'dates' ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              By Date Range
            </button>
          </div>

          {/* Duration Mode Inputs */}
          {timeMode === 'duration' && (
            <div className="grid grid-cols-2 gap-3">
              <RetroInput
                label="Time Period"
                value={timeValueStr}
                onChange={setTimeValueStr}
                placeholder="3"
                id="si-time-val"
              />
              <RetroSelect
                label="Period Unit"
                value={timeUnit}
                onChange={(v) => setTimeUnit(v as TimeUnit)}
                id="si-time-unit"
                options={[
                  { value: 'days', label: 'Days' },
                  { value: 'weeks', label: 'Weeks' },
                  { value: 'months', label: 'Months' },
                  { value: 'quarters', label: 'Quarters' },
                  { value: 'years', label: 'Years' }
                ]}
              />
            </div>
          )}

          {/* Dates Mode Inputs */}
          {timeMode === 'dates' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="si-start" className="block text-[10px] font-extrabold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">Start Date</label>
                <input
                  type="date"
                  id="si-start"
                  value={startDateStr}
                  onChange={(e) => setStartDateStr(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-350 rounded-lg text-sm font-mono font-bold focus:outline-none focus:border-neutral-500 shadow-inner"
                />
              </div>
              <div>
                <label htmlFor="si-end" className="block text-[10px] font-extrabold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">End Date</label>
                <input
                  type="date"
                  id="si-end"
                  value={endDateStr}
                  onChange={(e) => setEndDateStr(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-350 rounded-lg text-sm font-mono font-bold focus:outline-none focus:border-neutral-500 shadow-inner"
                />
              </div>
            </div>
          )}

          {/* Calendar Convention */}
          <RetroSelect
            label="Interest Convention"
            value={convention}
            onChange={(v) => setConvention(v as Convention)}
            id="si-conv"
            options={[
              { value: 'exact', label: 'Exact (365 days/year, calendar days)' },
              { value: 'ordinary', label: 'Ordinary (360 days/year, 30 days/month)' }
            ]}
          />
        </div>

        {/* ── Right Column: Results ── */}
        <div className="min-h-[440px]">
          {results && !results.error ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ResultDisplay label="Accrued Interest" value={`$${results.interest.toFixed(2)}`} large />
                <ResultDisplay label="Ending Total Balance" value={`$${results.totalAmount.toFixed(2)}`} large />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Days Elapsed" value={`${Math.round(results.totalDays).toLocaleString()} days`} />
                <ResultDisplay label="Years Equivalent" value={`${results.yearsEquivalent.toFixed(4)} yrs`} />
              </div>

              {/* Line Chart SVG */}
              {results.schedule && results.schedule.length > 0 && (
                <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4">
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                    Balance Growth Curve Over Time
                  </p>
                  <svg viewBox="0 0 500 150" className="w-full h-32" role="img" aria-label="Simple interest line chart representing balance growth over the investment tenure.">
                    {/* Gridlines */}
                    <line x1="20" y1="25" x2="480" y2="25" stroke="#e5e5e5" strokeWidth="1" />
                    <line x1="20" y1="80" x2="480" y2="80" stroke="#e5e5e5" strokeWidth="1" />
                    <line x1="20" y1="135" x2="480" y2="135" stroke="#a3a3a3" strokeWidth="1.5" />
                    
                    {/* Growth Line */}
                    <polyline
                      fill="none"
                      stroke="#4c5c4a"
                      strokeWidth="3.5"
                      points={chartPoints}
                      style={{ transition: 'points 450ms ease' }}
                    />
                    
                    {/* Points */}
                    {results.schedule.map((row, idx) => {
                      const width = 460
                      const maxVal = results.totalAmount
                      const scaleX = (i: number, len: number) => 20 + (i / (len - 1)) * width
                      const scaleY = (val: number) => 135 - (val / maxVal) * 110
                      const cx = scaleX(idx, results.schedule.length)
                      const cy = scaleY(row.total)
                      return (
                        <circle
                          key={idx}
                          cx={cx}
                          cy={cy}
                          r="4.5"
                          fill="#dfaa44"
                          stroke="white"
                          strokeWidth="1.5"
                        />
                      )
                    })}

                    <text x="22" y="20" fontSize="8" fill="#737373" fontFamily="monospace">Max: ${results.totalAmount.toFixed(0)}</text>
                    <text x="22" y="145" fontSize="8" fill="#737373" fontFamily="monospace">Principal: ${results.principal.toFixed(0)}</text>
                  </svg>
                </div>
              )}

              {/* Schedule Table */}
              {results.schedule && results.schedule.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-neutral-300 bg-white/60 max-h-[220px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-neutral-200 border-b border-neutral-300 text-[9px] font-bold uppercase tracking-wider text-neutral-600">
                        <th className="px-3 py-2">Period</th>
                        <th className="px-3 py-2 text-right">Interest Earned</th>
                        <th className="px-3 py-2 text-right">Accumulated Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {results.schedule.map((row, idx) => (
                        <tr key={idx} className="hover:bg-neutral-100">
                          <td className="px-3 py-2.5 font-bold text-neutral-800">{row.period}</td>
                          <td className="px-3 py-2.5 text-right text-neutral-700">${row.accumulatedInterest.toFixed(2)}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-[#4c5c4a]">${row.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results?.error || 'Enter valid values to calculate simple interest accumulation.'}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
