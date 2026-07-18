'use client'

import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, RetroActionButton } from '../shared/FormCalculatorShell'
import ShareExportPanel from '../shared/ShareExportPanel'
import { AlertTriangle, Info, Activity } from 'lucide-react'

export default function LeanBodyMassCalculator() {
  const [unitSystem, setUnitSystem] = useState<'us' | 'metric'>('metric')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [isChild, setIsChild] = useState<boolean>(false)

  // Height / Weight states
  const [feet, setFeet] = useState('5')
  const [inches, setInches] = useState('10')
  const [weightLbs, setWeightLbs] = useState('160')

  const [heightCm, setHeightCm] = useState('180')
  const [weightKg, setWeightKg] = useState('70')

  // Result states
  const [isCalculated, setIsCalculated] = useState(false)
  const [results, setResults] = useState<{
    boer: { lbm: number; lbmPct: number; fatPct: number } | null
    james: { lbm: number; lbmPct: number; fatPct: number } | null
    hume: { lbm: number; lbmPct: number; fatPct: number } | null
    peters: { lbm: number; lbmPct: number; fatPct: number } | null
    avgLbm: number
    avgLbmPct: number
    avgFatPct: number
    weightVal: number
  } | null>(null)
  
  const [selectedFormula, setSelectedFormula] = useState<'boer' | 'james' | 'hume' | 'peters'>('boer')
  const [errorMsg, setErrorMsg] = useState('')

  // URL serialization states
  const [queryParams, setQueryParams] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('g', gender)
    params.set('c', isChild ? '1' : '0')
    params.set('u', unitSystem)
    params.set('f', selectedFormula)
    if (unitSystem === 'us') {
      params.set('w', weightLbs)
      params.set('ft', feet)
      params.set('in', inches)
    } else if (unitSystem === 'metric') {
      params.set('w', weightKg)
      params.set('h', heightCm)
    }
    setQueryParams(params.toString())
  }, [gender, isChild, unitSystem, selectedFormula, weightLbs, feet, inches, weightKg, heightCm])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const g = params.get('g')
      const c = params.get('c')
      const u = params.get('u')
      const f = params.get('f')
      const w = params.get('w')

      if (g === 'male' || g === 'female') setGender(g)
      if (c === '1') setIsChild(true)
      if (u === 'us' || u === 'metric') setUnitSystem(u)
      if (f === 'boer' || f === 'james' || f === 'hume' || f === 'peters') setSelectedFormula(f)

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

  const handleClear = () => {
    setGender('male')
    setIsChild(false)
    setFeet('5')
    setInches('10')
    setWeightLbs('160')
    setHeightCm('180')
    setWeightKg('70')
    setIsCalculated(false)
    setResults(null)
    setSelectedFormula('boer')
    setErrorMsg('')
  }

  const handleCalculate = () => {
    setErrorMsg('')
    let wVal = 0
    let hVal = 0

    if (unitSystem === 'metric') {
      const kg = parseFloat(weightKg)
      const cm = parseFloat(heightCm)
      if (isNaN(kg) || kg <= 0 || isNaN(cm) || cm <= 0) {
        setErrorMsg('Please enter valid height and weight values.')
        return
      }
      wVal = kg
      hVal = cm
    } else {
      const lbs = parseFloat(weightLbs)
      const ft = parseFloat(feet)
      const inch = parseFloat(inches)
      if (isNaN(lbs) || lbs <= 0 || isNaN(ft) || ft < 0 || isNaN(inch) || inch < 0) {
        setErrorMsg('Please enter valid height and weight values.')
        return
      }
      wVal = lbs / 2.2046226218
      hVal = (ft * 12 + inch) * 2.54
    }

    if (isChild) {
      // Peters Formula (Children 13-14 years or younger)
      // eECV = 0.0215 * W^0.6469 * H^0.7236
      // eLBM = 3.8 * eECV
      const eECV = 0.0215 * Math.pow(wVal, 0.6469) * Math.pow(hVal, 0.7236)
      const lbmPeters = 3.8 * eECV
      const lbmPct = Math.min(100, Math.max(0, (lbmPeters / wVal) * 100))
      const fatPct = 100 - lbmPct

      setResults({
        boer: null,
        james: null,
        hume: null,
        peters: { lbm: lbmPeters, lbmPct, fatPct },
        avgLbm: lbmPeters,
        avgLbmPct: lbmPct,
        avgFatPct: fatPct,
        weightVal: wVal
      })
      setSelectedFormula('peters')
    } else {
      // Adult Formulas
      // Boer:
      // Males: 0.407 * W + 0.267 * H - 19.2
      // Females: 0.252 * W + 0.473 * H - 48.3
      const lbmBoer = gender === 'male'
        ? 0.407 * wVal + 0.267 * hVal - 19.2
        : 0.252 * wVal + 0.473 * hVal - 48.3

      // James:
      // Males: 1.1 * W - 128 * (W / H)^2
      // Females: 1.07 * W - 148 * (W / H)^2
      const lbmJames = gender === 'male'
        ? 1.1 * wVal - 128 * Math.pow(wVal / hVal, 2)
        : 1.07 * wVal - 148 * Math.pow(wVal / hVal, 2)

      // Hume:
      // Males: 0.32810 * W + 0.33929 * H - 29.5336
      // Females: 0.29569 * W + 0.41813 * H - 43.2933
      const lbmHume = gender === 'male'
        ? 0.32810 * wVal + 0.33929 * hVal - 29.5336
        : 0.29569 * wVal + 0.41813 * hVal - 43.2933

      const boerPct = Math.min(100, Math.max(0, (lbmBoer / wVal) * 100))
      const jamesPct = Math.min(100, Math.max(0, (lbmJames / wVal) * 100))
      const humePct = Math.min(100, Math.max(0, (lbmHume / wVal) * 100))

      const avgLbm = (lbmBoer + lbmJames + lbmHume) / 3
      const avgLbmPct = (boerPct + jamesPct + humePct) / 3

      setResults({
        boer: { lbm: lbmBoer, lbmPct: boerPct, fatPct: 100 - boerPct },
        james: { lbm: lbmJames, lbmPct: jamesPct, fatPct: 100 - jamesPct },
        hume: { lbm: lbmHume, lbmPct: humePct, fatPct: 100 - humePct },
        peters: null,
        avgLbm,
        avgLbmPct,
        avgFatPct: 100 - avgLbmPct,
        weightVal: wVal
      })
      setSelectedFormula('boer')
    }

    setIsCalculated(true)
  }

  const formatWeight = (kg: number) => {
    if (unitSystem === 'metric') {
      return `${kg.toFixed(1)} kg`
    }
    return `${(kg * 2.2046226218).toFixed(1)} lbs`
  }

  // Get active formula details
  const activeFormula = results
    ? selectedFormula === 'boer'
      ? results.boer
      : selectedFormula === 'james'
      ? results.james
      : selectedFormula === 'hume'
      ? results.hume
      : results.peters
    : null

  const leanPct = activeFormula ? activeFormula.lbmPct : 70
  const fatPct = activeFormula ? activeFormula.fatPct : 30

  // Chart config
  const cWidth = 400
  const cHeight = 40
  const leanWidth = (leanPct / 100) * cWidth
  const fatWidth = cWidth - leanWidth

  return (
    <FormCalculatorShell title="Lean Body Mass Calculator" badge="HEALTH" subtitle="Calculate LBM via Boer, James, Hume & Peters Formulas">
      <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="space-y-4 no-print">
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

          {/* Age toggle: 14 or younger */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
              Age 14 or younger?
            </label>
            <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-lg border border-neutral-300 h-10 items-center">
              <button
                type="button"
                onClick={() => {
                  setIsChild(true)
                  setHeightCm('140')
                  setWeightKg('36')
                  setFeet('4')
                  setInches('7')
                  setWeightLbs('80')
                  setIsCalculated(false)
                }}
                className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                  isChild
                    ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Yes (Child)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChild(false)
                  setHeightCm('180')
                  setWeightKg('70')
                  setFeet('5')
                  setInches('10')
                  setWeightLbs('160')
                  setIsCalculated(false)
                }}
                className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                  !isChild
                    ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                No (Adult)
              </button>
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
                id="lbm-height-cm"
                type="number"
              />
              <RetroInput
                label="Weight (kg)"
                value={weightKg}
                onChange={setWeightKg}
                placeholder="70"
                id="lbm-weight-kg"
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
                  id="lbm-height-feet"
                  type="number"
                />
                <RetroInput
                  label="Height (Inches)"
                  value={inches}
                  onChange={setInches}
                  placeholder="10"
                  id="lbm-height-inches"
                  type="number"
                />
              </div>
              <RetroInput
                label="Weight (lbs)"
                value={weightLbs}
                onChange={setWeightLbs}
                placeholder="160"
                id="lbm-weight-lbs"
                type="number"
              />
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
            <RetroActionButton onClick={handleCalculate} variant="primary" fullWidth>
              Calculate LBM
            </RetroActionButton>
            <RetroActionButton onClick={handleClear} variant="secondary">
              Clear
            </RetroActionButton>
          </div>
        </div>

        {/* Right Column: Visual Composition & Formula breakdowns */}
        <div className="bg-[#eae7df]/50 border-2 border-[#dad6cd] rounded-xl p-4 sm:p-6 h-full flex flex-col justify-between min-h-[350px] print-target">
          {isCalculated && results && activeFormula ? (
            <div className="space-y-6">
              {/* Highlight LBM Average Card */}
              <div className="p-5 sm:p-6 bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-xl shadow-inner text-center font-mono relative overflow-hidden">
                <div className="absolute right-2 top-2 text-[#4c5c4a]/30">
                  <Activity className="w-12 h-12 stroke-[1.5]" />
                </div>
                <div className="text-[10px] font-bold text-[#4c5c4a] uppercase tracking-widest mb-1.5">
                  {isChild ? 'Estimated Lean Body Mass (Peters)' : 'Average Estimated Lean Body Mass'}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#1a2019] tracking-tight">
                  {formatWeight(results.avgLbm)}
                </div>
                <p className="text-[10px] text-[#4c5c4a] mt-2 max-w-sm mx-auto font-sans leading-normal">
                  Your lean body composition is approximately <strong>{results.avgLbmPct.toFixed(1)}%</strong> of your total weight.
                </p>
              </div>

              {/* Formula Formula toggle if adult */}
              {!isChild && (
                <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-lg border border-neutral-300 h-9 items-center">
                  {(['boer', 'james', 'hume'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFormula(f)}
                      className={`flex-1 py-1 text-[10px] font-bold font-mono rounded-md h-7 transition-all uppercase ${
                        selectedFormula === f
                          ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-700'
                      }`}
                    >
                      {f} Formula
                    </button>
                  ))}
                </div>
              )}

              {/* LBM vs. Fat Stacked Bar Chart */}
              <div className="bg-white border border-neutral-300 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider">
                    {selectedFormula.toUpperCase()} Composition Breakdown
                  </span>
                </div>

                <div className="flex justify-center">
                  <svg viewBox={`0 0 ${cWidth} ${cHeight}`} className="w-full h-auto select-none rounded-lg overflow-hidden border border-neutral-200">
                    {/* Lean body mass segment (Teal) */}
                    <rect
                      x="0"
                      y="0"
                      width={leanWidth}
                      height={cHeight}
                      fill="#0d9488"
                    />
                    {/* Fat mass segment (Orange) */}
                    <rect
                      x={leanWidth}
                      y="0"
                      width={fatWidth}
                      height={cHeight}
                      fill="#ea580c"
                    />

                    {/* Percentage Labels Inside */}
                    {leanPct > 15 && (
                      <text
                        x={leanWidth / 2}
                        y={cHeight / 2 + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        className="font-mono text-[9px] font-extrabold"
                      >
                        {leanPct.toFixed(0)}% Lean
                      </text>
                    )}
                    {fatPct > 15 && (
                      <text
                        x={leanWidth + fatWidth / 2}
                        y={cHeight / 2 + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        className="font-mono text-[9px] font-extrabold"
                      >
                        {fatPct.toFixed(0)}% Fat
                      </text>
                    )}
                  </svg>
                </div>
                <div className="flex justify-center gap-4 text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-teal-600 rounded" /> Lean Mass ({formatWeight(activeFormula.lbm)})</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-orange-600 rounded" /> Fat Mass ({formatWeight(results.weightVal - activeFormula.lbm)})</span>
                </div>
              </div>

              {/* Detailed comparison table */}
              <div className="border border-neutral-300 rounded-xl overflow-hidden bg-white text-xs font-mono">
                <div className="p-3 bg-neutral-50 border-b border-neutral-300 font-bold text-neutral-700 uppercase text-[10px] tracking-wider">
                  Formula Comparisons
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] text-neutral-500 uppercase">
                        <th className="p-2.5">Formula</th>
                        <th className="p-2.5">Lean Body Mass</th>
                        <th className="p-2.5 text-right">Est. Body Fat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 text-dark-700">
                      {isChild ? (
                        <tr>
                          <td className="p-2.5 font-bold">Peters (Child)</td>
                          <td className="p-2.5">{formatWeight(results.peters!.lbm)} ({results.peters!.lbmPct.toFixed(1)}%)</td>
                          <td className="p-2.5 text-right text-orange-600 font-bold">{results.peters!.fatPct.toFixed(1)}%</td>
                        </tr>
                      ) : (
                        <>
                          <tr>
                            <td className="p-2.5 font-bold">Boer</td>
                            <td className="p-2.5">{formatWeight(results.boer!.lbm)} ({results.boer!.lbmPct.toFixed(1)}%)</td>
                            <td className="p-2.5 text-right text-orange-600 font-bold">{results.boer!.fatPct.toFixed(1)}%</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">James</td>
                            <td className="p-2.5">{formatWeight(results.james!.lbm)} ({results.james!.lbmPct.toFixed(1)}%)</td>
                            <td className="p-2.5 text-right text-orange-600 font-bold">{results.james!.fatPct.toFixed(1)}%</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">Hume</td>
                            <td className="p-2.5">{formatWeight(results.hume!.lbm)} ({results.hume!.lbmPct.toFixed(1)}%)</td>
                            <td className="p-2.5 text-right text-orange-600 font-bold">{results.hume!.fatPct.toFixed(1)}%</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <ShareExportPanel
                queryParams={queryParams}
                emailSubject="Lean Body Mass Calculation Results"
                emailBody={
                  `Lean Body Mass (LBM) Calculation Results:\n` +
                  `- Gender: ${gender === 'male' ? 'Male' : 'Female'}\n` +
                  `- Age Group: ${isChild ? 'Child' : 'Adult'}\n` +
                  `- Formula: ${selectedFormula.toUpperCase()}\n` +
                  `- LBM: ${results ? formatWeight(results.avgLbm) : ''}\n` +
                  `- LBM Percentage: ${results ? results.avgLbmPct.toFixed(1) : ''}%\n` +
                  `- Est. Body Fat Percentage: ${results ? results.avgFatPct.toFixed(1) : ''}%`
                }
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <Info className="w-12 h-12 text-neutral-400 stroke-1 mb-3 animate-pulse" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Inputs</p>
              <p className="text-[10px] font-mono mt-1 max-w-[220px] leading-relaxed">
                Provide height, weight, gender, and age category inputs to compute your lean body composition.
              </p>
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
