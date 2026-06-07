import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getStats } from '../api/endpoints'
import type { PlatformStats } from '../api/endpoints'

export function useInstanceAdminVM() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getStats()
      .then(setSummary)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [user])

  return { summary, loading, error }
}
