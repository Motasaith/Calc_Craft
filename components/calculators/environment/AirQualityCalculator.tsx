'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AirQualityCalculator() {
  const [pmStr, setPmStr] = useState('12.0') // PM2.5 concentration µg/m³

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, aqi: 0, status: '' }
    const pm = parseFloat(pmStr)
    if (isNaN(pm) || pm < 0) return { ...defaultObj, error: 'Please enter valid PM2.5 levels.' }
    
    // EPA AQI categories
    let aqi = 0
    let status = ''
    if (pm <= 12) {
      aqi = (50 / 12) * pm
      status = 'Good'
    } else if (pm <= 35.4) {
      aqi = ((100 - 51) / (35.4 - 12.1)) * (pm - 12.1) + 51
      status = 'Moderate'
    } else {
      aqi = 151
      status = 'Unhealthy'
    }
    return { error: null, aqi: Math.round(aqi), status }
  }, [pmStr])

  return (
    <FormCalculatorShell title="Air Quality AQI Solver" subtitle="Convert PM2.5 concentrations to standard EPA AQI values" badge="ENVIRONMENT">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="PM2.5 Level (µg/m³)" value={pmStr} onChange={setPmStr} id="aqi-pm" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="AQI Index" value={results.aqi.toString()} large />
              <ResultDisplay label="Status" value={results.status} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
