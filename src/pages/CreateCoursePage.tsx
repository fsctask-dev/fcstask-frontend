import { useNavigate } from 'react-router-dom'
import { CourseForm } from '../components/CourseForm'
import { useCourseFormVM } from '../viewmodels/useCourseFormVM'
import './Pages.css'

export function CreateCoursePage() {
  const navigate = useNavigate()
  const { form, updateField, submit, loading, error } = useCourseFormVM('create', () => navigate('/my-courses'))

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Create course</h1>
          <p className="subtle">Set up a new learning track and its repository.</p>
        </div>
      </div>
      
      {error && <p className="error-msg">Error: {error}</p>}

      <div className="panel">
        <CourseForm form={form} onChange={updateField} submitLabel="Create course" onSubmit={submit} loading={loading} />
      </div>
    </section>
  )
}
