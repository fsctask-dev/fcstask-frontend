import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAdminHomeworkVM } from '../viewmodels/useAdminHomeworkVM'
import './Pages.css'

export function AdminHomeworkPage() {
  const { courseId, homeworks, loading, error, creating, create, remove, togglePublish } = useAdminHomeworkVM()
  const [newTitle, setNewTitle] = useState('')
  const [newStartDate, setNewStartDate] = useState('')
  const [newEndDate, setNewEndDate] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const navigate = useNavigate()

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    await create(newTitle.trim(), newStartDate, newEndDate)
    setNewTitle('')
    setNewStartDate('')
    setNewEndDate('')
    setShowCreate(false)
  }

  if (loading) return <div className="page-grid"><p className="subtle">Loading…</p></div>

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Homework</h1>
          <p className="subtle">Manage homework assignments for this course.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" type="button" onClick={() => navigate(`/course/${courseId}`)}>
            ← Back to course
          </button>
          <button className="btn" type="button" onClick={() => setShowCreate((v) => !v)}>
            + New homework
          </button>
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {showCreate && (
        <div className="panel">
          <h2>New homework</h2>
          <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
            <input
              className="input"
              placeholder="Homework title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="form-inline">
              <label style={{ display: 'grid', gap: '4px' }}>
                <span className="meta">Start date</span>
                <input className="input" type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span className="meta">End date</span>
                <input className="input" type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} />
              </label>
            </div>
            <div className="form-inline">
              <button className="btn" onClick={handleCreate} disabled={creating} type="button">
                {creating ? 'Creating…' : 'Create'}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowCreate(false)} type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="panel">
        {homeworks.length === 0 ? (
          <p className="empty">No homework yet. Create the first one!</p>
        ) : (
          <div className="table">
            <div className="table__row table__head">
              <span>#</span>
              <span>Title</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {homeworks.map((hw) => (
              <div key={hw.hw_id} className="table__row">
                <span className="meta">{hw.position}</span>
                <span>
                  <Link to={`/course/${courseId}/admin/homework/${hw.hw_id}`} style={{ color: 'var(--accent)' }}>
                    {hw.title || '—'}
                  </Link>
                  {hw.description && <p className="meta" style={{ marginTop: '2px' }}>{hw.description}</p>}
                </span>
                <span>
                  <span className={`status ${hw.is_public ? 'status--in_progress' : 'status--hidden'}`}>
                    {hw.is_public ? 'published' : 'draft'}
                  </span>
                </span>
                <span className="header-actions">
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: '0.75rem', height: '28px', padding: '0 10px' }}
                    type="button"
                    onClick={() => togglePublish(hw.hw_id, !!hw.is_public)}
                  >
                    {hw.is_public ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: '0.75rem', height: '28px', padding: '0 10px', color: 'var(--red)' }}
                    type="button"
                    onClick={() => confirm('Delete homework?') && remove(hw.hw_id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
