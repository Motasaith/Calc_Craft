'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function QiblaCalculator() {
  const [latStr, setLatStr] = useState('34.05') // Los Angeles latitude
  const [lngStr, setLngStr] = useState('-118.24') // Los Angeles longitude

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, bearing: 0 }
    const lat = parseFloat(latStr)
    const lng = parseFloat(lngStr)
    if (isNaN(lat) || isNaN(lng)) return { ...defaultObj, error: 'Please enter valid coordinates.' }
    // Mecca coords: 21.42, 39.82
    const latR = lat * Math.PI / 180
    const lngR = lng * Math.PI / 180
    const mLatR = 21.4225 * Math.PI / 180
    const mLngR = 39.8262 * Math.PI / 180
    const y = Math.sin(mLngR - lngR)
    const x = Math.cos(latR) * Math.sin(mLatR) - Math.sin(latR) * Math.cos(mLatR) * Math.cos(mLngR - lngR)
    let bearing = Math.atan2(y, x) * 180 / Math.PI
    bearing = (bearing + 360) % 360
    return { error: null, bearing }
  }, [latStr, lngStr])

  return (
    <FormCalculatorShell title="Qibla Compass Direction Solver" subtitle="Calculate direction angle (bearing) towards the Kaaba" badge="ISLAMIC">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Latitude" value={latStr} onChange={setLatStr} id="qb-lat" />
          <RetroInput label="Longitude" value={lngStr} onChange={setLngStr} id="qb-lng" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Qibla Bearing (from North)" value={`${results.bearing.toFixed(1)}°`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
