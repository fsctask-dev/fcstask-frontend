import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePublicCoursesVM } from '../viewmodels/usePublicCoursesVM'
import { useAuth } from '../context/AuthContext'
import { joinCourse } from '../api/endpoints'
import './Pages.css'

export function PublicCoursesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { courses, loading, error } = usePublicCoursesVM()
  const [joining, setJoining] = useState<string | null>(null)
  const [joinError, setJoinError] = useState<string | null>(null)

  const handleJoin = async (e: React.MouseEvent, courseId: string, courseUrl: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { navigate('/signin'); return }
    setJoining(courseId)
    setJoinError(null)
    try {
      await joinCourse(courseId)
      navigate(courseUrl)
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('already a participant')) {
        navigate(courseUrl)
        return
      }
      setJoinError(err instanceof Error ? err.message : 'Failed to join')
    } finally {
      setJoining(null)
    }
  }

  const filtered = useMemo(
    () => courses.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [courses, query],
  )

  if (loading) return <div className="page-grid"><p className="subtle">Loading courses…</p></div>
  if (error) return <div className="page-grid"><p className="error-msg">Error: {error}</p></div>

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <h1>Courses</h1>
          <p className="subtle">Browse available courses to get started.</p>
        </div>
        <div className="header-actions">
          <div className="search-wrap">
            <input
              className="input"
              type="text"
              placeholder="Search courses"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>{query ? 'No relevant courses.' : 'No available courses.'}</p>
        </div>
      ) : (
        <div className="panel">
          {joinError && <p className="error-msg">{joinError}</p>}
          <div className="course-grid">
            {filtered.map((course) => (
              <div key={course.id} className="course-card">
                <Link to={course.url} className="course-card__body">
                  <div className="course-card__top">
                    <div>
                      <h3>{course.name}</h3>
                    </div>
                    <span className={`status status--${course.status}`}>
                      {course.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
                <div className="course-card__footer">
                  <button
                    className="btn"
                    onClick={(e) => handleJoin(e, course.id, course.url)}
                    disabled={joining === course.id}
                    type="button"
                  >
                    {joining === course.id ? 'Joining…' : 'Join'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
