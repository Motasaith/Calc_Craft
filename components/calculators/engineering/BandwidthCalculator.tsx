'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BandwidthCalculator() {
  const [sizeStr, setSizeStr] = useState('100') // Megabytes MB
  const [speedStr, setSpeedStr] = useState('10') // Mbps speed

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, seconds: 0 }
    const size = parseFloat(sizeStr)
    const speed = parseFloat(speedStr)

    if (isNaN(size) || isNaN(speed) || size <= 0 || speed <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    // Convert MB to Mb (8 bits in a byte)
    const sizeMb = size * 8
    const seconds = sizeMb / speed

    return { error: null, seconds }
  }, [sizeStr, speedStr])

  return (
    <FormCalculatorShell title="Bandwidth Download Time Solver" subtitle="Estimate download duration based on file sizes and network speeds" badge="ENGINEERING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="File Size (Megabytes MB)" value={sizeStr} onChange={setSizeStr} id="bw-sz" />
          <RetroInput label="Download Speed (Mbps)" value={speedStr} onChange={setSpeedStr} id="bw-sp" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Download Duration" value={`${results.seconds.toFixed(1)} seconds`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
