'use client'
import React, { useState, useEffect } from 'react'
import { fetchSentryLogs } from '@/lib/admin-api'
import { useAuth } from '@/components/providers/AuthContext'

export default function AdminLogs({ darkMode }: { darkMode: boolean }) {
  const { authedFetch } = useAuth()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      setLoading(true)
      const data = await fetchSentryLogs(authedFetch)
      if (Array.isArray(data)) {
        setLogs(data)
      } else {
        setError('Failed to parse logs')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Fetching logs from Sentry API...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>
  if (logs.length === 0) return <div>No recent issues found in Sentry.</div>

  return (
    <div className={`rounded-xl border overflow-hidden ${darkMode ? 'border-white/5 bg-[#12121a]' : 'border-gray-200 bg-white'}`}>
      <table className="w-full text-sm">
        <thead className={`text-left text-[10px] uppercase tracking-wider ${darkMode ? 'border-b border-white/5 text-neutral-500' : 'border-b border-gray-200 text-gray-500'}`}>
          <tr>
            <th className="p-4">Error Type</th>
            <th className="p-4">Message</th>
            <th className="p-4">Status</th>
            <th className="p-4">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {logs.slice(0, 20).map(log => (
            <tr key={log.id} className={`border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <td className="p-4 font-bold text-red-500">{log.metadata?.type || 'Error'}</td>
              <td className="p-4">{log.title}</td>
              <td className="p-4"><span className="px-2 py-1 bg-neutral-500/10 rounded text-[10px] uppercase">{log.status}</span></td>
              <td className="p-4 text-xs opacity-60">{new Date(log.lastSeen).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
