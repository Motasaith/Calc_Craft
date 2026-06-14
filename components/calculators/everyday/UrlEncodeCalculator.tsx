'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function UrlEncodeCalculator() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [text, setText] = useState('hello world')
  const [result, setResult] = useState('')

  const calculate = () => {
    try {
      if (mode === 'encode') setResult(encodeURIComponent(text))
      else setResult(decodeURIComponent(text))
    } catch { setResult('Invalid input') }
  }

  return (
    <FormCalculatorShell title="URL Encode / Decode" badge="EVERYDAY">
      <RetroSelect label="Mode" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'encode',label:'Encode'},{value:'decode',label:'Decode'}]} id="url-mode" />
      <RetroInput label="Text" value={text} onChange={setText} placeholder="hello world" id="url-text" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>{mode === 'encode' ? 'Encode' : 'Decode'}</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
