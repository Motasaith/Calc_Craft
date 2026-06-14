'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

function toRoman(num: number): string {
  const map: [number, string][] = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]
  let res = ''
  for (const [v, s] of map) { while (num >= v) { res += s; num -= v } }
  return res
}

function fromRoman(str: string): number {
  const map: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 }
  let total = 0, prev = 0
  for (const ch of str.toUpperCase().split('').reverse()) {
    const val = map[ch] || 0
    if (val < prev) total -= val
    else total += val
    prev = val
  }
  return total
}

export default function RomanNumeralConverter() {
  const [mode, setMode] = useState<'toRoman' | 'fromRoman'>('toRoman')
  const [val, setVal] = useState('2024')
  const [result, setResult] = useState('')

  const calculate = () => {
    if (mode === 'toRoman') {
      const n = parseInt(val)
      if (isNaN(n) || n <= 0 || n > 3999) { setResult('Enter 1–3999'); return }
      setResult(toRoman(n))
    } else {
      const r = fromRoman(val)
      if (r === 0) { setResult('Invalid Roman numeral'); return }
      setResult(r.toString())
    }
  }

  return (
    <FormCalculatorShell title="Roman Numeral Converter" badge="CONVERSION">
      <RetroSelect label="Direction" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'toRoman',label:'Number → Roman'},{value:'fromRoman',label:'Roman → Number'}]} id="rom-mode" />
      <RetroInput label={mode === 'toRoman' ? 'Number' : 'Roman Numeral'} value={val} onChange={setVal} placeholder={mode === 'toRoman' ? '2024' : 'MMXXIV'} id="rom-val" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
