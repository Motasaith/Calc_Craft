'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PregnancyWeightGainCalculator() {
  const [units, setUnits] = useState<'metric' | 'us'>('metric')
  const [preWeight, setPreWeight] = useState('65')
  const [currentWeight, setCurrentWeight] = useState('72')
  const [height, setHeight] = useState('165')
  const [feet, setFeet] = useState('5')
  const [inches, setInches] = useState('5')
  const [weeks, setWeeks] = useState('20')
  const [pregnancy, setPregnancy] = useState<'single' | 'twins'>('single')

  const result = useMemo(() => {
    const pre = units === 'metric' ? Number(preWeight) : Number(preWeight) * 0.45359237
    const current = units === 'metric' ? Number(currentWeight) : Number(currentWeight) * 0.45359237
    const cm = units === 'metric' ? Number(height) : (Number(feet) * 12 + Number(inches)) * 2.54
    const week = Number(weeks)
    if (pre <= 0 || current <= 0 || cm < 100 || cm > 230 || week < 1 || week > 42) return null
    const bmi = pre / Math.pow(cm / 100, 2)
    let category = 'Normal weight', total: [number, number] = [11.5, 16], weekly: [number, number] = [0.35, 0.5]
    if (bmi < 18.5) { category = 'Underweight'; total = [12.5, 18]; weekly = [0.44, 0.58] }
    else if (bmi >= 25 && bmi < 30) { category = 'Overweight'; total = [7, 11.5]; weekly = [0.23, 0.33] }
    else if (bmi >= 30) { category = 'Obesity range'; total = [5, 9]; weekly = [0.17, 0.27] }
    if (pregnancy === 'twins') {
      if (bmi < 18.5) total = [16.8, 24.5]
      else if (bmi < 25) total = [16.8, 24.5]
      else if (bmi < 30) total = [14.1, 22.7]
      else total = [11.4, 19.1]
      weekly = [(total[0] - 2) / 27, (total[1] - 2) / 27]
    }
    const firstTrimester = pregnancy === 'twins' ? 2.5 : 2
    const expected = week <= 13 ? [0.5, firstTrimester] : [firstTrimester + weekly[0] * (week - 13), firstTrimester + weekly[1] * (week - 13)]
    return { bmi, category, total, expected, actual: current - pre, week }
  }, [currentWeight, feet, height, inches, preWeight, pregnancy, units, weeks])

  const display = (kg: number) => units === 'metric' ? `${kg.toFixed(1)} kg` : `${(kg * 2.20462262).toFixed(1)} lb`
  const chart = useMemo(() => {
    if (!result) return null
    const left = 52, right = 480, top = 20, bottom = 142
    const minY = Math.min(0, Math.floor(result.actual / 5) * 5 - (result.actual < 0 ? 5 : 0))
    const maxY = Math.max(result.total[1], result.actual, 5) + 3
    const x = (week: number) => left + (week / 40) * (right - left)
    const y = (gain: number) => bottom - ((gain - minY) / (maxY - minY)) * (bottom - top)
    const firstMin = Math.min(0.5, result.expected[0])
    const firstMax = Math.min(2, result.expected[1])
    const lower = `${x(0)},${y(0)} ${x(13)},${y(firstMin)} ${x(40)},${y(result.total[0])}`
    const upper = `${x(40)},${y(result.total[1])} ${x(13)},${y(firstMax)} ${x(0)},${y(0)}`
    return { left, right, top, bottom, minY, maxY, x, y, band: `${lower} ${upper}` }
  }, [result])

  return (
    <FormCalculatorShell title="Pregnancy Weight Gain Calculator" subtitle="Pre-pregnancy BMI and gestational progress" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-200 p-1"><button onClick={() => setUnits('metric')} className={`rounded-lg py-2 text-xs font-bold ${units === 'metric' ? 'bg-white shadow' : 'text-neutral-500'}`}>Metric</button><button onClick={() => setUnits('us')} className={`rounded-lg py-2 text-xs font-bold ${units === 'us' ? 'bg-white shadow' : 'text-neutral-500'}`}>US units</button></div>
          <RetroSelect label="Pregnancy" value={pregnancy} onChange={(value) => setPregnancy(value as 'single' | 'twins')} id="pwg-type" options={[{ value: 'single', label: 'One baby' }, { value: 'twins', label: 'Twins' }]} />
          {units === 'metric' ? <RetroInput label="Height" value={height} onChange={setHeight} id="pwg-h" unit="cm" /> : <div className="grid grid-cols-2 gap-3"><RetroInput label="Height" value={feet} onChange={setFeet} id="pwg-ft" unit="ft" /><RetroInput label=" " value={inches} onChange={setInches} id="pwg-in" unit="in" /></div>}
          <div className="grid grid-cols-2 gap-3"><RetroInput label="Pre-Pregnancy Weight" value={preWeight} onChange={setPreWeight} id="pwg-pre" unit={units === 'metric' ? 'kg' : 'lb'} /><RetroInput label="Current Weight" value={currentWeight} onChange={setCurrentWeight} id="pwg-current" unit={units === 'metric' ? 'kg' : 'lb'} /></div>
          <RetroInput label="Current Pregnancy Week" value={weeks} onChange={setWeeks} id="pwg-week" unit="weeks" min={1} max={42} />
        </div>
        <div className="min-h-[430px]">
          {result ? <>
            <div className="grid grid-cols-2 gap-2">
              <ResultDisplay label="Pre-Pregnancy BMI" value={result.bmi.toFixed(1)} />
              <ResultDisplay label="BMI Category" value={result.category} />
              <ResultDisplay label="Recommended Total Gain" value={`${display(result.total[0])} – ${display(result.total[1])}`} large />
              <ResultDisplay label={`Recommended by Week ${result.week}`} value={`${display(result.expected[0])} – ${display(result.expected[1])}`} />
              <ResultDisplay label="Your Gain So Far" value={display(result.actual)} />
              <ResultDisplay label="Position Today" value={result.actual < result.expected[0] ? 'Below guideline range' : result.actual > result.expected[1] ? 'Above guideline range' : 'Within guideline range'} />
            </div>
            <div className="mt-4 rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-600">Gain progress at week {result.week}</p>
              {chart && <svg viewBox="0 0 500 180" className="mt-2 h-[180px] w-full" role="img" aria-label="Recommended pregnancy weight gain trajectory and current weight change">
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const value = chart.minY + (chart.maxY - chart.minY) * ratio
                  const lineY = chart.y(value)
                  return <g key={ratio}><line x1={chart.left} x2={chart.right} y1={lineY} y2={lineY} stroke="#d1d5db" strokeWidth="1" /><text x={chart.left - 7} y={lineY + 3} textAnchor="end" fontSize="8" fill="#5a5a62">{(units === 'metric' ? value : value * 2.20462262).toFixed(0)}</text></g>
                })}
                <line x1={chart.left} x2={chart.left} y1={chart.top} y2={chart.bottom} stroke="#9ca3af" />
                <line x1={chart.left} x2={chart.right} y1={chart.bottom} y2={chart.bottom} stroke="#9ca3af" />
                <polygon points={chart.band} fill="#78a98b" opacity="0.5" />
                <polyline points={`${chart.x(0)},${chart.y(0)} ${chart.x(13)},${chart.y(pregnancy === 'twins' ? 2.5 : 1.25)} ${chart.x(40)},${chart.y((result.total[0] + result.total[1]) / 2)}`} fill="none" stroke="#56866a" strokeWidth="2" strokeDasharray="5 4" />
                <line x1={chart.x(result.week)} x2={chart.x(result.week)} y1={chart.top} y2={chart.bottom} stroke="#1a1a1f" strokeDasharray="3 3" opacity="0.35" />
                <circle cx={chart.x(result.week)} cy={chart.y(result.actual)} r="8" fill="#1a1a1f" stroke="white" strokeWidth="3" style={{ transition: 'cx 450ms ease, cy 450ms ease' }} />
                <text x={chart.x(result.week)} y={Math.max(12, chart.y(result.actual) - 13)} textAnchor="middle" fontSize="9" fontWeight="700">{display(result.actual)}</text>
                {[0, 13, 20, 30, 40].map((week) => <text key={week} x={chart.x(week)} y="158" textAnchor="middle" fontSize="8" fill="#5a5a62">{week}</text>)}
                <text x="266" y="175" textAnchor="middle" fontSize="8" fill="#5a5a62">Pregnancy week</text>
                <text x="8" y="85" textAnchor="middle" fontSize="8" fill="#5a5a62" transform="rotate(-90 8 85)">Gain ({units === 'metric' ? 'kg' : 'lb'})</text>
              </svg>}
            </div>
            {(result.actual < -10 || result.actual > result.total[1] * 1.5) && (
              <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-[10px] font-semibold leading-5 text-amber-900">
                This weight change is far outside the planning chart’s usual range. Check that pre-pregnancy and current weights use the same unit, then discuss a confirmed large change with your prenatal clinician.
              </p>
            )}
            <p className="mt-3 text-[10px] leading-5 text-neutral-500">Weight gain is not perfectly linear. Use prenatal appointments—not a calculator alone—to evaluate fetal growth, fluid changes, nutrition, and maternal health.</p>
          </> : <div className="flex min-h-[430px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500">Enter valid measurements and a pregnancy week.</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
