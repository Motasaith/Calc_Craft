'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Printer, Link as LinkIcon, Check } from 'lucide-react'

interface ShareExportPanelProps {
  queryParams: string
  emailSubject: string
  emailBody: string
}

export default function ShareExportPanel({
  queryParams,
  emailSubject,
  emailBody,
}: ShareExportPanelProps) {
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const base = window.location.origin + window.location.pathname
      setShareUrl(queryParams ? `${base}?${queryParams}` : base)
    }
  }, [queryParams])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link', err)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const mailToUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
    emailBody + '\n\nLink to calculation: ' + shareUrl
  )}`

  return (
    <div className="mt-6 pt-4 border-t-2 border-[#dad6cd] font-mono no-print">
      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
        Share or Export Calculation
      </span>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border-2 border-neutral-300 bg-[#fcfbfa] hover:border-neutral-400 active:scale-95 transition-all text-neutral-700 font-mono shadow-sm"
          title="Copy shareable link with current inputs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Link Copied!
            </>
          ) : (
            <>
              <LinkIcon className="w-3.5 h-3.5 text-neutral-500" />
              Copy Share Link
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border-2 border-neutral-300 bg-[#fcfbfa] hover:border-neutral-400 active:scale-95 transition-all text-neutral-700 font-mono shadow-sm"
          title="Print this page or save as PDF"
        >
          <Printer className="w-3.5 h-3.5 text-neutral-500" />
          Print / Save PDF
        </button>

        <a
          href={mailToUrl}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border-2 border-neutral-300 bg-[#fcfbfa] hover:border-neutral-400 active:scale-95 transition-all text-neutral-700 font-mono shadow-sm"
          title="Email results to someone"
        >
          <Mail className="w-3.5 h-3.5 text-neutral-500" />
          Email Result
        </a>
      </div>
    </div>
  )
}
