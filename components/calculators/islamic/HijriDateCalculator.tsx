'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function HijriDateCalculator() {
  const [mode, setMode] = useState<'greg-to-hijri' | 'hijri-to-greg'>('greg-to-hijri')
  const [date, setDate] = useState('')
  const [result, setResult] = useState('')

  const calculate = () => {
    if (!date) { setResult(''); return }
    if (mode === 'greg-to-hijri') {
      const d = new Date(date)
      if (isNaN(d.getTime())) { setResult('Invalid'); return }
      const jd = Math.floor((d.getTime() / 86400000) + 2440587.5)
      const hijriDay = Math.floor((jd - 1948440 + 10632) % 354)
      const hijriYear = Math.floor((10632 + hijriDay) / 354)
      const hijriMonth = Math.floor((hijriDay - 29 * hijriYear) / 29.5)
      const day = hijriDay - Math.floor(hijriMonth * 29.5)
      const months = ['Muharram','Safar','Rabi al-awwal','Rabi al-thani','Jumada al-awwal','Jumada al-thani','Rajab','Shaban','Ramadan','Shawwal','Dhu al-Qadah','Dhu al-Hijjah']
      setResult(`${day} ${months[hijriMonth] || 'Unknown'} ${hijriYear} AH`)
    } else {
      setResult('Hijri to Gregorian requires API. Use aladhan.com for precise conversion.')
    }
  }

  return (
    <FormCalculatorShell title="Hijri Date Converter" badge="ISLAMIC">
      <RetroSelect label="Direction" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'greg-to-hijri',label:'Gregorian → Hijri'},{value:'hijri-to-greg',label:'Hijri → Gregorian'}]} id="hij-mode" />
      <RetroInput label={mode === 'greg-to-hijri' ? 'Gregorian Date' : 'Hijri Date'} value={date} onChange={setDate} type={mode==='greg-to-hijri'?'date':'text'} id="hij-date" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
