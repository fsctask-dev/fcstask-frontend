import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCourseScores } from '../api/endpoints'
import type { LeaderboardEntry } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import './Pages.css'

export function DatabasePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { user } = useAuth()
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

  const homeworks = useMemo(() => {
    const map = new Map<string, string>()
    for (const entry of entries) {
      for (const hw of entry.homeworks ?? []) {
        map.set(hw.homework_id, hw.homework_title || '—')
      }
    }
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }))
  }, [entries])

  const maxTotal = useMemo(() => Math.max(1, ...entries.map((e) => e.totalScore)), [entries])

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Course</p>
          <h1>All scores</h1>
          {!loading && !error && (
            <p className="subtle">
              {entries.length} participant{entries.length !== 1 ? 's' : ''}
              {homeworks.length > 0 && ` · ${homeworks.length} homework${homeworks.length !== 1 ? 's' : ''}`}
            </p>
          )}
        </div>
      </div>

      {loading && <div className="panel"><p className="subtle">Loading…</p></div>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && entries.length === 0 && (
        <div className="panel"><p className="empty">No submissions yet.</p></div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="sb-wrap">
          <table className="sb">
            <thead>
              <tr className="sb__head">
                <th className="sb__th sb__th--rank">#</th>
                <th className="sb__th sb__th--name">Student</th>
                {homeworks.map((hw) => (
                  <th key={hw.id} className="sb__th sb__th--hw" title={hw.title}>
                    {hw.title.length > 12 ? hw.title.slice(0, 11) + '…' : hw.title}
                  </th>
                ))}
                <th className="sb__th sb__th--total">Total</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const isMe = user?.username === entry.username
                const pct = maxTotal > 0 ? (entry.totalScore / maxTotal) * 100 : 0
                return (
                  <tr key={entry.username} className={`sb__row${isMe ? ' sb__row--me' : ''}`}>
                    <td className="sb__td sb__td--rank">{entry.rank}</td>
                    <td className="sb__td sb__td--name">
                      {entry.username}
                      {isMe && <span className="sb__you">you</span>}
                    </td>
                    {homeworks.map((hw) => {
                      const hwScore = (entry.homeworks ?? []).find((h) => h.homework_id === hw.id)
                      const score = hwScore?.total_score ?? 0
                      return (
                        <td key={hw.id} className={`sb__td sb__td--hw${score > 0 ? ' sb__td--scored' : ''}`}>
                          {score > 0 ? score : <span className="sb__zero">—</span>}
                        </td>
                      )
                    })}
                    <td className="sb__td sb__td--total">
                      <span className="sb__total-num">{entry.totalScore}</span>
                      <div className="sb__bar">
                        <div className="sb__bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
