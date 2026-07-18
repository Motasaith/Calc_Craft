'use client'

import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, RetroActionButton } from '../shared/FormCalculatorShell'
import ShareExportPanel from '../shared/ShareExportPanel'
import { AlertTriangle, Calendar, Info, Heart, Baby } from 'lucide-react'

interface ConceptionResults {
  mostProbableConceptionStart: Date
  mostProbableConceptionEnd: Date
  mostProbableIntercourseStart: Date
  mostProbableIntercourseEnd: Date
  possibleConceptionStart: Date
  possibleConceptionEnd: Date
  possibleIntercourseStart: Date
  possibleIntercourseEnd: Date
  dueDate: Date
  lmpDate: Date
  conceptionDate: Date
  implantationStart: Date
  implantationEnd: Date
  missedPeriodDate: Date
}

export default function ConceptionCalculator() {
  const [mode, setMode] = useState<'due' | 'lmp' | 'ultrasound'>('due')
  const [dueDateStr, setDueDateStr] = useState('')
  const [lmpDateStr, setLmpDateStr] = useState('')
  const [cycleLength, setCycleLength] = useState('28')
  
  // Ultrasound inputs
  const [ultrasoundDateStr, setUltrasoundDateStr] = useState('')
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState('8')
  const [ultrasoundDays, setUltrasoundDays] = useState('0')

  const [isCalculated, setIsCalculated] = useState(false)
  const [results, setResults] = useState<ConceptionResults | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // URL serialization states
  const [queryParams, setQueryParams] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('m', mode)
    params.set('dd', dueDateStr)
    params.set('lmp', lmpDateStr)
    params.set('cl', cycleLength)
    params.set('ud', ultrasoundDateStr)
    params.set('uw', ultrasoundWeeks)
    params.set('udays', ultrasoundDays)
    setQueryParams(params.toString())
  }, [mode, dueDateStr, lmpDateStr, cycleLength, ultrasoundDateStr, ultrasoundWeeks, ultrasoundDays])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const m = params.get('m')
      const dd = params.get('dd')
      const lmp = params.get('lmp')
      const cl = params.get('cl')
      const ud = params.get('ud')
      const uw = params.get('uw')
      const udays = params.get('udays')

      if (m === 'due' || m === 'lmp' || m === 'ultrasound') setMode(m)
      if (dd) setDueDateStr(dd)
      if (lmp) setLmpDateStr(lmp)
      if (cl) setCycleLength(cl)
      if (ud) setUltrasoundDateStr(ud)
      if (uw) setUltrasoundWeeks(uw)
      if (udays) setUltrasoundDays(udays)

      if (dd || lmp || ud) {
        setIsCalculated(true)
      }
    }
  }, [])

  const handleClear = () => {
    setMode('due')
    setDueDateStr('')
    setLmpDateStr('')
    setCycleLength('28')
    setUltrasoundDateStr('')
    setUltrasoundWeeks('8')
    setUltrasoundDays('0')
    setIsCalculated(false)
    setResults(null)
    setErrorMsg('')
  }

  const handleCalculate = () => {
    setErrorMsg('')
    let ecd: Date
    let estDueDate: Date
    let estLmp: Date

    if (mode === 'due') {
      if (!dueDateStr) {
        setErrorMsg('Please select your estimated due date.')
        return
      }
      estDueDate = new Date(dueDateStr)
      // Conception Date = Due Date - 266 days
      ecd = new Date(estDueDate)
      ecd.setDate(estDueDate.getDate() - 266)
      // LMP = Due Date - 280 days
      estLmp = new Date(estDueDate)
      estLmp.setDate(estDueDate.getDate() - 280)
    } else if (mode === 'lmp') {
      if (!lmpDateStr) {
        setErrorMsg('Please select the first day of your last period.')
        return
      }
      const cycle = parseInt(cycleLength)
      if (isNaN(cycle) || cycle < 20 || cycle > 45) {
        setErrorMsg('Please enter a valid average cycle length between 20 and 45 days.')
        return
      }
      estLmp = new Date(lmpDateStr)
      // Conception = LMP + cycle - 14
      ecd = new Date(estLmp)
      ecd.setDate(estLmp.getDate() + cycle - 14)
      // Due Date = LMP + 280 + (cycle - 28)
      estDueDate = new Date(estLmp)
      estDueDate.setDate(estLmp.getDate() + 280 + (cycle - 28))
    } else {
      if (!ultrasoundDateStr) {
        setErrorMsg('Please select the date of your ultrasound scan.')
        return
      }
      const weeks = parseInt(ultrasoundWeeks)
      const days = parseInt(ultrasoundDays)
      if (isNaN(weeks) || weeks < 3 || weeks > 42) {
        setErrorMsg('Please enter a valid gestational age in weeks (3 to 42).')
        return
      }
      if (isNaN(days) || days < 0 || days > 6) {
        setErrorMsg('Please enter valid gestational age days (0 to 6).')
        return
      }
      const scanDate = new Date(ultrasoundDateStr)
      const totalDays = weeks * 7 + days
      // LMP = Scan Date - totalDays
      estLmp = new Date(scanDate)
      estLmp.setDate(scanDate.getDate() - totalDays)
      // Conception = LMP + 14
      ecd = new Date(estLmp)
      ecd.setDate(estLmp.getDate() + 14)
      // Due Date = LMP + 280
      estDueDate = new Date(estLmp)
      estDueDate.setDate(estLmp.getDate() + 280)
    }

    // Ranges math:
    // 1. Most probable conception: ECD - 2 to ECD + 2
    const mConceptionStart = new Date(ecd)
    mConceptionStart.setDate(ecd.getDate() - 2)
    const mConceptionEnd = new Date(ecd)
    mConceptionEnd.setDate(ecd.getDate() + 2)

    // 2. Most probable intercourse: ECD - 5 to ECD + 2
    const mIntercourseStart = new Date(ecd)
    mIntercourseStart.setDate(ecd.getDate() - 5)
    const mIntercourseEnd = new Date(ecd)
    mIntercourseEnd.setDate(ecd.getDate() + 2)

    // 3. Possible conception: ECD - 3 to ECD + 7
    const pConceptionStart = new Date(ecd)
    pConceptionStart.setDate(ecd.getDate() - 3)
    const pConceptionEnd = new Date(ecd)
    pConceptionEnd.setDate(ecd.getDate() + 7)

    // 4. Possible intercourse: ECD - 8 to ECD + 7
    const pIntercourseStart = new Date(ecd)
    pIntercourseStart.setDate(ecd.getDate() - 8)
    const pIntercourseEnd = new Date(ecd)
    pIntercourseEnd.setDate(ecd.getDate() + 7)

    // Milestones math:
    const impStart = new Date(ecd)
    impStart.setDate(ecd.getDate() + 6)
    const impEnd = new Date(ecd)
    impEnd.setDate(ecd.getDate() + 12)

    const cycle = mode === 'lmp' ? parseInt(cycleLength) : 28
    const missedPeriod = new Date(estLmp)
    missedPeriod.setDate(estLmp.getDate() + cycle)

    setResults({
      mostProbableConceptionStart: mConceptionStart,
      mostProbableConceptionEnd: mConceptionEnd,
      mostProbableIntercourseStart: mIntercourseStart,
      mostProbableIntercourseEnd: mIntercourseEnd,
      possibleConceptionStart: pConceptionStart,
      possibleConceptionEnd: pConceptionEnd,
      possibleIntercourseStart: pIntercourseStart,
      possibleIntercourseEnd: pIntercourseEnd,
      dueDate: estDueDate,
      lmpDate: estLmp,
      conceptionDate: ecd,
      implantationStart: impStart,
      implantationEnd: impEnd,
      missedPeriodDate: missedPeriod
    })
    setIsCalculated(true)
  }

  const formatDateRange = (start: Date, end: Date) => {
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return `${fmt(start)} - ${fmt(end)}`
  }

  const formatSingleDate = (d: Date) => {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <FormCalculatorShell title="Pregnancy Conception Calculator" badge="HEALTH" subtitle="Estimate conception and intercourse windows">
      <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="space-y-4 no-print">
          {/* Method selector */}
          <RetroSelect
            label="Calculate Based On"
            value={mode}
            onChange={(val) => {
              setMode(val as any)
              setIsCalculated(false)
              setResults(null)
              setErrorMsg('')
            }}
            options={[
              { value: 'due', label: 'Expected Due Date' },
              { value: 'lmp', label: 'Last Menstrual Period (LMP)' },
              { value: 'ultrasound', label: 'Ultrasound Scan Sonogram' }
            ]}
            id="conception-mode"
          />

          {/* Due date inputs */}
          {mode === 'due' && (
            <RetroInput
              label="Your Estimated Due Date"
              value={dueDateStr}
              onChange={setDueDateStr}
              type="date"
              id="conception-due-date"
            />
          )}

          {/* Last menstrual period inputs */}
          {mode === 'lmp' && (
            <>
              <RetroInput
                label="First Day of Last Period"
                value={lmpDateStr}
                onChange={setLmpDateStr}
                type="date"
                id="conception-lmp-date"
              />
              <RetroInput
                label="Average Cycle Length (Days)"
                value={cycleLength}
                onChange={setCycleLength}
                placeholder="28"
                type="number"
                id="conception-cycle-length"
              />
            </>
          )}

          {/* Ultrasound inputs */}
          {mode === 'ultrasound' && (
            <>
              <RetroInput
                label="Date of Ultrasound Scan"
                value={ultrasoundDateStr}
                onChange={setUltrasoundDateStr}
                type="date"
                id="conception-ultrasound-date"
              />
              <div className="grid grid-cols-2 gap-3">
                <RetroSelect
                  label="Scan Weeks"
                  value={ultrasoundWeeks}
                  onChange={setUltrasoundWeeks}
                  options={Array.from({ length: 40 }, (_, i) => ({
                    value: String(i + 3),
                    label: `${i + 3} Weeks`
                  }))}
                  id="conception-scan-weeks"
                />
                <RetroSelect
                  label="Scan Days"
                  value={ultrasoundDays}
                  onChange={setUltrasoundDays}
                  options={Array.from({ length: 7 }, (_, i) => ({
                    value: String(i),
                    label: `${i} Days`
                  }))}
                  id="conception-scan-days"
                />
              </div>
            </>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-[11px] text-red-600 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <RetroActionButton onClick={handleCalculate} variant="primary" fullWidth>
              Calculate Dates
            </RetroActionButton>
            <RetroActionButton onClick={handleClear} variant="secondary">
              Clear
            </RetroActionButton>
          </div>
        </div>

        {/* Right Column: Pregnancy Dashboard results */}
        <div className="bg-[#eae7df]/50 border-2 border-[#dad6cd] rounded-xl p-4 sm:p-6 h-full flex flex-col justify-between min-h-[350px] print-target">
          {isCalculated && results ? (
            <div className="space-y-6">
              {/* Highlight Conception Display Card */}
              <div className="p-5 bg-pink-50 border border-pink-200 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-pink-700 font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Heart className="w-4 h-4 text-pink-500 animate-pulse fill-pink-500" />
                  Most Probable Conception Period
                </div>
                <div className="text-xl sm:text-2xl font-black text-pink-900 font-mono tracking-tight leading-none">
                  {formatDateRange(results.mostProbableConceptionStart, results.mostProbableConceptionEnd)}
                </div>
                <div className="text-[11px] text-pink-600 leading-relaxed font-sans">
                  This range represents the most likely dates of ovulation and fertilization based on your pregnancy timing.
                </div>
              </div>

              {/* Grid range statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-white border border-neutral-250 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-neutral-400 font-mono uppercase tracking-wider block">
                    Most Probable Intercourse Window
                  </span>
                  <span className="text-[11px] font-bold font-mono text-neutral-800 block">
                    {formatDateRange(results.mostProbableIntercourseStart, results.mostProbableIntercourseEnd)}
                  </span>
                  <p className="text-[9px] text-neutral-500 font-sans leading-normal">
                    Days of intercourse leading to pregnancy (viable sperm lifespan).
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-neutral-250 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-neutral-400 font-mono uppercase tracking-wider block">
                    Possible Conception Window
                  </span>
                  <span className="text-[11px] font-bold font-mono text-neutral-800 block">
                    {formatDateRange(results.possibleConceptionStart, results.possibleConceptionEnd)}
                  </span>
                  <p className="text-[9px] text-neutral-500 font-sans leading-normal">
                    Extended range accounting for cycle and ovulation variations.
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-neutral-255 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-neutral-400 font-mono uppercase tracking-wider block">
                    Possible Intercourse Window
                  </span>
                  <span className="text-[11px] font-bold font-mono text-neutral-800 block">
                    {formatDateRange(results.possibleIntercourseStart, results.possibleIntercourseEnd)}
                  </span>
                  <p className="text-[9px] text-neutral-500 font-sans leading-normal">
                    Maximum possible timeframe intercourse could have initiated fertilization.
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-neutral-255 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-neutral-400 font-mono uppercase tracking-wider block">
                    Estimated Due Date (40 Weeks)
                  </span>
                  <span className="text-[11px] font-bold font-mono text-neutral-800 block flex items-center gap-1">
                    <Baby className="w-3.5 h-3.5 text-blue-500" />
                    {formatSingleDate(results.dueDate)}
                  </span>
                  <p className="text-[9px] text-neutral-500 font-sans leading-normal">
                    Expected day of delivery based on standard pregnancy length.
                  </p>
                </div>
              </div>

              {/* Dynamic SVG Timeline of Early Milestones */}
              <div className="bg-white border border-neutral-300 rounded-xl p-4 space-y-4">
                <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider block">
                  Early Pregnancy Milestone Timeline
                </span>

                <div className="relative pb-2">
                  {/* Timeline Horizontal Line */}
                  <svg className="w-full h-24 overflow-visible" xmlns="http://www.w3.org/2000/svg">
                    {/* Background track */}
                    <line x1="10%" y1="40" x2="90%" y2="40" stroke="#dad6cd" strokeWidth="4" strokeLinecap="round" />
                    
                    {/* Milestones */}
                    {[
                      { label: 'LMP', date: results.lmpDate, pct: 15, color: '#6b7280' },
                      { label: 'Intercourse', date: results.mostProbableIntercourseStart, pct: 33, color: '#ec4899' },
                      { label: 'Conception', date: results.conceptionDate, pct: 50, color: '#d946ef' },
                      { label: 'Implantation', date: results.implantationStart, pct: 68, color: '#8b5cf6' },
                      { label: 'Missed Period', date: results.missedPeriodDate, pct: 85, color: '#3b82f6' }
                    ].map((m, idx) => (
                      <g key={idx}>
                        <circle cx={`${m.pct}%`} cy="40" r="6" fill="#fff" stroke={m.color} strokeWidth="3" className="cursor-pointer hover:r-8 transition-all" />
                        <text x={`${m.pct}%`} y="25" textAnchor="middle" fill="#1f2937" fontSize="8" fontWeight="bold" fontFamily="monospace">
                          {m.label}
                        </text>
                        <text x={`${m.pct}%`} y="58" textAnchor="middle" fill="#6b7280" fontSize="7" fontFamily="monospace">
                          {m.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              <ShareExportPanel
                queryParams={queryParams}
                emailSubject="Pregnancy Conception Calculation Results"
                emailBody={
                  `Pregnancy Conception Calculator Results:\n` +
                  `- Mode: ${mode === 'due' ? 'By Due Date' : mode === 'lmp' ? 'By Last Period' : 'By Ultrasound'}\n` +
                  `- Most Probable Conception: ${results ? results.mostProbableConceptionStart.toLocaleDateString() + ' - ' + results.mostProbableConceptionEnd.toLocaleDateString() : ''}\n` +
                  `- Most Probable Intercourse: ${results ? results.mostProbableIntercourseStart.toLocaleDateString() + ' - ' + results.mostProbableIntercourseEnd.toLocaleDateString() : ''}\n` +
                  `- Estimated Due Date: ${results ? results.dueDate.toLocaleDateString() : ''}`
                }
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <Calendar className="w-12 h-12 text-neutral-400 stroke-1 mb-3 animate-pulse" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Inputs</p>
              <p className="text-[10px] font-mono mt-1 max-w-[220px] leading-relaxed">
                Provide your estimated due date, last menstrual period, or ultrasound scan details to calculate conception windows and view your gestational timeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
