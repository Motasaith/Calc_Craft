'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PayrollTaxCalculator() {
  const [salary, setSalary] = useState('50000')
  const [ssRate, setSsRate] = useState('6.2')
  const [medRate, setMedRate] = useState('1.45')

  const s = parseFloat(salary), ss = parseFloat(ssRate), med = parseFloat(medRate)
  const valid = !isNaN(s) && !isNaN(ss) && !isNaN(med) && s >= 0
  const ssTax = valid ? (s * ss) / 100 : 0
  const medTax = valid ? (s * med) / 100 : 0
  const total = valid ? ssTax + medTax : 0

  return (
    <FormCalculatorShell title="Payroll Tax (FICA)" subtitle="SS + Medicare taxes" badge="TAX">
      <RetroInput label="Annual Salary" value={salary} onChange={setSalary} placeholder="50000" id="pr-s" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Social Security %" value={ssRate} onChange={setSsRate} placeholder="6.2" id="pr-ss" unit="%" />
        <RetroInput label="Medicare %" value={medRate} onChange={setMedRate} placeholder="1.45" id="pr-med" unit="%" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ResultDisplay label="SS Tax" value={`$${ssTax.toFixed(0)}`} />
            <ResultDisplay label="Medicare" value={`$${medTax.toFixed(0)}`} />
            <ResultDisplay label="Total FICA" value={`$${total.toFixed(0)}`} />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">FICA Breakdown</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="prGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#prGrid)" rx="8" />
              <path d={wobblyBar(25, 15, 50, Math.min(40, ssTax / 100))} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="2" />
              <text x="50" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#d97706">SS</text>
              <path d={wobblyBar(95, 15 + 40 - Math.min(40, medTax / 100), 50, Math.min(40, medTax / 100))} fill="#60a5fa" fillOpacity="0.3" stroke="#2563eb" strokeWidth="2" />
              <text x="120" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#2563eb">Medicare</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}