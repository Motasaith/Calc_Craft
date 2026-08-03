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

  const unitLabel = units === 'metric' ? 'kg' : 'lb'
  const toDisplay = (kg: number) => units === 'metric' ? kg : kg * 2.20462262
  const showWeight = (kg: number) => `${toDisplay(kg).toFixed(1)} ${unitLabel}`

  // Chart geometry. The four formulas disagree by several kilograms, and the
  // useful question is not what each one says in isolation but whether they
  // land inside the healthy BMI band — so both share one axis.
  const CHART = { w: 400, h: 132, padL: 58, padR: 54, top: 16, plotBottom: 96 }
  const plotW = CHART.w - CHART.padL - CHART.padR

  const scale = useMemo(() => {
    if (!result) return null
    const values = [result.robinson, result.miller, result.devine, result.hamwi]
    const lo = Math.min(...values, result.bmiRange.min)
    const hi = Math.max(...values, result.bmiRange.max)
    // A flat domain would divide by zero; pad proportionally, never by nothing.
    const pad = Math.max((hi - lo) * 0.15, 1)
    const dMin = lo - pad
    const dMax = hi + pad
    return { dMin, dMax, x: (kg: number) => CHART.padL + ((kg - dMin) / (dMax - dMin)) * plotW }
  }, [result, CHART.padL, plotW])

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

          {scale && (
            <div className="mt-4 rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-3">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600">Formula comparison</p>
              <svg
                viewBox={`0 0 ${CHART.w} ${CHART.h}`}
                className="w-full h-auto select-none font-mono"
                role="img"
                aria-label={`The four ideal-weight formulas plotted against the healthy BMI range of ${showWeight(result.bmiRange.min)} to ${showWeight(result.bmiRange.max)}. Robinson ${showWeight(result.robinson)}, Miller ${showWeight(result.miller)}, Devine ${showWeight(result.devine)}, Hamwi ${showWeight(result.hamwi)}.`}
              >
                {/* Healthy BMI band, drawn first so the markers sit on top of it */}
                <rect
                  x={scale.x(result.bmiRange.min)}
                  y={CHART.top}
                  width={Math.max(1, scale.x(result.bmiRange.max) - scale.x(result.bmiRange.min))}
                  height={CHART.plotBottom - CHART.top}
                  fill="#4c5c4a"
                  opacity="0.13"
                />
                <text x={(scale.x(result.bmiRange.min) + scale.x(result.bmiRange.max)) / 2} y={CHART.top - 5} textAnchor="middle" fontSize="7" fontWeight="bold" fill="#4c5c4a">
                  HEALTHY BMI RANGE
                </text>

                {([
                  ['Robinson', result.robinson],
                  ['Miller', result.miller],
                  ['Devine', result.devine],
                  ['Hamwi', result.hamwi],
                ] as [string, number][]).map(([label, kg], idx) => {
                  const y = CHART.top + 14 + idx * 19
                  const inRange = kg >= result.bmiRange.min && kg <= result.bmiRange.max
                  return (
                    <g key={label}>
                      <text x={CHART.padL - 8} y={y + 3} textAnchor="end" fontSize="8" fontWeight="bold" fill="#525252">{label}</text>
                      <line x1={CHART.padL} y1={y} x2={CHART.padL + plotW} y2={y} stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx={scale.x(kg)} cy={y} r="5.5" fill={inRange ? '#4c5c4a' : '#b45309'} stroke="#fff" strokeWidth="2" />
                      <text x={CHART.padL + plotW + 6} y={y + 3} fontSize="8" fontWeight="bold" fill="#262626">{toDisplay(kg).toFixed(1)}</text>
                    </g>
                  )
                })}

                {/* Weight axis */}
                <line x1={CHART.padL} y1={CHART.plotBottom + 4} x2={CHART.padL + plotW} y2={CHART.plotBottom + 4} stroke="#a3a3a3" strokeWidth="1" />
                {[0, 0.5, 1].map((frac) => {
                  const kg = scale.dMin + frac * (scale.dMax - scale.dMin)
                  const x = CHART.padL + frac * plotW
                  return (
                    <g key={frac}>
                      <line x1={x} y1={CHART.plotBottom + 4} x2={x} y2={CHART.plotBottom + 8} stroke="#a3a3a3" strokeWidth="1" />
                      <text x={x} y={CHART.plotBottom + 18} textAnchor="middle" fontSize="7" fill="#737373">{toDisplay(kg).toFixed(0)}</text>
                    </g>
                  )
                })}
                <text x={CHART.padL + plotW / 2} y={CHART.h - 2} textAnchor="middle" fontSize="7" fontWeight="bold" fill="#737373">
                  BODY WEIGHT ({unitLabel.toUpperCase()})
                </text>
              </svg>
              <p className="mt-1 text-[8px] font-mono uppercase tracking-wider text-neutral-500">
                Amber marker = formula result falls outside the healthy BMI range
              </p>
            </div>
          )}
          <p className="mt-3 text-[10px] leading-relaxed text-neutral-500">Ideal-weight formulas were developed for clinical estimation and do not account for muscle mass, body composition, or frame size. Treat the results as references, not targets.</p>
        </div>
      ) : <div className="flex min-h-[390px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500">Enter valid details to compare formulas.</div>}
      </div>
      </div>
    </FormCalculatorShell>
  )
}
