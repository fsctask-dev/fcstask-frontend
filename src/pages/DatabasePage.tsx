import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getCourseScores } from '../api/endpoints'
import type { LeaderboardEntry, HomeworkScore } from '../api/endpoints'
import './Pages.css'

export function DatabasePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return
    setLoading(true)
    getCourseScores(courseId)
      .then(setEntries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [courseId])

  const homeworks: HomeworkScore[] = useMemo(() => {
    if (entries.length === 0) return []
    return entries[0].homeworks ?? []
  }, [entries])

  if (loading) return <div className="page-grid"><p className="subtle">Loading…</p></div>
  if (error) return <div className="page-grid"><p className="error-msg">{error}</p></div>

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Course</p>
          <h1>All scores</h1>
          <p className="subtle">Snapshot of course-wide submissions.</p>
        </div>
      </div>

      {entries.length === 0 || homeworks.length === 0 ? (
        <div className="panel"><p className="empty">No scores yet.</p></div>
      ) : (
        <div className="panel leaderboard-panel">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="lb-rank" rowSpan={2}>#</th>
                <th className="lb-name" rowSpan={2}>Participant</th>
                {homeworks.map(hw => (
                  <th key={hw.homework_id} className="lb-hw-header" colSpan={hw.tasks.length + 1}>
                    {hw.homework_title}
                  </th>
                ))}
                <th className="lb-grand-total" rowSpan={2}>Grand total</th>
              </tr>
              <tr>
                {homeworks.map(hw => (
                  <Fragment key={hw.homework_id}>
                    {hw.tasks.map(task => (
                      <th key={task.task_id} className="lb-task" title={task.title}>
                        {task.title}
                      </th>
                    ))}
                    <th className="lb-hw-total">Total</th>
                  </Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.username} className="lb-data">
                  <td className="lb-rank">#{entry.rank}</td>
                  <td className="lb-name">{entry.username}</td>
                  {entry.homeworks.map(hw => (
                    <Fragment key={hw.homework_id}>
                      {hw.tasks.map(task => (
                        <td key={task.task_id} className="lb-task">{task.score}</td>
                      ))}
                      <td className="lb-hw-total">{hw.total_score}</td>
                    </Fragment>
                  ))}
                  <td className="lb-grand-total">{entry.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

import { Fragment } from 'react'