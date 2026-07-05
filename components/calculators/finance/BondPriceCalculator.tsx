'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function BondPriceCalculator() {
  const [face, setFace] = useState('1000')
  const [coupon, setCoupon] = useState('5')
  const [yieldRate, setYieldRate] = useState('4')
  const [years, setYears] = useState('10')

  const f = parseFloat(face)
  const c = parseFloat(coupon)
  const y = parseFloat(yieldRate)
  const n = parseFloat(years)
  const valid = !isNaN(f) && !isNaN(c) && !isNaN(y) && !isNaN(n) && f > 0 && n > 0

  let price = 0
  let couponPmt = 0
  if (valid) {
    couponPmt = f * (c / 100)
    const r = y / 100
    // PV of coupons (annuity) + PV of face value
    const pvCoupons = couponPmt * (1 - Math.pow(1 + r, -n)) / r
    const pvFace = f / Math.pow(1 + r, n)
    price = pvCoupons + pvFace
  }

  const premium = valid ? price - f : 0
  const barW = valid ? Math.min(Math.abs(price / f) * 60, 120) : 0

  return (
    <FormCalculatorShell
      title="Bond Price Calculator"
      subtitle="Price from face value, coupon & yield"
      badge="FINANCE"
    >
      <RetroInput label="Face Value" value={face} onChange={setFace} placeholder="e.g. 1000" id="bp-face" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Coupon Rate" value={coupon} onChange={setCoupon} placeholder="e.g. 5" id="bp-coupon" unit="%" />
        <RetroInput label="Yield to Maturity" value={yieldRate} onChange={setYieldRate} placeholder="e.g. 4" id="bp-yield" unit="%" />
      </div>
      <RetroInput label="Years to Maturity" value={years} onChange={setYears} placeholder="e.g. 10" id="bp-years" unit="yrs" />

      {valid && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <ResultDisplay label="Bond Price" value={formatCurrency(price)} large />
            <ResultDisplay label="Coupon Payment" value={formatCurrency(couponPmt)} />
          </div>
          <ResultDisplay
            label={premium >= 0 ? 'Premium' : 'Discount'}
            value={formatCurrency(Math.abs(premium))}
          />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill="#dfaa44" stroke="#be8b32" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">Face</text>
            <text x="160" y="58" fontSize="8" fontFamily="monospace" fill="#555">Price</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}