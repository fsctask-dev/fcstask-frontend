import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCoursesVM } from '../viewmodels/useCoursesVM'
import { createCourse } from '../api/endpoints'
import { ApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import './Pages.css'

export function CoursesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { activeCourses, finishedCourses, showFinished, toggleFinished, loading, error,
    joining, joinError, joinCourseUrl, joinBySlug } = useCoursesVM(user !== null)
  const [canCreateCourse, setCanCreateCourse] = useState(false)

  useEffect(() => {
    createCourse({ name: '', slug: '', type: '', status: '', startDate: '', endDate: '', repoTemplate: '', description: '' })
      .catch((e) => {
        setCanCreateCourse(e instanceof ApiError && e.status === 400)
      })
  }, [])
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [joinSlug, setJoinSlug] = useState('')
  const [joinCode, setJoinCode] = useState('')

  const handleJoin = async () => {
    if (!joinSlug.trim()) return
    await joinBySlug(joinSlug.trim(), joinCode.trim() || undefined)
    setJoinSlug('')
    setJoinCode('')
  }

  if (loading) return <div className="page-grid"><p className="subtle">Loading courses…</p></div>

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Courses</h1>
          <p className="subtle">Keep track of your programs, tasks, and results.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={toggleFinished} type="button">
            {showFinished ? 'Hide completed' : 'Show completed'}
          </button>
          <button className="btn btn-ghost" onClick={() => user ? setShowJoinForm((v) => !v) : navigate('/signin')} type="button">
            Join course
          </button>
          {canCreateCourse && (
            <Link className="btn" to="/course/create">
              Create course
            </Link>
          )}
        </div>
      </div>

      {showJoinForm && (
        <div className="panel">
          {joinCourseUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2>Successfully joined!</h2>
                <p className="subtle" style={{ marginTop: '4px' }}>You now have access to the course.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to={`${joinCourseUrl}/database`} className="btn">Open course</Link>
                <button className="btn btn-ghost" type="button" onClick={() => { setShowJoinForm(false) }}>Close</button>
              </div>
            </div>
          ) : (
            <>
              <h2>Join a course</h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                <input
                  className="input"
                  placeholder="Course slug (e.g. algorithms-101)"
                  value={joinSlug}
                  onChange={(e) => setJoinSlug(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Invite code (for private courses)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                />
                <button className="btn" onClick={handleJoin} disabled={joining} type="button">
                  {joining ? 'Joining…' : 'Join'}
                </button>
              </div>
              {joinError && <p className="error-msg" style={{ marginTop: '8px' }}>{joinError}</p>}
            </>
          )}
        </div>
      )}

      {showFinished && (
        <div className="panel">
          <h2>Completed courses</h2>
          <div className="course-grid">
            {finishedCourses.length === 0 ? (
              <p className="empty">No finished courses yet.</p>
            ) : (
              finishedCourses.map((course) => (
                <Link key={course.id} to={course.url} className="course-card course-card--complete">
                  <div className="course-card__top">
                    <div>
                      <p className="course-card__eyebrow">Completed</p>
                      <h3>{course.name}</h3>
                    </div>
                    <span className="status status--finished">{course.status.replace('_', ' ')}</span>
                  </div>
                  <div className="course-card__footer">
                    <span className="meta">Results archived</span>
                    <span className="course-card__badge">100%</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}

      <div className="panel">
        <h2>Active courses</h2>
        {error && <p className="error-msg">{error}</p>}
        <div className="course-grid">
          {!error && activeCourses.length === 0 ? (
            <p className="empty">No active courses.</p>
          ) : (
              activeCourses.map((course) => (
                <Link key={course.id} to={course.url} className="course-card">
                  <div className="course-card__top">
                    <div>
                      <p className="course-card__eyebrow">In progress</p>
                      <h3>{course.name}</h3>
                    </div>
                    <span className={`status status--${course.status}`}>
                      {course.status.replace('_', ' ')}
                    </span>
                  </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
