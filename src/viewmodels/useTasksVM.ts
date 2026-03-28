import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCourseBoard } from '../api/endpoints'
import type { Task, TaskStatus, TaskBoardSummary } from '../models/types'

interface TaskView extends Task {
  status: TaskStatus
}

interface TaskGroupView {
  id: string
  name: string
  scoreEarned: number
  scoreMax: number
  isSpecial?: boolean
  deadlines: TaskBoardSummary['groups'][number]['deadlines']
  tasks: TaskView[]
}

export interface TasksVM {
  board: TaskBoardSummary | null
  groups: TaskGroupView[]
  showPastDeadlines: boolean
  togglePastDeadlines: () => void
  loading: boolean
  error: string | null
}

const getTaskStatus = (task: Task): TaskStatus => {
  if (task.scoreEarned > task.score) return 'over_solved'
  if (task.scoreEarned === task.score) return 'solved'
  if (task.scoreEarned > 0) return 'solved_partially'
  return 'unsolved'
}

export function useTasksVM(): TasksVM {
  const { courseId } = useParams<{ courseId: string }>()
  const [board, setBoard] = useState<TaskBoardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPastDeadlines, setShowPastDeadlines] = useState(false)

  useEffect(() => {
    if (!courseId) return
    setLoading(true)
    getCourseBoard(courseId)
      .then(setBoard)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [courseId])

  const groups = useMemo(() => {
    if (!board) return []
    return board.groups.map((group) => {
      const tasks: TaskView[] = group.tasks.map((task) => ({
        ...task,
        status: getTaskStatus(task),
      }))
      const scoreMax = group.tasks
        .filter((task) => !task.isBonus)
        .reduce((total, task) => total + task.score, 0)
      const scoreEarned = group.tasks.reduce((total, task) => total + task.scoreEarned, 0)
      return {
        id: group.id,
        name: group.name,
        isSpecial: group.isSpecial,
        deadlines: group.deadlines,
        tasks,
        scoreMax,
        scoreEarned,
      }
    })
  }, [board])

  return {
    board,
    groups,
    showPastDeadlines,
    togglePastDeadlines: () => setShowPastDeadlines((v) => !v),
    loading,
    error,
  }
}
