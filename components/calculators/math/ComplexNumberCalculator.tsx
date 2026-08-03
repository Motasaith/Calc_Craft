'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Op = 'add' | 'sub' | 'mul' | 'div'

export default function ComplexNumberCalculator() {
  const [r1Str, setR1Str] = useState('3')
  const [i1Str, setI1Str] = useState('2')
  const [r2Str, setR2Str] = useState('1')
  const [i2Str, setI2Str] = useState('-4')
  const [op, setOp] = useState<Op>('add')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, real: 0, imag: 0, steps: [] as string[] }
    const r1 = parseFloat(r1Str)
    const i1 = parseFloat(i1Str)
    const r2 = parseFloat(r2Str)
    const i2 = parseFloat(i2Str)

    if (isNaN(r1) || isNaN(i1) || isNaN(r2) || isNaN(i2)) {
      return { ...defaultObj, error: 'Please enter valid real and imaginary parts.' }
    }

    let real = 0, imag = 0
    let steps: string[] = []

    if (op === 'add') {
      real = r1 + r2
      imag = i1 + i2
      steps = [`(${r1} + ${i1}i) + (${r2} + ${i2}i) = (${r1}+${r2}) + (${i1}+${i2})i = ${real} + ${imag}i`]
    } else if (op === 'sub') {
      real = r1 - r2
      imag = i1 - i2
      steps = [`(${r1} + ${i1}i) - (${r2} + ${i2}i) = (${r1}-${r2}) + (${i1}-${i2})i = ${real} + ${imag}i`]
    } else if (op === 'mul') {
      real = r1 * r2 - i1 * i2
      imag = r1 * i2 + i1 * r2
      steps = [`(${r1} + ${i1}i) × (${r2} + ${i2}i) = (${r1}×${r2} - ${i1}×${i2}) + (${r1}×${i2} + ${i1}×${r2})i = ${real} + ${imag}i`]
    } else {
      const denom = r2 * r2 + i2 * i2
      if (denom === 0) return { ...defaultObj, error: 'Cannot divide by zero.' }
      real = (r1 * r2 + i1 * i2) / denom
      imag = (i1 * r2 - r1 * i2) / denom
      steps = [`Division by conjugation: Denominator = ${denom}`, `Result = ${real.toFixed(4)} + ${imag.toFixed(4)}i`]
    }

    return { error: null, real, imag, steps }
  }, [r1Str, i1Str, r2Str, i2Str, op])

  return (
    <FormCalculatorShell title="Complex Numbers Solver" subtitle="Perform operations on complex number coordinates" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Operation"
            value={op}
            onChange={(val) => setOp(val as Op)}
            id="cn-op"
            options={[
              { value: 'add', label: 'Addition (+)' },
              { value: 'sub', label: 'Subtraction (-)' },
              { value: 'mul', label: 'Multiplication (×)' },
              { value: 'div', label: 'Division (÷)' }
            ]}
          />
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Real Part (A)" value={r1Str} onChange={setR1Str} id="cn-r1" />
            <RetroInput label="Imaginary (A)" value={i1Str} onChange={setI1Str} id="cn-i1" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Real Part (B)" value={r2Str} onChange={setR2Str} id="cn-r2" />
            <RetroInput label="Imaginary (B)" value={i2Str} onChange={setI2Str} id="cn-i2" />
          </div>
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Complex Result" value={`${results.real.toFixed(2)} ${results.imag >= 0 ? '+' : ''} ${results.imag.toFixed(2)}i`} large />
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
