'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { FileDown, Printer, Play, RefreshCw, Calculator } from 'lucide-react'
import { evaluateFormula } from '@/lib/formula-parser'
import { exportToCSV, exportToPDF } from '@/lib/export-utils'
import CategoryVisualizer from './CategoryVisualizer'
import { calculators } from '@/lib/calculators'

export type CustomThemeType = 'retro' | 'dark' | 'modern' | 'pastel' | 'cyberpunk' | 'custom'

export interface LabelTypographyConfig {
  fontSize?: number | string
  fontWeight?: number | string
  fontStyle?: 'default' | 'normal' | 'italic'
}

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
  labelTypography?: LabelTypographyConfig
  brandTypography?: LabelTypographyConfig
  descriptionTypography?: LabelTypographyConfig
  helpTextTypography?: LabelTypographyConfig
  outputTypography?: LabelTypographyConfig
  requireSubmit?: boolean
  enableCSVExport?: boolean
  enablePDFExport?: boolean
  createdAt?: string
}

export interface CustomComponentConfig {
  id: string
  name: string // variable name used in formulas (e.g., 'w', 'h')
  type: 'number' | 'slider' | 'select' | 'checkbox' | 'radio' | 'header' | 'text' | 'row' | 'column'
  label: string
  placeholder?: string
  defaultValue?: string | number | boolean
  min?: number
  max?: number
  step?: number
  unit?: string
  options?: { value: string; label: string }[]
  helpText?: string
  labelTypography?: LabelTypographyConfig
  brandTypography?: LabelTypographyConfig
  descriptionTypography?: LabelTypographyConfig
  helpTextTypography?: LabelTypographyConfig
  readOnly?: boolean
  calculationFormula?: string
  parentId?: string
}

export interface CustomFormulaConfig {
  id: string
  label: string
  formula: string // mathematical expression like 'w / (h * h)'
  decimalPlaces: number
  prefix?: string
  suffix?: string
  labelTypography?: LabelTypographyConfig
  brandTypography?: LabelTypographyConfig
  descriptionTypography?: LabelTypographyConfig
}

function getLabelTypographyStyle(
  elementTypo?: LabelTypographyConfig,
  globalTypo?: LabelTypographyConfig
): React.CSSProperties {
  const size = elementTypo?.fontSize !== undefined && elementTypo.fontSize !== ''
    ? elementTypo.fontSize
    : globalTypo?.fontSize !== undefined && globalTypo.fontSize !== ''
    ? globalTypo.fontSize
    : undefined;

  const weight = elementTypo?.fontWeight !== undefined && elementTypo.fontWeight !== ''
    ? elementTypo.fontWeight
    : globalTypo?.fontWeight !== undefined && globalTypo.fontWeight !== ''
    ? globalTypo.fontWeight
    : undefined;

  const style = elementTypo?.fontStyle && elementTypo.fontStyle !== 'default'
    ? elementTypo.fontStyle
    : globalTypo?.fontStyle && globalTypo.fontStyle !== 'default'
    ? globalTypo.fontStyle
    : 'default';

  const styles: React.CSSProperties = {};

  if (size !== undefined && size !== '') {
    if (typeof size === 'number' || !isNaN(Number(size))) {
      styles.fontSize = `${size}px`;
    } else {
      styles.fontSize = String(size);
    }
  }

  if (weight !== undefined && weight !== '') {
    styles.fontWeight = String(weight);
  }

  if (style === 'normal') styles.fontStyle = 'normal';
  else if (style === 'italic') styles.fontStyle = 'italic';

  return styles;
}

interface RendererProps {
  config: CustomCalculatorConfig
  isPreview?: boolean
  selectedId?: string | null
  onSelectComponent?: (id: string) => void
  selectedFormulaId?: string | null
  onSelectFormula?: (id: string) => void
}

export default function CustomCalculatorRenderer({
  config,
  isPreview = false,
  selectedId = null,
  onSelectComponent,
  selectedFormulaId = null,
  onSelectFormula,
}: RendererProps) {
  // Resolve category and entry details from the local registry
  const localEntry = useMemo(() => {
    const nameClean = config.name.toLowerCase().replace(/calculator/g, '').trim()
    return calculators.find(c => 
      c.name.toLowerCase().includes(nameClean) || 
      nameClean.includes(c.shortName.toLowerCase())
    )
  }, [config.name])

  const localCategory = localEntry?.category || 'math'
  const hasVisualizer = ['geometry', 'trigonometry', 'finance', 'health', 'conversion'].includes(localCategory)

  // Initialize state from component defaults
  const [values, setValues] = useState<Record<string, string>>({})
  const [submittedValues, setSubmittedValues] = useState<Record<string, string>>({})

  useEffect(() => {
    setValues((prev) => {
      const next: Record<string, string> = {}
      config.components.forEach((c) => {
        if (c.type === 'header' || c.type === 'text') return
        const defVal = c.defaultValue !== undefined ? String(c.defaultValue) : ''
        next[c.name] = prev[c.name] !== undefined ? prev[c.name] : defVal
      })
      return next
    })

    setSubmittedValues((prev) => {
      const next: Record<string, string> = {}
      config.components.forEach((c) => {
        if (c.type === 'header' || c.type === 'text') return
        const defVal = c.defaultValue !== undefined ? String(c.defaultValue) : ''
        next[c.name] = prev[c.name] !== undefined ? prev[c.name] : defVal
      })
      return next
    })
  }, [config.components])

  const handleValueChange = (name: string, val: string) => {
    setValues((prev) => ({ ...prev, [name]: val }))
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSubmittedValues(values)
  }

  const activeValues = config.requireSubmit ? submittedValues : values

  // Map input values into a numeric format for parsing formulas
  const variablesMap = useMemo(() => {
    const map: Record<string, number> = {}
    config.components.forEach((c) => {
      if (c.type === 'header' || c.type === 'text' || c.type === 'row' || c.type === 'column') return
      
      if (c.calculationFormula) {
        const calculatedVal = evaluateFormula(c.calculationFormula, map)
        map[c.name] = isNaN(calculatedVal) ? 0 : calculatedVal
      } else {
        const raw = activeValues[c.name] ?? ''
        if (c.type === 'checkbox') {
          map[c.name] = raw === 'true' ? 1 : 0
        } else {
          const parsed = parseFloat(raw)
          map[c.name] = isNaN(parsed) ? 0 : parsed
        }
      }
    })
    return map
  }, [config.components, activeValues])

  // Compute results
  const results = useMemo(() => {
    return config.formulas.map((f) => {
      const numericVal = evaluateFormula(f.formula, variablesMap)
      
      // Format decimal places safely
      const dp = typeof f.decimalPlaces === 'number' && !isNaN(f.decimalPlaces)
        ? Math.max(0, Math.min(20, f.decimalPlaces))
        : 2
      let formattedVal = numericVal.toFixed(dp)
      // Remove trailing zeroes if requested, or keep strictly formatted
      if (formattedVal.includes('.')) {
        // Strip unnecessary trailing decimals for integers
        if (parseFloat(formattedVal) === Math.round(parseFloat(formattedVal)) && dp === 0) {
          formattedVal = String(Math.round(numericVal))
        }
      }

      return {
        id: f.id,
        label: f.label,
        value: formattedVal,
        prefix: f.prefix || '',
        suffix: f.suffix || '',
        labelTypography: f.labelTypography,
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
    setSubmittedValues(initial)
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
        } else if (c.type === 'select' || c.type === 'radio') {
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
      header: 'border-b-2 border-[#d5d1c8] bg-[#e4e1d9] px-5 sm:px-6 py-4',
      headerText: 'text-sm font-black tracking-wider uppercase text-neutral-700',
      description: 'text-xs text-neutral-500 font-bold',
      body: 'p-4 sm:p-6 space-y-4',
      label: 'text-xs font-black uppercase text-neutral-600 tracking-wider',
      input: 'bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-bold text-neutral-800 px-3 h-10 w-full focus:outline-none focus:border-neutral-500 shadow-inner',
      sliderTrack: 'relative w-full h-4 bg-neutral-300 rounded border border-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] flex items-center px-1',
      checkbox: 'w-5 h-5 rounded border-2 border-neutral-300 accent-neutral-800 bg-[#fcfbfa]',
      radio: 'w-4 h-4 rounded-full border-2 border-neutral-300 accent-neutral-800 bg-[#fcfbfa] cursor-pointer',
      select: 'bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-bold text-neutral-800 px-3 h-10 w-full focus:outline-none focus:border-neutral-500 appearance-none cursor-pointer',
      lcdDisplay: 'bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-lg p-4 shadow-inner text-[#1a2019]',
      lcdTitle: 'text-[9px] font-bold text-[#4c5c4a] uppercase tracking-wider',
      lcdValue: 'text-2xl font-black tracking-wide',
      btnPrimary: 'bg-[#dfaa44] text-neutral-900 border-2 border-[#be8b32] hover:bg-[#e5b44e] font-extrabold text-xs h-10 px-5 rounded-lg active:scale-95 shadow transition-all uppercase tracking-wider',
      btnSecondary: 'bg-neutral-300 text-neutral-700 border-2 border-neutral-400 hover:bg-neutral-250 font-extrabold text-xs h-10 px-4 rounded-lg active:scale-95 transition-all uppercase',
      headerComp: 'border-b border-neutral-300 pb-1 mt-4 text-xs font-black uppercase tracking-wider text-neutral-700',
      textComp: 'text-[13px] text-neutral-500 leading-relaxed font-bold',
    },
    dark: {
      wrapper: 'bg-[#12131a] border-2 border-purple-900/60 rounded-2xl shadow-[0_12px_40px_rgba(139,92,246,0.15)] text-gray-200 font-sans',
      header: 'border-b border-purple-950/50 bg-[#161824]/80 px-5 sm:px-6 py-4',
      headerText: 'text-sm font-bold tracking-widest uppercase text-purple-400 font-mono',
      description: 'text-xs text-gray-400 font-light',
      body: 'p-4 sm:p-6 space-y-5',
      label: 'text-xs font-semibold text-purple-300/80 uppercase tracking-widest',
      input: 'bg-[#1b1c26] border border-purple-900/40 rounded-xl text-sm text-white px-4 h-11 w-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-lg placeholder:text-gray-600',
      sliderTrack: 'relative w-full h-3 bg-purple-950/60 rounded-full border border-purple-900/30 flex items-center px-1',
      checkbox: 'w-5 h-5 rounded border border-purple-900 accent-purple-600 bg-[#1b1c26]',
      radio: 'w-4 h-4 rounded-full border border-purple-900 accent-purple-600 bg-[#1b1c26] cursor-pointer',
      select: 'bg-[#1b1c26] border border-purple-900/40 rounded-xl text-sm text-white px-4 h-11 w-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none cursor-pointer',
      lcdDisplay: 'bg-[#0f1016] border border-purple-900/50 rounded-xl p-4 shadow-[inset_0_4px_16px_rgba(0,0,0,0.6)] text-purple-400 shadow-purple-900/5',
      lcdTitle: 'text-[10px] font-semibold text-purple-400/60 uppercase tracking-wider font-mono',
      lcdValue: 'text-2xl font-bold tracking-tight font-mono text-purple-200 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]',
      btnPrimary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs h-11 px-6 rounded-xl active:scale-[0.98] shadow-lg shadow-purple-500/10 transition-all uppercase tracking-wider',
      btnSecondary: 'bg-[#1e2030] hover:bg-[#25283c] text-purple-300 font-bold text-xs h-11 px-4 rounded-xl active:scale-[0.98] transition-all uppercase border border-purple-950/30',
      headerComp: 'border-b border-purple-950/40 pb-1 mt-4 text-xs font-bold text-purple-300 font-mono tracking-wide',
      textComp: 'text-[13px] text-gray-400 font-light leading-relaxed',
    },
    modern: {
      wrapper: 'bg-white border border-gray-200 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] text-gray-800 font-sans',
      header: 'border-b border-gray-100 bg-gray-50/50 px-5 sm:px-6 py-4',
      headerText: 'text-sm font-extrabold tracking-tight text-gray-800',
      description: 'text-xs text-gray-500',
      body: 'p-4 sm:p-6 space-y-4',
      label: 'text-xs font-bold text-gray-700 tracking-wide',
      input: 'bg-white border border-gray-300 rounded-xl text-sm text-gray-900 px-4 h-11 w-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-gray-400',
      sliderTrack: 'relative w-full h-2 bg-gray-200 rounded-full flex items-center',
      checkbox: 'w-5 h-5 rounded border-gray-300 accent-indigo-600 bg-white cursor-pointer',
      radio: 'w-4 h-4 rounded-full border-gray-300 accent-indigo-600 bg-white cursor-pointer',
      select: 'bg-white border border-gray-300 rounded-xl text-sm text-gray-900 px-4 h-11 w-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer transition-colors',
      lcdDisplay: 'bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-indigo-900',
      lcdTitle: 'text-[10px] font-bold text-indigo-600/80 uppercase tracking-wider',
      lcdValue: 'text-2xl font-extrabold tracking-tight text-indigo-900',
      btnPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-11 px-6 rounded-xl active:scale-[0.98] shadow-md shadow-indigo-600/10 transition-all uppercase tracking-wider',
      btnSecondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs h-11 px-4 rounded-xl active:scale-[0.98] transition-all uppercase',
      headerComp: 'border-b border-gray-200 pb-1 mt-4 text-xs font-bold text-gray-800 tracking-tight',
      textComp: 'text-[13px] text-gray-500 leading-relaxed',
    },
    pastel: {
      wrapper: 'bg-[#fcfaf5] border-4 border-[#e9e4d5] rounded-3xl shadow-[0_12px_24px_rgba(215,205,180,0.4)] text-[#4a4336] font-sans',
      header: 'border-b-4 border-[#e9e4d5] bg-[#f7f2e4] px-5 sm:px-6 py-5',
      headerText: 'text-base font-extrabold text-[#5b513d]',
      description: 'text-xs text-[#8c7f66]',
      body: 'p-4 sm:p-6 space-y-4',
      label: 'text-[13px] font-bold text-[#5b513d] tracking-wide',
      input: 'bg-[#ffffff] border-3 border-[#e9e4d5] rounded-2xl text-sm text-[#4a4336] px-4 h-11 w-full focus:outline-none focus:border-[#c5bda6] shadow-sm transition-all',
      sliderTrack: 'relative w-full h-3 bg-[#e9e4d5] rounded-full flex items-center',
      checkbox: 'w-6 h-6 rounded-lg border-3 border-[#e9e4d5] accent-[#8fa499] bg-[#ffffff] cursor-pointer',
      radio: 'w-5 h-5 rounded-full border-3 border-[#e9e4d5] accent-[#8fa499] bg-[#ffffff] cursor-pointer',
      select: 'bg-[#ffffff] border-3 border-[#e9e4d5] rounded-2xl text-sm text-[#4a4336] px-4 h-11 w-full focus:outline-none focus:border-[#c5bda6] appearance-none cursor-pointer transition-all',
      lcdDisplay: 'bg-[#e2ebe6] border-3 border-[#c9dad0] rounded-2xl p-4 text-[#355342] shadow-sm',
      lcdTitle: 'text-[10px] font-bold text-[#5c7a68] uppercase tracking-widest',
      lcdValue: 'text-2xl font-black text-[#22392c]',
      btnPrimary: 'bg-[#e2a893] hover:bg-[#e6b3a0] text-white font-extrabold text-xs h-11 px-6 rounded-2xl active:scale-[0.97] shadow-sm transition-all uppercase tracking-wider',
      btnSecondary: 'bg-[#c5d5cd] hover:bg-[#d0ded7] text-[#3b4b44] font-extrabold text-xs h-11 px-4 rounded-2xl active:scale-[0.97] transition-all uppercase',
      headerComp: 'border-b-2 border-[#e9e4d5] pb-1 mt-4 text-xs font-bold text-[#5b513d]',
      textComp: 'text-sm text-[#8c7f66] leading-relaxed',
    },
    cyberpunk: {
      wrapper: 'bg-[#050505] border-2 border-yellow-400 rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.2)] text-yellow-400 font-mono',
      header: 'border-b-2 border-yellow-400 bg-yellow-400/5 px-5 sm:px-6 py-4',
      headerText: 'text-sm font-black tracking-widest uppercase text-yellow-400',
      description: 'text-xs text-yellow-500/80 font-bold',
      body: 'p-4 sm:p-6 space-y-4',
      label: 'text-xs font-black uppercase text-yellow-400 tracking-wider',
      input: 'bg-black border border-yellow-400 text-sm font-bold text-yellow-300 px-3 h-10 w-full focus:outline-none focus:shadow-[0_0_10px_rgba(250,204,21,0.4)] placeholder:text-yellow-900',
      sliderTrack: 'relative w-full h-3 bg-black border border-yellow-500/60 rounded flex items-center px-1',
      checkbox: 'w-5 h-5 rounded border border-yellow-400 accent-yellow-400 bg-black',
      radio: 'w-4 h-4 rounded-full border border-yellow-400 accent-yellow-400 bg-black cursor-pointer',
      select: 'bg-black border border-yellow-400 text-sm font-bold text-yellow-300 px-3 h-10 w-full focus:outline-none focus:shadow-[0_0_10px_rgba(250,204,21,0.4)] appearance-none cursor-pointer',
      lcdDisplay: 'bg-black border border-yellow-400 rounded p-4 shadow-[0_0_8px_rgba(250,204,21,0.1)] text-yellow-400',
      lcdTitle: 'text-[9px] font-black uppercase tracking-widest text-yellow-500/80',
      lcdValue: 'text-2xl font-black tracking-wider text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.3)]',
      btnPrimary: 'bg-yellow-400 text-black hover:bg-yellow-300 font-black text-xs h-10 px-5 rounded active:scale-95 shadow transition-all uppercase tracking-wider',
      btnSecondary: 'bg-black border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-bold text-xs h-10 px-4 rounded active:scale-95 transition-all uppercase',
      headerComp: 'border-b border-yellow-500 pb-1 mt-4 text-xs font-black uppercase tracking-wider text-yellow-400',
      textComp: 'text-[13px] text-yellow-500/70 leading-relaxed',
    },
    custom: {
      wrapper: 'rounded-2xl border text-[var(--custom-text)] font-sans',
      header: 'border-b px-5 sm:px-6 py-4',
      headerText: 'text-sm font-bold tracking-tight text-[var(--custom-text)]',
      description: 'text-xs opacity-75',
      body: 'p-4 sm:p-6 space-y-4',
      label: 'text-xs font-bold opacity-80 uppercase tracking-wide',
      input: 'border rounded-xl text-sm px-4 h-11 w-full focus:outline-none focus:ring-1 transition-all',
      sliderTrack: 'relative w-full h-2 rounded-full flex items-center',
      checkbox: 'w-5 h-5 rounded border cursor-pointer',
      radio: 'w-4 h-4 rounded-full border cursor-pointer',
      select: 'border rounded-xl text-sm px-4 h-11 w-full focus:outline-none focus:ring-1 appearance-none cursor-pointer transition-all',
      lcdDisplay: 'border rounded-xl p-4',
      lcdTitle: 'text-[10px] font-bold uppercase tracking-wider opacity-70',
      lcdValue: 'text-2xl font-bold tracking-tight',
      btnPrimary: 'text-white font-bold text-xs h-11 px-6 rounded-xl active:scale-[0.98] shadow-md transition-all uppercase tracking-wider',
      btnSecondary: 'font-bold text-xs h-11 px-4 rounded-xl active:scale-[0.98] transition-all uppercase border',
      headerComp: 'border-b pb-1 mt-4 text-xs font-bold',
      textComp: 'text-[13px] opacity-80 leading-relaxed',
    },
  }

  const s = themeStyles[activeTheme]

  const renderComponent = (c: CustomComponentConfig): React.ReactNode => {
    const isSelected = selectedId === c.id;
    const handleElementClick = onSelectComponent 
      ? (e: React.MouseEvent) => {
          e.stopPropagation();
          setTimeout(() => {
            onSelectComponent(c.id);
          }, 0);
        }
      : undefined;

    let elementContent = null;

    if (c.type === 'row' || c.type === 'column') {
      const children = config.components.filter((child) => child.parentId === c.id);
      elementContent = (
        <div 
          className={c.type === 'row' ? 'flex flex-col sm:flex-row gap-4 w-full' : 'flex flex-col gap-4 w-full'}
          style={c.type === 'row' ? { alignItems: 'flex-start' } : {}}
        >
          {children.map((child) => (
            <div key={child.id} className="flex-1 min-w-0 w-full">
              {renderComponent(child)}
            </div>
          ))}
          {children.length === 0 && (
            <div className="text-[10px] text-neutral-400 font-mono italic border border-dashed border-neutral-300 rounded p-4 w-full text-center select-none opacity-60">
              Empty {c.type === 'row' ? 'Row' : 'Column'} Layout (Select this parent layout in other fields to place them here)
            </div>
          )}
        </div>
      );
    } else if (c.type === 'header') {
      elementContent = (
        <div 
          className={s.headerComp}
          style={{
            ...(activeTheme === 'custom' ? { borderBottomColor: 'rgba(0,0,0,0.08)', color: 'var(--custom-text)' } : {}),
            ...getLabelTypographyStyle(c.labelTypography, config.labelTypography)
          }}
        >
          {c.label}
        </div>
      );
    } else if (c.type === 'text') {
      elementContent = (
        <p 
          className={s.textComp}
          style={getLabelTypographyStyle(c.labelTypography, config.labelTypography)}
        >
          {c.label}
        </p>
      );
    } else {
      const currentVal = c.calculationFormula 
        ? String(variablesMap[c.name] ?? '') 
        : (values[c.name] ?? '');
      
      const isFieldReadOnly = c.readOnly || !!c.calculationFormula;

      elementContent = (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5">
              <label 
                className={s.label}
                style={getLabelTypographyStyle(c.labelTypography, config.labelTypography)}
              >
                {c.label}
              </label>
              {c.calculationFormula && (
                <span className="text-[9px] bg-indigo-50/80 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-0.5 select-none" title={`Calculated via: ${c.calculationFormula}`}>
                  <Calculator className="w-2.5 h-2.5" /> Calc
                </span>
              )}
            </div>
            {c.helpText && (
              <span 
                className="text-[9px] opacity-60 font-mono italic"
                style={getLabelTypographyStyle(c.helpTextTypography, config.helpTextTypography)}
              >
                {c.helpText}
              </span>
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
                className={`${s.input} ${isFieldReadOnly ? 'opacity-70 cursor-not-allowed bg-neutral-100/50' : ''}`}
                style={activeTheme === 'custom' ? { 
                  backgroundColor: 'rgba(255,255,255,0.7)', 
                  borderColor: 'rgba(0,0,0,0.15)',
                  color: 'var(--custom-text)',
                } : {}}
                onClick={onSelectComponent ? (e) => {
                  e.stopPropagation();
                  setTimeout(() => onSelectComponent(c.id), 0);
                } : undefined}
                readOnly={isFieldReadOnly}
                disabled={isFieldReadOnly}
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
                  className={`absolute inset-x-0 w-full accent-current bg-transparent opacity-100 appearance-none h-1 cursor-pointer ${isFieldReadOnly ? 'opacity-40 cursor-not-allowed' : ''}`}
                  style={activeTheme === 'custom' ? { color: 'var(--custom-primary)' } : {}}
                  onClick={onSelectComponent ? (e) => {
                    e.stopPropagation();
                    setTimeout(() => onSelectComponent(c.id), 0);
                  } : undefined}
                  disabled={isFieldReadOnly}
                />
              </div>
            </div>
          )}

          {c.type === 'select' && (
            <div className="relative">
              <select
                value={currentVal}
                onChange={(e) => handleValueChange(c.name, e.target.value)}
                className={`${s.select} ${isFieldReadOnly ? 'opacity-70 cursor-not-allowed bg-neutral-100/50' : ''}`}
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
                onClick={onSelectComponent ? (e) => {
                  e.stopPropagation();
                  setTimeout(() => onSelectComponent(c.id), 0);
                } : undefined}
                disabled={isFieldReadOnly}
              >
                <option value="" disabled className="text-gray-400">Select option...</option>
                {c.options?.map((o) => (
                  <option key={o.value} value={o.value} className="text-black">{o.label}</option>
                ))}
              </select>
            </div>
          )}

          {c.type === 'checkbox' && (
            <label className={`flex items-center gap-3 py-1.5 select-none ${isFieldReadOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                checked={currentVal === 'true'}
                onChange={(e) => handleValueChange(c.name, String(e.target.checked))}
                className={s.checkbox}
                style={activeTheme === 'custom' ? { 
                  borderColor: 'rgba(0,0,0,0.2)',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                } : {}}
                onClick={onSelectComponent ? (e) => {
                  e.stopPropagation();
                  setTimeout(() => onSelectComponent(c.id), 0);
                } : undefined}
                disabled={isFieldReadOnly}
              />
              <span className="text-xs font-semibold opacity-90">{c.placeholder || 'Enable Option'}</span>
            </label>
          )}

          {c.type === 'radio' && (
            <div className="space-y-2 py-1">
              <div className="flex flex-col gap-2">
                {c.options?.map((o) => {
                  const isChecked = currentVal === o.value;
                  return (
                    <label 
                      key={o.value} 
                      className={`flex items-center gap-2.5 select-none ${isFieldReadOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                    >
                      <input
                        type="radio"
                        name={c.id}
                        value={o.value}
                        checked={isChecked}
                        onChange={(e) => handleValueChange(c.name, e.target.value)}
                        className={s.radio}
                        disabled={isFieldReadOnly}
                        onClick={onSelectComponent ? (e) => {
                          e.stopPropagation();
                          setTimeout(() => onSelectComponent(c.id), 0);
                        } : undefined}
                      />
                      <span className="text-xs font-semibold opacity-90">{o.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (onSelectComponent) {
      return (
        <div 
          key={c.id} 
          onClick={handleElementClick}
          className={`group/editor relative p-2 rounded-xl transition-all border-2 cursor-pointer ${
            isSelected 
              ? 'border-indigo-500 bg-indigo-50/10 shadow-[0_0_8px_rgba(99,102,241,0.15)] ring-2 ring-indigo-500/20' 
              : 'border-transparent hover:border-indigo-300 hover:bg-neutral-50/30'
          }`}
        >
          <div className="absolute top-1 right-2 opacity-0 group-hover/editor:opacity-100 bg-indigo-500 text-white text-[8px] font-mono px-1 py-0.5 rounded font-bold pointer-events-none transition-opacity z-10">
            {c.name}
          </div>
          {elementContent}
        </div>
      );
    }

    return <React.Fragment key={c.id}>{elementContent}</React.Fragment>;
  };

  // Layout classes — controls how inputs are arranged in the body
  const layoutClass = config.layout === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4'
    : 'space-y-4'

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
      className={`w-full mx-auto transition-all duration-300 ${s.wrapper} ${hasVisualizer ? 'max-w-4xl' : 'max-w-xl'}`}
      style={{ ...customStyleWrapper, ...customVariables }}
    >
      {/* Brand Header */}
      <div 
        className={s.header}
        style={activeTheme === 'custom' ? { borderBottomColor: 'rgba(0,0,0,0.08)' } : {}}
      >
        {/* Brand/Logo Row */}
        {(config.logo || config.brandName) && (
          <div className="flex items-center gap-2.5 mb-2.5">
            {config.logo && (
              <img 
                src={config.logo} 
                alt="Brand Logo" 
                className="max-h-6 max-w-[100px] object-contain rounded" 
              />
            )}
            {config.brandName && (
              <span 
                className="text-[10px] uppercase font-mono font-bold tracking-wider opacity-65 select-none"
                style={{
                  ...getLabelTypographyStyle(config.brandTypography, config.labelTypography),
                  color: activeTheme === 'custom' ? 'var(--custom-text)' : undefined
                }}
              >
                {config.brandName}
              </span>
            )}
          </div>
        )}

        {/* Title & Description */}
        <div>
          <h2 className={s.headerText} style={getLabelTypographyStyle(undefined, config.labelTypography)}>{config.name}</h2>
          {config.description && (
            <p 
              className={s.description} 
              style={getLabelTypographyStyle(config.descriptionTypography, config.labelTypography)}
            >
              {config.description}
            </p>
          )}
        </div>
      </div>

      {/* Calculator Body */}
      <form onSubmit={handleSubmit} className={s.body}>
        <div className={hasVisualizer ? 'grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6' : ''}>
          <div className="space-y-4">
            <div className={layoutClass}>
          {config.components
            .filter((c) => !c.parentId) // Only render top-level elements
            .map((c) => renderComponent(c))}
        </div>

        {config.requireSubmit && (
          <div className="pt-2 pb-4 flex justify-end">
            <button
              type="submit"
              className={s.btnPrimary}
              style={activeTheme === 'custom' ? {
                backgroundColor: 'var(--custom-primary)',
                borderColor: 'var(--custom-secondary)',
                color: '#ffffff'
              } : {}}
            >
              Calculate
            </button>
          </div>
        )}

        {/* Dynamic Outputs (Results Displays) */}
        <div className="grid gap-3 pt-4 border-t border-neutral-300/30" style={activeTheme === 'custom' ? { borderTopColor: 'rgba(0,0,0,0.08)' } : {}}>
          {results.map((r) => {
            const isSelected = selectedFormulaId === r.id;
            const handleFormulaClick = onSelectFormula 
              ? (e: React.MouseEvent) => {
                  e.stopPropagation();
                  setTimeout(() => {
                    onSelectFormula(r.id);
                  }, 0);
                }
              : undefined;

            const formulaContent = (
              <div 
                className={s.lcdDisplay}
                style={activeTheme === 'custom' ? { 
                  backgroundColor: 'var(--custom-lcd-bg)', 
                  borderColor: 'rgba(0,0,0,0.08)',
                  color: 'var(--custom-lcd-text)'
                } : {}}
              >
                <div 
                  className={s.lcdTitle}
                  style={getLabelTypographyStyle(r.labelTypography, config.outputTypography)}
                >
                  {r.label}
                </div>
                <div className={s.lcdValue}>
                  {r.prefix}
                  {r.value}
                  {r.suffix && <span className="text-xs font-bold ml-1.5 opacity-80">{r.suffix}</span>}
                </div>
              </div>
            );

            if (onSelectFormula) {
              return (
                <div
                  key={r.id}
                  onClick={handleFormulaClick}
                  className={`group/editor relative p-1 rounded-2xl transition-all border-2 cursor-pointer ${
                    isSelected 
                      ? 'border-yellow-400 bg-yellow-400/5 ring-2 ring-yellow-400/20' 
                      : 'border-transparent hover:border-yellow-300'
                  }`}
                >
                  <div className="absolute top-2 right-3 opacity-0 group-hover/editor:opacity-100 bg-yellow-500 text-white text-[8px] font-mono px-1 py-0.5 rounded font-bold pointer-events-none transition-opacity z-10">
                    formula
                  </div>
                  {formulaContent}
                </div>
              );
            }

            return <React.Fragment key={r.id}>{formulaContent}</React.Fragment>;
          })}
        </div>

        {/* Action Controls & Data Exports */}
        <div className="flex flex-wrap gap-2 pt-4 justify-between items-center">
          <button
            type="button"
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

          {!isPreview && (config.enableCSVExport || config.enablePDFExport) && (
            <div className="flex gap-2">
              {config.enableCSVExport && (
                <button
                  type="button"
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
              )}
              {config.enablePDFExport && (
                <button
                  type="button"
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
              )}
            </div>
          )}
          </div>
        </div>

        {/* Dynamic Visualizer Column */}
        {hasVisualizer && (
          <div className="flex flex-col items-center justify-center bg-[#cbd8ca]/15 border border-neutral-300/50 rounded-2xl p-4 h-full min-h-[220px] self-start sticky top-6">
            <CategoryVisualizer 
              category={localCategory}
              slug={localEntry?.slug || config.id}
              variables={variablesMap}
              results={results}
            />
          </div>
        )}
      </div>

        {/* How it Works & Formula Box at the bottom of the card */}
        {localEntry && (
          <div className="mt-8 pt-6 border-t border-neutral-300/35 text-left font-sans">
            <h3 className="text-xs font-black uppercase text-neutral-700 tracking-wider mb-2">How It Works</h3>
            <p className="text-xs text-neutral-500 font-bold leading-relaxed mb-4">
              {localEntry.description}
            </p>
            {config.formulas.length > 0 && (
              <div className="bg-[#cbd8ca]/10 border border-neutral-300/40 rounded-xl p-3">
                <span className="text-[9px] font-black uppercase text-neutral-600 tracking-wider block mb-1">Formula Reference</span>
                <code className="text-[10px] font-mono font-bold text-neutral-600 break-all bg-neutral-100/50 p-1.5 rounded block">
                  {config.formulas.map(f => `${f.label} = ${f.formula}`).join('; ')}
                </code>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
