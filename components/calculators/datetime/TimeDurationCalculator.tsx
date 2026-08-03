'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { Plus, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react'

interface DurationInterval {
  id: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  useDate: boolean
}

export default function TimeDurationCalculator() {
  const [intervals, setIntervals] = useState<DurationInterval[]>([
    { id: '1', startDate: '', startTime: '09:00', endDate: '', endTime: '17:30', useDate: false }
  ])

  // Calculation logic
  const results = useMemo(() => {
    let totalMinutes = 0
    let hasError = false
    const rowDurations = intervals.map(interval => {
      let diffMin = 0
      let warning = ''
      let isOvernight = false

      if (interval.useDate) {
        // With dates
        const startStr = `${interval.startDate || new Date().toISOString().split('T')[0]}T${interval.startTime || '00:00'}`
        const endStr = `${interval.endDate || new Date().toISOString().split('T')[0]}T${interval.endTime || '00:00'}`
        
        const startMs = Date.parse(startStr)
        const endMs = Date.parse(endStr)

        if (isNaN(startMs) || isNaN(endMs)) {
          return { id: interval.id, minutes: 0, text: 'Invalid Date/Time', error: true }
        }

        if (endMs < startMs) {
          warning = 'End is before start'
          hasError = true
          return { id: interval.id, minutes: 0, text: 'End is before start', error: true }
        }

        diffMin = Math.round((endMs - startMs) / 60000)
      } else {
        // Time only
        const [sh, sm] = (interval.startTime || '00:00').split(':').map(Number)
        const [eh, em] = (interval.endTime || '00:00').split(':').map(Number)

        if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) {
          return { id: interval.id, minutes: 0, text: 'Invalid Time', error: true }
        }

        let startMin = sh * 60 + sm
        let endMin = eh * 60 + em

        if (endMin < startMin) {
          endMin += 24 * 60 // Go overnight
          isOvernight = true
        }

        diffMin = endMin - startMin
      }

      totalMinutes += diffMin
      const h = Math.floor(diffMin / 60)
      const m = diffMin % 60

      return {
        id: interval.id,
        minutes: diffMin,
        isOvernight,
        warning,
        text: `${h}h ${m}m (${diffMin} min)`,
        error: false
      }
    })

    const finalH = Math.floor(totalMinutes / 60)
    const finalM = totalMinutes % 60

    return {
      rowDurations,
      totalMinutes,
      hasError,
      formattedTotal: `${finalH} hours and ${finalM} minutes`,
      totalHoursDecimal: totalMinutes / 60
    }
  }, [intervals])

  const addInterval = () => {
    const nextId = (Math.max(...intervals.map(i => parseInt(i.id) || 0)) + 1).toString()
    // Pre-populate with previous row's config
    const last = intervals[intervals.length - 1]
    setIntervals([
      ...intervals,
      {
        id: nextId,
        startDate: last?.startDate || '',
        startTime: '09:00',
        endDate: last?.endDate || '',
        endTime: '17:30',
        useDate: last?.useDate || false
      }
    ])
  }

  const removeInterval = (id: string) => {
    if (intervals.length > 1) {
      setIntervals(intervals.filter(i => i.id !== id))
    }
  }

  const updateInterval = (id: string, field: keyof DurationInterval, val: any) => {
    setIntervals(intervals.map(i => (i.id === id ? { ...i, [field]: val } : i)))
  }

  // Interactive SVG variables: segments of active time
  const timelineSegments = useMemo(() => {
    if (results.hasError || results.totalMinutes === 0) return []
    // Make segments relative to total or standard 24h
    let currentX = 12
    const totalW = 476
    return results.rowDurations.map((row, idx) => {
      if (row.error) return null
      const fraction = row.minutes / Math.max(1, results.totalMinutes)
      const width = fraction * totalW
      const segX = currentX
      currentX += width
      return {
        x: segX,
        width: Math.max(2, width - 2), // spacing
        label: `Row #${idx + 1}`
      }
    }).filter(Boolean)
  }, [results])

  return (
    <FormCalculatorShell title="Time Duration Calculator" subtitle="Determine elapsed time over single or multiple intervals" badge="DATE & TIME">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        
        {/* ── Left Column: Inputs ── */}
        <div className="space-y-4">
          <div className="max-h-[380px] overflow-y-auto space-y-4 pr-1">
            {intervals.map((interval, idx) => (
              <div key={interval.id} className="p-3.5 rounded-xl border border-neutral-300 bg-white/50 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-neutral-500 font-mono">INTERVAL #{idx + 1}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interval.useDate}
                        onChange={(e) => updateInterval(interval.id, 'useDate', e.target.checked)}
                        className="rounded border-neutral-350 text-[#4c5c4a] focus:ring-[#4c5c4a]"
                      />
                      <span className="text-[10px] font-bold text-neutral-600 font-mono uppercase">Use Date</span>
                    </label>
                    {intervals.length > 1 && (
                      <button
                        onClick={() => removeInterval(interval.id)}
                        className="p-1 text-neutral-400 hover:text-red-600 rounded transition"
                        title="Remove Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Start Side */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block font-mono">Start point</span>
                    {interval.useDate && (
                      <input
                        type="date"
                        value={interval.startDate}
                        onChange={(e) => updateInterval(interval.id, 'startDate', e.target.value)}
                        className="w-full h-8 px-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-neutral-500"
                      />
                    )}
                    <input
                      type="time"
                      value={interval.startTime}
                      onChange={(e) => updateInterval(interval.id, 'startTime', e.target.value)}
                      className="w-full h-8 px-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-neutral-500"
                    />
                  </div>

                  {/* End Side */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block font-mono">End point</span>
                    {interval.useDate && (
                      <input
                        type="date"
                        value={interval.endDate}
                        onChange={(e) => updateInterval(interval.id, 'endDate', e.target.value)}
                        className="w-full h-8 px-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-neutral-500"
                      />
                    )}
                    <input
                      type="time"
                      value={interval.endTime}
                      onChange={(e) => updateInterval(interval.id, 'endTime', e.target.value)}
                      className="w-full h-8 px-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-neutral-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addInterval}
            className="w-full h-10 flex items-center justify-center gap-1.5 text-xs font-extrabold font-mono rounded-lg border-2 border-dashed border-neutral-400 text-neutral-600 hover:text-neutral-800 hover:border-neutral-600 transition"
          >
            <Plus className="w-4 h-4" /> Add Time Segment
          </button>
        </div>

        {/* ── Right Column: Results ── */}
        <div className="min-h-[440px] space-y-4">
          {!results.hasError && results.totalMinutes > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ResultDisplay label="Total Duration" value={results.formattedTotal} large />
                <ResultDisplay label="Total Hours (Decimal)" value={`${results.totalHoursDecimal.toFixed(3)} hrs`} />
              </div>

              {/* Reactive Visual Progress of Segments */}
              <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4">
                <p className="mb-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                  Visual Elapsed Time Distribution
                </p>
                <svg viewBox="0 0 500 48" className="h-12 w-full" role="img" aria-label="Visual timeline representing active duration intervals.">
                  <rect x="12" y="16" width="476" height="16" rx="8" fill="#e5e5e5" />
                  {timelineSegments.map((seg, i) => seg && (
                    <g key={i}>
                      <rect
                        x={seg.x}
                        y="16"
                        width={seg.width}
                        height="16"
                        rx="8"
                        fill="#8ab4a0"
                        className="transition-all duration-300 hover:fill-[#4c5c4a] cursor-pointer"
                      />
                      <text x={seg.x + seg.width / 2} y="12" fontSize="8" fill="#5a5a62" textAnchor="middle" fontWeight="bold">
                        {seg.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Row Breakdowns Table */}
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                  Interval Breakdowns
                </p>
                <div className="divide-y divide-neutral-200">
                  {results.rowDurations.map((row, idx) => (
                    <div key={row.id} className="p-3 flex justify-between items-center text-xs font-mono">
                      <span className="text-neutral-500 font-bold">Segment #{idx + 1}</span>
                      <div className="text-right">
                        <span className="font-extrabold text-neutral-800">{row.text}</span>
                        {row.isOvernight && (
                          <span className="ml-2 inline-block px-1.5 py-0.5 text-[8px] font-bold text-amber-800 bg-amber-100 rounded">
                            Overnight
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results.hasError ? (
                <div className="flex flex-col items-center text-red-700 gap-2">
                  <AlertCircle className="w-6 h-6" />
                  <span>One or more intervals has an invalid configuration (e.g. End point is before Start point).</span>
                </div>
              ) : (
                'Configure interval start and end times to calculate elapsed durations.'
              )}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
