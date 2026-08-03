'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

export default function InsurancePremiumCalculator() {
  const [ageStr, setAgeStr] = useState('30')
  const [violationsStr, setViolationsStr] = useState('0')
  const [coverage, setCoverage] = useState<'basic' | 'comprehensive'>('basic')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, premium: 0 }
    const age = parseInt(ageStr)
    const viol = parseInt(violationsStr)

    if (isNaN(age) || isNaN(viol) || age <= 0 || viol < 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    let base = coverage === 'basic' ? 80 : 150
    if (age < 25) base *= 1.5
    else if (age > 70) base *= 1.2
    base += viol * 40

    return { error: null, premium: base }
  }, [ageStr, violationsStr, coverage])

  return (
    <FormCalculatorShell title="Insurance Premium Estimator" subtitle="Estimate car insurance pricing based on age and safety records" badge="AUTOMOTIVE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Driver Age" value={ageStr} onChange={setAgeStr} id="ins-age" />
          <RetroInput label="Traffic Violations count" value={violationsStr} onChange={setViolationsStr} id="ins-v" />
          <RetroSelect
            label="Coverage Tier"
            value={coverage}
            onChange={(val) => setCoverage(val as any)}
            id="ins-cov"
            options={[{ value: 'basic', label: 'Basic Liability' }, { value: 'comprehensive', label: 'Comprehensive Full' }]}
          />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Premium" value={results.premium.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
