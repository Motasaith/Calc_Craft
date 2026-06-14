'use client'
import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function PrayerTimesCalculator() {
  const [city, setCity] = useState('London')
  const [country, setCountry] = useState('UK')
  const [times, setTimes] = useState<Record<string,string>|null>(null)
  const [loading, setLoading] = useState(false)

  const fetchTimes = async () => {
    setLoading(true)
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`)
      const data = await res.json()
      if (data.data?.timings) setTimes(data.data.timings)
    } catch { setTimes(null) }
    setLoading(false)
  }

  return (
    <FormCalculatorShell title="Prayer Times" badge="ISLAMIC">
      <RetroInput label="City" value={city} onChange={setCity} placeholder="London" id="pt-city" />
      <RetroInput label="Country" value={country} onChange={setCountry} placeholder="UK" id="pt-country" />
      <div className="mt-4"><RetroActionButton onClick={fetchTimes} variant="primary" fullWidth>{loading ? 'Loading...' : 'Get Prayer Times'}</RetroActionButton></div>
      {times && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'].map(p => (
            <ResultDisplay key={p} label={p} value={times[p] || 'N/A'} />
          ))}
        </div>
      )}
    </FormCalculatorShell>
  )
}
