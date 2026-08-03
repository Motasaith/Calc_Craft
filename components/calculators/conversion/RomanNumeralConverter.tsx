'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RomanNumeralConverter() {
  const [numStr, setNumStr] = useState('42')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, roman: '' }
    const num = parseInt(numStr)
    if (isNaN(num) || num <= 0 || num > 3999) return { ...defaultObj, error: 'Please enter an integer between 1 and 3999.' }
    
    const lookup: Record<string, number> = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }
    let roman = ''
    let temp = num
    for (let key in lookup) {
      while (temp >= lookup[key]) {
        roman += key
        temp -= lookup[key]
      }
    }
    return { error: null, roman }
  }, [numStr])

  return (
    <FormCalculatorShell title="Roman Numeral Converter" subtitle="Convert standard decimal integers to Roman numerals" badge="CONVERSION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Decimal Integer (1-3999)" value={numStr} onChange={setNumStr} id="rnc-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Roman Numeral" value={results.roman} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
