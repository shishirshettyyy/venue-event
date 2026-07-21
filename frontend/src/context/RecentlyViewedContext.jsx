import React, { createContext, useContext, useEffect, useState } from 'react'

const RecentlyViewedContext = createContext(null)
const STORAGE_KEY = 'venue.recentlyViewed'
const MAX_ITEMS = 8

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function RecentlyViewedProvider({ children }) {
  const [viewed, setViewed] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed))
  }, [viewed])

  function addViewed(id) {
    setViewed((prev) => [id, ...prev.filter((v) => v !== id)].slice(0, MAX_ITEMS))
  }

  return (
    <RecentlyViewedContext.Provider value={{ viewed, addViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext)
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider')
  return ctx
}
