import { Link, useParams } from 'react-router-dom'
import { useNamespacePanelVM } from '../viewmodels/useNamespacePanelVM'
import './Pages.css'

export function NamespacePanelPage() {
  const { namespaceId } = useParams()
  const { namespace, users, courses, loading, error } = useNamespacePanelVM(namespaceId)

  if (loading) return <div className="page-grid"><p className="subtle">Loading namespace…</p></div>
  if (error) return <div className="page-grid"><p className="error-msg">Error: {error}</p></div>
  if (!namespace.id) return <div className="page-grid"><p className="empty">Namespace not found.</p></div>

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Namespace</p>
          <h1>{namespace.name}</h1>
          <p className="subtle">{namespace.description}</p>
          <p className="meta">Slug: {namespace.slug} · ID: {namespace.id} · GitLab: {namespace.gitlabGroupId ?? '—'}</p>
        </div>
        <Link className="btn btn-ghost" to="/admin/namespaces">
          Back to list
        </Link>
      </div>

      <div className="panel">
        <div className="panel__head">
          <h2>Namespace users</h2>
        </div>
        {users.length === 0 ? (
          <p className="empty">No users in this namespace.</p>
        ) : (
          <div className="table">
            <div className="table__row table__head">
              <span>ID</span>
              <span>Username</span>
              <span>Role</span>
            </div>
            {users.map((user) => (
              <div key={user.id} className="table__row">
                <span>{user.id}</span>
                <span>{user.username}</span>
                <span>{user.role.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel__head">
          <h2>Namespace courses</h2>
        </div>
        {courses.length === 0 ? (
          <p className="empty">No courses in this namespace.</p>
        ) : (
          <div className="table">
            <div className="table__row table__head">
              <span>ID</span>
              <span>Course</span>
              <span>Status</span>
            </div>
            {courses.map((course) => (
              <Link key={course.id} to={course.url} className="table__row table__link">
                <span>{course.id}</span>
                <span>{course.name}</span>
                <span>{course.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
