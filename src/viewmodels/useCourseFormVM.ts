import { useState, useCallback } from 'react'
import { createCourse, updateCourse, getCourse } from '../api/endpoints'

export interface CourseFormState {
  name: string
  slug: string
  status: 'created' | 'hidden' | 'in_progress' | 'finished'
  startDate: string
  endDate: string
  repoTemplate: string
  description: string
}

export function useCourseFormVM(mode: 'create' | 'edit') {
  const [form, setForm] = useState<CourseFormState>({
    name: '',
    slug: '',
    status: 'created',
    startDate: '',
    endDate: '',
    repoTemplate: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [originalForm, setOriginalForm] = useState<CourseFormState | null>(null)
  const [courseId, setCourseId] = useState<string | null>(null)
  const updateField = <K extends keyof CourseFormState>(key: K, value: CourseFormState[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }
  const submit = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      if (mode === 'create') {
        const result = await createCourse({
          name: form.name,
          slug: form.slug,
          status: form.status,
          startDate: form.startDate,
          endDate: form.endDate,
          repoTemplate: form.repoTemplate,
          description: form.description,
        })
        setCourseId(result.id)
        setOriginalForm({ ...form })
      } else {
        if (!courseId) {
          setError('Course ID not set')
          return
        }
        await updateCourse(courseId, {
          name: form.name,
          slug: form.slug,
          status: form.status,
          startDate: form.startDate,
          endDate: form.endDate,
          repoTemplate: form.repoTemplate,
          description: form.description,
        })
        setOriginalForm({ ...form })
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save course')
    } finally {
      setLoading(false)
    }
  }
  const loadCourse = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const course = await getCourse(id)
      setCourseId(id)
      const courseData: CourseFormState = {
        name: course.name,
        slug: course.slug || '',
        status: (course.status as CourseFormState['status']) || 'created',
        startDate: course.start_date ? course.start_date.split('T')[0] : '',
        endDate: course.end_date ? course.end_date.split('T')[0] : '',
        repoTemplate: course.repo_template || '',
        description: course.description || '',
      }
      setForm(courseData)
      setOriginalForm(courseData)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load course')
    } finally {
      setLoading(false)
    }
  }, [])
  
  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm)
  const resetForm = () => {
    if (originalForm) {
      setForm({ ...originalForm })
    }
  }

  return {
    form,
    updateField,
    submit,
    loading,
    error,
    loadCourse,
    setForm,
    hasChanges,
    resetForm,
  }
}
