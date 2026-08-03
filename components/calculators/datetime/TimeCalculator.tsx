'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { Plus, Trash2, Clock, RefreshCw, AlertTriangle, ArrowRightLeft } from 'lucide-react'

type Mode = 'math' | 'convert'
type ConvertUnit = 'days' | 'hours' | 'minutes' | 'seconds'

interface TimeEntry {
  id: string
  days: string
  hours: string
  minutes: string
  seconds: string
  op: '+' | '-'
}

export default function TimeCalculator() {
  const [mode, setMode] = useState<Mode>('math')

  // Math Mode States: dynamic rows of time intervals
  const [entries, setEntries] = useState<TimeEntry[]>([
    { id: '1', days: '0', hours: '1', minutes: '30', seconds: '0', op: '+' },
    { id: '2', days: '0', hours: '0', minutes: '45', seconds: '0', op: '+' }
  ])

  // Convert Mode States
  const [convertValue, setConvertValue] = useState('1.5')
  const [convertUnit, setConvertUnit] = useState<ConvertUnit>('hours')

  // Math Mode Calculations
  const mathResult = useMemo(() => {
    let totalSec = 0
    let hasValid = false

    entries.forEach(entry => {
      const d = parseFloat(entry.days) || 0
      const h = parseFloat(entry.hours) || 0
      const m = parseFloat(entry.minutes) || 0
      const s = parseFloat(entry.seconds) || 0

      if (d !== 0 || h !== 0 || m !== 0 || s !== 0) {
        hasValid = true
      }

      // Convert everything to seconds
      const rowSec = (d * 86400) + (h * 3600) + (m * 60) + s
      if (entry.op === '+') {
        totalSec += rowSec
      } else {
        totalSec -= rowSec
      }
    });

    if (!hasValid) return null

    const isNegative = totalSec < 0
    const absSec = Math.abs(totalSec)

    const days = Math.floor(absSec / 86400)
    const remSec1 = absSec % 86400
    const hours = Math.floor(remSec1 / 3600)
    const remSec2 = remSec1 % 3600
    const minutes = Math.floor(remSec2 / 60)
    const seconds = Math.round(remSec2 % 60)

    // Alternative unit breakdowns
    const totalHours = totalSec / 3600
    const totalMinutes = totalSec / 60

    return {
      isNegative,
      days,
      hours,
      minutes,
      seconds,
      totalSec,
      totalHours,
      totalMinutes,
      formatted: `${isNegative ? '− ' : ''}${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`
    }
  }, [entries])

  // Conversion Mode Calculations
  const convertResult = useMemo(() => {
    const val = parseFloat(convertValue)
    if (isNaN(val)) return null

    let canonicalSec = 0
    if (convertUnit === 'days') canonicalSec = val * 86400
    else if (convertUnit === 'hours') canonicalSec = val * 3600
    else if (convertUnit === 'minutes') canonicalSec = val * 60
    else canonicalSec = val

    const days = canonicalSec / 86400
    const hours = canonicalSec / 3600
    const minutes = canonicalSec / 60
    const seconds = canonicalSec

    // Breakdown into HMS
    const absSec = Math.abs(canonicalSec)
    const dPart = Math.floor(absSec / 86400)
    const hPart = Math.floor((absSec % 86400) / 3600)
    const mPart = Math.floor((absSec % 3600) / 60)
    const sPart = Math.round(absSec % 60)

    return {
      days,
      hours,
      minutes,
      seconds,
      hmsFormatted: `${canonicalSec < 0 ? '− ' : ''}${dPart > 0 ? `${dPart}d ` : ''}${hPart}h ${mPart}m ${sPart}s`
    }
  }, [convertValue, convertUnit])

  const addEntry = () => {
    const nextId = (Math.max(...entries.map(e => parseInt(e.id) || 0)) + 1).toString()
    setEntries([...entries, { id: nextId, days: '0', hours: '0', minutes: '0', seconds: '0', op: '+' }])
  }

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(e => e.id !== id))
    }
  }

  const updateEntry = (id: string, field: keyof TimeEntry, val: string) => {
    setEntries(entries.map(e => (e.id === id ? { ...e, [field]: val } : e)))
  }

  const resetMath = () => {
    setEntries([
      { id: '1', days: '0', hours: '1', minutes: '30', seconds: '0', op: '+' },
      { id: '2', days: '0', hours: '0', minutes: '45', seconds: '0', op: '+' }
    ])
  }

  // Interactive SVG variables: Angle on a clock or relative gauge
  const clockAngle = useMemo(() => {
    if (!mathResult) return 0
    // Visualise hours + minutes on a 12-hour clock face
    const totalHoursFraction = (mathResult.totalSec % 43200) / 3600 // 12 hours = 43200 sec
    return (totalHoursFraction / 12) * 3600 * (360 / 3600) // degrees
  }, [mathResult])

  return (
    <FormCalculatorShell title="Time Calculator" subtitle="Add, subtract, and convert time values" badge="DATE & TIME">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        
        {/* ── Left Column: Inputs ── */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-200 p-1">
            <button
              onClick={() => setMode('math')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-mono font-bold uppercase transition ${
                mode === 'math' ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Sum / Difference
            </button>
            <button
              onClick={() => setMode('convert')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-mono font-bold uppercase transition ${
                mode === 'convert' ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" /> Time Converter
            </button>
          </div>

          {/* MATH MODE INPUTS */}
          {mode === 'math' && (
            <div className="space-y-3">
              <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1">
                {entries.map((entry, idx) => (
                  <div key={entry.id} className="relative p-3 rounded-xl border border-neutral-300 bg-white/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-neutral-500 font-mono">ENTRY #{idx + 1}</span>
                      <div className="flex items-center gap-2">
                        {/* Operation Selector */}
                        <select
                          value={entry.op}
                          onChange={(e) => updateEntry(entry.id, 'op', e.target.value as '+' | '-')}
                          className="h-7 px-2 bg-neutral-200 text-xs font-mono font-bold rounded-lg border border-neutral-300 focus:outline-none cursor-pointer"
                        >
                          <option value="+">Add (+)</option>
                          <option value="-">Subtract (−)</option>
                        </select>
                        {entries.length > 1 && (
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="p-1 text-neutral-400 hover:text-red-600 rounded transition"
                            title="Remove Entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      <RetroInput label="D" value={entry.days} onChange={(v) => updateEntry(entry.id, 'days', v)} placeholder="0" id={`tc-d-${entry.id}`} />
                      <RetroInput label="H" value={entry.hours} onChange={(v) => updateEntry(entry.id, 'hours', v)} placeholder="0" id={`tc-h-${entry.id}`} />
                      <RetroInput label="M" value={entry.minutes} onChange={(v) => updateEntry(entry.id, 'minutes', v)} placeholder="0" id={`tc-m-${entry.id}`} />
                      <RetroInput label="S" value={entry.seconds} onChange={(v) => updateEntry(entry.id, 'seconds', v)} placeholder="0" id={`tc-s-${entry.id}`} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addEntry}
                  className="flex-1 h-10 px-4 flex items-center justify-center gap-1.5 text-xs font-extrabold font-mono rounded-lg border-2 border-dashed border-neutral-400 text-neutral-600 hover:text-neutral-800 hover:border-neutral-600 transition"
                >
                  <Plus className="w-4 h-4" /> Add Time Row
                </button>
                <button
                  onClick={resetMath}
                  className="h-10 px-3 bg-neutral-350 text-neutral-800 border border-neutral-400 rounded-lg hover:bg-neutral-300 transition"
                  title="Reset"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* CONVERT MODE INPUTS */}
          {mode === 'convert' && (
            <div className="space-y-3">
              <RetroInput
                label="Decimal Time Value"
                value={convertValue}
                onChange={setConvertValue}
                placeholder="1.5"
                id="tc-convert-val"
              />
              <RetroSelect
                label="Source Time Unit"
                value={convertUnit}
                onChange={(v) => setConvertUnit(v as ConvertUnit)}
                id="tc-convert-unit"
                options={[
                  { value: 'days', label: 'Days' },
                  { value: 'hours', label: 'Hours' },
                  { value: 'minutes', label: 'Minutes' },
                  { value: 'seconds', label: 'Seconds' }
                ]}
              />
            </div>
          )}
        </div>

        {/* ── Right Column: Results & Interactive Clock ── */}
        <div className="min-h-[440px]">
          {mode === 'math' && (
            <div className="space-y-4">
              {mathResult ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <ResultDisplay label="Cumulative Duration" value={mathResult.formatted} large />
                    <ResultDisplay label="Total Hours" value={`${mathResult.totalHours.toFixed(4)} hrs`} />
                  </div>

                  {/* Interactive Clock SVG Visual */}
                  <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                    <p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">
                      Cumulative Dial Accumulator (12h cycle)
                    </p>
                    <svg viewBox="0 0 160 160" className="w-36 h-36" role="img" aria-label="A clock face displaying the hour and minute hands derived from the calculated time accumulation.">
                      <circle cx="80" cy="80" r="72" fill="#fcfbfa" stroke="#101827" strokeWidth="4" />
                      
                      {/* Clock ticks */}
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                        <line
                          key={deg}
                          x1="80"
                          y1="12"
                          x2="80"
                          y2="18"
                          transform={`rotate(${deg} 80 80)`}
                          stroke="#9ca3af"
                          strokeWidth="2"
                        />
                      ))}
                      
                      {/* Hands */}
                      {/* Hour hand */}
                      <line
                        x1="80"
                        y1="80"
                        x2="80"
                        y2="42"
                        stroke="#111827"
                        strokeWidth="4"
                        strokeLinecap="round"
                        transform={`rotate(${clockAngle} 80 80)`}
                        style={{ transition: 'transform 450ms cubic-bezier(.2,.8,.2,1)' }}
                      />
                      
                      {/* Center pin */}
                      <circle cx="80" cy="80" r="5" fill="#dfaa44" stroke="#111827" strokeWidth="1.5" />
                    </svg>
                  </div>

                  {/* Detail breakdowns */}
                  <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                    <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                      Time Breakdown
                    </p>
                    <div className="divide-y divide-neutral-200">
                      <div className="p-2.5 flex justify-between text-xs font-mono">
                        <span className="text-neutral-500">Total Minutes</span>
                        <span className="font-bold text-neutral-800">{mathResult.totalMinutes.toLocaleString()} m</span>
                      </div>
                      <div className="p-2.5 flex justify-between text-xs font-mono">
                        <span className="text-neutral-500">Total Seconds</span>
                        <span className="font-bold text-neutral-800">{mathResult.totalSec.toLocaleString()} s</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
                  Add non-zero values above to sum or subtract timesheet intervals.
                </div>
              )}
            </div>
          )}

          {mode === 'convert' && (
            <div className="space-y-4">
              {convertResult ? (
                <div className="space-y-4">
                  <ResultDisplay label="Breakdown into HMS" value={convertResult.hmsFormatted} large />
                  
                  {/* Grid of other values */}
                  <div className="grid grid-cols-2 gap-3">
                    <ResultDisplay label="In Days" value={`${convertResult.days.toFixed(6)}`} />
                    <ResultDisplay label="In Hours" value={`${convertResult.hours.toFixed(6)}`} />
                    <ResultDisplay label="In Minutes" value={`${convertResult.minutes.toFixed(2)}`} />
                    <ResultDisplay label="In Seconds" value={`${convertResult.seconds.toFixed(0)}`} />
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
                  Please enter a valid decimal time value.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
