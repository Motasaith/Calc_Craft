'use client'

import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, RetroActionButton } from '../shared/FormCalculatorShell'
import ShareExportPanel from '../shared/ShareExportPanel'
import { AlertTriangle, ChevronDown, ChevronUp, Settings, Activity, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BmrCalculator() {
  // Common states
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('25')
  const [unitSystem, setUnitSystem] = useState<'us' | 'metric' | 'other'>('us')

  // US Units states
  const [feet, setFeet] = useState('5')
  const [inches, setInches] = useState('10')
  const [weightLbs, setWeightLbs] = useState('160')

  // Metric Units states
  const [heightCm, setHeightCm] = useState('180')
  const [weightKg, setWeightKg] = useState('60')

  // Other Units states
  const [heightValue, setHeightValue] = useState('180')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'm' | 'in' | 'ft'>('cm')
  const [weightValue, setWeightValue] = useState('60')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs' | 'st'>('kg')

  // Settings states
  const [showSettings, setShowSettings] = useState(false)
  const [resultsUnit, setResultsUnit] = useState<'calories' | 'kilojoules'>('calories')
  const [bmrFormula, setBmrFormula] = useState<'mifflin' | 'harris' | 'katch'>('mifflin')
  const [bodyFatPercent, setBodyFatPercent] = useState('20')

  // Results states
  const [hasCalculated, setHasCalculated] = useState(false)
  const [calculatedBmr, setCalculatedBmr] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [activeLevelHovered, setActiveLevelHovered] = useState<number | null>(null)

  // URL serialization states
  const [queryParams, setQueryParams] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('g', gender)
    params.set('a', age)
    params.set('u', unitSystem)
    params.set('f', bmrFormula)
    if (unitSystem === 'us') {
      params.set('w', weightLbs)
      params.set('ft', feet)
      params.set('in', inches)
    } else if (unitSystem === 'metric') {
      params.set('w', weightKg)
      params.set('h', heightCm)
    }
    setQueryParams(params.toString())
  }, [gender, age, unitSystem, bmrFormula, weightLbs, feet, inches, weightKg, heightCm])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const g = params.get('g')
      const a = params.get('a')
      const u = params.get('u')
      const f = params.get('f')
      const w = params.get('w')

      if (g === 'male' || g === 'female') setGender(g)
      if (a) setAge(a)
      if (u === 'us' || u === 'metric') setUnitSystem(u)
      if (f === 'mifflin' || f === 'harris' || f === 'katch') setBmrFormula(f)

      if (u === 'us') {
        if (w) setWeightLbs(w)
        const ft = params.get('ft')
        if (ft) setFeet(ft)
        const inch = params.get('in')
        if (inch) setInches(inch)
      } else if (u === 'metric') {
        if (w) setWeightKg(w)
        const h = params.get('h')
        if (h) setHeightCm(h)
      }
      if (w) {
        setHasCalculated(true)
      }
    }
  }, [])

  const clearAll = () => {
    setAge('25')
    setFeet('5')
    setInches('10')
    setWeightLbs('160')
    setHeightCm('180')
    setWeightKg('60')
    setHeightValue('180')
    setWeightValue('60')
    setBodyFatPercent('20')
    setHasCalculated(false)
    setCalculatedBmr(null)
    setErrorMsg('')
  }

  const calculate = () => {
    setErrorMsg('')
    const ageNum = parseInt(age)

    if (isNaN(ageNum) || ageNum <= 0) {
      setErrorMsg('Please enter a valid age.')
      return
    }

    let weight_kg = 0
    let height_cm = 0

    if (unitSystem === 'us') {
      const ftVal = parseFloat(feet)
      const inVal = parseFloat(inches)
      const lbsVal = parseFloat(weightLbs)

      if (isNaN(ftVal) || isNaN(inVal) || isNaN(lbsVal) || ftVal < 0 || inVal < 0 || lbsVal <= 0) {
        setErrorMsg('Please enter valid height and weight values.')
        return
      }
      weight_kg = lbsVal * 0.45359237
      height_cm = (ftVal * 12 + inVal) * 2.54
    } else if (unitSystem === 'metric') {
      const cmVal = parseFloat(heightCm)
      const kgVal = parseFloat(weightKg)

      if (isNaN(cmVal) || isNaN(kgVal) || cmVal <= 0 || kgVal <= 0) {
        setErrorMsg('Please enter valid height and weight values.')
        return
      }
      weight_kg = kgVal
      height_cm = cmVal
    } else {
      const hVal = parseFloat(heightValue)
      const wVal = parseFloat(weightValue)

      if (isNaN(hVal) || isNaN(wVal) || hVal <= 0 || wVal <= 0) {
        setErrorMsg('Please enter valid height and weight values.')
        return
      }

      // Height conversion to cm
      if (heightUnit === 'cm') height_cm = hVal
      else if (heightUnit === 'm') height_cm = hVal * 100
      else if (heightUnit === 'in') height_cm = hVal * 2.54
      else if (heightUnit === 'ft') height_cm = hVal * 30.48

      // Weight conversion to kg
      if (weightUnit === 'kg') weight_kg = wVal
      else if (weightUnit === 'lbs') weight_kg = wVal * 0.45359237
      else if (weightUnit === 'st') weight_kg = wVal * 6.35029318
    }

    let bmr = 0

    if (bmrFormula === 'mifflin') {
      const base = 10 * weight_kg + 6.25 * height_cm - 5 * ageNum
      bmr = gender === 'male' ? base + 5 : base - 161
    } else if (bmrFormula === 'harris') {
      if (gender === 'male') {
        bmr = 13.397 * weight_kg + 4.799 * height_cm - 5.677 * ageNum + 88.362
      } else {
        bmr = 9.247 * weight_kg + 3.098 * height_cm - 4.330 * ageNum + 447.593
      }
    } else {
      const bfVal = parseFloat(bodyFatPercent)
      if (isNaN(bfVal) || bfVal < 0 || bfVal > 100) {
        setErrorMsg('Please enter a valid body fat percentage between 0 and 100.')
        return
      }
      bmr = 370 + 21.6 * (1 - bfVal / 100) * weight_kg
    }

    setCalculatedBmr(bmr)
    setHasCalculated(true)
  }

  // TDEE Multipliers & Labels
  const activityLevels = [
    { name: 'Sedentary', multiplier: 1.2, desc: 'Little or no exercise' },
    { name: 'Lightly Active', multiplier: 1.375, desc: 'Exercise 1-3 times/week' },
    { name: 'Moderately Active', multiplier: 1.465, desc: 'Exercise 4-5 times/week' },
    { name: 'Active', multiplier: 1.55, desc: 'Daily exercise or intense exercise 3-4 times/week' },
    { name: 'Very Active', multiplier: 1.725, desc: 'Intense exercise 6-7 days/week' },
    { name: 'Super Active', multiplier: 1.9, desc: 'Very intense exercise daily, or physical job' },
  ]

  // Conversion factor
  const valMultiplier = resultsUnit === 'kilojoules' ? 4.184 : 1
  const labelText = resultsUnit === 'kilojoules' ? 'kJ/day' : 'kcal/day'

  return (
    <FormCalculatorShell title="BMR Calculator" subtitle="Basal Metabolic Rate Calculator" badge="HEALTH">
      <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="space-y-4 no-print">
          {/* Unit system tabs */}
          <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-xl border border-neutral-300">
            {(['us', 'metric', 'other'] as const).map((system) => (
              <button
                key={system}
                type="button"
                onClick={() => setUnitSystem(system)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono transition-all uppercase ${
                  unitSystem === system
                    ? 'bg-white text-dark-900 shadow-sm border border-neutral-300'
                    : 'text-neutral-500 hover:text-dark-700'
                }`}
              >
                {system === 'us' ? 'US Units' : system === 'metric' ? 'Metric' : 'Other'}
              </button>
            ))}
          </div>

          {/* Common fields (Gender & Age) */}
          <div className="grid grid-cols-2 gap-4">
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
                      ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
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
                      ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <RetroInput
              label="Age (Ages 15-80)"
              value={age}
              onChange={setAge}
              placeholder="25"
              id="bmr-age"
              type="number"
              min={1}
              max={120}
            />
          </div>

          {/* Tab content */}
          {unitSystem === 'us' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <RetroInput label="Height (Ft)" value={feet} onChange={setFeet} placeholder="5" id="bmr-h-ft" type="number" />
                <RetroInput label="Height (In)" value={inches} onChange={setInches} placeholder="10" id="bmr-h-in" type="number" />
                <RetroInput label="Weight (Lbs)" value={weightLbs} onChange={setWeightLbs} placeholder="160" id="bmr-w-lbs" type="number" />
              </div>
            </div>
          )}

          {unitSystem === 'metric' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <RetroInput label="Height (cm)" value={heightCm} onChange={setHeightCm} placeholder="180" id="bmr-h-cm" type="number" />
                <RetroInput label="Weight (kg)" value={weightKg} onChange={setWeightKg} placeholder="60" id="bmr-w-kg" type="number" />
              </div>
            </div>
          )}

          {unitSystem === 'other' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-4">
                <RetroInput
                  label="Height"
                  value={heightValue}
                  onChange={setHeightValue}
                  placeholder="180"
                  id="bmr-h-oth"
                  type="number"
                />
                <RetroSelect
                  label="Height Unit"
                  value={heightUnit}
                  onChange={(val) => setHeightUnit(val as any)}
                  options={[
                    { value: 'cm', label: 'Centimeters (cm)' },
                    { value: 'm', label: 'Meters (m)' },
                    { value: 'in', label: 'Inches (in)' },
                    { value: 'ft', label: 'Feet (ft)' }
                  ]}
                  id="bmr-h-unit"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <RetroInput
                  label="Weight"
                  value={weightValue}
                  onChange={setWeightValue}
                  placeholder="60"
                  id="bmr-w-oth"
                  type="number"
                />
                <RetroSelect
                  label="Weight Unit"
                  value={weightUnit}
                  onChange={(val) => setWeightUnit(val as any)}
                  options={[
                    { value: 'kg', label: 'Kilograms (kg)' },
                    { value: 'lbs', label: 'Pounds (lbs)' },
                    { value: 'st', label: 'Stones (st)' }
                  ]}
                  id="bmr-w-unit"
                />
              </div>
            </div>
          )}

          {/* Collapsible Settings Accordion */}
          <div className="border border-neutral-300 rounded-xl overflow-hidden bg-[#f3f1eb]">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-neutral-700 font-mono uppercase tracking-wider select-none hover:bg-neutral-300/40 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" /> BMR Estimation Settings
              </span>
              {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence initial={false}>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-neutral-300 bg-white"
                >
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider mb-2">
                        Results Unit
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setResultsUnit('calories')}
                          className={`flex-1 py-1.5 rounded-md border text-[11px] font-bold font-mono transition-all ${
                            resultsUnit === 'calories'
                              ? 'bg-neutral-800 text-white border-neutral-800 shadow-sm'
                              : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:text-neutral-700'
                          }`}
                        >
                          Calories
                        </button>
                        <button
                          type="button"
                          onClick={() => setResultsUnit('kilojoules')}
                          className={`flex-1 py-1.5 rounded-md border text-[11px] font-bold font-mono transition-all ${
                            resultsUnit === 'kilojoules'
                              ? 'bg-neutral-800 text-white border-neutral-800 shadow-sm'
                              : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:text-neutral-700'
                          }`}
                        >
                          Kilojoules
                        </button>
                      </div>
                    </div>

                    <div>
                      <RetroSelect
                        label="BMR Estimation Formula"
                        value={bmrFormula}
                        onChange={(v) => setBmrFormula(v as any)}
                        options={[
                          { value: 'mifflin', label: 'Mifflin St Jeor' },
                          { value: 'harris', label: 'Revised Harris-Benedict' },
                          { value: 'katch', label: 'Katch-McArdle' },
                        ]}
                        id="bmr-formula"
                      />
                    </div>

                    {bmrFormula === 'katch' && (
                      <RetroInput
                        label="Body Fat (%)"
                        value={bodyFatPercent}
                        onChange={setBodyFatPercent}
                        placeholder="20"
                        id="bmr-bf-percent"
                        type="number"
                        min={0}
                        max={100}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-[11px] text-red-600 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <RetroActionButton onClick={calculate} variant="primary" fullWidth>
              Calculate
            </RetroActionButton>
            <RetroActionButton onClick={clearAll} variant="secondary">
              Clear
            </RetroActionButton>
          </div>
        </div>

        {/* Right Column: Visual Gauge & Metrics Dashboard */}
        <div className="bg-[#eae7df]/50 border-2 border-[#dad6cd] rounded-xl p-4 sm:p-6 h-full flex flex-col justify-between min-h-[300px] print-target">
          {hasCalculated && calculatedBmr !== null ? (
            <div className="space-y-6">
              {/* Headline result */}
              <div className="p-5 sm:p-6 bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-xl shadow-inner text-center font-mono relative overflow-hidden">
                <div className="absolute right-2 top-2 text-[#4c5c4a]/30">
                  <Activity className="w-12 h-12 stroke-[1.5]" />
                </div>
                <div className="text-[10px] font-bold text-[#4c5c4a] uppercase tracking-widest mb-1.5">
                  Your Basal Metabolic Rate (BMR)
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#1a2019] tracking-tight">
                  {Math.round(calculatedBmr * valMultiplier).toLocaleString()}{' '}
                  <span className="text-lg font-bold text-[#4c5c4a]">{labelText}</span>
                </div>
                <p className="text-[10px] text-[#4c5c4a] mt-2 max-w-sm mx-auto font-sans leading-normal">
                  This represents the minimum energy required to sustain vital functions while resting completely for 24 hours.
                </p>
              </div>

              {/* Interactive SVG Multipliers bar chart */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-mono">
                    Daily Energy Need Breakdown (TDEE)
                  </h4>
                  {activeLevelHovered !== null && (
                    <span className="text-[10px] font-bold text-primary-600 font-mono animate-pulse">
                      {activityLevels[activeLevelHovered].multiplier}x Multiplier
                    </span>
                  )}
                </div>

                {/* Responsive SVG Container */}
                <div className="overflow-x-auto">
                  <svg viewBox="0 0 500 280" className="w-full h-auto min-w-[320px] font-mono text-[10px] select-none">
                    {/* Grid Lines */}
                    <line x1="10" y1="15" x2="10" y2="265" stroke="#e5e5e5" strokeWidth="1.5" />
                    <line x1="263" y1="15" x2="263" y2="265" stroke="#7f8c7d" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="490" y1="15" x2="490" y2="265" stroke="#e5e5e5" strokeWidth="1.5" />

                    {/* BMR Base Marker Text */}
                    <text x="263" y="11" fill="#4c5c4a" textAnchor="middle" className="text-[8px] font-bold uppercase tracking-wider">
                      BMR Base (1.0x)
                    </text>

                    {/* Render 6 Horizontal Bars */}
                    {activityLevels.map((lvl, index) => {
                      const maxMultiplier = 1.9
                      const startX = 10
                      const barWidth = (lvl.multiplier / maxMultiplier) * 480
                      const barY = 25 + index * 40
                      const isHovered = activeLevelHovered === index

                      // Multiplier-specific color gradients
                      const colors = [
                        { start: '#60a5fa', end: '#3b82f6' }, // Sedentary (Blue)
                        { start: '#34d399', end: '#10b981' }, // Lightly (Green)
                        { start: '#fbbf24', end: '#f59e0b' }, // Moderately (Yellow)
                        { start: '#fb923c', end: '#f97316' }, // Active (Orange)
                        { start: '#f87171', end: '#ef4444' }, // Very Active (Red)
                        { start: '#dc2626', end: '#b91c1c' }, // Super Active (Dark Red)
                      ]

                      const col = colors[index]

                      return (
                        <g
                          key={lvl.name}
                          onMouseEnter={() => setActiveLevelHovered(index)}
                          onMouseLeave={() => setActiveLevelHovered(null)}
                          className="cursor-pointer transition-all duration-200"
                          opacity={activeLevelHovered === null || isHovered ? 1 : 0.45}
                        >
                          {/* Background track bar */}
                          <rect
                            x={startX}
                            y={barY}
                            width={480}
                            height={28}
                            rx="6"
                            fill="#f5f4f0"
                            stroke={isHovered ? '#b5b2a9' : '#e5e3db'}
                            strokeWidth={isHovered ? 1.5 : 1}
                          />

                          {/* Gradient Fill Bar */}
                          <defs>
                            <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor={col.start} />
                              <stop offset="100%" stopColor={col.end} />
                            </linearGradient>
                          </defs>
                          <rect
                            x={startX}
                            y={barY}
                            width={barWidth}
                            height={28}
                            rx="6"
                            fill={`url(#grad-${index})`}
                          />

                          {/* Label text */}
                          <text
                            x={startX + 12}
                            y={barY + 17}
                            fill="#ffffff"
                            className="font-bold text-[9px] uppercase tracking-wide animate-fade-in"
                          >
                            {lvl.name}
                          </text>

                          {/* Calorie text inside the bar */}
                          <text
                            x={startX + barWidth - 12}
                            y={barY + 17}
                            fill="#ffffff"
                            textAnchor="end"
                            className="font-black text-[9px]"
                          >
                            {Math.round(calculatedBmr * lvl.multiplier * valMultiplier).toLocaleString()} {resultsUnit === 'kilojoules' ? 'kJ' : 'kcal'}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </div>

              {/* Calorie needs table */}
              <div className="overflow-x-auto border border-neutral-200 rounded-lg">
                <table className="w-full text-left border-collapse text-xs font-mono bg-white">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="p-3 font-bold text-neutral-700">Activity Level</th>
                      <th className="p-3 font-bold text-neutral-700 text-right">Daily Needs</th>
                      <th className="p-3 font-bold text-neutral-700">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-dark-700">
                    {activityLevels.map((lvl) => (
                      <tr key={lvl.name} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-3 font-bold">{lvl.name}</td>
                        <td className="p-3 font-black text-right text-primary-700">
                          {Math.round(calculatedBmr * lvl.multiplier * valMultiplier).toLocaleString()} {labelText}
                        </td>
                        <td className="p-3 text-[10px] text-neutral-500">{lvl.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ShareExportPanel
                queryParams={queryParams}
                emailSubject="Basal Metabolic Rate (BMR) Results"
                emailBody={
                  `Basal Metabolic Rate (BMR) Results:\n` +
                  `- Gender: ${gender === 'male' ? 'Male' : 'Female'}\n` +
                  `- Age: ${age}\n` +
                  `- BMR Formula: ${bmrFormula.toUpperCase()}\n` +
                  `- Calculated BMR: ${calculatedBmr ? Math.round(calculatedBmr * valMultiplier).toLocaleString() : ''} ${labelText}`
                }
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <Info className="w-12 h-12 text-neutral-400 stroke-1 mb-3" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Inputs</p>
              <p className="text-[10px] font-mono mt-1 max-w-[200px] leading-relaxed">
                Provide your gender, age, weight, and height, then click calculate to view your basal metabolic rate and daily needs.
              </p>
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
