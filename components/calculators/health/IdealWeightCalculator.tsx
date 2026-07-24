'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateIdealWeightAll } from '@/lib/calc-engine'

export default function IdealWeightCalculator() {
  const [units, setUnits] = useState<'metric' | 'us'>('metric')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('30')
  const [height, setHeight] = useState('175')
  const [feet, setFeet] = useState('5')
  const [inches, setInches] = useState('9')

  const result = useMemo(() => {
    const a = Number(age)
    const cm = units === 'metric' ? Number(height) : (Number(feet) * 12 + Number(inches)) * 2.54
    if (!Number.isFinite(a) || a < 2 || a > 80 || !Number.isFinite(cm) || cm < 100 || cm > 250) return null
    return calculateIdealWeightAll(gender, cm)
  }, [age, feet, gender, height, inches, units])

  const showWeight = (kg: number) => units === 'metric' ? `${kg.toFixed(1)} kg` : `${(kg * 2.20462262).toFixed(1)} lb`

  return (
    <FormCalculatorShell title="Ideal Weight Calculator" subtitle="Compare four established adult IBW formulas" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
      <div className="space-y-3">
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-neutral-200 p-1">
        <button onClick={() => setUnits('metric')} className={`rounded-lg py-2 text-xs font-bold ${units === 'metric' ? 'bg-white shadow' : 'text-neutral-500'}`}>Metric</button>
        <button onClick={() => setUnits('us')} className={`rounded-lg py-2 text-xs font-bold ${units === 'us' ? 'bg-white shadow' : 'text-neutral-500'}`}>US units</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <RetroSelect label="Gender" value={gender} onChange={(v) => setGender(v as 'male' | 'female')} id="iw-g" options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
        <RetroInput label="Age" value={age} onChange={setAge} placeholder="30" id="iw-age" unit="years" />
      </div>
      <div className="mt-3">
        {units === 'metric' ? (
          <RetroInput label="Height" value={height} onChange={setHeight} placeholder="175" id="iw-h" unit="cm" />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <RetroInput label="Height" value={feet} onChange={setFeet} placeholder="5" id="iw-ft" unit="ft" />
            <RetroInput label=" " value={inches} onChange={setInches} placeholder="9" id="iw-in" unit="in" />
          </div>
        )}
      </div>
      </div>

      <div className="min-h-[390px]">
      {result ? (
        <div>
          <div className="grid grid-cols-2 gap-2">
            <ResultDisplay label="Robinson (1983)" value={showWeight(result.robinson)} />
            <ResultDisplay label="Miller (1983)" value={showWeight(result.miller)} />
            <ResultDisplay label="Devine (1974)" value={showWeight(result.devine)} />
            <ResultDisplay label="Hamwi (1964)" value={showWeight(result.hamwi)} />
          </div>
          <div className="mt-3"><ResultDisplay label="Healthy BMI Weight Range" value={`${showWeight(result.bmiRange.min)} – ${showWeight(result.bmiRange.max)}`} large /></div>

          <div className="mt-4 rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-3">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600">Formula comparison</p>
            <div className="space-y-2">
              {[
                ['Robinson', result.robinson],
                ['Miller', result.miller],
                ['Devine', result.devine],
                ['Hamwi', result.hamwi],
              ].map(([label, value]) => {
                const kg = Number(value)
                const position = ((kg - result.bmiRange.min) / Math.max(1, result.bmiRange.max - result.bmiRange.min)) * 100
                return (
                  <div key={String(label)} className="grid grid-cols-[60px_1fr_64px] items-center gap-2 text-[9px]">
                    <span className="font-bold text-neutral-600">{label}</span>
                    <div className="relative h-2 rounded-full bg-neutral-200"><span className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#4c5c4a] ring-2 ring-white" style={{ left: `calc(${Math.min(96, Math.max(2, position))}% - 6px)` }} /></div>
                    <span className="text-right font-mono font-bold">{showWeight(kg)}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-neutral-500">Ideal-weight formulas were developed for clinical estimation and do not account for muscle mass, body composition, or frame size. Treat the results as references, not targets.</p>
        </div>
      ) : <div className="flex min-h-[390px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500">Enter valid details to compare formulas.</div>}
      </div>
      </div>
    </FormCalculatorShell>
  )
}
