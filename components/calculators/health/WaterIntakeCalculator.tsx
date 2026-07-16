'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroSelect, RetroSlider, RetroActionButton } from '../shared/FormCalculatorShell'
import { calculateWaterIntake } from '@/lib/calc-engine'
import { AlertTriangle, Activity, Info, Droplet, Plus, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WaterIntakeCalculator() {
  // Unit tab system
  const [unitSystem, setUnitSystem] = useState<'metric' | 'us'>('metric')

  // Inputs
  const [genderCondition, setGenderCondition] = useState<'male' | 'female' | 'pregnant' | 'breastfeeding'>('female')
  const [weightKg, setWeightKg] = useState(70)
  const [weightLbs, setWeightLbs] = useState(150)
  const [exerciseMins, setExerciseMins] = useState(30)
  const [climate, setClimate] = useState<'cold' | 'temperate' | 'hot'>('temperate')

  // Log tracker state
  const [loggedMl, setLoggedMl] = useState(0)

  // Calculation control states
  const [isCalculated, setIsCalculated] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleClear = () => {
    setGenderCondition('female')
    setWeightKg(70)
    setWeightLbs(150)
    setExerciseMins(30)
    setClimate('temperate')
    setLoggedMl(0)
    setIsCalculated(false)
    setErrorMsg('')
  }

  const handleCalculate = () => {
    setErrorMsg('')
    if (unitSystem === 'metric') {
      if (weightKg <= 0) {
        setErrorMsg('Please enter a valid weight.')
        return
      }
    } else {
      if (weightLbs <= 0) {
        setErrorMsg('Please enter a valid weight.')
        return
      }
    }
    if (exerciseMins < 0) {
      setErrorMsg('Please enter valid exercise minutes.')
      return
    }

    setIsCalculated(true)
  }

  // Calculate target intake (ml)
  const weightValKg = unitSystem === 'metric' ? weightKg : weightLbs * 0.45359237
  const baseIntake = calculateWaterIntake(weightValKg, exerciseMins)
  const climateMult = climate === 'cold' ? 0.9 : climate === 'temperate' ? 1.0 : 1.15
  
  // Apply lifecycle offsets: Pregnant (+300ml), Breastfeeding (+750ml)
  const conditionOffset = genderCondition === 'pregnant' ? 300 : genderCondition === 'breastfeeding' ? 750 : 0

  const targetMl = Math.round(baseIntake * climateMult + conditionOffset)
  const targetOz = Math.round(targetMl * 0.033814)
  const targetLiters = (targetMl / 1000).toFixed(1)
  const targetGlasses = Math.round(targetMl / 250)
  const targetCups = Math.round(targetMl / 236.588)

  // Track progress
  const progressPercent = Math.min(100, Math.round((loggedMl / targetMl) * 100))

  // Logger click actions
  const logIntake = (amountMl: number) => {
    setLoggedMl((prev) => Math.max(0, prev + amountMl))
  }

  const resetLog = () => {
    setLoggedMl(0)
  }

  return (
    <FormCalculatorShell title="Water Intake Calculator" badge="HEALTH" subtitle="Daily Hydration Requirement & Progress Tracker">
      <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-6 lg:gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="space-y-4">
          {/* Unit Tabs */}
          <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-xl border border-neutral-300">
            <button
              type="button"
              onClick={() => {
                setUnitSystem('metric')
                setErrorMsg('')
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono transition-all uppercase ${
                unitSystem === 'metric'
                  ? 'bg-white text-dark-900 shadow-sm border border-neutral-300'
                  : 'text-neutral-500 hover:text-dark-700'
              }`}
            >
              Metric Units
            </button>
            <button
              type="button"
              onClick={() => {
                setUnitSystem('us')
                setErrorMsg('')
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono transition-all uppercase ${
                unitSystem === 'us'
                  ? 'bg-white text-dark-900 shadow-sm border border-neutral-300'
                  : 'text-neutral-500 hover:text-dark-700'
              }`}
            >
              US Units
            </button>
          </div>

          {/* Gender/Condition Selector */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
              Gender & Life Stage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-neutral-200/80 p-1 rounded-lg border border-neutral-300">
              <button
                type="button"
                onClick={() => setGenderCondition('male')}
                className={`py-1.5 text-[9px] font-bold font-mono rounded transition-all ${
                  genderCondition === 'male' ? 'bg-white text-neutral-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGenderCondition('female')}
                className={`py-1.5 text-[9px] font-bold font-mono rounded transition-all ${
                  genderCondition === 'female' ? 'bg-white text-neutral-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Female
              </button>
              <button
                type="button"
                onClick={() => setGenderCondition('pregnant')}
                className={`py-1.5 text-[9px] font-bold font-mono rounded transition-all ${
                  genderCondition === 'pregnant' ? 'bg-white text-neutral-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Pregnant
              </button>
              <button
                type="button"
                onClick={() => setGenderCondition('breastfeeding')}
                className={`py-1.5 text-[9px] font-bold font-mono rounded transition-all ${
                  genderCondition === 'breastfeeding' ? 'bg-white text-neutral-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Nursing
              </button>
            </div>
          </div>

          {/* Weight Input (Slider) */}
          {unitSystem === 'metric' ? (
            <RetroSlider
              label="Weight"
              value={weightKg}
              onChange={setWeightKg}
              min={30}
              max={180}
              step={1}
              displayValue={`${weightKg} kg`}
              id="water-w-kg"
            />
          ) : (
            <RetroSlider
              label="Weight"
              value={weightLbs}
              onChange={setWeightLbs}
              min={70}
              max={400}
              step={1}
              displayValue={`${weightLbs} lbs`}
              id="water-w-lbs"
            />
          )}

          {/* Exercise Minutes Slider */}
          <RetroSlider
            label="Daily Exercise Time"
            value={exerciseMins}
            onChange={setExerciseMins}
            min={0}
            max={180}
            step={5}
            displayValue={`${exerciseMins} minutes`}
            id="water-exercise"
          />

          {/* Climate Selection */}
          <RetroSelect
            label="Climate / Environment"
            value={climate}
            onChange={(val) => setClimate(val as any)}
            options={[
              { value: 'cold', label: 'Cold / Cool Climate (-10%)' },
              { value: 'temperate', label: 'Temperate / Normal Climate' },
              { value: 'hot', label: 'Hot / Humid Climate (+15%)' }
            ]}
            id="water-climate"
          />

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

        {/* Right Column: Visual Bottle Tracker & Progress Output */}
        <div className="bg-[#eae7df]/50 border-2 border-[#dad6cd] rounded-xl p-4 sm:p-6 h-full flex flex-col justify-between min-h-[350px]">
          {isCalculated ? (
            <div className="space-y-6">
              {/* Headline Result Display */}
              <div className="p-5 sm:p-6 bg-[#d0e2f5] border-2 border-[#b8cee6] rounded-xl shadow-inner text-center font-mono relative overflow-hidden">
                <div className="absolute right-2 top-2 text-[#2d5c8a]/20">
                  <Droplet className="w-12 h-12 stroke-[1.5]" />
                </div>
                <div className="text-[10px] font-bold text-[#2d5c8a] uppercase tracking-widest mb-1.5">
                  Recommended Daily Water Goal
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#0f2d4a] tracking-tight">
                  {unitSystem === 'metric' 
                    ? `${targetMl.toLocaleString()} ml` 
                    : `${targetOz.toLocaleString()} fl oz`}
                </div>
                <p className="text-[10px] text-[#2d5c8a] mt-2 max-w-sm mx-auto font-sans leading-normal">
                  Approximately <strong>{targetLiters} Liters</strong> (or <strong>{targetCups} cups</strong>) to stay fully hydrated under these climate and activity levels.
                </p>
              </div>

              {/* Side-by-side Progress Tracker and Interactive SVG Water Bottle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* SVG Water Bottle Tracker */}
                <div className="flex justify-center">
                  <svg viewBox="0 0 100 200" className="w-24 h-auto drop-shadow-md select-none">
                    {/* Bottle Clip Path */}
                    <clipPath id="bottle-clip">
                      <rect x="26.5" y="36.5" width="47" height="152" rx="10" />
                    </clipPath>

                    {/* Background track representing empty bottle */}
                    <rect x="25" y="35" width="50" height="155" rx="11" fill="#f5f4f0" stroke="#dad6cd" strokeWidth="1.5" />
                    <rect x="40" y="15" width="20" height="20" rx="3" fill="#e5e3db" stroke="#dad6cd" strokeWidth="1.5" />
                    <rect x="38" y="9" width="24" height="6" rx="1" fill="#737373" />

                    {/* Water Level Fill (Clipped to inside of bottle) */}
                    <g clipPath="url(#bottle-clip)">
                      {/* Water base */}
                      <motion.rect
                        x="20"
                        y={36.5 + 152 - (progressPercent / 100) * 152}
                        width="60"
                        height={160}
                        fill="#3b82f6"
                        opacity="0.8"
                        animate={{ y: 36.5 + 152 - (progressPercent / 100) * 152 }}
                        transition={{ type: 'spring', damping: 15, stiffness: 60 }}
                      />
                      
                      {/* 3D Highlight Reflection */}
                      <rect x="30" y="36.5" width="5" height="152" fill="#ffffff" opacity="0.2" />
                    </g>

                    {/* Measuring Ticks */}
                    <line x1="28" y1="74.5" x2="33" y2="74.5" stroke="#737373" strokeWidth="1.5" />
                    <text x="36" y="77" fill="#737373" fontSize="8" fontFamily="monospace" fontWeight="bold">75%</text>

                    <line x1="28" y1="112.5" x2="35" y2="112.5" stroke="#737373" strokeWidth="1.5" />
                    <text x="38" y="115" fill="#737373" fontSize="8" fontFamily="monospace" fontWeight="bold">50%</text>

                    <line x1="28" y1="150.5" x2="33" y2="150.5" stroke="#737373" strokeWidth="1.5" />
                    <text x="36" y="153" fill="#737373" fontSize="8" fontFamily="monospace" fontWeight="bold">25%</text>

                    {/* Outlines */}
                    <rect x="25" y="35" width="50" height="155" rx="11" fill="none" stroke="#737373" strokeWidth="2.5" />
                    <rect x="40" y="15" width="20" height="20" rx="3" fill="none" stroke="#737373" strokeWidth="2.5" />
                  </svg>
                </div>

                {/* Hydration Tracker Logger Simulator */}
                <div className="space-y-4">
                  <div className="text-center sm:text-left font-mono">
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Logged Progress
                    </div>
                    <div className="text-2xl font-black text-neutral-800 mt-1">
                      {progressPercent}%
                    </div>
                    <div className="text-[10px] text-neutral-600 mt-1">
                      {unitSystem === 'metric'
                        ? `${loggedMl.toLocaleString()} / ${targetMl.toLocaleString()} ml`
                        : `${Math.round(loggedMl * 0.033814).toLocaleString()} / ${targetOz.toLocaleString()} oz`}
                    </div>
                  </div>

                  {/* Drink Logger Quick-Add Buttons */}
                  <div className="space-y-2 font-mono">
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => logIntake(unitSystem === 'metric' ? 250 : Math.round(8 / 0.033814))}
                        className="flex items-center justify-center gap-1 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 hover:border-neutral-400 text-[10px] font-bold text-neutral-700 shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 text-blue-500" />
                        {unitSystem === 'metric' ? '+250ml' : '+8 oz'}
                      </button>
                      <button
                        type="button"
                        onClick={() => logIntake(unitSystem === 'metric' ? 500 : Math.round(16 / 0.033814))}
                        className="flex items-center justify-center gap-1 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 hover:border-neutral-400 text-[10px] font-bold text-neutral-700 shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 text-blue-500" />
                        {unitSystem === 'metric' ? '+500ml' : '+16 oz'}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => logIntake(unitSystem === 'metric' ? 750 : Math.round(24 / 0.033814))}
                      className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 hover:border-neutral-400 text-[10px] font-bold text-neutral-700 shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 text-blue-500" />
                      {unitSystem === 'metric' ? '+750ml Large Bottle' : '+24 oz Large Bottle'}
                    </button>

                    <button
                      type="button"
                      onClick={resetLog}
                      className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-[10px] font-bold text-neutral-600 transition-all"
                    >
                      <RotateCcw className="w-3 h-3 text-neutral-500" /> Reset Log
                    </button>
                  </div>
                </div>
              </div>

              {/* Conversion and targets details table */}
              <div className="overflow-x-auto border border-neutral-200 rounded-lg">
                <table className="w-full text-left border-collapse text-xs font-mono bg-white">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="p-3 font-bold text-neutral-700">Measurement Unit</th>
                      <th className="p-3 font-bold text-neutral-700 text-right">Daily Recommended</th>
                      <th className="p-3 font-bold text-neutral-700">Equivalence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-dark-700">
                    <tr>
                      <td className="p-3 font-bold">Milliliters (ml)</td>
                      <td className="p-3 font-black text-right text-blue-700">{targetMl.toLocaleString()} ml</td>
                      <td className="p-3 text-[10px] text-neutral-500">Metric baseline</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Liters (L)</td>
                      <td className="p-3 font-black text-right text-blue-700">{targetLiters} L</td>
                      <td className="p-3 text-[10px] text-neutral-500">Approx. {(targetMl / 1000).toFixed(2)} Liters</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Fluid Ounces (fl oz)</td>
                      <td className="p-3 font-black text-right text-blue-700">{targetOz} oz</td>
                      <td className="p-3 text-[10px] text-neutral-500">US fluid volume standard</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Standard Glasses</td>
                      <td className="p-3 font-black text-right text-blue-700">~{targetGlasses} glasses</td>
                      <td className="p-3 text-[10px] text-neutral-500">Based on 250ml glass sizes</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">US Customary Cups</td>
                      <td className="p-3 font-black text-right text-blue-700">~{targetCups} cups</td>
                      <td className="p-3 text-[10px] text-neutral-500">Based on standard 8 oz cup sizes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <Info className="w-12 h-12 text-neutral-400 stroke-1 mb-3" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Inputs</p>
              <p className="text-[10px] font-mono mt-1 max-w-[220px] leading-relaxed">
                Select your unit system, gender/life stage, body weight, exercise schedule, and climate, then click Calculate.
              </p>
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
