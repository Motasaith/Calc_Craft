'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function DepreciationCalculator() {
  const [method, setMethod] = useState<'straight' | 'declining'>('straight')
  const [cost, setCost] = useState('10000')
  const [salvage, setSalvage] = useState('1000')
  const [life, setLife] = useState('5')
  const [year, setYear] = useState('1')
  const [result, setResult] = useState<{depreciation:number,bookValue:number}|null>(null)

  const calculate = () => {
    const c = parseFloat(cost), s = parseFloat(salvage), l = parseInt(life), y = parseInt(year)
    if (isNaN(c)||isNaN(s)||isNaN(l)||isNaN(y) || l <= 0 || y <= 0 || y > l) { setResult(null); return }
    if (method === 'straight') {
      const dep = (c - s) / l
      setResult({ depreciation: dep, bookValue: c - dep * y })
    } else {
      const rate = 2 / l
      let bv = c
      for (let i = 1; i <= y; i++) {
        const dep = bv * rate
        bv = Math.max(s, bv - dep)
      }
      setResult({ depreciation: c - bv - (c - s) * (y > l ? 1 : 0), bookValue: bv })
    }
  }

  return (
    <FormCalculatorShell title="Depreciation Calculator" badge="FINANCE">
      <RetroSelect label="Method" value={method} onChange={(v) => setMethod(v as any)} options={[{value:'straight',label:'Straight-Line'},{value:'declining',label:'Double Declining'}]} id="dep-mode" />
      <RetroInput label="Asset Cost" value={cost} onChange={setCost} placeholder="10000" id="dep-cost" unit="$" />
      <RetroInput label="Salvage Value" value={salvage} onChange={setSalvage} placeholder="1000" id="dep-salv" unit="$" />
      <RetroInput label="Useful Life (years)" value={life} onChange={setLife} placeholder="5" id="dep-life" unit="yr" />
      <RetroInput label="Year" value={year} onChange={setYear} placeholder="1" id="dep-yr" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Depreciation" value={formatCurrency(result.depreciation)} />
          <ResultDisplay label="Book Value" value={formatCurrency(result.bookValue)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
