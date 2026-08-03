'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TimeLapseCalculator() {
  const [durationStr, setDurationStr] = useState('120') // minutes to shoot
  const [intervalStr, setIntervalStr] = useState('5') // seconds between shots
  const [fpsStr, setFpsStr] = useState('24')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, totalFrames: 0, clipLength: 0 }
    const dur = parseFloat(durationStr) * 60 // to seconds
    const int = parseFloat(intervalStr)
    const fps = parseFloat(fpsStr)
    if (isNaN(dur) || isNaN(int) || isNaN(fps) || dur <= 0 || int <= 0 || fps <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const totalFrames = Math.floor(dur / int)
    const clipLength = totalFrames / fps
    return { error: null, totalFrames, clipLength }
  }, [durationStr, intervalStr, fpsStr])

  return (
    <FormCalculatorShell title="Time-Lapse Solver" subtitle="Calculate frames count and final clip durations" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Shoot Duration (minutes)" value={durationStr} onChange={setDurationStr} id="tl-d" />
          <RetroInput label="Interval (seconds)" value={intervalStr} onChange={setIntervalStr} id="tl-i" />
          <RetroInput label="Clip Framerate (FPS)" value={fpsStr} onChange={setFpsStr} id="tl-fps" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Total Frames" value={results.totalFrames.toString()} large />
              <ResultDisplay label="Clip Duration (sec)" value={results.clipLength.toFixed(1)} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
