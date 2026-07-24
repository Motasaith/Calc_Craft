'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

type UnitSystem = 'metric' | 'us'
type Formula = 'mifflin' | 'harris' | 'katch'

const activityFactors = [
  { value: '1.2', label: 'Sedentary — little or no exercise' },
  { value: '1.375', label: 'Light — exercise 1–3 days/week' },
  { value: '1.465', label: 'Moderate — exercise 4–5 days/week' },
  { value: '1.55', label: 'Active — daily exercise or 3–4 intense days/week' },
  { value: '1.725', label: 'Very active — intense exercise 6–7 days/week' },
  { value: '1.9', label: 'Extra active — physical job or athlete training' },
]

export default function CalorieCalculator() {
  const [units, setUnits] = useState<UnitSystem>('metric')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('30')
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('175')
  const [feet, setFeet] = useState('5')
  const [inches, setInches] = useState('9')
  const [activity, setActivity] = useState('1.465')
  const [formula, setFormula] = useState<Formula>('mifflin')
  const [bodyFat, setBodyFat] = useState('20')
  const [energyUnit, setEnergyUnit] = useState<'cal' | 'kj'>('cal')

  const result = useMemo(() => {
    const a = Number(age)
    const rawWeight = Number(weight)
    const h = units === 'metric' ? Number(height) : (Number(feet) * 12 + Number(inches)) * 2.54
    const w = units === 'metric' ? rawWeight : rawWeight * 0.45359237
    const bf = Number(bodyFat)
    if (!Number.isFinite(a) || !Number.isFinite(w) || !Number.isFinite(h) || a < 15 || a > 100 || w <= 0 || h <= 0) return null

    let bmr: number
    if (formula === 'katch') {
      if (!Number.isFinite(bf) || bf <= 0 || bf >= 70) return null
      bmr = 370 + 21.6 * w * (1 - bf / 100)
    } else if (formula === 'harris') {
      bmr = gender === 'male'
        ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
        : 447.593 + 9.247 * w + 3.098 * h - 4.33 * a
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a + (gender === 'male' ? 5 : -161)
    }
    const maintenance = bmr * Number(activity)
    const convert = (value: number) => energyUnit === 'kj' ? value * 4.184 : value
    return { bmr: convert(bmr), maintenance: convert(maintenance) }
  }, [activity, age, bodyFat, energyUnit, feet, formula, gender, height, inches, units, weight])

  const unitLabel = energyUnit === 'kj' ? 'kJ/day' : 'cal/day'
  const delta = energyUnit === 'kj' ? 500 * 4.184 : 500
  const chartMin = energyUnit === 'kj' ? 4200 : 1000
  const chartMax = energyUnit === 'kj' ? 16750 : 4000
  const maintenancePosition = result
    ? Math.min(98, Math.max(2, ((result.maintenance - chartMin) / (chartMax - chartMin)) * 100))
    : 50

  return (
    <FormCalculatorShell title="Calorie Calculator" subtitle="Daily energy needs and weight-goal estimates" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
      <div className="space-y-3">
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-neutral-200 p-1">
        {(['metric', 'us'] as UnitSystem[]).map((unit) => (
          <button key={unit} onClick={() => setUnits(unit)} className={`rounded-lg py-2 text-xs font-bold uppercase transition ${units === unit ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500'}`}>
            {unit === 'metric' ? 'Metric units' : 'US units'}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <RetroSelect label="Gender" value={gender} onChange={(v) => setGender(v as 'male' | 'female')} id="cal-g" options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
        <RetroInput label="Age" value={age} onChange={setAge} placeholder="30" id="cal-a" unit="years" />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <RetroInput label="Weight" value={weight} onChange={setWeight} placeholder={units === 'metric' ? '70' : '154'} id="cal-w" unit={units === 'metric' ? 'kg' : 'lb'} />
        {units === 'metric' ? (
          <RetroInput label="Height" value={height} onChange={setHeight} placeholder="175" id="cal-h" unit="cm" />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Height" value={feet} onChange={setFeet} placeholder="5" id="cal-ft" unit="ft" />
            <RetroInput label=" " value={inches} onChange={setInches} placeholder="9" id="cal-in" unit="in" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <RetroSelect label="Activity Level" value={activity} onChange={setActivity} id="cal-act" options={activityFactors} />
      </div>

      <details className="mt-4 rounded-xl border border-neutral-300 bg-white/45 p-3">
        <summary className="cursor-pointer text-xs font-extrabold text-neutral-700">Calculation settings</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <RetroSelect label="BMR Formula" value={formula} onChange={(v) => setFormula(v as Formula)} id="cal-formula" options={[
            { value: 'mifflin', label: 'Mifflin–St Jeor' },
            { value: 'harris', label: 'Revised Harris–Benedict' },
            { value: 'katch', label: 'Katch–McArdle' },
          ]} />
          <RetroSelect label="Results Unit" value={energyUnit} onChange={(v) => setEnergyUnit(v as 'cal' | 'kj')} id="cal-energy" options={[{ value: 'cal', label: 'Calories' }, { value: 'kj', label: 'Kilojoules' }]} />
          {formula === 'katch' && <RetroInput label="Body Fat" value={bodyFat} onChange={setBodyFat} placeholder="20" id="cal-bf" unit="%" />}
        </div>
      </details>
      </div>

      <div className="min-h-[420px]">
      {result ? (
        <div>
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Basal Metabolic Rate" value={Math.round(result.bmr).toLocaleString()} unit={unitLabel} />
            <ResultDisplay label="Maintain Weight" value={Math.round(result.maintenance).toLocaleString()} unit={unitLabel} large />
          </div>

          <div className="mt-3 overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
            {[
              { label: 'Mild weight loss', detail: '0.25 kg / 0.5 lb per week', value: result.maintenance - delta / 2 },
              { label: 'Weight loss', detail: '0.5 kg / 1 lb per week', value: result.maintenance - delta },
              { label: 'Mild weight gain', detail: '0.25 kg / 0.5 lb per week', value: result.maintenance + delta / 2 },
              { label: 'Weight gain', detail: '0.5 kg / 1 lb per week', value: result.maintenance + delta },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between border-b border-neutral-200 px-3 py-2.5 last:border-0">
                <div><p className="text-xs font-bold text-neutral-800">{row.label}</p><p className="text-[9px] text-neutral-500">{row.detail}</p></div>
                <span className="font-mono text-sm font-extrabold text-[#4c5c4a]">{Math.max(0, Math.round(row.value)).toLocaleString()} <small>{energyUnit === 'kj' ? 'kJ' : 'cal'}</small></span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-3">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600">Daily energy range</p>
            <svg viewBox="0 0 500 64" className="h-16 w-full" role="img" aria-label="Calorie target range from weight loss to weight gain">
              <defs><linearGradient id="calorieRange" x1="0" x2="1"><stop stopColor="#6b8e78" /><stop offset=".5" stopColor="#dfaa44" /><stop offset="1" stopColor="#b5655c" /></linearGradient></defs>
              <rect x="12" y="22" width="476" height="14" rx="7" fill="url(#calorieRange)" />
              <circle cx={12 + maintenancePosition * 4.76} cy="29" r="10" fill="#1a1a1f" stroke="white" strokeWidth="3" style={{ transition: 'cx 450ms cubic-bezier(.2,.8,.2,1)' }} />
              <text x="12" y="56" fontSize="10" fill="#5a5a62">{Math.round(chartMin).toLocaleString()}</text>
              <text x={12 + maintenancePosition * 4.76} y="14" textAnchor="middle" fontSize="10" fill="#1a1a1f" fontWeight="700" style={{ transition: 'x 450ms cubic-bezier(.2,.8,.2,1)' }}>{Math.round(result.maintenance).toLocaleString()}</text>
              <text x="488" y="56" textAnchor="end" fontSize="10" fill="#5a5a62">{Math.round(chartMax).toLocaleString()}+</text>
            </svg>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-neutral-500">Estimates are planning guides, not medical prescriptions. Avoid aggressive calorie deficits without professional guidance.</p>
        </div>
      ) : <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500">Enter valid details to see your energy plan.</div>}
      </div>
      </div>
    </FormCalculatorShell>
  )
}
