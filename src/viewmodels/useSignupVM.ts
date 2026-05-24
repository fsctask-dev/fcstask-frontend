import { useMemo, useState } from 'react'
import { signUp } from '../api/endpoints'

export interface SignupFormState {
  username: string
  email: string
  password: string
}

const validSymbols = /[!@#$%^&*(),.?":{}|<>]/

function getPasswordStrength(password: string): { level: 'weak' | 'medium' | 'strong'; score: number } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (validSymbols.test(password)) score++

  if (score <= 1) return { level: 'weak', score }
  if (score <= 3) return { level: 'medium', score }
  return { level: 'strong', score }
}

export function useSignupVM() {
  const [form, setForm] = useState<SignupFormState>({
    username: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateField = <K extends keyof SignupFormState>(key: K, value: SignupFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password])

  const submit = async (): Promise<boolean> => {
    setError(null)
    setLoading(true)
    try {
      await signUp({ username: form.username, email: form.email, password: form.password })
      return true
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Registration failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { form, updateField, submit, loading, error, passwordStrength }
}
