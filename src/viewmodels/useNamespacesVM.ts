import { useEffect, useState } from 'react'
import { getNamespaces } from '../api/endpoints'
import type { NamespaceDTO } from '../api/endpoints'

export function useNamespacesVM() {
  const [namespaces, setNamespaces] = useState<NamespaceDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getNamespaces()
      .then(setNamespaces)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { namespaces, loading, error }
}
