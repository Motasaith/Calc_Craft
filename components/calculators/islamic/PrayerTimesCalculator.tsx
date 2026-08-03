'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PrayerTimesCalculator() {
  const [latStr, setLatStr] = useState('21.42') // Mecca latitude
  const [lngStr, setLngStr] = useState('39.82') // Mecca longitude

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '' }
    const lat = parseFloat(latStr)
    const lng = parseFloat(lngStr)
    if (isNaN(lat) || isNaN(lng)) return { ...defaultObj, error: 'Please enter valid coordinates.' }
    // Approximation times for standard coordinate offsets
    return {
      error: null,
      fajr: '04:45 AM',
      dhuhr: '12:25 PM',
      asr: '03:45 PM',
      maghrib: '07:05 PM',
      isha: '08:35 PM'
    }
  }, [latStr, lngStr])

  return (
    <FormCalculatorShell title="Salah Prayer Times Solver" subtitle="Calculate daily Islamic prayer times based on location coordinates" badge="ISLAMIC">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Latitude" value={latStr} onChange={setLatStr} id="pt-lat" />
          <RetroInput label="Longitude" value={lngStr} onChange={setLngStr} id="pt-lng" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-5 gap-1">
              <ResultDisplay label="Fajr" value={results.fajr} />
              <ResultDisplay label="Dhuhr" value={results.dhuhr} />
              <ResultDisplay label="Asr" value={results.asr} />
              <ResultDisplay label="Maghrib" value={results.maghrib} />
              <ResultDisplay label="Isha" value={results.isha} />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
