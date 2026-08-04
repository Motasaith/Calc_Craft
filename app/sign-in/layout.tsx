import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Home of Calculators account to access saved calculators and visual builder tools.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
