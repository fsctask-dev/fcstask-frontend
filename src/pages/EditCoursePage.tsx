import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CourseForm } from '../components/CourseForm'
import { useCourseFormVM } from '../viewmodels/useCourseFormVM'
import './Pages.css'

export function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { form, updateField, submit, loading, loadCourse, hasChanges, resetForm } = useCourseFormVM('edit')
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
        <CourseForm form={form} onChange={updateField} submitLabel="Save changes" onSubmit={submit} loading={loading} onCancel={handleCancel} isEdit />
      </div>
    </section>
  )
}
