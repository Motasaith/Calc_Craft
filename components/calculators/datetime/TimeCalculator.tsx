'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { hmsToSeconds, secondsToHMS } from '@/lib/calc-engine'

export default function TimeCalculator() {
  const [h1, setH1] = useState(''); const [m1, setM1] = useState(''); const [s1, setS1] = useState('')
  const [h2, setH2] = useState(''); const [m2, setM2] = useState(''); const [s2, setS2] = useState('')
  const [op, setOp] = useState('+')
  const [result, setResult] = useState<string | null>(null)

  const calculate = () => {
    const t1 = hmsToSeconds(Number(h1 || '0'), Number(m1 || '0'), Number(s1 || '0'))
    const t2 = hmsToSeconds(Number(h2 || '0'), Number(m2 || '0'), Number(s2 || '0'))
    const total = op === '+' ? t1 + t2 : t1 - t2
    const hms = secondsToHMS(total)
    setResult(`${hms.negative ? '−' : ''}${hms.hours}h ${hms.minutes}m ${hms.seconds}s`)
  }

  return (
    <FormCalculatorShell title="Time Calculator" subtitle="Add or subtract time" badge="DATE & TIME">
      <div className="text-[10px] font-bold text-neutral-600 font-mono uppercase mb-1.5">Time 1</div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <RetroInput label="Hours" value={h1} onChange={setH1} placeholder="1" id="tc-h1" />
        <RetroInput label="Minutes" value={m1} onChange={setM1} placeholder="30" id="tc-m1" />
        <RetroInput label="Seconds" value={s1} onChange={setS1} placeholder="0" id="tc-s1" />
      </div>
      <RetroSelect label="Operation" value={op} onChange={setOp} id="tc-op"
        options={[{ value: '+', label: 'Add (+)' }, { value: '-', label: 'Subtract (−)' }]} />
      <div className="text-[10px] font-bold text-neutral-600 font-mono uppercase mb-1.5">Time 2</div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <RetroInput label="Hours" value={h2} onChange={setH2} placeholder="0" id="tc-h2" />
        <RetroInput label="Minutes" value={m2} onChange={setM2} placeholder="45" id="tc-m2" />
        <RetroInput label="Seconds" value={s2} onChange={setS2} placeholder="0" id="tc-s2" />
      </div>
      <RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
