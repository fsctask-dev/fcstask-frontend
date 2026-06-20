import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { resolveCourse, listHomework, createHomework, deleteHomework, publishHomework } from '../api/endpoints'
import type { HomeworkDTO } from '../api/endpoints'

export function useAdminHomeworkVM() {
  const { courseId: courseSlug } = useParams<{ courseId: string }>()
  const [courseId, setCourseId] = useState<string | null>(null)
  const [homeworks, setHomeworks] = useState<HomeworkDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!courseSlug) return
    resolveCourse(courseSlug)
      .then((c) => setCourseId(c.id))
      .catch((e) => setError(e.message))
  }, [courseSlug])

  const fetch = useCallback(() => {
    if (!courseId) return
    setLoading(true)
    listHomework(courseId)
      .then(setHomeworks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [courseId])

  useEffect(() => { fetch() }, [fetch])

  const create = useCallback(async (title: string, startDate: string, endDate: string) => {
    if (!courseId) return
    setCreating(true)
    try {
      await createHomework(courseId, { title, position: homeworks.length, start_date: startDate, end_date: endDate })
      fetch()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create')
    } finally {
      setCreating(false)
    }
  }, [courseId, homeworks.length, fetch])

  const remove = useCallback(async (hwId: string) => {
    if (!courseId) return
    try {
      await deleteHomework(courseId, hwId)
      fetch()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete')
    }
  }, [courseId, fetch])

  const togglePublish = useCallback(async (hwId: string, current: boolean) => {
    if (!courseId) return
    try {
      await publishHomework(courseId, hwId, !current)
      fetch()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to publish')
    }
  }, [courseId, fetch])

  return { courseId, courseSlug, homeworks, loading, error, creating, create, remove, togglePublish }
}
