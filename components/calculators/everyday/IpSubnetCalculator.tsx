'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function IpSubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.1')
  const [cidr, setCidr] = useState('24')
  const [result, setResult] = useState<{network:string,mask:string,hosts:number,first:string,last:string}|null>(null)

  const ipToLong = (ip: string) => ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0
  const longToIp = (long: number) => [(long >>> 24) & 0xFF, (long >>> 16) & 0xFF, (long >>> 8) & 0xFF, long & 0xFF].join('.')

  const calculate = () => {
    try {
      const c = parseInt(cidr)
      if (isNaN(c) || c < 1 || c > 30) { setResult(null); return }
      const ipLong = ipToLong(ip)
      const mask = 0xFFFFFFFF << (32 - c)
      const network = ipLong & mask
      const broadcast = network | (~mask >>> 0)
      const hosts = Math.pow(2, 32 - c) - 2
      setResult({
        network: longToIp(network) + '/' + c,
        mask: longToIp(mask >>> 0),
        hosts: Math.max(0, hosts),
        first: longToIp(network + 1),
        last: longToIp(broadcast - 1)
      })
    } catch { setResult(null) }
  }

  return (
    <FormCalculatorShell title="IP Subnet Calculator" badge="EVERYDAY">
      <RetroInput label="IP Address" value={ip} onChange={setIp} placeholder="192.168.1.1" id="ip-addr" />
      <RetroInput label="CIDR (1-30)" value={cidr} onChange={setCidr} placeholder="24" id="ip-cidr" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Network" value={result.network} />
          <ResultDisplay label="Subnet Mask" value={result.mask} />
          <ResultDisplay label="Usable Hosts" value={result.hosts} />
          <ResultDisplay label="Range" value={`${result.first} – ${result.last}`} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
