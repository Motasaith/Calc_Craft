'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RecipeScalerCalculator() {
  const [servingsOriginalStr, setServingsOriginalStr] = useState('4')
  const [servingsTargetStr, setServingsTargetStr] = useState('6')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, multiplier: 0 }
    const o = parseFloat(servingsOriginalStr)
    const t = parseFloat(servingsTargetStr)
    if (isNaN(o) || isNaN(t) || o <= 0 || t <= 0) return { ...defaultObj, error: 'Please enter valid servings counts.' }
    return { error: null, multiplier: t / o }
  }, [servingsOriginalStr, servingsTargetStr])

  return (
    <FormCalculatorShell title="Recipe Servings Scaler" subtitle="Calculate conversion multiplier for ingredients list" badge="COOKING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Original Servings" value={servingsOriginalStr} onChange={setServingsOriginalStr} id="rs-o" />
          <RetroInput label="Target Servings" value={servingsTargetStr} onChange={setServingsTargetStr} id="rs-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Multiply Ingredients by" value={`${results.multiplier.toFixed(2)}x`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
