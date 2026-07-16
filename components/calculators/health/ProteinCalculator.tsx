'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, RetroActionButton } from '../shared/FormCalculatorShell'
import { AlertTriangle, ChevronDown, ChevronUp, Activity, Info, Dumbbell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProteinCalculator() {
  const [unitSystem, setUnitSystem] = useState<'us' | 'metric'>('metric')
  const [age, setAge] = useState('25')
  const [gender, setGender] = useState<'male' | 'female'>('male')

  // US Units height/weight states
  const [feet, setFeet] = useState('5')
  const [inches, setInches] = useState('10')
  const [weightLbs, setWeightLbs] = useState('160')

  // Metric Units height/weight states
  const [heightCm, setHeightCm] = useState('180')
  const [weightKg, setWeightKg] = useState('70')

  // Activity & Settings
  const [activity, setActivity] = useState('light')
  const [formula, setFormula] = useState<'mifflin' | 'katch'>('mifflin')
  const [bodyFat, setBodyFat] = useState('20')
  const [showSettings, setShowSettings] = useState(false)

  // Result states
  const [isCalculated, setIsCalculated] = useState(false)
  const [whoLimit, setWhoLimit] = useState(0)
  const [adaMin, setAdaMin] = useState(0)
  const [adaMax, setAdaMax] = useState(0)
  const [cdcMin, setCdcMin] = useState(0)
  const [cdcMax, setCdcMax] = useState(0)
  const [tdeeValue, setTdeeValue] = useState(0)
  const [recommendedTarget, setRecommendedTarget] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  // Hover states for the SVG bar chart ranges
  const [hoveredRange, setHoveredRange] = useState<string | null>(null)

  const handleClear = () => {
    setAge('25')
    setGender('male')
    setFeet('5')
    setInches('10')
    setWeightLbs('160')
    setHeightCm('180')
    setWeightKg('70')
    setActivity('light')
    setFormula('mifflin')
    setBodyFat('20')
    setIsCalculated(false)
    setErrorMsg('')
    setHoveredRange(null)
  }

  const handleCalculate = () => {
    setErrorMsg('')
    const ageVal = parseInt(age)
    if (isNaN(ageVal) || ageVal < 1 || ageVal > 120) {
      setErrorMsg('Please enter a valid age between 1 and 120.')
      return
    }

    let wKg = 0
    let hCm = 0

    if (unitSystem === 'metric') {
      const kg = parseFloat(weightKg)
      const cm = parseFloat(heightCm)
      if (isNaN(kg) || kg <= 0 || isNaN(cm) || cm <= 0) {
        setErrorMsg('Please enter valid height and weight values.')
        return
      }
      wKg = kg
      hCm = cm
    } else {
      const lbs = parseFloat(weightLbs)
      const ft = parseFloat(feet)
      const inch = parseFloat(inches)
      if (isNaN(lbs) || lbs <= 0 || isNaN(ft) || ft < 0 || isNaN(inch) || inch < 0) {
        setErrorMsg('Please enter valid height and weight values.')
        return
      }
      wKg = lbs / 2.2046226218
      hCm = (ft * 12 + inch) * 2.54
    }

    // BMR Calculation
    let bmr = 0
    if (formula === 'mifflin') {
      if (gender === 'male') {
        bmr = 10 * wKg + 6.25 * hCm - 5 * ageVal + 5
      } else {
        bmr = 10 * wKg + 6.25 * hCm - 5 * ageVal - 161
      }
    } else {
      const fatPct = parseFloat(bodyFat)
      if (isNaN(fatPct) || fatPct < 0 || fatPct > 100) {
        setErrorMsg('Please enter a valid body fat percentage between 0 and 100.')
        return
      }
      const leanMass = wKg * (1 - fatPct / 100)
      bmr = 370 + (21.6 * leanMass)
    }

    // TDEE Multipliers
    const multipliers: Record<string, number> = {
      bmr: 1.0,
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very-active': 1.9
    }
    const tdee = bmr * (multipliers[activity] || 1.375)

    // 1. WHO safe lower limit: 0.83 grams per kilogram
    const who = wKg * 0.83

    // 2. ADA: 1.0 to 1.8 grams per kilogram
    const adaL = wKg * 1.0
    const adaH = wKg * 1.8

    // 3. CDC: 10% to 35% of total TDEE calories (1g protein = 4 calories)
    const cdcL = (tdee * 0.10) / 4
    const cdcH = (tdee * 0.35) / 4

    // Recommended Target based on activity level
    // Sedentary: 0.8-1.0 g/kg
    // Light: 1.1-1.3 g/kg
    // Moderate: 1.3-1.6 g/kg
    // Active: 1.6-1.8 g/kg
    // Very Active: 1.8-2.2 g/kg
    let factor = 1.2
    if (activity === 'sedentary') factor = 0.9
    else if (activity === 'light') factor = 1.2
    else if (activity === 'moderate') factor = 1.5
    else if (activity === 'active') factor = 1.8
    else if (activity === 'very-active') factor = 2.0

    setWhoLimit(who)
    setAdaMin(adaL)
    setAdaMax(adaH)
    setCdcMin(cdcL)
    setCdcMax(cdcH)
    setTdeeValue(tdee)
    setRecommendedTarget(wKg * factor)
    setIsCalculated(true)
  }

  // Setup scale for SVG bar chart
  const maxRangeVal = Math.max(whoLimit, adaMax, cdcMax) || 150
  const chartMax = Math.ceil((maxRangeVal * 1.1) / 10) * 10
  const cWidth = 440
  const barHeight = 22
  const paddingLeft = 65
  const paddingRight = 20
  const graphWidth = cWidth - paddingLeft - paddingRight

  const getWidthPercent = (val: number) => {
    return (val / chartMax) * graphWidth
  }

  return (
    <FormCalculatorShell title="Protein Calculator" badge="HEALTH" subtitle="Calculate Daily Protein Requirements & Guidelines">
      <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="space-y-4">
          {/* Unit System Switcher */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
              Unit System
            </label>
            <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-lg border border-neutral-300 h-10 items-center">
              <button
                type="button"
                onClick={() => setUnitSystem('metric')}
                className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                  unitSystem === 'metric'
                    ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Metric Units
              </button>
              <button
                type="button"
                onClick={() => setUnitSystem('us')}
                className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                  unitSystem === 'us'
                    ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                US Units
              </button>
            </div>
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <RetroInput
              label="Age (18 - 80)"
              value={age}
              onChange={setAge}
              placeholder="25"
              id="prot-age"
              type="number"
            />
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
          </div>

          {/* Height and Weight */}
          {unitSystem === 'metric' ? (
            <div className="grid grid-cols-2 gap-4">
              <RetroInput
                label="Height (cm)"
                value={heightCm}
                onChange={setHeightCm}
                placeholder="180"
                id="prot-height-cm"
                type="number"
              />
              <RetroInput
                label="Weight (kg)"
                value={weightKg}
                onChange={setWeightKg}
                placeholder="70"
                id="prot-weight-kg"
                type="number"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <RetroInput
                  label="Height (Feet)"
                  value={feet}
                  onChange={setFeet}
                  placeholder="5"
                  id="prot-height-feet"
                  type="number"
                />
                <RetroInput
                  label="Height (Inches)"
                  value={inches}
                  onChange={setInches}
                  placeholder="10"
                  id="prot-height-inches"
                  type="number"
                />
              </div>
              <RetroInput
                label="Weight (lbs)"
                value={weightLbs}
                onChange={setWeightLbs}
                placeholder="160"
                id="prot-weight-lbs"
                type="number"
              />
            </div>
          )}

          {/* Activity Level */}
          <RetroSelect
            label="Activity Level"
            value={activity}
            onChange={setActivity}
            options={[
              { value: 'bmr', label: 'BMR (Basal Metabolic Rate)' },
              { value: 'sedentary', label: 'Sedentary: little or no exercise' },
              { value: 'light', label: 'Light: exercise 1-3 times/week' },
              { value: 'moderate', label: 'Moderate: exercise 4-5 times/week' },
              { value: 'active', label: 'Active: intense exercise 3-4 times/week' },
              { value: 'very-active', label: 'Very Active: intense exercise 6-7 times/week' }
            ]}
            id="prot-activity"
          />

          {/* Settings Accordion */}
          <div className="border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50/50">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="w-full px-4 py-3 flex justify-between items-center text-xs font-mono font-bold text-neutral-700 hover:bg-neutral-100 transition-all border-b border-neutral-200"
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-neutral-500" /> BMR Estimation Formula
              </span>
              {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-white text-xs"
                >
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider mb-2">
                        Formula Model
                      </label>
                      <div className="flex gap-2">
                        <label className="flex-1 p-2.5 border border-neutral-200 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-neutral-50">
                          <input
                            type="radio"
                            name="formula"
                            checked={formula === 'mifflin'}
                            onChange={() => setFormula('mifflin')}
                            className="text-neutral-900 focus:ring-0"
                          />
                          <span className="font-mono font-bold text-neutral-700">Mifflin St Jeor</span>
                        </label>
                        <label className="flex-1 p-2.5 border border-neutral-200 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-neutral-50">
                          <input
                            type="radio"
                            name="formula"
                            checked={formula === 'katch'}
                            onChange={() => setFormula('katch')}
                            className="text-neutral-900 focus:ring-0"
                          />
                          <span className="font-mono font-bold text-neutral-700">Katch-McArdle</span>
                        </label>
                      </div>
                    </div>

                    {formula === 'katch' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl"
                      >
                        <RetroInput
                          label="Body Fat % (Required for Katch-McArdle)"
                          value={bodyFat}
                          onChange={setBodyFat}
                          placeholder="20"
                          id="prot-bodyfat"
                          type="number"
                        />
                      </motion.div>
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

        {/* Right Column: Visual Charts & Recommendations */}
        <div className="bg-[#eae7df]/50 border-2 border-[#dad6cd] rounded-xl p-4 sm:p-6 h-full flex flex-col justify-between min-h-[350px]">
          {isCalculated ? (
            <div className="space-y-6">
              {/* Recommended target card */}
              <div className="p-5 sm:p-6 bg-[#dcd3c1] border-2 border-[#c2b9a7] rounded-xl shadow-inner text-center font-mono relative overflow-hidden">
                <div className="absolute right-2 top-2 text-[#6e634e]/30">
                  <Dumbbell className="w-12 h-12 stroke-[1.5]" />
                </div>
                <div className="text-[10px] font-bold text-[#6e634e] uppercase tracking-widest mb-1.5">
                  Optimal Recommended Protein Intake
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#2e271a] tracking-tight">
                  {Math.round(recommendedTarget)} g/day
                </div>
                <p className="text-[10px] text-[#6e634e] mt-2 max-w-sm mx-auto font-sans leading-normal">
                  Based on your weight and <strong>{activity.replace('-', ' ')}</strong> activity level. Targets range from safety minimums to training thresholds.
                </p>
              </div>

              {/* Interactive SVG range comparison chart */}
              <div className="bg-white border border-neutral-300 rounded-xl p-4 relative">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider">
                    Institutional Protein Guideline Ranges
                  </label>
                  {hoveredRange && (
                    <div className="text-[9px] font-mono font-bold px-2 py-0.5 bg-neutral-900 text-white rounded shadow-sm animate-fade-in">
                      {hoveredRange}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <svg viewBox={`0 0 ${cWidth} 120`} className="w-full h-auto select-none overflow-visible">
                    {/* Scale markers */}
                    {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                      const x = paddingLeft + frac * graphWidth
                      const labelVal = chartMax * frac
                      return (
                        <g key={idx} className="opacity-40">
                          <line
                            x1={x}
                            y1={5}
                            x2={x}
                            y2={95}
                            stroke="#e5e5e5"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                          />
                          <text
                            x={x}
                            y={105}
                            textAnchor="middle"
                            fill="#888888"
                            className="font-mono text-[7px]"
                          >
                            {Math.round(labelVal)}g
                          </text>
                        </g>
                      )
                    })}

                    {/* WHO range bar */}
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredRange(`WHO Safe Limit: ${whoLimit.toFixed(0)}g/day (0.83g/kg)`)}
                      onMouseLeave={() => setHoveredRange(null)}
                    >
                      <text x={paddingLeft - 8} y={23} textAnchor="end" className="font-mono text-[8px] font-bold fill-neutral-500">WHO</text>
                      <rect
                        x={paddingLeft}
                        y={12}
                        width={getWidthPercent(whoLimit)}
                        height={barHeight}
                        rx="4"
                        fill="#0d9488"
                        className="transition-all hover:opacity-85"
                      />
                    </g>

                    {/* ADA range bar */}
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredRange(`ADA Range: ${adaMin.toFixed(0)}g – ${adaMax.toFixed(0)}g/day (1.0–1.8g/kg)`)}
                      onMouseLeave={() => setHoveredRange(null)}
                    >
                      <text x={paddingLeft - 8} y={53} textAnchor="end" className="font-mono text-[8px] font-bold fill-neutral-500">ADA</text>
                      {/* Bar spans from adaMin to adaMax */}
                      <rect
                        x={paddingLeft + getWidthPercent(adaMin)}
                        y={42}
                        width={getWidthPercent(adaMax - adaMin)}
                        height={barHeight}
                        rx="4"
                        fill="#4f46e5"
                        className="transition-all hover:opacity-85"
                      />
                      {/* Draw a subtle background line leading up to adaMin */}
                      <rect
                        x={paddingLeft}
                        y={51}
                        width={getWidthPercent(adaMin)}
                        height="4"
                        fill="#e5e7eb"
                        rx="2"
                        className="opacity-50"
                      />
                    </g>

                    {/* CDC range bar */}
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredRange(`CDC Range: ${cdcMin.toFixed(0)}g – ${cdcMax.toFixed(0)}g/day (10–35% TDEE)`)}
                      onMouseLeave={() => setHoveredRange(null)}
                    >
                      <text x={paddingLeft - 8} y={83} textAnchor="end" className="font-mono text-[8px] font-bold fill-neutral-500">CDC</text>
                      {/* Bar spans from cdcMin to cdcMax */}
                      <rect
                        x={paddingLeft + getWidthPercent(cdcMin)}
                        y={72}
                        width={getWidthPercent(cdcMax - cdcMin)}
                        height={barHeight}
                        rx="4"
                        fill="#9333ea"
                        className="transition-all hover:opacity-85"
                      />
                      {/* Draw a subtle background line leading up to cdcMin */}
                      <rect
                        x={paddingLeft}
                        y={81}
                        width={getWidthPercent(cdcMin)}
                        height="4"
                        fill="#e5e7eb"
                        rx="2"
                        className="opacity-50"
                      />
                    </g>

                    {/* Recommended target vertical line marker */}
                    <line
                      x1={paddingLeft + getWidthPercent(recommendedTarget)}
                      y1={5}
                      x2={paddingLeft + getWidthPercent(recommendedTarget)}
                      y2={95}
                      stroke="#2e271a"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                    <circle
                      cx={paddingLeft + getWidthPercent(recommendedTarget)}
                      cy={5}
                      r="4.5"
                      fill="#2e271a"
                    />
                  </svg>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#0d9488] rounded" /> WHO Limit</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#4f46e5] rounded" /> ADA (1.0-1.8 g/kg)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#9333ea] rounded" /> CDC (10-35% kcal)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-1 border border-neutral-400 border-dashed" /> Recommended Target</span>
                </div>
              </div>

              {/* Institution details list */}
              <div className="border border-neutral-300 rounded-xl overflow-hidden bg-white text-xs font-mono">
                <div className="p-3 bg-neutral-50 border-b border-neutral-200 font-bold text-neutral-700 uppercase text-[10px] tracking-wider">
                  Detailed Recommendations Breakdown
                </div>
                <div className="divide-y divide-neutral-200">
                  <div className="p-3 flex justify-between items-center">
                    <span>ADA (1.0 - 1.8 g/kg)</span>
                    <span className="font-bold text-[#4f46e5]">{Math.round(adaMin)} - {Math.round(adaMax)} g/day</span>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <span>CDC (10% - 35% Calories)</span>
                    <span className="font-bold text-[#9333ea]">{Math.round(cdcMin)} - {Math.round(cdcMax)} g/day</span>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <span>WHO Safe Lower Limit</span>
                    <span className="font-bold text-[#0d9488]">at least {Math.round(whoLimit)} g/day</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <Dumbbell className="w-12 h-12 text-neutral-400 stroke-1 mb-3 animate-pulse" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Inputs</p>
              <p className="text-[10px] font-mono mt-1 max-w-[220px] leading-relaxed">
                Provide height, weight, activity, and age inputs to evaluate institutional recommended ranges.
              </p>
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
