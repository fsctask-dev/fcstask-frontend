import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePublicCoursesVM } from '../viewmodels/usePublicCoursesVM'
import './Pages.css'

const STATUS_LABEL: Record<string, string> = {
  created: 'Upcoming',
  hidden: 'Hidden',
  in_progress: 'Active',
  all_tasks_issued: 'All tasks out',
  doreshka: 'Catch-up',
  finished: 'Finished',
}

const STATUS_CLASS: Record<string, string> = {
  created: 'status--created',
  hidden: 'status--hidden',
  in_progress: 'status--in_progress',
  all_tasks_issued: 'status--all_tasks_issued',
  doreshka: 'status--doreshka',
  finished: 'status--finished',
}

function CourseInitial({ name }: { name: string }) {
  const letters = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return <span className="course-card__initial">{letters || '?'}</span>
}

export function PublicCoursesPage() {
  const [query, setQuery] = useState('')
  const { courses, loading, error } = usePublicCoursesVM()

  const filtered = useMemo(
    () => courses.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      (c.description ?? '').toLowerCase().includes(query.toLowerCase()),
    ),
    [courses, query],
  )

  const active = filtered.filter((c) => c.status !== 'finished')
  const finished = filtered.filter((c) => c.status === 'finished')

  if (loading) return (
    <section className="page-grid">
      <div className="page-header"><div><h1>Courses</h1></div></div>
      <div className="course-grid">
        {[1,2,3].map((i) => <div key={i} className="skeleton course-card-skeleton" />)}
      </div>
    </section>
  )

  if (error) return <div className="page-grid"><p className="error-msg">{error}</p></div>

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <h1>Courses</h1>
          <p className="subtle">
            {courses.length} course{courses.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <div className="search-wrap" style={{ minWidth: '220px' }}>
          <input
            className="input"
            type="text"
            placeholder="Search by name or description…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <p>{query ? `No courses match "${query}"` : 'No courses available yet.'}</p>
        </div>
      )}

      {active.length > 0 && (
        <div className="course-section">
          <p className="course-section__label">Active</p>
          <div className="course-grid">
            {active.map((course) => {
              return (
                <Link key={course.id} to={course.url} className="course-card course-card--rich">
                  <div className="course-card__accent" />
                  <div className="course-card__inner">
                    <div className="course-card__head">
                      <CourseInitial name={course.name} />
                      <span className={`status ${STATUS_CLASS[course.status] ?? ''}`}>
                        {STATUS_LABEL[course.status] ?? course.status}
                      </span>
                    </div>
                    <div className="course-card__content">
                      <h3 className="course-card__name">{course.name}</h3>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {finished.length > 0 && (
        <div className="course-section">
          <p className="course-section__label">Finished</p>
          <div className="course-grid">
            {finished.map((course) => {
              return (
                <Link key={course.id} to={course.url} className="course-card course-card--rich course-card--done">
                  <div className="course-card__accent" />
                  <div className="course-card__inner">
                    <div className="course-card__head">
                      <CourseInitial name={course.name} />
                      <span className="status status--finished">Finished</span>
                    </div>
                    <div className="course-card__content">
                      <h3 className="course-card__name">{course.name}</h3>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
