'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { Info, AlertTriangle } from 'lucide-react'

type UnitSystem = 'metric' | 'us' | 'other'

const FORMULAS = [
  { value: 'mosteller', label: 'Mosteller (Standard)' },
  { value: 'du-bois', label: 'Du Bois' },
  { value: 'haycock', label: 'Haycock' },
  { value: 'gehan', label: 'Gehan & George' },
  { value: 'boyd', label: 'Boyd' },
  { value: 'fujimoto', label: 'Fujimoto' },
  { value: 'takahira', label: 'Takahira' },
  { value: 'schlich', label: 'Schlich' },
]

export default function BodySurfaceAreaCalculator() {
  const [units, setUnits] = useState<UnitSystem>('metric')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('30')
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('175')
  const [feet, setFeet] = useState('5')
  const [inches, setInches] = useState('9')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb' | 'st'>('kg')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'm' | 'in'>('cm')
  const [formula, setFormula] = useState('mosteller')

  // Smoothly convert values when the user switches unit systems to avoid re-interpreting numbers
  const handleUnitChange = (newUnits: UnitSystem) => {
    let wKg = 0
    let hCm = 0

    const wVal = parseFloat(weight) || 0
    const hVal = parseFloat(height) || 0
    const ftVal = parseFloat(feet) || 0
    const inVal = parseFloat(inches) || 0

    if (units === 'metric') {
      wKg = wVal
      hCm = hVal
    } else if (units === 'us') {
      wKg = wVal * 0.45359237
      hCm = (ftVal * 12 + inVal) * 2.54
    } else {
      wKg = wVal * (weightUnit === 'kg' ? 1 : weightUnit === 'lb' ? 0.45359237 : 6.35029318)
      hCm = hVal * (heightUnit === 'cm' ? 1 : heightUnit === 'm' ? 100 : 2.54)
    }

    if (wKg <= 0) wKg = 70
    if (hCm <= 0) hCm = 175

    if (newUnits === 'metric') {
      setWeight(Math.round(wKg).toString())
      setHeight(Math.round(hCm).toString())
    } else if (newUnits === 'us') {
      const totalInches = hCm / 2.54
      const ft = Math.floor(totalInches / 12)
      const inch = Math.round(totalInches % 12)
      setFeet(ft.toString())
      setInches(inch.toString())
      setWeight(Math.round(wKg / 0.45359237).toString())
    } else {
      setWeight(Math.round(wKg).toString())
      setHeight(Math.round(hCm).toString())
      setWeightUnit('kg')
      setHeightUnit('cm')
    }
    setUnits(newUnits)
  }

  const results = useMemo(() => {
    const a = parseFloat(age)
    const rawWeight = parseFloat(weight)
    const rawHeight = parseFloat(height)
    const ft = parseFloat(feet)
    const inch = parseFloat(inches)

    if (isNaN(a) || a < 0 || a > 125) return null

    let w = 0 // in kg
    let h = 0 // in cm

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

    if (isNaN(w) || isNaN(h) || w <= 0.5 || w > 600 || h <= 20 || h > 300) return null

    // 1. Mosteller
    const mosteller = Math.sqrt((w * h) / 3600)

    // 2. Du Bois
    const duBois = 0.007184 * Math.pow(w, 0.425) * Math.pow(h, 0.725)

    // 3. Haycock
    const haycock = 0.024265 * Math.pow(w, 0.5378) * Math.pow(h, 0.3964)

    // 4. Gehan & George
    const gehan = 0.0235 * Math.pow(w, 0.51456) * Math.pow(h, 0.42246)

    // 5. Boyd (uses grams for weight)
    const wGrams = w * 1000
    const boydExponent = 0.7285 - 0.0188 * Math.log10(wGrams)
    const boyd = 0.0003207 * Math.pow(h, 0.3) * Math.pow(wGrams, boydExponent)

    // 6. Fujimoto
    const fujimoto = 0.008883 * Math.pow(w, 0.444) * Math.pow(h, 0.663)

    // 7. Takahira
    const takahira = 0.007241 * Math.pow(w, 0.425) * Math.pow(h, 0.725)

    // 8. Schlich
    const schlich = gender === 'female'
      ? 0.000975482 * Math.pow(w, 0.46) * Math.pow(h, 1.08)
      : 0.000579479 * Math.pow(w, 0.38) * Math.pow(h, 1.24)

    const values: Record<string, number> = {
      mosteller,
      'du-bois': duBois,
      haycock,
      gehan,
      boyd,
      fujimoto,
      takahira,
      schlich,
    }

    const primaryVal = values[formula] || mosteller

    return {
      primaryVal,
      list: [
        { name: 'Mosteller', value: mosteller },
        { name: 'Du Bois', value: duBois },
        { name: 'Haycock', value: haycock },
        { name: 'Gehan & George', value: gehan },
        { name: 'Boyd', value: boyd },
        { name: 'Fujimoto', value: fujimoto },
        { name: 'Takahira', value: takahira },
        { name: 'Schlich', value: schlich },
      ],
      warnings: {
        extremeWeight: w > 250 || w < 5,
        extremeHeight: h > 240 || h < 45,
      }
    }
  }, [age, weight, height, feet, inches, weightUnit, heightUnit, units, gender, formula])

  // Scale interactive SVG range: Newborn 0.25 to Extreme Adult 2.8
  const minChart = 0.2
  const maxChart = 2.8
  const primaryBsa = results ? results.primaryVal : 0.0
  const markerPct = results
    ? Math.min(97, Math.max(3, ((primaryBsa - minChart) / (maxChart - minChart)) * 100))
    : 0

  return (
    <FormCalculatorShell title="Body Surface Area Calculator" subtitle="Estimate human body surface area with clinical equations" badge="CLINICAL">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        
        {/* ── Left column: inputs ── */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-neutral-200 p-1">
            {(['metric', 'us', 'other'] as UnitSystem[]).map((u) => (
              <button
                key={u}
                onClick={() => handleUnitChange(u)}
                className={`rounded-lg py-1.5 text-[10px] font-mono font-bold uppercase transition ${
                  units === u ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {u === 'metric' ? 'Metric' : u === 'us' ? 'US units' : 'Other'}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-lg border border-neutral-300 h-10 items-center">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 py-1 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                    gender === 'male'
                      ? 'bg-white text-neutral-950 shadow'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 py-1 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                    gender === 'female'
                      ? 'bg-white text-neutral-950 shadow'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>
            <RetroInput label="Age" value={age} onChange={setAge} placeholder="30" id="bsa-age" unit="years" min={0} max={125} />
          </div>

          <div className="mt-1 grid gap-3 sm:grid-cols-2">
            {units === 'other' ? (
              <div className="grid grid-cols-[1fr_82px] gap-1">
                <RetroInput label="Weight" value={weight} onChange={setWeight} id="bsa-w" />
                <RetroSelect
                  label="Unit"
                  value={weightUnit}
                  onChange={(v) => setWeightUnit(v as 'kg' | 'lb' | 'st')}
                  id="bsa-wu"
                  options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }, { value: 'st', label: 'st' }]}
                />
              </div>
            ) : (
              <RetroInput label="Weight" value={weight} onChange={setWeight} id="bsa-w" unit={units === 'metric' ? 'kg' : 'lb'} />
            )}

            {units === 'metric' ? (
              <RetroInput label="Height" value={height} onChange={setHeight} id="bsa-h" unit="cm" />
            ) : units === 'us' ? (
              <div className="grid grid-cols-2 gap-2">
                <RetroInput label="Height" value={feet} onChange={setFeet} id="bsa-ft" unit="ft" />
                <RetroInput label="&nbsp;" value={inches} onChange={setInches} id="bsa-in" unit="in" />
              </div>
            ) : (
              <div className="grid grid-cols-[1fr_82px] gap-1">
                <RetroInput label="Height" value={height} onChange={setHeight} id="bsa-h-other" />
                <RetroSelect
                  label="Unit"
                  value={heightUnit}
                  onChange={(v) => setHeightUnit(v as 'cm' | 'm' | 'in')}
                  id="bsa-hu"
                  options={[{ value: 'cm', label: 'cm' }, { value: 'm', label: 'm' }, { value: 'in', label: 'in' }]}
                />
              </div>
            )}
          </div>

          <RetroSelect
            label="Equation Formula"
            value={formula}
            onChange={setFormula}
            id="bsa-formula"
            options={FORMULAS}
          />
        </div>

        {/* ── Right column: results & visualizations ── */}
        <div className="min-h-[440px]">
          {results ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ResultDisplay
                  label={`BSA (${FORMULAS.find(f => f.value === formula)?.label.split(' ')[0]})`}
                  value={results.primaryVal.toFixed(3)}
                  unit="m²"
                  large
                />
                <div className="bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-lg p-3 shadow-inner flex flex-col justify-center">
                  <div className="text-[9px] font-bold text-[#4c5c4a] font-mono uppercase tracking-wider mb-1">
                    Index Category Reference
                  </div>
                  <div className="font-mono font-extrabold text-[#1a2019] text-sm">
                    {results.primaryVal < 0.3 ? 'Newborn/Infant' : results.primaryVal < 1.3 ? 'Pediatric' : results.primaryVal < 1.75 ? 'Adult Female Avg' : results.primaryVal < 2.1 ? 'Adult Male Avg' : 'Above Average'}
                  </div>
                </div>
              </div>

              {/* Warnings for unrealistic sizing */}
              {(results.warnings.extremeWeight || results.warnings.extremeHeight) && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-[10px] text-amber-700 leading-normal font-mono">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                  <div>
                    <strong>Caution:</strong> Sizing falls near outer biological thresholds. BSA formulas are less validated at extremes of height/weight.
                  </div>
                </div>
              )}

              {/* Reactive SVG Area Chart */}
              <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-3">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600">BSA Position on Human Scale</p>
                <svg viewBox="0 0 500 70" className="h-16 w-full" role="img" aria-label={`Body surface area of ${results.primaryVal.toFixed(3)} m² shown on a clinical range from newborn to adult.`}>
                  <defs>
                    <linearGradient id="bsaRange" x1="0" x2="1">
                      <stop offset="0%" stopColor="#a3bca9" />
                      <stop offset="25%" stopColor="#82bfa0" />
                      <stop offset="55%" stopColor="#dfba58" />
                      <stop offset="85%" stopColor="#c57467" />
                      <stop offset="100%" stopColor="#9c4a40" />
                    </linearGradient>
                  </defs>
                  <rect x="12" y="24" width="476" height="14" rx="7" fill="url(#bsaRange)" />
                  
                  {/* Vertical markers and labels */}
                  <line x1={12 + ((0.25 - minChart) / (maxChart - minChart)) * 476} y1="20" x2={12 + ((0.25 - minChart) / (maxChart - minChart)) * 476} y2="42" stroke="white" strokeWidth="1.5" />
                  <line x1={12 + ((1.07 - minChart) / (maxChart - minChart)) * 476} y1="20" x2={12 + ((1.07 - minChart) / (maxChart - minChart)) * 476} y2="42" stroke="white" strokeWidth="1.5" />
                  <line x1={12 + ((1.6 - minChart) / (maxChart - minChart)) * 476} y1="20" x2={12 + ((1.6 - minChart) / (maxChart - minChart)) * 476} y2="42" stroke="white" strokeWidth="1.5" />
                  <line x1={12 + ((1.9 - minChart) / (maxChart - minChart)) * 476} y1="20" x2={12 + ((1.9 - minChart) / (maxChart - minChart)) * 476} y2="42" stroke="white" strokeWidth="1.5" />

                  {/* Active Indicator Bubble */}
                  <circle
                    cx={12 + markerPct * 4.76}
                    cy="31"
                    r="9.5"
                    fill="#1a1a1f"
                    stroke="white"
                    strokeWidth="2.5"
                    style={{ transition: 'cx 450ms cubic-bezier(.2,.8,.2,1)' }}
                  />
                  
                  {/* Text labels */}
                  <text x="12" y="56" fontSize="9" fill="#5a5a62">Newborn (0.25)</text>
                  <text x={12 + ((1.07 - minChart) / (maxChart - minChart)) * 476} y="56" textAnchor="middle" fontSize="9" fill="#5a5a62">Child 9y (1.07)</text>
                  <text x={12 + ((1.6 - minChart) / (maxChart - minChart)) * 476} y="56" textAnchor="middle" fontSize="9" fill="#5a5a62">Avg ♀ (1.6)</text>
                  <text x="488" y="56" textAnchor="end" fontSize="9" fill="#5a5a62">Avg ♂ (1.9)</text>

                  {/* Active value floating text */}
                  <text
                    x={12 + markerPct * 4.76}
                    y="15"
                    textAnchor="middle"
                    fontSize="11"
                    fill="#1a1a1f"
                    fontWeight="800"
                    style={{ transition: 'x 450ms cubic-bezier(.2,.8,.2,1)' }}
                  >
                    {results.primaryVal.toFixed(2)}
                  </text>
                </svg>
              </div>

              {/* Comparative Results List of All Formulas */}
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                  Comparative Formula Outcomes
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 p-3">
                  {results.list.map((item) => {
                    const isSelected = item.name.toLowerCase().includes(formula.split('-')[0])
                    return (
                      <div
                        key={item.name}
                        className={`flex items-center justify-between border-b border-neutral-100 py-1.5 text-xs ${
                          isSelected ? 'font-bold bg-[#cbd8ca]/40 px-2 rounded' : 'px-2'
                        }`}
                      >
                        <span className="text-neutral-600 font-mono">{item.name}</span>
                        <span className={`font-mono ${isSelected ? 'text-[#3e4d3c] font-black' : 'text-neutral-800'}`}>
                          {item.value.toFixed(3)} <small className="text-[9px]">m²</small>
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-2 rounded-xl bg-neutral-100/70 p-3 text-[10px] text-neutral-500 leading-normal font-sans border border-neutral-200">
                <Info className="w-3.5 h-3.5 shrink-0 text-neutral-400 mt-0.5" />
                <p>
                  <strong>Clinical Note:</strong> BSA estimates body surface area in square meters. It is frequently preferred over weight for calculating precise metabolic indices and chemotherapy dosages. Ensure to cross-reference multiple formulas in critical dosing scenarios.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[440px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              Please enter valid positive measurements (height 20–300 cm, weight 0.5–600 kg) to compute Body Surface Area outcomes.
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
