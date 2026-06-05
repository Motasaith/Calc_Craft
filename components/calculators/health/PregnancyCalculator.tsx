'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateDueDate } from '@/lib/calc-engine'

export default function PregnancyCalculator() {
  const [lmp, setLmp] = useState('')

  const lmpDate = lmp ? new Date(lmp) : null
  const valid = lmpDate && !isNaN(lmpDate.getTime()) && lmpDate <= new Date()

  const r = valid ? calculateDueDate(lmpDate) : null
  const dueDate = r ? r.dueDate : null
  const today = new Date()
  const weeksPregnant = r ? r.weeksPregnant : 0
  const trimester = r ? r.trimester : 1
  const daysRemaining = valid && dueDate ? Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / 86400000)) : 0
  const daysPregnant = valid ? Math.floor((today.getTime() - lmpDate.getTime()) / 86400000) : 0
  const daysExtra = daysPregnant % 7

  const firstTrimEnd = valid ? new Date(lmpDate.getTime() + 91 * 86400000) : null
  const secondTrimEnd = valid ? new Date(lmpDate.getTime() + 189 * 86400000) : null

  const fmt = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <FormCalculatorShell title="Pregnancy Due Date Calculator" subtitle="Based on Naegele's Rule" badge="HEALTH">
      <div className="mb-3">
        <label htmlFor="preg-lmp" className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
          Last Menstrual Period (LMP)
        </label>
        <input
          type="date"
          id="preg-lmp"
          value={lmp}
          onChange={(e) => setLmp(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full h-10 px-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400 transition-all shadow-inner"
        />
      </div>

      {valid && dueDate && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <ResultDisplay label="Estimated Due Date" value={fmt(dueDate)} large />
          <ResultDisplay label="Current Week" value={`${weeksPregnant}w ${daysExtra}d`} large />
          <ResultDisplay label="Trimester" value={`${trimester}${trimester === 1 ? 'st' : trimester === 2 ? 'nd' : 'rd'}`} />
          <ResultDisplay label="Days Remaining" value={daysRemaining.toString()} />
          {firstTrimEnd && <ResultDisplay label="1st Trimester Ends" value={fmt(firstTrimEnd)} />}
          {secondTrimEnd && <ResultDisplay label="2nd Trimester Ends" value={fmt(secondTrimEnd)} />}
        </div>
      )}
    </FormCalculatorShell>
  )
}
