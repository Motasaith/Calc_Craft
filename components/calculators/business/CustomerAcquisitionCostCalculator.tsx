'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CustomerAcquisitionCostCalculator() {
  const [marketing, setMarketing] = useState('5000')
  const [sales, setSales] = useState('3000')
  const [newCustomers, setNewCustomers] = useState('100')

  const mk = parseFloat(marketing) || 0
  const sl = parseFloat(sales) || 0
  const nc = parseFloat(newCustomers) || 0
  const totalSpend = mk + sl
  const cac = nc > 0 ? totalSpend / nc : 0
  const valid = nc > 0 && totalSpend > 0

  const mkW = Math.min(80, Math.max(5, mk / 100))
  const slW = Math.min(80, Math.max(5, sl / 100))

  return (
    <FormCalculatorShell
      title="Customer Acquisition Cost"
      subtitle="Cost to acquire each customer"
      badge="BUSINESS"
    >
      <div>
        <RetroInput label="Marketing Spend" value={marketing} onChange={setMarketing} unit="$" />
        <RetroInput label="Sales Spend" value={sales} onChange={setSales} unit="$" />
        <RetroInput label="New Customers" value={newCustomers} onChange={setNewCustomers} />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="CAC per Customer" value={cac.toFixed(2)} unit="$" large />
          <ResultDisplay label="Total Spend" value={totalSpend.toFixed(2)} unit="$" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <path d={wobblyBar(20, 30, mkW, 15)} fill="#dfaa44" opacity="0.8" />
        <path d={wobblyBar(20, 50, slW, 15)} fill="#9ca8af" opacity="0.8" />
        <text x="20" y="22" className="fill-neutral-600" fontSize="8" fontFamily="monospace">MKTG</text>
        <text x="20" y="78" className="fill-neutral-600" fontSize="8" fontFamily="monospace">SALES</text>
      </svg>
    </FormCalculatorShell>
  )
}