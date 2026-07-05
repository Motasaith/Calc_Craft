'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Mail, User, Shield, Sparkles } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: 'login' | 'register'
}

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }: AuthModalProps) {
  const { login, register } = useAuth()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab)
  
  // Form states
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // UI states
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab)
    setError(null)
    setSuccessMsg(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setLoading(true)

    try {
      if (activeTab === 'login') {
        const res = await login(username, password)
        if (res.success) {
          onClose()
        } else {
          setError(res.error || 'Invalid username/email or password.')
        }
      } else {
        // Register validation
        if (password !== confirmPassword) {
          setError('Passwords do not match.')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.')
          setLoading(false)
          return
        }
        const res = await register(username, email, password)
        if (res.success) {
          setSuccessMsg('Account created successfully!')
          setTimeout(() => {
            onClose()
          }, 1500)
        } else {
          setError(res.error || 'Failed to create account. Username or email might be taken.')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative max-w-md w-full bg-[#eae7df] border-2 border-dark-800/15 p-6 sm:p-8 rounded-2xl shadow-[0_12px_24px_rgba(26,32,25,0.15),0_4px_0_rgba(26,32,25,0.8)] overflow-hidden"
          >
            {/* Retro calculator key accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#dfaa44]" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-dark-500 hover:text-dark-800 hover:bg-[#dad6cd]/50 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-1 items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 shadow-sm mb-2">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-base sm:text-lg font-mono font-extrabold uppercase tracking-wide text-dark-800 flex items-center gap-1.5">
                Home of <span className="text-primary-700">Calculators</span>
              </h2>
              <p className="text-xs text-dark-500 font-mono">
                Manage your saved calculators &amp; settings
              </p>
            </div>

            {/* Custom Tab Switchers */}
            <div className="flex bg-[#dad6cd]/40 border border-dark-800/10 rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === 'login'
                    ? 'bg-[#dad6cd] shadow-inner text-dark-900 border border-dark-800/10'
                    : 'text-dark-500 hover:text-dark-700'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('register')}
                className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === 'register'
                    ? 'bg-[#dad6cd] shadow-inner text-dark-900 border border-dark-800/10'
                    : 'text-dark-500 hover:text-dark-700'
                }`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-red-100 border border-red-200 text-red-700 text-xs font-semibold rounded-xl leading-relaxed">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 animate-pulse text-emerald-600" />
                  {successMsg}
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-dark-500 uppercase tracking-widest block pl-1">
                  Username or Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username or email"
                    className="w-full h-11 pl-10 pr-4 bg-[#eae7df] border border-dark-800/20 focus:border-primary-600 rounded-xl text-xs font-medium text-dark-800 placeholder:text-dark-400 focus:outline-none shadow-inner transition-colors"
                  />
                </div>
              </div>

              {/* Email Input (Register only) */}
              {activeTab === 'register' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-dark-500 uppercase tracking-widest block pl-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-11 pl-10 pr-4 bg-[#eae7df] border border-dark-800/20 focus:border-primary-600 rounded-xl text-xs font-medium text-dark-800 placeholder:text-dark-400 focus:outline-none shadow-inner transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-dark-500 uppercase tracking-widest block pl-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-4 bg-[#eae7df] border border-dark-800/20 focus:border-primary-600 rounded-xl text-xs font-medium text-dark-800 placeholder:text-dark-400 focus:outline-none shadow-inner transition-colors"
                  />
                </div>
              </div>

              {/* Confirm Password (Register only) */}
              {activeTab === 'register' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-dark-500 uppercase tracking-widest block pl-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-4 bg-[#eae7df] border border-dark-800/20 focus:border-primary-600 rounded-xl text-xs font-medium text-dark-800 placeholder:text-dark-400 focus:outline-none shadow-inner transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative inline-flex items-center justify-center gap-2 h-12 bg-[#dfaa44] text-dark-900 text-xs font-extrabold font-mono uppercase tracking-wider rounded-xl border border-[#be8b32] shadow-[0_3px_0_#be8b32] hover:bg-[#e5b44e] hover:translate-y-px hover:shadow-[0_1.5px_0_#be8b32] active:translate-y-[2px] active:shadow-none disabled:translate-y-[2px] disabled:shadow-none disabled:opacity-75 disabled:pointer-events-none transition-all mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
                ) : (
                  <span>= {activeTab === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
