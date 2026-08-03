'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

export default function MeatThermometerCalculator() {
  const [meatType, setMeatType] = useState('beef')

  const results = useMemo(() => {
    const defaultObj = { temp: '', safety: '' }
    if (meatType === 'beef') return { temp: '145°F (63°C)', safety: 'Medium rare. Rest for 3 minutes.' }
    if (meatType === 'poultry') return { temp: '165°F (74°C)', safety: 'Fully cooked and safe.' }
    if (meatType === 'pork') return { temp: '145°F (63°C)', safety: 'Rest for 3 minutes.' }
    return defaultObj
  }, [meatType])

  const options = [
    { value: 'beef', label: 'Beef & Lamb' },
    { value: 'poultry', label: 'Poultry (Chicken/Turkey)' },
    { value: 'pork', label: 'Pork & Ham' }
  ]

  return (
    <FormCalculatorShell title="Meat Cooking Temperature Guide" subtitle="Resolve USDA safe internal meat cooking temperatures" badge="COOKING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect label="Select Meat Type" value={meatType} onChange={setMeatType} id="mt-select" options={options} />
        </div>
        <div className="min-h-[440px] space-y-4 text-center">
          <ResultDisplay label="Required Temperature" value={results.temp} large />
          <p className="font-mono text-xs text-neutral-600 bg-neutral-50 p-4 rounded border border-neutral-300">
            {results.safety}
          </p>
        </div>
      </div>
    </FormCalculatorShell>
  )
}
