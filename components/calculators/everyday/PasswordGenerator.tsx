'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroSlider, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [upper, setUpper] = useState(true); const [lower, setLower] = useState(true)
  const [numbers, setNumbers] = useState(true); const [symbols, setSymbols] = useState(true)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = () => {
    let chars = ''
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz'
    if (numbers) chars += '0123456789'
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz'

    let pw = ''
    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    for (let i = 0; i < length; i++) pw += chars[arr[i] % chars.length]
    setPassword(pw); setCopied(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(password).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  // Strength meter
  const strength = (upper ? 1 : 0) + (lower ? 1 : 0) + (numbers ? 1 : 0) + (symbols ? 1 : 0) + (length >= 16 ? 1 : length >= 12 ? 0.5 : 0)
  const strengthLabel = strength >= 4 ? 'Strong' : strength >= 3 ? 'Good' : strength >= 2 ? 'Fair' : 'Weak'

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!checked)}
      className={`py-1.5 px-2 text-[10px] font-bold font-mono rounded border transition-all ${checked ? 'bg-[#4c5c4a] text-white border-[#3a4a38]' : 'bg-neutral-200 text-neutral-500 border-neutral-300'}`}>
      {label}
    </button>
  )

  return (
    <FormCalculatorShell title="Password Generator" badge="EVERYDAY">
      <RetroSlider label="Length" value={length} onChange={setLength} min={4} max={64} step={1} displayValue={`${length} chars`} id="pw-len" />
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        <Toggle label="ABC" checked={upper} onChange={setUpper} />
        <Toggle label="abc" checked={lower} onChange={setLower} />
        <Toggle label="123" checked={numbers} onChange={setNumbers} />
        <Toggle label="#$%" checked={symbols} onChange={setSymbols} />
      </div>

      <RetroActionButton onClick={generate} variant="primary" fullWidth>Generate Password</RetroActionButton>

      {password && (
        <div className="mt-4">
          <div className="bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-lg p-3 shadow-inner">
            <div className="font-mono font-bold text-[#1a2019] text-sm break-all select-all">{password}</div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-mono font-bold text-neutral-600">Strength: {strengthLabel}</span>
            <button onClick={copy} className="text-[10px] font-mono font-bold text-[#4c5c4a] hover:text-[#1a2019] transition-colors">
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-200 mt-1 overflow-hidden">
            <div className={`h-full transition-all rounded-full ${strength >= 4 ? 'bg-green-600' : strength >= 3 ? 'bg-yellow-500' : strength >= 2 ? 'bg-orange-500' : 'bg-red-500'}`}
              style={{ width: `${(strength / 5) * 100}%` }} />
          </div>
        </div>
      )}
    </FormCalculatorShell>
  )
}
