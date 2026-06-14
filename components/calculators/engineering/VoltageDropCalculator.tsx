'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function VoltageDropCalculator() {
  const [material, setMaterial] = useState('copper')
  const [current, setCurrent] = useState('10')
  const [length, setLength] = useState('50')
  const [area, setArea] = useState('2.5')
  const [voltage, setVoltage] = useState('230')
  const [result, setResult] = useState<{drop:number,percent:number,endV:number}|null>(null)

  const calculate = () => {
    const i = parseFloat(current), l = parseFloat(length), a = parseFloat(area), v = parseFloat(voltage)
    if (isNaN(i)||isNaN(l)||isNaN(a)||isNaN(v) || a<=0) { setResult(null); return }
    const rho = material === 'copper' ? 0.0172 : 0.0282
    const drop = (2 * rho * l * i) / a
    const percent = (drop / v) * 100
    setResult({ drop, percent, endV: v - drop })
  }

  return (
    <FormCalculatorShell title="Voltage Drop" badge="ENGINEERING">
      <RetroSelect label="Material" value={material} onChange={setMaterial} options={[{value:'copper',label:'Copper'},{value:'aluminum',label:'Aluminum'}]} id="vd-mat" />
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Current (A)" value={current} onChange={setCurrent} placeholder="10" id="vd-i" /><RetroInput label="Length (m)" value={length} onChange={setLength} placeholder="50" id="vd-l" /></div>
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Area (mm²)" value={area} onChange={setArea} placeholder="2.5" id="vd-a" /><RetroInput label="Voltage (V)" value={voltage} onChange={setVoltage} placeholder="230" id="vd-v" /></div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Voltage Drop" value={`${result.drop.toFixed(2)} V`} />
          <ResultDisplay label="Drop %" value={`${result.percent.toFixed(2)}%`} />
          <ResultDisplay label="End Voltage" value={`${result.endV.toFixed(2)} V`} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
