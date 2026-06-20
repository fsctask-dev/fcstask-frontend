import { useEffect, useState } from 'react'
import { getPublicCourses } from '../api/endpoints'
import type { CourseDTO } from '../api/endpoints'

export interface PublicCoursesVM {
  courses: CourseDTO[]
  loading: boolean
  error: string | null
}

export function usePublicCoursesVM(): PublicCoursesVM {
  const [courses, setCourses] = useState<CourseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPublicCourses()
      .then((dtos) => setCourses(dtos ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { courses, loading, error }
}
