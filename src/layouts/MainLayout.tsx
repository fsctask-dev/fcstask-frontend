import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
import { getCourses, courseDTOToModel, signOut } from '../api/endpoints'
import type { Course } from '../models/types'
import './MainLayout.css'

export function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, reload } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()
  const isCourseRoute = location.pathname.startsWith('/course/')
  const isSignup = location.pathname.startsWith('/signup')
  const courseBase = isCourseRoute ? location.pathname.split('/').slice(0, 3).join('/') : ''

  const [courses, setCourses] = useState<Course[]>([])

  const handleSignOut = async () => {
    await signOut().catch(() => {})
    reload()
    navigate('/')
  }

  useEffect(() => {
    if (isCourseRoute) {
      getCourses()
        .then((dtos) => setCourses(dtos.map(courseDTOToModel)))
        .catch(() => {})
    }
  }, [isCourseRoute])

  if (isSignup) {
    return (
      <div className="shell shell--auth">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar__brand">
          <Link to="/" className="brand">
            <span className="brand__mark">MT</span>
            <span className="brand__title">FCS Task</span>
          </Link>
        </div>

        <nav className="topbar__nav">
          {isCourseRoute ? (
            <>
              <NavLink to={courseBase} className="nav-link">
                Assignments
              </NavLink>
              <a className="nav-link" href="https://gitlab.com" target="_blank" rel="noreferrer">
                My Repo
              </a>
              <a className="nav-link" href="https://gitlab.com" target="_blank" rel="noreferrer">
                My Submits
              </a>
              <NavLink to={`${courseBase}/database`} className="nav-link">
                All Scores
              </NavLink>
              <NavLink to={`${courseBase}/edit`} className="nav-link">
                Edit Course
              </NavLink>
              <NavLink to="/admin/namespaces" className="nav-link">
                Namespaces
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className="nav-link">
                Courses
              </NavLink>
              <NavLink to="/admin/namespaces" className="nav-link">
                Namespaces
              </NavLink>
              <NavLink to="/admin/instance" className="nav-link">
                Instance Panel
              </NavLink>
            </>
          )}
        </nav>

        <div className="topbar__actions">
          {isCourseRoute && courses.length > 0 && (
            <div className="course-switch">
              <span className="course-switch__label">Course</span>
              <div className="course-switch__control">
                <select
                  className="course-switch__select"
                  defaultValue={courses[0]?.url}
                  onChange={(event) => navigate(event.target.value)}
                >
                  {courses.map((course) => (
                    <option key={course.url} value={course.url}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <span className="course-switch__chevron" aria-hidden="true">
                  ▾
                </span>
              </div>
            </div>
          )}

          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <div className="user-chip" style={{ cursor: 'pointer' }} onClick={handleSignOut} title="Sign out">
              <span className="user-chip__initials">{user.initials}</span>
              <div>
                <div className="user-chip__name">{user.username}</div>
                <div className="user-chip__role">{user.role.replace('_', ' ')}</div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/signin" className="btn btn-ghost">Sign in</Link>
              <Link to="/signup" className="btn">Sign up</Link>
            </>
          )}
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}
