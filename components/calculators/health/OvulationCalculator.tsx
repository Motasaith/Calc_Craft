'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function OvulationCalculator() {
  const [lastPeriod, setLastPeriod] = useState('')
  const [cycleLength, setCycleLength] = useState('28')
  const [result, setResult] = useState<{ovulation:string,fertileStart:string,fertileEnd:string,nextPeriod:string}|null>(null)

  const calculate = () => {
    if (!lastPeriod) { setResult(null); return }
    const start = new Date(lastPeriod)
    const cycle = parseInt(cycleLength)
    if (isNaN(cycle) || cycle < 21 || cycle > 35) { setResult(null); return }
    const ovulation = new Date(start); ovulation.setDate(start.getDate() + cycle - 14)
    const fertileStart = new Date(ovulation); fertileStart.setDate(ovulation.getDate() - 5)
    const fertileEnd = new Date(ovulation); fertileEnd.setDate(ovulation.getDate() + 1)
    const nextPeriod = new Date(start); nextPeriod.setDate(start.getDate() + cycle)
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    setResult({ ovulation: fmt(ovulation), fertileStart: fmt(fertileStart), fertileEnd: fmt(fertileEnd), nextPeriod: fmt(nextPeriod) })
  }

  return (
    <FormCalculatorShell title="Ovulation Calculator" badge="HEALTH">
      <RetroInput label="First Day of Last Period" value={lastPeriod} onChange={setLastPeriod} type="date" id="ov-lmp" />
      <RetroInput label="Cycle Length (days)" value={cycleLength} onChange={setCycleLength} placeholder="28" id="ov-cycle" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Ovulation Date" value={result.ovulation} />
          <ResultDisplay label="Next Period" value={result.nextPeriod} />
          <ResultDisplay label="Fertile Window Start" value={result.fertileStart} />
          <ResultDisplay label="Fertile Window End" value={result.fertileEnd} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
