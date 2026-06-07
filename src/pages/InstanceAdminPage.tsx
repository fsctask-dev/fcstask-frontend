import { useInstanceAdminVM } from '../viewmodels/useInstanceAdminVM'
import './Pages.css'

export function InstanceAdminPage() {
  const { summary, loading, error } = useInstanceAdminVM()

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Instance</p>
          <h1>Admin panel</h1>
          <p className="subtle">Monitor the platform and configure global settings.</p>
        </div>
      </div>

      {loading && <p className="subtle">Loading stats…</p>}
      {error && <p className="error-msg">{error}</p>}

      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <p>Total courses</p>
            <h2>{summary.totalCourses}</h2>
          </div>
          <div className="stat-card">
            <p>Public courses</p>
            <h2>{summary.publicCourses}</h2>
          </div>
          <div className="stat-card">
            <p>Private courses</p>
            <h2>{summary.privateCourses}</h2>
          </div>
          <div className="stat-card">
            <p>Total users</p>
            <h2>{summary.totalUsers}</h2>
          </div>
          <div className="stat-card">
            <p>Health</p>
            <h2>{summary.healthStatus ?? '—'}</h2>
          </div>
        </div>
      )}

      <div className="panel">
        <h2>Quick actions</h2>
        <div className="action-grid">
          <button className="btn" type="button">
            Sync Gitlab
          </button>
          <button className="btn btn-ghost" type="button">
            Export scores
          </button>
          <button className="btn btn-ghost" type="button">
            Configure auth
          </button>
        </div>
      </div>
    </section>
  )
}
