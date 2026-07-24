'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

type Kind = 'carb' | 'fat' | 'fiber'
const activityOptions = [
  { value: '1.2', label: 'Sedentary — little exercise' }, { value: '1.375', label: 'Light — 1–3 days/week' },
  { value: '1.55', label: 'Moderate — 3–5 days/week' }, { value: '1.725', label: 'Very active — 6–7 days/week' },
  { value: '1.9', label: 'Extra active — physical job/training' },
]

export default function NutritionIntakeCalculator({ kind }: { kind: Kind }) {
  const [units, setUnits] = useState<'metric' | 'us' | 'other'>('metric')
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('30')
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('175')
  const [feet, setFeet] = useState('5')
  const [inches, setInches] = useState('9')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb' | 'st'>('kg')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'm' | 'in'>('cm')
  const [activity, setActivity] = useState('1.55')
  const [goal, setGoal] = useState('0')
  const [formula, setFormula] = useState<'mifflin' | 'katch'>('mifflin')
  const [bodyFat, setBodyFat] = useState('20')

  const result = useMemo(() => {
    const a = Number(age)
    const w = Number(weight) * (units === 'us' ? 0.45359237 : units === 'other' ? (weightUnit === 'kg' ? 1 : weightUnit === 'lb' ? 0.45359237 : 6.35029318) : 1)
    const h = units === 'metric' ? Number(height) : units === 'us' ? (Number(feet) * 12 + Number(inches)) * 2.54 : Number(height) * (heightUnit === 'cm' ? 1 : heightUnit === 'm' ? 100 : 2.54)
    if (a < 18 || a > 100 || w <= 0 || h < 100 || h > 250) return null
    const bf = Number(bodyFat)
    if (formula === 'katch' && (bf <= 2 || bf >= 70)) return null
    const bmr = formula === 'katch'
      ? 370 + 21.6 * w * (1 - bf / 100)
      : 10 * w + 6.25 * h - 5 * a + (sex === 'male' ? 5 : -161)
    const calories = Math.max(1200, bmr * Number(activity) + Number(goal))
    if (kind === 'carb') return { calories, min: calories * .4 / 4, target: calories * .55 / 4, max: calories * .65 / 4, secondary: calories * .1 / 4, secondaryLabel: 'Added sugar upper guide' }
    if (kind === 'fat') return { calories, min: calories * .2 / 9, target: calories * .3 / 9, max: calories * .35 / 9, secondary: calories * .1 / 9, secondaryLabel: 'Saturated fat upper guide' }
    const target = calories / 1000 * 14
    return { calories, min: target * .9, target, max: target * 1.1, secondary: sex === 'male' ? (a <= 50 ? 38 : 30) : (a <= 50 ? 25 : 21), secondaryLabel: 'Age/sex reference intake' }
  }, [activity, age, bodyFat, feet, formula, goal, height, heightUnit, inches, kind, sex, units, weight, weightUnit])

  const config = kind === 'carb'
    ? { title: 'Carbohydrate Calculator', subtitle: 'Daily carbohydrate range and energy targets', unit: 'g/day', color: '#dfaa44', max: 600 }
    : kind === 'fat'
      ? { title: 'Fat Intake Calculator', subtitle: 'Total and saturated fat planning ranges', unit: 'g/day', color: '#9c7c52', max: 180 }
      : { title: 'Fiber Intake Calculator', subtitle: 'Daily fiber target from energy needs', unit: 'g/day', color: '#6f9478', max: 70 }
  const chartX = (value: number) => 35 + Math.min(1, Math.max(0, value / config.max)) * 430

  return (
    <FormCalculatorShell title={config.title} subtitle={config.subtitle} badge="NUTRITION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-neutral-200 p-1"><button onClick={() => setUnits('metric')} className={`rounded-lg py-2 text-xs font-bold ${units === 'metric' ? 'bg-white shadow' : 'text-neutral-500'}`}>Metric</button><button onClick={() => setUnits('us')} className={`rounded-lg py-2 text-xs font-bold ${units === 'us' ? 'bg-white shadow' : 'text-neutral-500'}`}>US units</button><button onClick={() => setUnits('other')} className={`rounded-lg py-2 text-xs font-bold ${units === 'other' ? 'bg-white shadow' : 'text-neutral-500'}`}>Other</button></div>
          <div className="grid grid-cols-2 gap-3"><RetroSelect label="Sex" value={sex} onChange={(v) => setSex(v as 'male' | 'female')} id={`${kind}-sex`} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} /><RetroInput label="Age" value={age} onChange={setAge} id={`${kind}-age`} unit="years" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>{units === 'other' ? <div className="grid grid-cols-[1fr_82px] gap-1"><RetroInput label="Weight" value={weight} onChange={setWeight} id={`${kind}-weight`} /><RetroSelect label="Unit" value={weightUnit} onChange={(v) => setWeightUnit(v as 'kg' | 'lb' | 'st')} id={`${kind}-wu`} options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }, { value: 'st', label: 'stone' }]} /></div> : <RetroInput label="Weight" value={weight} onChange={setWeight} id={`${kind}-weight`} unit={units === 'metric' ? 'kg' : 'lb'} />}</div>
            {units === 'metric' ? <RetroInput label="Height" value={height} onChange={setHeight} id={`${kind}-height`} unit="cm" /> : units === 'us' ? <div className="grid grid-cols-2 gap-2"><RetroInput label="Height" value={feet} onChange={setFeet} id={`${kind}-ft`} unit="ft" /><RetroInput label=" " value={inches} onChange={setInches} id={`${kind}-in`} unit="in" /></div> : <div className="grid grid-cols-[1fr_82px] gap-1"><RetroInput label="Height" value={height} onChange={setHeight} id={`${kind}-height-other`} /><RetroSelect label="Unit" value={heightUnit} onChange={(v) => setHeightUnit(v as 'cm' | 'm' | 'in')} id={`${kind}-hu`} options={[{ value: 'cm', label: 'cm' }, { value: 'm', label: 'm' }, { value: 'in', label: 'inches' }]} /></div>}
          </div>
          <RetroSelect label="Activity" value={activity} onChange={setActivity} id={`${kind}-activity`} options={activityOptions} />
          <RetroSelect label="Weight Goal" value={goal} onChange={setGoal} id={`${kind}-goal`} options={[{ value: '-500', label: 'Weight loss (−500 kcal/day)' }, { value: '-250', label: 'Mild loss (−250 kcal/day)' }, { value: '0', label: 'Maintain weight' }, { value: '250', label: 'Mild gain (+250 kcal/day)' }, { value: '500', label: 'Weight gain (+500 kcal/day)' }]} />
          {kind !== 'fiber' && <details className="rounded-xl border border-neutral-300 bg-white/45 p-3">
            <summary className="cursor-pointer text-xs font-extrabold text-neutral-700">Calculation settings</summary>
            <div className="mt-3 space-y-3">
              <RetroSelect label="BMR Formula" value={formula} onChange={(value) => setFormula(value as 'mifflin' | 'katch')} id={`${kind}-formula`} options={[{ value: 'mifflin', label: 'Mifflin–St Jeor' }, { value: 'katch', label: 'Katch–McArdle' }]} />
              {formula === 'katch' && <RetroInput label="Body Fat Percentage" value={bodyFat} onChange={setBodyFat} id={`${kind}-body-fat`} unit="%" min={3} max={69} />}
            </div>
          </details>}
        </div>
        <div className="min-h-[420px]">
          {result ? <>
            <div className="grid grid-cols-2 gap-2">
              <ResultDisplay label="Daily Energy Estimate" value={Math.round(result.calories).toLocaleString()} unit="kcal/day" />
              <ResultDisplay label="Suggested Target" value={result.target.toFixed(0)} unit={config.unit} large />
              <ResultDisplay label="Suggested Range" value={`${result.min.toFixed(0)}–${result.max.toFixed(0)}`} unit={config.unit} />
              <ResultDisplay label={result.secondaryLabel} value={result.secondary.toFixed(0)} unit={config.unit} />
            </div>
            <div className="mt-4 rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-600">Calculated daily range</p>
              <svg viewBox="0 0 500 115" className="h-[115px] w-full" role="img" aria-label={`Calculated ${kind} intake range`}>
                <line x1="35" x2="465" y1="66" y2="66" stroke="#d1d5db" strokeWidth="14" strokeLinecap="round" />
                <line x1={chartX(result.min)} x2={chartX(result.max)} y1="66" y2="66" stroke={config.color} strokeWidth="20" strokeLinecap="round" opacity=".65" />
                <circle cx={chartX(result.target)} cy="66" r="11" fill="#1a1a1f" stroke="white" strokeWidth="3" style={{ transition: 'cx 450ms ease' }} />
                <text x={chartX(result.target)} y="34" textAnchor="middle" fontSize="13" fontWeight="700" style={{ transition: 'x 450ms ease' }}>{result.target.toFixed(0)} g/day</text>
                <text x={chartX(result.min)} y="99" textAnchor="middle" fontSize="9">{result.min.toFixed(0)} g</text><text x={chartX(result.max)} y="99" textAnchor="middle" fontSize="9">{result.max.toFixed(0)} g</text>
              </svg>
            </div>
            {kind !== 'fiber' && <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-300 bg-white/70">
              <table className="w-full min-w-[520px] text-[10px]">
                <thead><tr className="bg-neutral-100 text-neutral-600"><th className="p-2 text-left">Goal</th><th className="p-2 text-right">Calories</th>{(kind === 'carb' ? [40, 55, 65, 75] : [20, 25, 30, 35]).map((pct) => <th key={pct} className="p-2 text-right">{pct}%</th>)}</tr></thead>
                <tbody>{[
                  ['Lose 0.5 kg/week', -500], ['Mild loss', -250], ['Maintain', 0], ['Mild gain', 250], ['Gain 0.5 kg/week', 500],
                ].map(([label, adjustment]) => {
                  const calories = Math.max(1200, result.calories - Number(goal) + Number(adjustment))
                  const divisor = kind === 'carb' ? 4 : 9
                  return <tr key={String(label)} className="border-t border-neutral-200"><td className="p-2 font-semibold">{label}</td><td className="p-2 text-right">{Math.round(calories)}</td>{(kind === 'carb' ? [40, 55, 65, 75] : [20, 25, 30, 35]).map((pct) => <td key={pct} className="p-2 text-right font-mono">{Math.round(calories * pct / 100 / divisor)}g</td>)}</tr>
                })}</tbody>
              </table>
            </div>}
            <p className="mt-3 text-[10px] leading-5 text-neutral-500">{kind === 'fiber' ? 'Increase fiber gradually and drink adequate fluid to reduce gastrointestinal discomfort.' : 'Food quality and overall dietary pattern matter alongside the calculated gram range.'}</p>
          </> : <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500">Enter valid adult measurements.</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
