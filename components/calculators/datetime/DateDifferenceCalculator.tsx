'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { Calendar, AlertCircle, ArrowRightLeft, ArrowRight } from 'lucide-react'

type Mode = 'diff' | 'add-sub'

export default function DateDifferenceCalculator() {
  const [mode, setMode] = useState<Mode>('diff')

  // Mode 1: Date Difference States
  const [startDateStr, setStartDateStr] = useState(() => new Date().toISOString().split('T')[0])
  const [endDateStr, setEndDateStr] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30) // Default 30 days ahead
    return d.toISOString().split('T')[0]
  })
  const [includeEndDate, setIncludeEndDate] = useState(false)
  const [businessDaysOnly, setBusinessDaysOnly] = useState(false)

  // Mode 2: Add/Subtract States
  const [baseDateStr, setBaseDateStr] = useState(() => new Date().toISOString().split('T')[0])
  const [op, setOp] = useState<'add' | 'subtract'>('add')
  const [daysInput, setDaysInput] = useState('30')
  const [weeksInput, setWeeksInput] = useState('0')
  const [monthsInput, setMonthsInput] = useState('0')
  const [yearsInput, setYearsInput] = useState('0')

  // Date Difference calculations
  const diffResults = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      isSwapped: false,
      totalDays: 0,
      businessDays: 0,
      weekendDays: 0,
      years: 0,
      months: 0,
      days: 0,
      weeksStr: '',
      hours: 0,
      minutes: 0
    }
    if (mode !== 'diff') return defaultObj

    const start = new Date(startDateStr + 'T00:00:00')
    const end = new Date(endDateStr + 'T00:00:00')

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { ...defaultObj, error: 'Please enter valid start and end dates.' }
    }

    const isSwapped = end < start
    const d1 = isSwapped ? end : start
    const d2 = isSwapped ? start : end

    let totalMs = d2.getTime() - d1.getTime()
    let totalDays = Math.round(totalMs / 86400000)

    if (includeEndDate) {
      totalDays += 1
      totalMs += 86400000
    }

    // Calculate business days (weekdays)
    let businessDays = 0
    let weekendDays = 0
    const current = new Date(d1)
    const limit = includeEndDate ? new Date(d2.getTime() + 86400000) : new Date(d2)

    while (current < limit) {
      const day = current.getDay()
      if (day === 0 || day === 6) {
        weekendDays++
      } else {
        businessDays++
      }
      current.setDate(current.getDate() + 1)
    }

    // Breakdown into Years, Months, Days (Gregorian boundary matching)
    let years = d2.getFullYear() - d1.getFullYear()
    let months = d2.getMonth() - d1.getMonth()
    let days = d2.getDate() - d1.getDate()

    if (includeEndDate) {
      days += 1
    }

    if (days < 0) {
      months -= 1
      // Find days in previous month
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0)
      days += prevMonth.getDate()
    }
    if (months < 0) {
      years -= 1
      months += 12
    }

    const weeks = Math.floor(totalDays / 7)
    const remDays = totalDays % 7

    const finalWeeksStr = `${weeks} week${weeks !== 1 ? 's' : ''}${remDays > 0 ? ` and ${remDays} day${remDays !== 1 ? 's' : ''}` : ''}`

    return {
      error: null,
      isSwapped,
      totalDays,
      businessDays,
      weekendDays,
      years,
      months,
      days,
      weeksStr: finalWeeksStr,
      hours: totalDays * 24,
      minutes: totalDays * 24 * 60
    }
  }, [startDateStr, endDateStr, includeEndDate, mode])

  // Add/Subtract calculations
  const addSubResults = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      formattedDate: '',
      rawDate: ''
    }
    if (mode !== 'add-sub') return defaultObj

    const base = new Date(baseDateStr + 'T00:00:00')
    if (isNaN(base.getTime())) {
      return { ...defaultObj, error: 'Please enter a valid base date.' }
    }

    const days = parseInt(daysInput) || 0
    const weeks = parseInt(weeksInput) || 0
    const months = parseInt(monthsInput) || 0
    const years = parseInt(yearsInput) || 0

    const factor = op === 'add' ? 1 : -1
    const target = new Date(base)

    target.setFullYear(target.getFullYear() + (years * factor))
    target.setMonth(target.getMonth() + (months * factor))
    target.setDate(target.getDate() + ((weeks * 7 + days) * factor))

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }

    return {
      error: null,
      formattedDate: target.toLocaleDateString('en-US', options),
      rawDate: target.toISOString().split('T')[0]
    }
  }, [baseDateStr, op, daysInput, weeksInput, monthsInput, yearsInput, mode])

  // SVG representation: relative gauge of days or calendar grid representation
  const calendarGrid = useMemo(() => {
    if (mode !== 'diff' || diffResults.error) return []
    // Generate a simple grid representing up to 35 squares (5 weeks) showing the range span
    const cells = []
    
    let daysToDraw = Math.min(35, diffResults.totalDays || 1)
    
    for (let i = 0; i < 35; i++) {
      let isHighlight = i < daysToDraw
      cells.push({
        id: i,
        isHighlight,
        isWeekend: (i % 7 === 5 || i % 7 === 6) // Assumes starting Saturday/Sunday
      })
    }
    return cells
  }, [diffResults, mode])

  return (
    <FormCalculatorShell title="Date Difference Calculator" subtitle="Find the span between two dates or add/subtract time" badge="DATE & TIME">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        
        {/* ── Left Column: Inputs ── */}
        <div className="space-y-4">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-200 p-1">
            <button
              onClick={() => setMode('diff')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-mono font-bold uppercase transition ${
                mode === 'diff' ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Date Range
            </button>
            <button
              onClick={() => setMode('add-sub')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-mono font-bold uppercase transition ${
                mode === 'add-sub' ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" /> Add / Subtract
            </button>
          </div>

          {/* Mode 1 Inputs: Date Difference */}
          {mode === 'diff' && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label htmlFor="dd-start" className="block text-[10px] font-extrabold text-neutral-600 font-mono uppercase tracking-wider">Start Date</label>
                <input
                  type="date"
                  id="dd-start"
                  value={startDateStr}
                  onChange={(e) => setStartDateStr(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-350 rounded-lg text-sm font-mono font-bold focus:outline-none focus:border-neutral-500 shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="dd-end" className="block text-[10px] font-extrabold text-neutral-600 font-mono uppercase tracking-wider">End Date</label>
                <input
                  type="date"
                  id="dd-end"
                  value={endDateStr}
                  onChange={(e) => setEndDateStr(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-350 rounded-lg text-sm font-mono font-bold focus:outline-none focus:border-neutral-500 shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeEndDate}
                    onChange={(e) => setIncludeEndDate(e.target.checked)}
                    className="rounded border-neutral-350 text-[#4c5c4a] focus:ring-[#4c5c4a]"
                  />
                  <span className="text-xs font-bold text-neutral-700 font-mono uppercase">Include end date (Add 1 Day)</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={businessDaysOnly}
                    onChange={(e) => setBusinessDaysOnly(e.target.checked)}
                    className="rounded border-neutral-350 text-[#4c5c4a] focus:ring-[#4c5c4a]"
                  />
                  <span className="text-xs font-bold text-neutral-700 font-mono uppercase">Highlight business days</span>
                </label>
              </div>
            </div>
          )}

          {/* Mode 2 Inputs: Add/Subtract */}
          {mode === 'add-sub' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="dd-base" className="block text-[10px] font-extrabold text-neutral-600 font-mono uppercase tracking-wider">Base Date</label>
                <input
                  type="date"
                  id="dd-base"
                  value={baseDateStr}
                  onChange={(e) => setBaseDateStr(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-350 rounded-lg text-sm font-mono font-bold focus:outline-none focus:border-neutral-500 shadow-inner"
                />
              </div>

              <RetroSelect
                label="Operation"
                value={op}
                onChange={(v) => setOp(v as 'add' | 'subtract')}
                id="dd-op"
                options={[
                  { value: 'add', label: 'Add (+)' },
                  { value: 'subtract', label: 'Subtract (−)' }
                ]}
              />

              <div className="grid grid-cols-2 gap-2">
                <RetroInput label="Years" value={yearsInput} onChange={setYearsInput} placeholder="0" id="dd-add-y" />
                <RetroInput label="Months" value={monthsInput} onChange={setMonthsInput} placeholder="0" id="dd-add-m" />
                <RetroInput label="Weeks" value={weeksInput} onChange={setWeeksInput} placeholder="0" id="dd-add-w" />
                <RetroInput label="Days" value={daysInput} onChange={setDaysInput} placeholder="0" id="dd-add-d" />
              </div>
            </div>
          )}
        </div>

        {/* ── Right Column: Results & Visuals ── */}
        <div className="min-h-[440px]">
          {mode === 'diff' && (
            <div className="space-y-4">
              {diffResults && !diffResults.error ? (
                <div className="space-y-4">
                  {diffResults.isSwapped && (
                    <div className="p-3 bg-amber-50 border border-amber-300 text-amber-800 text-xs font-mono rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4.5 h-4.5" />
                      <span>Note: Start date is after End date. Calculating absolute difference.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <ResultDisplay
                      label={businessDaysOnly ? "Working Business Days" : "Total Calendar Days"}
                      value={businessDaysOnly ? `${diffResults.businessDays} days` : `${diffResults.totalDays} days`}
                      large
                    />
                    <ResultDisplay
                      label="Weeks breakdown"
                      value={diffResults.weeksStr}
                    />
                  </div>

                  {/* Calendar Matrix representation */}
                  <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4">
                    <p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                      Spanned Duration Map (First 35 Days)
                    </p>
                    <div className="grid grid-cols-7 gap-1.5 justify-items-center">
                      {calendarGrid.map(cell => (
                        <div
                          key={cell.id}
                          className={`w-7 h-7 rounded-md border text-[9px] font-bold font-mono flex items-center justify-center transition-all ${
                            cell.isHighlight
                              ? 'bg-[#4c5c4a] border-[#4c5c4a] text-white'
                              : 'bg-white border-neutral-200 text-neutral-400'
                          } ${cell.isWeekend ? 'opacity-80' : ''}`}
                        >
                          {cell.id + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expanded Breakdown Table */}
                  <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                    <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                      Detailed Breakdowns
                    </p>
                    <div className="divide-y divide-neutral-200">
                      <div className="p-2.5 flex justify-between text-xs font-mono">
                        <span className="text-neutral-500">Gregorian Span</span>
                        <span className="font-bold text-neutral-800">
                          {diffResults.years > 0 ? `${diffResults.years}y ` : ''}
                          {diffResults.months > 0 ? `${diffResults.months}m ` : ''}
                          {diffResults.days}d
                        </span>
                      </div>
                      <div className="p-2.5 flex justify-between text-xs font-mono">
                        <span className="text-neutral-500">Business Days / Weekends</span>
                        <span className="font-bold text-neutral-800">
                          {diffResults.businessDays} Wd / {diffResults.weekendDays} We
                        </span>
                      </div>
                      <div className="p-2.5 flex justify-between text-xs font-mono">
                        <span className="text-neutral-500">In Hours</span>
                        <span className="font-bold text-neutral-800">{diffResults.hours.toLocaleString()} hrs</span>
                      </div>
                      <div className="p-2.5 flex justify-between text-xs font-mono">
                        <span className="text-neutral-500">In Minutes</span>
                        <span className="font-bold text-neutral-800">{diffResults.minutes.toLocaleString()} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
                  {diffResults?.error || 'Enter valid dates.'}
                </div>
              )}
            </div>
          )}

          {mode === 'add-sub' && (
            <div className="space-y-4">
              {addSubResults && !addSubResults.error ? (
                <div className="space-y-4">
                  <ResultDisplay label="Target Date Outcome" value={addSubResults.formattedDate} large />
                  <ResultDisplay label="ISO Standard Format" value={addSubResults.rawDate} />
                  
                  <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-5 flex items-center justify-center gap-4">
                    <span className="text-xs font-bold font-mono text-neutral-600 uppercase">Base Date</span>
                    <ArrowRight className="w-4.5 h-4.5 text-neutral-500" />
                    <span className="text-sm font-extrabold font-mono text-[#4c5c4a] bg-white border border-neutral-300 px-3 py-1.5 rounded-lg shadow-sm">
                      {addSubResults.rawDate}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
                  {addSubResults?.error || 'Enter valid configurations to add or subtract days.'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
