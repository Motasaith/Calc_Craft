'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

const ZONES = [
  {value:'UTC',label:'UTC (GMT)',offset:0},
  {value:'EST',label:'New York (EST)',offset:-5},
  {value:'CST',label:'Chicago (CST)',offset:-6},
  {value:'MST',label:'Denver (MST)',offset:-7},
  {value:'PST',label:'Los Angeles (PST)',offset:-8},
  {value:'GMT',label:'London (GMT)',offset:0},
  {value:'CET',label:'Paris (CET)',offset:1},
  {value:'EET',label:'Athens (EET)',offset:2},
  {value:'IST',label:'Mumbai (IST)',offset:5.5},
  {value:'CST_CN',label:'Beijing (CST)',offset:8},
  {value:'JST',label:'Tokyo (JST)',offset:9},
  {value:'AEST',label:'Sydney (AEST)',offset:10},
]

export default function TimeZoneCalculator() {
  const [time, setTime] = useState('12:00')
  const [fromZone, setFromZone] = useState('UTC')
  const [toZone, setToZone] = useState('IST')
  const [result, setResult] = useState('')

  const calculate = () => {
    if (!time) { setResult(''); return }
    const [h, m] = time.split(':').map(Number)
    if (isNaN(h)||isNaN(m)) { setResult('Invalid time'); return }
    const fromOffset = ZONES.find(z=>z.value===fromZone)?.offset || 0
    const toOffset = ZONES.find(z=>z.value===toZone)?.offset || 0
    const totalMin = h * 60 + m + (toOffset - fromOffset) * 60
    const newH = Math.floor(((totalMin % 1440) + 1440) % 1440 / 60)
    const newM = ((totalMin % 60) + 60) % 60
    const ampm = newH >= 12 ? 'PM' : 'AM'
    const displayH = newH === 0 ? 12 : newH > 12 ? newH - 12 : newH
    setResult(`${displayH}:${newM.toString().padStart(2,'0')} ${ampm}`)
  }

  return (
    <FormCalculatorShell title="Time Zone Converter" badge="DATE & TIME">
      <RetroInput label="Time" value={time} onChange={setTime} type="time" id="tz-time" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={fromZone} onChange={setFromZone} options={ZONES.map(z=>({value:z.value,label:z.label}))} id="tz-from" />
        <RetroSelect label="To" value={toZone} onChange={setToZone} options={ZONES.map(z=>({value:z.value,label:z.label}))} id="tz-to" />
      </div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Converted Time" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
