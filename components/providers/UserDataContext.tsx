'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { CustomCalculatorConfig } from '@/components/calculators/shared/CustomCalculatorRenderer'

interface UserDataContextType {
  customCalculators: CustomCalculatorConfig[]
  savedCalculators: string[]
  isLoadingData: boolean
  isSyncing: boolean
  addCustomCalculator: (config: CustomCalculatorConfig) => void
  removeCustomCalculator: (id: string) => void
  addSavedCalculator: (slug: string) => void
  removeSavedCalculator: (slug: string) => void
}

const UserDataContext = createContext<UserDataContextType>({
  customCalculators: [],
  savedCalculators: [],
  isLoadingData: true,
  isSyncing: false,
  addCustomCalculator: () => {},
  removeCustomCalculator: () => {},
  addSavedCalculator: () => {},
  removeSavedCalculator: () => {},
})

const WP_API_BASE = 'https://cms.homeofcalculators.com/wp-json'

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth()
  
  const [customCalculators, setCustomCalculators] = useState<CustomCalculatorConfig[]>([])
  const [savedCalculators, setSavedCalculators] = useState<string[]>([])
  
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  // Load from local storage initially
  useEffect(() => {
    const localCustom = localStorage.getItem('my_custom_calculators')
    const localSaved = localStorage.getItem('my_saved_calculators')

    if (localCustom) {
      try { setCustomCalculators(JSON.parse(localCustom)) } catch (e) {}
    }
    if (localSaved) {
      try { setSavedCalculators(JSON.parse(localSaved)) } catch (e) {}
    }
    setIsLoadingData(false)
  }, [])

  // Sync from WordPress when user logs in
  useEffect(() => {
    if (!user || !token) return

    async function fetchUserData() {
      setIsSyncing(true)
      try {
        const res = await fetch(`${WP_API_BASE}/wp/v2/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (res.ok) {
          const data = await res.json()
          
          // WP REST API returns custom meta fields in the 'meta' object if registered
          const remoteCustom = data.meta?.custom_calculators
          const remoteSaved = data.meta?.saved_tools

          let updatedCustom = [...customCalculators]
          let updatedSaved = [...savedCalculators]

          if (remoteCustom) {
            try {
              const parsed = JSON.parse(remoteCustom)
              updatedCustom = parsed
              setCustomCalculators(parsed)
              localStorage.setItem('my_custom_calculators', JSON.stringify(parsed))
            } catch (e) {}
          }
          
          if (remoteSaved) {
            try {
              const parsed = JSON.parse(remoteSaved)
              updatedSaved = parsed
              setSavedCalculators(parsed)
              localStorage.setItem('my_saved_calculators', JSON.stringify(parsed))
            } catch (e) {}
          }
        }
      } catch (err) {
        console.error('Failed to sync user data from WordPress:', err)
      } finally {
        setIsSyncing(false)
      }
    }

    fetchUserData()
  }, [user, token]) // intentionally running when user/token changes to grab remote state

  // Helper to sync to WP
  const syncToWordPress = async (newCustom: CustomCalculatorConfig[], newSaved: string[]) => {
    if (!user || !token) return // Don't sync if not logged in
    
    setIsSyncing(true)
    try {
      await fetch(`${WP_API_BASE}/wp/v2/users/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          meta: {
            custom_calculators: JSON.stringify(newCustom),
            saved_tools: JSON.stringify(newSaved)
          }
        })
      })
    } catch (err) {
      console.error('Failed to save to WordPress:', err)
    } finally {
      setIsSyncing(false)
    }
  }

  // --- Actions ---

  const addCustomCalculator = useCallback((config: CustomCalculatorConfig) => {
    setCustomCalculators(prev => {
      const updated = prev.filter(c => c.id !== config.id)
      updated.push(config)
      localStorage.setItem('my_custom_calculators', JSON.stringify(updated))
      syncToWordPress(updated, savedCalculators)
      return updated
    })
  }, [user, token, savedCalculators])

  const removeCustomCalculator = useCallback((id: string) => {
    setCustomCalculators(prev => {
      const updated = prev.filter(c => c.id !== id)
      localStorage.setItem('my_custom_calculators', JSON.stringify(updated))
      syncToWordPress(updated, savedCalculators)
      return updated
    })
  }, [user, token, savedCalculators])

  const addSavedCalculator = useCallback((slug: string) => {
    setSavedCalculators(prev => {
      if (prev.includes(slug)) return prev
      const updated = [...prev, slug]
      localStorage.setItem('my_saved_calculators', JSON.stringify(updated))
      syncToWordPress(customCalculators, updated)
      return updated
    })
  }, [user, token, customCalculators])

  const removeSavedCalculator = useCallback((slug: string) => {
    setSavedCalculators(prev => {
      const updated = prev.filter(s => s !== slug)
      localStorage.setItem('my_saved_calculators', JSON.stringify(updated))
      syncToWordPress(customCalculators, updated)
      return updated
    })
  }, [user, token, customCalculators])

  return (
    <UserDataContext.Provider 
      value={{ 
        customCalculators, 
        savedCalculators, 
        isLoadingData, 
        isSyncing,
        addCustomCalculator,
        removeCustomCalculator,
        addSavedCalculator,
        removeSavedCalculator
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

export const useUserData = () => useContext(UserDataContext)
