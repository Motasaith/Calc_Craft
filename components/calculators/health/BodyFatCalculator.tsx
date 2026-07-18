'use client'
import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect, RetroActionButton } from '../shared/FormCalculatorShell'
import ShareExportPanel from '../shared/ShareExportPanel'
import { calculateBodyFatNavy } from '@/lib/calc-engine'
import { Activity, Info, AlertTriangle, ChevronRight } from 'lucide-react'

export default function BodyFatCalculator() {
  const [unitSystem, setUnitSystem] = useState<'us' | 'metric' | 'other'>('us')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState<string>('25')

  // US Customary Inputs
  const [weightLbs, setWeightLbs] = useState('152')
  const [heightFt, setHeightFt] = useState('5')
  const [heightIn, setHeightIn] = useState('10.5')
  const [neckFt, setNeckFt] = useState('1')
  const [neckIn, setNeckIn] = useState('7.5')
  const [waistFt, setWaistFt] = useState('3')
  const [waistIn, setWaistIn] = useState('1.5')
  const [hipFt, setHipFt] = useState('3')
  const [hipIn, setHipIn] = useState('2')

  // Metric Inputs
  const [weightKg, setWeightKg] = useState('70')
  const [heightCm, setHeightCm] = useState('178')
  const [neckCm, setNeckCm] = useState('50')
  const [waistCm, setWaistCm] = useState('96')
  const [hipCm, setHipCm] = useState('96')

  // Other Units Inputs
  const [weightValue, setWeightValue] = useState('70')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs' | 'st'>('kg')
  const [heightValue, setHeightValue] = useState('178')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'm' | 'in' | 'ft'>('cm')
  const [neckValue, setNeckValue] = useState('50')
  const [neckUnit, setNeckUnit] = useState<'cm' | 'm' | 'in' | 'ft'>('cm')
  const [waistValue, setWaistValue] = useState('96')
  const [waistUnit, setWaistUnit] = useState<'cm' | 'm' | 'in' | 'ft'>('cm')
  const [hipValue, setHipValue] = useState('96')
  const [hipUnit, setHipUnit] = useState<'cm' | 'm' | 'in' | 'ft'>('cm')

  // Calculation Trigger
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
      params.set('h', heightFt)
      params.set('hi', heightIn)
      params.set('n', neckFt)
      params.set('ni', neckIn)
      params.set('wa', waistFt)
      params.set('wai', waistIn)
      params.set('hp', hipFt)
      params.set('hpi', hipIn)
    } else if (unitSystem === 'metric') {
      params.set('w', weightKg)
      params.set('h', heightCm)
      params.set('n', neckCm)
      params.set('wa', waistCm)
      params.set('hp', hipCm)
    }
    setQueryParams(params.toString())
  }, [gender, age, unitSystem, weightLbs, heightFt, heightIn, neckFt, neckIn, waistFt, waistIn, hipFt, hipIn, weightKg, heightCm, neckCm, waistCm, hipCm])

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
        if (h) setHeightFt(h)
        const hi = params.get('hi')
        if (hi) setHeightIn(hi)
        const n = params.get('n')
        if (n) setNeckFt(n)
        const ni = params.get('ni')
        if (ni) setNeckIn(ni)
        const wa = params.get('wa')
        if (wa) setWaistFt(wa)
        const wai = params.get('wai')
        if (wai) setWaistIn(wai)
        const hp = params.get('hp')
        if (hp) setHipFt(hp)
        const hpi = params.get('hpi')
        if (hpi) setHipIn(hpi)
      } else if (u === 'metric') {
        if (w) setWeightKg(w)
        if (h) setHeightCm(h)
        const n = params.get('n')
        if (n) setNeckCm(n)
        const wa = params.get('wa')
        if (wa) setWaistCm(wa)
        const hp = params.get('hp')
        if (hp) setHipCm(hp)
      }
      if (w) setIsCalculated(true)
    }
  }, [])

  const handleClear = () => {
    setAge('25')
    setGender('male')
    // Reset US
    setWeightLbs('152')
    setHeightFt('5')
    setHeightIn('10.5')
    setNeckFt('1')
    setNeckIn('7.5')
    setWaistFt('3')
    setWaistIn('1.5')
    setHipFt('3')
    setHipIn('2')
    // Reset Metric
    setWeightKg('70')
    setHeightCm('178')
    setNeckCm('50')
    setWaistCm('96')
    setHipCm('96')
    // Reset Other
    setWeightValue('70')
    setWeightUnit('kg')
    setHeightValue('178')
    setHeightUnit('cm')
    setNeckValue('50')
    setNeckUnit('cm')
    setWaistValue('96')
    setWaistUnit('cm')
    setHipValue('96')
    setHipUnit('cm')
    setIsCalculated(false)
    setErrorMsg('')
  }

  // Ideal body fat by age (Jackson & Pollock method) with linear interpolation
  const getIdealBodyFat = (sex: 'male' | 'female', ageVal: number) => {
    if (sex === 'male') {
      if (ageVal <= 20) return 8.5
      if (ageVal >= 55) return 20.9
      const brackets = [
        { a: 20, v: 8.5 },
        { a: 25, v: 10.5 },
        { a: 30, v: 12.7 },
        { a: 35, v: 13.7 },
        { a: 40, v: 15.3 },
        { a: 45, v: 16.4 },
        { a: 50, v: 18.9 },
        { a: 55, v: 20.9 }
      ]
      for (let i = 0; i < brackets.length - 1; i++) {
        if (ageVal >= brackets[i].a && ageVal <= brackets[i + 1].a) {
          const t = (ageVal - brackets[i].a) / (brackets[i + 1].a - brackets[i].a)
          return brackets[i].v + t * (brackets[i + 1].v - brackets[i].v)
        }
      }
      return 10.5
    } else {
      if (ageVal <= 20) return 17.7
      if (ageVal >= 55) return 26.3
      const brackets = [
        { a: 20, v: 17.7 },
        { a: 25, v: 18.4 },
        { a: 30, v: 19.3 },
        { a: 35, v: 21.5 },
        { a: 40, v: 22.2 },
        { a: 45, v: 22.9 },
        { a: 50, v: 25.2 },
        { a: 55, v: 26.3 }
      ]
      for (let i = 0; i < brackets.length - 1; i++) {
        if (ageVal >= brackets[i].a && ageVal <= brackets[i + 1].a) {
          const t = (ageVal - brackets[i].a) / (brackets[i + 1].a - brackets[i].a)
          return brackets[i].v + t * (brackets[i + 1].v - brackets[i].v)
        }
      }
      return 18.4
    }
  }

  // Get metrics calculations
  const getMetrics = () => {
    const ageVal = parseFloat(age)
    if (isNaN(ageVal) || ageVal < 2 || ageVal > 120) {
      return { isValid: false, error: 'Please enter a valid age between 2 and 120.' }
    }

    let hCm = 0
    let wKg = 0
    let nCm = 0
    let wtCm = 0
    let hpCm: number | undefined = undefined
    let displayWeightUnit = 'lbs'

    const parseUSField = (ft: string, inch: string) => {
      const f = parseFloat(ft || '0')
      const i = parseFloat(inch || '0')
      return (f * 12 + i) * 2.54 // Convert total inches to cm
    }

    const convertToCm = (val: number, unit: 'cm' | 'm' | 'in' | 'ft') => {
      if (unit === 'cm') return val
      if (unit === 'm') return val * 100
      if (unit === 'in') return val * 2.54
      return val * 30.48
    }

    if (unitSystem === 'us') {
      const wtLbs = parseFloat(weightLbs)
      if (isNaN(wtLbs) || wtLbs <= 0) {
        return { isValid: false, error: 'Please enter a valid weight in pounds.' }
      }
      wKg = wtLbs * 0.45359237
      hCm = parseUSField(heightFt, heightIn)
      nCm = parseUSField(neckFt, neckIn)
      wtCm = parseUSField(waistFt, waistIn)
      if (gender === 'female') {
        hpCm = parseUSField(hipFt, hipIn)
      }
      displayWeightUnit = 'lbs'
    } else if (unitSystem === 'metric') {
      const wtKg = parseFloat(weightKg)
      const htCm = parseFloat(heightCm)
      const nkCm = parseFloat(neckCm)
      const wstCm = parseFloat(waistCm)
      const hpsCm = parseFloat(hipCm)

      if (isNaN(wtKg) || isNaN(htCm) || isNaN(nkCm) || isNaN(wstCm) || wtKg <= 0 || htCm <= 0 || nkCm <= 0 || wstCm <= 0) {
        return { isValid: false, error: 'Please enter valid positive measurements.' }
      }
      wKg = wtKg
      hCm = htCm
      nCm = nkCm
      wtCm = wstCm
      if (gender === 'female') {
        if (isNaN(hpsCm) || hpsCm <= 0) {
          return { isValid: false, error: 'Please enter a valid hip measurement.' }
        }
        hpCm = hpsCm
      }
      displayWeightUnit = 'kg'
    } else {
      const wtVal = parseFloat(weightValue)
      const htVal = parseFloat(heightValue)
      const nkVal = parseFloat(neckValue)
      const wstVal = parseFloat(waistValue)
      const hpsVal = parseFloat(hipValue)

      if (isNaN(wtVal) || isNaN(htVal) || isNaN(nkVal) || isNaN(wstVal) || wtVal <= 0 || htVal <= 0 || nkVal <= 0 || wstVal <= 0) {
        return { isValid: false, error: 'Please enter valid positive measurements.' }
      }

      if (weightUnit === 'kg') wKg = wtVal
      else if (weightUnit === 'lbs') wKg = wtVal * 0.45359237
      else if (weightUnit === 'st') wKg = wtVal * 6.35029318

      hCm = convertToCm(htVal, heightUnit)
      nCm = convertToCm(nkVal, neckUnit)
      wtCm = convertToCm(wstVal, waistUnit)
      if (gender === 'female') {
        if (isNaN(hpsVal) || hpsVal <= 0) {
          return { isValid: false, error: 'Please enter a valid hip measurement.' }
        }
        hpCm = convertToCm(hpsVal, hipUnit)
      }
      displayWeightUnit = weightUnit
    }

    // Safety checks for US Navy formulas
    if (hCm <= 0 || nCm <= 0 || wtCm <= 0 || wKg <= 0) {
      return { isValid: false, error: 'Please provide valid physical measurements.' }
    }
    if (gender === 'male' && wtCm <= nCm) {
      return { isValid: false, error: 'Waist circumference must be larger than neck circumference.' }
    }
    if (gender === 'female' && (!hpCm || (wtCm + hpCm <= nCm))) {
      return { isValid: false, error: 'Waist + Hip circumferences must be larger than neck circumference.' }
    }

    // Calculate Body Fat (US Navy Method)
    const bfNavy = calculateBodyFatNavy(gender, hCm, wtCm, nCm, hpCm)
    if (bfNavy <= 0 || bfNavy > 70) {
      return { isValid: false, error: 'Could not calculate valid body fat. Please double-check your measurements.' }
    }

    // Calculate BMI
    const heightM = hCm / 100
    const bmi = wKg / (heightM * heightM)

    // Calculate BMI method body fat (Deurenberg)
    let bfBmi = 0
    if (ageVal >= 15) {
      bfBmi = 1.20 * bmi + 0.23 * ageVal - 10.8 * (gender === 'male' ? 1 : 0) - 5.4
    } else {
      bfBmi = 1.51 * bmi - 0.70 * ageVal - 3.6 * (gender === 'male' ? 1 : 0) + 1.4
    }
    bfBmi = Math.max(2, Math.min(60, bfBmi))

    // Jackson & Pollock Ideal body fat
    const idealBf = getIdealBodyFat(gender, ageVal)

    // Body fat mass
    const bfMassKg = wKg * (bfNavy / 100)
    const lbmKg = wKg - bfMassKg

    // Body fat to lose to reach ideal
    const bfToLoseKg = bfNavy > idealBf ? wKg * (bfNavy - idealBf) / 100 : 0

    // Conversions
    const convertWeightToDisplay = (kgVal: number) => {
      if (displayWeightUnit === 'lbs') return kgVal / 0.45359237
      if (displayWeightUnit === 'st') return kgVal / 6.35029318
      return kgVal
    }

    const bfMassDisp = convertWeightToDisplay(bfMassKg)
    const lbmDisp = convertWeightToDisplay(lbmKg)
    const bfToLoseDisp = convertWeightToDisplay(bfToLoseKg)

    // Category and Color
    let category = ''
    let categoryColor = ''
    let sliderPos = 50 // Horizontal indicator coordinate (10px to 90px in 100px SVG space)

    if (gender === 'male') {
      if (bfNavy < 2) {
        category = 'Essential Fat'
        categoryColor = 'text-red-500'
        sliderPos = 10
      } else if (bfNavy < 6) {
        category = 'Essential Fat'
        categoryColor = 'text-red-500'
        const factor = (bfNavy - 2) / 4
        sliderPos = 10 + factor * 15 // 10 to 25
      } else if (bfNavy < 14) {
        category = 'Athletes'
        categoryColor = 'text-green-600'
        const factor = (bfNavy - 6) / 8
        sliderPos = 25 + factor * 20 // 25 to 45
      } else if (bfNavy < 18) {
        category = 'Fitness'
        categoryColor = 'text-emerald-600'
        const factor = (bfNavy - 14) / 4
        sliderPos = 45 + factor * 15 // 45 to 60
      } else if (bfNavy < 25) {
        category = 'Average'
        categoryColor = 'text-amber-500'
        const factor = (bfNavy - 18) / 7
        sliderPos = 60 + factor * 18 // 60 to 78
      } else {
        category = 'Obese'
        categoryColor = 'text-red-600 font-bold'
        const factor = Math.min(1, (bfNavy - 25) / 15)
        sliderPos = 78 + factor * 12 // 78 to 90
      }
    } else {
      if (bfNavy < 10) {
        category = 'Essential Fat'
        categoryColor = 'text-red-500'
        sliderPos = 10
      } else if (bfNavy < 14) {
        category = 'Essential Fat'
        categoryColor = 'text-red-500'
        const factor = (bfNavy - 10) / 4
        sliderPos = 10 + factor * 15 // 10 to 25
      } else if (bfNavy < 21) {
        category = 'Athletes'
        categoryColor = 'text-green-600'
        const factor = (bfNavy - 14) / 7
        sliderPos = 25 + factor * 20 // 25 to 45
      } else if (bfNavy < 25) {
        category = 'Fitness'
        categoryColor = 'text-emerald-600'
        const factor = (bfNavy - 21) / 4
        sliderPos = 45 + factor * 15 // 45 to 60
      } else if (bfNavy < 32) {
        category = 'Average'
        categoryColor = 'text-amber-500'
        const factor = (bfNavy - 25) / 7
        sliderPos = 60 + factor * 18 // 60 to 78
      } else {
        category = 'Obese'
        categoryColor = 'text-red-600 font-bold'
        const factor = Math.min(1, (bfNavy - 32) / 18)
        sliderPos = 78 + factor * 12 // 78 to 90
      }
    }

    return {
      isValid: true,
      bfNavy,
      bfBmi,
      idealBf,
      bfMassDisp,
      lbmDisp,
      bfToLoseDisp,
      category,
      categoryColor,
      sliderPos,
      displayWeightUnit
    }
  }

  const metrics = getMetrics()
  const {
    bfNavy = 0,
    bfBmi = 0,
    idealBf = 0,
    bfMassDisp = 0,
    lbmDisp = 0,
    bfToLoseDisp = 0,
    category = '',
    categoryColor = '',
    sliderPos = 50,
    displayWeightUnit = 'lbs'
  } = metrics.isValid ? metrics : {}

  return (
    <FormCalculatorShell title="Body Fat Calculator" subtitle="U.S. Navy Body Fat Percentage Calculator" badge="HEALTH">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="space-y-4 no-print">
          {/* Unit Tabs */}
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
              Metric Units
            </button>
            <button
              onClick={() => { setUnitSystem('other'); setErrorMsg('') }}
              className={`flex-1 py-2 text-xs font-bold font-mono rounded-lg transition-all ${unitSystem === 'other' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              Other Units
            </button>
          </div>

          {/* Gender and Age */}
          <div className="grid grid-cols-2 gap-4">
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

            <RetroInput
              label="Age (Ages 2-120)"
              value={age}
              onChange={(val) => { setAge(val); setErrorMsg('') }}
              placeholder="25"
              id="bf-age"
              type="number"
              min={2}
              max={120}
            />
          </div>

          {/* Conditional Height/Weight/Circumferences based on units */}
          {unitSystem === 'us' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <RetroInput label="Height (Ft)" value={heightFt} onChange={setHeightFt} placeholder="5" id="bf-h-ft" type="number" />
                <RetroInput label="Height (In)" value={heightIn} onChange={setHeightIn} placeholder="10" id="bf-h-in" type="number" />
                <RetroInput label="Weight (Lbs)" value={weightLbs} onChange={setWeightLbs} placeholder="150" id="bf-w-lbs" type="number" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-1.5">
                  <RetroInput label="Neck (Ft)" value={neckFt} onChange={setNeckFt} placeholder="1" id="bf-n-ft" type="number" />
                  <RetroInput label="Neck (In)" value={neckIn} onChange={setNeckIn} placeholder="7.5" id="bf-n-in" type="number" />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <RetroInput label="Waist (Ft)" value={waistFt} onChange={setWaistFt} placeholder="3" id="bf-wst-ft" type="number" />
                  <RetroInput label="Waist (In)" value={waistIn} onChange={setWaistIn} placeholder="1.5" id="bf-wst-in" type="number" />
                </div>
              </div>

              {gender === 'female' && (
                <div className="grid grid-cols-2 gap-1.5 w-1/2">
                  <RetroInput label="Hip (Ft)" value={hipFt} onChange={setHipFt} placeholder="3" id="bf-hp-ft" type="number" />
                  <RetroInput label="Hip (In)" value={hipIn} onChange={setHipIn} placeholder="2" id="bf-hp-in" type="number" />
                </div>
              )}
            </div>
          )}

          {unitSystem === 'metric' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <RetroInput label="Height (cm)" value={heightCm} onChange={setHeightCm} placeholder="178" id="bf-h-cm" type="number" />
                <RetroInput label="Weight (kg)" value={weightKg} onChange={setWeightKg} placeholder="70" id="bf-w-kg" type="number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <RetroInput label="Neck (cm)" value={neckCm} onChange={setNeckCm} placeholder="38" id="bf-n-cm" type="number" />
                <RetroInput label="Waist (cm)" value={waistCm} onChange={setWaistCm} placeholder="86" id="bf-wst-cm" type="number" />
              </div>
              {gender === 'female' && (
                <div className="w-1/2 pr-2">
                  <RetroInput label="Hip (cm)" value={hipCm} onChange={setHipCm} placeholder="96" id="bf-hp-cm" type="number" />
                </div>
              )}
            </div>
          )}

          {unitSystem === 'other' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-4">
                <RetroInput
                  label="Height"
                  value={heightValue}
                  onChange={setHeightValue}
                  placeholder="178"
                  id="bf-h-oth"
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
                  id="bf-h-unit"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <RetroInput
                  label="Weight"
                  value={weightValue}
                  onChange={setWeightValue}
                  placeholder="70"
                  id="bf-w-oth"
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
                  id="bf-w-unit"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <RetroInput
                  label="Neck"
                  value={neckValue}
                  onChange={setNeckValue}
                  placeholder="38"
                  id="bf-n-oth"
                  type="number"
                />
                <RetroSelect
                  label="Neck Unit"
                  value={neckUnit}
                  onChange={(val) => setNeckUnit(val as any)}
                  options={[
                    { value: 'cm', label: 'Centimeters (cm)' },
                    { value: 'm', label: 'Meters (m)' },
                    { value: 'in', label: 'Inches (in)' },
                    { value: 'ft', label: 'Feet (ft)' }
                  ]}
                  id="bf-n-unit"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <RetroInput
                  label="Waist"
                  value={waistValue}
                  onChange={setWaistValue}
                  placeholder="86"
                  id="bf-wst-oth"
                  type="number"
                />
                <RetroSelect
                  label="Waist Unit"
                  value={waistUnit}
                  onChange={(val) => setWaistUnit(val as any)}
                  options={[
                    { value: 'cm', label: 'Centimeters (cm)' },
                    { value: 'm', label: 'Meters (m)' },
                    { value: 'in', label: 'Inches (in)' },
                    { value: 'ft', label: 'Feet (ft)' }
                  ]}
                  id="bf-wst-unit"
                />
              </div>

              {gender === 'female' && (
                <div className="grid grid-cols-2 gap-4">
                  <RetroInput
                    label="Hip"
                    value={hipValue}
                    onChange={setHipValue}
                    placeholder="96"
                    id="bf-hp-oth"
                    type="number"
                  />
                  <RetroSelect
                    label="Hip Unit"
                    value={hipUnit}
                    onChange={(val) => setHipUnit(val as any)}
                    options={[
                      { value: 'cm', label: 'Centimeters (cm)' },
                      { value: 'm', label: 'Meters (m)' },
                      { value: 'in', label: 'Inches (in)' },
                      { value: 'ft', label: 'Feet (ft)' }
                    ]}
                    id="bf-hp-unit"
                  />
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-[11px] text-red-600 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
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
                  Body Fat = {bfNavy.toFixed(1)}%
                </h3>
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-white border border-[#dad6cd] ${categoryColor}`}>
                    <Activity className="w-3.5 h-3.5" />
                    {category}
                  </span>
                </div>
              </div>

              {/* Horizontal Slider Progress Bar Gauge */}
              <div className="relative w-full max-w-[280px] mx-auto pt-5 pb-6">
                <div className="text-[9px] font-bold text-center font-mono text-neutral-600 mb-1 flex justify-between px-1">
                  <span>{bfNavy.toFixed(1)}%</span>
                  <span className="uppercase text-neutral-400">indicator</span>
                </div>
                <svg viewBox="0 0 100 22" className="w-full overflow-visible">
                  {/* Slider background segments */}
                  {/* Segment 1: Essential (2-6% men, 10-14% women) -> 10 to 25 */}
                  <rect x="10" y="8" width="15" height="6" fill="#ef4444" opacity="0.8" rx="1" />
                  {/* Segment 2: Athletes (6-14% men, 14-21% women) -> 25 to 45 */}
                  <rect x="25" y="8" width="20" height="6" fill="#10b981" opacity="0.8" rx="1" />
                  {/* Segment 3: Fitness (14-17% men, 21-25% women) -> 45 to 60 */}
                  <rect x="45" y="8" width="15" height="6" fill="#059669" opacity="0.8" rx="1" />
                  {/* Segment 4: Average (17-25% men, 25-32% women) -> 60 to 78 */}
                  <rect x="60" y="8" width="18" height="6" fill="#f59e0b" opacity="0.8" rx="1" />
                  {/* Segment 5: Obese (>=25% men, >=32% women) -> 78 to 90 */}
                  <rect x="78" y="8" width="12" height="6" fill="#b91c1c" opacity="0.8" rx="1" />

                  {/* Tick labels */}
                  <text x="10" y="19" fontSize="2.5" fontFamily="monospace" fill="#737373" textAnchor="middle">{gender === 'male' ? '2%' : '10%'}</text>
                  <text x="25" y="19" fontSize="2.5" fontFamily="monospace" fill="#737373" textAnchor="middle">{gender === 'male' ? '6%' : '14%'}</text>
                  <text x="45" y="19" fontSize="2.5" fontFamily="monospace" fill="#737373" textAnchor="middle">{gender === 'male' ? '14%' : '21%'}</text>
                  <text x="60" y="19" fontSize="2.5" fontFamily="monospace" fill="#737373" textAnchor="middle">{gender === 'male' ? '18%' : '25%'}</text>
                  <text x="78" y="19" fontSize="2.5" fontFamily="monospace" fill="#737373" textAnchor="middle">{gender === 'male' ? '25%' : '32%'}</text>

                  {/* Pointer indicator */}
                  <g style={{ transform: `translateX(${sliderPos - 50}px)`, transformOrigin: '50px 8px', transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                    <polygon points="50,8 48,2 52,2" fill="#171717" />
                    <line x1="50" y1="2" x2="50" y2="14" stroke="#171717" strokeWidth="0.8" />
                  </g>
                </svg>
                <div className="flex justify-between text-[7px] font-bold font-mono text-neutral-450 mt-0.5 px-2">
                  <span>ESSENTIAL</span>
                  <span>ATHLETES</span>
                  <span>FITNESS</span>
                  <span>AVERAGE</span>
                  <span>OBESE</span>
                </div>
              </div>

              {/* Table Result Display */}
              <div className="overflow-x-auto border border-neutral-300 rounded-lg">
                <table className="w-full text-left border-collapse text-[10px] font-mono bg-white">
                  <tbody className="divide-y divide-neutral-200">
                    <tr className="even:bg-neutral-50/50">
                      <td className="p-2.5 font-bold text-neutral-500 uppercase tracking-wider">Body Fat (Navy Method)</td>
                      <td className="p-2.5 font-bold text-neutral-800 text-right">{bfNavy.toFixed(1)}%</td>
                    </tr>
                    <tr className="even:bg-neutral-50/50">
                      <td className="p-2.5 font-bold text-neutral-500 uppercase tracking-wider">Body Fat Category</td>
                      <td className={`p-2.5 font-black text-right ${categoryColor}`}>{category}</td>
                    </tr>
                    <tr className="even:bg-neutral-50/50">
                      <td className="p-2.5 font-bold text-neutral-500 uppercase tracking-wider">Body Fat Mass</td>
                      <td className="p-2.5 font-bold text-neutral-800 text-right">{bfMassDisp.toFixed(1)} {displayWeightUnit}</td>
                    </tr>
                    <tr className="even:bg-neutral-50/50">
                      <td className="p-2.5 font-bold text-neutral-500 uppercase tracking-wider">Lean Body Mass</td>
                      <td className="p-2.5 font-bold text-neutral-800 text-right">{lbmDisp.toFixed(1)} {displayWeightUnit}</td>
                    </tr>
                    <tr className="even:bg-neutral-50/50">
                      <td className="p-2.5 font-bold text-neutral-500 uppercase tracking-wider">Ideal Fat for Given Age</td>
                      <td className="p-2.5 font-bold text-neutral-800 text-right">{idealBf.toFixed(1)}%</td>
                    </tr>
                    <tr className="even:bg-neutral-50/50">
                      <td className="p-2.5 font-bold text-neutral-500 uppercase tracking-wider">Fat to Lose to Reach Ideal</td>
                      <td className="p-2.5 font-bold text-neutral-800 text-right">
                        {bfToLoseDisp > 0 ? `${bfToLoseDisp.toFixed(1)} ${displayWeightUnit}` : '0.0 (Below Ideal)'}
                      </td>
                    </tr>
                    <tr className="even:bg-neutral-50/50">
                      <td className="p-2.5 font-bold text-neutral-500 uppercase tracking-wider">Body Fat (BMI Method)</td>
                      <td className="p-2.5 font-bold text-neutral-800 text-right">{bfBmi.toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <ShareExportPanel
                queryParams={queryParams}
                emailSubject="Body Fat Percentage Calculation Results"
                emailBody={
                  `Body Fat Calculator Results:\n` +
                  `- Gender: ${gender === 'male' ? 'Male' : 'Female'}\n` +
                  `- Age: ${age}\n` +
                  `- Body Fat (Navy Method): ${bfNavy.toFixed(1)}%\n` +
                  `- Body Fat (BMI Method): ${bfBmi.toFixed(1)}%\n` +
                  `- Category: ${category}\n` +
                  `- Lean Body Mass: ${lbmDisp.toFixed(1)} ${displayWeightUnit}`
                }
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <Info className="w-12 h-12 text-neutral-400 stroke-1 mb-3" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Inputs</p>
              <p className="text-[10px] font-mono mt-1 max-w-[200px] leading-relaxed">
                Provide your gender, age, weight, and measurements, then click calculate to view body composition results.
              </p>
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
