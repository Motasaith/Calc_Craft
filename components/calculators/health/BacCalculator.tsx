'use client'

import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, RetroActionButton } from '../shared/FormCalculatorShell'
import ShareExportPanel from '../shared/ShareExportPanel'
import { AlertTriangle, ChevronDown, ChevronUp, Activity, Info, Beer, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BacCalculator() {
  // Common states
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [weight, setWeight] = useState('70')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')
  
  // Time states
  const [hours, setHours] = useState('2')
  const [minutes, setMinutes] = useState('0')

  // Drink states
  const [beerQty, setBeerQty] = useState('3')
  const [beerSize, setBeerSize] = useState('330')
  const [beerCustomSize, setBeerCustomSize] = useState('')
  const [beerAbv, setBeerAbv] = useState('5')

  const [wineQty, setWineQty] = useState('0')
  const [wineSize, setWineSize] = useState('150')
  const [wineCustomSize, setWineCustomSize] = useState('')
  const [wineAbv, setWineAbv] = useState('12')

  const [liquorQty, setLiquorQty] = useState('0')
  const [liquorSize, setLiquorSize] = useState('44')
  const [liquorCustomSize, setLiquorCustomSize] = useState('')
  const [liquorAbv, setLiquorAbv] = useState('40')

  const [otherQty, setOtherQty] = useState('0')
  const [otherSize, setOtherSize] = useState('250')
  const [otherSizeUnit, setOtherSizeUnit] = useState<'ml' | 'oz'>('ml')
  const [otherAbv, setOtherAbv] = useState('8')

  // Calculation control states
  const [isCalculated, setIsCalculated] = useState(false)
  const [peakBAC, setPeakBAC] = useState<number | null>(null)
  const [currentBAC, setCurrentBAC] = useState<number | null>(null)
  const [hoursToSober, setHoursToSober] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // SVG chart hover states
  const [hoveredHour, setHoveredHour] = useState<number | null>(null)

  // URL serialization states
  const [queryParams, setQueryParams] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('g', gender)
    params.set('w', weight)
    params.set('u', weightUnit)
    params.set('h', hours)
    params.set('m', minutes)
    params.set('bq', beerQty)
    params.set('bs', beerSize)
    params.set('ba', beerAbv)
    params.set('wq', wineQty)
    params.set('ws', wineSize)
    params.set('wa', wineAbv)
    params.set('lq', liquorQty)
    params.set('ls', liquorSize)
    params.set('la', liquorAbv)
    setQueryParams(params.toString())
  }, [gender, weight, weightUnit, hours, minutes, beerQty, beerSize, beerAbv, wineQty, wineSize, wineAbv, liquorQty, liquorSize, liquorAbv])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const g = params.get('g')
      const w = params.get('w')
      const u = params.get('u')
      const h = params.get('h')
      const m = params.get('m')
      const bq = params.get('bq')
      const bs = params.get('bs')
      const ba = params.get('ba')
      const wq = params.get('wq')
      const ws = params.get('ws')
      const wa = params.get('wa')
      const lq = params.get('lq')
      const ls = params.get('ls')
      const la = params.get('la')

      if (g === 'male' || g === 'female') setGender(g)
      if (w) setWeight(w)
      if (u === 'kg' || u === 'lbs') setWeightUnit(u)
      if (h) setHours(h)
      if (m) setMinutes(m)
      if (bq) setBeerQty(bq)
      if (bs) setBeerSize(bs)
      if (ba) setBeerAbv(ba)
      if (wq) setWineQty(wq)
      if (ws) setWineSize(ws)
      if (wa) setWineAbv(wa)
      if (lq) setLiquorQty(lq)
      if (ls) setLiquorSize(ls)
      if (la) setLiquorAbv(la)

      if (w) {
        setIsCalculated(true)
      }
    }
  }, [])

  const handleClear = () => {
    setGender('male')
    setWeight('70')
    setWeightUnit('kg')
    setHours('2')
    setMinutes('0')
    setBeerQty('3')
    setBeerSize('330')
    setBeerCustomSize('')
    setBeerAbv('5')
    setWineQty('0')
    setWineSize('150')
    setWineCustomSize('')
    setWineAbv('12')
    setLiquorQty('0')
    setLiquorSize('44')
    setLiquorCustomSize('')
    setLiquorAbv('40')
    setOtherQty('0')
    setOtherSize('250')
    setOtherSizeUnit('ml')
    setOtherAbv('8')
    setIsCalculated(false)
    setPeakBAC(null)
    setCurrentBAC(null)
    setHoursToSober(null)
    setErrorMsg('')
    setHoveredHour(null)
  }

  const handleCalculate = () => {
    setErrorMsg('')
    const wVal = parseFloat(weight)
    const hVal = parseFloat(hours)
    const mVal = parseFloat(minutes)

    if (isNaN(wVal) || wVal <= 0) {
      setErrorMsg('Please enter a valid body weight.')
      return
    }

    if (isNaN(hVal) || hVal < 0 || isNaN(mVal) || mVal < 0) {
      setErrorMsg('Please enter valid elapsed time.')
      return
    }

    const elapsedHours = hVal + mVal / 60

    // Convert weight to grams
    let weightGrams = 0
    if (weightUnit === 'kg') {
      weightGrams = wVal * 1000
    } else {
      weightGrams = wVal * 453.59237
    }

    // Widmark gender factor
    const rFactor = gender === 'male' ? 0.68 : 0.55

    // Helper to calculate ml of alcohol
    const getMlSize = (sizeStr: string, customSizeStr: string, unit: 'ml' | 'oz' = 'ml') => {
      let sz = parseFloat(sizeStr === 'custom' ? customSizeStr : sizeStr)
      if (isNaN(sz) || sz <= 0) return 0
      if (unit === 'oz') sz = sz * 29.5735
      return sz
    }

    // Sum alcohol weight from all drinks
    let totalAlcoholGrams = 0

    // Beer
    const bQty = parseFloat(beerQty)
    if (!isNaN(bQty) && bQty > 0) {
      const bSizeMl = getMlSize(beerSize, beerCustomSize, 'ml')
      const bAbv = parseFloat(beerAbv)
      if (!isNaN(bAbv)) {
        totalAlcoholGrams += bQty * bSizeMl * (bAbv / 100) * 0.789
      }
    }

    // Wine
    const wQty = parseFloat(wineQty)
    if (!isNaN(wQty) && wQty > 0) {
      const wSizeMl = getMlSize(wineSize, wineCustomSize, 'ml')
      const wAbv = parseFloat(wineAbv)
      if (!isNaN(wAbv)) {
        totalAlcoholGrams += wQty * wSizeMl * (wAbv / 100) * 0.789
      }
    }

    // Liquor
    const lQty = parseFloat(liquorQty)
    if (!isNaN(lQty) && lQty > 0) {
      const lSizeMl = getMlSize(liquorSize, liquorCustomSize, 'ml')
      const lAbv = parseFloat(liquorAbv)
      if (!isNaN(lAbv)) {
        totalAlcoholGrams += lQty * lSizeMl * (lAbv / 100) * 0.789
      }
    }

    // Other
    const oQty = parseFloat(otherQty)
    if (!isNaN(oQty) && oQty > 0) {
      const oSizeMl = getMlSize(String(otherSize), '', otherSizeUnit)
      const oAbv = parseFloat(String(otherAbv))
      if (!isNaN(oAbv)) {
        totalAlcoholGrams += oQty * oSizeMl * (oAbv / 100) * 0.789
      }
    }

    if (totalAlcoholGrams <= 0) {
      setErrorMsg('Please enter a quantity for at least one drink type.')
      return
    }

    // Calculate peak BAC (Swedish Widmark formula: BAC = [Alcohol in grams / (Weight in grams * r)] * 100)
    const peak = (totalAlcoholGrams / (weightGrams * rFactor)) * 100

    // Rate of elimination is typically 0.015% per hour
    const current = Math.max(0, peak - 0.015 * elapsedHours)

    // Hours to reach 0% since first drink
    const soberTime = peak / 0.015

    setPeakBAC(peak)
    setCurrentBAC(current)
    setHoursToSober(soberTime)
    setIsCalculated(true)
  }

  // Get impairment details based on current BAC
  const getImpairmentDetails = (bac: number) => {
    if (bac <= 0.001) {
      return {
        stage: 'Sober',
        color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        textColor: 'text-emerald-700',
        badge: 'bg-emerald-500 text-white',
        behavior: 'Normal behavior, fully sober.',
        impairment: 'No impairment.'
      }
    }
    if (bac <= 0.029) {
      return {
        stage: 'Subtle Impairment',
        color: 'bg-green-50 border-green-200 text-green-800',
        textColor: 'text-green-700',
        badge: 'bg-green-600 text-white',
        behavior: 'Average individual appears normal. Slight warmth, relaxation, and mild mood elevation.',
        impairment: 'Subtle effects that can only be detected with special clinical tests.'
      }
    }
    if (bac <= 0.059) {
      return {
        stage: 'Mild Euphoria',
        color: 'bg-amber-50 border-amber-200 text-amber-800',
        textColor: 'text-amber-700',
        badge: 'bg-amber-500 text-white',
        behavior: 'Relaxation, joyfulness, increased talkativeness, decreased social inhibition, and flushing.',
        impairment: 'Mild concentration issues, minor reduction in alertness and processing speeds.'
      }
    }
    if (bac <= 0.099) {
      return {
        stage: 'Excitement (Legally Impaired)',
        color: 'bg-orange-50 border-orange-200 text-orange-800',
        textColor: 'text-orange-700',
        badge: 'bg-orange-500 text-white',
        behavior: 'Blunted feelings, emotional swings, reduced sensitivity to pain, boisterousness, and over-expression.',
        impairment: 'Coordination loss, slower reflexes, reasoning, depth perception impairment. (Legally drunk for driving in US: 0.08%+).'
      }
    }
    if (bac <= 0.199) {
      return {
        stage: 'Confusion (Legally Drunk)',
        color: 'bg-red-50 border-red-200 text-red-800',
        textColor: 'text-red-700',
        badge: 'bg-red-600 text-white',
        behavior: 'Emotional instability, loss of critical judgment, slurred speech, confusion, and memory lapses.',
        impairment: 'Gross motor impairment, staggering gait, balance issues, blurred vision, and high risk of nausea/vomiting.'
      }
    }
    if (bac <= 0.299) {
      return {
        stage: 'Stupor (Severe Intoxication)',
        color: 'bg-rose-50 border-rose-200 text-rose-800',
        textColor: 'text-rose-700',
        badge: 'bg-rose-700 text-white',
        behavior: 'Apathy, inertia, inability to stand or walk, vomiting, incontinence, and memory blackouts.',
        impairment: 'Severe motor impairment, loss of consciousness, risks of choking on vomit or falling asleep.'
      }
    }
    if (bac <= 0.399) {
      return {
        stage: 'Severe Depression (Critical)',
        color: 'bg-purple-50 border-purple-200 text-purple-800',
        textColor: 'text-purple-700',
        badge: 'bg-purple-700 text-white',
        behavior: 'Stupor or coma, loss of motor reflexes, respiratory depression, low body temperature, and bradycardia.',
        impairment: 'Lapses in and out of consciousness. High risk of respiratory failure, coma, or sudden death.'
      }
    }
    return {
      stage: 'Fatal Risk (Emergency)',
      color: 'bg-neutral-900 border-neutral-700 text-neutral-100',
      textColor: 'text-neutral-300',
      badge: 'bg-red-800 text-white animate-pulse',
      behavior: 'Comatose, respiratory arrest, loss of airway reflexes, circulatory collapse, and pupillary dilation.',
      impairment: 'Extremely high possibility of death from alcohol poisoning.'
    }
  }

  // Elapsed hours calculation
  const elapsed = parseFloat(hours) + parseFloat(minutes) / 60
  const peakVal = peakBAC || 0
  const soberVal = hoursToSober || 0
  const currentVal = currentBAC || 0
  const remainingHours = Math.max(0, soberVal - elapsed)

  const imp = getImpairmentDetails(currentVal)

  // Chart config
  const cWidth = 440
  const cHeight = 160
  const paddingLeft = 35
  const paddingRight = 15
  const paddingTop = 15
  const paddingBottom = 25
  const graphWidth = cWidth - paddingLeft - paddingRight
  const graphHeight = cHeight - paddingTop - paddingBottom

  // Math helper for curve rendering
  // Time scale: 0 to soberVal. Y scale: 0 to peakVal
  const getCoordinatesForHour = (h: number) => {
    if (soberVal <= 0) return { x: paddingLeft, y: paddingTop + graphHeight }
    const xFraction = h / soberVal
    const yFraction = Math.max(0, peakVal - 0.015 * h) / peakVal

    return {
      x: paddingLeft + xFraction * graphWidth,
      y: paddingTop + graphHeight - yFraction * graphHeight
    }
  }

  // Generate chart data path
  let pathD = ''
  if (isCalculated && soberVal > 0) {
    const start = getCoordinatesForHour(0)
    pathD = `M ${start.x} ${start.y}`
    // Plot points every 0.5 hours
    for (let h = 0.5; h <= soberVal; h += 0.5) {
      const pt = getCoordinatesForHour(h)
      pathD += ` L ${pt.x} ${pt.y}`
    }
    // Final point
    const end = getCoordinatesForHour(soberVal)
    pathD += ` L ${end.x} ${end.y}`
  }

  // Coordinates for the current elapsed marker
  const markerPos = getCoordinatesForHour(elapsed)

  return (
    <FormCalculatorShell title="BAC Calculator" badge="HEALTH" subtitle="Estimate Blood Alcohol Concentration & Sober Timeline">
      <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="space-y-4 no-print">
          {/* Gender */}
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

          {/* Body Weight */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
              Body Weight
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="70"
                  id="bac-weight-input"
                  className="w-full h-10 px-3 bg-white border border-neutral-300 rounded-lg text-sm font-bold font-mono focus:outline-none focus:border-neutral-500 transition-all text-neutral-800 shadow-sm"
                />
              </div>
              <div className="w-24">
                <RetroSelect
                  label=""
                  value={weightUnit}
                  onChange={(v) => setWeightUnit(v as any)}
                  options={[
                    { value: 'kg', label: 'kg' },
                    { value: 'lbs', label: 'lbs' }
                  ]}
                  id="bac-weight-unit"
                />
              </div>
            </div>
          </div>

          {/* Time Since First Drink */}
          <div className="grid grid-cols-2 gap-4">
            <RetroInput
              label="Hours Since First Drink"
              value={hours}
              onChange={setHours}
              placeholder="2"
              id="bac-hours"
              type="number"
            />
            <RetroInput
              label="Minutes"
              value={minutes}
              onChange={setMinutes}
              placeholder="0"
              id="bac-minutes"
              type="number"
            />
          </div>

          {/* Drink Aggregator */}
          <div className="border border-neutral-300 rounded-xl overflow-hidden bg-[#f3f1eb]">
            <div className="bg-neutral-200 px-3.5 py-3 border-b border-neutral-300 font-mono text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Amount of Alcohol Consumed
            </div>
            
            <div className="p-4 space-y-4 bg-white">
              {/* BEER ROW */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider">
                  <span>Beer</span>
                  <span className="text-[9px] text-neutral-400 font-normal">ABV %</span>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={beerQty}
                      onChange={(e) => setBeerQty(e.target.value)}
                      placeholder="0"
                      className="w-full h-9 px-2.5 bg-white border border-neutral-300 rounded-lg text-xs font-bold font-mono focus:outline-none focus:border-neutral-500 text-neutral-800"
                    />
                  </div>
                  <div className="col-span-6">
                    <RetroSelect
                      label=""
                      value={beerSize}
                      onChange={setBeerSize}
                      options={[
                        { value: '330', label: '12oz / 330ml bottle' },
                        { value: '355', label: '12oz / 355ml can' },
                        { value: '473', label: '16oz / 473ml pint' },
                        { value: 'custom', label: 'Custom volume' }
                      ]}
                      id="bac-beer-size"
                    />
                  </div>
                  <div className="col-span-3">
                    <RetroSelect
                      label=""
                      value={beerAbv}
                      onChange={setBeerAbv}
                      options={[
                        { value: '4', label: '4.0%' },
                        { value: '5', label: '5.0%' },
                        { value: '6', label: '6.0%' },
                        { value: '8', label: '8.0%' }
                      ]}
                      id="bac-beer-abv"
                    />
                  </div>
                </div>
                {beerSize === 'custom' && (
                  <div className="pt-1">
                    <RetroInput
                      label="Custom Beer Volume (ml)"
                      value={beerCustomSize}
                      onChange={setBeerCustomSize}
                      placeholder="330"
                      id="bac-beer-custom-size"
                      type="number"
                    />
                  </div>
                )}
              </div>

              {/* WINE ROW */}
              <div className="space-y-1.5 border-t border-neutral-100 pt-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider">
                  <span>Wine</span>
                  <span className="text-[9px] text-neutral-400 font-normal">ABV %</span>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={wineQty}
                      onChange={(e) => setWineQty(e.target.value)}
                      placeholder="0"
                      className="w-full h-9 px-2.5 bg-white border border-neutral-300 rounded-lg text-xs font-bold font-mono focus:outline-none focus:border-neutral-500 text-neutral-800"
                    />
                  </div>
                  <div className="col-span-6">
                    <RetroSelect
                      label=""
                      value={wineSize}
                      onChange={setWineSize}
                      options={[
                        { value: '150', label: '5oz / 150ml glass' },
                        { value: '750', label: '25oz / 750ml bottle' },
                        { value: 'custom', label: 'Custom volume' }
                      ]}
                      id="bac-wine-size"
                    />
                  </div>
                  <div className="col-span-3">
                    <RetroSelect
                      label=""
                      value={wineAbv}
                      onChange={setWineAbv}
                      options={[
                        { value: '10', label: '10.0%' },
                        { value: '12', label: '12.0%' },
                        { value: '14', label: '14.0%' },
                        { value: '15', label: '15.0%' }
                      ]}
                      id="bac-wine-abv"
                    />
                  </div>
                </div>
                {wineSize === 'custom' && (
                  <div className="pt-1">
                    <RetroInput
                      label="Custom Wine Volume (ml)"
                      value={wineCustomSize}
                      onChange={setWineCustomSize}
                      placeholder="150"
                      id="bac-wine-custom-size"
                      type="number"
                    />
                  </div>
                )}
              </div>

              {/* LIQUOR ROW */}
              <div className="space-y-1.5 border-t border-neutral-100 pt-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider">
                  <span>Liquor / Spirits</span>
                  <span className="text-[9px] text-neutral-400 font-normal">ABV %</span>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={liquorQty}
                      onChange={(e) => setLiquorQty(e.target.value)}
                      placeholder="0"
                      className="w-full h-9 px-2.5 bg-white border border-neutral-300 rounded-lg text-xs font-bold font-mono focus:outline-none focus:border-neutral-500 text-neutral-800"
                    />
                  </div>
                  <div className="col-span-6">
                    <RetroSelect
                      label=""
                      value={liquorSize}
                      onChange={setLiquorSize}
                      options={[
                        { value: '44', label: '1.5oz / 44ml shot' },
                        { value: 'custom', label: 'Custom volume' }
                      ]}
                      id="bac-liquor-size"
                    />
                  </div>
                  <div className="col-span-3">
                    <RetroSelect
                      label=""
                      value={liquorAbv}
                      onChange={setLiquorAbv}
                      options={[
                        { value: '35', label: '35.0%' },
                        { value: '40', label: '40.0%' },
                        { value: '45', label: '45.0%' },
                        { value: '50', label: '50.0%' }
                      ]}
                      id="bac-liquor-abv"
                    />
                  </div>
                </div>
                {liquorSize === 'custom' && (
                  <div className="pt-1">
                    <RetroInput
                      label="Custom Liquor Volume (ml)"
                      value={liquorCustomSize}
                      onChange={setLiquorCustomSize}
                      placeholder="44"
                      id="bac-liquor-custom-size"
                      type="number"
                    />
                  </div>
                )}
              </div>

              {/* OTHER ROW */}
              <div className="space-y-1.5 border-t border-neutral-100 pt-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider">
                  <span>Other Beverage</span>
                  <span className="text-[9px] text-neutral-400 font-normal">ABV %</span>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={otherQty}
                      onChange={(e) => setOtherQty(e.target.value)}
                      placeholder="0"
                      className="w-full h-9 px-2.5 bg-white border border-neutral-300 rounded-lg text-xs font-bold font-mono focus:outline-none focus:border-neutral-500 text-neutral-800"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={otherSize}
                      onChange={(e) => setOtherSize(e.target.value as any)}
                      placeholder="250"
                      className="w-full h-9 px-2.5 bg-white border border-neutral-300 rounded-lg text-xs font-bold font-mono focus:outline-none focus:border-neutral-500 text-neutral-800"
                    />
                  </div>
                  <div className="col-span-3">
                    <RetroSelect
                      label=""
                      value={otherSizeUnit}
                      onChange={(v) => setOtherSizeUnit(v as any)}
                      options={[
                        { value: 'ml', label: 'ml' },
                        { value: 'oz', label: 'oz' }
                      ]}
                      id="bac-other-unit"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={otherAbv}
                      onChange={(e) => setOtherAbv(e.target.value as any)}
                      placeholder="8"
                      className="w-full h-9 px-2.5 bg-white border border-neutral-300 rounded-lg text-xs font-bold font-mono focus:outline-none focus:border-neutral-500 text-neutral-800"
                    />
                  </div>
                </div>
              </div>
            </div>
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

        {/* Right Column: Visual Charts & Impairment Details */}
        <div className="bg-[#eae7df]/50 border-2 border-[#dad6cd] rounded-xl p-4 sm:p-6 h-full flex flex-col justify-between min-h-[350px] print-target">
          {isCalculated && currentBAC !== null && hoursToSober !== null && peakBAC !== null ? (
            <div className="space-y-6">
              {/* Headline current BAC Result Card */}
              <div className="p-5 sm:p-6 bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-xl shadow-inner text-center font-mono relative overflow-hidden">
                <div className="absolute right-2 top-2 text-[#4c5c4a]/30">
                  <Activity className="w-12 h-12 stroke-[1.5]" />
                </div>
                <div className="text-[10px] font-bold text-[#4c5c4a] uppercase tracking-widest mb-1.5">
                  Estimated Blood Alcohol Concentration (BAC)
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#1a2019] tracking-tight">
                  {currentVal.toFixed(3)}%
                </div>
                <p className="text-[10px] text-[#4c5c4a] mt-2 max-w-sm mx-auto font-sans leading-normal">
                  {currentVal > 0 ? (
                    <>
                      It will take around <strong>{Math.floor(remainingHours)} hour{Math.floor(remainingHours) !== 1 ? 's' : ''} {Math.round((remainingHours % 1) * 60)} minutes</strong> to reach 0.00% (sober).
                    </>
                  ) : (
                    'You are estimated to be fully sober (0.00% BAC).'
                  )}
                </p>
              </div>

              {/* Impairment Stage Card */}
              <div className={`p-4 border-2 rounded-xl font-sans text-xs space-y-2 shadow-sm ${imp.color}`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold font-mono text-[10px] uppercase tracking-wider">Impairment Level</span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${imp.badge}`}>{imp.stage}</span>
                </div>
                <div className="space-y-1">
                  <p><strong>Behavioral Symptoms:</strong> {imp.behavior}</p>
                  <p className="border-t border-neutral-300/30 pt-1 mt-1"><strong>Cognitive & Motor Impairment:</strong> {imp.impairment}</p>
                </div>
              </div>

              {/* Interactive SVG Timeline Line Graph */}
              {soberVal > 0 && (
                <div className="bg-white border border-neutral-300 rounded-xl p-4 relative">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider">
                      BAC Change over Time (sober progress)
                    </label>
                    {hoveredHour !== null && (
                      <div className="text-[9px] font-mono font-bold px-2 py-0.5 bg-neutral-900 text-white rounded shadow-sm">
                        {hoveredHour.toFixed(1)}h: {Math.max(0, peakVal - 0.015 * hoveredHour).toFixed(3)}%
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <svg viewBox={`0 0 ${cWidth} ${cHeight}`} className="w-full h-auto select-none overflow-visible">
                      {/* Grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                        const y = paddingTop + graphHeight - frac * graphHeight
                        const labelVal = peakVal * frac
                        return (
                          <g key={idx} className="opacity-40">
                            <line
                              x1={paddingLeft}
                              y1={y}
                              x2={cWidth - paddingRight}
                              y2={y}
                              stroke="#e5e5e5"
                              strokeWidth="1"
                              strokeDasharray="4 4"
                            />
                            <text
                              x={paddingLeft - 5}
                              y={y + 3}
                              textAnchor="end"
                              fill="#888888"
                              className="font-mono text-[7px]"
                            >
                              {labelVal.toFixed(3)}%
                            </text>
                          </g>
                        )
                      })}

                      {/* BAC decay path */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#e5e5e5"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Past path segment (blue) */}
                      {elapsed > 0 && (
                        <path
                          d={(() => {
                            const start = getCoordinatesForHour(0)
                            let dStr = `M ${start.x} ${start.y}`
                            const steps = Math.min(elapsed, soberVal)
                            for (let h = 0.25; h <= steps; h += 0.25) {
                              const pt = getCoordinatesForHour(h)
                              dStr += ` L ${pt.x} ${pt.y}`
                            }
                            const endPt = getCoordinatesForHour(steps)
                            dStr += ` L ${endPt.x} ${endPt.y}`
                            return dStr
                          })()}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      )}

                      {/* Future path segment (green) */}
                      {elapsed < soberVal && (
                        <path
                          d={(() => {
                            const start = getCoordinatesForHour(elapsed)
                            let dStr = `M ${start.x} ${start.y}`
                            for (let h = elapsed + 0.25; h <= soberVal; h += 0.25) {
                              const pt = getCoordinatesForHour(h)
                              dStr += ` L ${pt.x} ${pt.y}`
                            }
                            const endPt = getCoordinatesForHour(soberVal)
                            dStr += ` L ${endPt.x} ${endPt.y}`
                            return dStr
                          })()}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      )}

                      {/* Interactive hover overlays */}
                      {Array.from({ length: 11 }, (_, i) => (i * soberVal) / 10).map((h, idx) => {
                        const pt = getCoordinatesForHour(h)
                        return (
                          <circle
                            key={idx}
                            cx={pt.x}
                            cy={pt.y}
                            r="8"
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredHour(h)}
                            onMouseLeave={() => setHoveredHour(null)}
                          />
                        )
                      })}

                      {/* Current elapsed time marker */}
                      {elapsed <= soberVal && (
                        <g>
                          <circle
                            cx={markerPos.x}
                            cy={markerPos.y}
                            r="7"
                            fill="#3b82f6"
                            className="animate-ping opacity-75"
                          />
                          <circle
                            cx={markerPos.x}
                            cy={markerPos.y}
                            r="4.5"
                            fill="#3b82f6"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                        </g>
                      )}

                      {/* Axis Ticks */}
                      {Array.from({ length: 5 }, (_, i) => (i * soberVal) / 4).map((tick, idx) => {
                        const pt = getCoordinatesForHour(tick)
                        return (
                          <g key={idx}>
                            <line
                              x1={pt.x}
                              y1={paddingTop + graphHeight}
                              x2={pt.x}
                              y2={paddingTop + graphHeight + 4}
                              stroke="#cccccc"
                              strokeWidth="1"
                            />
                            <text
                              x={pt.x}
                              y={paddingTop + graphHeight + 12}
                              textAnchor="middle"
                              fill="#888888"
                              className="font-mono text-[7px] font-bold"
                            >
                              {tick.toFixed(1)}h
                            </text>
                          </g>
                        )
                      })}

                      {/* Bottom axis line */}
                      <line
                        x1={paddingLeft}
                        y1={paddingTop + graphHeight}
                        x2={cWidth - paddingRight}
                        y2={paddingTop + graphHeight}
                        stroke="#cccccc"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-center gap-4 mt-1.5 text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-blue-500 rounded" /> Past Elapsed</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-emerald-500 rounded" /> Future Sobering</span>
                  </div>
                </div>
              )}

              {/* Educational Disclaimer */}
              <div className="p-3 bg-neutral-50 border border-neutral-355 rounded-lg text-[9px] font-mono text-neutral-500 leading-normal flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 text-neutral-400 mt-0.5" />
                <span>
                  <strong>Legal Disclaimer:</strong> BAC estimates are for educational and entertainment purposes only. This is not medical advice. For proper medical advice, please consult a qualified physician or doctor. Metabolism rates vary wildly based on stomach contents, medication, liver health, and hydration. Never use this calculator to determine fitness to drive.
                </span>
              </div>

              <ShareExportPanel
                queryParams={queryParams}
                emailSubject="Blood Alcohol Concentration (BAC) Results"
                emailBody={
                  `Blood Alcohol Concentration (BAC) Calculation Results:\n` +
                  `- Gender: ${gender === 'male' ? 'Male' : 'Female'}\n` +
                  `- Weight: ${weight} ${weightUnit}\n` +
                  `- Elapsed Time: ${hours}h ${minutes}m\n` +
                  `- Calculated peak BAC: ${peakBAC ? peakBAC.toFixed(3) : ''}%\n` +
                  `- Current BAC: ${currentBAC ? currentBAC.toFixed(3) : ''}%\n` +
                  `- Time until completely sober: ${hoursToSober ? hoursToSober.toFixed(1) : ''} hours`
                }
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <Beer className="w-12 h-12 text-neutral-400 stroke-1 mb-3" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Inputs</p>
              <p className="text-[10px] font-mono mt-1 max-w-[220px] leading-relaxed">
                Provide gender, body weight, elapsed time, and alcohol quantities consumed to view your blood alcohol concentration timeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
