'use client'

import React, { useEffect, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateSimpleInterest, formatCurrency } from '@/lib/calc-engine'

export default function SimpleInterestCalculator() {
  const [p, setP] = useState(''); const [r, setR] = useState(''); const [t, setT] = useState('')

  const pv = parseFloat(p), rv = parseFloat(r), tv = parseFloat(t)
  const valid = !isNaN(pv) && !isNaN(rv) && !isNaN(tv) && pv > 0 && rv >= 0 && tv > 0

  const [interest, setInterest] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let cancelled = false
    if (!valid) { setInterest(0); setTotal(0); return }
    calculateSimpleInterest(pv, rv, tv).then((r) => {
      if (cancelled) return
      setInterest(r.interest)
      setTotal(r.amount)
    })
    return () => { cancelled = true }
  }, [pv, rv, tv, valid])

  return (
    <FormCalculatorShell title="Simple Interest Calculator" subtitle="I = P × R × T" badge="FINANCE">
      <RetroInput label="Principal (P)" value={p} onChange={setP} placeholder="e.g. 5000" id="si-p" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Rate (R)" value={r} onChange={setR} placeholder="e.g. 6" id="si-r" unit="% / yr" />
        <RetroInput label="Time (T)" value={t} onChange={setT} placeholder="e.g. 3" id="si-t" unit="years" />
      </div>
      {valid && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ResultDisplay label="Interest" value={formatCurrency(interest)} large />
          <ResultDisplay label="Total Amount" value={formatCurrency(total)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
