'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ZakatCalculator() {
  const [cashStr, setCashStr] = useState('10000') // cash
  const [goldStr, setGoldStr] = useState('2000') // gold/silver value
  const [nisabStr, setNisabStr] = useState('6000') // Nisab threshold in cash

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, zakat: 0, steps: [] as string[] }
    const cash = parseFloat(cashStr)
    const gold = parseFloat(goldStr)
    const nisab = parseFloat(nisabStr)

    if (isNaN(cash) || isNaN(gold) || isNaN(nisab) || cash < 0 || gold < 0 || nisab <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const totalAssets = cash + gold
    let zakat = 0
    let eligible = false

    if (totalAssets >= nisab) {
      zakat = totalAssets * 0.025 // 2.5% Zakat rate
      eligible = true
    }

    return {
      error: null,
      zakat,
      steps: [
        `Total Zakat-eligible Assets = Cash (${cash}) + Gold/Silver (${gold}) = ${totalAssets} USD`,
        `Nisab Threshold = ${nisab} USD`,
        eligible 
          ? `Assets exceed Nisab! Zakat Due = Total Assets × 2.5% = ${zakat.toFixed(2)} USD`
          : `Assets do not meet Nisab threshold. Zakat Due = 0 USD`
      ]
    }
  }, [cashStr, goldStr, nisabStr])

  return (
    <FormCalculatorShell title="Zakat Obligations Solver" subtitle="Calculate yearly Zakat due (2.5% rate) on net wealth" badge="ISLAMIC">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Cash & Savings ($)" value={cashStr} onChange={setCashStr} id="zk-cash" />
          <RetroInput label="Gold & Silver Market Value ($)" value={goldStr} onChange={setGoldStr} id="zk-gold" />
          <RetroInput label="Nisab Limit Threshold ($)" value={nisabStr} onChange={setNisabStr} id="zk-nisab" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Zakat Due" value={results.zakat.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
