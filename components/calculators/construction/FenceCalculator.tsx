'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FenceCalculator() {
  const [lengthStr, setLengthStr] = useState('120') // feet
  const [spacingStr, setSpacingStr] = useState('8') // feet post spacing

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, posts: 0, panels: 0 }
    const len = parseFloat(lengthStr)
    const space = parseFloat(spacingStr)

    if (isNaN(len) || isNaN(space) || len <= 0 || space <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const posts = Math.ceil(len / space) + 1
    const panels = Math.ceil(len / space)

    return { error: null, posts, panels }
  }, [lengthStr, spacingStr])

  return (
    <FormCalculatorShell title="Yard Fencing Board Solver" subtitle="Estimate required posts and panels count for perimeter lines" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Fence Line Length (feet)" value={lengthStr} onChange={setLengthStr} id="fn-l" />
          <RetroInput label="Post Spacing Interval (feet)" value={spacingStr} onChange={setSpacingStr} id="fn-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Fence Posts" value={results.posts.toString()} />
              <ResultDisplay label="Fence Panels" value={results.panels.toString()} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
