import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Pages.css'

export function SignupFinishPage() {
  const { reload } = useAuth()
  const navigate = useNavigate()

  const handleDashboard = () => {
    reload()
    navigate('/')
  }

  return (
    <section className="auth-card">
      <div className="auth-card__header">
        <p className="eyebrow">All set</p>
        <h1>Welcome aboard</h1>
        <p className="subtle">Your registration is complete. The course will appear shortly.</p>
      </div>
      <div className="auth-actions">
        <button className="btn" type="button" onClick={handleDashboard}>
          Go to dashboard
        </button>
      </div>
    </section>
  )
}
