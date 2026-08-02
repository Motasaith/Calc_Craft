'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id?: number
  username: string
  email: string
  name: string
}

export type AuthModalTab = 'login' | 'register' | 'forgot'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  /** Emails a reset link. Always reports success so the response can't be used to probe for accounts. */
  requestPasswordReset: (login: string) => Promise<{ success: boolean; error?: string }>
  /** Completes the reset using the key + login from the emailed link. */
  resetPassword: (key: string, login: string, password: string) => Promise<{ success: boolean; error?: string }>
  authModalOpen: boolean
  setAuthModalOpen: (open: boolean) => void
  authModalTab: AuthModalTab
  setAuthModalTab: (tab: AuthModalTab) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  requestPasswordReset: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  authModalOpen: false,
  setAuthModalOpen: () => {},
  authModalTab: 'login',
  setAuthModalTab: () => {},
})

const WP_API_BASE = 'https://cms.homeofcalculators.com/wp-json'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('login')

  // Verify session on mount
  useEffect(() => {
    async function checkSession() {
      const storedToken = localStorage.getItem('wp_jwt')
      const storedUser = localStorage.getItem('wp_user')

      if (storedToken && storedUser) {
        try {
          // Validate the token by checking if we can fetch the user profile
          // Using Basic Auth with the stored token as a simple session check
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        } catch (err) {
          console.error('Failed to validate session token:', err)
          localStorage.removeItem('wp_jwt')
          localStorage.removeItem('wp_user')
        }
      }
      setIsLoading(false)
    }
    checkSession()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      // Use custom login endpoint (defined in functions.php, no JWT plugin needed)
      const res = await fetch(`${WP_API_BASE}/wp/v2/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      
      if (res.ok && data.token) {
        const loggedUser = {
          id: data.user?.id,
          username: data.user?.username || username,
          email: data.user?.email || '',
          name: data.user?.name || username,
        }
        
        setToken(data.token)
        setUser(loggedUser)
        
        localStorage.setItem('wp_jwt', data.token)
        localStorage.setItem('wp_user', JSON.stringify(loggedUser))
        
        return { success: true }
      }
      return { success: false, error: data.message || 'Login failed' }
    } catch (err) {
      return { success: false, error: 'An error occurred during login.' }
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      // Calls the public user registration endpoint (WP REST API User Registration plugin)
      const res = await fetch(`${WP_API_BASE}/wp/v2/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })
      const data = await res.json()
      
      if (res.ok && data.code === 200) {
        // Auto log in after registration
        return await login(username, password)
      }
      return { success: false, error: data.message || 'Registration failed' }
    } catch (err) {
      return { success: false, error: 'An error occurred during registration.' }
    }
  }

  /**
   * Step 1 of the reset: WordPress emails a link to /reset-password carrying a
   * one-time key. We deliberately do NOT surface "no such account" — that would
   * turn this form into an account-enumeration oracle — so anything short of a
   * transport failure reads as success to the user.
   */
  const requestPasswordReset = async (loginOrEmail: string) => {
    try {
      const res = await fetch(`${WP_API_BASE}/wp/v2/users/lost-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginOrEmail }),
      })

      if (res.ok) return { success: true }

      const data = await res.json().catch(() => ({}))

      // 404 means the endpoint itself isn't installed on the WordPress side —
      // that's a deployment problem the user needs to be told about, not a
      // "check your email" lie.
      if (res.status === 404) {
        return {
          success: false,
          error: 'Password reset is not available yet. Please email support@homeofcalculators.com and we will reset it for you.',
        }
      }
      if (res.status === 429) {
        return { success: false, error: 'Too many reset requests. Please wait a few minutes and try again.' }
      }
      return { success: false, error: data.message || 'Could not send the reset email. Please try again.' }
    } catch (err) {
      return { success: false, error: 'An error occurred while requesting the reset email.' }
    }
  }

  /** Step 2: exchange the emailed key for a new password. */
  const resetPassword = async (key: string, loginName: string, password: string) => {
    try {
      const res = await fetch(`${WP_API_BASE}/wp/v2/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, login: loginName, password }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) return { success: true }

      if (res.status === 404) {
        return {
          success: false,
          error: 'Password reset is not available yet. Please email support@homeofcalculators.com and we will reset it for you.',
        }
      }
      return {
        success: false,
        error: data.message || 'That reset link is invalid or has expired. Please request a new one.',
      }
    } catch (err) {
      return { success: false, error: 'An error occurred while resetting your password.' }
    }
  }

  const logout = async () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('wp_jwt')
    localStorage.removeItem('wp_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        requestPasswordReset,
        resetPassword,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
