'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function PeriodCalculator() {
  const [lastPeriod, setLastPeriod] = useState('')
  const [cycleLength, setCycleLength] = useState('28')
  const [periodLength, setPeriodLength] = useState('5')
  const [result, setResult] = useState<{nextPeriod:string,ovulation:string,fertileStart:string,fertileEnd:string,periodEnd:string}|null>(null)

  const calculate = () => {
    if (!lastPeriod) { setResult(null); return }
    const start = new Date(lastPeriod)
    const cycle = parseInt(cycleLength), plen = parseInt(periodLength)
    if (isNaN(cycle)||isNaN(plen)) { setResult(null); return }
    const nextPeriod = new Date(start); nextPeriod.setDate(start.getDate() + cycle)
    const ovulation = new Date(start); ovulation.setDate(start.getDate() + cycle - 14)
    const fertileStart = new Date(ovulation); fertileStart.setDate(ovulation.getDate() - 5)
    const fertileEnd = new Date(ovulation); fertileEnd.setDate(ovulation.getDate() + 1)
    const periodEnd = new Date(nextPeriod); periodEnd.setDate(nextPeriod.getDate() + plen - 1)
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    setResult({ nextPeriod: fmt(nextPeriod), ovulation: fmt(ovulation), fertileStart: fmt(fertileStart), fertileEnd: fmt(fertileEnd), periodEnd: fmt(periodEnd) })
  }

  return (
    <FormCalculatorShell title="Period Calculator" badge="HEALTH">
      <RetroInput label="First Day of Last Period" value={lastPeriod} onChange={setLastPeriod} type="date" id="per-lmp" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Cycle Length (days)" value={cycleLength} onChange={setCycleLength} placeholder="28" id="per-cycle" />
        <RetroInput label="Period Length (days)" value={periodLength} onChange={setPeriodLength} placeholder="5" id="per-len" />
      </div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Next Period" value={result.nextPeriod} />
          <ResultDisplay label="Period Ends" value={result.periodEnd} />
          <ResultDisplay label="Ovulation" value={result.ovulation} />
          <ResultDisplay label="Fertile Window" value={`${result.fertileStart} – ${result.fertileEnd}`} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
