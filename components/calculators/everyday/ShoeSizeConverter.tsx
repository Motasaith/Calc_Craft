'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

const MEN_SIZES: Record<string, {us:number,uk:number,eu:number,cm:number}> = {}
for (let us = 4; us <= 16; us += 0.5) {
  const uk = us - 1
  const eu = Math.round(us * 1.27 + 23.5)
  const cm = Math.round((us + 10) * 0.847 * 10) / 10
  MEN_SIZES[us.toFixed(1)] = { us, uk, eu, cm }
}

export default function ShoeSizeConverter() {
  const [size, setSize] = useState('10')
  const [system, setSystem] = useState<'us' | 'uk' | 'eu' | 'cm'>('us')
  const [result, setResult] = useState<{us:number,uk:number,eu:number,cm:number}|null>(null)

  const calculate = () => {
    const s = parseFloat(size)
    if (isNaN(s)) { setResult(null); return }
    let us = s
    if (system === 'uk') us = s + 1
    else if (system === 'eu') us = (s - 23.5) / 1.27
    else if (system === 'cm') us = s / 0.847 - 10
    const uk = us - 1
    const eu = Math.round(us * 1.27 + 23.5)
    const cm = Math.round((us + 10) * 0.847 * 10) / 10
    setResult({ us: Math.round(us * 2) / 2, uk: Math.round(uk * 2) / 2, eu, cm })
  }

  return (
    <FormCalculatorShell title="Shoe Size Converter" badge="EVERYDAY">
      <RetroInput label="Size" value={size} onChange={setSize} placeholder="10" id="shoe-size" />
      <RetroSelect label="System" value={system} onChange={(v) => setSystem(v as any)} options={[{value:'us',label:'US'},{value:'uk',label:'UK'},{value:'eu',label:'EU'},{value:'cm',label:'CM'}]} id="shoe-sys" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="US" value={result.us.toFixed(1)} />
          <ResultDisplay label="UK" value={result.uk.toFixed(1)} />
          <ResultDisplay label="EU" value={result.eu} />
          <ResultDisplay label="CM" value={result.cm} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
