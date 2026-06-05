'use client'
import React from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateROI, formatCurrency, formatPercent } from '@/lib/calc-engine'

export default function RoiCalculator() {
  const [invested, setInvested] = React.useState(''); const [returned, setReturned] = React.useState('')

  const iv = parseFloat(invested), rv = parseFloat(returned)
  const valid = !isNaN(iv) && !isNaN(rv) && iv > 0
  const gain = valid ? rv - iv : 0
  const roi = valid ? calculateROI(iv, rv) : 0

  return (
    <FormCalculatorShell title="ROI Calculator" subtitle="Return on Investment" badge="FINANCE">
      <RetroInput label="Amount Invested" value={invested} onChange={setInvested} placeholder="e.g. 10000" id="roi-inv" unit="$" />
      <RetroInput label="Amount Returned" value={returned} onChange={setReturned} placeholder="e.g. 15000" id="roi-ret" unit="$" />
      {valid && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ResultDisplay label={gain >= 0 ? 'Gain' : 'Loss'} value={formatCurrency(gain)} large />
          <ResultDisplay label="ROI" value={formatPercent(roi / 100, 2)} large />
          <ResultDisplay label="Multiplier" value={`${(rv / iv).toFixed(2)}x`} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
