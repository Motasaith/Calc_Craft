'use client'
import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

const GOLD_PRICE_PER_GRAM = 75

export default function GoldPriceCalculator() {
  const [weight, setWeight] = useState('10')
  const [unit, setUnit] = useState<'grams' | 'ounces' | 'tolas'>('grams')
  const [purity, setPurity] = useState('24')
  const [price, setPrice] = useState(GOLD_PRICE_PER_GRAM)
  const [result, setResult] = useState<{value:number,pureWeight:number}|null>(null)

  useEffect(() => {
    fetch('https://api.gold-api.com/price/XAU').then(r => r.json()).then(d => {
      if (d.price) setPrice(d.price / 31.1035)
    }).catch(() => {})
  }, [])

  const calculate = () => {
    const w = parseFloat(weight), p = parseFloat(purity)
    if (isNaN(w)||isNaN(p) || w <= 0) { setResult(null); return }
    let grams = w
    if (unit === 'ounces') grams = w * 31.1035
    if (unit === 'tolas') grams = w * 11.664
    const pureWeight = grams * (p / 24)
    setResult({ value: pureWeight * price, pureWeight })
  }

  return (
    <FormCalculatorShell title="Gold Price Calculator" badge="FINANCE">
      <RetroInput label="Weight" value={weight} onChange={setWeight} placeholder="10" id="gold-w" />
      <RetroSelect label="Unit" value={unit} onChange={(v) => setUnit(v as any)} options={[{value:'grams',label:'Grams'},{value:'ounces',label:'Troy Ounces'},{value:'tolas',label:'Tolas'}]} id="gold-unit" />
      <RetroSelect label="Purity (Karat)" value={purity} onChange={setPurity} options={[{value:'24',label:'24K (99.9%)'},{value:'22',label:'22K (91.6%)'},{value:'18',label:'18K (75%)'},{value:'14',label:'14K (58.3%)'}]} id="gold-pur" />
      <div className="text-[10px] text-neutral-500 font-mono mt-2">Base price: ${price.toFixed(2)}/g {price !== GOLD_PRICE_PER_GRAM && '(live)'}</div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Value</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Pure Gold Weight" value={`${result.pureWeight.toFixed(3)} g`} />
          <ResultDisplay label="Estimated Value" value={formatCurrency(result.value)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
