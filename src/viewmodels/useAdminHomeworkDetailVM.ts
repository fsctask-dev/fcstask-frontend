import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import {
  getCourse, getHomework, updateHomework, publishHomework,
  listTasks, createTask, publishTask, deleteTask,
} from '../api/endpoints'
import type { HomeworkDTO, TaskDTO } from '../api/endpoints'

export function useAdminHomeworkDetailVM() {
  const { courseId: courseSlug, hwId } = useParams<{ courseId: string; hwId: string }>()
  const [courseId, setCourseId] = useState<string | null>(null)
  const [homework, setHomework] = useState<HomeworkDTO | null>(null)
  const [tasks, setTasks] = useState<TaskDTO[]>([])
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
    Promise.all([getHomework(courseId, hwId), listTasks(courseId, hwId)])
      .then(([hw, taskList]) => {
        setHomework(hw)
        setTasks(taskList)
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

  const addTask = useCallback(async (score: number, taskUrl?: string) => {
    if (!courseId || !hwId) return
    try {
      await createTask(courseId, hwId, { score, task_url: taskUrl || undefined })
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

  return { courseId, hwId, homework, tasks, loading, saving, error, save, togglePublishHw, addTask, togglePublishTask, removeTask }
}
