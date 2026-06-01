import { useEffect, useMemo, useState, useCallback } from 'react'
import { getCourses, getPublicCourses, getCourse, joinCourse, courseDTOToModel } from '../api/endpoints'
import type { Course } from '../models/types'

export interface CoursesVM {
  activeCourses: Course[]
  finishedCourses: Course[]
  showFinished: boolean
  toggleFinished: () => void
  loading: boolean
  error: string | null
  joining: boolean
  joinError: string | null
  joinCourseUrl: string | null
  joinBySlug: (slug: string, code?: string) => Promise<void>
}

export function useCoursesVM(isAuthenticated: boolean): CoursesVM {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFinished, setShowFinished] = useState(false)
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joinCourseUrl, setJoinCourseUrl] = useState<string | null>(null)

  const fetchCourses = useCallback(() => {
    setLoading(true)
    const fetch = isAuthenticated ? getCourses() : getPublicCourses()
    fetch
      .then((dtos) => setCourses((dtos ?? []).map(courseDTOToModel)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const { activeCourses, finishedCourses } = useMemo(() => {
    const finished: Course[] = []
    const active: Course[] = []
    courses.forEach((course) => {
      if (course.status === 'finished') {
        finished.push(course)
      } else {
        active.push(course)
      }
    })
    return { activeCourses: active, finishedCourses: finished }
  }, [courses])

  const joinBySlug = useCallback(async (slug: string, code?: string) => {
    setJoining(true)
    setJoinError(null)
    setJoinCourseUrl(null)
    try {
      const course = await getCourse(slug)
      try {
        await joinCourse(course.id, course.type === 'public' ? undefined : code)
        fetchCourses()
      } catch (joinErr: unknown) {
        const msg = joinErr instanceof Error ? joinErr.message : ''
        if (!msg.includes('already a participant')) {
          setJoinError(msg || 'Failed to join course')
          return
        }
      }
      setJoinCourseUrl(course.url)
    } catch (e: unknown) {
      setJoinError(e instanceof Error ? e.message : 'Failed to join course')
    } finally {
      setJoining(false)
    }
  }, [fetchCourses])

  return {
    activeCourses,
    finishedCourses,
    showFinished,
    toggleFinished: () => setShowFinished((v) => !v),
    loading,
    error,
    joining,
    joinError,
    joinCourseUrl,
    joinBySlug,
  }
}
