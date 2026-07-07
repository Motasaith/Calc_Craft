'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash, ArrowUp, ArrowDown, Share2, Code, Eye, Save,
  Settings, Sliders, Type, CheckSquare, Heading, List, HelpCircle,
  X, Copy, Check, ChevronLeft, Layout, Sparkles, Image,
  Undo2, Redo2, Download, Upload, Wand2, BookOpen, Lightbulb,
  Calculator, Layers, Grid2x2, ArrowDownToLine, ArrowUpToLine,
  RotateCcw, ChevronRight, AlertCircle, FileJson, GraduationCap,
  Hash, Zap, ChevronDown, Menu, CircleDot,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useUserData } from '@/components/providers/UserDataContext'
import CustomCalculatorRenderer, {
  CustomCalculatorConfig, CustomComponentConfig, CustomFormulaConfig, CustomThemeType, LabelTypographyConfig
} from '@/components/calculators/shared/CustomCalculatorRenderer'
import { serializeConfig, deserializeConfig } from '@/lib/url-serializer'
import { checkFormula, evaluateFormula } from '@/lib/formula-parser'

// =====================================================================
// TEMPLATES — pre-built calculators to help users start quickly
// =====================================================================
const TEMPLATES: { id: string; label: string; description: string; emoji: string; config: CustomCalculatorConfig }[] = [
  {
    id: 'blank',
    label: 'Start from Scratch',
    description: 'Empty canvas with two inputs and a sum formula.',
    emoji: '✨',
    config: {
      id: '',
      name: 'My Custom Calculator',
      description: 'A custom calculated widget built using the visual editor.',
      brandName: 'MY_BRAND',
      theme: 'retro',
      layout: 'stacked',
      components: [
        { id: 'input-1', name: 'x', type: 'number', label: 'First Input Parameter', placeholder: 'Enter a value...', defaultValue: '10', unit: '', helpText: 'The first variable in your math formula' },
        { id: 'input-2', name: 'y', type: 'number', label: 'Second Input Parameter', placeholder: 'Enter another value...', defaultValue: '5', unit: '', helpText: 'The second variable in your math formula' },
      ],
      formulas: [
        { id: 'formula-1', label: 'Sum Total Result', formula: 'x + y', decimalPlaces: 2, prefix: '', suffix: 'units' },
      ],
    },
  },
  {
    id: 'bmi',
    label: 'BMI Calculator',
    description: 'Body Mass Index from weight (kg) and height (m).',
    emoji: '💪',
    config: {
      id: '',
      name: 'BMI Calculator',
      description: 'Calculate your Body Mass Index using your weight and height.',
      brandName: 'HEALTH',
      theme: 'modern',
      layout: 'stacked',
      components: [
        { id: 'w', name: 'weight', type: 'number', label: 'Weight', placeholder: 'e.g. 70', defaultValue: '70', unit: 'kg', helpText: 'Your weight in kilograms' },
        { id: 'h', name: 'height', type: 'number', label: 'Height', placeholder: 'e.g. 1.75', defaultValue: '1.75', unit: 'm', helpText: 'Your height in meters' },
      ],
      formulas: [
        { id: 'f1', label: 'BMI Value', formula: 'weight / (height * height)', decimalPlaces: 1, prefix: '', suffix: ' kg/m²' },
        { id: 'f2', label: 'Category', formula: 'round(weight / (height * height))', decimalPlaces: 0, prefix: '', suffix: '' },
      ],
    },
  },
  {
    id: 'discount',
    label: 'Discount Calculator',
    description: 'Sale price and savings from a discount percentage.',
    emoji: '🏷️',
    config: {
      id: '',
      name: 'Discount Calculator',
      description: 'Calculate the sale price and savings from a discount.',
      brandName: 'SHOPPING',
      theme: 'modern',
      layout: 'stacked',
      components: [
        { id: 'price', name: 'price', type: 'number', label: 'Original Price', placeholder: 'e.g. 100', defaultValue: '100', unit: '$', helpText: 'List price before discount' },
        { id: 'pct', name: 'pct', type: 'number', label: 'Discount Percentage', placeholder: 'e.g. 25', defaultValue: '25', unit: '%', helpText: 'Percentage off' },
      ],
      formulas: [
        { id: 'save', label: 'You Save', formula: 'price * (pct / 100)', decimalPlaces: 2, prefix: '$', suffix: '' },
        { id: 'final', label: 'Final Price', formula: 'price - (price * (pct / 100))', decimalPlaces: 2, prefix: '$', suffix: '' },
        { id: 'factor', label: 'Multiplier', formula: '1 - (pct / 100)', decimalPlaces: 3, prefix: '×', suffix: '' },
      ],
    },
  },
  {
    id: 'roi',
    label: 'ROI Calculator',
    description: 'Return on Investment percentage and total gain.',
    emoji: '💼',
    config: {
      id: '',
      name: 'ROI Calculator',
      description: 'Calculate your Return on Investment percentage and absolute profit gain.',
      brandName: 'FINANCE',
      theme: 'modern',
      layout: 'stacked',
      components: [
        { id: 'inv', name: 'inv', type: 'number', label: 'Amount Invested', placeholder: 'e.g. 10000', defaultValue: '10000', unit: '$', helpText: 'Initial capital or investment cost' },
        { id: 'ret', name: 'ret', type: 'number', label: 'Amount Returned', placeholder: 'e.g. 15000', defaultValue: '15000', unit: '$', helpText: 'Final value or cash received back' },
      ],
      formulas: [
        { id: 'roi_pct', label: 'Return on Investment', formula: '((ret - inv) / inv) * 100', decimalPlaces: 2, prefix: '', suffix: '%' },
        { id: 'roi_gain', label: 'Net Profit Gain', formula: 'ret - inv', decimalPlaces: 2, prefix: '$', suffix: '' },
      ],
    },
  },
  {
    id: 'mortgage',
    label: 'Mortgage Calculator',
    description: 'Calculate monthly home loan payment and total interest.',
    emoji: '🏠',
    config: {
      id: '',
      name: 'Mortgage Payment Calculator',
      description: 'Estimate your monthly mortgage payments and total loan cost.',
      brandName: 'MORTGAGE',
      theme: 'pastel',
      layout: 'stacked',
      components: [
        { id: 'p', name: 'principal', type: 'number', label: 'Loan Principal', placeholder: 'e.g. 300000', defaultValue: '300000', unit: '$', helpText: 'Total principal loan amount' },
        { id: 'r', name: 'rate', type: 'number', label: 'Interest Rate (Annual)', placeholder: 'e.g. 5.5', defaultValue: '5.5', unit: '%', helpText: 'Yearly interest rate' },
        { id: 't', name: 'years', type: 'number', label: 'Loan Term', placeholder: 'e.g. 30', defaultValue: '30', unit: 'yr', helpText: 'Duration of the mortgage in years' },
      ],
      formulas: [
        { id: 'm_pmt', label: 'Monthly Payment', formula: 'principal * (rate / 1200) * pow(1 + (rate / 1200), years * 12) / (pow(1 + (rate / 1200), years * 12) - 1)', decimalPlaces: 2, prefix: '$', suffix: '' },
        { id: 'm_total', label: 'Total Principal + Interest', formula: '(principal * (rate / 1200) * pow(1 + (rate / 1200), years * 12) / (pow(1 + (rate / 1200), years * 12) - 1)) * years * 12', decimalPlaces: 2, prefix: '$', suffix: '' },
      ],
    },
  },
  {
    id: 'compound',
    label: 'Compound Interest',
    description: 'Future value with annual compounding.',
    emoji: '📈',
    config: {
      id: '',
      name: 'Compound Interest Calculator',
      description: 'Compute the future value of an investment with compound interest.',
      brandName: 'FINANCE',
      theme: 'dark',
      layout: 'stacked',
      components: [
        { id: 'p', name: 'principal', type: 'number', label: 'Principal', placeholder: 'e.g. 10000', defaultValue: '10000', unit: '$', helpText: 'Initial investment' },
        { id: 'r', name: 'rate', type: 'number', label: 'Annual Rate', placeholder: 'e.g. 7', defaultValue: '7', unit: '%', helpText: 'Annual interest rate' },
        { id: 't', name: 'years', type: 'number', label: 'Years', placeholder: 'e.g. 10', defaultValue: '10', unit: 'yr', helpText: 'Investment duration' },
      ],
      formulas: [
        { id: 'fv', label: 'Future Value', formula: 'principal * pow(1 + (rate / 100), years)', decimalPlaces: 2, prefix: '$', suffix: '' },
        { id: 'gain', label: 'Total Gain', formula: 'principal * pow(1 + (rate / 100), years) - principal', decimalPlaces: 2, prefix: '$', suffix: '' },
      ],
    },
  },
]

// =====================================================================
// FUNCTION REFERENCE — shown in the formula help panel
// =====================================================================
const FORMULA_FUNCTIONS: { name: string; signature: string; description: string; example: string }[] = [
  { name: 'sqrt', signature: 'sqrt(x)', description: 'Square root', example: 'sqrt(16) = 4' },
  { name: 'pow', signature: 'pow(x, y)', description: 'x raised to the power y', example: 'pow(2, 8) = 256' },
  { name: 'abs', signature: 'abs(x)', description: 'Absolute value', example: 'abs(-7) = 7' },
  { name: 'round', signature: 'round(x)', description: 'Round to nearest integer', example: 'round(3.7) = 4' },
  { name: 'floor', signature: 'floor(x)', description: 'Round down to integer', example: 'floor(3.7) = 3' },
  { name: 'ceil', signature: 'ceil(x)', description: 'Round up to integer', example: 'ceil(3.2) = 4' },
  { name: 'sin', signature: 'sin(x)', description: 'Sine (radians)', example: 'sin(0) = 0' },
  { name: 'cos', signature: 'cos(x)', description: 'Cosine (radians)', example: 'cos(0) = 1' },
  { name: 'tan', signature: 'tan(x)', description: 'Tangent (radians)', example: 'tan(0) = 0' },
  { name: 'log', signature: 'log(x)', description: 'Natural logarithm (ln)', example: 'log(2.718) ≈ 1' },
]

const FORMULA_CONSTANTS: { name: string; value: string; description: string }[] = [
  { name: 'pi', value: '3.14159…', description: 'Ratio of circle circumference to diameter' },
  { name: 'e', value: '2.71828…', description: "Euler's number" },
]

const THEME_SWATCHES: Record<string, { label: string; primary: string; bg: string; text: string; lcd: string; border: string }> = {
  retro: { label: 'Retro LCD', primary: '#dfaa44', bg: '#eae7df', text: '#2d2d2a', lcd: '#cbd8ca', border: '#dad6cd' },
  dark: { label: 'Neon Dark', primary: '#a855f7', bg: '#12131a', text: '#d8b4fe', lcd: '#0f1016', border: '#3b0764' },
  modern: { label: 'Clean Modern', primary: '#4f46e5', bg: '#ffffff', text: '#1f2937', lcd: '#eef2ff', border: '#e5e7eb' },
  pastel: { label: 'Warm Pastel', primary: '#e2a893', bg: '#fcfaf5', text: '#4a4336', lcd: '#e2ebe6', border: '#e9e4d5' },
  cyberpunk: { label: 'Cyberpunk', primary: '#facc15', bg: '#050505', text: '#facc15', lcd: '#000000', border: '#facc15' },
  custom: { label: 'Custom Brand', primary: '#3b82f6', bg: '#f8fafc', text: '#0f172a', lcd: '#f1f5f9', border: '#cbd5e1' }
}

export default function BuilderPageClient() {
  const { addCustomCalculator } = useUserData()

  // ---- Core state ----
  const [calculator, setCalculator] = useState<CustomCalculatorConfig>(TEMPLATES[0].config)
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [selectedFormulaId, setSelectedFormulaId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'components' | 'settings'>('components')
  const [canvasMode, setCanvasMode] = useState<'visual' | 'blueprint' | 'split'>('split')
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

  // ---- Resizable panels ----
  const [leftPanelWidth, setLeftPanelWidth] = useState(288)
  const [rightPanelWidth, setRightPanelWidth] = useState(360)
  const resizingPanel = useRef<'left' | 'right' | null>(null)
  const resizeStartX = useRef(0)
  const resizeStartWidth = useRef(0)

  // ---- Modals ----
  const [previewOpen, setPreviewOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  // ---- Share modal ----
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const [embedWidth, setEmbedWidth] = useState('100%')
  const [embedHeight, setEmbedHeight] = useState('450')

  // ---- Mobile / responsive ----
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)

  // ---- Toast ----
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  // ---- Undo / Redo ----
  const [history, setHistory] = useState<CustomCalculatorConfig[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const isUndoRedo = useRef(false)

  // ===================================================================
  // HISTORY MANAGEMENT
  // ===================================================================
  const pushHistory = useCallback((next: CustomCalculatorConfig) => {
    if (isUndoRedo.current) {
      isUndoRedo.current = false
      setCalculator(next)
      return
    }
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1)
      const updated = [...sliced, next].slice(-50) // cap at 50
      setHistoryIndex(updated.length - 1)
      return updated
    })
    setCalculator(next)
  }, [historyIndex])

  const undo = useCallback(() => {
    if (historyIndex <= 0) return
    isUndoRedo.current = true
    const prev = history[historyIndex - 1]
    setHistoryIndex((i) => i - 1)
    setCalculator(prev)
    showToast('↶ Undone')
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return
    isUndoRedo.current = true
    const next = history[historyIndex + 1]
    setHistoryIndex((i) => i + 1)
    setCalculator(next)
    showToast('↷ Redone')
  }, [history, historyIndex])

  // ===================================================================
  // INIT — load draft or set up initial history
  // ===================================================================
  useEffect(() => {
    const draft = localStorage.getItem('calc_craft_builder_draft')
    let initial: CustomCalculatorConfig = TEMPLATES[0].config
    if (draft) {
      try {
        initial = JSON.parse(draft)
      } catch (e) {
        console.warn('Failed to parse builder draft')
      }
    }
    setCalculator(initial)
    setHistory([initial])
    setHistoryIndex(0)
  }, [])

  // ===================================================================
  // PERSISTENCE — auto-save draft
  // ===================================================================
  const updateCalculator = useCallback((next: CustomCalculatorConfig) => {
    pushHistory(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('calc_craft_builder_draft', JSON.stringify(next))
    }
  }, [pushHistory])

  // ===================================================================
  // URL helpers (server-safe)
  // ===================================================================
  const configHash = typeof window !== 'undefined' ? serializeConfig(calculator) : ''
  const shareLink = typeof window !== 'undefined'
    ? `${window.location.origin}/calculators/custom#config=${configHash}`
    : ''
  const embedCode = typeof window !== 'undefined'
    ? `<iframe src="${window.location.origin}/embed#config=${configHash}" width="${embedWidth}" height="${embedHeight}" style="border:none; border-radius:16px; overflow:hidden;" title="${calculator.name}"></iframe>`
    : ''

  // ===================================================================
  // COMPONENT OPERATIONS
  // ===================================================================
  const uniqueVarName = (base: string, existing: string[]) => {
    let n = base
    let i = 1
    while (existing.includes(n)) {
      n = `${base}_${i++}`
    }
    return n
  }
  const slugify = (s: string) => {
    let slug = s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    if (/^[0-9]/.test(slug)) {
      slug = '_' + slug
    }
    return slug.slice(0, 24) || 'var'
  }

  const addComponent = (type: CustomComponentConfig['type'], index?: number) => {
    const existing = calculator.components.map((c) => c.name)
    const defaultLabel = type === 'row' 
      ? 'Row Layout' 
      : type === 'column' 
      ? 'Column Layout' 
      : `New ${type.charAt(0).toUpperCase() + type.slice(1)} Block`
    const suggested = uniqueVarName(slugify(type === 'number' ? 'value' : type), existing)

    const newComponent: CustomComponentConfig = {
      id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: suggested,
      type,
      label: defaultLabel,
      defaultValue: type === 'checkbox' ? 'false' : (type === 'select' || type === 'radio') ? '1' : (type === 'row' || type === 'column' || type === 'header' || type === 'text') ? undefined : '0',
    }

    if (type === 'select' || type === 'radio') {
      newComponent.options = [
        { value: '1', label: 'Option A' },
        { value: '2', label: 'Option B' }
      ]
      newComponent.defaultValue = '1'
    } else if (type === 'slider') {
      newComponent.min = 0
      newComponent.max = 100
      newComponent.step = 1
      newComponent.defaultValue = '50'
      newComponent.unit = '%'
    } else if (type === 'number') {
      newComponent.placeholder = 'Enter numeric value...'
      newComponent.unit = ''
    }

    const updatedComps = [...calculator.components]
    if (typeof index === 'number') {
      updatedComps.splice(index, 0, newComponent)
    } else {
      updatedComps.push(newComponent)
    }

    const updated = { ...calculator, components: updatedComps }
    updateCalculator(updated)
    setSelectedComponentId(newComponent.id)
    setSelectedFormulaId(null)
  }

  const deleteComponent = (id: string) => {
    const updatedComps = calculator.components
      .filter((c) => c.id !== id)
      .map((c) => (c.parentId === id ? { ...c, parentId: undefined } : c))
    updateCalculator({ ...calculator, components: updatedComps })
    if (selectedComponentId === id) setSelectedComponentId(null)
  }

  const duplicateComponent = (id: string) => {
    const idx = calculator.components.findIndex((c) => c.id === id)
    if (idx === -1) return
    const original = calculator.components[idx]
    const existing = calculator.components.map((c) => c.name)
    const clone: CustomComponentConfig = {
      ...original,
      id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: uniqueVarName(`${original.name}_copy`, existing),
      label: `${original.label} (copy)`,
    }
    const updatedComps = [...calculator.components]
    updatedComps.splice(idx + 1, 0, clone)
    updateCalculator({ ...calculator, components: updatedComps })
    setSelectedComponentId(clone.id)
  }

  const moveComponent = (index: number, direction: 'up' | 'down') => {
    const updatedComps = [...calculator.components]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= updatedComps.length) return
    ;[updatedComps[index], updatedComps[targetIdx]] = [updatedComps[targetIdx], updatedComps[index]]
    updateCalculator({ ...calculator, components: updatedComps })
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === index) return

    const updatedComps = [...calculator.components]
    const draggedItem = updatedComps[draggedIdx]
    
    updatedComps.splice(draggedIdx, 1)
    updatedComps.splice(index, 0, draggedItem)
    
    setDraggedIdx(index)
    setCalculator({ ...calculator, components: updatedComps })
  }

  const handleDragEnd = () => {
    setDraggedIdx(null)
    updateCalculator(calculator)
  }

  const handleDrop = (e: React.DragEvent, index?: number) => {
    e.preventDefault()
    e.stopPropagation()
    const type = e.dataTransfer.getData('application/x-calc-craft-type') as CustomComponentConfig['type']
    if (type) {
      addComponent(type, index)
    }
  }

  const updateComponentField = (id: string, field: keyof CustomComponentConfig, value: any) => {
    let oldName = ''
    let newName = ''
    const updatedComps = calculator.components.map((c) => {
      if (c.id !== id) return c
      oldName = c.name
      const next = { ...c, [field]: value }
      // Auto-rename variable when label changes, if name is still auto-derived
      if (field === 'label' && typeof value === 'string') {
        const oldSlug = slugify(c.label)
        const isAutoGenerated = (name: string) => {
          const autoBases = ['value', 'slider', 'select', 'checkbox', 'x', 'y', 'radius', 'height', 'weight', 'width', 'price', 'pct', 'people', 'principal', 'rate', 'years', 'bill', 'var']
          const basePattern = new RegExp(`^(${autoBases.join('|')})(_\\d+)?(_copy\\d*)?$`)
          return basePattern.test(name)
        }

        if (c.name === oldSlug || isAutoGenerated(c.name) || !c.name) {
          const existing = calculator.components.filter((x) => x.id !== id).map((x) => x.name)
          next.name = uniqueVarName(slugify(value), existing)
        }
      }
      newName = next.name
      return next
    })

    // Auto-update formulas and other components' calculation formulas if the variable identifier changed
    let finalComps = updatedComps
    let updatedFormulas = calculator.formulas
    if (oldName && newName && oldName !== newName) {
      updatedFormulas = calculator.formulas.map((f) => {
        try {
          const regex = new RegExp(`\\b${oldName}\\b`, 'g')
          return { ...f, formula: f.formula.replace(regex, newName) }
        } catch (e) {
          return f
        }
      })
      finalComps = updatedComps.map((c) => {
        if (c.calculationFormula) {
          try {
            const regex = new RegExp(`\\b${oldName}\\b`, 'g')
            return { ...c, calculationFormula: c.calculationFormula.replace(regex, newName) }
          } catch (e) {
            return c
          }
        }
        return c
      })
    }

    updateCalculator({ 
      ...calculator, 
      components: finalComps,
      formulas: updatedFormulas
    })
  }

  // ===================================================================
  // FORMULA OPERATIONS
  // ===================================================================
  const addFormula = () => {
    const newFormula: CustomFormulaConfig = {
      id: `formula-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      label: 'Calculated Metric',
      formula: 'x',
      decimalPlaces: 2
    }
    const updated = { ...calculator, formulas: [...calculator.formulas, newFormula] }
    updateCalculator(updated)
    setSelectedFormulaId(newFormula.id)
  }

  const deleteFormula = (id: string) => {
    const updatedFormulas = calculator.formulas.filter((f) => f.id !== id)
    updateCalculator({ ...calculator, formulas: updatedFormulas })
    if (selectedFormulaId === id) setSelectedFormulaId(null)
  }

  const updateFormulaField = (id: string, field: keyof CustomFormulaConfig, value: any) => {
    const updatedFormulas = calculator.formulas.map((f) => f.id === id ? { ...f, [field]: value } : f)
    updateCalculator({ ...calculator, formulas: updatedFormulas })
  }

  // ===================================================================
  // IMPORT / EXPORT
  // ===================================================================
  const handleExportJSON = () => {
    const json = JSON.stringify(calculator, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slugify(calculator.name) || 'calculator'}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('📥 JSON downloaded')
  }

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as CustomCalculatorConfig
        if (!parsed.components || !parsed.formulas) throw new Error('Invalid file')
        updateCalculator(parsed)
        showToast('📤 JSON imported')
      } catch (err) {
        showToast('❌ Invalid JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const applyTemplate = (config: CustomCalculatorConfig) => {
    const withId = { ...config, id: calculator.id || `custom-${Date.now()}` }
    updateCalculator(withId)
    setTemplatesOpen(false)
    setSelectedComponentId(null)
    setSelectedFormulaId(null)
    showToast('✨ Template applied')
  }

  // ===================================================================
  // LOGO
  // ===================================================================
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateCalculator({ ...calculator, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  // ===================================================================
  // SAVE TO DASHBOARD
  // ===================================================================
  const handleSaveToDashboard = async () => {
    try {
      const newCalc = { ...calculator, id: calculator.id || `custom-${Date.now()}` }
      addCustomCalculator(newCalc)
      
      localStorage.removeItem('calc_craft_builder_draft')


      showToast('✅ Saved locally!')
      showToast('✅ Saved to your dashboard!')
      setTimeout(() => { window.location.href = '/dashboard' }, 800)
    } catch (e) {
      console.error('Failed to save calculator:', e)
      showToast('❌ Error saving')
    }
  }

  // ===================================================================
  // KEYBOARD SHORTCUTS
  // ===================================================================
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      const mod = e.ctrlKey || e.metaKey

      if (mod && e.key === 's') {
        e.preventDefault()
        handleSaveToDashboard()
      } else if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      } else if (e.key === 'Escape') {
        if (previewOpen) setPreviewOpen(false)
        else if (shareModalOpen) setShareModalOpen(false)
        else if (templatesOpen) setTemplatesOpen(false)
        else if (helpOpen) setHelpOpen(false)
        else if (shortcutsOpen) setShortcutsOpen(false)
      } else if (e.key === '?' && !isInput) {
        e.preventDefault()
        setShortcutsOpen(true)
      } else if (!isInput && !mod) {
        if (e.key === 'p' || e.key === 'P') setPreviewOpen(true)
        if (e.key === 's' || e.key === 'S') setShareModalOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [previewOpen, shareModalOpen, templatesOpen, helpOpen, shortcutsOpen, calculator, undo, redo])

  // ===================================================================
  // PANEL RESIZE HANDLERS
  // ===================================================================
  const startResize = useCallback((panel: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault()
    resizingPanel.current = panel
    resizeStartX.current = e.clientX
    resizeStartWidth.current = panel === 'left' ? leftPanelWidth : rightPanelWidth
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [leftPanelWidth, rightPanelWidth])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingPanel.current) return
      const dx = e.clientX - resizeStartX.current
      if (resizingPanel.current === 'left') {
        const newW = Math.max(200, Math.min(480, resizeStartWidth.current + dx))
        setLeftPanelWidth(newW)
      } else {
        // Right panel: dragging left increases width
        const newW = Math.max(280, Math.min(560, resizeStartWidth.current - dx))
        setRightPanelWidth(newW)
      }
    }
    const handleMouseUp = () => {
      if (resizingPanel.current) {
        resizingPanel.current = null
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // ===================================================================
  // SELECTED
  // ===================================================================
  const selectedComponent = calculator.components.find((c) => c.id === selectedComponentId)
  const selectedFormula = calculator.formulas.find((f) => f.id === selectedFormulaId)

  const availableVariables = calculator.components
    .filter((c) => c.type !== 'header' && c.type !== 'text' && c.type !== 'row' && c.type !== 'column')
    .map((c) => ({ name: c.name, label: c.label }))

  const insertIntoFormula = (text: string) => {
    if (!selectedFormula) {
      // Add a new formula with this text if none selected
      const newFormula: CustomFormulaConfig = {
        id: `formula-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        label: 'New Calculation',
        formula: text,
        decimalPlaces: 2
      }
      updateCalculator({ ...calculator, formulas: [...calculator.formulas, newFormula] })
      setSelectedFormulaId(newFormula.id)
      return
    }
    updateFormulaField(selectedFormula.id, 'formula', selectedFormula.formula + text)
  }

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 bg-gradient-to-b from-neutral-50 to-white flex flex-col">
        {/* ─────────────────── TOOLBAR ─────────────────── */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 px-3 sm:px-5 py-2.5 sm:py-3 flex flex-wrap gap-2 sm:gap-3 items-center justify-between shadow-sm sticky top-28 z-30">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Link
              href="/calculators"
              className="p-1.5 sm:p-2 hover:bg-neutral-100 rounded-lg text-dark-600 transition-colors shrink-0"
              title="Return to Directory"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={calculator.name}
                  onChange={(e) => updateCalculator({ ...calculator, name: e.target.value })}
                  className="text-sm sm:text-base font-bold text-dark-900 focus:outline-none focus:border-b-2 focus:border-indigo-500 bg-transparent px-1 py-0.5 rounded w-full min-w-0"
                  placeholder="Calculator Name"
                />
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse shrink-0 hidden sm:block" />
              </div>
              <p className="text-[9px] sm:text-[10px] text-dark-400 font-mono truncate">
                Builder · {calculator.components.length} fields · {calculator.formulas.length} formulas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {/* Undo / Redo */}
            <div className="flex items-center bg-neutral-100 rounded-lg p-0.5">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-1.5 hover:bg-white text-dark-600 rounded transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 hover:bg-white text-dark-600 rounded transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Import / Export JSON */}
            <div className="flex items-center bg-neutral-100 rounded-lg p-0.5">
              <button
                onClick={handleExportJSON}
                className="p-1.5 hover:bg-white text-dark-600 rounded transition-all"
                title="Export JSON backup"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <label
                className="p-1.5 hover:bg-white text-dark-600 rounded transition-all cursor-pointer"
                title="Import JSON backup"
              >
                <Upload className="w-3.5 h-3.5" />
                <input type="file" accept="application/json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>

            {/* Templates */}
            <button
              onClick={() => setTemplatesOpen(true)}
              className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold text-dark-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-1 active:scale-95 transition-all"
              title="Start from a template"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">TEMPLATES</span>
            </button>

            {/* Calculator Settings */}
            <button
              onClick={() => {
                setActiveTab('settings')
                setRightDrawerOpen(true)
              }}
              className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold text-dark-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-1 active:scale-95 transition-all"
              title="Calculator global settings"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Calculator Settings</span>
            </button>

            {/* Mobile: open left drawer */}
            <button
              onClick={() => setLeftDrawerOpen(true)}
              className="lg:hidden p-1.5 bg-white border border-neutral-200 rounded-lg text-dark-600 active:scale-95"
              title="Add fields"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* Mobile: open right drawer */}
            <button
              onClick={() => setRightDrawerOpen(true)}
              className="lg:hidden p-1.5 bg-white border border-neutral-200 rounded-lg text-dark-600 active:scale-95"
              title="Inspector"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setPreviewOpen(true)}
              className="px-2.5 sm:px-3.5 py-1.5 text-[10px] sm:text-xs font-bold text-dark-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-1 active:scale-95 transition-all"
              title="Live preview (P)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PREVIEW</span>
            </button>
            <button
              onClick={() => setShareModalOpen(true)}
              className="px-2.5 sm:px-3.5 py-1.5 text-[10px] sm:text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 flex items-center gap-1 active:scale-95 transition-all"
              title="Share & embed (S)"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SHARE</span>
            </button>
            <button
              onClick={handleSaveToDashboard}
              className="px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold text-white bg-gradient-to-r from-dark-800 to-dark-900 hover:from-dark-900 hover:to-black rounded-lg active:scale-95 transition-all flex items-center gap-1 shadow"
              title="Save (Ctrl+S)"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SAVE</span>
            </button>
            <button
              onClick={() => setHelpOpen(true)}
              className="p-1.5 hover:bg-neutral-100 text-dark-500 rounded-lg transition-colors"
              title="How to use"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─────────────────── WORKSPACE ─────────────────── */}
        <div className="flex-1 flex overflow-hidden h-[calc(100vh-11rem)] relative">
            {/* Left Column (Toolbox & Document Outline) - Desktop */}
            <div className="hidden lg:flex bg-white border-r border-neutral-200 flex-col h-full overflow-y-auto p-4 shrink-0 gap-6" style={{ width: leftPanelWidth, minWidth: 200, maxWidth: 480 }}>
              <ToolboxPanel
                onAdd={addComponent}
                onShowTemplates={() => setTemplatesOpen(true)}
                onShowHelp={() => setHelpOpen(true)}
              />
              
              {/* Document Outline Tree */}
              <div className="border-t border-neutral-100 pt-4">
                <h3 className="text-xs font-bold text-dark-800 uppercase tracking-widest font-mono mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  Document Outline
                </h3>
                {calculator.components.length === 0 && calculator.formulas.length === 0 ? (
                  <p className="text-[10px] text-dark-400 font-mono italic">No elements added yet.</p>
                ) : (
                  <div className="space-y-1">
                    {calculator.components.map((c) => {
                      const isSelected = selectedComponentId === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedComponentId(c.id);
                            setSelectedFormulaId(null);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                            isSelected
                              ? 'bg-indigo-50 text-indigo-750 font-bold'
                              : 'text-dark-600 hover:bg-neutral-50 hover:text-dark-900'
                          }`}
                        >
                          <span className="text-xs truncate">{c.label || '(Unnamed Block)'}</span>
                          <span className="text-[9px] font-mono opacity-60 ml-2">[{c.type}]</span>
                        </button>
                      );
                    })}
                    {calculator.formulas.map((f) => {
                      const isSelected = selectedFormulaId === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => {
                            setSelectedFormulaId(f.id);
                            setSelectedComponentId(null);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                            isSelected
                              ? 'bg-yellow-50 text-yellow-800 font-bold'
                              : 'text-dark-600 hover:bg-neutral-50 hover:text-dark-900'
                          }`}
                        >
                          <span className="text-xs truncate">{f.label || '(Unnamed Formula)'}</span>
                          <span className="text-[9px] font-mono text-yellow-600 ml-2">[formula]</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Left Resize Divider */}
            <div
              className="hidden lg:flex items-center justify-center w-2 hover:w-3 bg-transparent hover:bg-indigo-100/60 cursor-col-resize transition-all shrink-0 group/divider relative z-20"
              onMouseDown={(e) => startResize('left', e)}
              title="Drag to resize toolbox"
            >
              <div className="w-0.5 h-8 bg-neutral-300 group-hover/divider:bg-indigo-400 rounded-full transition-colors" />
            </div>

            {/* ─── CENTER CANVAS ─── */}
            <div className="p-3 sm:p-5 lg:p-6 lg:overflow-y-auto flex justify-center items-start bg-gradient-to-br from-neutral-50 to-white min-h-[500px] lg:h-full flex-1">
            <div className={`w-full space-y-4 transition-all duration-300 ${canvasMode === 'split' ? 'max-w-5xl' : 'max-w-2xl'}`}>
              
              {/* Canvas Mode Selection Bar */}
              {calculator.components.length > 0 && (
                <div className="flex items-center justify-between bg-white border border-neutral-200/80 rounded-xl p-1 shadow-sm shrink-0">
                  <div className="flex gap-1 flex-1">
                    <button
                      onClick={() => setCanvasMode('split')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        canvasMode === 'split' ? 'bg-indigo-600 text-white shadow' : 'text-dark-600 hover:bg-neutral-50'
                      }`}
                    >
                      <Layout className="w-3.5 h-3.5" />
                      <span>Split View</span>
                    </button>
                    <button
                      onClick={() => setCanvasMode('visual')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        canvasMode === 'visual' ? 'bg-indigo-600 text-white shadow' : 'text-dark-600 hover:bg-neutral-50'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visual Editor</span>
                    </button>
                    <button
                      onClick={() => setCanvasMode('blueprint')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        canvasMode === 'blueprint' ? 'bg-indigo-600 text-white shadow' : 'text-dark-600 hover:bg-neutral-50'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Logical Blocks</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Empty-state tutorial card (only when canvas is empty) */}
              {calculator.components.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e)}
                  className="bg-white border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-2xl p-6 sm:p-10 text-center transition-all cursor-copy"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-dark-900 mb-2">Start your calculator</h2>
                  <p className="text-sm text-dark-500 mb-5 max-w-md mx-auto">
                    Add fields from the left, then write formulas that combine them. Or grab a ready-made template to get going in seconds.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => setTemplatesOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 active:scale-95 animate-pulse"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      Browse Templates
                    </button>
                    <button
                      onClick={() => addComponent('number')}
                      className="px-4 py-2 bg-white border border-neutral-200 hover:border-indigo-300 text-dark-700 text-xs font-bold rounded-lg flex items-center gap-1.5 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add First Field
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Render based on mode */}
              {calculator.components.length > 0 && (
                <>
                  {canvasMode === 'split' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-start">
                      {/* Left Column: Blueprint & Formulas */}
                      <div className="space-y-4">
                        {/* Blueprint Outline */}
                        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
                          <div className="text-center pb-3 border-b border-neutral-100 flex justify-between items-center">
                            <span className="text-[9px] uppercase tracking-widest font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">
                              Blueprint Outline
                            </span>
                            <span className="text-[9px] font-mono text-dark-400 hidden sm:inline">
                              Drag to Reorder
                            </span>
                          </div>

                          <div 
                            className="space-y-2.5 mt-4 min-h-[200px]"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e)}
                          >
                            <AnimatePresence mode="popLayout">
                              {calculator.components.map((c, idx) => {
                                const isSelected = selectedComponentId === c.id
                                return (
                                  <motion.div
                                    key={c.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                  >
                                    <div
                                      onClick={() => { setSelectedComponentId(c.id); setSelectedFormulaId(null) }}
                                      draggable
                                      onDragStart={(e) => handleDragStart(e, idx)}
                                      onDragOver={(e) => handleDragOver(e, idx)}
                                      onDragEnd={handleDragEnd}
                                      onDrop={(e) => handleDrop(e, idx)}
                                      className={`p-3 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing relative group ${
                                        draggedIdx === idx
                                          ? 'opacity-40 border-dashed border-indigo-400 bg-neutral-100 scale-[0.97]'
                                          : isSelected
                                          ? 'border-indigo-500 bg-indigo-50/30 shadow-md ring-2 ring-indigo-500/10'
                                          : 'border-neutral-100 hover:border-neutral-200 bg-white'
                                      }`}
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1 min-w-0 flex items-center flex-wrap gap-1.5">
                                          <span className="text-[8px] font-mono uppercase bg-neutral-100 text-dark-600 px-1.5 py-0.5 rounded font-bold">
                                            {c.type}
                                          </span>
                                          <span className="text-xs font-bold text-dark-800">{c.label}</span>
                                          {c.parentId && (
                                            <span className="text-[8px] font-mono bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold select-none" title="Parent Container">
                                              In: {calculator.components.find((p: any) => p.id === c.parentId)?.label || 'Container'}
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button onClick={(e) => { e.stopPropagation(); moveComponent(idx, 'up') }} disabled={idx === 0} className="p-1 hover:bg-neutral-100 text-dark-500 rounded disabled:opacity-30" title="Move up">
                                            <ArrowUp className="w-3.5 h-3.5" />
                                          </button>
                                          <button onClick={(e) => { e.stopPropagation(); moveComponent(idx, 'down') }} disabled={idx === calculator.components.length - 1} className="p-1 hover:bg-neutral-100 text-dark-500 rounded disabled:opacity-30" title="Move down">
                                            <ArrowDown className="w-3.5 h-3.5" />
                                          </button>
                                          <button onClick={(e) => { e.stopPropagation(); duplicateComponent(c.id) }} className="p-1 hover:bg-blue-50 text-blue-500 rounded" title="Duplicate">
                                            <Layers className="w-3.5 h-3.5" />
                                          </button>
                                          <button onClick={(e) => { e.stopPropagation(); deleteComponent(c.id) }} className="p-1 hover:bg-red-50 text-red-500 rounded" title="Delete">
                                            <Trash className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Per-type preview */}
                                      {c.type === 'number' && (
                                        <div className="relative border border-neutral-200 bg-neutral-50 h-8 px-2.5 rounded-lg flex items-center justify-between text-xs text-neutral-400 font-mono">
                                          <span className="truncate">{c.placeholder || 'Placeholder...'}</span>
                                          {c.unit && <span className="font-bold shrink-0 ml-2 opacity-80">{c.unit}</span>}
                                        </div>
                                      )}
                                      {c.type === 'slider' && (
                                        <div className="space-y-1 py-0.5">
                                          <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                                            <span>Range: {c.min} - {c.max}</span>
                                            <span>Default: {c.defaultValue} {c.unit}</span>
                                          </div>
                                          <div className="w-full h-1.5 bg-neutral-200 rounded-full" />
                                        </div>
                                      )}
                                      {(c.type === 'select' || c.type === 'radio') && (
                                        <div className="border border-neutral-200 bg-neutral-50 h-8 px-2.5 rounded-lg flex items-center justify-between text-xs text-neutral-400 font-mono">
                                          <span className="truncate">Default: {c.defaultValue || 'None'}</span>
                                          <span className="text-[9px] opacity-70 shrink-0 ml-2">({c.options?.length || 0} options)</span>
                                        </div>
                                      )}
                                      {c.type === 'checkbox' && (
                                        <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                                          <div className="w-3.5 h-3.5 border border-neutral-300 rounded bg-neutral-50" />
                                          <span>{c.placeholder || 'Checkbox toggle'}</span>
                                        </div>
                                      )}
                                      {c.type === 'header' && (
                                        <div className="border-b border-neutral-200 pb-0.5 text-xs font-mono font-bold text-neutral-600 uppercase">
                                          --- {c.label || 'Section Header'} ---
                                        </div>
                                      )}
                                      {c.type === 'text' && (
                                        <p className="text-[10px] text-neutral-500 font-mono leading-relaxed truncate">
                                          {c.label || 'Explanatory text block...'}
                                        </p>
                                      )}
                                      {(c.type === 'row' || c.type === 'column') && (
                                        <div className="text-[10px] text-neutral-400 font-mono italic">
                                          Container holds: {calculator.components.filter((child: any) => child.parentId === c.id).length} child item(s)
                                        </div>
                                      )}

                                      {c.type !== 'header' && c.type !== 'text' && c.type !== 'row' && c.type !== 'column' && (
                                        <div className="text-[8px] font-mono text-dark-400 mt-1.5 text-right select-none">
                                          var: <span className="font-black text-indigo-500 bg-indigo-50 px-1 rounded">{c.name}</span>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Formulas List */}
                        <div className="bg-gradient-to-br from-dark-900 to-black rounded-2xl p-4 sm:p-5 shadow-xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] uppercase tracking-widest font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded font-bold">
                              Formula Outputs
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              {calculator.formulas.length} formula{calculator.formulas.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {calculator.formulas.map((f) => {
                              const isSelected = selectedFormulaId === f.id
                              return (
                                <button
                                  type="button"
                                  key={f.id}
                                  onClick={() => { setSelectedFormulaId(f.id); setSelectedComponentId(null) }}
                                  className={`w-full p-3 rounded-xl font-mono text-xs border-2 text-left transition-all ${
                                    isSelected
                                      ? 'border-yellow-400 bg-yellow-400/5'
                                      : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                                  }`}
                                >
                                  <div className="flex justify-between items-center gap-2">
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{f.label}</div>
                                      <div className="text-yellow-300 font-bold text-xs mt-0.5 truncate">
                                        {f.prefix || ''}<span className="text-white">[Result]</span>{f.suffix || ''}
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <div className="text-[9px] text-neutral-500 font-mono">formula</div>
                                      <div className="text-yellow-400 font-bold bg-yellow-400/10 px-1.5 py-0.5 rounded mt-0.5 text-[9px] truncate max-w-[140px]">{f.formula}</div>
                                    </div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {calculator.formulas.length === 0 && (
                          <button
                            onClick={addFormula}
                            className="w-full p-6 bg-gradient-to-br from-dark-900 to-black text-white rounded-2xl border-2 border-dashed border-yellow-400/30 hover:border-yellow-400/60 transition-all group"
                          >
                            <Plus className="w-6 h-6 mx-auto mb-2 text-yellow-400 group-hover:scale-110 transition-transform" />
                            <div className="text-sm font-bold">Add a Formula</div>
                            <div className="text-[10px] text-neutral-400 mt-1">Use the variables above to compute a result</div>
                          </button>
                        )}
                      </div>

                      {/* Right Column: Dynamic Live Preview */}
                      <div className="sticky top-32 space-y-3">
                        <div className="bg-neutral-100/50 border border-neutral-200 p-2 rounded-xl text-center text-[10px] font-mono font-bold text-dark-500 uppercase tracking-wider select-none">
                          Interactive WYSIWYG Preview
                        </div>
                        <div 
                          className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 shadow-sm w-full transition-all hover:bg-indigo-50/5 cursor-copy"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e)}
                        >
                          <CustomCalculatorRenderer
                            config={calculator}
                            selectedId={selectedComponentId}
                            onSelectComponent={(id) => {
                              setSelectedComponentId(id)
                              setSelectedFormulaId(null)
                            }}
                            selectedFormulaId={selectedFormulaId}
                            onSelectFormula={(id) => {
                              setSelectedFormulaId(id)
                              setSelectedComponentId(null)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {canvasMode === 'visual' && (
                    <div className="space-y-4 w-full">
                      <div className="bg-neutral-100/50 border border-neutral-200 p-2.5 rounded-xl text-center text-[10px] font-mono font-bold text-dark-500 uppercase tracking-wider select-none">
                        Visual Editor — Click elements to edit settings
                      </div>
                      <div 
                        className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 shadow-sm w-full transition-all hover:bg-indigo-50/5 cursor-copy"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e)}
                      >
                        <CustomCalculatorRenderer
                          config={calculator}
                          selectedId={selectedComponentId}
                          onSelectComponent={(id) => {
                            setSelectedComponentId(id)
                            setSelectedFormulaId(null)
                          }}
                          selectedFormulaId={selectedFormulaId}
                          onSelectFormula={(id) => {
                            setSelectedFormulaId(id)
                            setSelectedComponentId(null)
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {canvasMode === 'blueprint' && (
                    <div className="space-y-4">
                      {/* Blueprint List */}
                      <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
                        <div className="text-center pb-3 border-b border-neutral-100 flex justify-between items-center">
                          <span className="text-[9px] uppercase tracking-widest font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">
                            Blueprint Outline
                          </span>
                          <span className="text-[9px] font-mono text-dark-400 hidden sm:inline">
                            Drag to Reorder
                          </span>
                        </div>

                        <div 
                          className="space-y-2.5 mt-4 min-h-[200px]"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e)}
                        >
                          <AnimatePresence mode="popLayout">
                            {calculator.components.map((c, idx) => {
                              const isSelected = selectedComponentId === c.id
                              return (
                                <motion.div
                                  key={c.id}
                                  layout
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                >
                                  <div
                                    onClick={() => { setSelectedComponentId(c.id); setSelectedFormulaId(null) }}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDragEnd={handleDragEnd}
                                    onDrop={(e) => handleDrop(e, idx)}
                                    className={`p-3 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing relative group ${
                                      draggedIdx === idx
                                        ? 'opacity-40 border-dashed border-indigo-400 bg-neutral-100 scale-[0.97]'
                                        : isSelected
                                        ? 'border-indigo-500 bg-indigo-50/30 shadow-md ring-2 ring-indigo-500/10'
                                        : 'border-neutral-100 hover:border-neutral-200 bg-white'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex-1 min-w-0 flex items-center flex-wrap gap-1.5">
                                        <span className="text-[8px] font-mono uppercase bg-neutral-100 text-dark-600 px-1.5 py-0.5 rounded font-bold">
                                          {c.type}
                                        </span>
                                        <span className="text-xs font-bold text-dark-800">{c.label}</span>
                                        {c.parentId && (
                                          <span className="text-[8px] font-mono bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold select-none" title="Parent Container">
                                            In: {calculator.components.find((p: any) => p.id === c.parentId)?.label || 'Container'}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); moveComponent(idx, 'up') }} disabled={idx === 0} className="p-1 hover:bg-neutral-100 text-dark-500 rounded disabled:opacity-30" title="Move up">
                                          <ArrowUp className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); moveComponent(idx, 'down') }} disabled={idx === calculator.components.length - 1} className="p-1 hover:bg-neutral-100 text-dark-500 rounded disabled:opacity-30" title="Move down">
                                          <ArrowDown className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); duplicateComponent(c.id) }} className="p-1 hover:bg-blue-50 text-blue-500 rounded" title="Duplicate">
                                          <Layers className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteComponent(c.id) }} className="p-1 hover:bg-red-50 text-red-500 rounded" title="Delete">
                                          <Trash className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Per-type preview */}
                                    {c.type === 'number' && (
                                      <div className="relative border border-neutral-200 bg-neutral-50 h-8 px-2.5 rounded-lg flex items-center justify-between text-xs text-neutral-400 font-mono">
                                        <span className="truncate">{c.placeholder || 'Placeholder...'}</span>
                                        {c.unit && <span className="font-bold shrink-0 ml-2 opacity-80">{c.unit}</span>}
                                      </div>
                                    )}
                                    {c.type === 'slider' && (
                                      <div className="space-y-1 py-0.5">
                                        <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                                          <span>Range: {c.min} - {c.max}</span>
                                          <span>Default: {c.defaultValue} {c.unit}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-neutral-200 rounded-full" />
                                      </div>
                                    )}
                                    {(c.type === 'select' || c.type === 'radio') && (
                                      <div className="border border-neutral-200 bg-neutral-50 h-8 px-2.5 rounded-lg flex items-center justify-between text-xs text-neutral-400 font-mono">
                                        <span className="truncate">Default: {c.defaultValue || 'None'}</span>
                                        <span className="text-[9px] opacity-70 shrink-0 ml-2">({c.options?.length || 0} options)</span>
                                      </div>
                                    )}
                                    {c.type === 'checkbox' && (
                                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                                        <div className="w-3.5 h-3.5 border border-neutral-300 rounded bg-neutral-50" />
                                        <span>{c.placeholder || 'Checkbox toggle'}</span>
                                      </div>
                                    )}
                                    {c.type === 'header' && (
                                      <div className="border-b border-neutral-200 pb-0.5 text-xs font-mono font-bold text-neutral-600 uppercase">
                                        --- {c.label || 'Section Header'} ---
                                      </div>
                                    )}
                                    {c.type === 'text' && (
                                      <p className="text-[10px] text-neutral-500 font-mono leading-relaxed truncate">
                                        {c.label || 'Explanatory text block...'}
                                      </p>
                                    )}

                                    {(c.type === 'row' || c.type === 'column') && (
                                      <div className="text-[10px] text-neutral-400 font-mono italic">
                                        Container holds: {calculator.components.filter((child: any) => child.parentId === c.id).length} child item(s)
                                      </div>
                                    )}

                                    {c.type !== 'header' && c.type !== 'text' && c.type !== 'row' && c.type !== 'column' && (
                                      <div className="text-[8px] font-mono text-dark-400 mt-1.5 text-right select-none">
                                        var: <span className="font-black text-indigo-500 bg-indigo-50 px-1 rounded">{c.name}</span>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )
                            })}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Formulas List */}
                      <div className="bg-gradient-to-br from-dark-900 to-black rounded-2xl p-4 sm:p-5 shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] uppercase tracking-widest font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded font-bold">
                            Formula Outputs
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {calculator.formulas.length} formula{calculator.formulas.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {calculator.formulas.map((f) => {
                            const isSelected = selectedFormulaId === f.id
                            return (
                              <button
                                type="button"
                                key={f.id}
                                onClick={() => { setSelectedFormulaId(f.id); setSelectedComponentId(null) }}
                                className={`w-full p-3 rounded-xl font-mono text-xs border-2 text-left transition-all ${
                                  isSelected
                                    ? 'border-yellow-400 bg-yellow-400/5'
                                    : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                                }`}
                              >
                                <div className="flex justify-between items-center gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{f.label}</div>
                                    <div className="text-yellow-300 font-bold text-xs mt-0.5 truncate">
                                      {f.prefix || ''}<span className="text-white">[Result]</span>{f.suffix || ''}
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <div className="text-[9px] text-neutral-500 font-mono">formula</div>
                                    <div className="text-yellow-400 font-bold bg-yellow-400/10 px-1.5 py-0.5 rounded mt-0.5 text-[9px] truncate max-w-[140px]">{f.formula}</div>
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {calculator.formulas.length === 0 && (
                        <button
                          onClick={addFormula}
                          className="w-full p-6 bg-gradient-to-br from-dark-900 to-black text-white rounded-2xl border-2 border-dashed border-yellow-400/30 hover:border-yellow-400/60 transition-all group"
                        >
                          <Plus className="w-6 h-6 mx-auto mb-2 text-yellow-400 group-hover:scale-110 transition-transform" />
                          <div className="text-sm font-bold">Add a Formula</div>
                          <div className="text-[10px] text-neutral-400 mt-1">Use the variables above to compute a result</div>
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Bottom Quick Controls (Undo/Redo & Shortcuts) */}
              {calculator.components.length > 0 && (
                <div className="flex items-center justify-between bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm mt-5 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 disabled:hover:bg-neutral-100 text-dark-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      title="Undo (Ctrl+Z)"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Undo</span>
                      <kbd className="hidden sm:inline-block px-1 bg-white border border-neutral-300 rounded text-[9px] font-mono font-bold text-dark-500">Ctrl+Z</kbd>
                    </button>
                    <button
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 disabled:hover:bg-neutral-100 text-dark-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      title="Redo (Ctrl+Y)"
                    >
                      <Redo2 className="w-3.5 h-3.5" />
                      <span>Redo</span>
                      <kbd className="hidden sm:inline-block px-1 bg-white border border-neutral-300 rounded text-[9px] font-mono font-bold text-dark-500">Ctrl+Y</kbd>
                    </button>
                  </div>
                  <div className="text-[10px] text-dark-500 font-mono hidden sm:block">
                    Shortcuts: <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded">Ctrl+Z</kbd> / <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded">Ctrl+Y</kbd>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Resize Divider */}
          <div
            className="hidden lg:flex items-center justify-center w-2 hover:w-3 bg-transparent hover:bg-indigo-100/60 cursor-col-resize transition-all shrink-0 group/divider relative z-20"
            onMouseDown={(e) => startResize('right', e)}
            title="Drag to resize inspector"
          >
            <div className="w-0.5 h-8 bg-neutral-300 group-hover/divider:bg-indigo-400 rounded-full transition-colors" />
          </div>

          {/* ─── RIGHT SIDEBAR: Inspector ─── */}
          <div className="hidden lg:flex bg-white border-t lg:border-t-0 lg:border-l border-neutral-200 flex-col h-auto lg:h-full lg:overflow-hidden" style={{ width: rightPanelWidth, minWidth: 280, maxWidth: 560 }}>
            <InspectorPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedComponent={selectedComponent}
              selectedFormula={selectedFormula}
              calculator={calculator}
              availableVariables={availableVariables}
              formulaFunctions={FORMULA_FUNCTIONS}
              formulaConstants={FORMULA_CONSTANTS}
              updateCalculator={updateCalculator}
              updateComponentField={updateComponentField}
              updateFormulaField={updateFormulaField}
              deleteComponent={deleteComponent}
              deleteFormula={deleteFormula}
              addFormula={addFormula}
              handleLogoUpload={handleLogoUpload}
              insertIntoFormula={insertIntoFormula}
              setSelectedComponentId={setSelectedComponentId}
              setSelectedFormulaId={setSelectedFormulaId}
            />
          </div>
        </div>
      </main>

      {/* ─────────────────── TOAST ─────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 bg-dark-900 text-white text-sm font-bold rounded-xl shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────── TEMPLATES MODAL ─────────────────── */}
      <AnimatePresence>
        {templatesOpen && (
          <ModalShell onClose={() => setTemplatesOpen(false)} title="Choose a Template" subtitle="Start with a ready-made calculator, or start blank." wide>
            <div className="grid sm:grid-cols-2 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate({ ...t.config, id: calculator.id })}
                  className="text-left p-4 bg-white border-2 border-neutral-200 hover:border-indigo-400 hover:shadow-lg rounded-2xl transition-all group"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {t.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-dark-900">{t.label}</div>
                      <div className="text-[10px] font-mono text-dark-400 mt-0.5">
                        {t.config.components.length} fields · {t.config.formulas.length} formulas
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-dark-500">{t.description}</p>
                </button>
              ))}
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* ─────────────────── HELP MODAL ─────────────────── */}
      <AnimatePresence>
        {helpOpen && (
          <ModalShell onClose={() => setHelpOpen(false)} title="How to use the Builder" subtitle="Build a custom calculator in 3 simple steps.">
            <div className="space-y-4 text-sm text-dark-700">
              <HelpStep
                num={1}
                title="Add input fields"
                body="Use the left panel to add Number, Slider, Select, or Checkbox fields. Each field becomes a variable you can use in formulas."
              />
              <HelpStep
                num={2}
                title="Write formulas"
                body="Click the 'Add Formula' area to create outputs. Use the variable names from your fields plus math functions like sqrt(), pow(), pi, and e."
              />
              <HelpStep
                num={3}
                title="Save & share"
                body="Click SAVE to add it to your library, SHARE to get a public link, or use the embed snippet on your own website."
              />

              <div className="pt-3 border-t border-neutral-100">
                <div className="text-[10px] font-bold text-dark-500 uppercase tracking-wider mb-2">Tips</div>
                <ul className="text-xs space-y-1.5 list-disc pl-5 text-dark-600">
                  <li>Press <kbd className="px-1 py-0.5 bg-neutral-100 rounded text-[10px] font-mono">P</kbd> for preview, <kbd className="px-1 py-0.5 bg-neutral-100 rounded text-[10px] font-mono">S</kbd> for share</li>
                  <li><kbd className="px-1 py-0.5 bg-neutral-100 rounded text-[10px] font-mono">Ctrl+Z</kbd> / <kbd className="px-1 py-0.5 bg-neutral-100 rounded text-[10px] font-mono">Ctrl+Y</kbd> for undo / redo</li>
                  <li>Click any field on the canvas to edit its properties</li>
                  <li>Press <kbd className="px-1 py-0.5 bg-neutral-100 rounded text-[10px] font-mono">?</kbd> any time to see all keyboard shortcuts</li>
                </ul>
              </div>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* ─────────────────── KEYBOARD SHORTCUTS MODAL ─────────────────── */}
      <AnimatePresence>
        {shortcutsOpen && (
          <ModalShell onClose={() => setShortcutsOpen(false)} title="Keyboard Shortcuts" subtitle="Work faster with these keys.">
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              {[
                { keys: ['Ctrl', 'S'], label: 'Save calculator' },
                { keys: ['Ctrl', 'Z'], label: 'Undo' },
                { keys: ['Ctrl', 'Y'], label: 'Redo' },
                { keys: ['P'], label: 'Open preview' },
                { keys: ['S'], label: 'Open share' },
                { keys: ['Esc'], label: 'Close modals' },
                { keys: ['?'], label: 'Show shortcuts' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg">
                  <span className="text-dark-700">{s.label}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k) => (
                      <kbd key={k} className="px-2 py-0.5 bg-white border border-neutral-200 rounded text-[10px] font-mono font-bold text-dark-700 shadow-sm">{k}</kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* ─────────────────── PREVIEW MODAL ─────────────────── */}
      <AnimatePresence>
        {previewOpen && (
          <ModalShell onClose={() => setPreviewOpen(false)} title="Live Preview" subtitle="Test your calculator as users will see it.">
            <div className="bg-neutral-50 rounded-xl p-2 sm:p-4 max-h-[60vh] overflow-y-auto">
              <CustomCalculatorRenderer config={calculator} isPreview={true} />
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* ─────────────────── SHARE MODAL ─────────────────── */}
      <AnimatePresence>
        {shareModalOpen && (
          <ModalShell onClose={() => setShareModalOpen(false)} title="Share & Embed" subtitle="Get a link or embed your calculator anywhere." wide>
            <div className="space-y-5">
              {/* Share link */}
              <div>
                <div className="text-xs font-bold text-dark-800 flex items-center gap-1 mb-1">
                  <Share2 className="w-3.5 h-3.5 text-indigo-500" /> Shareable Link
                </div>
                <p className="text-xs text-dark-500 mb-2">Send this URL to share your calculator.</p>
                <div className="flex gap-2">
                  <input type="text" readOnly value={shareLink} className="flex-1 h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono select-all text-dark-600 focus:outline-none" />
                  <button
                    onClick={() => { navigator.clipboard.writeText(shareLink); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); showToast('🔗 Link copied!') }}
                    className="px-4 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedLink ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>

              {/* Embed */}
              <div className="pt-3 border-t border-neutral-100">
                <div className="text-xs font-bold text-dark-800 flex items-center gap-1 mb-1">
                  <Code className="w-3.5 h-3.5 text-indigo-500" /> Iframe Embed
                </div>
                <p className="text-xs text-dark-500 mb-2">Drop this snippet into any HTML page.</p>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-[10px] font-bold text-dark-500 font-mono uppercase mb-1">Width</label>
                    <input type="text" value={embedWidth} onChange={(e) => setEmbedWidth(e.target.value)} className="w-full h-8 px-2 bg-neutral-50 border border-neutral-200 rounded text-xs font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-dark-500 font-mono uppercase mb-1">Height (px)</label>
                    <input type="text" value={embedHeight} onChange={(e) => setEmbedHeight(e.target.value)} className="w-full h-8 px-2 bg-neutral-50 border border-neutral-200 rounded text-xs font-mono" />
                  </div>
                </div>
                <textarea readOnly value={embedCode} rows={3} className="w-full p-2 bg-neutral-900 text-emerald-300 font-mono text-[10px] rounded-lg" />
                <button
                  onClick={() => { navigator.clipboard.writeText(embedCode); setCopiedEmbed(true); setTimeout(() => setCopiedEmbed(false), 2000); showToast('📋 Embed copied!') }}
                  className="mt-2 w-full px-4 h-9 bg-dark-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
                >
                  {copiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedEmbed ? 'COPIED' : 'COPY EMBED CODE'}
                </button>
              </div>

              {/* JSON import/export */}
              <div className="pt-3 border-t border-neutral-100">
                <div className="text-xs font-bold text-dark-800 flex items-center gap-1 mb-1">
                  <FileJson className="w-3.5 h-3.5 text-indigo-500" /> Backup as JSON
                </div>
                <p className="text-xs text-dark-500 mb-2">Download a JSON file of your calculator, or import one.</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={handleExportJSON} className="px-3 h-9 bg-white border border-neutral-200 hover:bg-neutral-50 text-dark-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95">
                    <Download className="w-3.5 h-3.5" /> Export JSON
                  </button>
                  <label className="px-3 h-9 bg-white border border-neutral-200 hover:bg-neutral-50 text-dark-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Import JSON
                    <input type="file" accept="application/json" onChange={handleImportJSON} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* ─────────────────── MOBILE LEFT DRAWER ─────────────────── */}
      <AnimatePresence>
        {leftDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLeftDrawerOpen(false)} className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-neutral-200 p-3 flex items-center justify-between">
                <div className="text-sm font-bold text-dark-900">Add Fields</div>
                <button onClick={() => setLeftDrawerOpen(false)} className="p-1.5 hover:bg-neutral-100 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <ToolboxPanel
                  onAdd={addComponent}
                  onShowTemplates={() => { setTemplatesOpen(true); setLeftDrawerOpen(false) }}
                  onShowHelp={() => { setHelpOpen(true); setLeftDrawerOpen(false) }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─────────────────── MOBILE RIGHT DRAWER ─────────────────── */}
      <AnimatePresence>
        {rightDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRightDrawerOpen(false)} className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="sticky top-0 bg-white border-b border-neutral-200 p-3 flex items-center justify-between z-10">
                <div className="text-sm font-bold text-dark-900">Inspector</div>
                <button onClick={() => setRightDrawerOpen(false)} className="p-1.5 hover:bg-neutral-100 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <InspectorPanel
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  selectedComponent={selectedComponent}
                  selectedFormula={selectedFormula}
                  calculator={calculator}
                  availableVariables={availableVariables}
                  formulaFunctions={FORMULA_FUNCTIONS}
                  formulaConstants={FORMULA_CONSTANTS}
                  updateCalculator={updateCalculator}
                  updateComponentField={updateComponentField}
                  updateFormulaField={updateFormulaField}
                  deleteComponent={deleteComponent}
                  deleteFormula={deleteFormula}
                  addFormula={addFormula}
                  handleLogoUpload={handleLogoUpload}
                  insertIntoFormula={insertIntoFormula}
                  setSelectedComponentId={setSelectedComponentId}
                  setSelectedFormulaId={setSelectedFormulaId}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </>
  )
}

// =====================================================================
// MODAL SHELL — shared modal wrapper
// =====================================================================
function ModalShell({ children, onClose, title, subtitle, wide = false }: { children: React.ReactNode; onClose: () => void; title: string; subtitle?: string; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className={`bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl ${wide ? 'max-w-2xl' : 'max-w-lg'} w-full border border-neutral-200 flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-neutral-100 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-dark-900">{title}</h3>
            {subtitle && <p className="text-xs text-dark-500 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 text-dark-500 rounded-lg shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto -mx-1 px-1">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

function HelpStep({ num, title, body }: { num: number; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-extrabold flex items-center justify-center text-sm">
        {num}
      </div>
      <div>
        <div className="font-bold text-dark-900 mb-0.5">{title}</div>
        <p className="text-xs text-dark-600 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}

// =====================================================================
// TOOLBOX PANEL (left sidebar)
// =====================================================================
function ToolboxPanel({ onAdd, onShowTemplates, onShowHelp }: { onAdd: (t: CustomComponentConfig['type']) => void; onShowTemplates: () => void; onShowHelp: () => void }) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h3 className="text-xs font-bold text-dark-800 uppercase tracking-widest font-mono mb-3 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-indigo-500" />
          Input Controls
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <ToolboxButton onClick={() => onAdd('number')} icon={Type} label="Number Input" desc="Numeric field" type="number" />
          <ToolboxButton onClick={() => onAdd('slider')} icon={Sliders} label="Range Slider" desc="Visual range track" type="slider" />
          <ToolboxButton onClick={() => onAdd('select')} icon={List} label="Select Dropdown" desc="Pick from list" type="select" />
          <ToolboxButton onClick={() => onAdd('radio')} icon={CircleDot} label="Radio Group" desc="Single option select" type="radio" />
          <ToolboxButton onClick={() => onAdd('checkbox')} icon={CheckSquare} label="Checkbox" desc="On / off switch" type="checkbox" />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-dark-800 uppercase tracking-widest font-mono mb-3 flex items-center gap-1.5">
          <Grid2x2 className="w-3.5 h-3.5 text-indigo-500" />
          Layout Containers
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <ToolboxButton onClick={() => onAdd('row')} icon={Grid2x2} label="Row Container" desc="Horizontal inputs row" type="row" />
          <ToolboxButton onClick={() => onAdd('column')} icon={Layout} label="Column Container" desc="Vertical nested column" type="column" />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-dark-800 uppercase tracking-widest font-mono mb-3 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-indigo-500" />
          Layout Blocks
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <ToolboxButton onClick={() => onAdd('header')} icon={Heading} label="Section Header" desc="Visual divider" type="header" />
          <ToolboxButton onClick={() => onAdd('text')} icon={Type} label="Paragraph Text" desc="Instructions / labels" type="text" />
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-100 space-y-2">
        <button
          onClick={onShowTemplates}
          className="w-full p-3 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 hover:border-indigo-200 rounded-xl text-left transition-all group"
        >
          <div className="flex items-center gap-2 mb-1">
            <Wand2 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-indigo-900">Templates</span>
          </div>
          <p className="text-[10px] text-indigo-700/80">Start from BMI, Tip, Discount, Compound Interest & more</p>
        </button>

        <button
          onClick={onShowHelp}
          className="w-full p-3 bg-amber-50 border border-amber-100 hover:border-amber-200 rounded-xl text-left transition-all group"
        >
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-amber-900">Quick Tutorial</span>
          </div>
          <p className="text-[10px] text-amber-700/80">3-step guide to building a calculator</p>
        </button>
      </div>
    </div>
  )
}

function ToolboxButton({ onClick, icon: Icon, label, desc, type }: { onClick: () => void; icon: any; label: string; desc: string; type?: CustomComponentConfig['type'] }) {
  const handleDragStart = (e: React.DragEvent) => {
    if (type) {
      e.dataTransfer.setData('application/x-calc-craft-type', type)
      e.dataTransfer.effectAllowed = 'copy'
    }
  }

  return (
    <button
      onClick={onClick}
      draggable={!!type}
      onDragStart={type ? handleDragStart : undefined}
      className={`flex items-center gap-3 p-2.5 rounded-xl border border-neutral-100 hover:border-indigo-200 hover:bg-indigo-50/30 text-left transition-all w-full group ${
        type ? 'cursor-grab active:cursor-grabbing select-none' : ''
      }`}
    >
      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-dark-800">{label}</div>
        <div className="text-[10px] text-dark-500 truncate">{desc}</div>
      </div>
    </button>
  )
}

// =====================================================================
// INSPECTOR PANEL (right sidebar)
// =====================================================================
function InspectorPanel({
  activeTab, setActiveTab,
  selectedComponent, selectedFormula,
  calculator, availableVariables,
  formulaFunctions, formulaConstants,
  updateCalculator, updateComponentField, updateFormulaField,
  deleteComponent, deleteFormula, addFormula,
  handleLogoUpload, insertIntoFormula,
  setSelectedComponentId, setSelectedFormulaId,
}: any) {
  return (
    <>
      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-neutral-200 sticky top-0 bg-white z-10 shrink-0">
        <button
          onClick={() => setActiveTab('components')}
          className={`py-3 text-[10px] sm:text-xs font-mono font-bold border-b-2 transition-all ${
            activeTab === 'components' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-dark-500 hover:text-dark-700'
          }`}
        >
          INSPECTOR
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 text-[10px] sm:text-xs font-mono font-bold border-b-2 transition-all ${
            activeTab === 'settings' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-dark-500 hover:text-dark-700'
          }`}
        >
          CALCULATOR SETTINGS
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 sm:space-y-6">
        {activeTab === 'components' ? (
          <ElementInspector
            selectedComponent={selectedComponent}
            selectedFormula={selectedFormula}
            calculator={calculator}
            availableVariables={availableVariables}
            formulaFunctions={formulaFunctions}
            formulaConstants={formulaConstants}
            updateComponentField={updateComponentField}
            updateFormulaField={updateFormulaField}
            deleteComponent={deleteComponent}
            deleteFormula={deleteFormula}
            addFormula={addFormula}
            insertIntoFormula={insertIntoFormula}
            setSelectedComponentId={setSelectedComponentId}
            setSelectedFormulaId={setSelectedFormulaId}
          />
        ) : (
          <SettingsInspector
            calculator={calculator}
            updateCalculator={updateCalculator}
            handleLogoUpload={handleLogoUpload}
            addFormula={addFormula}
            updateFormulaField={updateFormulaField}
            deleteFormula={deleteFormula}
            availableVariables={availableVariables}
            selectedFormula={selectedFormula}
            insertIntoFormula={insertIntoFormula}
          />
        )}
      </div>
    </>
  )
}

// =====================================================================
// TYPOGRAPHY SETTINGS CONTROL PANEL
// =====================================================================
function TypographySettings({
  value,
  onChange,
  title = "Label Typography"
}: {
  value?: LabelTypographyConfig
  onChange: (val: LabelTypographyConfig) => void
  title?: string
}) {
  const fontSize = value?.fontSize ?? ''
  const fontWeight = value?.fontWeight ?? ''
  const fontStyle = value?.fontStyle || 'default'

  return (
    <div className="space-y-2.5 pt-3 border-t border-neutral-200">
      <span className="block text-[10px] font-extrabold uppercase text-dark-800 font-mono tracking-wider">{title}</span>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[8px] font-bold text-neutral-500 mb-1 font-mono uppercase">Size (px)</label>
          <input
            type="number"
            placeholder="Default"
            min={8}
            max={72}
            value={fontSize}
            onChange={(e) => onChange({ ...value, fontSize: e.target.value ? parseInt(e.target.value) : undefined })}
            className="w-full h-8 px-2 bg-white border border-neutral-200 rounded-lg text-[10px] focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
        <div>
          <label className="block text-[8px] font-bold text-neutral-500 mb-1 font-mono uppercase">Weight</label>
          <input
            type="number"
            placeholder="Default"
            min={100}
            max={900}
            step={100}
            value={fontWeight}
            onChange={(e) => onChange({ ...value, fontWeight: e.target.value ? parseInt(e.target.value) : undefined })}
            className="w-full h-8 px-2 bg-white border border-neutral-200 rounded-lg text-[10px] focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
        <div>
          <label className="block text-[8px] font-bold text-neutral-500 mb-1 font-mono uppercase">Style</label>
          <select
            value={fontStyle}
            onChange={(e) => onChange({ ...value, fontStyle: e.target.value as any })}
            className="w-full h-8 px-2 bg-white border border-neutral-200 rounded-lg text-[10px] focus:outline-none focus:border-indigo-500"
          >
            <option value="default">Default</option>
            <option value="normal">Normal</option>
            <option value="italic">Italic</option>
          </select>
        </div>
      </div>
    </div>
  )
}

// =====================================================================
// ELEMENT INSPECTOR
// =====================================================================
function ElementInspector({
  selectedComponent, selectedFormula,
  calculator,
  availableVariables, formulaFunctions, formulaConstants,
  updateComponentField, updateFormulaField,
  deleteComponent, deleteFormula, addFormula,
  insertIntoFormula,
}: any) {
  // Variables map using defaults for evaluation preview
  const defaultVarsMap = useMemo(() => {
    const map: Record<string, number> = {}
    calculator?.components.forEach((c: any) => {
      if (c.type === 'header' || c.type === 'text' || c.type === 'row' || c.type === 'column') return
      
      if (c.calculationFormula) {
        const calculatedVal = evaluateFormula(c.calculationFormula, map)
        map[c.name] = isNaN(calculatedVal) ? 0 : calculatedVal
      } else {
        const raw = String(c.defaultValue ?? '0')
        if (c.type === 'checkbox') {
          map[c.name] = raw === 'true' ? 1 : 0
        } else {
          const val = parseFloat(raw)
          map[c.name] = isNaN(val) ? 0 : val
        }
      }
    })
    return map
  }, [calculator?.components])

  const validation = useMemo(() => {
    if (!selectedFormula) return { isValid: true }
    return checkFormula(selectedFormula.formula, availableVariables.map((v: any) => v.name))
  }, [selectedFormula?.formula, availableVariables])

  const previewValue = useMemo(() => {
    if (!selectedFormula || !validation.isValid) return null
    const val = evaluateFormula(selectedFormula.formula, defaultVarsMap)
    return isNaN(val) || !isFinite(val) ? 0 : val
  }, [selectedFormula?.formula, defaultVarsMap, validation.isValid])

  const componentFormulaValidation = useMemo(() => {
    if (!selectedComponent || !selectedComponent.calculationFormula) return { isValid: true }
    const selfRegex = new RegExp('\\b' + selectedComponent.name + '\\b')
    if (selfRegex.test(selectedComponent.calculationFormula)) {
      return { isValid: false, error: "Circular reference: Formula cannot reference its own variable name." }
    }
    return checkFormula(
      selectedComponent.calculationFormula,
      availableVariables.map((v: any) => v.name).filter((name: string) => name !== selectedComponent.name)
    )
  }, [selectedComponent?.calculationFormula, selectedComponent?.name, availableVariables])

  const componentFormulaPreview = useMemo(() => {
    if (!selectedComponent || !selectedComponent.calculationFormula || !componentFormulaValidation.isValid) return null
    const tempMap = { ...defaultVarsMap }
    delete tempMap[selectedComponent.name]
    const val = evaluateFormula(selectedComponent.calculationFormula, tempMap)
    return isNaN(val) || !isFinite(val) ? 0 : val
  }, [selectedComponent?.calculationFormula, selectedComponent?.name, defaultVarsMap, componentFormulaValidation.isValid])

  const insertIntoComponentFormula = (text: string) => {
    if (!selectedComponent) return
    const currentFormula = selectedComponent.calculationFormula || ''
    updateComponentField(selectedComponent.id, 'calculationFormula', currentFormula + text)
  }

  if (selectedComponent) {
    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-extrabold text-indigo-600 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" /> Edit Field
          </h4>
          <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-2.5 text-[10px] font-mono text-dark-600 space-y-0.5">
            <div>Type: <span className="font-bold uppercase text-dark-800">{selectedComponent.type}</span></div>
          </div>
        </div>

        <Field label="Display Label">
          <input
            type="text"
            value={selectedComponent.label}
            onChange={(e) => updateComponentField(selectedComponent.id, 'label', e.target.value)}
            className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-dark-800 focus:outline-none focus:border-indigo-500"
          />
        </Field>

        {selectedComponent.type !== 'row' && selectedComponent.type !== 'column' && (
          <Field label="Parent Container" hint="Place this element inside a row or column layout container.">
            <select
              value={selectedComponent.parentId || ''}
              onChange={(e) => updateComponentField(selectedComponent.id, 'parentId', e.target.value || undefined)}
              className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-lg text-xs text-dark-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="">None (Top Level)</option>
              {calculator?.components
                .filter((c: any) => c.type === 'row' || c.type === 'column')
                .map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.type})
                  </option>
                ))}
            </select>
          </Field>
        )}

        {(selectedComponent.type === 'row' || selectedComponent.type === 'column') && (
          <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-xl text-xs text-indigo-750 font-mono space-y-1">
            <span className="font-bold uppercase block text-indigo-850">Layout Container ({selectedComponent.type})</span>
            <span>You can place other fields inside this layout by selecting it as their "Parent Container" in their settings.</span>
          </div>
        )}

        {selectedComponent.type !== 'header' && selectedComponent.type !== 'text' && selectedComponent.type !== 'row' && selectedComponent.type !== 'column' && (
          <Field label="Variable Identifier" hint="Use this keyword inside formulas. Auto-generated from your label.">
            <input
              type="text"
              value={selectedComponent.name}
              onChange={(e) => {
                const safeVal = e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()
                updateComponentField(selectedComponent.id, 'name', safeVal)
              }}
              className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold text-indigo-600 focus:outline-none focus:border-indigo-500"
            />
            {availableVariables.some((v: any) => v.name === selectedComponent.name && selectedComponent.name !== '') && (
              <p className="text-[9px] text-amber-600 font-mono mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Duplicate variable name!
              </p>
            )}
          </Field>
        )}

        {selectedComponent.type !== 'header' && selectedComponent.type !== 'text' && selectedComponent.type !== 'row' && selectedComponent.type !== 'column' && (
          <>
            <Field label="Help Text" hint="Shown below the field.">
              <input
                type="text"
                value={selectedComponent.helpText || ''}
                onChange={(e) => updateComponentField(selectedComponent.id, 'helpText', e.target.value)}
                className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-lg text-xs text-dark-800 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. For height in centimeters"
              />
            </Field>
            {selectedComponent.type !== 'checkbox' && (
              <Field label="Unit Suffix" hint="e.g. kg, $, %, yr">
                <input
                  type="text"
                  value={selectedComponent.unit || ''}
                  onChange={(e) => updateComponentField(selectedComponent.id, 'unit', e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-dark-800 focus:outline-none focus:border-indigo-500"
                />
              </Field>
            )}
            <Field label="Default Value" hint={selectedComponent.calculationFormula ? "Disabled. Derived from formula instead." : undefined}>
              {selectedComponent.type === 'checkbox' ? (
                <select
                  value={String(selectedComponent.defaultValue)}
                  onChange={(e) => updateComponentField(selectedComponent.id, 'defaultValue', e.target.value === 'true')}
                  className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-lg text-xs text-dark-800 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  disabled={!!selectedComponent.calculationFormula}
                >
                  <option value="false">Unchecked (False)</option>
                  <option value="true">Checked (True)</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={String(selectedComponent.defaultValue ?? '')}
                  onChange={(e) => updateComponentField(selectedComponent.id, 'defaultValue', e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-lg text-xs text-dark-800 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  disabled={!!selectedComponent.calculationFormula}
                />
              )}
            </Field>
          </>
        )}

        {(selectedComponent.type === 'number' || selectedComponent.type === 'slider') && (
          <div className="grid grid-cols-3 gap-2">
            <Field label="Min"><input type="number" value={selectedComponent.min ?? ''} onChange={(e) => updateComponentField(selectedComponent.id, 'min', e.target.value ? parseFloat(e.target.value) : undefined)} className="w-full h-9 px-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono focus:outline-none" /></Field>
            <Field label="Max"><input type="number" value={selectedComponent.max ?? ''} onChange={(e) => updateComponentField(selectedComponent.id, 'max', e.target.value ? parseFloat(e.target.value) : undefined)} className="w-full h-9 px-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono focus:outline-none" /></Field>
            <Field label="Step"><input type="number" value={selectedComponent.step ?? ''} onChange={(e) => updateComponentField(selectedComponent.id, 'step', e.target.value ? parseFloat(e.target.value) : undefined)} className="w-full h-9 px-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono focus:outline-none" /></Field>
          </div>
        )}

        {(selectedComponent.type === 'select' || selectedComponent.type === 'radio') && (
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-dark-600 font-mono tracking-wider mb-2">Options</label>
            <div className="space-y-1.5">
              {selectedComponent.options?.map((opt: any, oIdx: number) => (
                <div key={oIdx} className="flex gap-1.5 items-center">
                  <input type="text" placeholder="Value" value={opt.value} onChange={(e) => {
                    const opts = [...(selectedComponent.options || [])]
                    opts[oIdx] = { ...opt, value: e.target.value }
                    updateComponentField(selectedComponent.id, 'options', opts)
                  }} className="w-20 h-8 px-2 bg-white border border-neutral-200 rounded text-[10px] font-mono" />
                  <input type="text" placeholder="Label" value={opt.label} onChange={(e) => {
                    const opts = [...(selectedComponent.options || [])]
                    opts[oIdx] = { ...opt, label: e.target.value }
                    updateComponentField(selectedComponent.id, 'options', opts)
                  }} className="flex-1 h-8 px-2 bg-white border border-neutral-200 rounded text-[10px]" />
                  <button onClick={() => {
                    const opts = selectedComponent.options?.filter((_: any, i: number) => i !== oIdx)
                    updateComponentField(selectedComponent.id, 'options', opts)
                  }} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button onClick={() => {
                const nextVal = String((selectedComponent.options?.length || 0) + 1)
                const opts = [...(selectedComponent.options || []), { value: nextVal, label: `Option ${nextVal}` }]
                updateComponentField(selectedComponent.id, 'options', opts)
              }} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-1 font-mono">
                <Plus className="w-3 h-3" /> Add Option
              </button>
            </div>
          </div>
        )}

        <TypographySettings
          value={selectedComponent.labelTypography}
          onChange={(val) => updateComponentField(selectedComponent.id, 'labelTypography', val)}
          title="Input Label Typography"
        />

        {selectedComponent.helpText && (
          <TypographySettings
            value={selectedComponent.helpTextTypography}
            onChange={(val) => updateComponentField(selectedComponent.id, 'helpTextTypography', val)}
            title="Help Text Typography"
          />
        )}

        {selectedComponent.type !== 'header' && selectedComponent.type !== 'text' && selectedComponent.type !== 'row' && selectedComponent.type !== 'column' && (
          <div className="border-t border-neutral-200 pt-4 mt-2">
            <h5 className="text-[11px] font-extrabold text-indigo-750 font-mono uppercase tracking-wider mb-2 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" /> Calculated Value (Optional)
            </h5>
            <Field
              label="Calculation Formula"
              hint="Enter a formula to calculate this input's value dynamically (e.g. x + y). Leave blank for manual entry."
            >
              <textarea
                value={selectedComponent.calculationFormula || ''}
                onChange={(e) => updateComponentField(selectedComponent.id, 'calculationFormula', e.target.value)}
                rows={2}
                className={`w-full p-2 bg-neutral-900 border rounded-lg font-mono text-xs font-bold focus:outline-none focus:border-indigo-500 ${
                  componentFormulaValidation.isValid ? 'text-emerald-300 border-neutral-850' : 'text-rose-300 border-rose-500/80 focus:border-rose-500'
                }`}
                placeholder="e.g. x + y"
              />
            </Field>

            <div className="space-y-2 mt-1">
              {!componentFormulaValidation.isValid && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[10px] text-rose-600 font-mono flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold">Syntax/Circular Error:</span> {componentFormulaValidation.error}
                  </div>
                </div>
              )}
              {componentFormulaValidation.isValid && selectedComponent.calculationFormula && selectedComponent.calculationFormula.trim() && (
                <div className="p-2.5 bg-indigo-50/60 border border-indigo-100 rounded-xl text-[10px] text-indigo-700 font-mono flex justify-between items-center">
                  <span>Sample Value:</span>
                  <span className="font-bold text-xs bg-white px-2 py-0.5 rounded border border-indigo-100 shadow-sm text-indigo-650 shrink-0">
                    {componentFormulaPreview !== null ? componentFormulaPreview : '0'}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Insertion panel for component calculation formulas */}
            <InsertionPanel
              availableVariables={availableVariables.filter((v: any) => v.name !== selectedComponent.name)}
              formulaFunctions={formulaFunctions}
              formulaConstants={formulaConstants}
              onInsert={insertIntoComponentFormula}
            />
          </div>
        )}

        {selectedComponent.type !== 'header' && selectedComponent.type !== 'text' && selectedComponent.type !== 'row' && selectedComponent.type !== 'column' && (
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100 mt-2">
            <div>
              <span className="block text-xs font-bold text-dark-800">Read Only</span>
              <span className="block text-[10px] text-neutral-500">Prevent user input or changes to this field.</span>
            </div>
            <button
              type="button"
              onClick={() => updateComponentField(selectedComponent.id, 'readOnly', !selectedComponent.readOnly)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                selectedComponent.readOnly ? 'bg-indigo-600' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  selectedComponent.readOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        )}

        <button onClick={() => deleteComponent(selectedComponent.id)} className="w-full mt-4 px-3 h-9 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95">
          <Trash className="w-3.5 h-3.5" /> Delete Component
        </button>
      </div>
    )
  }

  if (selectedFormula) {
    return (
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold text-yellow-700 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5" /> Edit Formula
        </h4>

        <Field label="Output Label">
          <input
            type="text"
            value={selectedFormula.label}
            onChange={(e) => updateFormulaField(selectedFormula.id, 'label', e.target.value)}
            className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-dark-800 focus:outline-none focus:border-indigo-500"
          />
        </Field>

        <Field label="Expression" hint="Click a variable or function below to insert it.">
          <textarea
            value={selectedFormula.formula}
            onChange={(e) => updateFormulaField(selectedFormula.id, 'formula', e.target.value)}
            rows={3}
            className={`w-full p-2.5 bg-neutral-900 border rounded-lg font-mono text-xs font-bold focus:outline-none focus:border-indigo-500 ${
              validation.isValid ? 'text-emerald-300 border-neutral-800' : 'text-rose-300 border-rose-500/80 focus:border-rose-500'
            }`}
            placeholder="e.g. x + y"
          />
        </Field>

        {/* Real-time Validation & Evaluation Preview */}
        <div className="space-y-2 mt-1">
          {!validation.isValid && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[10px] text-rose-600 font-mono flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Syntax Error:</span> {validation.error}
              </div>
            </div>
          )}
          {validation.isValid && selectedFormula.formula.trim() && (
            <div className="p-2.5 bg-indigo-50/60 border border-indigo-100 rounded-xl text-[10px] text-indigo-700 font-mono flex justify-between items-center">
              <span>Sample Output (using defaults):</span>
              <span className="font-bold text-xs bg-white px-2 py-0.5 rounded border border-indigo-100 shadow-sm text-indigo-650 shrink-0">
                {selectedFormula.prefix || ''}
                {previewValue !== null ? previewValue.toFixed(selectedFormula.decimalPlaces) : '0'}
                {selectedFormula.suffix || ''}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <Field label="Prefix"><input type="text" value={selectedFormula.prefix || ''} onChange={(e) => updateFormulaField(selectedFormula.id, 'prefix', e.target.value)} className="w-full h-9 px-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono" placeholder="$" /></Field>
          <Field label="Suffix"><input type="text" value={selectedFormula.suffix || ''} onChange={(e) => updateFormulaField(selectedFormula.id, 'suffix', e.target.value)} className="w-full h-9 px-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono" placeholder="%" /></Field>
          <Field label="Decimals"><input type="number" min={0} max={10} value={selectedFormula.decimalPlaces} onChange={(e) => updateFormulaField(selectedFormula.id, 'decimalPlaces', parseInt(e.target.value) || 0)} className="w-full h-9 px-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono" /></Field>
        </div>

        <TypographySettings
          value={selectedFormula.labelTypography}
          onChange={(val) => updateFormulaField(selectedFormula.id, 'labelTypography', val)}
        />

        <button onClick={() => deleteFormula(selectedFormula.id)} className="w-full px-3 h-9 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95">
          <Trash className="w-3.5 h-3.5" /> Delete Formula
        </button>

        <InsertionPanel
          availableVariables={availableVariables}
          formulaFunctions={formulaFunctions}
          formulaConstants={formulaConstants}
          onInsert={insertIntoFormula}
        />
      </div>
    )
  }

  return (
    <div className="text-center py-16 text-dark-400">
      <Calculator className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
      <p className="text-sm font-bold text-dark-600">Nothing selected</p>
      <p className="text-[10px] text-dark-500 mt-1 max-w-[220px] mx-auto">Click a field on the canvas or a formula below it to edit its properties.</p>
    </div>
  )
}

// =====================================================================
// SETTINGS INSPECTOR
// =====================================================================
function SettingsInspector({ calculator, updateCalculator, handleLogoUpload, addFormula, updateFormulaField, deleteFormula, availableVariables, selectedFormula, insertIntoFormula }: any) {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h4 className="text-xs font-extrabold text-indigo-600 font-mono uppercase tracking-wider">Global Settings</h4>

        <Field label="Description">
          <textarea
            value={calculator.description}
            onChange={(e) => updateCalculator({ ...calculator, description: e.target.value })}
            rows={2}
            className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg text-xs text-dark-800 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </Field>
        <TypographySettings
          value={calculator.descriptionTypography}
          onChange={(val) => updateCalculator({ ...calculator, descriptionTypography: val })}
          title="Global Description Typography"
        />

        <Field label="Brand Label" hint="e.g. HOME OF CALCULATORS">
          <input
            type="text"
            value={calculator.brandName || ''}
            onChange={(e) => updateCalculator({ ...calculator, brandName: e.target.value })}
            className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-dark-800 focus:outline-none"
          />
        </Field>
        <TypographySettings
          value={calculator.brandTypography}
          onChange={(val) => updateCalculator({ ...calculator, brandTypography: val })}
          title="Global Brand Label Typography"
        />

        <Field label="Logo">
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-dark-700 cursor-pointer">
              <Image className="w-3.5 h-3.5" /> Choose Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            {calculator.logo && (
              <button onClick={() => updateCalculator({ ...calculator, logo: undefined })} className="p-2 border border-red-200 bg-red-50 text-red-500 rounded-lg" title="Remove logo">
                <Trash className="w-4 h-4" />
              </button>
            )}
          </div>
          {calculator.logo && (
            <div className="mt-2 p-2 border border-neutral-100 rounded bg-neutral-50 flex justify-center">
              <img src={calculator.logo} alt="Preview" className="max-h-8 object-contain" />
            </div>
          )}
        </Field>

        <Field label="Layout" hint="How inputs are arranged in the output.">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateCalculator({ ...calculator, layout: 'stacked' })}
              className={`py-2 px-3 text-[10px] font-mono font-bold border-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                calculator.layout === 'stacked' || !calculator.layout
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-neutral-200 text-dark-500'
              }`}
            >
              <ArrowDownToLine className="w-3.5 h-3.5" /> Stacked
            </button>
            <button
              onClick={() => updateCalculator({ ...calculator, layout: 'grid' })}
              className={`py-2 px-3 text-[10px] font-mono font-bold border-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                calculator.layout === 'grid' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-neutral-200 text-dark-500'
              }`}
            >
              <Grid2x2 className="w-3.5 h-3.5" /> 2-Column
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100 mt-2">
          <div>
            <span className="block text-xs font-bold text-dark-800">Require Equal Button</span>
            <span className="block text-[10px] text-neutral-500">Calculate results only when "Calculate" is clicked.</span>
          </div>
          <button
            type="button"
            onClick={() => updateCalculator({ ...calculator, requireSubmit: !calculator.requireSubmit })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              calculator.requireSubmit ? 'bg-indigo-600' : 'bg-neutral-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                calculator.requireSubmit ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100 mt-2">
          <div>
            <span className="block text-xs font-bold text-dark-800">Enable CSV Export</span>
            <span className="block text-[10px] text-neutral-500">Allow users to export input/output data as CSV.</span>
          </div>
          <button
            type="button"
            onClick={() => updateCalculator({ ...calculator, enableCSVExport: !calculator.enableCSVExport })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              calculator.enableCSVExport ? 'bg-indigo-600' : 'bg-neutral-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                calculator.enableCSVExport ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100 mt-2">
          <div>
            <span className="block text-xs font-bold text-dark-800">Enable PDF Export</span>
            <span className="block text-[10px] text-neutral-500">Allow users to print or save a PDF report.</span>
          </div>
          <button
            type="button"
            onClick={() => updateCalculator({ ...calculator, enablePDFExport: !calculator.enablePDFExport })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              calculator.enablePDFExport ? 'bg-indigo-600' : 'bg-neutral-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                calculator.enablePDFExport ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <TypographySettings
          value={calculator.labelTypography}
          onChange={(val) => updateCalculator({ ...calculator, labelTypography: val })}
          title="Global Input Label Typography"
        />

        <TypographySettings
          value={calculator.helpTextTypography}
          onChange={(val) => updateCalculator({ ...calculator, helpTextTypography: val })}
          title="Global Help Text Typography"
        />

        <TypographySettings
          value={calculator.outputTypography}
          onChange={(val) => updateCalculator({ ...calculator, outputTypography: val })}
          title="Global Output/LCD Typography"
        />
      </section>

      <section className="space-y-3">
        <h4 className="text-xs font-extrabold text-indigo-600 font-mono uppercase tracking-wider">Theme</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(THEME_SWATCHES).map(([themeName, swatch]) => {
            const isSelected = calculator.theme === themeName
            return (
              <button
                key={themeName}
                type="button"
                onClick={() => updateCalculator({ ...calculator, theme: themeName as CustomThemeType })}
                className={`p-2 rounded-xl border-2 text-left transition-all relative ${
                  isSelected ? 'border-indigo-600 bg-indigo-50/20 shadow-sm' : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-dark-800 tracking-tight">{swatch.label}</span>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />}
                </div>
                {/* Visual Swatch */}
                <div className="h-5 rounded-md border border-neutral-200 overflow-hidden grid grid-cols-[1fr_8px]" style={{ backgroundColor: swatch.bg }}>
                  <div className="p-0.5 flex flex-col justify-between h-full">
                    {/* LCD bar */}
                    <div className="h-1 rounded-sm border" style={{ backgroundColor: swatch.lcd, borderColor: swatch.border }} />
                    {/* Sample Text */}
                    <div className="text-[5px] font-mono leading-none tracking-tight font-black" style={{ color: swatch.text }}>
                      12345
                    </div>
                  </div>
                  {/* Primary Color bar */}
                  <div className="h-full w-full" style={{ backgroundColor: swatch.primary }} />
                </div>
              </button>
            )
          })}
        </div>
        {calculator.theme === 'custom' && (
          <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3 space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-dark-600 font-mono">Custom Colors</span>
            <div className="grid grid-cols-2 gap-2">
              {(['primary', 'secondary', 'background', 'text'] as const).map((key) => (
                <div key={key}>
                  <label className="block text-[9px] font-bold text-neutral-500 mb-1 capitalize">{key}</label>
                  <input
                    type="color"
                    value={calculator.customColors?.[key] || (key === 'primary' ? '#3b82f6' : key === 'secondary' ? '#1d4ed8' : key === 'background' ? '#ffffff' : '#1a1a1f')}
                    onChange={(e) => {
                      const colors = { ...(calculator.customColors || { primary: '#3b82f6', secondary: '#1d4ed8', background: '#ffffff', text: '#1a1a1f' }) }
                      colors[key] = e.target.value
                      updateCalculator({ ...calculator, customColors: colors })
                    }}
                    className="w-full h-8 cursor-pointer rounded border border-neutral-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold text-indigo-600 font-mono uppercase tracking-wider">Formulas</h4>
          <button onClick={addFormula} className="text-[10px] font-bold font-mono text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> ADD
          </button>
        </div>
        {calculator.formulas.length === 0 ? (
          <p className="text-[10px] text-dark-400 font-mono leading-normal italic text-center py-4 bg-neutral-50 rounded-lg">
            No formulas yet. Add one to show calculation outputs.
          </p>
        ) : (
          <div className="space-y-2">
            {calculator.formulas.map((f: CustomFormulaConfig) => (
              <div key={f.id} className="bg-neutral-50 border border-neutral-100 rounded-lg p-2.5 relative">
                <button onClick={() => deleteFormula(f.id)} className="absolute top-1.5 right-1.5 text-dark-400 hover:text-red-500 p-1">
                  <X className="w-3 h-3" />
                </button>
                <div className="text-[10px] font-bold text-dark-700 mb-0.5">{f.label}</div>
                <div className="text-[10px] font-mono text-indigo-600 truncate">{f.formula}</div>
              </div>
            ))}
          </div>
        )}
        {availableVariables.length > 0 && (
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-2.5">
            <div className="text-[9px] font-bold text-indigo-800 uppercase mb-1.5">Available variables</div>
            <div className="flex flex-wrap gap-1">
              {availableVariables.map((v: any) => (
                <button
                  key={v.name}
                  onClick={() => insertIntoFormula(v.name)}
                  className="bg-white border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-indigo-700 transition-colors"
                  title={`Insert ${v.name}`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

// =====================================================================
// FORMULA INSERTION PANEL
// =====================================================================
function InsertionPanel({ availableVariables, formulaFunctions, formulaConstants, onInsert }: any) {
  const [tab, setTab] = useState<'vars' | 'funcs' | 'consts'>('vars')
  return (
    <div className="pt-3 border-t border-neutral-100">
      <div className="flex gap-1 mb-2 bg-neutral-100 rounded-lg p-1">
        <button onClick={() => setTab('vars')} className={`flex-1 py-1 text-[10px] font-bold rounded ${tab === 'vars' ? 'bg-white shadow-sm text-indigo-600' : 'text-dark-500'}`}>Variables</button>
        <button onClick={() => setTab('funcs')} className={`flex-1 py-1 text-[10px] font-bold rounded ${tab === 'funcs' ? 'bg-white shadow-sm text-indigo-600' : 'text-dark-500'}`}>Functions</button>
        <button onClick={() => setTab('consts')} className={`flex-1 py-1 text-[10px] font-bold rounded ${tab === 'consts' ? 'bg-white shadow-sm text-indigo-600' : 'text-dark-500'}`}>Constants</button>
      </div>
      <div className="max-h-40 overflow-y-auto space-y-1">
        {tab === 'vars' && availableVariables.length > 0 && availableVariables.map((v: any) => (
          <button key={v.name} onClick={() => onInsert(v.name)} className="w-full flex items-center justify-between p-2 bg-white border border-neutral-200 hover:border-indigo-300 hover:bg-indigo-50/30 rounded-lg text-left transition-colors group">
            <span className="text-[10px] font-mono font-bold text-indigo-700">{v.name}</span>
            <span className="text-[9px] text-dark-500 truncate ml-2 flex-1">{v.label}</span>
            <Plus className="w-3 h-3 text-dark-400 group-hover:text-indigo-600" />
          </button>
        ))}
        {tab === 'vars' && availableVariables.length === 0 && (
          <p className="text-[10px] text-dark-400 text-center py-3">Add input fields first to create variables</p>
        )}
        {tab === 'funcs' && formulaFunctions.map((f: any) => (
          <button key={f.name} onClick={() => onInsert(`${f.name}(`)} className="w-full flex items-center justify-between p-2 bg-white border border-neutral-200 hover:border-indigo-300 hover:bg-indigo-50/30 rounded-lg text-left transition-colors group">
            <span className="text-[10px] font-mono font-bold text-indigo-700">{f.signature}</span>
            <span className="text-[9px] text-dark-500 truncate ml-2 flex-1">{f.description}</span>
            <Plus className="w-3 h-3 text-dark-400 group-hover:text-indigo-600" />
          </button>
        ))}
        {tab === 'consts' && formulaConstants.map((c: any) => (
          <button key={c.name} onClick={() => onInsert(c.name)} className="w-full flex items-center justify-between p-2 bg-white border border-neutral-200 hover:border-indigo-300 hover:bg-indigo-50/30 rounded-lg text-left transition-colors group">
            <span className="text-[10px] font-mono font-bold text-indigo-700">{c.name} = {c.value}</span>
            <span className="text-[9px] text-dark-500 truncate ml-2 flex-1">{c.description}</span>
            <Plus className="w-3 h-3 text-dark-400 group-hover:text-indigo-600" />
          </button>
        ))}
      </div>
    </div>
  )
}

// =====================================================================
// FIELD WRAPPER
// =====================================================================
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-[10px] font-extrabold uppercase text-dark-600 font-mono tracking-wider mb-1">{label}</label>
      {children}
      {hint && <p className="text-[9px] text-dark-400 font-mono mt-1 leading-normal">{hint}</p>}
    </div>
  )
}
