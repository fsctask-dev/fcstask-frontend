import { Link } from 'react-router-dom'
import { useCoursesVM } from '../viewmodels/useCoursesVM'
import './Pages.css'

export function CoursesPage() {
  const { activeCourses, finishedCourses, showFinished, toggleFinished, loading, error } =
    useCoursesVM()

  if (loading) return <div className="page-grid"><p className="subtle">Loading courses…</p></div>
  if (error) return <div className="page-grid"><p className="error-msg">Error: {error}</p></div>

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
          <Link className="btn" to="/course/create">
            Create course
          </Link>
        </div>
      </div>

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
        <div className="course-grid">
          {activeCourses.length === 0 ? (
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
                <div className="course-card__progress">
                  <div className="course-card__progress-bar">
                    <span style={{ width: '0%' }} />
                  </div>
                  <span className="course-card__badge">—</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
