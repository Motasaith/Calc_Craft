'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

type Mode = 'deg-to-rad' | 'rad-to-deg' | 'deg-to-grad'

export default function DegRadCalculator() {
  const [mode, setMode] = useState<Mode>('deg-to-rad')
  const [valStr, setValStr] = useState('180')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      val: 0,
      rad: 0,
      deg: 0,
      grad: 0,
      steps: [] as string[]
    }

    const v = parseFloat(valStr)
    if (isNaN(v)) {
      return { ...defaultObj, error: 'Please enter a valid number.' }
    }

    let rad = 0, deg = 0, grad = 0
    let steps: string[] = []

    if (mode === 'deg-to-rad') {
      deg = v
      rad = v * Math.PI / 180
      grad = v * (200 / 180)
      steps = [
        `Degrees: ${v}°`,
        `Radians = Degrees × (π / 180) = ${v} × (3.14159 / 180) = ${rad.toFixed(6)} rad`,
        `Gradians = Degrees × (200 / 180) = ${grad.toFixed(4)} grad`
      ]
    } else if (mode === 'rad-to-deg') {
      rad = v
      deg = v * 180 / Math.PI
      grad = v * (200 / Math.PI)
      steps = [
        `Radians: ${v} rad`,
        `Degrees = Radians × (180 / π) = ${v} × (180 / 3.14159) = ${deg.toFixed(4)}°`,
        `Gradians = Radians × (200 / π) = ${grad.toFixed(4)} grad`
      ]
    } else {
      deg = v * 0.9
      grad = v
      rad = deg * Math.PI / 180
      steps = [
        `Gradians: ${v} grad`,
        `Degrees = Gradians × 0.9 = ${deg.toFixed(4)}°`,
        `Radians = Degrees × (π / 180) = ${rad.toFixed(6)} rad`
      ]
    }

    return {
      error: null,
      val: v,
      rad,
      deg,
      grad,
      steps
    }
  }, [mode, valStr])

  // SVG representation: angle arc dial
  const angleSvg = useMemo(() => {
    if (results.error) return null
    // Clamp to 360 degrees for display
    const clampedDeg = (results.deg % 360 + 360) % 360
    const radAngle = clampedDeg * (Math.PI / 180)
    // Coords on circle (r=30, center 60,60)
    const targetX = 60 + 30 * Math.cos(radAngle)
    const targetY = 60 - 30 * Math.sin(radAngle)
    const largeArcFlag = clampedDeg > 180 ? 1 : 0

    return {
      tx: targetX,
      ty: targetY,
      largeArcFlag,
      deg: clampedDeg
    }
  }, [results])

  return (
    <FormCalculatorShell title="Degrees ↔ Radians ↔ Gradians" subtitle="Convert between different angular measurements" badge="TRIGONOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Conversion Type"
            value={mode}
            onChange={(v) => setMode(v as Mode)}
            id="dr-mode"
            options={[
              { value: 'deg-to-rad', label: 'Degrees → Radians & Gradians' },
              { value: 'rad-to-deg', label: 'Radians → Degrees & Gradians' },
              { value: 'deg-to-grad', label: 'Gradians → Degrees & Radians' }
            ]}
          />
          <RetroInput label="Input Value" value={valStr} onChange={setValStr} id="dr-v" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Degrees" value={`${results.deg.toFixed(4)}°`} />
                <ResultDisplay label="Radians" value={`${results.rad.toFixed(6)} rad`} />
                <ResultDisplay label="Gradians" value={`${results.grad.toFixed(4)} grad`} />
              </div>

              {angleSvg && (
                <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">Angle Arc representation</p>
                  <svg viewBox="0 0 120 120" className="w-32 h-32">
                    <circle cx="60" cy="60" r="35" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
                    <line x1="60" y1="60" x2="95" y2="60" stroke="#9ca3af" strokeWidth="1.5" />
                    <line x1="60" y1="60" x2={angleSvg.tx} y2={angleSvg.ty} stroke="#b5655c" strokeWidth="2.5" />
                    {angleSvg.deg > 0 && (
                      <path
                        d={`M 80 60 A 20 20 0 ${angleSvg.largeArcFlag} 0 ${60 + 20 * Math.cos(angleSvg.deg * Math.PI / 180)} ${60 - 20 * Math.sin(angleSvg.deg * Math.PI / 180)}`}
                        fill="none"
                        stroke="#b5655c"
                        strokeWidth="1.5"
                      />
                    )}
                  </svg>
                </div>
              )}

              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Conversion Steps</p>
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
