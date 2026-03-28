import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getMe, meToUserProfile } from '../api/endpoints'
import type { UserProfile } from '../models/types'

interface AuthContextValue {
  user: UserProfile | null
  loading: boolean
  reload: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  reload: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('session_token')
    if (!token) {
      setLoading(false)
      return
    }
    getMe()
      .then((me) => setUser(meToUserProfile(me)))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [tick])

  return (
    <AuthContext.Provider value={{ user, loading, reload: () => setTick((t) => t + 1) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
