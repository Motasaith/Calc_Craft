'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

const KAABA_LAT = 21.4225
const KAABA_LON = 39.8262

export default function QiblaCalculator() {
  const [lat, setLat] = useState('51.5074')
  const [lon, setLon] = useState('-0.1278')
  const [result, setResult] = useState('')

  const calculate = () => {
    const lat1 = parseFloat(lat) * Math.PI / 180
    const lon1 = parseFloat(lon) * Math.PI / 180
    const lat2 = KAABA_LAT * Math.PI / 180
    const lon2 = KAABA_LON * Math.PI / 180
    if (isNaN(lat1)||isNaN(lon1)) { setResult('Invalid'); return }
    const y = Math.sin(lon2 - lon1)
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(lon2 - lon1)
    let bearing = Math.atan2(y, x) * 180 / Math.PI
    bearing = (bearing + 360) % 360
    setResult(`${bearing.toFixed(2)}° from North`)
  }

  return (
    <FormCalculatorShell title="Qibla Direction" badge="ISLAMIC">
      <RetroInput label="Your Latitude" value={lat} onChange={setLat} placeholder="51.5074" id="qib-lat" />
      <RetroInput label="Your Longitude" value={lon} onChange={setLon} placeholder="-0.1278" id="qib-lon" />
      <div className="text-[10px] text-neutral-500 font-mono mt-2">Kaaba: {KAABA_LAT}°, {KAABA_LON}°</div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Qibla</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Qibla Direction" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
