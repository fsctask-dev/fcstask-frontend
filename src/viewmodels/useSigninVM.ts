import { useState } from 'react'
import { signIn } from '../api/endpoints'

export function useSigninVM() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateField = <K extends keyof typeof form>(key: K, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const submit = async (): Promise<boolean> => {
    setError(null)
    setLoading(true)
    try {
      await signIn({ username: form.username, password: form.password })
      return true
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid credentials')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { form, updateField, submit, loading, error }
}
