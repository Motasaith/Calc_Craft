import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Completing Sign In',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SSOCallbackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
