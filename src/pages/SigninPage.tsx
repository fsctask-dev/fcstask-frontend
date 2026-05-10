import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSigninVM } from '../viewmodels/useSigninVM'
import { useAuth } from '../context/AuthContext'
import './Pages.css'

const GitLabIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
  </svg>
)

const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

export function SigninPage() {
  const { form, updateField, validateEmail, submit, loading, error, emailError, emailTouched } = useSigninVM()
  const { reload } = useAuth()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [comingSoon, setComingSoon] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const ok = await submit()
    if (ok) {
      reload()
      navigate('/')
    }
  }

  const handleOAuth = (provider: string) => {
    setComingSoon(provider)
    setTimeout(() => setComingSoon(null), 2500)
  }

  return (
    <section className="auth-card">
      <div className="auth-card__header">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in</h1>
      </div>

      <div className="oauth-buttons">
        <button
          type="button"
          className="oauth-btn"
          onClick={() => handleOAuth('GitLab')}
        >
          <GitLabIcon />
          Sign in with GitLab
        </button>
        <button
          type="button"
          className="oauth-btn"
          onClick={() => handleOAuth('Telegram')}
        >
          <TelegramIcon />
          Sign in with Telegram
        </button>
      </div>

      {comingSoon && (
        <p className="error-msg">Coming soon — OAuth for {comingSoon} is not yet available</p>
      )}

      <div className="auth-divider">or</div>

      <form className="auth-email-form" onSubmit={handleSubmit}>
        <label>
          Email
          <div className="input-wrap">
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              onBlur={validateEmail}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
        </label>
        {emailTouched && emailError && <p className="error-msg">{emailError}</p>}

        <label>
          Password
          <div className="input-wrap">
            <input
              className="input"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="input-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </label>

        <div className="auth-forgot">
          <button type="button" onClick={() => setComingSoon('password recovery')}>
            Forgot password?
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <div className="auth-actions">
          <Link className="btn btn-ghost" to="/signup">
            Register
          </Link>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </section>
  )
}