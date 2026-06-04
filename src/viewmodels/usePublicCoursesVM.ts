import { useEffect, useState } from 'react'
import { getPublicCourses, courseDTOToModel } from '../api/endpoints'
import type { Course } from '../models/types'

export interface PublicCoursesVM {
  courses: Course[]
  loading: boolean
  error: string | null
}

export function usePublicCoursesVM(): PublicCoursesVM {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPublicCourses()
      .then((dtos) => setCourses((dtos ?? []).map(courseDTOToModel)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { courses, loading, error }
}
