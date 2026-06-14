'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function BillSplitterCalculator() {
  const [total, setTotal] = useState('120')
  const [people, setPeople] = useState('4')
  const [tip, setTip] = useState('15')
  const [result, setResult] = useState<{tipAmount:number,totalWithTip:number,perPerson:number}|null>(null)

  const calculate = () => {
    const t = parseFloat(total), p = parseInt(people), tp = parseFloat(tip)
    if (isNaN(t)||isNaN(p)||isNaN(tp) || p<=0) { setResult(null); return }
    const tipAmount = t * (tp / 100)
    const totalWithTip = t + tipAmount
    setResult({ tipAmount, totalWithTip, perPerson: totalWithTip / p })
  }

  return (
    <FormCalculatorShell title="Bill Splitter" badge="MISC">
      <RetroInput label="Bill Total" value={total} onChange={setTotal} placeholder="120" id="bill-t" unit="$" />
      <div className="grid grid-cols-2 gap-3"><RetroInput label="People" value={people} onChange={setPeople} placeholder="4" id="bill-p" /><RetroInput label="Tip %" value={tip} onChange={setTip} placeholder="15" id="bill-tip" /></div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Tip" value={formatCurrency(result.tipAmount)} />
          <ResultDisplay label="Total + Tip" value={formatCurrency(result.totalWithTip)} />
          <ResultDisplay label="Per Person" value={formatCurrency(result.perPerson)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
