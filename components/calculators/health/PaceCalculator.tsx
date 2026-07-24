'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

type Mode = 'pace' | 'time' | 'distance'
type DistanceUnit = 'km' | 'mi' | 'm' | 'yd'
const toKm: Record<DistanceUnit, number> = { km: 1, mi: 1.609344, m: 0.001, yd: 0.0009144 }
const formatClock = (seconds: number) => {
  const rounded = Math.max(0, Math.round(seconds))
  const h = Math.floor(rounded / 3600), m = Math.floor((rounded % 3600) / 60), s = rounded % 60
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}

export default function PaceCalculator() {
  const [mode, setMode] = useState<Mode>('pace')
  const [distance, setDistance] = useState('5')
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('km')
  const [hours, setHours] = useState('0')
  const [minutes, setMinutes] = useState('25')
  const [seconds, setSeconds] = useState('0')
  const [paceMin, setPaceMin] = useState('5')
  const [paceSec, setPaceSec] = useState('0')
  const [paceUnit, setPaceUnit] = useState<'km' | 'mi'>('km')
  const [race, setRace] = useState('custom')
  const [convertPace, setConvertPace] = useState('5:00')
  const [convertFrom, setConvertFrom] = useState<'km' | 'mi'>('km')
  const [partialDistance, setPartialDistance] = useState('5')
  const [fullDistance, setFullDistance] = useState('10')
  const [partialMinutes, setPartialMinutes] = useState('25')
  const [laps, setLaps] = useState([{ d: '1', t: '5:00' }, { d: '2', t: '10:10' }, { d: '3', t: '15:25' }])

  const setRacePreset = (value: string) => {
    setRace(value)
    const presets: Record<string, [string, DistanceUnit]> = { '5k': ['5', 'km'], '10k': ['10', 'km'], half: ['21.0975', 'km'], marathon: ['42.195', 'km'], mile: ['1', 'mi'] }
    if (presets[value]) { setDistance(presets[value][0]); setDistanceUnit(presets[value][1]) }
  }

  const result = useMemo(() => {
    const distanceKm = Number(distance) * toKm[distanceUnit]
    const timeSec = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
    const inputPaceSecKm = (Number(paceMin) * 60 + Number(paceSec)) / (paceUnit === 'mi' ? 1.609344 : 1)
    let km = distanceKm, total = timeSec, paceKm = inputPaceSecKm
    if (mode === 'pace') {
      if (km <= 0 || total <= 0) return null
      paceKm = total / km
    } else if (mode === 'time') {
      if (km <= 0 || paceKm <= 0) return null
      total = paceKm * km
    } else {
      if (total <= 0 || paceKm <= 0) return null
      km = total / paceKm
    }
    if (![km, total, paceKm].every(Number.isFinite) || km <= 0 || total <= 0 || paceKm <= 0) return null
    const paceMile = paceKm * 1.609344
    const speedKph = 3600 / paceKm
    const splitUnitKm = paceUnit === 'mi' ? 1.609344 : 1
    const count = Math.min(20, Math.floor(km / splitUnitKm))
    const splits = Array.from({ length: count }, (_, index) => ({ n: index + 1, time: paceKm * splitUnitKm * (index + 1) }))
    return { km, total, paceKm, paceMile, speedKph, splits }
  }, [distance, distanceUnit, hours, minutes, mode, paceMin, paceSec, paceUnit, seconds])

  const outputDistance = result ? result.km / toKm[distanceUnit] : 0
  const marker = result ? Math.min(98, Math.max(2, ((result.speedKph - 3) / 22) * 100)) : 50
  const convertedPace = useMemo(() => {
    const [m, s = '0'] = convertPace.split(':')
    const seconds = Number(m) * 60 + Number(s)
    if (!Number.isFinite(seconds) || seconds <= 0) return null
    return formatClock(convertFrom === 'km' ? seconds * 1.609344 : seconds / 1.609344)
  }, [convertFrom, convertPace])
  const projectedFinish = useMemo(() => {
    const partial = Number(partialDistance), full = Number(fullDistance), seconds = Number(partialMinutes) * 60
    if (partial <= 0 || full < partial || seconds <= 0) return null
    return formatClock(seconds * full / partial)
  }, [fullDistance, partialDistance, partialMinutes])
  const lapResults = useMemo(() => laps.map((lap, index) => {
    const distanceNow = Number(lap.d)
    const [m, s = '0'] = lap.t.split(':')
    const timeNow = Number(m) * 60 + Number(s)
    if (distanceNow <= 0 || timeNow <= 0) return null
    const prevD = index ? Number(laps[index - 1].d) : 0
    const prevParts = index ? laps[index - 1].t.split(':') : ['0', '0']
    const prevT = Number(prevParts[0]) * 60 + Number(prevParts[1] || 0)
    if (distanceNow <= prevD || timeNow <= prevT) return null
    return formatClock((timeNow - prevT) / (distanceNow - prevD))
  }), [laps])

  return (
    <FormCalculatorShell title="Pace Calculator" subtitle="Running, walking, and cycling pace, time, or distance" badge="FITNESS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
        <div className="space-y-3">
          <RetroSelect label="Calculate" value={mode} onChange={(value) => setMode(value as Mode)} id="pace-mode" options={[{ value: 'pace', label: 'Pace from distance and time' }, { value: 'time', label: 'Finish time from distance and pace' }, { value: 'distance', label: 'Distance from time and pace' }]} />
          <RetroSelect label="Common Race" value={race} onChange={setRacePreset} id="pace-race" options={[{ value: 'custom', label: 'Custom distance' }, { value: 'mile', label: '1 mile' }, { value: '5k', label: '5K' }, { value: '10k', label: '10K' }, { value: 'half', label: 'Half marathon' }, { value: 'marathon', label: 'Marathon' }]} />
          {mode !== 'distance' && <div className="grid grid-cols-[1fr_120px] gap-2"><RetroInput label="Distance" value={distance} onChange={setDistance} id="pace-dist" /><RetroSelect label="Unit" value={distanceUnit} onChange={(value) => setDistanceUnit(value as DistanceUnit)} id="pace-dist-unit" options={[{ value: 'km', label: 'Kilometres' }, { value: 'mi', label: 'Miles' }, { value: 'm', label: 'Metres' }, { value: 'yd', label: 'Yards' }]} /></div>}
          {mode !== 'time' && <div className="grid grid-cols-3 gap-2"><RetroInput label="Hours" value={hours} onChange={setHours} id="pace-h" /><RetroInput label="Minutes" value={minutes} onChange={setMinutes} id="pace-m" min={0} max={59} /><RetroInput label="Seconds" value={seconds} onChange={setSeconds} id="pace-s" min={0} max={59} /></div>}
          {mode !== 'pace' && <><div className="grid grid-cols-2 gap-2"><RetroInput label="Pace Minutes" value={paceMin} onChange={setPaceMin} id="pace-pm" /><RetroInput label="Pace Seconds" value={paceSec} onChange={setPaceSec} id="pace-ps" min={0} max={59} /></div><RetroSelect label="Pace Unit" value={paceUnit} onChange={(value) => setPaceUnit(value as 'km' | 'mi')} id="pace-unit" options={[{ value: 'km', label: 'Per kilometre' }, { value: 'mi', label: 'Per mile' }]} /></>}
          {mode === 'distance' && <RetroSelect label="Output Distance Unit" value={distanceUnit} onChange={(value) => setDistanceUnit(value as DistanceUnit)} id="pace-output-unit" options={[{ value: 'km', label: 'Kilometres' }, { value: 'mi', label: 'Miles' }, { value: 'm', label: 'Metres' }, { value: 'yd', label: 'Yards' }]} />}
          <details className="rounded-xl border border-neutral-300 bg-white/45 p-3">
            <summary className="cursor-pointer text-xs font-extrabold text-neutral-700">Pace converter</summary>
            <div className="mt-3 grid grid-cols-2 gap-2"><RetroInput label={`Pace per ${convertFrom}`} value={convertPace} onChange={setConvertPace} type="text" id="pace-convert" /><RetroSelect label="Convert From" value={convertFrom} onChange={(v) => setConvertFrom(v as 'km' | 'mi')} id="pace-convert-unit" options={[{ value: 'km', label: 'Per kilometre' }, { value: 'mi', label: 'Per mile' }]} /></div>
            {convertedPace && <p className="rounded-lg bg-[#cbd8ca]/60 p-2 text-center text-sm font-bold">{convertedPace} per {convertFrom === 'km' ? 'mile' : 'kilometre'}</p>}
          </details>
          <details className="rounded-xl border border-neutral-300 bg-white/45 p-3">
            <summary className="cursor-pointer text-xs font-extrabold text-neutral-700">Partial-race finish predictor</summary>
            <div className="mt-3 grid grid-cols-3 gap-2"><RetroInput label="Covered" value={partialDistance} onChange={setPartialDistance} id="pace-partial" /><RetroInput label="Full Distance" value={fullDistance} onChange={setFullDistance} id="pace-full" /><RetroInput label="Elapsed Min" value={partialMinutes} onChange={setPartialMinutes} id="pace-elapsed" /></div>
            {projectedFinish && <p className="rounded-lg bg-[#cbd8ca]/60 p-2 text-center text-sm font-bold">Projected finish: {projectedFinish}</p>}
          </details>
        </div>

        <div className="min-h-[430px]">
          {result ? <>
            <div className="grid grid-cols-2 gap-2">
              <ResultDisplay label="Pace per Kilometre" value={formatClock(result.paceKm)} large />
              <ResultDisplay label="Pace per Mile" value={formatClock(result.paceMile)} />
              <ResultDisplay label="Finish Time" value={formatClock(result.total)} />
              <ResultDisplay label="Distance" value={`${outputDistance.toFixed(outputDistance < 10 ? 2 : 1)} ${distanceUnit}`} />
              <ResultDisplay label="Average Speed" value={`${result.speedKph.toFixed(2)} km/h`} />
              <ResultDisplay label="Speed in MPH" value={`${(result.speedKph / 1.609344).toFixed(2)} mph`} />
            </div>
            <div className="mt-4 rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-600">Calculated speed</p>
              <svg viewBox="0 0 500 82" className="h-[82px] w-full" role="img" aria-label="Calculated speed on a walking to running scale">
                <defs><linearGradient id="paceScale"><stop stopColor="#8ab4a0" /><stop offset=".55" stopColor="#dfaa44" /><stop offset="1" stopColor="#c4685d" /></linearGradient></defs>
                <rect x="12" y="32" width="476" height="14" rx="7" fill="url(#paceScale)" />
                <circle cx={12 + marker * 4.76} cy="39" r="9" fill="#1a1a1f" stroke="white" strokeWidth="3" style={{ transition: 'cx 450ms ease' }} />
                <text x={12 + marker * 4.76} y="18" textAnchor="middle" fontSize="9" fontWeight="700">{result.speedKph.toFixed(1)} km/h</text>
                <text x="12" y="68" fontSize="9">Walk</text><text x="250" y="68" textAnchor="middle" fontSize="9">Run</text><text x="488" y="68" textAnchor="end" fontSize="9">Fast</text>
              </svg>
            </div>
            {result.splits.length > 0 && <div className="mt-3 max-h-44 overflow-y-auto rounded-xl border border-neutral-300 bg-white/60">{result.splits.map((split) => <div key={split.n} className="flex justify-between border-b border-neutral-200 px-3 py-2 text-xs last:border-0"><span>{split.n} {paceUnit}</span><b className="font-mono">{formatClock(split.time)}</b></div>)}</div>}
            <details className="mt-3 rounded-xl border border-neutral-300 bg-white/60 p-3">
              <summary className="cursor-pointer text-xs font-extrabold">Multipoint pace calculator</summary>
              <div className="mt-3 space-y-2">{laps.map((lap, index) => <div key={index} className="grid grid-cols-[1fr_1fr_80px] items-end gap-2"><RetroInput label={`Point ${index + 1} distance`} value={lap.d} onChange={(v) => setLaps((items) => items.map((item, i) => i === index ? { ...item, d: v } : item))} id={`lap-d-${index}`} /><RetroInput label="Elapsed m:ss" value={lap.t} onChange={(v) => setLaps((items) => items.map((item, i) => i === index ? { ...item, t: v } : item))} type="text" id={`lap-t-${index}`} /><span className="mb-3 rounded-lg bg-neutral-100 px-2 py-3 text-center text-xs font-bold">{lapResults[index] ?? '—'}</span></div>)}</div>
            </details>
          </> : <div className="flex min-h-[430px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500">Enter valid positive distance, time, or pace values.</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
