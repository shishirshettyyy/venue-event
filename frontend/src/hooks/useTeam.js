import { useEffect, useState } from 'react'
import { api } from '../utils/api.js'

// ─── Fetch team members from GET /api/team (public, sorted by order asc) ──────
export function useTeam() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    api.get('/team')
      .then(data => {
        if (!cancelled) setMembers(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setError('Could not load team members right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { members, loading, error }
}
