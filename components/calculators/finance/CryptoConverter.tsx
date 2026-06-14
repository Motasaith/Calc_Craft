'use client'
import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

const CRYPTO_RATES: Record<string, number> = { BTC: 65000, ETH: 3500, SOL: 150, ADA: 0.45, XRP: 0.55, DOGE: 0.16 }

export default function CryptoConverter() {
  const [amount, setAmount] = useState('1')
  const [from, setFrom] = useState('BTC')
  const [to, setTo] = useState('USD')
  const [rates, setRates] = useState(CRYPTO_RATES)
  const [result, setResult] = useState('')

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano,ripple,dogecoin&vs_currencies=usd').then(r => r.json()).then(d => {
      const mapped: Record<string, number> = {}
      if (d.bitcoin) mapped.BTC = d.bitcoin.usd
      if (d.ethereum) mapped.ETH = d.ethereum.usd
      if (d.solana) mapped.SOL = d.solana.usd
      if (d.cardano) mapped.ADA = d.cardano.usd
      if (d.ripple) mapped.XRP = d.ripple.usd
      if (d.dogecoin) mapped.DOGE = d.dogecoin.usd
      if (Object.keys(mapped).length > 0) setRates(mapped)
    }).catch(() => {})
  }, [])

  const calculate = () => {
    const amt = parseFloat(amount)
    if (isNaN(amt)) { setResult('Invalid'); return }
    const rate = rates[from] || 0
    if (to === 'USD') {
      setResult(`$${(amt * rate).toLocaleString('en-US', {maximumFractionDigits: 2})}`)
    } else {
      const toRate = rates[to] || 1
      setResult(`${(amt * rate / toRate).toFixed(6)} ${to}`)
    }
  }

  const cryptoOptions = Object.keys(rates).map(k => ({ value: k, label: k }))

  return (
    <FormCalculatorShell title="Crypto Converter" badge="FINANCE">
      <RetroInput label="Amount" value={amount} onChange={setAmount} placeholder="1" id="crypto-amt" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={cryptoOptions} id="crypto-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={[...cryptoOptions, {value:'USD',label:'USD'}]} id="crypto-to" />
      </div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
