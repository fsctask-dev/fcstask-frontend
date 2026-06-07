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
          <h1>{board.courseName}</h1>
          <p className="subtle">Progress overview and upcoming deadlines.</p>
        </div>
        <div className="header-actions">
          <div className="progress-card">
            <div className="progress-card__value">{board.solvedPercent}%</div>
            <div className="progress-card__meta">
              {board.solvedScore}/{board.maxScore}
            </div>
          </div>
          <button className="btn btn-ghost" type="button" onClick={togglePastDeadlines}>
            {showPastDeadlines ? 'Hide past deadlines' : 'Show past deadlines'}
          </button>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.id} className={`panel panel--group ${group.isSpecial ? 'panel--special' : ''}`}>
          <div className="panel__head">
            <div>
              <h2>{group.name}</h2>
              <p className="group-score">Score: {group.scoreEarned}/{group.scoreMax}</p>
            </div>
            <div className="deadlines">
              {group.deadlines.map((deadline) => {
                const shouldHide = !showPastDeadlines && deadline.status === 'expired'
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
                      {new Date(deadline.dueAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\./g, '-')}
                      {' '}
                      <svg style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      {new Date(deadline.dueAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {(() => {
                      const diff = new Date(deadline.dueAt).getTime() - Date.now()
                      if (diff <= 0) return <div className="deadline__expires">Expired</div>
                      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
                      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                      const label = days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
                      return <div className="deadline__expires">Expires in: {label}</div>
                    })()}
                    <div className="deadline__bar">
                      <span style={{ width: `${deadline.percent * 100}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="task-grid">
            {group.tasks.map((task) => (
              <article key={task.id} className={`task-card task-card--${task.status}`}>
                <div>
                  <h3>{task.name}</h3>
                  {(task.isBonus || task.isSpecial) && (
                    <p className="meta">{task.isSpecial ? 'Special' : 'Bonus'}</p>
                  )}
                </div>
                <div className="task-card__score">
                  <span>{task.scoreEarned}</span>
                  <small>/{task.score}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
