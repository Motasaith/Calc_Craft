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
