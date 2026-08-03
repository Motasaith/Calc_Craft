'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BondPriceCalculator() {
  const [faceStr, setFaceStr] = useState('1000') // face value
  const [couponStr, setCouponStr] = useState('5.0') // % coupon
  const [yieldStr, setYieldStr] = useState('6.0') // % yield to maturity
  const [yearsStr, setYearsStr] = useState('10') // maturity

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, price: 0 }
    const f = parseFloat(faceStr)
    const c = parseFloat(couponStr)
    const y = parseFloat(yieldStr)
    const t = parseFloat(yearsStr)

    if (isNaN(f) || isNaN(c) || isNaN(y) || isNaN(t) || f <= 0 || t <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const couponPayment = f * (c / 100)
    const yieldDec = y / 100
    let price = 0

    // Present value of coupon annuity + present value of face value
    if (yieldDec > 0) {
      price = couponPayment * ((1 - Math.pow(1 + yieldDec, -t)) / yieldDec) + f * Math.pow(1 + yieldDec, -t)
    } else {
      price = couponPayment * t + f
    }

    return { error: null, price }
  }, [faceStr, couponStr, yieldStr, yearsStr])

  return (
    <FormCalculatorShell title="Bond Pricing Solver" subtitle="Calculate bond current valuation using face and coupon rates" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Face Value ($)" value={faceStr} onChange={setFaceStr} id="bp-f" />
          <RetroInput label="Annual Coupon Rate (%)" value={couponStr} onChange={setCouponStr} id="bp-c" />
          <RetroInput label="Yield to Maturity (%)" value={yieldStr} onChange={setYieldStr} id="bp-y" />
          <RetroInput label="Term to Maturity (Years)" value={yearsStr} onChange={setYearsStr} id="bp-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Bond Value" value={results.price.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
