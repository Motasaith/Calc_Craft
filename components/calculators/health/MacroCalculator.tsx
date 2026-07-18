'use client'

import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, RetroActionButton } from '../shared/FormCalculatorShell'
import ShareExportPanel from '../shared/ShareExportPanel'
import { AlertTriangle, ChevronDown, ChevronUp, Settings, Activity, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MacroCalculator() {
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

  // Goal & Activity states
  const [activity, setActivity] = useState('moderate')
  const [goal, setGoal] = useState('lose-normal')

  // Settings states
  const [showSettings, setShowSettings] = useState(false)
  const [bmrFormula, setBmrFormula] = useState<'mifflin' | 'harris' | 'katch'>('mifflin')
  const [bodyFatPercent, setBodyFatPercent] = useState('20')

  // Calculation control states
  const [isCalculated, setIsCalculated] = useState(false)
  const [calculatedCal, setCalculatedCal] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Macro split ratio states
  const [splitPreset, setSplitPreset] = useState<'balanced' | 'high-protein' | 'low-carb' | 'keto' | 'custom'>('balanced')
  const [proteinPercent, setProteinPercent] = useState(30)
  const [carbsPercent, setCarbsPercent] = useState(40)
  const [fatPercent, setFatPercent] = useState(30)

  // URL serialization states
  const [queryParams, setQueryParams] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('g', gender)
    params.set('a', age)
    params.set('u', unitSystem)
    params.set('ac', activity)
    params.set('go', goal)
    params.set('p', splitPreset)
    if (unitSystem === 'us') {
      params.set('w', weightLbs)
      params.set('ft', feet)
      params.set('in', inches)
    } else if (unitSystem === 'metric') {
      params.set('w', weightKg)
      params.set('h', heightCm)
    }
    setQueryParams(params.toString())
  }, [gender, age, unitSystem, activity, goal, splitPreset, weightLbs, feet, inches, weightKg, heightCm])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const g = params.get('g')
      const a = params.get('a')
      const u = params.get('u')
      const ac = params.get('ac')
      const go = params.get('go')
      const p = params.get('p')
      const w = params.get('w')

      if (g === 'male' || g === 'female') setGender(g)
      if (a) setAge(a)
      if (u === 'us' || u === 'metric') setUnitSystem(u)
      if (ac) setActivity(ac)
      if (go) setGoal(go)
      if (p === 'balanced' || p === 'high-protein' || p === 'low-carb' || p === 'keto' || p === 'custom') setSplitPreset(p)

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
        setIsCalculated(true)
      }
    }
  }, [])

  // Presets configuration
  const presets = {
    balanced: { p: 30, c: 40, f: 30 },
    'high-protein': { p: 35, c: 35, f: 30 },
    'low-carb': { p: 40, c: 20, f: 40 },
    keto: { p: 25, c: 5, f: 70 },
  }

  // Adjust percents when preset changes
  useEffect(() => {
    if (splitPreset !== 'custom') {
      const pr = presets[splitPreset]
      setProteinPercent(pr.p)
      setCarbsPercent(pr.c)
      setFatPercent(pr.f)
    }
  }, [splitPreset])

  // Custom macro adjustment logic ensuring 100% total
  const handleCustomMacroChange = (type: 'protein' | 'carbs' | 'fat', value: number) => {
    if (value < 0 || value > 100) return

    if (type === 'protein') {
      const rem = 100 - value
      const sumCF = carbsPercent + fatPercent
      if (sumCF > 0) {
        const newC = Math.round((carbsPercent / sumCF) * rem)
        setProteinPercent(value)
        setCarbsPercent(newC)
        setFatPercent(100 - value - newC)
      } else {
        const newC = Math.round(rem / 2)
        setProteinPercent(value)
        setCarbsPercent(newC)
        setFatPercent(rem - newC)
      }
    } else if (type === 'carbs') {
      const rem = 100 - value
      const sumPF = proteinPercent + fatPercent
      if (sumPF > 0) {
        const newP = Math.round((proteinPercent / sumPF) * rem)
        setCarbsPercent(value)
        setProteinPercent(newP)
        setFatPercent(100 - value - newP)
      } else {
        const newP = Math.round(rem / 2)
        setCarbsPercent(value)
        setProteinPercent(newP)
        setFatPercent(rem - newP)
      }
    } else {
      const rem = 100 - value
      const sumPC = proteinPercent + carbsPercent
      if (sumPC > 0) {
        const newP = Math.round((proteinPercent / sumPC) * rem)
        setFatPercent(value)
        setProteinPercent(newP)
        setCarbsPercent(100 - value - newP)
      } else {
        const newP = Math.round(rem / 2)
        setFatPercent(value)
        setProteinPercent(newP)
        setCarbsPercent(rem - newP)
      }
    }
  }

  const handleClear = () => {
    setAge('25')
    setFeet('5')
    setInches('10')
    setWeightLbs('160')
    setHeightCm('180')
    setWeightKg('60')
    setHeightValue('180')
    setWeightValue('60')
    setBodyFatPercent('20')
    setActivity('moderate')
    setGoal('lose-normal')
    setSplitPreset('balanced')
    setIsCalculated(false)
    setCalculatedCal(null)
    setErrorMsg('')
  }

  const handleCalculate = () => {
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

      // Height conversion
      if (heightUnit === 'cm') height_cm = hVal
      else if (heightUnit === 'm') height_cm = hVal * 100
      else if (heightUnit === 'in') height_cm = hVal * 2.54
      else if (heightUnit === 'ft') height_cm = hVal * 30.48

      // Weight conversion
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

    // TDEE Activity multiplier
    const activityMults: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.465,
      active: 1.55,
      very: 1.725,
      super: 1.9,
    }
    const mult = activityMults[activity] || 1.2
    const tdee = bmr * mult

    // Goal adjustments (Deficit / Surplus)
    const goalOffsets: Record<string, number> = {
      maintain: 0,
      'lose-mild': -250,
      'lose-normal': -500,
      'lose-extreme': -1000,
      'gain-mild': 250,
      'gain-normal': 500,
    }
    const offset = goalOffsets[goal] || 0
    const targetCalories = tdee + offset

    setCalculatedCal(targetCalories)
    setIsCalculated(true)
  }

  // Macronutrient Grams Calculation
  const totalCal = calculatedCal !== null ? Math.round(calculatedCal) : 0
  const proteinGrams = Math.round((totalCal * (proteinPercent / 100)) / 4)
  const carbsGrams = Math.round((totalCal * (carbsPercent / 100)) / 4)
  const fatGrams = Math.round((totalCal * (fatPercent / 100)) / 9)

  // Clinical check floor
  const calorieFloor = gender === 'female' ? 1200 : 1500
  const isBelowFloor = totalCal < calorieFloor

  // SVG Donut Chart parameters
  // Radius r=65. Outer stroke width=22. Circumference = 2 * pi * 65 = 408.4
  const cRadius = 65
  const circ = 2 * Math.PI * cRadius
  const pLength = (proteinPercent / 100) * circ
  const cLength = (carbsPercent / 100) * circ
  const fLength = (fatPercent / 100) * circ

  return (
    <FormCalculatorShell title="Macronutrient Calculator" badge="HEALTH" subtitle="Daily Calorie Target & Macro Ratios Split">
      <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="space-y-4 no-print">
          {/* Unit System Tabs */}
          <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-xl border border-neutral-300">
            {(['us', 'metric', 'other'] as const).map((system) => (
              <button
                key={system}
                type="button"
                onClick={() => {
                  setUnitSystem(system)
                  setErrorMsg('')
                }}
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

          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-lg border border-neutral-300 h-10 items-center">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
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
                  className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
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
              label="Age (Ages 18-80)"
              value={age}
              onChange={setAge}
              placeholder="25"
              id="macro-age"
              type="number"
            />
          </div>

          {/* Unit specific height/weight fields */}
          {unitSystem === 'us' && (
            <div className="grid grid-cols-3 gap-2">
              <RetroInput label="Height (Ft)" value={feet} onChange={setFeet} placeholder="5" id="macro-h-ft" type="number" />
              <RetroInput label="Height (In)" value={inches} onChange={setInches} placeholder="10" id="macro-h-in" type="number" />
              <RetroInput label="Weight (Lbs)" value={weightLbs} onChange={setWeightLbs} placeholder="160" id="macro-w-lbs" type="number" />
            </div>
          )}

          {unitSystem === 'metric' && (
            <div className="grid grid-cols-2 gap-4">
              <RetroInput label="Height (cm)" value={heightCm} onChange={setHeightCm} placeholder="180" id="macro-h-cm" type="number" />
              <RetroInput label="Weight (kg)" value={weightKg} onChange={setWeightKg} placeholder="60" id="macro-w-kg" type="number" />
            </div>
          )}

          {unitSystem === 'other' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <RetroInput label="Height" value={heightValue} onChange={setHeightValue} placeholder="180" id="macro-h-oth" type="number" />
                <RetroSelect
                  label="Height Unit"
                  value={heightUnit}
                  onChange={(v) => setHeightUnit(v as any)}
                  options={[
                    { value: 'cm', label: 'Centimeters (cm)' },
                    { value: 'm', label: 'Meters (m)' },
                    { value: 'in', label: 'Inches (in)' },
                    { value: 'ft', label: 'Feet (ft)' }
                  ]}
                  id="macro-h-unit"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <RetroInput label="Weight" value={weightValue} onChange={setWeightValue} placeholder="60" id="macro-w-oth" type="number" />
                <RetroSelect
                  label="Weight Unit"
                  value={weightUnit}
                  onChange={(v) => setWeightUnit(v as any)}
                  options={[
                    { value: 'kg', label: 'Kilograms (kg)' },
                    { value: 'lbs', label: 'Pounds (lbs)' },
                    { value: 'st', label: 'Stones (st)' }
                  ]}
                  id="macro-w-unit"
                />
              </div>
            </div>
          )}

          {/* Activity and Goal Selection */}
          <div className="grid grid-cols-1 gap-4">
            <RetroSelect
              label="Activity Level"
              value={activity}
              onChange={setActivity}
              options={[
                { value: 'sedentary', label: 'Sedentary (Desk Job, No Exercise)' },
                { value: 'light', label: 'Lightly Active (Exercise 1-3 days/week)' },
                { value: 'moderate', label: 'Moderately Active (Exercise 4-5 days/week)' },
                { value: 'active', label: 'Active (Exercise daily or intensely 3-4 days/week)' },
                { value: 'very', label: 'Very Active (Intense training 6-7 days/week)' },
                { value: 'super', label: 'Super Active (Very intense training daily / physical job)' }
              ]}
              id="macro-activity"
            />

            <RetroSelect
              label="Your Goal"
              value={goal}
              onChange={setGoal}
              options={[
                { value: 'maintain', label: 'Maintain weight' },
                { value: 'lose-mild', label: 'Mild weight loss (0.25 kg / 0.5 lbs deficit)' },
                { value: 'lose-normal', label: 'Normal weight loss (0.5 kg / 1 lb deficit)' },
                { value: 'lose-extreme', label: 'Extreme weight loss (1 kg / 2 lbs deficit)' },
                { value: 'gain-mild', label: 'Mild weight gain (0.25 kg / 0.5 lbs surplus)' },
                { value: 'gain-normal', label: 'Normal weight gain (0.5 kg / 1 lb surplus)' }
              ]}
              id="macro-goal"
            />
          </div>

          {/* BMR Formula Collapsible Accordion */}
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
                    <RetroSelect
                      label="BMR Equation Model"
                      value={bmrFormula}
                      onChange={(v) => setBmrFormula(v as any)}
                      options={[
                        { value: 'mifflin', label: 'Mifflin St Jeor (Default standard)' },
                        { value: 'harris', label: 'Revised Harris-Benedict' },
                        { value: 'katch', label: 'Katch-McArdle' }
                      ]}
                      id="macro-formula"
                    />

                    {bmrFormula === 'katch' && (
                      <RetroInput
                        label="Body Fat (%)"
                        value={bodyFatPercent}
                        onChange={setBodyFatPercent}
                        placeholder="20"
                        id="macro-bf"
                        type="number"
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
            <RetroActionButton onClick={handleCalculate} variant="primary" fullWidth>
              Calculate
            </RetroActionButton>
            <RetroActionButton onClick={handleClear} variant="secondary">
              Clear
            </RetroActionButton>
          </div>
        </div>

        {/* Right Column: Visual Donut Chart & Macronutrient Presets */}
        <div className="bg-[#eae7df]/50 border-2 border-[#dad6cd] rounded-xl p-4 sm:p-6 h-full flex flex-col justify-between min-h-[350px] print-target">
          {isCalculated && calculatedCal !== null ? (
            <div className="space-y-6">
              {/* Headline calories result */}
              <div className="p-5 sm:p-6 bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-xl shadow-inner text-center font-mono relative overflow-hidden">
                <div className="absolute right-2 top-2 text-[#4c5c4a]/30">
                  <Activity className="w-12 h-12 stroke-[1.5]" />
                </div>
                <div className="text-[10px] font-bold text-[#4c5c4a] uppercase tracking-widest mb-1.5">
                  Target Daily Energy Requirement
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#1a2019] tracking-tight">
                  {totalCal.toLocaleString()}{' '}
                  <span className="text-lg font-bold text-[#4c5c4a]">kcal/day</span>
                </div>
                <p className="text-[10px] text-[#4c5c4a] mt-2 max-w-sm mx-auto font-sans leading-normal">
                  Your estimated TDEE with deficit/surplus offsets applied to reach your selected goal.
                </p>
              </div>

              {isBelowFloor && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[10px] text-amber-700 font-mono leading-normal">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>
                    <strong>Clinical Warning:</strong> Your target calories are below the recommended floor ({calorieFloor} kcal/day). Consuming fewer than this can impact metabolic function and cause nutrient deficiencies.
                  </span>
                </div>
              )}

              {/* Diet Presets Tabs */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider mb-2">
                  Macro Split Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 bg-neutral-200/80 p-1 rounded-lg border border-neutral-300">
                  {(['balanced', 'high-protein', 'low-carb', 'keto', 'custom'] as const).map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setSplitPreset(pr)}
                      className={`py-1.5 text-[9px] font-bold font-mono rounded capitalize transition-all ${
                        splitPreset === pr
                          ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                          : 'text-neutral-500 hover:text-dark-700'
                      }`}
                    >
                      {pr.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets and Custom percentage sliders */}
              {splitPreset === 'custom' && (
                <div className="p-4 bg-white border border-neutral-350 rounded-xl space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-blue-600">PROTEIN</span>
                      <span>{proteinPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={proteinPercent}
                      onChange={(e) => handleCustomMacroChange('protein', parseInt(e.target.value))}
                      className="w-full accent-blue-500 cursor-ew-resize h-1 bg-neutral-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-orange-500">CARBOHYDRATES</span>
                      <span>{carbsPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={carbsPercent}
                      onChange={(e) => handleCustomMacroChange('carbs', parseInt(e.target.value))}
                      className="w-full accent-orange-500 cursor-ew-resize h-1 bg-neutral-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-yellow-600">FAT</span>
                      <span>{fatPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={fatPercent}
                      onChange={(e) => handleCustomMacroChange('fat', parseInt(e.target.value))}
                      className="w-full accent-yellow-500 cursor-ew-resize h-1 bg-neutral-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Side-by-side: Donut Chart & Legend Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* SVG Donut Chart */}
                <div className="flex justify-center">
                  <svg viewBox="0 0 200 200" className="w-36 h-36 drop-shadow-sm select-none">
                    {/* Background Track Circle */}
                    <circle cx="100" cy="100" r={cRadius} stroke="#f5f4f0" strokeWidth="22" fill="none" />

                    {/* Donut Segments */}
                    <circle
                      cx="100"
                      cy="100"
                      r={cRadius}
                      stroke="#3b82f6" // Protein
                      strokeWidth="22"
                      fill="none"
                      strokeDasharray={`${pLength} ${circ}`}
                      strokeDashoffset={0}
                      transform="rotate(-90 100 100)"
                      className="transition-all duration-300"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r={cRadius}
                      stroke="#f97316" // Carbs
                      strokeWidth="22"
                      fill="none"
                      strokeDasharray={`${cLength} ${circ}`}
                      strokeDashoffset={-pLength}
                      transform="rotate(-90 100 100)"
                      className="transition-all duration-300"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r={cRadius}
                      stroke="#eab308" // Fat
                      strokeWidth="22"
                      fill="none"
                      strokeDasharray={`${fLength} ${circ}`}
                      strokeDashoffset={-(pLength + cLength)}
                      transform="rotate(-90 100 100)"
                      className="transition-all duration-300"
                    />

                    {/* Central Text */}
                    <text x="100" y="98" textAnchor="middle" fill="#1a2019" className="font-mono font-black text-[15px]">
                      {totalCal.toLocaleString()}
                    </text>
                    <text x="100" y="113" textAnchor="middle" fill="#666666" className="font-sans font-bold text-[8px] uppercase tracking-wider">
                      kcal/day
                    </text>
                  </svg>
                </div>

                {/* Legend Table */}
                <div className="overflow-x-auto border border-neutral-300 rounded-lg">
                  <table className="w-full text-left border-collapse text-[10px] font-mono bg-white">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-250">
                        <th className="p-2 font-bold text-neutral-500">Macro</th>
                        <th className="p-2 font-bold text-neutral-500 text-right">Grams</th>
                        <th className="p-2 font-bold text-neutral-500 text-right">Ratio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-250 text-dark-800">
                      <tr>
                        <td className="p-2 font-bold flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded bg-blue-500 shrink-0" /> Protein
                        </td>
                        <td className="p-2 font-black text-right">{proteinGrams}g</td>
                        <td className="p-2 text-right text-neutral-500">{proteinPercent}%</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded bg-orange-500 shrink-0" /> Carbs
                        </td>
                        <td className="p-2 font-black text-right">{carbsGrams}g</td>
                        <td className="p-2 text-right text-neutral-500">{carbsPercent}%</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded bg-yellow-500 shrink-0" /> Fat
                        </td>
                        <td className="p-2 font-black text-right">{fatGrams}g</td>
                        <td className="p-2 text-right text-neutral-500">{fatPercent}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Calorie/Energy Conversion notes */}
              <div className="p-3 bg-neutral-50 border border-neutral-300 rounded-lg text-[9px] font-mono text-neutral-500 leading-normal">
                Note: Macronutrient calculations are rounded to the nearest gram, using standard values: Protein (4 kcal/g), Carbohydrates (4 kcal/g), and Lipids/Fat (9 kcal/g).
              </div>

              <ShareExportPanel
                queryParams={queryParams}
                emailSubject="Macronutrient Calculation Results"
                emailBody={
                  `Macronutrient Calculation Results:\n` +
                  `- Gender: ${gender === 'male' ? 'Male' : 'Female'}\n` +
                  `- Age: ${age}\n` +
                  `- Daily Energy Target: ${calculatedCal ? Math.round(calculatedCal) : ''} kcal\n` +
                  `- Protein: ${proteinGrams}g (${proteinPercent}%)\n` +
                  `- Carbohydrates: ${carbsGrams}g (${carbsPercent}%)\n` +
                  `- Fats: ${fatGrams}g (${fatPercent}%)`
                }
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <Info className="w-12 h-12 text-neutral-400 stroke-1 mb-3" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Inputs</p>
              <p className="text-[10px] font-mono mt-1 max-w-[220px] leading-relaxed">
                Provide your gender, age, weight, height, activity levels, and weight goal, then click calculate to view daily macro splits.
              </p>
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
