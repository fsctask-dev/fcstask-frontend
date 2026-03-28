import { useEffect, useMemo, useState } from 'react'
import { getCourses, courseDTOToModel } from '../api/endpoints'
import type { Course } from '../models/types'

export interface CoursesVM {
  activeCourses: Course[]
  finishedCourses: Course[]
  showFinished: boolean
  toggleFinished: () => void
  loading: boolean
  error: string | null
}

export function useCoursesVM(): CoursesVM {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFinished, setShowFinished] = useState(false)

  useEffect(() => {
    getCourses()
      .then((dtos) => setCourses(dtos.map(courseDTOToModel)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

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

  return {
    activeCourses,
    finishedCourses,
    showFinished,
    toggleFinished: () => setShowFinished((v) => !v),
    loading,
    error,
  }
}
