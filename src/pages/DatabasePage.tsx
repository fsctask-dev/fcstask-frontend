import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCourseScores } from '../api/endpoints'
import type { LeaderboardEntry } from '../api/endpoints'
import './Pages.css'

export function DatabasePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return
    getCourseScores(courseId)
      .then(setEntries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [courseId])

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Course</p>
          <h1>All scores</h1>
          <p className="subtle">Snapshot of course-wide submissions.</p>
        </div>
      </div>

      <div className="panel">
        {loading && <p className="subtle">Loading…</p>}
        {error && <p className="error-msg">{error}</p>}
        {!loading && !error && (
          <div className="table">
            <div className="table__row table__head">
              <span>Rank</span>
              <span>Student</span>
              <span>Total score</span>
            </div>
            {entries.length === 0 ? (
              <p className="empty">No scores yet.</p>
            ) : (
              entries.map((entry) => (
                <div key={entry.username} className="table__row">
                  <span>#{entry.rank}</span>
                  <span>{entry.username}</span>
                  <span>{entry.totalScore}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}
