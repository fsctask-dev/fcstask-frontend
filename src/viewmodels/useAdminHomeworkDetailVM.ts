import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import {
  getCourse, getHomework, updateHomework, publishHomework,
  listTasks, createTask, publishTask, deleteTask,
  getDeadlineByHwId, setDeadline, deleteDeadline,
} from '../api/endpoints'
import type { HomeworkDTO, TaskDTO, DeadlineDTO } from '../api/endpoints'

export function useAdminHomeworkDetailVM() {
  const { courseId: courseSlug, hwId } = useParams<{ courseId: string; hwId: string }>()
  const [courseId, setCourseId] = useState<string | null>(null)
  const [homework, setHomework] = useState<HomeworkDTO | null>(null)
  const [tasks, setTasks] = useState<TaskDTO[]>([])
  const [deadline, setDeadlineState] = useState<DeadlineDTO | null>(null)
  const [deadlineDate, setDeadlineDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseSlug) return
    getCourse(courseSlug)
      .then((c) => setCourseId(c.id))
      .catch((e) => setError(e.message))
  }, [courseSlug])

  const fetchAll = useCallback(() => {
    if (!courseId || !hwId) return
    setLoading(true)
    Promise.all([
      getHomework(courseId, hwId),
      listTasks(courseId, hwId),
      getDeadlineByHwId(hwId).catch(() => null),
    ])
      .then(([hw, taskList, dl]) => {
        setHomework(hw)
        setTasks(taskList)
        setDeadlineDate(dl as string | null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [courseId, hwId])

  useEffect(() => { fetchAll() }, [fetchAll])

  const save = useCallback(async (data: Partial<HomeworkDTO>) => {
    if (!courseId || !hwId) return
    setSaving(true)
    try {
      const updated = await updateHomework(courseId, hwId, data)
      setHomework(updated)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }, [courseId, hwId])

  const togglePublishHw = useCallback(async () => {
    if (!courseId || !hwId || !homework) return
    try {
      const updated = await publishHomework(courseId, hwId, !homework.is_public)
      setHomework(updated)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to publish')
    }
  }, [courseId, hwId, homework])

  const togglePublishTask = useCallback(async (taskId: string, current: boolean) => {
    if (!courseId || !hwId) return
    try {
      await publishTask(courseId, hwId, taskId, !current)
      fetchAll()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to publish task')
    }
  }, [courseId, hwId, fetchAll])

  const addTask = useCallback(async (title: string, score: number, taskUrl?: string) => {
    if (!courseId || !hwId) return
    try {
      await createTask(courseId, hwId, { title, score, task_url: taskUrl || undefined })
      fetchAll()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create task')
    }
  }, [courseId, hwId, fetchAll])

  const removeTask = useCallback(async (taskId: string) => {
    if (!courseId || !hwId) return
    try {
      await deleteTask(courseId, hwId, taskId)
      fetchAll()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete task')
    }
  }, [courseId, hwId, fetchAll])

  const saveDeadline = useCallback(async (title: string, dueDate: string) => {
    if (!courseId || !hwId) return
    try {
      const rfc3339 = new Date(dueDate).toISOString()
      const dl = await setDeadline(courseId, hwId, { title, due_date: rfc3339 })
      setDeadlineState(dl)
      setDeadlineDate(dueDate)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to set deadline')
    }
  }, [courseId, hwId])

  const removeDeadline = useCallback(async () => {
    if (!deadline) return
    try {
      await deleteDeadline(deadline.id)
      setDeadlineState(null)
      setDeadlineDate(null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete deadline')
    }
  }, [deadline])

  return {
    courseId, hwId, homework, tasks, deadline, deadlineDate,
    loading, saving, error, setError,
    save, togglePublishHw, addTask, togglePublishTask, removeTask,
    saveDeadline, removeDeadline,
  }
}
