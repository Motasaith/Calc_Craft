'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'v' | 'i' | 'r'

export default function OhmsLawCalculator() {
  const [mode, setMode] = useState<Mode>('v')
  const [voltageStr, setVoltageStr] = useState('12')
  const [currentStr, setCurrentStr] = useState('2')
  const [resistanceStr, setResistanceStr] = useState('6')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, v: 0, i: 0, r: 0, steps: [] as string[] }
    const valV = parseFloat(voltageStr)
    const valI = parseFloat(currentStr)
    const valR = parseFloat(resistanceStr)

    let ansV = valV, ansI = valI, ansR = valR
    let steps: string[] = []

    if (mode === 'v') {
      if (isNaN(valI) || isNaN(valR) || valR < 0) return { ...defaultObj, error: 'Please enter valid current and resistance.' }
      ansV = valI * valR
      steps = [
        `Formula: Voltage (V) = Current (I) × Resistance (R)`,
        `V = ${valI} A × ${valR} Ω = ${ansV.toFixed(2)} Volts`
      ]
    } else if (mode === 'i') {
      if (isNaN(valV) || isNaN(valR) || valR <= 0) return { ...defaultObj, error: 'Please enter valid voltage and positive resistance.' }
      ansI = valV / valR
      steps = [
        `Formula: Current (I) = Voltage (V) / Resistance (R)`,
        `I = ${valV} V / ${valR} Ω = ${ansI.toFixed(4)} Amps`
      ]
    } else {
      if (isNaN(valV) || isNaN(valI) || valI === 0) return { ...defaultObj, error: 'Please enter valid voltage and non-zero current.' }
      ansR = valV / valI
      steps = [
        `Formula: Resistance (R) = Voltage (V) / Current (I)`,
        `R = ${valV} V / ${valI} A = ${ansR.toFixed(4)} Ohms`
      ]
    }

    return { error: null, v: ansV, i: ansI, r: ansR, steps }
  }, [mode, voltageStr, currentStr, resistanceStr])

  return (
    <FormCalculatorShell title="Ohm's Law Solver" subtitle="Calculate Voltage, Current, and Resistance mutually" badge="ENGINEERING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Solve For"
            value={mode}
            onChange={(val) => setMode(val as Mode)}
            id="ohm-mode"
            options={[
              { value: 'v', label: 'Voltage (V)' },
              { value: 'i', label: 'Current (I)' },
              { value: 'r', label: 'Resistance (R)' }
            ]}
          />
          {mode !== 'v' && <RetroInput label="Voltage (V)" value={voltageStr} onChange={setVoltageStr} id="ohm-v" />}
          {mode !== 'i' && <RetroInput label="Current (A)" value={currentStr} onChange={setCurrentStr} id="ohm-i" />}
          {mode !== 'r' && <RetroInput label="Resistance (Ω)" value={resistanceStr} onChange={setResistanceStr} id="ohm-r" />}
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Voltage (V)" value={`${results.v.toFixed(2)} V`} large={mode === 'v'} />
                <ResultDisplay label="Current (I)" value={`${results.i.toFixed(4)} A`} large={mode === 'i'} />
                <ResultDisplay label="Resistance (R)" value={`${results.r.toFixed(4)} Ω`} large={mode === 'r'} />
              </div>
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
