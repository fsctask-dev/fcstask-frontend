import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePublicCoursesVM } from '../viewmodels/usePublicCoursesVM'
import './Pages.css'

export function PublicCoursesPage() {
  const [query, setQuery] = useState('')
  const { courses, loading, error } = usePublicCoursesVM()

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
          <div className="course-grid">
            {filtered.map((course) => (
              <Link key={course.id} to={course.url} className="course-card">
                <div className="course-card__top">
                  <div>
                    <h3>{course.name}</h3>
                  </div>
                  <span className={`status status--${course.status}`}>
                    {course.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
