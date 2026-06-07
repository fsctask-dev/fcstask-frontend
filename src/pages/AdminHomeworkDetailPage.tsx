import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminHomeworkDetailVM } from '../viewmodels/useAdminHomeworkDetailVM'
import './Pages.css'

export function AdminHomeworkDetailPage() {
  const { courseId, homework, tasks, deadlineDate, deadline, loading, saving, error, setError, save, togglePublishHw, addTask, togglePublishTask, removeTask, saveDeadline, removeDeadline } =
    useAdminHomeworkDetailVM()
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskScore, setTaskScore] = useState('1')
  const [taskUrl, setTaskUrl] = useState('')
  const [showDeadlineForm, setShowDeadlineForm] = useState(false)
  const [deadlineTitle, setDeadlineTitle] = useState('')
  const [deadlineDue, setDeadlineDue] = useState('')
  const navigate = useNavigate()

  const handleSaveDeadline = async () => {
    await saveDeadline(deadlineTitle, deadlineDue)
    setShowDeadlineForm(false)
    setDeadlineTitle('')
    setDeadlineDue('')
  }

  const handleAddTask = async () => {
    if (!taskTitle.trim()) { setError('Task title is required'); return }
    const score = parseInt(taskScore)
    if (!score || score <= 0) { setError('Score must be greater than 0'); return }
    await addTask(taskTitle.trim(), score, taskUrl || undefined)
    setTaskTitle('')
    setTaskScore('1')
    setTaskUrl('')
    setShowAddTask(false)
  }

  const startEdit = () => {
    setEditTitle(homework?.title || '')
    setEditDesc(homework?.description || '')
    setIsEditing(true)
  }

  const handleSave = async () => {
    await save({ title: editTitle, description: editDesc })
    setIsEditing(false)
  }

  if (loading) return <div className="page-grid"><p className="subtle">Loading…</p></div>
  if (!homework) return <div className="page-grid"><p className="error-msg">Homework not found</p></div>

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin · Homework</p>
          <h1>{homework.title || 'Untitled homework'}</h1>
          {homework.description && <p className="subtle">{homework.description}</p>}
          <p className="meta" style={{ marginTop: '4px' }}>
            Position: {homework.position} ·{' '}
            <span className={`status ${homework.is_public ? 'status--in_progress' : 'status--hidden'}`}>
              {homework.is_public ? 'published' : 'draft'}
            </span>
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" type="button" onClick={() => navigate(`/course/${courseId}/admin`)}>
            ← Back
          </button>
          <button className="btn btn-ghost" type="button" onClick={startEdit}>
            Edit
          </button>
          <button
            className={`btn ${homework.is_public ? 'btn-ghost' : ''}`}
            type="button"
            onClick={togglePublishHw}
          >
            {homework.is_public ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {isEditing && (
        <div className="panel">
          <h2>Edit homework</h2>
          <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
            <label style={{ display: 'grid', gap: '6px' }}>
              <span className="meta">Title</span>
              <input className="input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </label>
            <label style={{ display: 'grid', gap: '6px' }}>
              <span className="meta">Description</span>
              <textarea
                className="input"
                rows={3}
                style={{ resize: 'vertical', padding: '8px' }}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
            </label>
            <div className="header-actions">
              <button className="btn" onClick={handleSave} disabled={saving} type="button">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button className="btn btn-ghost" onClick={() => setIsEditing(false)} type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel__head">
          <div>
            <h2>Deadline</h2>
            {deadlineDate && <p className="meta" style={{ marginTop: '2px' }}>Due: {deadlineDate}</p>}
          </div>
          <div className="header-actions">
            {deadline && (
              <button className="btn btn-ghost" style={{ color: 'var(--red)', fontSize: '0.75rem', height: '28px', padding: '0 10px' }} type="button" onClick={removeDeadline}>
                Remove
              </button>
            )}
            <button className="btn btn-ghost" type="button" onClick={() => {
              setDeadlineTitle('')
              setDeadlineDue(deadlineDate ?? '')
              setShowDeadlineForm((v) => !v)
            }}>
              {deadlineDate ? 'Edit deadline' : 'Set deadline'}
            </button>
          </div>
        </div>

        {!deadlineDate && !showDeadlineForm && (
          <p className="empty">No deadline set.</p>
        )}

        {showDeadlineForm && (
          <div style={{ display: 'grid', gap: '12px', padding: '16px 0', borderTop: '1px solid var(--border)' }}>
            <div className="form-inline">
              <label style={{ display: 'grid', gap: '4px', flex: 1 }}>
                <span className="meta">Title</span>
                <input className="input" placeholder="e.g. Checkpoint" value={deadlineTitle} onChange={(e) => setDeadlineTitle(e.target.value)} />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span className="meta">Due date</span>
                <input className="input" type="date" value={deadlineDue} onChange={(e) => setDeadlineDue(e.target.value)} />
              </label>
            </div>
            <div className="form-inline">
              <button className="btn" type="button" onClick={handleSaveDeadline} disabled={!deadlineTitle || !deadlineDue}>Save</button>
              <button className="btn btn-ghost" type="button" onClick={() => setShowDeadlineForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel__head">
          <h2>Tasks</h2>
          <button className="btn" type="button" onClick={() => setShowAddTask((v) => !v)}>
            + Add task
          </button>
        </div>

        {showAddTask && (
          <div style={{ display: 'grid', gap: '12px', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
            <div className="form-inline">
              <label style={{ display: 'grid', gap: '4px', flex: 1 }}>
                <span className="meta">Title</span>
                <input className="input" placeholder="e.g. Task 1" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span className="meta">Score</span>
                <input className="input" type="number" min="1" value={taskScore} onChange={(e) => setTaskScore(e.target.value)} style={{ width: '80px' }} />
              </label>
            </div>
            <label style={{ display: 'grid', gap: '4px' }}>
              <span className="meta">Task URL (optional)</span>
              <input className="input" placeholder="https://gitlab.com/..." value={taskUrl} onChange={(e) => setTaskUrl(e.target.value)} />
            </label>
            <div className="form-inline">
              <button className="btn" type="button" onClick={handleAddTask}>Create task</button>
              <button className="btn btn-ghost" type="button" onClick={() => { setShowAddTask(false); setTaskTitle(''); setTaskScore('1'); setTaskUrl('') }}>Cancel</button>
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          <p className="empty">No tasks yet.</p>
        ) : (
          <div className="table">
            <div className="table__row table__head">
              <span>#</span>
              <span>Task</span>
              <span>Score</span>
              <span>Type</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {tasks.map((task) => (
              <div key={task.task_id} className="table__row">
                <span className="meta">{task.position}</span>
                <span>{task.title || task.task_id.slice(0, 8)}</span>
                <span>{task.score}</span>
                <span>
                  {task.is_bonus ? (
                    <span className="status status--doreshka">bonus</span>
                  ) : (
                    <span className="status status--created">standard</span>
                  )}
                </span>
                <span>
                  <span className={`status ${task.is_public ? 'status--in_progress' : 'status--hidden'}`}>
                    {task.is_public ? 'public' : 'hidden'}
                  </span>
                </span>
                <span className="header-actions">
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: '0.75rem', height: '28px', padding: '0 10px' }}
                    type="button"
                    onClick={() => togglePublishTask(task.task_id, task.is_public)}
                  >
                    {task.is_public ? 'Hide' : 'Show'}
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: '0.75rem', height: '28px', padding: '0 10px', color: 'var(--red)' }}
                    type="button"
                    onClick={() => confirm('Delete task?') && removeTask(task.task_id)}
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
