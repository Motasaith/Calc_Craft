'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TahajjudCalculator() {
  const [maghribStr, setMaghribStr] = useState('19:00') // sunset
  const [fajrStr, setFajrStr] = useState('04:30') // dawn

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, startHour: '', endHour: '' }
    if (!maghribStr || !fajrStr) return { ...defaultObj, error: 'Please enter sunset and dawn times.' }
    const [mh, mm] = maghribStr.split(':').map(Number)
    const [fh, fm] = fajrStr.split(':').map(Number)
    if (isNaN(mh) || isNaN(mm) || isNaN(fh) || isNaN(fm)) return { ...defaultObj, error: 'Invalid time format.' }

    // Night minutes
    let nightMins = (fh * 60 + fm) - (mh * 60 + mm)
    if (nightMins < 0) nightMins += 24 * 60
    
    // Last third start time
    const lastThirdStartMins = (mh * 60 + mm + (nightMins * 2) / 3) % (24 * 60)
    const format = (mins: number) => {
      const h = Math.floor(mins / 60)
      const m = Math.round(mins % 60)
      const ampm = h >= 12 ? 'PM' : 'AM'
      const normH = h % 12 || 12
      return `${normH}:${m < 10 ? '0' : ''}${m} ${ampm}`
    }

    return {
      error: null,
      startHour: format(lastThirdStartMins),
      endHour: format(fh * 60 + fm)
    }
  }, [maghribStr, fajrStr])

  return (
    <FormCalculatorShell title="Tahajjud Last Third Night Solver" subtitle="Calculate the start of the last third of the night for voluntary prayers" badge="ISLAMIC">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Maghrib Time (Sunset, HH:MM)" value={maghribStr} onChange={setMaghribStr} id="tah-m" />
          <RetroInput label="Fajr Time (Dawn, HH:MM)" value={fajrStr} onChange={setFajrStr} id="tah-f" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Tahajjud Begins" value={results.startHour} large />
              <ResultDisplay label="Tahajjud Ends" value={results.endHour} />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
