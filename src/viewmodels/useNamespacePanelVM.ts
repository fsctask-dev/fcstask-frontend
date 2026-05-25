import { useEffect, useState } from 'react'
import { getNamespace, getNamespaceUsers, getNamespaceCourses } from '../api/endpoints'
import type { NamespaceDTO, NamespaceUserDTO, NamespaceCourseDTO } from '../api/endpoints'

export function useNamespacePanelVM(namespaceId?: string) {
  const [namespace, setNamespace] = useState<NamespaceDTO>({ id: '', name: '', slug: '', coursesCount: 0, usersCount: 0 })
  const [users, setUsers] = useState<NamespaceUserDTO[]>([])
  const [courses, setCourses] = useState<NamespaceCourseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!namespaceId) return

    Promise.all([
      getNamespace(namespaceId),
      getNamespaceUsers(namespaceId),
      getNamespaceCourses(namespaceId),
    ])
      .then(([ns, usersData, coursesData]) => {
        setNamespace(ns)
        setUsers(usersData)
        setCourses(coursesData)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [namespaceId])

  return { namespace, users, courses, loading, error }
}
