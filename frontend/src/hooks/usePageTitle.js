import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} — Venue` : 'Venue'
    return () => {
      document.title = previous
    }
  }, [title])
}
