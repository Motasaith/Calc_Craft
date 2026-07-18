'use client'

import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, RetroActionButton } from '../shared/FormCalculatorShell'
import ShareExportPanel from '../shared/ShareExportPanel'
import { AlertTriangle, ChevronDown, ChevronUp, Settings, Activity, Info, BarChart2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OneRepMaxCalculator() {
  // Input states
  const [weight, setWeight] = useState('100')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')
  const [reps, setReps] = useState('5')

  // Settings states
  const [showSettings, setShowSettings] = useState(false)
  const [formula, setFormula] = useState<'epley' | 'brzycki' | 'lombardi' | 'mayhew' | 'oconner' | 'wathan'>('epley')
  const [resultUnit, setResultUnit] = useState<'kg' | 'lbs'>('kg')

  // Calculation control states
  const [isCalculated, setIsCalculated] = useState(false)
  const [calculated1RM, setCalculated1RM] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Interactive SVG chart hover state
  const [hoveredRep, setHoveredRep] = useState<number | null>(null)

  // URL serialization states
  const [queryParams, setQueryParams] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('w', weight)
    params.set('u', weightUnit)
    params.set('r', reps)
    params.set('f', formula)
    setQueryParams(params.toString())
  }, [weight, weightUnit, reps, formula])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const w = params.get('w')
      const u = params.get('u')
      const r = params.get('r')
      const f = params.get('f')

      if (w) setWeight(w)
      if (u === 'kg' || u === 'lbs') {
        setWeightUnit(u)
        setResultUnit(u)
      }
      if (r) setReps(r)
      if (f) setFormula(f as any)

      if (w && r) {
        setIsCalculated(true)
      }
    }
  }, [])

  const handleClear = () => {
    setWeight('100')
    setWeightUnit('kg')
    setReps('5')
    setFormula('epley')
    setResultUnit('kg')
    setIsCalculated(false)
    setCalculated1RM(null)
    setErrorMsg('')
    setHoveredRep(null)
  }

  // Core 1RM estimation math
  const compute1RM = (w: number, r: number, model: typeof formula): number => {
    if (r === 1) return w
    switch (model) {
      case 'epley':
        return w * (1 + r / 30)
      case 'brzycki':
        return r < 37 ? w / (1.0278 - 0.0278 * r) : w * (1 + r / 30)
      case 'lombardi':
        return w * Math.pow(r, 0.1)
      case 'mayhew':
        return (100 * w) / (52.2 + 41.9 * Math.exp(-0.055 * r))
      case 'oconner':
        return w * (1 + 0.025 * r)
      case 'wathan':
        return (100 * w) / (48.8 + 53.8 * Math.exp(-0.075 * r))
      default:
        return w * (1 + r / 30)
    }
  }

  // Work backwards: calculate weight for target reps given estimated 1RM
  const computeWeightForReps = (oneRepMax: number, targetReps: number, model: typeof formula): number => {
    if (targetReps === 1) return oneRepMax
    switch (model) {
      case 'epley':
        return oneRepMax / (1 + targetReps / 30)
      case 'brzycki':
        return targetReps < 37 ? oneRepMax * (1.0278 - 0.0278 * targetReps) : oneRepMax / (1 + targetReps / 30)
      case 'lombardi':
        return oneRepMax / Math.pow(targetReps, 0.1)
      case 'mayhew':
        return (oneRepMax * (52.2 + 41.9 * Math.exp(-0.055 * targetReps))) / 100
      case 'oconner':
        return oneRepMax / (1 + 0.025 * targetReps)
      case 'wathan':
        return (oneRepMax * (48.8 + 53.8 * Math.exp(-0.075 * targetReps))) / 100
      default:
        return oneRepMax / (1 + targetReps / 30)
    }
  }

  // Work backwards: calculate target reps for a specific % of 1RM
  const computeRepsForPercentage = (pct: number, model: typeof formula): number => {
    if (pct >= 100) return 1
    const pFraction = pct / 100
    let r = 1

    switch (model) {
      case 'epley':
        r = 30 * (1 / pFraction - 1)
        break
      case 'brzycki':
        r = (1.0278 - pFraction) / 0.0278
        break
      case 'lombardi':
        r = Math.pow(1 / pFraction, 10)
        break
      case 'mayhew':
        if (pct > 52.2) {
          r = -Math.log((pct - 52.2) / 41.9) / 0.055
        } else {
          // Fallback to Epley
          r = 30 * (1 / pFraction - 1)
        }
        break
      case 'oconner':
        r = (1 / pFraction - 1) / 0.025
        break
      case 'wathan':
        if (pct > 48.8) {
          r = -Math.log((pct - 48.8) / 53.8) / 0.075
        } else {
          r = 30 * (1 / pFraction - 1)
        }
        break
      default:
        r = 30 * (1 / pFraction - 1)
    }

    return Math.max(1, Math.round(r))
  }

  const handleCalculate = () => {
    setErrorMsg('')
    const wVal = parseFloat(weight)
    const rVal = parseInt(reps)

    if (isNaN(wVal) || wVal <= 0) {
      setErrorMsg('Please enter a valid weight lifted.')
      return
    }

    if (isNaN(rVal) || rVal < 1 || rVal > 50) {
      setErrorMsg('Please enter a valid repetition count between 1 and 50.')
      return
    }

    // Compute base 1RM in the input unit
    let computed1rm = compute1RM(wVal, rVal, formula)

    // Convert to desired result unit if different from input unit
    if (weightUnit !== resultUnit) {
      if (weightUnit === 'kg' && resultUnit === 'lbs') {
        computed1rm = computed1rm * 2.2046226218
      } else if (weightUnit === 'lbs' && resultUnit === 'kg') {
        computed1rm = computed1rm / 2.2046226218
      }
    }

    setCalculated1RM(computed1rm)
    setIsCalculated(true)
  }

  const repsNum = parseInt(reps)
  const isHighReps = repsNum > 10

  // Standard percentages list for the right-hand comparison table
  const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50]

  // Reps list for the left-hand comparison table
  const repList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20]

  // Chart variables
  const oneRepMaxVal = calculated1RM !== null ? calculated1RM : 0
  const chartReps = Array.from({ length: 20 }, (_, i) => i + 1)
  
  // Chart dimensions
  const cWidth = 440
  const cHeight = 180
  const paddingLeft = 35
  const paddingRight = 15
  const paddingTop = 15
  const paddingBottom = 25
  const graphWidth = cWidth - paddingLeft - paddingRight
  const graphHeight = cHeight - paddingTop - paddingBottom

  // Max weight scale
  const scaleY = oneRepMaxVal > 0 ? graphHeight / oneRepMaxVal : 0

  return (
    <FormCalculatorShell title="One Rep Max Calculator" badge="FITNESS" subtitle="Estimate Maximum Strength & Load Distributions">
      <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="space-y-4 no-print">
          {/* Weight Lifted with inline Unit Select */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
              Weight Lifted
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="100"
                  id="1rm-weight-input"
                  className="w-full h-10 px-3 bg-white border border-neutral-300 rounded-lg text-sm font-bold font-mono focus:outline-none focus:border-neutral-500 transition-all text-neutral-800 shadow-sm"
                />
              </div>
              <div className="w-24">
                <RetroSelect
                  label=""
                  value={weightUnit}
                  onChange={(v) => {
                    setWeightUnit(v as any)
                    setResultUnit(v as any) // Match result unit by default
                  }}
                  options={[
                    { value: 'kg', label: 'kg' },
                    { value: 'lbs', label: 'lbs' }
                  ]}
                  id="1rm-weight-unit"
                />
              </div>
            </div>
          </div>

          {/* Repetitions Input & Slider */}
          <div className="space-y-2">
            <RetroInput
              label="Repetitions Completed"
              value={reps}
              onChange={setReps}
              placeholder="5"
              id="1rm-reps-input"
              type="number"
            />
            <div className="px-1">
              <input
                type="range"
                min="1"
                max="30"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full accent-neutral-800 cursor-ew-resize h-1 bg-neutral-200 rounded-lg"
              />
              <div className="flex justify-between text-[8px] font-mono text-neutral-400 font-bold uppercase tracking-wider mt-1">
                <span>1 Rep</span>
                <span>15 Reps</span>
                <span>30 Reps</span>
              </div>
            </div>
          </div>

          {isHighReps && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2 text-[10px] text-amber-700 font-mono leading-normal">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>
                <strong>Tip:</strong> 1RM predictions are most accurate under 10 repetitions. Higher reps introduce cardiovascular/neuromuscular fatigue, reducing estimate reliability.
              </span>
            </div>
          )}

          {/* Settings Accordion */}
          <div className="border border-neutral-300 rounded-xl overflow-hidden bg-[#f3f1eb]">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-neutral-700 font-mono uppercase tracking-wider select-none hover:bg-neutral-300/40 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Calculation Settings
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
                      label="Estimation Formula"
                      value={formula}
                      onChange={(v) => setFormula(v as any)}
                      options={[
                        { value: 'epley', label: 'Epley (Standard)' },
                        { value: 'brzycki', label: 'Brzycki' },
                        { value: 'lombardi', label: 'Lombardi' },
                        { value: 'mayhew', label: 'Mayhew et al.' },
                        { value: 'oconner', label: 'O\'Conner' },
                        { value: 'wathan', label: 'Wathan' }
                      ]}
                      id="1rm-formula"
                    />

                    <RetroSelect
                      label="Desired Result Unit"
                      value={resultUnit}
                      onChange={(v) => setResultUnit(v as any)}
                      options={[
                        { value: 'kg', label: 'Kilograms (kg)' },
                        { value: 'lbs', label: 'Pounds (lbs)' }
                      ]}
                      id="1rm-result-unit"
                    />
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

        {/* Right Column: Visual Charts & Comparison Tables */}
        <div className="bg-[#eae7df]/50 border-2 border-[#dad6cd] rounded-xl p-4 sm:p-6 h-full flex flex-col justify-between min-h-[350px] print-target">
          {isCalculated && calculated1RM !== null ? (
            <div className="space-y-6">
              {/* Headline Result Card */}
              <div className="p-5 sm:p-6 bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-xl shadow-inner text-center font-mono relative overflow-hidden">
                <div className="absolute right-2 top-2 text-[#4c5c4a]/30">
                  <Activity className="w-12 h-12 stroke-[1.5]" />
                </div>
                <div className="text-[10px] font-bold text-[#4c5c4a] uppercase tracking-widest mb-1.5">
                  Estimated One Rep Max (1RM)
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#1a2019] tracking-tight">
                  {calculated1RM.toFixed(1)}{' '}
                  <span className="text-lg font-bold text-[#4c5c4a]">{resultUnit}</span>
                </div>
                <p className="text-[10px] text-[#4c5c4a] mt-2 max-w-sm mx-auto font-sans leading-normal">
                  Based on lifting {weight} {weightUnit} for {reps} repetition{repsNum > 1 ? 's' : ''} using the {formula.toUpperCase()} formula.
                </p>
              </div>

              {/* Interactive SVG Repetitions Curve Graph */}
              <div className="bg-white border border-neutral-300 rounded-xl p-4 relative">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider">
                    Estimated Max Weight by Repetitions
                  </label>
                  {hoveredRep !== null && (
                    <div className="text-[9px] font-mono font-bold px-2 py-0.5 bg-neutral-900 text-white rounded shadow-sm">
                      Rep {hoveredRep}: {computeWeightForReps(oneRepMaxVal, hoveredRep, formula).toFixed(1)} {resultUnit} ({Math.round((computeWeightForReps(oneRepMaxVal, hoveredRep, formula) / oneRepMaxVal) * 100)}%)
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <svg viewBox={`0 0 ${cWidth} ${cHeight}`} className="w-full h-auto select-none overflow-visible">
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                      const y = paddingTop + graphHeight - frac * graphHeight
                      const labelVal = oneRepMaxVal * frac
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
                            {Math.round(labelVal)}
                          </text>
                        </g>
                      )
                    })}

                    {/* Bars */}
                    {chartReps.map((rep, idx) => {
                      const repW = computeWeightForReps(oneRepMaxVal, rep, formula)
                      const barH = repW * scaleY
                      const barW = (graphWidth - 19 * 3) / 20
                      const x = paddingLeft + idx * (barW + 3)
                      const y = paddingTop + graphHeight - barH

                      return (
                        <rect
                          key={rep}
                          x={x}
                          y={y}
                          width={barW}
                          height={Math.max(2, barH)}
                          fill={hoveredRep === rep ? '#3b82f6' : '#60a5fa'}
                          rx="1.5"
                          className="transition-colors duration-150 cursor-pointer"
                          onMouseEnter={() => setHoveredRep(rep)}
                          onMouseLeave={() => setHoveredRep(null)}
                        />
                      )
                    })}

                    {/* X Axis ticks */}
                    {[1, 5, 10, 15, 20].map((tick) => {
                      const barW = (graphWidth - 19 * 3) / 20
                      const x = paddingLeft + (tick - 1) * (barW + 3) + barW / 2
                      return (
                        <g key={tick}>
                          <line
                            x1={x}
                            y1={paddingTop + graphHeight}
                            x2={x}
                            y2={paddingTop + graphHeight + 4}
                            stroke="#cccccc"
                            strokeWidth="1"
                          />
                          <text
                            x={x}
                            y={paddingTop + graphHeight + 12}
                            textAnchor="middle"
                            fill="#888888"
                            className="font-mono text-[7px] font-bold"
                          >
                            {tick}r
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
              </div>

              {/* Side-by-Side Reference Tables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Left Table: Estimated Max Reps */}
                <div className="border border-neutral-350 rounded-xl overflow-hidden">
                  <div className="bg-neutral-50 px-3 py-2 border-b border-neutral-300 font-mono text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                    Estimated Max Reps
                  </div>
                  <div className="max-h-[220px] overflow-y-auto">
                    <table className="w-full text-left border-collapse text-[10px] font-mono bg-white">
                      <thead>
                        <tr className="bg-neutral-50/50 border-b border-neutral-250 text-[8px] text-neutral-400 font-bold uppercase">
                          <th className="p-2">Reps</th>
                          <th className="p-2 text-right">Weight</th>
                          <th className="p-2 text-right">% of 1RM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 text-dark-800">
                        {repList.map((rVal) => {
                          const repW = computeWeightForReps(oneRepMaxVal, rVal, formula)
                          const pct = (repW / oneRepMaxVal) * 100
                          return (
                            <tr key={rVal} className="hover:bg-neutral-50">
                              <td className="p-2 font-bold">{rVal}</td>
                              <td className="p-2 font-black text-right">{repW.toFixed(1)} {resultUnit}</td>
                              <td className="p-2 text-right text-neutral-500">{Math.round(pct)}%</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Table: Reps by % of 1RM */}
                <div className="border border-neutral-350 rounded-xl overflow-hidden">
                  <div className="bg-neutral-50 px-3 py-2 border-b border-neutral-300 font-mono text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                    Reps by % of 1RM
                  </div>
                  <div className="max-h-[220px] overflow-y-auto">
                    <table className="w-full text-left border-collapse text-[10px] font-mono bg-white">
                      <thead>
                        <tr className="bg-neutral-50/50 border-b border-neutral-250 text-[8px] text-neutral-400 font-bold uppercase">
                          <th className="p-2">% of 1RM</th>
                          <th className="p-2 text-right">Weight</th>
                          <th className="p-2 text-right">Repetitions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 text-dark-800">
                        {percentages.map((pct) => {
                          const wPct = oneRepMaxVal * (pct / 100)
                          const rLimit = computeRepsForPercentage(pct, formula)
                          return (
                            <tr key={pct} className="hover:bg-neutral-50">
                              <td className="p-2 font-bold">{pct}%</td>
                              <td className="p-2 font-black text-right">{wPct.toFixed(1)} {resultUnit}</td>
                              <td className="p-2 text-right text-neutral-500">{rLimit} rep{rLimit > 1 ? 's' : ''}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <ShareExportPanel
                queryParams={queryParams}
                emailSubject="One Rep Max Estimation Results"
                emailBody={
                  `One Rep Max (1RM) Results:\n` +
                  `- Weight Lifted: ${weight} ${weightUnit}\n` +
                  `- Repetitions: ${reps}\n` +
                  `- Estimation Formula: ${formula.toUpperCase()}\n` +
                  `- Calculated 1RM: ${calculated1RM ? calculated1RM.toFixed(1) : ''} ${resultUnit}`
                }
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <BarChart2 className="w-12 h-12 text-neutral-400 stroke-1 mb-3" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Inputs</p>
              <p className="text-[10px] font-mono mt-1 max-w-[220px] leading-relaxed">
                Provide weight lifted, repetitions completed, and calculation formula, then click calculate to view strength breakdowns.
              </p>
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
