'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TimeZoneCalculator() {
  const [timeStr, setTimeStr] = useState('12:00')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, est: '', pst: '', gmt: '' }
    if (!timeStr) return { ...defaultObj, error: 'Please enter a time.' }
    const [hrs, mins] = timeStr.split(':').map(Number)
    if (isNaN(hrs) || isNaN(mins)) return { ...defaultObj, error: 'Invalid time format.' }
    
    const formatTime = (h: number, m: number) => {
      const displayH = (h + 24) % 24
      const ampm = displayH >= 12 ? 'PM' : 'AM'
      const normH = displayH % 12 || 12
      return `${normH}:${m < 10 ? '0' : ''}${m} ${ampm}`
    }

    return {
      error: null,
      est: formatTime(hrs, mins),
      pst: formatTime(hrs - 3, mins),
      gmt: formatTime(hrs + 5, mins)
    }
  }, [timeStr])

  return (
    <FormCalculatorShell title="Time Zone Converter" subtitle="Convert local standard times between major time zone meridians" badge="DATE-TIME">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Input Time (24h format, e.g. 12:00)" value={timeStr} onChange={setTimeStr} id="tz-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-3 gap-2">
              <ResultDisplay label="EST (Local)" value={results.est} />
              <ResultDisplay label="PST (Pacific)" value={results.pst} />
              <ResultDisplay label="GMT/UTC" value={results.gmt} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
