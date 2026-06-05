'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { mean, median, mode, stddev, variance, sum, range_ } from '@/lib/calc-engine'

export default function StatisticsCalculator() {
  const [values, setValues] = useState('1,2,3,4,5')
  const nums = values.split(',').map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n))
  const valid = nums.length > 0

  return (
    <FormCalculatorShell title="Statistics Calculator" badge="MATH">
      <RetroInput label="Values (comma separated)" value={values} onChange={setValues} placeholder="e.g. 1,2,3,4" id="stats-values" />
      {valid && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <ResultDisplay label="Mean" value={`${mean(nums)}`} />
          <ResultDisplay label="Median" value={`${median(nums)}`} />
          <ResultDisplay label="Mode(s)" value={`${mode(nums).join(', ')}`} />
          <ResultDisplay label="StdDev (sample)" value={`${stddev(nums)}`} />
          <ResultDisplay label="Variance" value={`${variance(nums)}`} />
          <ResultDisplay label="Sum" value={`${sum(nums)}`} />
          <ResultDisplay label="Range" value={`${range_(nums)}`} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
