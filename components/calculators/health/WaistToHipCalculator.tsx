'use client'

import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'
import ShareExportPanel from '../shared/ShareExportPanel'
import { AlertTriangle, Info, Activity, ShieldCheck, Heart } from 'lucide-react'

export default function WaistToHipCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm')
  const [waist, setWaist] = useState('90')
  const [hip, setHip] = useState('100')

  // Result states
  const [isCalculated, setIsCalculated] = useState(false)
  const [resultRatio, setResultRatio] = useState<number | null>(null)
  const [riskCategory, setRiskCategory] = useState<{
    name: string
    desc: string
    colorClass: string
    bgClass: string
    borderClass: string
  } | null>(null)
  const [bodyShape, setBodyShape] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // URL Serialization
  const [queryParams, setQueryParams] = useState('')
  const [emailBody, setEmailBody] = useState('')

  useEffect(() => {
    // Parse URL query parameters on mount
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const g = params.get('g')
      const u = params.get('u')
      const w = params.get('w')
      const h = params.get('h')
      
      let initialGender: 'male' | 'female' = 'male'
      let initialUnit: 'cm' | 'inches' = 'cm'
      let initialWaist = '90'
      let initialHip = '100'

      if (g === 'male' || g === 'female') {
        setGender(g)
        initialGender = g
      }
      if (u === 'cm' || u === 'inches') {
        setUnit(u)
        initialUnit = u
      }
      if (w && !isNaN(parseFloat(w))) {
        setWaist(w)
        initialWaist = w
      }
      if (h && !isNaN(parseFloat(h))) {
        setHip(h)
        initialHip = h
      }

      // If parameters were present in the URL, calculate results immediately
      if (w && h) {
        calculateResults(initialGender, initialUnit, parseFloat(initialWaist), parseFloat(initialHip))
      }
    }
  }, [])

  const handleClear = () => {
    setGender('male')
    setUnit('cm')
    setWaist('90')
    setHip('100')
    setIsCalculated(false)
    setResultRatio(null)
    setRiskCategory(null)
    setBodyShape('')
    setErrorMsg('')
    setQueryParams('')
    setEmailBody('')
  }

  const calculateResults = (g: 'male' | 'female', u: 'cm' | 'inches', wVal: number, hVal: number) => {
    const ratio = wVal / hVal
    setResultRatio(ratio)

    // WHO Waist-to-Hip standards
    let risk = {
      name: 'Low Risk',
      desc: 'Healthy body fat distribution.',
      colorClass: 'text-emerald-700 font-bold',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-200'
    }

    if (g === 'male') {
      if (ratio >= 0.90 && ratio < 1.00) {
        risk = {
          name: 'Moderate Risk',
          desc: 'Increased risk of weight-related health issues.',
          colorClass: 'text-amber-700 font-bold',
          bgClass: 'bg-amber-50',
          borderClass: 'border-amber-200'
        }
      } else if (ratio >= 1.00) {
        risk = {
          name: 'High Risk',
          desc: 'Significant risk of cardiovascular disease, diabetes, and metabolic syndrome.',
          colorClass: 'text-red-700 font-bold',
          bgClass: 'bg-red-50',
          borderClass: 'border-red-200'
        }
      }
    } else {
      if (ratio >= 0.80 && ratio < 0.86) {
        risk = {
          name: 'Moderate Risk',
          desc: 'Increased risk of weight-related health issues.',
          colorClass: 'text-amber-700 font-bold',
          bgClass: 'bg-amber-50',
          borderClass: 'border-amber-200'
        }
      } else if (ratio >= 0.86) {
        risk = {
          name: 'High Risk',
          desc: 'Significant risk of cardiovascular disease, diabetes, and metabolic syndrome.',
          colorClass: 'text-red-700 font-bold',
          bgClass: 'bg-red-50',
          borderClass: 'border-red-200'
        }
      }
    }

    setRiskCategory(risk)

    // Body shape classification
    let shape = 'Ruler (Straight)'
    if (g === 'female') {
      if (ratio < 0.75) {
        shape = 'Hourglass or Pear Shape'
      } else if (ratio >= 0.85) {
        shape = 'Apple Shape'
      }
    } else {
      if (ratio < 0.85) {
        shape = 'Pear Shape'
      } else if (ratio >= 0.95) {
        shape = 'Apple Shape'
      }
    }
    setBodyShape(shape)

    // Build URL query string
    setQueryParams(`w=${wVal}&h=${hVal}&g=${g}&u=${u}`)
    
    // Build Email body content
    setEmailBody(
      `Waist-to-Hip Ratio Calculation Results:\n` +
      `- Gender: ${g === 'male' ? 'Male' : 'Female'}\n` +
      `- Waist: ${wVal} ${u}\n` +
      `- Hip: ${hVal} ${u}\n` +
      `- Waist-to-Hip Ratio: ${ratio.toFixed(2)}\n` +
      `- Risk Assessment: ${risk.name} (${risk.desc})\n` +
      `- General Body Classification: ${shape}`
    )

    setIsCalculated(true)
  }

  const handleCalculate = () => {
    setErrorMsg('')
    const wVal = parseFloat(waist)
    const hVal = parseFloat(hip)

    if (isNaN(wVal) || wVal <= 0 || isNaN(hVal) || hVal <= 0) {
      setErrorMsg('Please enter valid positive measurements for waist and hips.')
      return
    }

    calculateResults(gender, unit, wVal, hVal)
  }

  // Visual Slider config
  const minScale = 0.60
  const maxScale = 1.10
  const currentRatio = resultRatio || 0.85
  const markerPosition = Math.min(100, Math.max(0, ((currentRatio - minScale) / (maxScale - minScale)) * 100))

  return (
    <FormCalculatorShell title="Waist-to-Hip Ratio Calculator" badge="HEALTH" subtitle="Determine body fat distribution and cardiovascular risk">
      <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="space-y-4 no-print">
          {/* Gender */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
              Biological Gender
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

          {/* Unit System */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
              Measurement Unit
            </label>
            <div className="flex gap-1 bg-neutral-200/80 p-1 rounded-lg border border-neutral-300 h-10 items-center">
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                  unit === 'cm'
                    ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Centimeters (cm)
              </button>
              <button
                type="button"
                onClick={() => setUnit('inches')}
                className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md h-8 transition-all ${
                  unit === 'inches'
                    ? 'bg-white border-neutral-300 text-neutral-800 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Inches (in)
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <RetroInput
              label="Waist Size"
              value={waist}
              onChange={setWaist}
              placeholder={unit === 'cm' ? '90' : '35'}
              unit={unit}
              id="whr-waist"
              type="number"
            />
            <RetroInput
              label="Hip Size"
              value={hip}
              onChange={setHip}
              placeholder={unit === 'cm' ? '100' : '40'}
              unit={unit}
              id="whr-hip"
              type="number"
            />
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
              Calculate WHR
            </RetroActionButton>
            <RetroActionButton onClick={handleClear} variant="secondary">
              Clear
            </RetroActionButton>
          </div>

          {/* How to measure helper panel */}
          <div className="p-3 bg-neutral-50 border border-neutral-250 rounded-xl space-y-2 text-[10.5px] text-neutral-600 font-sans leading-relaxed">
            <span className="font-bold text-neutral-800 font-mono text-[9px] uppercase tracking-wider block flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-neutral-500" />
              How to Measure Waist & Hips
            </span>
            <p>
              <strong>Waist:</strong> Measure at your narrowest waist point (typically just above your belly button). Keep the tape snug but not tight, and breathe out naturally.
            </p>
            <p>
              <strong>Hips:</strong> Measure around the widest part of your buttocks/hips with your heels together.
            </p>
          </div>
        </div>

        {/* Right Column: Risk Assessment & Visualization */}
        <div className="bg-[#eae7df]/50 border-2 border-[#dad6cd] rounded-xl p-4 sm:p-6 h-full flex flex-col justify-between min-h-[350px] print-target">
          {isCalculated && resultRatio && riskCategory ? (
            <div className="space-y-6">
              {/* Highlight display card */}
              <div className="p-5 sm:p-6 bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-xl shadow-inner text-center font-mono relative overflow-hidden">
                <div className="absolute right-2 top-2 text-[#4c5c4a]/30">
                  <Activity className="w-12 h-12 stroke-[1.5]" />
                </div>
                <div className="text-[10px] font-bold text-[#4c5c4a] uppercase tracking-widest mb-1.5">
                  Waist-to-Hip Ratio (WHR)
                </div>
                <div className="text-4xl font-black text-[#1a2019] tracking-tight">
                  {resultRatio.toFixed(2)}
                </div>
                
                <div className={`mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] uppercase font-bold ${riskCategory.bgClass} ${riskCategory.borderClass} ${riskCategory.colorClass}`}>
                  {riskCategory.name}
                </div>
              </div>

              {/* Slider scale */}
              <div className="bg-white border border-neutral-300 rounded-xl p-4 space-y-3">
                <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider block">
                  WHO Risk Distribution Scale
                </span>
                
                <div className="relative pt-4">
                  {/* Background scale ranges */}
                  <div className="h-3 w-full rounded-full flex overflow-hidden border border-neutral-200">
                    {/* Female vs Male colored blocks */}
                    {gender === 'female' ? (
                      <>
                        <div className="bg-emerald-500 w-[40%]" title="Low Risk (<0.80)" />
                        <div className="bg-amber-500 w-[12%]" title="Moderate Risk (0.80 - 0.85)" />
                        <div className="bg-red-500 w-[48%]" title="High Risk (>=0.86)" />
                      </>
                    ) : (
                      <>
                        <div className="bg-emerald-500 w-[60%]" title="Low Risk (<0.90)" />
                        <div className="bg-amber-500 w-[20%]" title="Moderate Risk (0.90 - 0.99)" />
                        <div className="bg-red-500 w-[20%]" title="High Risk (>=1.00)" />
                      </>
                    )}
                  </div>

                  {/* Slider marker */}
                  <div
                    className="absolute -top-1.5 transition-all duration-300"
                    style={{ left: `calc(${markerPosition}% - 4px)` }}
                  >
                    <div className="w-2.5 h-2.5 bg-neutral-900 rotate-45 border border-white shadow-sm" />
                  </div>
                </div>

                <div className="flex justify-between text-[8px] font-mono font-bold text-neutral-400 uppercase">
                  <span>0.60</span>
                  <span>{gender === 'female' ? '0.80' : '0.90'}</span>
                  <span>{gender === 'female' ? '0.85' : '1.00'}</span>
                  <span>1.10+</span>
                </div>
              </div>

              {/* Classification list details */}
              <div className="border border-neutral-300 rounded-xl overflow-hidden bg-white text-xs font-mono">
                <div className="p-3 bg-neutral-50 border-b border-neutral-300 font-bold text-neutral-700 uppercase text-[10px] tracking-wider">
                  Health Assessment Summary
                </div>
                <div className="p-3.5 space-y-3">
                  <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                    <span className="text-neutral-500">General Body Shape:</span>
                    <span className="font-bold text-neutral-800">{bodyShape}</span>
                  </div>
                  <div className="flex justify-between items-start py-1">
                    <span className="text-neutral-500 shrink-0">WHR Risk Profile:</span>
                    <span className="font-bold text-neutral-800 text-right leading-relaxed max-w-[200px]">{riskCategory.desc}</span>
                  </div>
                </div>
              </div>

              {/* Share / Export Panel */}
              <ShareExportPanel
                queryParams={queryParams}
                emailSubject="Waist-to-Hip Ratio Health Assessment Results"
                emailBody={emailBody}
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <Heart className="w-12 h-12 text-neutral-400 stroke-1 mb-3 animate-pulse" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Inputs</p>
              <p className="text-[10px] font-mono mt-1 max-w-[220px] leading-relaxed">
                Provide waist and hip sizes in centimeters or inches, along with biological gender, to calculate risk and view fat distribution patterns.
              </p>
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}