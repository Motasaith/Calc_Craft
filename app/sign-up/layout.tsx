import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create an account on Home of Calculators to customize and embed calculators.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
