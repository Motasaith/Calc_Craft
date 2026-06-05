'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateBodyFatNavy } from '@/lib/calc-engine'

export default function BodyFatCalculator() {
  const [gender, setGender] = useState('male')
  const [waist, setWaist] = useState(''); const [neck, setNeck] = useState(''); const [height, setHeight] = useState(''); const [hip, setHip] = useState('')

  const w = parseFloat(waist), n = parseFloat(neck), h = parseFloat(height), hp = parseFloat(hip)
  const sex = gender === 'male' ? 'male' : 'female' as 'male' | 'female'
  const bf = (() => {
    if (gender === 'male' && !isNaN(w) && !isNaN(n) && !isNaN(h) && w > n && h > 0) {
      return calculateBodyFatNavy('male', h, w, n)
    }
    if (gender === 'female' && !isNaN(w) && !isNaN(n) && !isNaN(h) && !isNaN(hp) && (w + hp - n) > 0 && h > 0) {
      return calculateBodyFatNavy('female', h, w, n, hp)
    }
    return 0
  })()

  const getCategory = (bf: number, g: string) => {
    if (g === 'male') {
      if (bf < 6) return 'Essential Fat'
      if (bf < 14) return 'Athletes'
      if (bf < 18) return 'Fitness'
      if (bf < 25) return 'Average'
      return 'Above Average'
    } else {
      if (bf < 14) return 'Essential Fat'
      if (bf < 21) return 'Athletes'
      if (bf < 25) return 'Fitness'
      if (bf < 32) return 'Average'
      return 'Above Average'
    }
  }

  return (
    <FormCalculatorShell title="Body Fat Calculator" subtitle="US Navy Method" badge="HEALTH">
      <RetroSelect label="Gender" value={gender} onChange={setGender} id="bf-g"
        options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Waist" value={waist} onChange={setWaist} placeholder="85" id="bf-w" unit="cm" />
        <RetroInput label="Neck" value={neck} onChange={setNeck} placeholder="38" id="bf-n" unit="cm" />
      </div>
      <RetroInput label="Height" value={height} onChange={setHeight} placeholder="175" id="bf-h" unit="cm" />
      {gender === 'female' && <RetroInput label="Hip" value={hip} onChange={setHip} placeholder="95" id="bf-hp" unit="cm" />}

      {bf > 0 && bf < 60 && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ResultDisplay label="Body Fat %" value={`${bf.toFixed(1)}%`} large />
          <ResultDisplay label="Category" value={getCategory(bf, gender)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
