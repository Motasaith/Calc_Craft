'use client'

import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, RetroActionButton } from '../shared/FormCalculatorShell'
import ShareExportPanel from '../shared/ShareExportPanel'
import { AlertTriangle, Info, Activity } from 'lucide-react'

export default function GfrCalculator() {
  const [calculatorMode, setCalculatorMode] = useState<'adult' | 'child'>('adult')
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('50')
  const [creatinine, setCreatinine] = useState('0.9')
  const [unit, setUnit] = useState<'mg' | 'umol'>('mg')
  const [formula, setFormula] = useState<'ckd-epi-2021' | 'ckd-epi-2009' | 'mdrd' | 'mayo'>('ckd-epi-2021')
  const [race, setRace] = useState<'black' | 'non-black'>('non-black')

  // Child mode states
  const [heightCm, setHeightCm] = useState('110')

  // Result states
  const [isCalculated, setIsCalculated] = useState(false)
  const [results, setResults] = useState<{
    ckdEpi2021: number | null
    ckdEpi2009: number | null
    mdrd: number | null
    mayo: number | null
    schwartz: number | null
    activeGfr: number
    stage: {
      name: string
      desc: string
      colorClass: string
      bgClass: string
      borderClass: string
    }
  } | null>(null)
  
  const [errorMsg, setErrorMsg] = useState('')

  // URL serialization states
  const [queryParams, setQueryParams] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('m', calculatorMode)
    params.set('g', sex)
    params.set('a', age)
    params.set('cr', creatinine)
    params.set('u', unit)
    params.set('f', formula)
    params.set('r', race)
    params.set('h', heightCm)
    setQueryParams(params.toString())
  }, [calculatorMode, sex, age, creatinine, unit, formula, race, heightCm])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const m = params.get('m')
      const g = params.get('g')
      const a = params.get('a')
      const cr = params.get('cr')
      const u = params.get('u')
      const f = params.get('f')
      const r = params.get('r')
      const h = params.get('h')

      if (m === 'adult' || m === 'child') setCalculatorMode(m)
      if (g === 'male' || g === 'female') setSex(g)
      if (a) setAge(a)
      if (cr) setCreatinine(cr)
      if (u === 'mg' || u === 'umol') setUnit(u)
      if (f === 'ckd-epi-2021' || f === 'ckd-epi-2009' || f === 'mdrd' || f === 'mayo') setFormula(f)
      if (r === 'black' || r === 'non-black') setRace(r)
      if (h) setHeightCm(h)

      if (cr) {
        setIsCalculated(true)
      }
    }
  }, [])

  const handleClear = () => {
    setCalculatorMode('adult')
    setSex('male')
    setAge('50')
    setCreatinine('0.9')
    setUnit('mg')
    setFormula('ckd-epi-2021')
    setRace('non-black')
    setHeightCm('110')
    setIsCalculated(false)
    setResults(null)
    setErrorMsg('')
  }

  const handleCalculate = () => {
    setErrorMsg('')
    const cr = parseFloat(creatinine)
    if (isNaN(cr) || cr <= 0) {
      setErrorMsg('Please enter a valid serum creatinine value.')
      return
    }

    const scr = unit === 'umol' ? cr / 88.4 : cr

    if (calculatorMode === 'child') {
      const h = parseFloat(heightCm)
      if (isNaN(h) || h <= 0) {
        setErrorMsg('Please enter a valid height value.')
        return
      }

      // Schwartz child formula: GFR = 0.413 * heightCm / SCr
      const gfrSchwartz = 0.413 * h / scr
      setResults({
        ckdEpi2021: null,
        ckdEpi2009: null,
        mdrd: null,
        mayo: null,
        schwartz: gfrSchwartz,
        activeGfr: gfrSchwartz,
        stage: getCKDStage(gfrSchwartz)
      })
    } else {
      const a = parseInt(age)
      if (isNaN(a) || a < 18 || a > 120) {
        setErrorMsg('Please enter a valid adult age (18 to 120).')
        return
      }

      // 1. 2021 CKD-EPI (Race-free)
      let gfr2021 = 0
      if (sex === 'female') {
        const minVal = Math.min(scr / 0.7, 1)
        const maxVal = Math.max(scr / 0.7, 1)
        gfr2021 = 142 * Math.pow(minVal, -0.241) * Math.pow(maxVal, -1.200) * Math.pow(0.9938, a) * 1.012
      } else {
        const minVal = Math.min(scr / 0.9, 1)
        const maxVal = Math.max(scr / 0.9, 1)
        gfr2021 = 142 * Math.pow(minVal, -0.302) * Math.pow(maxVal, -1.200) * Math.pow(0.9938, a)
      }

      // 2. 2009 CKD-EPI (With race)
      let gfr2009 = 0
      if (race === 'black') {
        if (sex === 'female') {
          const minVal = Math.min(scr / 0.7, 1)
          const maxVal = Math.max(scr / 0.7, 1)
          gfr2009 = 166 * Math.pow(minVal, -0.329) * Math.pow(maxVal, -1.209) * Math.pow(0.993, a)
        } else {
          const minVal = Math.min(scr / 0.9, 1)
          const maxVal = Math.max(scr / 0.9, 1)
          gfr2009 = 163 * Math.pow(minVal, -0.411) * Math.pow(maxVal, -1.209) * Math.pow(0.993, a)
        }
      } else {
        if (sex === 'female') {
          const minVal = Math.min(scr / 0.7, 1)
          const maxVal = Math.max(scr / 0.7, 1)
          gfr2009 = 144 * Math.pow(minVal, -0.329) * Math.pow(maxVal, -1.209) * Math.pow(0.993, a)
        } else {
          const minVal = Math.min(scr / 0.9, 1)
          const maxVal = Math.max(scr / 0.9, 1)
          gfr2009 = 141 * Math.pow(minVal, -0.411) * Math.pow(maxVal, -1.209) * Math.pow(0.993, a)
        }
      }

      // 3. MDRD Study Formula
      // GFR = 175 * SCr^-1.154 * age^-0.203 * (0.742 if female) * (1.212 if Black)
      let gfrMdrd = 175 * Math.pow(scr, -1.154) * Math.pow(a, -0.203)
      if (sex === 'female') gfrMdrd *= 0.742
      if (race === 'black') gfrMdrd *= 1.212

      // 4. Mayo Quadratic
      // If SCr < 0.8, use 0.8
      const scrMayo = Math.max(0.8, scr)
      const gfrMayo = Math.exp(
        1.911 +
        5.249 / scrMayo -
        2.114 / Math.pow(scrMayo, 2) -
        0.00686 * a -
        (sex === 'female' ? 0.205 : 0)
      )

      let active = gfr2021
      if (formula === 'ckd-epi-2009') active = gfr2009
      else if (formula === 'mdrd') active = gfrMdrd
      else if (formula === 'mayo') active = gfrMayo

      setResults({
        ckdEpi2021: gfr2021,
        ckdEpi2009: gfr2009,
        mdrd: gfrMdrd,
        mayo: gfrMayo,
        schwartz: null,
        activeGfr: active,
        stage: getCKDStage(active)
      })
    }

    setIsCalculated(true)
  }

  const getCKDStage = (gfr: number) => {
    if (gfr >= 90) {
      return {
        name: 'Normal',
        desc: 'Normal or high kidney function',
        colorClass: 'text-emerald-700 font-bold',
        bgClass: 'bg-emerald-50',
        borderClass: 'border-emerald-200'
      }
    } else if (gfr >= 60) {
      return {
        name: 'CKD Stage 2 (Mild)',
        desc: 'Mildly decreased kidney function',
        colorClass: 'text-lime-700 font-bold',
        bgClass: 'bg-lime-50',
        borderClass: 'border-lime-200'
      }
    } else if (gfr >= 30) {
      return {
        name: 'CKD Stage 3 (Moderate)',
        desc: 'Moderately decreased kidney function',
        colorClass: 'text-amber-700 font-bold',
        bgClass: 'bg-amber-50',
        borderClass: 'border-amber-200'
      }
    } else if (gfr >= 15) {
      return {
        name: 'CKD Stage 4 (Severe)',
        desc: 'Severely decreased kidney function',
        colorClass: 'text-red-700 font-bold',
        bgClass: 'bg-red-50',
        borderClass: 'border-red-200'
      }
    } else {
      return {
        name: 'CKD Stage 5 (Failure)',
        desc: 'Kidney failure / End-stage renal disease',
        colorClass: 'text-purple-700 font-bold',
        bgClass: 'bg-purple-50',
        borderClass: 'border-purple-200'
      }
    }
  }

  // Visual Slider config
  const maxGfrScale = 120
  const activeGfrVal = results ? results.activeGfr : 90
  const markerPosition = Math.min(100, Math.max(0, (activeGfrVal / maxGfrScale) * 100))

  return (
    <FormCalculatorShell title="Glomerular Filtration Rate Calculator" badge="HEALTH" subtitle="eGFR Kidney Function Estimator">
      <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="space-y-4 no-print">
          {/* Calculator Mode Switcher */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
              Patient Category
            </label>
            <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-lg border border-neutral-300 h-10 items-center">
              <button
                type="button"
                onClick={() => setCalculatorMode('adult')}
                className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                  calculatorMode === 'adult'
                    ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Adult (18+)
              </button>
              <button
                type="button"
                onClick={() => setCalculatorMode('child')}
                className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                  calculatorMode === 'child'
                    ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Child (1-17)
              </button>
            </div>
          </div>

          {/* Creatinine Input & Unit */}
          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-8">
              <RetroInput
                label="Serum Creatinine"
                value={creatinine}
                onChange={setCreatinine}
                placeholder="0.9"
                id="gfr-creatinine"
                type="number"
              />
            </div>
            <div className="col-span-4">
              <RetroSelect
                label="Unit"
                value={unit}
                onChange={(val) => setUnit(val as 'mg' | 'umol')}
                options={[
                  { value: 'mg', label: 'mg/dL' },
                  { value: 'umol', label: 'μmol/L' }
                ]}
                id="gfr-unit"
              />
            </div>
          </div>

          {/* Age (Adult only) */}
          {calculatorMode === 'adult' && (
            <RetroInput
              label="Age (Years)"
              value={age}
              onChange={setAge}
              placeholder="50"
              id="gfr-age"
              type="number"
            />
          )}

          {/* Height (Child only) */}
          {calculatorMode === 'child' && (
            <RetroInput
              label="Height (cm)"
              value={heightCm}
              onChange={setHeightCm}
              placeholder="110"
              id="gfr-height"
              type="number"
            />
          )}

          {/* Gender */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
              Gender
            </label>
            <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-lg border border-neutral-300 h-10 items-center">
              <button
                type="button"
                onClick={() => setSex('male')}
                className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                  sex === 'male'
                    ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setSex('female')}
                className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                  sex === 'female'
                    ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Formula selection (Adult only) */}
          {calculatorMode === 'adult' && (
            <RetroSelect
              label="Calculation Formula"
              value={formula}
              onChange={(val) => setFormula(val as any)}
              options={[
                { value: 'ckd-epi-2021', label: '2021 CKD-EPI (Recommended - No Race)' },
                { value: 'ckd-epi-2009', label: '2009 CKD-EPI (With Race Factor)' },
                { value: 'mdrd', label: 'MDRD Study 4-Variable Equation' },
                { value: 'mayo', label: 'Mayo Quadratic Formula' }
              ]}
              id="gfr-formula"
            />
          )}

          {/* Race (only shown for old formulas) */}
          {calculatorMode === 'adult' && (formula === 'ckd-epi-2009' || formula === 'mdrd') && (
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1">
                Race Factor <span className="text-[9px] text-neutral-450 font-normal capitalize">(Required by {formula.toUpperCase()})</span>
              </label>
              <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-lg border border-neutral-300 h-10 items-center">
                <button
                  type="button"
                  onClick={() => setRace('black')}
                  className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                    race === 'black'
                      ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Black
                </button>
                <button
                  type="button"
                  onClick={() => setRace('non-black')}
                  className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                    race === 'non-black'
                      ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Not Black
                </button>
              </div>
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
              Calculate GFR
            </RetroActionButton>
            <RetroActionButton onClick={handleClear} variant="secondary">
              Clear
            </RetroActionButton>
          </div>
        </div>

        {/* Right Column: Visual Stage dial & Comparative breakdown */}
        <div className="bg-[#eae7df]/50 border-2 border-[#dad6cd] rounded-xl p-4 sm:p-6 h-full flex flex-col justify-between min-h-[350px] print-target">
          {isCalculated && results ? (
            <div className="space-y-6">
              {/* Highlight GFR and stage card */}
              <div className="p-5 sm:p-6 bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-xl shadow-inner text-center font-mono relative overflow-hidden">
                <div className="absolute right-2 top-2 text-[#4c5c4a]/30">
                  <Activity className="w-12 h-12 stroke-[1.5]" />
                </div>
                <div className="text-[10px] font-bold text-[#4c5c4a] uppercase tracking-widest mb-1.5">
                  Estimated GFR
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#1a2019] tracking-tight">
                  {results.activeGfr.toFixed(1)} <span className="text-sm font-normal">mL/min/1.73m²</span>
                </div>
                
                <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] uppercase font-bold ${results.stage.bgClass} ${results.stage.borderClass} ${results.stage.colorClass}`}>
                  {results.stage.name} : {results.stage.desc}
                </div>
              </div>

              {/* Interactive SVG range line indicator */}
              <div className="bg-white border border-neutral-300 rounded-xl p-4 space-y-3">
                <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider block">
                  Kidney Function Range Scale
                </span>
                
                <div className="relative pt-4">
                  {/* Slider background segments */}
                  <div className="h-3 w-full rounded-full flex overflow-hidden border border-neutral-200">
                    <div className="bg-purple-600 w-[12.5%]" title="Failure (<15)" />
                    <div className="bg-red-500 w-[12.5%]" title="Severe (15-29)" />
                    <div className="bg-amber-500 w-[25%]" title="Moderate (30-59)" />
                    <div className="bg-lime-500 w-[25%]" title="Mild (60-89)" />
                    <div className="bg-emerald-500 w-[25%]" title="Normal (90+)" />
                  </div>

                  {/* Marker pointer */}
                  <div
                    className="absolute -top-1.5 transition-all duration-300"
                    style={{ left: `calc(${markerPosition}% - 4px)` }}
                  >
                    <div className="w-2.5 h-2.5 bg-neutral-900 rotate-45 border border-white shadow-sm" />
                  </div>
                </div>

                <div className="flex justify-between text-[8px] font-mono font-bold text-neutral-400 uppercase">
                  <span>0</span>
                  <span>15</span>
                  <span>30</span>
                  <span>60</span>
                  <span>90</span>
                  <span>120+</span>
                </div>
              </div>

              {/* Detailed tables / Comparative equations */}
              <div className="border border-neutral-300 rounded-xl overflow-hidden bg-white text-xs font-mono">
                <div className="p-3 bg-neutral-50 border-b border-neutral-300 font-bold text-neutral-700 uppercase text-[10px] tracking-wider">
                  {calculatorMode === 'child' ? 'Schwartz Equation (Child)' : 'Formula Estimations comparison'}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] text-neutral-500 uppercase">
                        <th className="p-2.5">Equation Model</th>
                        <th className="p-2.5 text-right">eGFR Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 text-dark-700">
                      {calculatorMode === 'child' ? (
                        <tr>
                          <td className="p-2.5 font-bold">Schwartz (Height-based)</td>
                          <td className="p-2.5 text-right font-bold text-emerald-600">{results.schwartz!.toFixed(1)} mL/min</td>
                        </tr>
                      ) : (
                        <>
                          <tr className={formula === 'ckd-epi-2021' ? 'bg-neutral-50/50' : ''}>
                            <td className="p-2.5 font-bold flex items-center gap-1">
                              2021 CKD-EPI <span className="text-[8px] text-emerald-600 border border-emerald-200 bg-emerald-50 px-1 rounded uppercase font-bold">Recommended</span>
                            </td>
                            <td className="p-2.5 text-right font-bold">{results.ckdEpi2021!.toFixed(1)}</td>
                          </tr>
                          <tr className={formula === 'ckd-epi-2009' ? 'bg-neutral-50/50' : ''}>
                            <td className="p-2.5">2009 CKD-EPI (With Race)</td>
                            <td className="p-2.5 text-right font-bold">{results.ckdEpi2009!.toFixed(1)}</td>
                          </tr>
                          <tr className={formula === 'mdrd' ? 'bg-neutral-50/50' : ''}>
                            <td className="p-2.5">MDRD Study Equation</td>
                            <td className="p-2.5 text-right font-bold">{results.mdrd!.toFixed(1)}</td>
                          </tr>
                          <tr className={formula === 'mayo' ? 'bg-neutral-50/50' : ''}>
                            <td className="p-2.5">Mayo Quadratic Formula</td>
                            <td className="p-2.5 text-right font-bold">{results.mayo!.toFixed(1)}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <ShareExportPanel
                queryParams={queryParams}
                emailSubject="Glomerular Filtration Rate (GFR) Results"
                emailBody={
                  `Glomerular Filtration Rate (GFR) Calculation Results:\n` +
                  `- Mode: ${calculatorMode === 'child' ? 'Child' : 'Adult'}\n` +
                  `- Gender: ${sex === 'male' ? 'Male' : 'Female'}\n` +
                  `- Serum Creatinine: ${creatinine} ${unit === 'mg' ? 'mg/dL' : 'µmol/L'}\n` +
                  `- Selected Equation: ${formula.toUpperCase()}\n` +
                  `- Calculated eGFR GFR: ${results ? results.activeGfr.toFixed(1) : ''} mL/min/1.73m²\n` +
                  `- Kidney Function Assessment: ${results ? results.stage.name + ' - ' + results.stage.desc : ''}`
                }
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <Info className="w-12 h-12 text-neutral-400 stroke-1 mb-3 animate-pulse" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Inputs</p>
              <p className="text-[10px] font-mono mt-1 max-w-[220px] leading-relaxed">
                Provide serum creatinine value, age, and biological gender to calculate GFR and view kidney stage classifications.
              </p>
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
