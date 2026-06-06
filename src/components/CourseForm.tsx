import type { CourseFormState } from '../viewmodels/useCourseFormVM'
import './CourseForm.css'

interface CourseFormProps {
  form: CourseFormState
  onChange: <K extends keyof CourseFormState>(key: K, value: CourseFormState[K]) => void
  submitLabel: string
  onSubmit: () => void | Promise<void>
  loading?: boolean
  onCancel?: () => void
  isEdit?: boolean
}

export function CourseForm({ form, onChange, submitLabel, onSubmit, loading, onCancel, isEdit}: CourseFormProps) {
  return (
    <form className="course-form" onSubmit={(event) => {
      event.preventDefault()
      onSubmit()
    }}>
      <label>
        Course name
        <input
          className="input"
          value={form.name}
          onChange={(event) => onChange('name', event.target.value)}
        />
      </label>
      <label>
        Slug
        <input
          className={`input ${isEdit ? 'input--readonly' : ''}`}
          value={form.slug}
          onChange={(event) => onChange('slug', event.target.value)}
          readOnly={isEdit}
        />
      </label>
      <label>
        Status
        <select
          className="input"
          value={form.status}
          onChange={(event) => onChange('status', event.target.value as CourseFormState['status'])}
        >
          <option value="created">Created</option>
          <option value="hidden">Hidden</option>
          <option value="in_progress">In progress</option>
          <option value="finished">Finished</option>
        </select>
      </label>
      <label>
        Type
        <select
          className="input"
          value={form.type}
          onChange={(event) => onChange('type', event.target.value as 'public' | 'private')}
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </label>
      <label>
        Start date
        <input
          className="input"
          type="date"
          value={form.startDate}
          onChange={(event) => onChange('startDate', event.target.value)}
        />
      </label>
      <label>
        End date
        <input
          className="input"
          type="date"
          value={form.endDate}
          onChange={(event) => onChange('endDate', event.target.value)}
        />
      </label>
      <label>
        Repo template
        <input
          className="input"
          value={form.repoTemplate}
          onChange={(event) => onChange('repoTemplate', event.target.value)}
        />
      </label>
      <label className="course-form__full">
        Description
        <textarea
          className="input"
          rows={4}
          value={form.description}
          onChange={(event) => onChange('description', event.target.value)}
        />
      </label>
      <div className="course-form__actions">
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
