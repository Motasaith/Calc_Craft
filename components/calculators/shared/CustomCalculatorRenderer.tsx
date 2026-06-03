'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { FileDown, Printer, Play, RefreshCw } from 'lucide-react'
import { evaluateFormula } from '@/lib/formula-parser'
import { exportToCSV, exportToPDF } from '@/lib/export-utils'

export type CustomThemeType = 'retro' | 'dark' | 'modern' | 'pastel' | 'cyberpunk' | 'custom'

export interface CustomCalculatorConfig {
  id: string
  name: string
  description: string
  logo?: string // base64 or URL
  brandName?: string
  theme: CustomThemeType
  customColors?: {
    primary: string
    secondary: string
    background: string
    text: string
    lcdBg?: string
    lcdText?: string
  }
  layout?: 'stacked' | 'grid'
  components: CustomComponentConfig[]
  formulas: CustomFormulaConfig[]
}

export interface CustomComponentConfig {
  id: string
  name: string // variable name used in formulas (e.g., 'w', 'h')
  type: 'number' | 'slider' | 'select' | 'checkbox' | 'header' | 'text'
  label: string
  placeholder?: string
  defaultValue?: string | number | boolean
  min?: number
  max?: number
  step?: number
  unit?: string
  options?: { value: string; label: string }[]
  helpText?: string
}

export interface CustomFormulaConfig {
  id: string
  label: string
  formula: string // mathematical expression like 'w / (h * h)'
  decimalPlaces: number
  prefix?: string
  suffix?: string
}

interface RendererProps {
  config: CustomCalculatorConfig
  isPreview?: boolean
}

export default function CustomCalculatorRenderer({ config, isPreview = false }: RendererProps) {
  // Initialize state from component defaults
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const initial: Record<string, string> = {}
    config.components.forEach((c) => {
      if (c.type === 'header' || c.type === 'text') return
      
      const defVal = c.defaultValue !== undefined ? String(c.defaultValue) : ''
      initial[c.name] = defVal
    })
    setValues(initial)
  }, [config.components])

  const handleValueChange = (name: string, val: string) => {
    setValues((prev) => ({ ...prev, [name]: val }))
  }

  // Map input values into a numeric format for parsing formulas
  const variablesMap = useMemo(() => {
    const map: Record<string, number> = {}
    config.components.forEach((c) => {
      if (c.type === 'header' || c.type === 'text') return
      
      const raw = values[c.name]
      if (c.type === 'checkbox') {
        map[c.name] = raw === 'true' ? 1 : 0
      } else {
        const parsed = parseFloat(raw)
        map[c.name] = isNaN(parsed) ? 0 : parsed
      }
    })
    return map
  }, [config.components, values])

  // Compute results
  const results = useMemo(() => {
    return config.formulas.map((f) => {
      const numericVal = evaluateFormula(f.formula, variablesMap)
      
      // Format decimal places
      let formattedVal = numericVal.toFixed(f.decimalPlaces)
      // Remove trailing zeroes if requested, or keep strictly formatted
      if (formattedVal.includes('.')) {
        // Strip unnecessary trailing decimals for integers
        if (parseFloat(formattedVal) === Math.round(parseFloat(formattedVal)) && f.decimalPlaces === 0) {
          formattedVal = String(Math.round(numericVal))
        }
      }

      return {
        id: f.id,
        label: f.label,
        value: formattedVal,
        prefix: f.prefix || '',
        suffix: f.suffix || '',
      }
    })
  }, [config.formulas, variablesMap])

  // Reset to default values
  const handleReset = () => {
    const initial: Record<string, string> = {}
    config.components.forEach((c) => {
      if (c.type === 'header' || c.type === 'text') return
      const defVal = c.defaultValue !== undefined ? String(c.defaultValue) : ''
      initial[c.name] = defVal
    })
    setValues(initial)
  }

  // Export handlers
  const getExportData = () => {
    const inputFields = config.components
      .filter((c) => c.type !== 'header' && c.type !== 'text')
      .map((c) => {
        const raw = values[c.name]
        let displayVal = raw
        if (c.type === 'checkbox') {
          displayVal = raw === 'true' ? 'Yes' : 'No'
        } else if (c.type === 'select') {
          const opt = c.options?.find((o) => o.value === raw)
          if (opt) displayVal = opt.label
        }
        return {
          label: c.label,
          value: c.unit ? `${displayVal} ${c.unit}` : displayVal,
        }
      })

    const outputFields = results.map((r) => ({
      label: r.label,
      value: `${r.prefix}${r.value}${r.suffix}`,
    }))

    return { inputs: inputFields, results: outputFields }
  }

  const handleExportCSV = () => {
    const { inputs, results: outputResults } = getExportData()
    exportToCSV(config.name, inputs, outputResults)
  }

  const handleExportPDF = () => {
    const { inputs, results: outputResults } = getExportData()
    exportToPDF(config.name, config.logo, config.brandName, inputs, outputResults)
  }

  // --- THEME STYLE SHEETS ---
  const activeTheme = config.theme || 'retro'
  
  // Custom theme colors fallback
  const custom = config.customColors || {
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    background: '#ffffff',
    text: '#1a1a1f',
    lcdBg: '#cbd8ca',
    lcdText: '#1a2019',
  }

  const themeStyles = {
    retro: {
      wrapper: 'bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-[#2d2d2a] font-mono',
      header: 'border-b-2 border-[#d5d1c8] bg-[#e4e1d9] px-6 py-4',
      headerText: 'text-sm font-black tracking-wider uppercase text-neutral-700',
      description: 'text-[10px] text-neutral-500 font-bold',
      body: 'p-6 space-y-4',
      label: 'text-[11px] font-black uppercase text-neutral-600 tracking-wider',
      input: 'bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-bold text-neutral-800 px-3 h-10 w-full focus:outline-none focus:border-neutral-500 shadow-inner',
      sliderTrack: 'relative w-full h-4 bg-neutral-300 rounded border border-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] flex items-center px-1',
      checkbox: 'w-5 h-5 rounded border-2 border-neutral-300 accent-neutral-800 bg-[#fcfbfa]',
      select: 'bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-bold text-neutral-800 px-3 h-10 w-full focus:outline-none focus:border-neutral-500 appearance-none cursor-pointer',
      lcdDisplay: 'bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-lg p-4 shadow-inner text-[#1a2019]',
      lcdTitle: 'text-[9px] font-bold text-[#4c5c4a] uppercase tracking-wider',
      lcdValue: 'text-2xl font-black tracking-wide',
      btnPrimary: 'bg-[#dfaa44] text-neutral-900 border-2 border-[#be8b32] hover:bg-[#e5b44e] font-extrabold text-xs h-10 px-5 rounded-lg active:scale-95 shadow transition-all uppercase tracking-wider',
      btnSecondary: 'bg-neutral-300 text-neutral-700 border-2 border-neutral-400 hover:bg-neutral-250 font-extrabold text-xs h-10 px-4 rounded-lg active:scale-95 transition-all uppercase',
      headerComp: 'border-b border-neutral-300 pb-1 mt-4 text-xs font-black uppercase tracking-wider text-neutral-700',
      textComp: 'text-[11px] text-neutral-500 leading-relaxed font-bold',
    },
    dark: {
      wrapper: 'bg-[#12131a] border-2 border-purple-900/60 rounded-2xl shadow-[0_12px_40px_rgba(139,92,246,0.15)] text-gray-200 font-sans',
      header: 'border-b border-purple-950/50 bg-[#161824]/80 px-6 py-4',
      headerText: 'text-sm font-bold tracking-widest uppercase text-purple-400 font-mono',
      description: 'text-xs text-gray-400 font-light',
      body: 'p-6 space-y-5',
      label: 'text-[11px] font-semibold text-purple-300/80 uppercase tracking-widest',
      input: 'bg-[#1b1c26] border border-purple-900/40 rounded-xl text-sm text-white px-4 h-11 w-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-lg placeholder:text-gray-600',
      sliderTrack: 'relative w-full h-3 bg-purple-950/60 rounded-full border border-purple-900/30 flex items-center px-1',
      checkbox: 'w-5 h-5 rounded border border-purple-900 accent-purple-600 bg-[#1b1c26]',
      select: 'bg-[#1b1c26] border border-purple-900/40 rounded-xl text-sm text-white px-4 h-11 w-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none cursor-pointer',
      lcdDisplay: 'bg-[#0f1016] border border-purple-900/50 rounded-xl p-4 shadow-[inset_0_4px_16px_rgba(0,0,0,0.6)] text-purple-400 shadow-purple-900/5',
      lcdTitle: 'text-[10px] font-semibold text-purple-400/60 uppercase tracking-wider font-mono',
      lcdValue: 'text-2xl font-bold tracking-tight font-mono text-purple-200 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]',
      btnPrimary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs h-11 px-6 rounded-xl active:scale-[0.98] shadow-lg shadow-purple-500/10 transition-all uppercase tracking-wider',
      btnSecondary: 'bg-[#1e2030] hover:bg-[#25283c] text-purple-300 font-bold text-xs h-11 px-4 rounded-xl active:scale-[0.98] transition-all uppercase border border-purple-950/30',
      headerComp: 'border-b border-purple-950/40 pb-1 mt-4 text-xs font-bold text-purple-300 font-mono tracking-wide',
      textComp: 'text-xs text-gray-400 font-light leading-relaxed',
    },
    modern: {
      wrapper: 'bg-white border border-gray-200 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] text-gray-800 font-sans',
      header: 'border-b border-gray-100 bg-gray-50/50 px-6 py-4',
      headerText: 'text-sm font-extrabold tracking-tight text-gray-800',
      description: 'text-xs text-gray-500',
      body: 'p-6 space-y-4',
      label: 'text-[11px] font-bold text-gray-700 tracking-wide',
      input: 'bg-white border border-gray-300 rounded-xl text-sm text-gray-900 px-4 h-11 w-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-gray-400',
      sliderTrack: 'relative w-full h-2 bg-gray-200 rounded-full flex items-center',
      checkbox: 'w-5 h-5 rounded border-gray-300 accent-indigo-600 bg-white cursor-pointer',
      select: 'bg-white border border-gray-300 rounded-xl text-sm text-gray-900 px-4 h-11 w-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer transition-colors',
      lcdDisplay: 'bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-indigo-900',
      lcdTitle: 'text-[10px] font-bold text-indigo-600/80 uppercase tracking-wider',
      lcdValue: 'text-2xl font-extrabold tracking-tight text-indigo-900',
      btnPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-11 px-6 rounded-xl active:scale-[0.98] shadow-md shadow-indigo-600/10 transition-all uppercase tracking-wider',
      btnSecondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs h-11 px-4 rounded-xl active:scale-[0.98] transition-all uppercase',
      headerComp: 'border-b border-gray-200 pb-1 mt-4 text-xs font-bold text-gray-800 tracking-tight',
      textComp: 'text-xs text-gray-500 leading-relaxed',
    },
    pastel: {
      wrapper: 'bg-[#fcfaf5] border-4 border-[#e9e4d5] rounded-3xl shadow-[0_12px_24px_rgba(215,205,180,0.4)] text-[#4a4336] font-sans',
      header: 'border-b-4 border-[#e9e4d5] bg-[#f7f2e4] px-6 py-5',
      headerText: 'text-base font-extrabold text-[#5b513d]',
      description: 'text-xs text-[#8c7f66]',
      body: 'p-6 space-y-4',
      label: 'text-xs font-bold text-[#5b513d] tracking-wide',
      input: 'bg-[#ffffff] border-3 border-[#e9e4d5] rounded-2xl text-sm text-[#4a4336] px-4 h-11 w-full focus:outline-none focus:border-[#c5bda6] shadow-sm transition-all',
      sliderTrack: 'relative w-full h-3 bg-[#e9e4d5] rounded-full flex items-center',
      checkbox: 'w-6 h-6 rounded-lg border-3 border-[#e9e4d5] accent-[#8fa499] bg-[#ffffff] cursor-pointer',
      select: 'bg-[#ffffff] border-3 border-[#e9e4d5] rounded-2xl text-sm text-[#4a4336] px-4 h-11 w-full focus:outline-none focus:border-[#c5bda6] appearance-none cursor-pointer transition-all',
      lcdDisplay: 'bg-[#e2ebe6] border-3 border-[#c9dad0] rounded-2xl p-4 text-[#355342] shadow-sm',
      lcdTitle: 'text-[10px] font-bold text-[#5c7a68] uppercase tracking-widest',
      lcdValue: 'text-2xl font-black text-[#22392c]',
      btnPrimary: 'bg-[#e2a893] hover:bg-[#e6b3a0] text-white font-extrabold text-xs h-11 px-6 rounded-2xl active:scale-[0.97] shadow-sm transition-all uppercase tracking-wider',
      btnSecondary: 'bg-[#c5d5cd] hover:bg-[#d0ded7] text-[#3b4b44] font-extrabold text-xs h-11 px-4 rounded-2xl active:scale-[0.97] transition-all uppercase',
      headerComp: 'border-b-2 border-[#e9e4d5] pb-1 mt-4 text-xs font-bold text-[#5b513d]',
      textComp: 'text-xs text-[#8c7f66] leading-relaxed',
    },
    cyberpunk: {
      wrapper: 'bg-[#050505] border-2 border-yellow-400 rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.2)] text-yellow-400 font-mono',
      header: 'border-b-2 border-yellow-400 bg-yellow-400/5 px-6 py-4',
      headerText: 'text-sm font-black tracking-widest uppercase text-yellow-400',
      description: 'text-[10px] text-yellow-500/80 font-bold',
      body: 'p-6 space-y-4',
      label: 'text-[11px] font-black uppercase text-yellow-400 tracking-wider',
      input: 'bg-black border border-yellow-400 text-sm font-bold text-yellow-300 px-3 h-10 w-full focus:outline-none focus:shadow-[0_0_10px_rgba(250,204,21,0.4)] placeholder:text-yellow-900',
      sliderTrack: 'relative w-full h-3 bg-black border border-yellow-500/60 rounded flex items-center px-1',
      checkbox: 'w-5 h-5 rounded border border-yellow-400 accent-yellow-400 bg-black',
      select: 'bg-black border border-yellow-400 text-sm font-bold text-yellow-300 px-3 h-10 w-full focus:outline-none focus:shadow-[0_0_10px_rgba(250,204,21,0.4)] appearance-none cursor-pointer',
      lcdDisplay: 'bg-black border border-yellow-400 rounded p-4 shadow-[0_0_8px_rgba(250,204,21,0.1)] text-yellow-400',
      lcdTitle: 'text-[9px] font-black uppercase tracking-widest text-yellow-500/80',
      lcdValue: 'text-2xl font-black tracking-wider text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.3)]',
      btnPrimary: 'bg-yellow-400 text-black hover:bg-yellow-300 font-black text-xs h-10 px-5 rounded active:scale-95 shadow transition-all uppercase tracking-wider',
      btnSecondary: 'bg-black border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-bold text-xs h-10 px-4 rounded active:scale-95 transition-all uppercase',
      headerComp: 'border-b border-yellow-500 pb-1 mt-4 text-xs font-black uppercase tracking-wider text-yellow-400',
      textComp: 'text-[11px] text-yellow-500/70 leading-relaxed',
    },
    custom: {
      wrapper: 'rounded-2xl border text-[var(--custom-text)] font-sans',
      header: 'border-b px-6 py-4',
      headerText: 'text-sm font-bold tracking-tight text-[var(--custom-text)]',
      description: 'text-xs opacity-75',
      body: 'p-6 space-y-4',
      label: 'text-[11px] font-bold opacity-80 uppercase tracking-wide',
      input: 'border rounded-xl text-sm px-4 h-11 w-full focus:outline-none focus:ring-1 transition-all',
      sliderTrack: 'relative w-full h-2 rounded-full flex items-center',
      checkbox: 'w-5 h-5 rounded border cursor-pointer',
      select: 'border rounded-xl text-sm px-4 h-11 w-full focus:outline-none focus:ring-1 appearance-none cursor-pointer transition-all',
      lcdDisplay: 'border rounded-xl p-4',
      lcdTitle: 'text-[10px] font-bold uppercase tracking-wider opacity-70',
      lcdValue: 'text-2xl font-bold tracking-tight',
      btnPrimary: 'text-white font-bold text-xs h-11 px-6 rounded-xl active:scale-[0.98] shadow-md transition-all uppercase tracking-wider',
      btnSecondary: 'font-bold text-xs h-11 px-4 rounded-xl active:scale-[0.98] transition-all uppercase border',
      headerComp: 'border-b pb-1 mt-4 text-xs font-bold',
      textComp: 'text-xs opacity-80 leading-relaxed',
    },
  }

  const s = themeStyles[activeTheme]

  // Setup custom theme variable injection if custom style is selected
  const customVariables = activeTheme === 'custom' ? {
    '--custom-bg': custom.background,
    '--custom-text': custom.text,
    '--custom-primary': custom.primary,
    '--custom-secondary': custom.secondary,
    '--custom-lcd-bg': custom.lcdBg || '#e5e7eb',
    '--custom-lcd-text': custom.lcdText || '#111827',
  } as React.CSSProperties : {}

  const customStyleWrapper = activeTheme === 'custom' ? {
    backgroundColor: 'var(--custom-bg)',
    borderColor: 'rgba(0,0,0,0.08)',
    color: 'var(--custom-text)',
  } : {}

  return (
    <div 
      className={`w-full max-w-xl mx-auto ${s.wrapper}`}
      style={{ ...customStyleWrapper, ...customVariables }}
    >
      {/* Brand Header */}
      <div 
        className={s.header}
        style={activeTheme === 'custom' ? { borderBottomColor: 'rgba(0,0,0,0.08)' } : {}}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {config.logo && (
              <img 
                src={config.logo} 
                alt="Brand Logo" 
                className="max-h-8 max-w-[120px] object-contain rounded-md" 
              />
            )}
            <div>
              <h2 className={s.headerText}>{config.name}</h2>
              {config.description && <p className={s.description}>{config.description}</p>}
            </div>
          </div>
          {config.brandName && (
            <span className="text-[9px] uppercase px-2 py-0.5 rounded font-mono font-bold bg-neutral-800 text-white select-none">
              {config.brandName}
            </span>
          )}
        </div>
      </div>

      {/* Calculator Body */}
      <div className={s.body}>
        {config.components.map((c) => {
          if (c.type === 'header') {
            return (
              <div 
                key={c.id} 
                className={s.headerComp}
                style={activeTheme === 'custom' ? { borderBottomColor: 'rgba(0,0,0,0.08)', color: 'var(--custom-text)' } : {}}
              >
                {c.label}
              </div>
            )
          }

          if (c.type === 'text') {
            return (
              <p key={c.id} className={s.textComp}>
                {c.label}
              </p>
            )
          }

          const currentVal = values[c.name] ?? ''

          return (
            <div key={c.id} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className={s.label}>{c.label}</label>
                {c.helpText && (
                  <span className="text-[9px] opacity-60 font-mono italic">{c.helpText}</span>
                )}
              </div>

              {c.type === 'number' && (
                <div className="relative">
                  <input
                    type="number"
                    min={c.min}
                    max={c.max}
                    step={c.step}
                    placeholder={c.placeholder}
                    value={currentVal}
                    onChange={(e) => handleValueChange(c.name, e.target.value)}
                    className={s.input}
                    style={activeTheme === 'custom' ? { 
                      backgroundColor: 'rgba(255,255,255,0.7)', 
                      borderColor: 'rgba(0,0,0,0.15)',
                      color: 'var(--custom-text)',
                    } : {}}
                  />
                  {c.unit && (
                    <span 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold opacity-60 font-mono"
                      style={activeTheme === 'custom' ? { color: 'var(--custom-text)' } : {}}
                    >
                      {c.unit}
                    </span>
                  )}
                </div>
              )}

              {c.type === 'slider' && (
                <div className="space-y-1.5 py-1">
                  <div className="flex justify-between text-xs font-mono font-bold opacity-80">
                    <span>Range: {c.min} - {c.max}</span>
                    <span className="text-sm font-black underline decoration-dotted">
                      {currentVal || c.min} {c.unit}
                    </span>
                  </div>
                  <div 
                    className={s.sliderTrack}
                    style={activeTheme === 'custom' ? { backgroundColor: 'rgba(0,0,0,0.1)' } : {}}
                  >
                    <input
                      type="range"
                      min={c.min ?? 0}
                      max={c.max ?? 100}
                      step={c.step ?? 1}
                      value={currentVal || c.min || 0}
                      onChange={(e) => handleValueChange(c.name, e.target.value)}
                      className="absolute inset-x-0 w-full accent-current bg-transparent opacity-100 appearance-none h-1 cursor-pointer"
                      style={activeTheme === 'custom' ? { color: 'var(--custom-primary)' } : {}}
                    />
                  </div>
                </div>
              )}

              {c.type === 'select' && (
                <div className="relative">
                  <select
                    value={currentVal}
                    onChange={(e) => handleValueChange(c.name, e.target.value)}
                    className={s.select}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      ...(activeTheme === 'custom' ? {
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        borderColor: 'rgba(0,0,0,0.15)',
                        color: 'var(--custom-text)',
                      } : {})
                    }}
                  >
                    <option value="" disabled className="text-gray-400">Select option...</option>
                    {c.options?.map((o) => (
                      <option key={o.value} value={o.value} className="text-black">{o.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {c.type === 'checkbox' && (
                <label className="flex items-center gap-3 cursor-pointer py-1.5 select-none">
                  <input
                    type="checkbox"
                    checked={currentVal === 'true'}
                    onChange={(e) => handleValueChange(c.name, String(e.target.checked))}
                    className={s.checkbox}
                    style={activeTheme === 'custom' ? { 
                      borderColor: 'rgba(0,0,0,0.2)',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                    } : {}}
                  />
                  <span className="text-xs font-semibold opacity-90">{c.placeholder || 'Enable Option'}</span>
                </label>
              )}
            </div>
          )
        })}

        {/* Dynamic Outputs (Results Displays) */}
        <div className="grid gap-3 pt-4 border-t border-neutral-300/30" style={activeTheme === 'custom' ? { borderTopColor: 'rgba(0,0,0,0.08)' } : {}}>
          {results.map((r) => (
            <div 
              key={r.id} 
              className={s.lcdDisplay}
              style={activeTheme === 'custom' ? { 
                backgroundColor: 'var(--custom-lcd-bg)', 
                borderColor: 'rgba(0,0,0,0.08)',
                color: 'var(--custom-lcd-text)'
              } : {}}
            >
              <div className={s.lcdTitle}>{r.label}</div>
              <div className={s.lcdValue}>
                {r.prefix}
                {r.value}
                {r.suffix && <span className="text-xs font-bold ml-1.5 opacity-80">{r.suffix}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls & Data Exports */}
        <div className="flex flex-wrap gap-2 pt-4 justify-between items-center">
          <button
            onClick={handleReset}
            className={s.btnSecondary}
            style={activeTheme === 'custom' ? {
              borderColor: 'rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(0,0,0,0.04)',
              color: 'var(--custom-text)',
            } : {}}
          >
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Inputs
            </span>
          </button>

          {!isPreview && (
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                className={s.btnSecondary}
                style={activeTheme === 'custom' ? {
                  borderColor: 'rgba(0,0,0,0.1)',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  color: 'var(--custom-text)',
                } : {}}
                title="Export values to CSV"
              >
                <span className="flex items-center gap-1.5">
                  <FileDown className="w-3.5 h-3.5" />
                  CSV
                </span>
              </button>
              <button
                onClick={handleExportPDF}
                className={s.btnPrimary}
                style={activeTheme === 'custom' ? {
                  backgroundColor: 'var(--custom-primary)',
                  borderColor: 'var(--custom-secondary)',
                  color: '#ffffff',
                } : {}}
                title="Export report as PDF"
              >
                <span className="flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5" />
                  Export PDF
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
