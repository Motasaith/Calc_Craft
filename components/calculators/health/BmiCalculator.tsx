'use client'
import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect, RetroActionButton } from '../shared/FormCalculatorShell'
import ShareExportPanel from '../shared/ShareExportPanel'
import { calculateBMI } from '@/lib/calc-engine'
import Link from 'next/link'
import { Activity, Info, AlertTriangle, ChevronRight } from 'lucide-react'

// CDC Growth Chart Parameters for Children & Teens (Ages 2-20)
// L is Box-Cox transformation power, M is median, S is coefficient of variation
interface LMSData {
  age: number
  L: number
  M: number
  S: number
}

const BOYS_LMS: LMSData[] = [
  { age: 2, L: -1.38, M: 16.58, S: 0.081 },
  { age: 3, L: -1.45, M: 15.82, S: 0.082 },
  { age: 4, L: -1.52, M: 15.36, S: 0.085 },
  { age: 5, L: -1.59, M: 15.21, S: 0.091 },
  { age: 6, L: -1.68, M: 15.25, S: 0.098 },
  { age: 7, L: -1.78, M: 15.42, S: 0.106 },
  { age: 8, L: -1.90, M: 15.70, S: 0.115 },
  { age: 9, L: -2.01, M: 16.08, S: 0.124 },
  { age: 10, L: -2.10, M: 16.55, S: 0.132 },
  { age: 11, L: -2.18, M: 17.08, S: 0.139 },
  { age: 12, L: -2.23, M: 17.67, S: 0.144 },
  { age: 13, L: -2.24, M: 18.32, S: 0.147 },
  { age: 14, L: -2.22, M: 19.00, S: 0.147 },
  { age: 15, L: -2.16, M: 19.70, S: 0.146 },
  { age: 16, L: -2.07, M: 20.40, S: 0.143 },
  { age: 17, L: -1.96, M: 21.09, S: 0.139 },
  { age: 18, L: -1.84, M: 21.76, S: 0.134 },
  { age: 19, L: -1.72, M: 22.40, S: 0.129 },
  { age: 20, L: -1.61, M: 23.00, S: 0.125 }
]

const GIRLS_LMS: LMSData[] = [
  { age: 2, L: -1.89, M: 16.27, S: 0.086 },
  { age: 3, L: -1.94, M: 15.54, S: 0.088 },
  { age: 4, L: -1.98, M: 15.11, S: 0.092 },
  { age: 5, L: -2.00, M: 14.94, S: 0.098 },
  { age: 6, L: -2.01, M: 14.96, S: 0.106 },
  { age: 7, L: -2.00, M: 15.12, S: 0.114 },
  { age: 8, L: -1.97, M: 15.42, S: 0.123 },
  { age: 9, L: -1.92, M: 15.83, S: 0.131 },
  { age: 10, L: -1.86, M: 16.34, S: 0.138 },
  { age: 11, L: -1.78, M: 16.92, S: 0.144 },
  { age: 12, L: -1.70, M: 17.55, S: 0.147 },
  { age: 13, L: -1.61, M: 18.21, S: 0.148 },
  { age: 14, L: -1.52, M: 18.87, S: 0.147 },
  { age: 15, L: -1.43, M: 19.51, S: 0.144 },
  { age: 16, L: -1.34, M: 20.10, S: 0.140 },
  { age: 17, L: -1.25, M: 20.64, S: 0.136 },
  { age: 18, L: -1.17, M: 21.12, S: 0.131 },
  { age: 19, L: -1.09, M: 21.55, S: 0.126 },
  { age: 20, L: -1.02, M: 21.91, S: 0.122 }
]

// Numerical approximation of error function (erf) for normal CDF
function erf(x: number): number {
  const a1 = 0.278393, a2 = 0.230389, a3 = 0.000972, a4 = 0.078108
  const sign = x < 0 ? -1 : 1
  const absX = Math.abs(x)
  const denom = 1 + a1 * absX + a2 * Math.pow(absX, 2) + a3 * Math.pow(absX, 3) + a4 * Math.pow(absX, 4)
  const val = 1 - 1 / Math.pow(denom, 4)
  return sign * val
}

// Normal Cumulative Distribution Function (CDF)
function normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.sqrt(2)))
}

export default function BmiCalculator() {
  const [unitSystem, setUnitSystem] = useState<'us' | 'metric' | 'other'>('us')
  const [age, setAge] = useState<string>('25')
  const [gender, setGender] = useState<'male' | 'female'>('male')

  // US Customary Inputs
  const [feet, setFeet] = useState('5')
  const [inches, setInches] = useState('10')
  const [weightLbs, setWeightLbs] = useState('160')

  // Metric Inputs
  const [heightCm, setHeightCm] = useState('178')
  const [weightKg, setWeightKg] = useState('75')

  // Other Units Inputs
  const [heightOther, setHeightOther] = useState('1.78')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'm' | 'in' | 'ft'>('m')
  const [weightOther, setWeightOther] = useState('75')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs' | 'st'>('kg')

  // Results State
  const [isCalculated, setIsCalculated] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // URL serialization states
  const [queryParams, setQueryParams] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('g', gender)
    params.set('a', age)
    params.set('u', unitSystem)
    if (unitSystem === 'us') {
      params.set('w', weightLbs)
      params.set('ft', feet)
      params.set('in', inches)
    } else if (unitSystem === 'metric') {
      params.set('w', weightKg)
      params.set('h', heightCm)
    }
    setQueryParams(params.toString())
  }, [gender, age, unitSystem, weightLbs, feet, inches, weightKg, heightCm])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const g = params.get('g')
      const a = params.get('a')
      const u = params.get('u')
      const w = params.get('w')
      const h = params.get('h')

      if (g === 'male' || g === 'female') setGender(g)
      if (a) setAge(a)
      if (u === 'us' || u === 'metric') setUnitSystem(u)

      if (u === 'us') {
        if (w) setWeightLbs(w)
        const ft = params.get('ft')
        if (ft) setFeet(ft)
        const inch = params.get('in')
        if (inch) setInches(inch)
      } else if (u === 'metric') {
        if (w) setWeightKg(w)
        const ht = params.get('h')
        if (ht) setHeightCm(ht)
      }
      if (w) {
        setIsCalculated(true)
      }
    }
  }, [])

  // Reset calculator to default inputs
  const handleClear = () => {
    setAge('25')
    setGender('male')
    setFeet('5')
    setInches('10')
    setWeightLbs('160')
    setHeightCm('178')
    setWeightKg('75')
    setHeightOther('1.78')
    setHeightUnit('m')
    setWeightOther('75')
    setWeightUnit('kg')
    setIsCalculated(false)
    setErrorMsg('')
  }

  // Calculate BMI metrics
  const getMetrics = () => {
    const ageVal = parseFloat(age)
    if (isNaN(ageVal) || ageVal < 2 || ageVal > 120) {
      return { isValid: false, error: 'Please enter a valid age between 2 and 120.' }
    }

    let hM = 0
    let wKg = 0
    let displayWeightUnit = 'kg'

    if (unitSystem === 'us') {
      const f = parseFloat(feet)
      const i = parseFloat(inches || '0')
      const w = parseFloat(weightLbs)

      if (isNaN(f) || isNaN(w) || f <= 0 || w <= 0) {
        return { isValid: false, error: 'Please enter positive values for height and weight.' }
      }

      const totalInches = f * 12 + i
      hM = totalInches * 0.0254
      wKg = w * 0.45359237
      displayWeightUnit = 'lbs'
    } else if (unitSystem === 'metric') {
      const h = parseFloat(heightCm)
      const w = parseFloat(weightKg)

      if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
        return { isValid: false, error: 'Please enter positive values for height and weight.' }
      }

      hM = h / 100
      wKg = w
      displayWeightUnit = 'kg'
    } else {
      const h = parseFloat(heightOther)
      const w = parseFloat(weightOther)

      if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
        return { isValid: false, error: 'Please enter positive values for height and weight.' }
      }

      // Convert Height to meters
      if (heightUnit === 'cm') hM = h / 100
      else if (heightUnit === 'm') hM = h
      else if (heightUnit === 'in') hM = h * 0.0254
      else if (heightUnit === 'ft') hM = h * 0.3048

      // Convert Weight to kg
      if (weightUnit === 'kg') wKg = w
      else if (weightUnit === 'lbs') wKg = w * 0.45359237
      else if (weightUnit === 'st') wKg = w * 6.35029318
      displayWeightUnit = weightUnit
    }

    // Safety clamps
    if (hM < 0.4 || hM > 3.0) return { isValid: false, error: 'Height seems out of normal bounds.' }
    if (wKg < 2 || wKg > 800) return { isValid: false, error: 'Weight seems out of normal bounds.' }

    const bmi = wKg / (hM * hM)
    const bmiPrime = bmi / 25
    const ponderalIndex = wKg / Math.pow(hM, 3)

    // Calculate Healthy Weight Range (BMI 18.5 - 25.0) in Kg
    const minHealthyKg = 18.5 * (hM * hM)
    const maxHealthyKg = 25.0 * (hM * hM)

    // Convert healthy weight range to display weight units
    let minHealthyDisp = minHealthyKg
    let maxHealthyDisp = maxHealthyKg
    if (displayWeightUnit === 'lbs') {
      minHealthyDisp = minHealthyKg / 0.45359237
      maxHealthyDisp = maxHealthyKg / 0.45359237
    } else if (displayWeightUnit === 'st') {
      minHealthyDisp = minHealthyKg / 6.35029318
      maxHealthyDisp = maxHealthyKg / 6.35029318
    }

    // Pediatric check
    const isPediatric = ageVal < 20
    let childPercentile = 0
    let childCategory = ''

    if (isPediatric) {
      const data = gender === 'male' ? BOYS_LMS : GIRLS_LMS
      // Linear interpolation of LMS parameters
      let idx = 0
      for (let i = 0; i < data.length - 1; i++) {
        if (ageVal >= data[i].age && ageVal <= data[i + 1].age) {
          idx = i
          break
        }
      }
      const p1 = data[idx]
      const p2 = data[idx + 1]
      const t = (ageVal - p1.age) / (p2.age - p1.age)
      
      const L = p1.L + t * (p2.L - p1.L)
      const M = p1.M + t * (p2.M - p1.M)
      const S = p1.S + t * (p2.S - p1.S)

      // Calculate standard CDC Z-score
      let z = 0
      if (Math.abs(L) > 0.0001) {
        z = (Math.pow(bmi / M, L) - 1) / (L * S)
      } else {
        z = Math.log(bmi / M) / S
      }

      childPercentile = Math.round(normalCDF(z) * 1000) / 10
      childPercentile = Math.max(0.1, Math.min(99.9, childPercentile))

      if (childPercentile < 5) childCategory = 'Underweight'
      else if (childPercentile < 85) childCategory = 'Healthy Weight'
      else if (childPercentile < 95) childCategory = 'Overweight'
      else childCategory = 'Obese'
    }

    // Adult classification
    let adultCategory = ''
    let categoryColor = ''
    if (bmi < 16) {
      adultCategory = 'Severe Thinness'
      categoryColor = 'text-blue-600'
    } else if (bmi < 17) {
      adultCategory = 'Moderate Thinness'
      categoryColor = 'text-blue-500'
    } else if (bmi < 18.5) {
      adultCategory = 'Mild Thinness'
      categoryColor = 'text-cyan-500'
    } else if (bmi < 25) {
      adultCategory = 'Normal Weight'
      categoryColor = 'text-green-600'
    } else if (bmi < 30) {
      adultCategory = 'Overweight'
      categoryColor = 'text-amber-500'
    } else if (bmi < 35) {
      adultCategory = 'Obese (Class I)'
      categoryColor = 'text-orange-600'
    } else if (bmi < 40) {
      adultCategory = 'Obese (Class II)'
      categoryColor = 'text-red-600'
    } else {
      adultCategory = 'Obese (Class III)'
      categoryColor = 'text-red-800'
    }

    // Gauge angle mapping (180 to 0 degrees, left-to-right)
    let needleAngle = 90
    if (isPediatric) {
      // Map child percentiles: Underweight (<5), Healthy (5-85), Overweight (85-95), Obese (>=95)
      if (childPercentile < 5) {
        const factor = childPercentile / 5
        needleAngle = 180 - factor * 45 // 180 to 135 deg
      } else if (childPercentile < 85) {
        const factor = (childPercentile - 5) / 80
        needleAngle = 135 - factor * 45 // 135 to 90 deg
      } else if (childPercentile < 95) {
        const factor = (childPercentile - 85) / 10
        needleAngle = 90 - factor * 45 // 90 to 45 deg
      } else {
        const factor = (childPercentile - 95) / 5
        needleAngle = 45 - factor * 45 // 45 to 0 deg
      }
    } else {
      // Map adult BMI: Thin (<18.5), Normal (18.5-25), Overweight (25-30), Obese (>=30)
      if (bmi < 18.5) {
        const factor = Math.max(0, (bmi - 10) / 8.5)
        needleAngle = 180 - factor * 45 // 180 to 135 deg
      } else if (bmi < 25) {
        const factor = (bmi - 18.5) / 6.5
        needleAngle = 135 - factor * 45 // 135 to 90 deg
      } else if (bmi < 30) {
        const factor = (bmi - 25) / 5
        needleAngle = 90 - factor * 45 // 90 to 45 deg
      } else {
        const factor = Math.min(1, (bmi - 30) / 15)
        needleAngle = 45 - factor * 45 // 45 to 0 deg
      }
    }

    return {
      isValid: true,
      bmi,
      bmiPrime,
      ponderalIndex,
      isPediatric,
      childPercentile,
      childCategory,
      adultCategory,
      categoryColor,
      needleAngle,
      minHealthyDisp,
      maxHealthyDisp,
      displayWeightUnit
    }
  }

  const metrics = getMetrics()
  const {
    bmi = 0,
    bmiPrime = 0,
    ponderalIndex = 0,
    isPediatric = false,
    childPercentile = 0,
    childCategory = '',
    adultCategory = '',
    categoryColor = '',
    needleAngle = 90,
    minHealthyDisp = 0,
    maxHealthyDisp = 0,
    displayWeightUnit = 'kg'
  } = metrics.isValid ? metrics : {}

  return (
    <FormCalculatorShell title="BMI Calculator" subtitle="Body Mass Index Calculator" badge="HEALTH">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="space-y-4 no-print">
          {/* Unit System Tabs */}
          <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-xl border border-neutral-300">
            <button
              onClick={() => { setUnitSystem('us'); setErrorMsg('') }}
              className={`flex-1 py-2 text-xs font-bold font-mono rounded-lg transition-all ${unitSystem === 'us' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              US Units
            </button>
            <button
              onClick={() => { setUnitSystem('metric'); setErrorMsg('') }}
              className={`flex-1 py-2 text-xs font-bold font-mono rounded-lg transition-all ${unitSystem === 'metric' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              Metric
            </button>
            <button
              onClick={() => { setUnitSystem('other'); setErrorMsg('') }}
              className={`flex-1 py-2 text-xs font-bold font-mono rounded-lg transition-all ${unitSystem === 'other' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              Other Units
            </button>
          </div>

          {/* Demographic Data */}
          <div className="grid grid-cols-2 gap-4">
            <RetroInput
              label="Age (Ages 2-120)"
              value={age}
              onChange={(val) => { setAge(val); setErrorMsg('') }}
              placeholder="25"
              id="bmi-age"
              type="number"
              min={2}
              max={120}
            />
            
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-lg border border-neutral-300 h-10 items-center">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 py-1 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${gender === 'male' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 py-1 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${gender === 'female' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                  Female
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Height/Weight inputs */}
          {unitSystem === 'us' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <RetroInput
                  label="Height (Feet)"
                  value={feet}
                  onChange={setFeet}
                  placeholder="5"
                  id="bmi-feet"
                  unit="ft"
                />
                <RetroInput
                  label="Height (Inches)"
                  value={inches}
                  onChange={setInches}
                  placeholder="10"
                  id="bmi-inches"
                  unit="in"
                />
              </div>
              <RetroInput
                label="Weight (Pounds)"
                value={weightLbs}
                onChange={setWeightLbs}
                placeholder="160"
                id="bmi-lbs"
                unit="lbs"
              />
            </div>
          )}

          {unitSystem === 'metric' && (
            <div className="grid grid-cols-2 gap-4">
              <RetroInput
                label="Height"
                value={heightCm}
                onChange={setHeightCm}
                placeholder="178"
                id="bmi-height-cm"
                unit="cm"
              />
              <RetroInput
                label="Weight"
                value={weightKg}
                onChange={setWeightKg}
                placeholder="75"
                id="bmi-weight-kg"
                unit="kg"
              />
            </div>
          )}

          {unitSystem === 'other' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <RetroInput
                  label="Height"
                  value={heightOther}
                  onChange={setHeightOther}
                  placeholder="1.78"
                  id="bmi-height-other"
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
                  id="bmi-height-unit"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <RetroInput
                  label="Weight"
                  value={weightOther}
                  onChange={setWeightOther}
                  placeholder="75"
                  id="bmi-weight-other"
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
                  id="bmi-weight-unit"
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-mono font-bold text-red-600 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <RetroActionButton
              onClick={() => {
                const check = getMetrics()
                if (!check.isValid) {
                  setErrorMsg(check.error || 'Invalid inputs')
                  setIsCalculated(false)
                } else {
                  setErrorMsg('')
                  setIsCalculated(true)
                }
              }}
              variant="primary"
              fullWidth
            >
              Calculate
            </RetroActionButton>
            <RetroActionButton onClick={handleClear} variant="secondary">
              Clear
            </RetroActionButton>
          </div>
        </div>

        {/* Right Column: Visual Gauge & Metrics Dashboard */}
        <div className="bg-[#eae7df]/50 border-2 border-[#dad6cd] rounded-xl p-4 sm:p-5 h-full flex flex-col justify-between print-target">
          {isCalculated && metrics.isValid ? (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-[10px] font-extrabold font-mono text-neutral-500 uppercase tracking-widest">
                  Analysis Result
                </span>
                <h3 className="text-2xl font-black text-neutral-800 font-mono mt-0.5">
                  BMI = {bmi.toFixed(1)} <span className="text-sm font-bold text-neutral-500">kg/m²</span>
                </h3>
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-white border border-[#dad6cd] ${categoryColor}`}>
                    <Activity className="w-3.5 h-3.5" />
                    {isPediatric ? childCategory : adultCategory}
                  </span>
                </div>
              </div>

              {/* Speedometer Arc Gauge */}
              <div className="relative w-full max-w-[280px] mx-auto pt-2">
                <svg viewBox="0 0 100 55" className="w-full overflow-visible">
                  {/* Background Outer Circle Track */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#eae7df"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {/* Underweight Segment (Blue) */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 21.72 21.72"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    className="opacity-90 hover:opacity-100 transition-opacity cursor-help"
                  >
                    <title>Underweight</title>
                  </path>
                  {/* Normal weight Segment (Green) */}
                  <path
                    d="M 21.72 21.72 A 40 40 0 0 1 50 10"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    className="opacity-90 hover:opacity-100 transition-opacity cursor-help"
                  >
                    <title>Normal</title>
                  </path>
                  {/* Overweight Segment (Yellow) */}
                  <path
                    d="M 50 10 A 40 40 0 0 1 78.28 21.72"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="8"
                    className="opacity-90 hover:opacity-100 transition-opacity cursor-help"
                  >
                    <title>Overweight</title>
                  </path>
                  {/* Obese Segment (Red) */}
                  <path
                    d="M 78.28 21.72 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="8"
                    className="opacity-90 hover:opacity-100 transition-opacity cursor-help"
                  >
                    <title>Obese</title>
                  </path>

                  {/* Arc ticks */}
                  <line x1="10" y1="50" x2="13" y2="50" stroke="#737373" strokeWidth="1" />
                  <line x1="21.72" y1="21.72" x2="23.84" y2="23.84" stroke="#737373" strokeWidth="1" />
                  <line x1="50" y1="10" x2="50" y2="13" stroke="#737373" strokeWidth="1" />
                  <line x1="78.28" y1="21.72" x2="76.16" y2="23.84" stroke="#737373" strokeWidth="1" />
                  <line x1="90" y1="50" x2="87" y2="50" stroke="#737373" strokeWidth="1" />

                  {/* Segment Text Labels */}
                  <text x="14" y="47" fontSize="3.5" fontFamily="monospace" fontWeight="bold" fill="#4b5563" textAnchor="start">UNDER</text>
                  <text x="31" y="22" fontSize="3.5" fontFamily="monospace" fontWeight="bold" fill="#4b5563" textAnchor="middle">NORMAL</text>
                  <text x="69" y="22" fontSize="3.5" fontFamily="monospace" fontWeight="bold" fill="#4b5563" textAnchor="middle">OVER</text>
                  <text x="86" y="47" fontSize="3.5" fontFamily="monospace" fontWeight="bold" fill="#4b5563" textAnchor="end">OBESE</text>

                  {/* Needle Pin and Pointer */}
                  <g style={{ transform: `rotate(${90 - needleAngle}deg)`, transformOrigin: '50px 50px', transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                    {/* Shadow needle */}
                    <polygon points="49.5,50 50,11 50.5,50" fill="rgba(0,0,0,0.15)" style={{ transform: 'translateX(1px) translateY(1px)' }} />
                    {/* Real pointer needle */}
                    <polygon points="49,50 50,11 51,50" fill="#1f2937" />
                    <circle cx="50" cy="50" r="3" fill="#1f2937" />
                    <circle cx="50" cy="50" r="1.5" fill="#fcfbfa" />
                  </g>
                </svg>
              </div>

              {/* Health Metrics List */}
              <div className="space-y-2 pt-2 border-t border-neutral-300">
                {isPediatric && (
                  <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-0.5">Pediatric Percentile</div>
                    <div className="text-sm font-mono font-bold text-neutral-800">
                      {childPercentile}th Percentile <span className="text-xs font-normal text-neutral-500">for age & sex</span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  <ResultDisplay label="BMI Prime" value={bmiPrime.toFixed(2)} />
                  <ResultDisplay label="Ponderal Index" value={ponderalIndex.toFixed(1)} unit="kg/m³" />
                </div>
                
                <div className="p-3 bg-green-50/50 border border-green-200 rounded-lg">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-0.5 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-green-600" />
                    Healthy Weight for Height
                  </div>
                  <div className="text-sm font-mono font-bold text-neutral-800">
                    {minHealthyDisp.toFixed(1)} - {maxHealthyDisp.toFixed(1)} {displayWeightUnit}
                  </div>
                  <p className="text-[9px] text-neutral-500 font-mono mt-1">
                    Corresponds to normal BMI range (18.5 - 25.0 kg/m²) for adults.
                  </p>
                </div>
              </div>

              <ShareExportPanel
                queryParams={queryParams}
                emailSubject="Body Mass Index (BMI) Results"
                emailBody={
                  `BMI Calculation Results:\n` +
                  `- Gender: ${gender === 'male' ? 'Male' : 'Female'}\n` +
                  `- Age: ${age}\n` +
                  `- BMI: ${metrics.isValid ? bmi.toFixed(1) : ''} kg/m²\n` +
                  `- Classification: ${metrics.isValid ? (isPediatric ? childCategory : adultCategory) : ''}\n` +
                  `- Healthy Weight Range: ${metrics.isValid ? minHealthyDisp.toFixed(1) + ' - ' + maxHealthyDisp.toFixed(1) + ' ' + displayWeightUnit : ''}`
                }
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <Info className="w-12 h-12 text-neutral-400 stroke-1 mb-3" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Inputs</p>
              <p className="text-[10px] font-mono mt-1 max-w-[200px] leading-relaxed">
                Provide your age, gender, height, and weight, then click calculate to view results.
              </p>
            </div>
          )}
        </div>
      </div>


    </FormCalculatorShell>
  )
}
