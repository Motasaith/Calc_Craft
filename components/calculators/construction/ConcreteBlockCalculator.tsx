'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ConcreteBlockCalculator() {
  const [areaStr, setAreaStr] = useState('100') // sq ft

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, blocks: 0, steps: [] as string[] }
    const a = parseFloat(areaStr)
    if (isNaN(a) || a <= 0) return { ...defaultObj, error: 'Please enter a valid positive area.' }
    // Standard 8x8x16 block: 1.125 blocks per sq ft
    const blocks = a * 1.125
    return {
      error: null,
      blocks: Math.ceil(blocks),
      steps: [
        `Standard block size (8" x 8" x 16") covers 0.888 sq ft`,
        `Blocks multiplier = 1.125 blocks/sq ft`,
        `Total blocks = ${a} × 1.125 = ${Math.ceil(blocks)} blocks`
      ]
    }
  }, [areaStr])

  return (
    <FormCalculatorShell title="Concrete Block Solver" subtitle="Calculate blocks for masonry walls" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Wall Area (sq ft)" value={areaStr} onChange={setAreaStr} id="cb-a" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Concrete Blocks Needed" value={results.blocks.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
