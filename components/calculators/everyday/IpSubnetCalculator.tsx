'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function IpSubnetCalculator() {
  const [cidrStr, setCidrStr] = useState('24')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, hosts: 0 }
    const cidr = parseInt(cidrStr)
    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
      return { ...defaultObj, error: 'CIDR subnet prefix must be between 0 and 32.' }
    }
    const hosts = cidr === 32 || cidr === 31 ? 0 : Math.pow(2, 32 - cidr) - 2
    return { error: null, hosts }
  }, [cidrStr])

  return (
    <FormCalculatorShell title="IP Subnet Sizing Solver" subtitle="Calculate available host counts for CIDR network prefixes" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="CIDR Prefix (e.g. 24)" value={cidrStr} onChange={setCidrStr} id="ip-cidr" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Usable Hosts" value={results.hosts.toLocaleString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
