'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Trash, ArrowUp, ArrowDown, Share2, Code, Eye, Save, 
  Settings, Sliders, Type, CheckSquare, Heading, List, HelpCircle, 
  X, Copy, Check, ChevronLeft, Layout, Sparkles, Image
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CustomCalculatorRenderer, { 
  CustomCalculatorConfig, CustomComponentConfig, CustomFormulaConfig, CustomThemeType 
} from '@/components/calculators/shared/CustomCalculatorRenderer'
import { serializeConfig } from '@/lib/url-serializer'

// Pre-defined template layouts
const DEFAULT_CALCULATOR: CustomCalculatorConfig = {
  id: '',
  name: 'My Custom Calculator',
  description: 'A custom calculated widget built using the visual editor.',
  brandName: 'MY_BRAND',
  theme: 'retro',
  layout: 'stacked',
  components: [
    {
      id: 'input-1',
      name: 'x',
      type: 'number',
      label: 'First Input Parameter',
      placeholder: 'Enter a value...',
      defaultValue: '10',
      unit: '',
      helpText: 'The first variable in your math formula'
    },
    {
      id: 'input-2',
      name: 'y',
      type: 'number',
      label: 'Second Input Parameter',
      placeholder: 'Enter another value...',
      defaultValue: '5',
      unit: '',
      helpText: 'The second variable in your math formula'
    }
  ],
  formulas: [
    {
      id: 'formula-1',
      label: 'Sum Total Result',
      formula: 'x + y',
      decimalPlaces: 2,
      prefix: '',
      suffix: 'units'
    }
  ]
}

export default function BuilderPage() {
  const [calculator, setCalculator] = useState<CustomCalculatorConfig>(DEFAULT_CALCULATOR)
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'components' | 'styles'>('components')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const [embedWidth, setEmbedWidth] = useState('100%')
  const [embedHeight, setEmbedHeight] = useState('450')

  // Generate serialized URLs
  const configHash = typeof window !== 'undefined' ? serializeConfig(calculator) : ''
  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/calculators/custom#config=${configHash}` : ''
  const embedCode = typeof window !== 'undefined' ? `<iframe src="${window.location.origin}/embed#config=${configHash}" width="${embedWidth}" height="${embedHeight}" style="border:none; border-radius:16px; overflow:hidden;" title="${calculator.name}"></iframe>` : ''

  // Load calculator from draft or template if any
  useEffect(() => {
    const draft = localStorage.getItem('calc_craft_builder_draft')
    if (draft) {
      try {
        setCalculator(JSON.parse(draft))
      } catch (e) {
        console.warn('Failed to parse builder draft')
      }
    }
  }, [])

  // Auto-save draft to localStorage
  const updateCalculator = (newCalc: CustomCalculatorConfig) => {
    setCalculator(newCalc)
    localStorage.setItem('calc_craft_builder_draft', JSON.stringify(newCalc))
  }

  // --- CANVAS COMPONENT LOGIC ---
  const addComponent = (type: CustomComponentConfig['type']) => {
    const nextNum = calculator.components.length + 1
    const names = calculator.components.map((c) => c.name)
    let varName = `var_${nextNum}`
    while (names.includes(varName)) {
      varName = `var_${Math.floor(Math.random() * 1000)}`
    }

    const newComponent: CustomComponentConfig = {
      id: `comp-${Date.now()}`,
      name: varName,
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Block`,
      defaultValue: type === 'checkbox' ? 'false' : type === 'select' ? '' : '0',
    }

    if (type === 'select') {
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

    const updated = {
      ...calculator,
      components: [...calculator.components, newComponent]
    }
    updateCalculator(updated)
    setSelectedComponentId(newComponent.id)
  }

  const deleteComponent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedComps = calculator.components.filter((c) => c.id !== id)
    const updated = { ...calculator, components: updatedComps }
    updateCalculator(updated)
    if (selectedComponentId === id) setSelectedComponentId(null)
  }

  const moveComponent = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedComps = [...calculator.components]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    
    if (targetIdx < 0 || targetIdx >= updatedComps.length) return
    
    // Swap
    const temp = updatedComps[index]
    updatedComps[index] = updatedComps[targetIdx]
    updatedComps[targetIdx] = temp

    updateCalculator({ ...calculator, components: updatedComps })
  }

  const updateComponentField = (id: string, field: keyof CustomComponentConfig, value: any) => {
    const updatedComps = calculator.components.map((c) => {
      if (c.id === id) {
        return { ...c, [field]: value }
      }
      return c
    })
    updateCalculator({ ...calculator, components: updatedComps })
  }

  // --- FORMULA LOGIC ---
  const addFormula = () => {
    const newFormula: CustomFormulaConfig = {
      id: `formula-${Date.now()}`,
      label: 'Calculated Metric',
      formula: 'x',
      decimalPlaces: 2
    }
    const updated = {
      ...calculator,
      formulas: [...calculator.formulas, newFormula]
    }
    updateCalculator(updated)
  }

  const deleteFormula = (id: string) => {
    const updatedFormulas = calculator.formulas.filter((f) => f.id !== id)
    const updated = { ...calculator, formulas: updatedFormulas }
    updateCalculator(updated)
  }

  const updateFormulaField = (id: string, field: keyof CustomFormulaConfig, value: any) => {
    const updatedFormulas = calculator.formulas.map((f) => {
      if (f.id === id) {
        return { ...f, [field]: value }
      }
      return f
    })
    updateCalculator({ ...calculator, formulas: updatedFormulas })
  }

  // --- LOGO CONVERSION ---
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

  // --- SAVE TO DASHBOARD ---
  const handleSaveToDashboard = () => {
    try {
      const savedListRaw = localStorage.getItem('my_custom_calculators')
      const savedList: CustomCalculatorConfig[] = savedListRaw ? JSON.parse(savedListRaw) : []
      
      const newCalc = {
        ...calculator,
        id: calculator.id || `custom-${Date.now()}`,
      }

      // Check if duplicate ID
      const index = savedList.findIndex((item) => item.id === newCalc.id)
      if (index !== -1) {
        savedList[index] = newCalc
      } else {
        savedList.push(newCalc)
      }

      localStorage.setItem('my_custom_calculators', JSON.stringify(savedList))
      localStorage.removeItem('calc_craft_builder_draft')
      
      // Redirect
      alert('Calculator saved successfully to your My Calculators directory!')
      window.location.href = '/calculators'
    } catch (e) {
      console.error('Failed to save calculator:', e)
      alert('Error saving custom calculator')
    }
  }

  const selectedComponent = calculator.components.find((c) => c.id === selectedComponentId)

  // Variables list cheat-sheet helper
  const availableVariables = calculator.components
    .filter((c) => c.type !== 'header' && c.type !== 'text')
    .map((c) => c.name)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 sm:pt-24 bg-gray-50 flex flex-col">
        {/* Editor Toolbar Header */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex flex-wrap gap-3 sm:gap-4 items-center justify-between shadow-sm sticky top-14 z-40">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Link
              href="/calculators"
              className="p-2 hover:bg-gray-100 rounded-full text-dark-600 transition-colors shrink-0"
              title="Return to Directory"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={calculator.name}
                  onChange={(e) => updateCalculator({ ...calculator, name: e.target.value })}
                  className="text-base sm:text-lg font-bold text-dark-800 focus:outline-none focus:border-b focus:border-indigo-500 bg-transparent px-1 py-0.5 rounded w-full min-w-0"
                  placeholder="Calculator Name"
                />
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse-slow shrink-0 hidden sm:block" />
              </div>
              <p className="text-[10px] sm:text-xs text-dark-400 font-mono truncate">WordPress-style Page Builder</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={() => setPreviewOpen(true)}
              className="px-2.5 sm:px-4 py-2 text-[10px] sm:text-xs font-mono font-black text-dark-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center gap-1 sm:gap-1.5 active:scale-95 transition-all select-none"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">LIVE PREVIEW</span>
              <span className="xs:hidden sm:hidden">PREVIEW</span>
            </button>
            <button
              onClick={() => setShareModalOpen(true)}
              className="px-2.5 sm:px-4 py-2 text-[10px] sm:text-xs font-mono font-black text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 flex items-center gap-1 sm:gap-1.5 active:scale-95 transition-all select-none"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">SHARE & EMBED</span>
              <span className="xs:hidden sm:hidden">SHARE</span>
            </button>
            <button
              onClick={handleSaveToDashboard}
              className="px-3 sm:px-5 py-2 text-[10px] sm:text-xs font-mono font-black text-white bg-[#222326] rounded-lg border-t border-[#4a4b4f] shadow-[0_3.5px_0_#0a0b0d] hover:bg-[#2b2c30] hover:translate-y-[0.5px] hover:shadow-[0_3px_0_#0a0b0d] active:translate-y-[3.5px] active:shadow-[0_0px_0_#0a0b0d] transition-all duration-75 select-none flex items-center gap-1 sm:gap-1.5"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>SAVE</span>
            </button>
          </div>
        </div>

        {/* Builder Body Workspace */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[260px_1fr_360px] h-auto lg:h-[calc(100vh-144px)] overflow-y-auto lg:overflow-hidden gap-3 md:gap-4">
          
          {/* LEFT SIDEBAR: Add Elements Toolbox */}
          <div className="bg-white border-b lg:border-b-0 lg:border-r border-gray-200 p-4 sm:p-5 lg:overflow-y-auto space-y-5 sm:space-y-6 h-auto lg:h-full">
            <div>
              <h3 className="text-xs font-bold text-dark-800 uppercase tracking-widest font-mono mb-4 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-indigo-500" />
                Add Controls
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                <button
                  onClick={() => addComponent('number')}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 text-left text-xs font-semibold text-dark-700 hover:text-indigo-600 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <Type className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Number Input</div>
                    <div className="text-[10px] text-dark-400 font-normal">Fields for numeric values</div>
                  </div>
                </button>

                <button
                  onClick={() => addComponent('slider')}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 text-left text-xs font-semibold text-dark-700 hover:text-indigo-600 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Range Slider</div>
                    <div className="text-[10px] text-dark-400 font-normal hidden sm:block">Horizontal range track</div>
                  </div>
                </button>

                <button
                  onClick={() => addComponent('select')}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 text-left text-xs font-semibold text-dark-700 hover:text-indigo-600 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <List className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Select Dropdown</div>
                    <div className="text-[10px] text-dark-400 font-normal hidden sm:block">Choose from list menu</div>
                  </div>
                </button>

                <button
                  onClick={() => addComponent('checkbox')}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 text-left text-xs font-semibold text-dark-700 hover:text-indigo-600 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Switch Checkbox</div>
                    <div className="text-[10px] text-dark-400 font-normal hidden sm:block">Yes/No checkbox option</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-dark-800 uppercase tracking-widest font-mono mb-4 flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-indigo-500" />
                Layout Blocks
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                <button
                  onClick={() => addComponent('header')}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 text-left text-xs font-semibold text-dark-700 hover:text-indigo-600 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <Heading className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Section Header</div>
                    <div className="text-[10px] text-dark-400 font-normal">Dividing title banner</div>
                  </div>
                </button>

                <button
                  onClick={() => addComponent('text')}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 text-left text-xs font-semibold text-dark-700 hover:text-indigo-600 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <Type className="w-4 h-4 text-xs font-normal" />
                  </div>
                  <div>
                    <div>Paragraph Text</div>
                    <div className="text-[10px] text-dark-400 font-normal">Helpful instructions text</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* CENTER CANVAS: Visual Blueprint Layout */}
          <div className="p-4 sm:p-6 md:p-8 lg:overflow-y-auto flex justify-center items-start bg-gray-50 h-auto lg:h-full">
            <div className="w-full max-w-xl bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 sm:p-6 min-h-[350px] shadow-sm space-y-4">
              <div className="text-center pb-4 border-b border-gray-100">
                <span className="text-[9px] uppercase tracking-widest font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">
                  Blueprint Canvas
                </span>
                <h2 className="text-base font-bold text-dark-800 mt-2">{calculator.name || 'My Custom Calculator'}</h2>
                <p className="text-xs text-dark-400 mt-0.5">{calculator.description || 'Custom Description...'}</p>
              </div>

              {calculator.components.length === 0 ? (
                <div className="text-center py-16 text-dark-400">
                  <Layout className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold">Canvas is Empty</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-[240px] mx-auto">Click any elements in the left panel to populate inputs on your calculator canvas.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {calculator.components.map((c, idx) => {
                    const isSelected = selectedComponentId === c.id

                    return (
                      <div
                        key={c.id}
                        onClick={() => { setSelectedComponentId(c.id); setActiveTab('components') }}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative group ${
                          isSelected 
                            ? 'border-indigo-500 bg-indigo-50/10 shadow-sm' 
                            : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        {/* Blueprint Component Label */}
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[8px] font-mono uppercase bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded mr-2 font-bold">
                              {c.type}
                            </span>
                            <span className="text-xs font-bold text-dark-700">{c.label}</span>
                          </div>

                          {/* Controls (arrows, trash) */}
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => moveComponent(idx, 'up', e)}
                              disabled={idx === 0}
                              className="p-1 hover:bg-gray-100 text-dark-500 rounded disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => moveComponent(idx, 'down', e)}
                              disabled={idx === calculator.components.length - 1}
                              className="p-1 hover:bg-gray-100 text-dark-500 rounded disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => deleteComponent(c.id, e)}
                              className="p-1 hover:bg-red-50 text-red-500 rounded"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Rendering placeholder UI */}
                        {c.type === 'number' && (
                          <div className="relative border border-gray-200 bg-gray-50 h-9 px-3 rounded-lg flex items-center justify-between text-xs text-gray-400 font-mono">
                            <span>{c.placeholder || 'Placeholder text...'}</span>
                            {c.unit && <span className="font-bold opacity-80">{c.unit}</span>}
                          </div>
                        )}

                        {c.type === 'slider' && (
                          <div className="space-y-1.5 py-1">
                            <div className="flex justify-between text-[10px] font-mono text-gray-400">
                              <span>Range: {c.min} - {c.max}</span>
                              <span>Default: {c.defaultValue} {c.unit}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full" />
                          </div>
                        )}

                        {c.type === 'select' && (
                          <div className="border border-gray-200 bg-gray-50 h-9 px-3 rounded-lg flex items-center justify-between text-xs text-gray-400 font-mono">
                            <span>Default: {c.defaultValue || 'None'}</span>
                            <span className="text-[10px] font-normal opacity-70">({c.options?.length || 0} Options)</span>
                          </div>
                        )}

                        {c.type === 'checkbox' && (
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                            <div className="w-4 h-4 border border-gray-300 rounded bg-gray-50" />
                            <span>{c.placeholder || 'Yes/No Checkbox'}</span>
                          </div>
                        )}

                        {c.type === 'header' && (
                          <div className="border-b border-gray-200 pb-1 text-xs font-mono font-bold text-gray-500 uppercase">
                            --- {c.label || 'Section Title'} ---
                          </div>
                        )}

                        {c.type === 'text' && (
                          <p className="text-[10px] text-gray-400 font-mono leading-relaxed truncate">
                            {c.label || 'Explanatory text block...'}
                          </p>
                        )}

                        {/* Display Variable Handle Name */}
                        {c.type !== 'header' && c.type !== 'text' && (
                          <div className="text-[8px] font-mono text-dark-400 mt-2 text-right">
                            variable identifier: <span className="font-black text-indigo-500 bg-indigo-50 px-1 rounded">{c.name}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Dynamic Formulas Area */}
              {calculator.formulas.length > 0 && (
                <div className="mt-8 pt-5 border-t border-gray-200 space-y-3">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                    Formula Outputs
                  </span>
                  {calculator.formulas.map((f) => (
                    <div 
                      key={f.id}
                      className="p-3 bg-gray-900 text-yellow-400 rounded-xl font-mono text-xs border border-gray-800 shadow-inner flex justify-between items-center"
                    >
                      <div>
                        <div className="font-bold text-gray-400 text-[10px] uppercase">{f.label}</div>
                        <div className="text-sm font-black mt-0.5 text-white">
                          {f.prefix || ''}[Result]{f.suffix || ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-gray-500">formula</div>
                        <div className="text-yellow-400 font-bold bg-yellow-400/10 px-1.5 py-0.5 rounded mt-0.5">{f.formula}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR: Inspectors (Edit component details OR global/formulas) */}
          <div className="bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col h-auto lg:h-full lg:overflow-hidden font-sans">
            {/* Sidebar Tabs */}
            <div className="grid grid-cols-2 border-b border-gray-200 sticky top-0 bg-white z-10">
              <button
                onClick={() => setActiveTab('components')}
                className={`py-3 text-[10px] sm:text-xs font-mono font-bold border-b-2 transition-all ${
                  activeTab === 'components'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-dark-500 hover:text-dark-700'
                }`}
              >
                <span className="sm:hidden">INSPECTOR</span>
                <span className="hidden sm:inline">ELEMENT INSPECTOR</span>
              </button>
              <button
                onClick={() => setActiveTab('styles')}
                className={`py-3 text-[10px] sm:text-xs font-mono font-bold border-b-2 transition-all ${
                  activeTab === 'styles'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-dark-500 hover:text-dark-700'
                }`}
              >
                <span className="sm:hidden">SETTINGS</span>
                <span className="hidden sm:inline">SETTINGS & FORMULAS</span>
              </button>
            </div>

            {/* Inspector Panels Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 sm:space-y-6">
              
              {/* ELEMENT TAB */}
              {activeTab === 'components' && (
                <div className="space-y-5">
                  {!selectedComponent ? (
                    <div className="text-center py-20 text-dark-400">
                      <Settings className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold">No Component Selected</p>
                      <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] mx-auto">Click any input card on the center canvas blueprint to edit its properties.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-indigo-600 font-mono uppercase tracking-wider mb-3">
                          Edit Component Details
                        </h4>
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-[10px] font-mono text-dark-600 space-y-1 mb-4">
                          <div>Type: <span className="font-bold uppercase text-dark-800">{selectedComponent.type}</span></div>
                          <div>ID: <span>{selectedComponent.id}</span></div>
                        </div>
                      </div>

                      {/* Component Label */}
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase text-dark-600 font-mono tracking-wider mb-1">
                          Display Label
                        </label>
                        <input
                          type="text"
                          value={selectedComponent.label}
                          onChange={(e) => updateComponentField(selectedComponent.id, 'label', e.target.value)}
                          className="w-full h-9 px-3 bg-white border border-gray-200 rounded-lg text-xs font-medium text-dark-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Variable Name Handle (Only for non-layout elements) */}
                      {selectedComponent.type !== 'header' && selectedComponent.type !== 'text' && (
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase text-dark-600 font-mono tracking-wider mb-1">
                            Variable Identifier
                          </label>
                          <input
                            type="text"
                            value={selectedComponent.name}
                            onChange={(e) => {
                              // Replace spaces and special characters for a safe variable string
                              const safeVal = e.target.value.replace(/[^a-zA-Z0-9_]/g, '')
                              updateComponentField(selectedComponent.id, 'name', safeVal)
                            }}
                            className="w-full h-9 px-3 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-indigo-600 focus:outline-none focus:border-indigo-500"
                          />
                          <p className="text-[9px] text-dark-400 font-mono mt-1 leading-normal">
                            Must be a unique keyword (e.g. `x`, `width`). Use this keyword inside math formulas.
                          </p>
                        </div>
                      )}

                      {/* Input Placeholder / Help Text */}
                      {selectedComponent.type !== 'header' && selectedComponent.type !== 'text' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-extrabold uppercase text-dark-600 font-mono tracking-wider mb-1">
                              Help Text Suffix
                            </label>
                            <input
                              type="text"
                              value={selectedComponent.helpText || ''}
                              onChange={(e) => updateComponentField(selectedComponent.id, 'helpText', e.target.value)}
                              className="w-full h-9 px-3 bg-white border border-gray-200 rounded-lg text-xs text-dark-800 focus:outline-none focus:border-indigo-500"
                              placeholder="e.g. For height in centimeters"
                            />
                          </div>

                          {selectedComponent.type !== 'checkbox' && (
                            <div>
                              <label className="block text-[10px] font-extrabold uppercase text-dark-600 font-mono tracking-wider mb-1">
                                Unit Suffix Label
                              </label>
                              <input
                                type="text"
                                value={selectedComponent.unit || ''}
                                onChange={(e) => updateComponentField(selectedComponent.id, 'unit', e.target.value)}
                                className="w-full h-9 px-3 bg-white border border-gray-200 rounded-lg text-xs font-mono text-dark-800 focus:outline-none focus:border-indigo-500"
                                placeholder="e.g. kg, $, %, yr"
                              />
                            </div>
                          )}
                        </>
                      )}

                      {/* Default Value */}
                      {selectedComponent.type !== 'header' && selectedComponent.type !== 'text' && (
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase text-dark-600 font-mono tracking-wider mb-1">
                            Default Value
                          </label>
                          {selectedComponent.type === 'checkbox' ? (
                            <select
                              value={String(selectedComponent.defaultValue)}
                              onChange={(e) => updateComponentField(selectedComponent.id, 'defaultValue', e.target.value === 'true')}
                              className="w-full h-9 px-3 bg-white border border-gray-200 rounded-lg text-xs text-dark-800 focus:outline-none focus:border-indigo-500"
                            >
                              <option value="false">Unchecked (False)</option>
                              <option value="true">Checked (True)</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={String(selectedComponent.defaultValue ?? '')}
                              onChange={(e) => updateComponentField(selectedComponent.id, 'defaultValue', e.target.value)}
                              className="w-full h-9 px-3 bg-white border border-gray-200 rounded-lg text-xs text-dark-800 focus:outline-none focus:border-indigo-500"
                              placeholder="e.g. 10"
                            />
                          )}
                        </div>
                      )}

                      {/* Min, Max, Step (Only for range slider / number) */}
                      {(selectedComponent.type === 'number' || selectedComponent.type === 'slider') && (
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[9px] font-extrabold uppercase text-dark-600 font-mono mb-1">Min</label>
                            <input
                              type="number"
                              value={selectedComponent.min ?? ''}
                              onChange={(e) => updateComponentField(selectedComponent.id, 'min', e.target.value ? parseFloat(e.target.value) : undefined)}
                              className="w-full h-9 px-2 bg-white border border-gray-200 rounded-lg text-xs font-mono text-dark-800 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold uppercase text-dark-600 font-mono mb-1">Max</label>
                            <input
                              type="number"
                              value={selectedComponent.max ?? ''}
                              onChange={(e) => updateComponentField(selectedComponent.id, 'max', e.target.value ? parseFloat(e.target.value) : undefined)}
                              className="w-full h-9 px-2 bg-white border border-gray-200 rounded-lg text-xs font-mono text-dark-800 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold uppercase text-dark-600 font-mono mb-1">Step</label>
                            <input
                              type="number"
                              value={selectedComponent.step ?? ''}
                              onChange={(e) => updateComponentField(selectedComponent.id, 'step', e.target.value ? parseFloat(e.target.value) : undefined)}
                              className="w-full h-9 px-2 bg-white border border-gray-200 rounded-lg text-xs font-mono text-dark-800 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* Dropdown Options (Only for select) */}
                      {selectedComponent.type === 'select' && (
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase text-dark-600 font-mono tracking-wider mb-2">
                            Select Dropdown Options
                          </label>
                          <div className="space-y-2">
                            {selectedComponent.options?.map((opt, oIdx) => (
                              <div key={oIdx} className="flex gap-1.5 items-center">
                                <input
                                  type="text"
                                  placeholder="Value (Numeric)"
                                  value={opt.value}
                                  onChange={(e) => {
                                    const opts = [...(selectedComponent.options || [])]
                                    opts[oIdx] = { ...opt, value: e.target.value }
                                    updateComponentField(selectedComponent.id, 'options', opts)
                                  }}
                                  className="w-20 h-8 px-2 bg-white border border-gray-200 rounded text-[10px] font-mono"
                                />
                                <input
                                  type="text"
                                  placeholder="Option Label"
                                  value={opt.label}
                                  onChange={(e) => {
                                    const opts = [...(selectedComponent.options || [])]
                                    opts[oIdx] = { ...opt, label: e.target.value }
                                    updateComponentField(selectedComponent.id, 'options', opts)
                                  }}
                                  className="flex-1 h-8 px-2 bg-white border border-gray-200 rounded text-[10px]"
                                />
                                <button
                                  onClick={() => {
                                    const opts = selectedComponent.options?.filter((_, i) => i !== oIdx)
                                    updateComponentField(selectedComponent.id, 'options', opts)
                                  }}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const nextVal = String((selectedComponent.options?.length || 0) + 1)
                                const opts = [...(selectedComponent.options || []), { value: nextVal, label: `Option ${nextVal}` }]
                                updateComponentField(selectedComponent.id, 'options', opts)
                              }}
                              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-1 font-mono"
                            >
                              <Plus className="w-3 h-3" />
                              Add Option
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'styles' && (
                <div className="space-y-6">
                  {/* General Configuration */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold text-indigo-600 font-mono uppercase tracking-wider">
                      Global Configuration
                    </h4>

                    {/* Calculator Subtitle */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-dark-600 font-mono tracking-wider mb-1">
                        Calculator Subtitle
                      </label>
                      <textarea
                        value={calculator.description}
                        onChange={(e) => updateCalculator({ ...calculator, description: e.target.value })}
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg text-xs text-dark-800 focus:outline-none focus:border-indigo-500 h-16 resize-none"
                        placeholder="Description text..."
                      />
                    </div>

                    {/* Brand Identifier */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-dark-600 font-mono tracking-wider mb-1">
                        Brand Label Text
                      </label>
                      <input
                        type="text"
                        value={calculator.brandName || ''}
                        onChange={(e) => updateCalculator({ ...calculator, brandName: e.target.value })}
                        className="w-full h-9 px-3 bg-white border border-gray-200 rounded-lg text-xs font-bold text-dark-800 focus:outline-none"
                        placeholder="e.g. CALC_CRAFT"
                      />
                    </div>

                    {/* Logo upload (Base64 conversion) */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-dark-600 font-mono tracking-wider mb-1">
                        White-Label Logo Image
                      </label>
                      <div className="flex gap-2 items-center">
                        <label className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-gray-100 border border-gray-200 hover:bg-gray-200 rounded-lg text-xs font-semibold text-dark-700 cursor-pointer select-none transition-colors">
                          <Image className="w-3.5 h-3.5" />
                          Choose Logo File
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden" 
                          />
                        </label>
                        {calculator.logo && (
                          <button
                            onClick={() => updateCalculator({ ...calculator, logo: undefined })}
                            className="p-2 border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg"
                            title="Remove logo"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {calculator.logo && (
                        <div className="mt-2 p-2 border border-gray-100 rounded bg-gray-50 flex justify-center">
                          <img src={calculator.logo} alt="Preview Logo" className="max-h-8 object-contain" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Calculator Themes */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold text-indigo-600 font-mono uppercase tracking-wider">
                      Theme Customization
                    </h4>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-dark-600 font-mono tracking-wider mb-2">
                        Visual Theme Preset
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['retro', 'dark', 'modern', 'pastel', 'cyberpunk', 'custom'].map((themeName) => (
                          <button
                            key={themeName}
                            onClick={() => updateCalculator({ ...calculator, theme: themeName as CustomThemeType })}
                            className={`py-2 px-3 text-[10px] font-mono uppercase font-black border-2 rounded-lg text-center transition-all ${
                              calculator.theme === themeName
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                : 'border-gray-200 text-dark-500 hover:bg-gray-50'
                            }`}
                          >
                            {themeName}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom colors panel if 'custom' theme is selected */}
                    {calculator.theme === 'custom' && (
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                        <span className="text-[10px] font-extrabold uppercase text-dark-600 font-mono">Custom Colors Picker</span>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 mb-1">Primary Color</label>
                            <input
                              type="color"
                              value={calculator.customColors?.primary || '#3b82f6'}
                              onChange={(e) => {
                                const colors = { ...(calculator.customColors || { primary: '#3b82f6', secondary: '#1d4ed8', background: '#ffffff', text: '#1a1a1f' }) }
                                colors.primary = e.target.value
                                updateCalculator({ ...calculator, customColors: colors })
                              }}
                              className="w-full h-8 cursor-pointer rounded border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 mb-1">Secondary Accent</label>
                            <input
                              type="color"
                              value={calculator.customColors?.secondary || '#1d4ed8'}
                              onChange={(e) => {
                                const colors = { ...(calculator.customColors || { primary: '#3b82f6', secondary: '#1d4ed8', background: '#ffffff', text: '#1a1a1f' }) }
                                colors.secondary = e.target.value
                                updateCalculator({ ...calculator, customColors: colors })
                              }}
                              className="w-full h-8 cursor-pointer rounded border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 mb-1">Background Casing</label>
                            <input
                              type="color"
                              value={calculator.customColors?.background || '#ffffff'}
                              onChange={(e) => {
                                const colors = { ...(calculator.customColors || { primary: '#3b82f6', secondary: '#1d4ed8', background: '#ffffff', text: '#1a1a1f' }) }
                                colors.background = e.target.value
                                updateCalculator({ ...calculator, customColors: colors })
                              }}
                              className="w-full h-8 cursor-pointer rounded border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 mb-1">General Text</label>
                            <input
                              type="color"
                              value={calculator.customColors?.text || '#1a1a1f'}
                              onChange={(e) => {
                                const colors = { ...(calculator.customColors || { primary: '#3b82f6', secondary: '#1d4ed8', background: '#ffffff', text: '#1a1a1f' }) }
                                colors.text = e.target.value
                                updateCalculator({ ...calculator, customColors: colors })
                              }}
                              className="w-full h-8 cursor-pointer rounded border border-gray-300"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Calculations & Formulas */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-extrabold text-indigo-600 font-mono uppercase tracking-wider">
                        Math Formulas Engine
                      </h4>
                      <button
                        onClick={addFormula}
                        className="text-[10px] font-bold font-mono text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        ADD FORMULA
                      </button>
                    </div>

                    {calculator.formulas.length === 0 ? (
                      <p className="text-[10px] text-dark-400 font-mono leading-normal italic text-center py-4 bg-gray-50 rounded-lg">
                        No formulas defined. Add one to show calculation outputs!
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {calculator.formulas.map((f, fIdx) => (
                          <div key={f.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3 relative">
                            {/* Delete formula */}
                            <button
                              onClick={() => deleteFormula(f.id)}
                              className="absolute top-2 right-2 text-dark-400 hover:text-red-500"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            {/* Label */}
                            <div>
                              <label className="block text-[9px] font-bold text-gray-500 mb-1 font-mono uppercase">
                                Output Metric Label
                              </label>
                              <input
                                type="text"
                                value={f.label}
                                onChange={(e) => updateFormulaField(f.id, 'label', e.target.value)}
                                className="w-[85%] h-8 px-2 bg-white border border-gray-200 rounded text-xs focus:outline-none"
                              />
                            </div>

                            {/* Expression Formula */}
                            <div>
                              <label className="block text-[9px] font-bold text-gray-500 mb-1 font-mono uppercase">
                                Mathematical Formula
                              </label>
                              <input
                                type="text"
                                value={f.formula}
                                onChange={(e) => updateFormulaField(f.id, 'formula', e.target.value)}
                                className="w-full h-8 px-2 bg-white border border-gray-200 rounded font-mono font-bold text-xs text-indigo-600 focus:outline-none"
                                placeholder="e.g. x + y"
                              />
                            </div>

                            {/* Prefix/Suffix/Decimals */}
                            <div className="grid grid-cols-3 gap-1.5">
                              <div>
                                <label className="block text-[8px] font-bold text-gray-400 font-mono mb-0.5">Prefix</label>
                                <input
                                  type="text"
                                  value={f.prefix || ''}
                                  onChange={(e) => updateFormulaField(f.id, 'prefix', e.target.value)}
                                  className="w-full h-7 px-1 bg-white border border-gray-200 rounded text-xs font-mono"
                                  placeholder="$"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-gray-400 font-mono mb-0.5">Suffix</label>
                                <input
                                  type="text"
                                  value={f.suffix || ''}
                                  onChange={(e) => updateFormulaField(f.id, 'suffix', e.target.value)}
                                  className="w-full h-7 px-1 bg-white border border-gray-200 rounded text-xs font-mono"
                                  placeholder="%"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-gray-400 font-mono mb-0.5">Round Dec</label>
                                <input
                                  type="number"
                                  min={0}
                                  max={10}
                                  value={f.decimalPlaces}
                                  onChange={(e) => updateFormulaField(f.id, 'decimalPlaces', parseInt(e.target.value) || 0)}
                                  className="w-full h-7 px-1 bg-white border border-gray-200 rounded text-xs font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Available Variables Cheat-sheet */}
                    {availableVariables.length > 0 && (
                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 text-[10px] font-mono text-indigo-800 leading-normal">
                        <div className="font-bold uppercase mb-1">Available variable keywords:</div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {availableVariables.map((v) => (
                            <span key={v} className="bg-white border border-indigo-100 px-1 py-0.5 rounded font-black text-indigo-600">
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* --- PREVIEW CALCULATOR MODAL OVERLAY --- */}
      <AnimatePresence>
        {previewOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl max-w-xl w-full border border-gray-100 flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-indigo-50 text-indigo-500 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-dark-800">Live Preview</h3>
                </div>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="p-1.5 hover:bg-gray-100 text-dark-500 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Renders Custom Calculator */}
              <div className="flex-1 overflow-y-auto px-1 py-2">
                <CustomCalculatorRenderer config={calculator} isPreview={true} />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="px-5 py-2 bg-dark-800 text-white rounded-xl text-xs font-mono font-bold hover:bg-dark-900 active:scale-95 transition-all uppercase"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SHARE & EMBED WIDGET MODAL --- */}
      <AnimatePresence>
        {shareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl w-full border border-gray-100 flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-indigo-50 text-indigo-500 rounded-lg">
                    <Share2 className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-dark-800">Share & Embed Configuration</h3>
                </div>
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="p-1.5 hover:bg-gray-100 text-dark-500 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Share link and embed details */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-1 font-sans">
                {/* Share Link block */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-dark-800 flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                    Shareable Link
                  </span>
                  <p className="text-xs text-dark-400">Send this URL link directly to colleagues or users to load your custom themed calculator.</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareLink}
                      className="flex-1 h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono select-all text-dark-600 focus:outline-none focus:bg-white focus:border-indigo-500"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareLink)
                        setCopiedLink(true)
                        setTimeout(() => setCopiedLink(false), 2000)
                      }}
                      className="px-4 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all active:scale-95"
                    >
                      {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedLink ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>

                {/* Embed code block */}
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <span className="text-xs font-bold text-dark-800 flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-indigo-500" />
                    Iframe Embed Snippet
                  </span>
                  <p className="text-xs text-dark-400">Copy the iframe script below to render this white-labeled widget directly inside your website.</p>
                  
                  {/* Iframe size parameters */}
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="block text-[10px] font-bold text-dark-500 font-mono uppercase mb-1">Widget Width</label>
                      <input 
                        type="text" 
                        value={embedWidth} 
                        onChange={(e) => setEmbedWidth(e.target.value)} 
                        className="w-full h-8 px-2 bg-gray-50 border border-gray-200 rounded text-xs font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-dark-500 font-mono uppercase mb-1">Widget Height (px)</label>
                      <input 
                        type="text" 
                        value={embedHeight} 
                        onChange={(e) => setEmbedHeight(e.target.value)} 
                        className="w-full h-8 px-2 bg-gray-50 border border-gray-200 rounded text-xs font-mono" 
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <textarea
                      readOnly
                      value={embedCode}
                      className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-mono select-all text-dark-600 focus:outline-none h-16 resize-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(embedCode)
                        setCopiedEmbed(true)
                        setTimeout(() => setCopiedEmbed(false), 2000)
                      }}
                      className="px-4 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-bold flex flex-col justify-center items-center gap-1.5 transition-all active:scale-95 w-20"
                    >
                      {copiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span className="text-[9px]">{copiedEmbed ? 'COPIED' : 'COPY CODE'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="px-5 py-2 bg-dark-800 text-white rounded-xl text-xs font-mono font-bold hover:bg-dark-900 active:scale-95 transition-all uppercase"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  )
}
