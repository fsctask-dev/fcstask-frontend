import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
import { getPublicCourses, getCourses, getStats, courseDTOToModel, signOut, resolveCourse, checkPermissions } from '../api/endpoints'
import type { Course } from '../models/types'
import './MainLayout.css'

export function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, reload } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()
  const isCourseRoute = location.pathname.startsWith('/course/')
  const isSignup = location.pathname.startsWith('/signup')  || location.pathname.startsWith('/signin')
  const courseBase = isCourseRoute ? location.pathname.split('/').slice(0, 3).join('/') : ''
  const [courses, setCourses] = useState<Course[]>([])
  const [perms, setPerms] = useState<Record<string, boolean> | null>(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const currentCourse = courses.find((c) => c.url === courseBase)
  const courseSlug = isCourseRoute ? location.pathname.split('/')[2] : ''

  const handleSignOut = async () => {
    await signOut().catch(() => {})
    reload()
    navigate('/')
  }

  useEffect(() => {
    if (!isCourseRoute) return
    const load = user ? getCourses() : getPublicCourses()
    load
      .then((dtos) => setCourses((dtos ?? []).map(courseDTOToModel)))
      .catch(() => {})
  }, [isCourseRoute, user])

  useEffect(() => {
    if (!isCourseRoute || !courseSlug) { setPerms(null); return }
    if (isSuperAdmin) { setPerms({ 'course.update': true, 'homework.create': true }); return }
    if (!user) { setPerms(null); return }
    resolveCourse(courseSlug)
      .then((course) => checkPermissions(course.id, ['course.update', 'homework.create']))
      .then(setPerms)
      .catch(() => setPerms(null))
  }, [isCourseRoute, courseSlug, user, isSuperAdmin])

  useEffect(() => {
    if (!user) { setIsSuperAdmin(false); return }
    getStats()
      .then(() => setIsSuperAdmin(true))
      .catch(() => setIsSuperAdmin(false))
  }, [user])

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
              <NavLink to={courseBase} className="nav-link" end>
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
              {perms?.['course.update'] && (
                <NavLink to={`${courseBase}/edit`} className="nav-link">
                  Edit Course
                </NavLink>
              )}
              {perms?.['homework.create'] && (
                <NavLink to={`${courseBase}/admin`} className="nav-link">
                  Homework
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink to="/" className="nav-link" end>
                Courses
              </NavLink>
              {user && (
                <NavLink to="/my-courses" className="nav-link">
                  My Courses
                </NavLink>
              )}
              {isSuperAdmin && (
                <NavLink to="/admin/instance" className="nav-link">
                  Instance Panel
                </NavLink>
              )}
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
                  value={currentCourse?.url || courses[0]?.url || ''}
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
            <>
              <div className="user-chip">
                <span className="user-chip__initials">{user.initials}</span>
                <div>
                  <div className="user-chip__name">{user.username}</div>
                  <div className="user-chip__role">{user.role.replace('_', ' ')}</div>
                </div>
              </div>
              <button className="btn btn-ghost" type="button" onClick={handleSignOut}>
                Sign out
              </button>
            </>
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
