'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { CustomCalculatorConfig } from '@/components/calculators/shared/CustomCalculatorRenderer'

export interface EmbeddedCalculatorInfo {
  id: string // Slug for standard, ID for custom
  name: string
  isCustom: boolean
  embeddedAt: string
}

interface UserDataContextType {
  customCalculators: CustomCalculatorConfig[]
  savedCalculators: string[]
  embeddedCalculators: EmbeddedCalculatorInfo[]
  isLoadingData: boolean
  isSyncing: boolean
  addCustomCalculator: (config: CustomCalculatorConfig) => void
  removeCustomCalculator: (id: string) => void
  addSavedCalculator: (slug: string) => void
  removeSavedCalculator: (slug: string) => void
  addEmbeddedCalculator: (info: EmbeddedCalculatorInfo) => void
}

const UserDataContext = createContext<UserDataContextType>({
  customCalculators: [],
  savedCalculators: [],
  embeddedCalculators: [],
  isLoadingData: true,
  isSyncing: false,
  addCustomCalculator: () => {},
  removeCustomCalculator: () => {},
  addSavedCalculator: () => {},
  removeSavedCalculator: () => {},
  addEmbeddedCalculator: () => {},
})

const WP_API_BASE = 'https://cms.homeofcalculators.com/wp-json'

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth()
  
  const [customCalculators, setCustomCalculators] = useState<CustomCalculatorConfig[]>([])
  const [savedCalculators, setSavedCalculators] = useState<string[]>([])
  const [embeddedCalculators, setEmbeddedCalculators] = useState<EmbeddedCalculatorInfo[]>([])
  
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  // Load from local storage initially
  useEffect(() => {
    const localCustom = localStorage.getItem('my_custom_calculators')
    const localSaved = localStorage.getItem('my_saved_calculators')
    const localEmbedded = localStorage.getItem('my_embedded_calculators')

    if (localCustom) {
      try { setCustomCalculators(JSON.parse(localCustom)) } catch (e) {}
    }
    if (localSaved) {
      try { setSavedCalculators(JSON.parse(localSaved)) } catch (e) {}
    }
    if (localEmbedded) {
      try { setEmbeddedCalculators(JSON.parse(localEmbedded)) } catch (e) {}
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
          const remoteEmbedded = data.meta?.embedded_calculators

          let updatedCustom = [...customCalculators]
          let updatedSaved = [...savedCalculators]
          let updatedEmbedded = [...embeddedCalculators]

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
          
          if (remoteEmbedded) {
            try {
              const parsed = JSON.parse(remoteEmbedded)
              updatedEmbedded = parsed
              setEmbeddedCalculators(parsed)
              localStorage.setItem('my_embedded_calculators', JSON.stringify(parsed))
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
  const syncToWordPress = async (newCustom: CustomCalculatorConfig[], newSaved: string[], newEmbedded: EmbeddedCalculatorInfo[]) => {
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
            saved_tools: JSON.stringify(newSaved),
            embedded_calculators: JSON.stringify(newEmbedded)
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
      syncToWordPress(updated, savedCalculators, embeddedCalculators)
      return updated
    })
  }, [user, token, savedCalculators, embeddedCalculators])

  const removeCustomCalculator = useCallback((id: string) => {
    setCustomCalculators(prev => {
      const updated = prev.filter(c => c.id !== id)
      localStorage.setItem('my_custom_calculators', JSON.stringify(updated))
      syncToWordPress(updated, savedCalculators, embeddedCalculators)
      return updated
    })
  }, [user, token, savedCalculators, embeddedCalculators])

  const addSavedCalculator = useCallback((slug: string) => {
    setSavedCalculators(prev => {
      if (prev.includes(slug)) return prev
      const updated = [...prev, slug]
      localStorage.setItem('my_saved_calculators', JSON.stringify(updated))
      syncToWordPress(customCalculators, updated, embeddedCalculators)
      return updated
    })
  }, [user, token, customCalculators, embeddedCalculators])

  const removeSavedCalculator = useCallback((slug: string) => {
    setSavedCalculators(prev => {
      const updated = prev.filter(s => s !== slug)
      localStorage.setItem('my_saved_calculators', JSON.stringify(updated))
      syncToWordPress(customCalculators, updated, embeddedCalculators)
      return updated
    })
  }, [user, token, customCalculators, embeddedCalculators])

  const addEmbeddedCalculator = useCallback((info: EmbeddedCalculatorInfo) => {
    setEmbeddedCalculators(prev => {
      // Avoid exact duplicates (same ID)
      if (prev.some(e => e.id === info.id)) return prev
      const updated = [info, ...prev] // Put newest first
      localStorage.setItem('my_embedded_calculators', JSON.stringify(updated))
      syncToWordPress(customCalculators, savedCalculators, updated)
      return updated
    })
  }, [user, token, customCalculators, savedCalculators])

  return (
    <UserDataContext.Provider 
      value={{ 
        customCalculators, 
        savedCalculators,
        embeddedCalculators, 
        isLoadingData, 
        isSyncing,
        addCustomCalculator,
        removeCustomCalculator,
        addSavedCalculator,
        removeSavedCalculator,
        addEmbeddedCalculator
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

export const useUserData = () => useContext(UserDataContext)
