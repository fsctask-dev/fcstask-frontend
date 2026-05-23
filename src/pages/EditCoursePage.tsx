import { useEffect } from 'react'
import { useParams } from 'react-router'
import { CourseForm } from '../components/CourseForm'
import { useCourseFormVM } from '../viewmodels/useCourseFormVM'
import './Pages.css'

export function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { form, updateField, submit, loading, loadCourse } = useCourseFormVM('edit')

  useEffect(() => {
    if (courseId) {
      loadCourse(courseId)
    }
  }, [courseId])

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Edit course</h1>
          <p className="subtle">Tweak schedules, descriptions, and publishing settings.</p>
        </div>
      </div>

      <div className="panel">
        <CourseForm form={form} onChange={updateField} submitLabel="Save changes" onSubmit={submit} loading={loading} />
      </div>
    </section>
  )
}
