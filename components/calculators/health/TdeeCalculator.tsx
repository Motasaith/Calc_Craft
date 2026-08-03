'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

type UnitSystem = 'metric' | 'us' | 'other'
type Formula = 'mifflin' | 'harris' | 'katch'

// Standard activity multipliers. Matches Calculator.net's six-level scale and
// the sibling CalorieCalculator so the two tools stay internally consistent.
const ACTIVITY_LEVELS = [
  { value: '1.2', label: 'Sedentary — little or no exercise' },
  { value: '1.375', label: 'Light — exercise 1–3 days/week' },
  { value: '1.465', label: 'Moderate — exercise 4–5 days/week' },
  { value: '1.55', label: 'Active — daily exercise or intense exercise 3–4 days/week' },
  { value: '1.725', label: 'Very active — intense exercise 6–7 days/week' },
  { value: '1.9', label: 'Extra active — very intense daily exercise or physical job' },
]

// Full comparison scale (includes BMR at 1.0 so users see raw energy expenditure).
const ALL_LEVELS = [{ value: '1.0', label: 'Basal Metabolic Rate' }, ...ACTIVITY_LEVELS]

export default function TdeeCalculator() {
  const [units, setUnits] = useState<UnitSystem>('metric')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('30')
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('175')
  const [feet, setFeet] = useState('5')
  const [inches, setInches] = useState('9')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb' | 'st'>('kg')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'm' | 'in'>('cm')
  const [activity, setActivity] = useState('1.465')
  const [formula, setFormula] = useState<Formula>('mifflin')
  const [bodyFat, setBodyFat] = useState('20')
  const [energyUnit, setEnergyUnit] = useState<'cal' | 'kj'>('cal')

  const result = useMemo(() => {
    const a = Number(age)
    const rawWeight = Number(weight)
    const rawHeight = Number(height)
    const ft = Number(feet)
    const inch = Number(inches)
    const bf = Number(bodyFat)

    // Normalise to canonical units: weight in kg, height in cm.
    let w: number
    let h: number
    if (units === 'metric') {
      w = rawWeight
      h = rawHeight
    } else if (units === 'us') {
      w = rawWeight * 0.45359237
      h = (ft * 12 + inch) * 2.54
    } else {
      w = rawWeight * (weightUnit === 'kg' ? 1 : weightUnit === 'lb' ? 0.45359237 : 6.35029318)
      h = rawHeight * (heightUnit === 'cm' ? 1 : heightUnit === 'm' ? 100 : 2.54)
    }

    if (!Number.isFinite(a) || !Number.isFinite(w) || !Number.isFinite(h)) return null
    if (a < 18 || a > 80 || w <= 0 || h < 50 || h > 300) return null

    let bmr: number
    if (formula === 'katch') {
      if (!Number.isFinite(bf) || bf <= 2 || bf >= 70) return null
      bmr = 370 + 21.6 * w * (1 - bf / 100)
    } else if (formula === 'harris') {
      bmr = gender === 'male'
        ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
        : 447.593 + 9.247 * w + 3.098 * h - 4.33 * a
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a + (gender === 'male' ? 5 : -161)
    }

    const factor = Number(activity)
    const tdeeRaw = bmr * factor
    const toOutput = (v: number) => energyUnit === 'kj' ? v * 4.184 : v
    return {
      bmr: toOutput(bmr),
      tdee: toOutput(tdeeRaw),
      all: ALL_LEVELS.map((lvl) => ({ ...lvl, factor: lvl.value, kcal: toOutput(bmr * Number(lvl.value)) })),
    }
  }, [activity, age, bodyFat, energyUnit, feet, formula, gender, height, heightUnit, inches, units, weight, weightUnit])

  const unitLabel = energyUnit === 'kj' ? 'kJ/day' : 'cal/day'
  const unitShort = energyUnit === 'kj' ? 'kJ' : 'cal'
  // Daily delta used for weight goal rows (~0.5 kg / 1 lb per week).
  const delta = energyUnit === 'kj' ? 500 * 4.184 : 500

  // Marker position across the BMR→Extra-active range.
  const lowest = result ? result.all[0].kcal : 0
  const highest = result ? result.all[result.all.length - 1].kcal : 1
  const markerPct = result
    ? Math.min(96, Math.max(4, ((result.tdee - lowest) / Math.max(1, highest - lowest)) * 100))
    : 50

  return (
    <FormCalculatorShell title="TDEE Calculator" subtitle="Total Daily Energy Expenditure across activity levels" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
        {/* ── Left column: inputs ── */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-neutral-200 p-1">
            {(['metric', 'us', 'other'] as UnitSystem[]).map((u) => (
              <button
                key={u}
                onClick={() => setUnits(u)}
                className={`rounded-lg py-2 text-xs font-bold uppercase transition ${units === u ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500'}`}
              >
                {u === 'metric' ? 'Metric' : u === 'us' ? 'US units' : 'Other'}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <RetroSelect
              label="Gender"
              value={gender}
              onChange={(v) => setGender(v as 'male' | 'female')}
              id="tdee-gender"
              options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
            />
            <RetroInput label="Age" value={age} onChange={setAge} placeholder="30" id="tdee-age" unit="years" min={18} max={80} />
          </div>

          <div className="mt-1 grid gap-3 sm:grid-cols-2">
            {units === 'other' ? (
              <div className="grid grid-cols-[1fr_82px] gap-1">
                <RetroInput label="Weight" value={weight} onChange={setWeight} id="tdee-w" />
                <RetroSelect
                  label="Unit"
                  value={weightUnit}
                  onChange={(v) => setWeightUnit(v as 'kg' | 'lb' | 'st')}
                  id="tdee-wu"
                  options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }, { value: 'st', label: 'stone' }]}
                />
              </div>
            ) : (
              <RetroInput label="Weight" value={weight} onChange={setWeight} id="tdee-w" unit={units === 'metric' ? 'kg' : 'lb'} />
            )}

            {units === 'metric' ? (
              <RetroInput label="Height" value={height} onChange={setHeight} id="tdee-h" unit="cm" />
            ) : units === 'us' ? (
              <div className="grid grid-cols-2 gap-2">
                <RetroInput label="Height" value={feet} onChange={setFeet} id="tdee-ft" unit="ft" />
                {/* Non-breaking label keeps the baseline aligned with the feet field. */}
                <RetroInput label="&nbsp;" value={inches} onChange={setInches} id="tdee-in" unit="in" />
              </div>
            ) : (
              <div className="grid grid-cols-[1fr_82px] gap-1">
                <RetroInput label="Height" value={height} onChange={setHeight} id="tdee-h-other" />
                <RetroSelect
                  label="Unit"
                  value={heightUnit}
                  onChange={(v) => setHeightUnit(v as 'cm' | 'm' | 'in')}
                  id="tdee-hu"
                  options={[{ value: 'cm', label: 'cm' }, { value: 'm', label: 'm' }, { value: 'in', label: 'inches' }]}
                />
              </div>
            )}
          </div>

          <RetroSelect label="Activity Level" value={activity} onChange={setActivity} id="tdee-act" options={ACTIVITY_LEVELS} />

          <details className="rounded-xl border border-neutral-300 bg-white/45 p-3">
            <summary className="cursor-pointer text-xs font-extrabold text-neutral-700">Calculation settings</summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <RetroSelect
                label="BMR Formula"
                value={formula}
                onChange={(v) => setFormula(v as Formula)}
                id="tdee-formula"
                options={[
                  { value: 'mifflin', label: 'Mifflin–St Jeor' },
                  { value: 'harris', label: 'Revised Harris–Benedict' },
                  { value: 'katch', label: 'Katch–McArdle' },
                ]}
              />
              <RetroSelect
                label="Results Unit"
                value={energyUnit}
                onChange={(v) => setEnergyUnit(v as 'cal' | 'kj')}
                id="tdee-energy"
                options={[{ value: 'cal', label: 'Calories' }, { value: 'kj', label: 'Kilojoules' }]}
              />
              {formula === 'katch' && (
                <RetroInput label="Body Fat" value={bodyFat} onChange={setBodyFat} placeholder="20" id="tdee-bf" unit="%" min={3} max={69} />
              )}
            </div>
          </details>
        </div>

        {/* ── Right column: results ── */}
        <div className="min-h-[440px]">
          {result ? (
            <div>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="TDEE (maintenance)" value={Math.round(result.tdee).toLocaleString()} unit={unitLabel} large />
                <ResultDisplay label="Basal Metabolic Rate" value={Math.round(result.bmr).toLocaleString()} unit={unitLabel} />
              </div>

              {/* Activity-level comparison — the defining feature of a TDEE tool. */}
              <div className="mt-4 overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600">
                  Energy expenditure by activity level
                </p>
                {result.all.map((lvl) => {
                  // Highlight the row matching the user's selected activity level (never the BMR row).
                  const isSelected = lvl.value !== '1.0' && Number(lvl.value) === Number(activity)
                  return (
                    <div
                      key={lvl.value}
                      className={`flex items-center justify-between border-b border-neutral-100 px-3 py-2 last:border-0 ${isSelected ? 'bg-[#cbd8ca]/40' : ''}`}
                    >
                      <span className="text-xs text-neutral-600">{lvl.label}</span>
                      <span className={`font-mono text-sm ${isSelected ? 'font-extrabold text-[#4c5c4a]' : 'font-bold text-neutral-800'}`}>
                        {Math.round(lvl.kcal).toLocaleString()} <small>{unitShort}</small>
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Weight-goal rows. */}
              <div className="mt-3 overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                {[
                  { label: 'Mild weight loss', detail: '0.25 kg / 0.5 lb per week', value: result.tdee - delta / 2 },
                  { label: 'Weight loss', detail: '0.5 kg / 1 lb per week', value: result.tdee - delta },
                  { label: 'Mild weight gain', detail: '0.25 kg / 0.5 lb per week', value: result.tdee + delta / 2 },
                  { label: 'Weight gain', detail: '0.5 kg / 1 lb per week', value: result.tdee + delta },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between border-b border-neutral-200 px-3 py-2.5 last:border-0">
                    <div>
                      <p className="text-xs font-bold text-neutral-800">{row.label}</p>
                      <p className="text-[9px] text-neutral-500">{row.detail}</p>
                    </div>
                    <span className="font-mono text-sm font-extrabold text-[#4c5c4a]">
                      {Math.max(0, Math.round(row.value)).toLocaleString()} <small>{unitShort}</small>
                    </span>
                  </div>
                ))}
              </div>

              {/* Reactive SVG: position across the activity range. */}
              <div className="mt-4 rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-3">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600">Your TDEE across the activity range</p>
                <svg viewBox="0 0 500 64" className="h-16 w-full" role="img" aria-label={`Total daily energy expenditure of ${Math.round(result.tdee)} ${unitShort} positioned between basal metabolic rate and extra active expenditure`}>
                  <defs>
                    <linearGradient id="tdeeRange" x1="0" x2="1">
                      <stop stopColor="#8ab4a0" />
                      <stop offset=".5" stopColor="#dfaa44" />
                      <stop offset="1" stopColor="#b5655c" />
                    </linearGradient>
                  </defs>
                  <rect x="12" y="22" width="476" height="14" rx="7" fill="url(#tdeeRange)" />
                  <circle cx={12 + markerPct * 4.76} cy="29" r="10" fill="#1a1a1f" stroke="white" strokeWidth="3" style={{ transition: 'cx 450ms cubic-bezier(.2,.8,.2,1)' }} />
                  <text x="12" y="56" fontSize="10" fill="#5a5a62">BMR {Math.round(lowest).toLocaleString()}</text>
                  <text x={12 + markerPct * 4.76} y="14" textAnchor="middle" fontSize="10" fill="#1a1a1f" fontWeight="700" style={{ transition: 'x 450ms cubic-bezier(.2,.8,.2,1)' }}>{Math.round(result.tdee).toLocaleString()}</text>
                  <text x="488" y="56" textAnchor="end" fontSize="10" fill="#5a5a62">{Math.round(highest).toLocaleString()}</text>
                </svg>
              </div>

              <p className="mt-3 text-[10px] leading-relaxed text-neutral-500">
                TDEE is an estimate of calories burned in a day. Activity multipliers are population averages, so real
                expenditure varies with body composition, fitness, sleep, and health status. Treat the figures as a
                planning guide, not a medical prescription.
              </p>
            </div>
          ) : (
            <div className="flex min-h-[440px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500">
              Enter valid details (age 18–80) to estimate your total daily energy expenditure.
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
