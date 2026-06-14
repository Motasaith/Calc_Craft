'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function HistogramCalculator() {
  const [data, setData] = useState('12,15,18,21,24,27,30,33,36,39,42,45,48,51,54')
  const [bins, setBins] = useState('5')
  const [result, setResult] = useState<{binWidth:number,frequencies:number[],ranges:string[]}|null>(null)

  const calculate = () => {
    const arr = data.split(',').map(Number).filter(n => !isNaN(n)).sort((a,b) => a-b)
    const b = parseInt(bins)
    if (arr.length === 0 || isNaN(b) || b<=0) { setResult(null); return }
    const min = arr[0], max = arr[arr.length-1]
    const width = (max - min) / b
    const frequencies = Array(b).fill(0)
    const ranges: string[] = []
    for (let i = 0; i < b; i++) {
      const lo = min + i*width, hi = min + (i+1)*width
      ranges.push(`${lo.toFixed(1)} - ${hi.toFixed(1)}`)
      frequencies[i] = arr.filter(x => x >= lo && (i === b-1 ? x <= hi : x < hi)).length
    }
    setResult({ binWidth: width, frequencies, ranges })
  }

  return (
    <FormCalculatorShell title="Histogram Calculator" badge="STATISTICS">
      <RetroInput label="Data (comma sep)" value={data} onChange={setData} placeholder="12,15,18,21,24,27,30,33,36,39,42,45,48,51,54" id="hist-d" />
      <RetroInput label="Number of Bins" value={bins} onChange={setBins} placeholder="5" id="hist-b" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="mt-4 space-y-1">
          <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase">Bin Width: {result.binWidth.toFixed(2)}</div>
          {result.ranges.map((r,i) => (
            <div key={i} className="flex justify-between text-sm font-mono"><span>{r}</span><span className="font-bold">{result.frequencies[i]}</span></div>
          ))}
        </div>
      )}
    </FormCalculatorShell>
  )
}
