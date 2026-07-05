'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id?: number
  username: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
})

const WP_API_BASE = 'https://cms.homeofcalculators.com/wp-json'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verify session on mount
  useEffect(() => {
    async function checkSession() {
      const storedToken = localStorage.getItem('wp_jwt')
      const storedUser = localStorage.getItem('wp_user')

      if (storedToken && storedUser) {
        try {
          // Validate the token against WordPress
          const res = await fetch(`${WP_API_BASE}/jwt-auth/v1/token/validate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          })
          
          if (res.ok) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
          } else {
            // Token expired/invalid, clean up
            localStorage.removeItem('wp_jwt')
            localStorage.removeItem('wp_user')
          }
        } catch (err) {
          console.error('Failed to validate session token:', err)
          // Fallback to stored state if offline/WP is down
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      }
      setIsLoading(false)
    }
    checkSession()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${WP_API_BASE}/jwt-auth/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      
      if (res.ok && data.token) {
        const loggedUser = {
          username: data.user_nicename,
          email: data.user_email,
          name: data.user_display_name,
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

  const logout = async () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('wp_jwt')
    localStorage.removeItem('wp_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
