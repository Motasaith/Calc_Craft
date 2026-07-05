'use client'

import React from 'react'

interface FormShellProps {
  title: string
  subtitle?: string
  badge?: string
  children: React.ReactNode
}

/**
 * Clean, modern form-style calculator wrapper.
 * Used for calculators that naturally take form inputs (BMI, loan, health, etc.)
 * Matches the retro aesthetic with LCD-inspired result areas.
 */
export default function FormCalculatorShell({ title, subtitle, badge, children }: FormShellProps) {
  return (
    <div className="w-full h-full mx-auto px-2 sm:px-0">
      <div className="bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-2.5 sm:pb-3 border-b-2 border-[#d5d1c8] shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold tracking-wider text-neutral-700 font-mono uppercase">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{subtitle}</p>
              )}
            </div>
            {badge && (
              <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-neutral-300 border border-neutral-400 text-neutral-700 font-mono font-bold">
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

/** Styled input field matching retro theme */
export function RetroInput({
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
  min,
  max,
  step,
  unit,
  id,
}: {
  label: string
  value: string | number
  onChange: (val: string) => void
  type?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  unit?: string
  id?: string
}) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className="w-full h-10 px-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400 transition-all shadow-inner placeholder:text-neutral-400"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-500 font-mono">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

/** Styled select dropdown */
export function RetroSelect({
  label,
  value,
  onChange,
  options,
  id,
}: {
  label: string
  value: string
  onChange: (val: string) => void
  options: { value: string; label: string }[]
  id?: string
}) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400 transition-all cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

/** LCD-style result display panel */
export function ResultDisplay({
  label,
  value,
  unit,
  large,
}: {
  label: string
  value: string | number
  unit?: string
  large?: boolean
}) {
  return (
    <div className="bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-lg p-3 shadow-inner">
      <div className="text-[9px] font-bold text-[#4c5c4a] font-mono uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`font-mono font-extrabold text-[#1a2019] ${large ? 'text-2xl' : 'text-lg'} tracking-wide`}>
        {value}
        {unit && <span className="text-[11px] font-bold text-[#4c5c4a] ml-1.5">{unit}</span>}
      </div>
    </div>
  )
}

/** Retro-styled action button */
export function RetroActionButton({
  onClick,
  children,
  variant = 'primary',
  fullWidth,
}: {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  fullWidth?: boolean
}) {
  const colors = {
    primary: 'bg-[#dfaa44] text-neutral-900 border-[#be8b32] hover:bg-[#e5b44e]',
    secondary: 'bg-neutral-400 text-neutral-900 border-neutral-500 hover:bg-neutral-350',
    danger: 'bg-[#ab3232] text-white border-red-800 hover:bg-[#b94444]',
  }

  return (
    <button
      onClick={onClick}
      className={`${fullWidth ? 'w-full' : ''} h-10 px-5 text-xs font-extrabold font-mono rounded-lg shadow border ${colors[variant]} active:scale-95 transition-all uppercase tracking-wider`}
    >
      {children}
    </button>
  )
}

/** Slider control matching retro theme */
export function RetroSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  displayValue,
  id,
}: {
  label: string
  value: number
  onChange: (val: number) => void
  min: number
  max: number
  step?: number
  displayValue: string
  id?: string
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-bold text-neutral-600 mb-1.5">
        <label htmlFor={id} className="font-mono uppercase tracking-wider text-[11px]">{label}</label>
        <span className="font-mono text-neutral-900 font-bold">{displayValue}</span>
      </div>
      <div className="relative w-full h-4 bg-neutral-300 rounded border border-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] flex items-center px-1">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step || 1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-x-0 w-full accent-neutral-800 bg-transparent opacity-100 appearance-none h-1 cursor-pointer"
        />
      </div>
    </div>
  )
}

/** Status indicator bar */
export function StatusBar({ items }: { items: { label: string; active: boolean }[] }) {
  return (
    <div className={`grid gap-1 mt-4 pt-3 border-t border-neutral-300`} style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {items.map((item) => (
        <div
          key={item.label}
          className={`text-[8px] font-bold text-center py-1 rounded border font-mono transition-all ${
            item.active
              ? 'bg-neutral-800 text-white border-neutral-800 shadow'
              : 'bg-neutral-200 text-neutral-500 border-neutral-300'
          }`}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}
