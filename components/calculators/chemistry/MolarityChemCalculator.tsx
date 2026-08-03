'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'molarity' | 'solute' | 'volume'

export default function MolarityChemCalculator() {
  const [mode, setMode] = useState<Mode>('molarity')
  const [soluteStr, setSoluteStr] = useState('0.5') // moles
  const [volumeStr, setVolumeStr] = useState('2.0') // liters
  const [molarityStr, setMolarityStr] = useState('0.25') // mol/L

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      molarity: 0,
      solute: 0,
      volume: 0,
      steps: [] as string[]
    }

    const solute = parseFloat(soluteStr)
    const volume = parseFloat(volumeStr)
    const molarity = parseFloat(molarityStr)

    let steps: string[] = []
    let ansMolarity = 0, ansSolute = 0, ansVolume = 0

    if (mode === 'molarity') {
      if (isNaN(solute) || isNaN(volume) || solute <= 0 || volume <= 0) {
        return { ...defaultObj, error: 'Please enter valid solute moles and volume.' }
      }
      ansMolarity = solute / volume
      ansSolute = solute
      ansVolume = volume
      steps = [
        `Formula: Molarity (M) = Solute (mol) / Volume (L)`,
        `M = ${solute} mol / ${volume} L = ${ansMolarity.toFixed(4)} M`
      ]
    } else if (mode === 'solute') {
      if (isNaN(molarity) || isNaN(volume) || molarity <= 0 || volume <= 0) {
        return { ...defaultObj, error: 'Please enter valid molarity and volume.' }
      }
      ansSolute = molarity * volume
      ansMolarity = molarity
      ansVolume = volume
      steps = [
        `Formula: Solute (mol) = Molarity (M) × Volume (L)`,
        `mol = ${molarity} M × ${volume} L = ${ansSolute.toFixed(4)} mol`
      ]
    } else {
      if (isNaN(solute) || isNaN(molarity) || solute <= 0 || molarity <= 0) {
        return { ...defaultObj, error: 'Please enter valid solute moles and molarity.' }
      }
      ansVolume = solute / molarity
      ansSolute = solute
      ansMolarity = molarity
      steps = [
        `Formula: Volume (L) = Solute (mol) / Molarity (M)`,
        `L = ${solute} mol / ${molarity} M = ${ansVolume.toFixed(4)} L`
      ]
    }

    return {
      error: null,
      molarity: ansMolarity,
      solute: ansSolute,
      volume: ansVolume,
      steps
    }
  }, [mode, soluteStr, volumeStr, molarityStr])

  return (
    <FormCalculatorShell title="Molarity Calculator" subtitle="Solve molarity, solute moles, and solution volume" badge="CHEMISTRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Solve For"
            value={mode}
            onChange={(v) => setMode(v as Mode)}
            id="molarity-mode"
            options={[
              { value: 'molarity', label: 'Molarity (M)' },
              { value: 'solute', label: 'Solute Moles (mol)' },
              { value: 'volume', label: 'Volume (L)' }
            ]}
          />
          {mode !== 'solute' && <RetroInput label="Solute Moles (mol)" value={soluteStr} onChange={setSoluteStr} id="molarity-solute" />}
          {mode !== 'volume' && <RetroInput label="Volume (L)" value={volumeStr} onChange={setVolumeStr} id="molarity-vol" />}
          {mode !== 'molarity' && <RetroInput label="Molarity (M)" value={molarityStr} onChange={setMolarityStr} id="molarity-mol" />}
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Molarity" value={`${results.molarity.toFixed(4)} M`} large={mode === 'molarity'} />
                <ResultDisplay label="Solute" value={`${results.solute.toFixed(4)} mol`} large={mode === 'solute'} />
                <ResultDisplay label="Volume" value={`${results.volume.toFixed(4)} L`} large={mode === 'volume'} />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Chemical Steps</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results.error}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
