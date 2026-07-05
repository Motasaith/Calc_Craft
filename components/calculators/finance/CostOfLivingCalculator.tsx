'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CostOfLivingCalculator() {
  const [salary, setSalary] = useState('75000')
  const [currentIndex, setCurrentIndex] = useState('100')
  const [targetIndex, setTargetIndex] = useState('140')

  const s = parseFloat(salary)
  const ci = parseFloat(currentIndex)
  const ti = parseFloat(targetIndex)
  const valid = !isNaN(s) && !isNaN(ci) && !isNaN(ti) && s > 0 && ci > 0 && ti > 0

  const equivalentSalary = valid ? s * (ti / ci) : 0
  const difference = valid ? equivalentSalary - s : 0
  const pctChange = valid ? (ti / ci) - 1 : 0
  const barW = valid ? Math.min(Math.abs(pctChange) * 200, 140) : 0

  return (
    <FormCalculatorShell
      title="Cost of Living Calculator"
      subtitle="Compare salary between cities"
      badge="FINANCE"
    >
      <RetroInput label="Current Salary" value={salary} onChange={setSalary} placeholder="e.g. 75000" id="col-s" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Current City Index" value={currentIndex} onChange={setCurrentIndex} placeholder="e.g. 100" id="col-ci" />
        <RetroInput label="Target City Index" value={targetIndex} onChange={setTargetIndex} placeholder="e.g. 140" id="col-ti" />
      </div>

      {valid && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <ResultDisplay label="Equivalent Salary" value={formatCurrency(equivalentSalary)} large />
            <ResultDisplay label="Difference" value={formatCurrency(difference)} />
          </div>
          <ResultDisplay label="Cost Change" value={`${(pctChange * 100).toFixed(1)}%`} />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill={difference >= 0 ? '#ab3232' : '#5b8a72'} stroke="#3f6a55" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">0%</text>
            <text x="150" y="58" fontSize="8" fontFamily="monospace" fill="#555">Change</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}