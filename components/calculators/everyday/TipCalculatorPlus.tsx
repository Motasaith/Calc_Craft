'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function TipCalculatorPlus() {
  const [bill, setBill] = useState('100')
  const [taxPct, setTaxPct] = useState('8')
  const [tipPct, setTipPct] = useState('18')
  const [people, setPeople] = useState('4')
  const [result, setResult] = useState<{ perPerson: number; tipPerPerson: number; total: number } | null>(null)

  const calculate = () => {
    const b = parseFloat(bill)
    const t = parseFloat(taxPct)
    const p = parseFloat(tipPct)
    const n = parseInt(people)
    if (isNaN(b) || isNaN(t) || isNaN(p) || isNaN(n) || b <= 0 || n <= 0) return
    const tax = b * (t / 100)
    const tip = b * (p / 100)
    const total = b + tax + tip
    setResult({ perPerson: total / n, tipPerPerson: tip / n, total })
  }

  return (
    <FormCalculatorShell title="Tip Calculator Plus" subtitle="Split bills with tax & tip" badge="EVERYDAY">
      <RetroInput label="Bill Amount" value={bill} onChange={setBill} unit="$" id="tip-bill" />
      <RetroInput label="Tax %" value={taxPct} onChange={setTaxPct} unit="%" id="tip-tax" />
      <RetroInput label="Tip %" value={tipPct} onChange={setTipPct} unit="%" id="tip-pct" />
      <RetroInput label="Number of People" value={people} onChange={setPeople} id="tip-people" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label="Total Per Person" value={`$${result.perPerson.toFixed(2)}`} large />
          <ResultDisplay label="Tip Per Person" value={`$${result.tipPerPerson.toFixed(2)}`} />
          <ResultDisplay label="Grand Total" value={`$${result.total.toFixed(2)}`} />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(10, 10, 40, 40)} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(60, 5, 40, 45)} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <path d={wobblyBar(110, 15, 40, 35)} fill="#dad6cd" stroke="#b0bdae" strokeWidth="2" />
            <text x="30" y="62" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#4c5c4a">Bill</text>
            <text x="80" y="62" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#4c5c4a">Tax</text>
            <text x="130" y="62" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#4c5c4a">Tip</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}