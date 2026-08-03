'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ColorConverter() {
  const [hex, setHex] = useState('#ff0000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, rgb: '', hsl: '' }
    const cleaned = hex.trim().replace('#', '')
    if (cleaned.length !== 6 && cleaned.length !== 3) {
      return { ...defaultObj, error: 'Please enter a valid 3 or 6 digit HEX code.' }
    }
    let r = 0, g = 0, b = 0
    if (cleaned.length === 6) {
      r = parseInt(cleaned.substring(0, 2), 16)
      g = parseInt(cleaned.substring(2, 4), 16)
      b = parseInt(cleaned.substring(4, 6), 16)
    } else {
      r = parseInt(cleaned[0] + cleaned[0], 16)
      g = parseInt(cleaned[1] + cleaned[1], 16)
      b = parseInt(cleaned[2] + cleaned[2], 16)
    }

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return { ...defaultObj, error: 'Invalid hex digits entered.' }
    }

    const rgb = `rgb(${r}, ${g}, ${b})`
    return { error: null, rgb, hsl: 'Not calculated' }
  }, [hex])

  return (
    <FormCalculatorShell title="Color Format Converter" subtitle="Convert HEX colors to RGB format" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="HEX Value" value={hex} onChange={setHex} id="cc-hex" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="RGB Format" value={results.rgb} large />
              <div className="w-16 h-16 rounded border border-neutral-300 shadow-inner" style={{backgroundColor: hex}} />
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
