import { useState } from 'react'
import { signIn } from '../api/endpoints'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function useSigninVM() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailTouched, setEmailTouched] = useState(false)

  const updateField = <K extends keyof typeof form>(key: K, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const validateEmail = () => {
    setEmailTouched(true)
    if (form.email && !isValidEmail(form.email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError(null)
    return true
  }

  const submit = async (): Promise<boolean> => {
    if (!validateEmail()) return false
    setError(null)
    setLoading(true)
    try {
      await signIn({ email: form.email, password: form.password })
      return true
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid credentials')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { form, updateField, validateEmail, submit, loading, error, emailError, emailTouched }
}
