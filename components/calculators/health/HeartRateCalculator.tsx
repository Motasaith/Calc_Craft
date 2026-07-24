'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

type MaxFormula = 'fox' | 'tanaka' | 'nes' | 'tested'

const zones = [
  { name: 'Zone 1', range: [50, 60], desc: 'Warm-up and recovery', color: '#8ab4a0' },
  { name: 'Zone 2', range: [60, 70], desc: 'Endurance and easy aerobic work', color: '#6b9a7c' },
  { name: 'Zone 3', range: [70, 80], desc: 'Aerobic fitness and tempo', color: '#dfaa44' },
  { name: 'Zone 4', range: [80, 90], desc: 'Threshold and speed work', color: '#d47b50' },
  { name: 'Zone 5', range: [90, 100], desc: 'Short maximum efforts', color: '#b65752' },
]

export default function HeartRateCalculator() {
  const [age, setAge] = useState('30')
  const [resting, setResting] = useState('65')
  const [formula, setFormula] = useState<MaxFormula>('tanaka')
  const [testedMax, setTestedMax] = useState('190')
  const [method, setMethod] = useState<'karvonen' | 'percent'>('karvonen')

  const result = useMemo(() => {
    const a = Number(age)
    const rhr = Number(resting)
    const tested = Number(testedMax)
    if (!Number.isFinite(a) || a < 10 || a > 100 || !Number.isFinite(rhr) || rhr < 30 || rhr > 140) return null
    const max = formula === 'tested' ? tested : formula === 'fox' ? 220 - a : formula === 'nes' ? 211 - 0.64 * a : 208 - 0.7 * a
    if (!Number.isFinite(max) || max <= rhr || max > 230) return null
    const at = (pct: number) => Math.round(method === 'karvonen' ? (max - rhr) * pct / 100 + rhr : max * pct / 100)
    return { max: Math.round(max), reserve: Math.round(max - rhr), at }
  }, [age, formula, method, resting, testedMax])

  return (
    <FormCalculatorShell title="Target Heart Rate Calculator" subtitle="Personalized five-zone training ranges" badge="FITNESS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
      <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <RetroInput label="Age" value={age} onChange={setAge} placeholder="30" id="hr-age" unit="years" />
        <RetroInput label="Resting Heart Rate" value={resting} onChange={setResting} placeholder="65" id="hr-rest" unit="bpm" />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <RetroSelect label="Maximum HR Source" value={formula} onChange={(v) => setFormula(v as MaxFormula)} id="hr-formula" options={[
          { value: 'tanaka', label: 'Tanaka: 208 − 0.7 × age' },
          { value: 'fox', label: 'Haskell & Fox: 220 − age' },
          { value: 'nes', label: 'Nes: 211 − 0.64 × age' },
          { value: 'tested', label: 'Use tested maximum' },
        ]} />
        {formula === 'tested' ? <RetroInput label="Tested Maximum HR" value={testedMax} onChange={setTestedMax} placeholder="190" id="hr-tested" unit="bpm" /> : (
          <RetroSelect label="Zone Method" value={method} onChange={(v) => setMethod(v as 'karvonen' | 'percent')} id="hr-method" options={[{ value: 'karvonen', label: 'Karvonen (heart-rate reserve)' }, { value: 'percent', label: 'Percentage of maximum' }]} />
        )}
      </div>
      {formula === 'tested' && <div className="mt-3"><RetroSelect label="Zone Method" value={method} onChange={(v) => setMethod(v as 'karvonen' | 'percent')} id="hr-method-tested" options={[{ value: 'karvonen', label: 'Karvonen (heart-rate reserve)' }, { value: 'percent', label: 'Percentage of maximum' }]} /></div>}
      </div>

      <div className="min-h-[440px]">
      {result ? (
        <div>
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Maximum Heart Rate" value={String(result.max)} unit="bpm" large />
            <ResultDisplay label="Heart Rate Reserve" value={String(result.reserve)} unit="bpm" />
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-neutral-300">
            {zones.map((zone) => (
              <div key={zone.name} className="grid grid-cols-[8px_1fr_auto] items-center gap-3 border-b border-neutral-200 bg-white/60 px-3 py-2.5 last:border-0">
                <span className="h-8 rounded-full" style={{ backgroundColor: zone.color }} />
                <div><p className="text-xs font-extrabold text-neutral-800">{zone.name} · {zone.range[0]}–{zone.range[1]}%</p><p className="text-[9px] text-neutral-500">{zone.desc}</p></div>
                <span className="font-mono text-sm font-extrabold text-neutral-800">{result.at(zone.range[0])}–{result.at(zone.range[1])} <small>bpm</small></span>
              </div>
            ))}
          </div>
          <svg viewBox="0 0 500 62" className="mt-4 h-16 w-full" role="img" aria-label="Five calculated heart rate intensity zones">
            {zones.map((zone, index) => <rect key={zone.name} x={index * 100 + 2} y="8" width="96" height="22" rx="5" fill={zone.color} />)}
            {zones.map((zone, index) => <text key={`${zone.name}-pct`} x={index * 100 + 50} y="22" textAnchor="middle" fontSize="8" fill="white" fontWeight="700">{zone.range[0]}–{zone.range[1]}%</text>)}
            {zones.map((zone, index) => <text key={`${zone.name}-bpm`} x={index * 100 + 50} y="49" textAnchor="middle" fontSize="9" fill="#1a1a1f" fontWeight="700">{result.at(zone.range[0])}–{result.at(zone.range[1])}</text>)}
            <text x="250" y="60" textAnchor="middle" fontSize="8" fill="#5a5a62">calculated beats per minute</text>
          </svg>
          <p className="mt-2 text-[10px] leading-relaxed text-neutral-500">Estimated maximum heart rate varies widely between individuals. Use a clinically supervised exercise test when precision matters or if you have a cardiovascular condition.</p>
        </div>
      ) : <div className="flex min-h-[440px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500">Enter valid heart-rate details to calculate your zones.</div>}
      </div>
      </div>
    </FormCalculatorShell>
  )
}
