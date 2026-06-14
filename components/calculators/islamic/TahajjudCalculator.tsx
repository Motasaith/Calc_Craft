'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function TahajjudCalculator() {
  const [maghrib, setMaghrib] = useState('19:30')
  const [fajr, setFajr] = useState('05:00')
  const [result, setResult] = useState('')

  const calculate = () => {
    const [mh, mm] = maghrib.split(':').map(Number)
    const [fh, fm] = fajr.split(':').map(Number)
    if (isNaN(mh)||isNaN(mm)||isNaN(fh)||isNaN(fm)) { setResult('Invalid'); return }
    let maghribMin = mh * 60 + mm
    let fajrMin = fh * 60 + fm
    if (fajrMin < maghribMin) fajrMin += 24 * 60
    const nightLength = fajrMin - maghribMin
    const lastThirdStart = maghribMin + (nightLength * 2 / 3)
    const h = Math.floor(lastThirdStart / 60) % 24
    const m = Math.floor(lastThirdStart % 60)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
    setResult(`${displayH}:${m.toString().padStart(2,'0')} ${ampm}`)
  }

  return (
    <FormCalculatorShell title="Tahajjud Calculator" badge="ISLAMIC">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Maghrib Time" value={maghrib} onChange={setMaghrib} type="time" id="tah-mag" />
        <RetroInput label="Fajr Time" value={fajr} onChange={setFajr} type="time" id="tah-faj" />
      </div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Best Time</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Last Third of Night Starts" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
