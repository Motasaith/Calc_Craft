'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SnellsLawCalculator() {
  const [n1Str, setn1Str] = useState('1.0') // Air
  const [theta1Str, setTheta1Str] = useState('30') // degrees
  const [n2Str, setn2Str] = useState('1.33') // Water

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, theta2: 0 }
    const n1 = parseFloat(n1Str)
    const theta1 = parseFloat(theta1Str)
    const n2 = parseFloat(n2Str)

    if (isNaN(n1) || isNaN(theta1) || isNaN(n2) || n1 <= 0 || n2 <= 0) {
      return { ...defaultObj, error: 'Please enter valid index and angle values.' }
    }

    const theta1Rad = (theta1 * Math.PI) / 180
    const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2

    if (sinTheta2 > 1 || sinTheta2 < -1) {
      return { ...defaultObj, error: 'Total internal reflection occurs.' }
    }

    const theta2Rad = Math.asin(sinTheta2)
    const theta2 = (theta2Rad * 180) / Math.PI

    return { error: null, theta2 }
  }, [n1Str, theta1Str, n2Str])

  return (
    <FormCalculatorShell title="Snell's Law Refraction Solver" subtitle="Calculate light refraction angle theta2 from refractive indexes" badge="SCIENCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Medium 1 Index (n1)" value={n1Str} onChange={setn1Str} id="sn-n1" />
          <RetroInput label="Angle of Incidence (θ1, degrees)" value={theta1Str} onChange={setTheta1Str} id="sn-t1" />
          <RetroInput label="Medium 2 Index (n2)" value={n2Str} onChange={setn2Str} id="sn-n2" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Refraction Angle (θ2)" value={`${results.theta2.toFixed(2)}°`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
