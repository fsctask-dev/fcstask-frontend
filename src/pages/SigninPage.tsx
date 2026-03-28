import { useNavigate, Link } from 'react-router-dom'
import { useSigninVM } from '../viewmodels/useSigninVM'
import { useAuth } from '../context/AuthContext'
import './Pages.css'

export function SigninPage() {
  const { form, updateField, submit, loading, error } = useSigninVM()
  const { reload } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const ok = await submit()
    if (ok) {
      reload()
      navigate('/')
    }
  }

  return (
    <section className="auth-card">
      <div className="auth-card__header">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in</h1>
        <p className="subtle">Enter your username and password.</p>
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
