import { useTasksVM } from '../viewmodels/useTasksVM'
import './Pages.css'

export function TasksPage() {
  const { board, groups, showPastDeadlines, togglePastDeadlines, loading, error } = useTasksVM()

  if (loading) return <div className="page-grid"><p className="subtle">Loading board…</p></div>
  if (error) return <div className="page-grid"><p className="error-msg">Error: {error}</p></div>
  if (!board) return null

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Course</p>
          <h1>{board.courseName}</h1>
          <p className="subtle">Progress overview and upcoming deadlines.</p>
        </div>
        <div className="header-actions">
          <div className="progress-card">
            <div className="progress-card__value">{board.solvedPercent}%</div>
            <div className="progress-card__meta">{board.solvedScore} / {board.maxScore} pts</div>
            <div className="progress-card__bar">
              <div className="progress-card__bar-fill" style={{ width: `${board.solvedPercent}%` }} />
            </div>
          </div>
          <button className="btn btn-ghost" type="button" onClick={togglePastDeadlines}>
            {showPastDeadlines ? 'Hide past' : 'Show past deadlines'}
          </button>
        </div>
      </div>

      {groups.map((group) => {
        const groupPct = group.scoreMax > 0 ? Math.round((group.scoreEarned / group.scoreMax) * 100) : 0
        return (
          <div key={group.id} className={`panel panel--group ${group.isSpecial ? 'panel--special' : ''}`}>
            <div className="panel__head">
              <div className="group-header">
                <h2>{group.name}</h2>
                <div className="group-meta">
                  <span className="group-score">{group.scoreEarned} / {group.scoreMax} pts</span>
                  <span className="group-pct">{groupPct}%</span>
                </div>
                <div className="group-bar">
                  <div className="group-bar__fill" style={{ width: `${groupPct}%` }} />
                </div>
              </div>

              {group.deadlines.length > 0 && (
                <div className="deadlines">
                  {group.deadlines.map((deadline) => {
                    const shouldHide = !showPastDeadlines && deadline.status === 'expired'
                    const diff = new Date(deadline.dueAt).getTime() - Date.now()
                    const days = Math.floor(diff / 86400000)
                    const hours = Math.floor((diff % 86400000) / 3600000)
                    const mins = Math.floor((diff % 3600000) / 60000)
                    const countdown = diff <= 0
                      ? 'Expired'
                      : days > 0 ? `${days}d ${hours}h`
                      : hours > 0 ? `${hours}h ${mins}m`
                      : `${mins}m`
                    return (
                      <div
                        key={deadline.id}
                        className={`deadline deadline--${deadline.status} ${shouldHide ? 'deadline--hidden' : ''}`}
                      >
                        <div className="deadline__top">
                          <span>{deadline.label}</span>
                          <span>{Math.round(deadline.percent * 100)}%</span>
                        </div>
                        <div className="deadline__time">
                          {new Date(deadline.dueAt).toLocaleDateString('ru-RU', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                          }).replace(/\./g, '.')}
                          {' · '}
                          {new Date(deadline.dueAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="deadline__expires">{countdown}</div>
                        <div className="deadline__bar">
                          <span style={{ width: `${deadline.percent * 100}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="task-grid">
              {group.tasks.map((task) => {
                const taskPct = task.score > 0 ? Math.min(100, Math.round((task.scoreEarned / task.score) * 100)) : 0
                return (
                  <article key={task.id} className={`task-card task-card--${task.status}`}>
                    <div className="task-card__top">
                      <h3>{task.name}</h3>
                      {(task.isBonus || task.isSpecial) && (
                        <span className={`status ${task.isSpecial ? 'status--doreshka' : 'status--created'}`}>
                          {task.isSpecial ? 'special' : 'bonus'}
                        </span>
                      )}
                    </div>
                    <div className="task-card__body">
                      <div className="task-card__score">
                        <span>{task.scoreEarned}</span>
                        <small>/{task.score}</small>
                      </div>
                      <div className="task-card__mini-bar">
                        <div className="task-card__mini-fill" style={{ width: `${taskPct}%` }} />
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )
      })}
    </section>
  )
}
