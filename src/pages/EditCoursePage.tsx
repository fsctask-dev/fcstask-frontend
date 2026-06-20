import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CourseForm } from '../components/CourseForm'
import { useCourseFormVM } from '../viewmodels/useCourseFormVM'
import './Pages.css'

export function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { form, updateField, submit, loading, error, loadCourse, hasChanges, resetForm } = useCourseFormVM('edit')
  const navigate = useNavigate()
  const handleCancel = () => {
    if (hasChanges) {
      resetForm()
    } else {
      navigate(`/course/${courseId}`)
    }
  }

  useEffect(() => {
    if (courseId) {
      loadCourse(courseId)
    }
  }, [courseId, loadCourse])

  if (loading) return <div className="page-grid"><p className="subtle">Loading course…</p></div>

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Edit course</h1>
          <p className="subtle">Tweak schedules, descriptions, and publishing settings.</p>
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="panel">
        <CourseForm
          form={form}
          onChange={updateField}
          submitLabel="Save changes"
          onSubmit={async () => {
            const result = await submit()
            if (result) navigate(`/course/${courseId}`)
          }}
          loading={loading}
          onCancel={handleCancel}
          isEdit
        />
      </div>
    </section>
  )
}
