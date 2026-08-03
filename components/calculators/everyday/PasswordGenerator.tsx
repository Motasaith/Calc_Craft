'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PasswordGenerator() {
  const [lengthStr, setLengthStr] = useState('12')
  const [trigger, setTrigger] = useState(0) // increment to regenerate

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, password: '' }
    const len = parseInt(lengthStr)
    if (isNaN(len) || len < 6 || len > 64) {
      return { ...defaultObj, error: 'Password length must be between 6 and 64.' }
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
    let password = ''
    for (let i = 0; i < len; i++) {
      const idx = Math.floor(Math.random() * chars.length)
      password += chars[idx]
    }

    return { error: null, password }
  }, [lengthStr, trigger])

  return (
    <FormCalculatorShell title="Secure Password Generator" subtitle="Generate random cryptographic passwords inside custom lengths" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Length (6 to 64)" value={lengthStr} onChange={setLengthStr} id="pwg-l" />
          <button
            onClick={() => setTrigger(p => p + 1)}
            className="w-full bg-neutral-900 text-white font-mono p-3 rounded hover:bg-neutral-800 transition"
          >
            Regenerate Password
          </button>
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Generated Password" value={results.password} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
