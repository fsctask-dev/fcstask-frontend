import { useNavigate } from 'react-router-dom'
import { useSignupVM } from '../viewmodels/useSignupVM'
import './Pages.css'

export function SignupPage() {
  const { form, updateField, submit, loading, error } = useSignupVM()
  const navigate = useNavigate()
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const ok = await submit()
    if (ok) navigate('/signup/finish')
  }

  const handleOAuthLogin = (provider: 'gitlab' | 'telegram') => {
    window.location.href = `/api/oauth/${provider}`
  }

  return (
    <section className="auth-card">
      <div className="auth-card__header">
        <p className="eyebrow">Register</p>
        <h1>Join FCS Task</h1>
        <p className="subtle">Create your account or use external services.</p>
      </div>
      <div className="oauth-buttons">
        <button
          className="btn btn-oauth btn-oauth--gitlab"
          type="button"
          onClick={() => handleOAuthLogin('gitlab')}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
          </svg>
          Sign up with GitLab
        </button>
        <button
          className="btn btn-oauth btn-oauth--telegram"
          type="button"
          onClick={() => handleOAuthLogin('telegram')}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Sign up with Telegram
        </button>
      </div>
      <div className="auth-divider">
        <span>or</span>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="error-msg">{error}</p>}
        <label>
          Username
          <input
            className="input"
            value={form.username}
            onChange={(e) => updateField('username', e.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            required
          />
        </label>
        <div className="auth-actions">
          <button className="btn btn-ghost" type="button" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Registering…' : 'Continue'}
          </button>
        </div>
      </form>
    </section>
  )
}