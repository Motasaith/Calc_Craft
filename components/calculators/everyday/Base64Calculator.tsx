'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function Base64Calculator() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [text, setText] = useState('Hello World')
  const [result, setResult] = useState('')

  const calculate = () => {
    try {
      if (mode === 'encode') setResult(btoa(text))
      else setResult(atob(text))
    } catch { setResult('Invalid input') }
  }

  return (
    <FormCalculatorShell title="Base64 Encode / Decode" badge="EVERYDAY">
      <RetroSelect label="Mode" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'encode',label:'Encode'},{value:'decode',label:'Decode'}]} id="b64-mode" />
      <RetroInput label="Text" value={text} onChange={setText} placeholder="Hello World" id="b64-text" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>{mode === 'encode' ? 'Encode' : 'Decode'}</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
