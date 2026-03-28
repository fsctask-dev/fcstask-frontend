import { useState } from 'react'
import { signUp } from '../api/endpoints'

export interface SignupFormState {
  username: string
  email: string
  password: string
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

  return { form, updateField, submit, loading, error }
}
