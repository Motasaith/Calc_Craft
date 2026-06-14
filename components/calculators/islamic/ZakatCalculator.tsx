'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function ZakatCalculator() {
  const [cash, setCash] = useState('5000')
  const [gold, setGold] = useState('50')
  const [silver, setSilver] = useState('200')
  const [investments, setInvestments] = useState('10000')
  const [debts, setDebts] = useState('2000')
  const [goldPrice, setGoldPrice] = useState('75')
  const [result, setResult] = useState<{totalAssets:number,nisab:number,zakat:number}|null>(null)

  const calculate = () => {
    const c = parseFloat(cash), g = parseFloat(gold), s = parseFloat(silver)
    const inv = parseFloat(investments), d = parseFloat(debts), gp = parseFloat(goldPrice)
    if (isNaN(c)||isNaN(g)||isNaN(s)||isNaN(inv)||isNaN(d)||isNaN(gp)) { setResult(null); return }
    const goldValue = g * gp
    const silverValue = s * gp * 0.015
    const totalAssets = c + goldValue + silverValue + inv - d
    const nisab = 85 * gp
    const zakat = totalAssets >= nisab ? totalAssets * 0.025 : 0
    setResult({ totalAssets, nisab, zakat })
  }

  return (
    <FormCalculatorShell title="Zakat Calculator" badge="ISLAMIC">
      <RetroInput label="Cash & Bank" value={cash} onChange={setCash} placeholder="5000" id="zak-cash" unit="$" />
      <RetroInput label="Gold (grams)" value={gold} onChange={setGold} placeholder="50" id="zak-gold" unit="g" />
      <RetroInput label="Silver (grams)" value={silver} onChange={setSilver} placeholder="200" id="zak-sil" unit="g" />
      <RetroInput label="Investments" value={investments} onChange={setInvestments} placeholder="10000" id="zak-inv" unit="$" />
      <RetroInput label="Debts" value={debts} onChange={setDebts} placeholder="2000" id="zak-debt" unit="$" />
      <RetroInput label="Gold Price/g" value={goldPrice} onChange={setGoldPrice} placeholder="75" id="zak-gp" unit="$" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Zakat</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Total Assets" value={formatCurrency(result.totalAssets)} />
          <ResultDisplay label="Nisab Threshold" value={formatCurrency(result.nisab)} />
          <ResultDisplay label="Zakat Due (2.5%)" value={formatCurrency(result.zakat)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
