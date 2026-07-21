import React from 'react'

export default function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="skeleton h-44 w-full" />
      <div className="p-4">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton mt-2.5 h-4 w-full rounded" />
        <div className="skeleton mt-2 h-4 w-2/3 rounded" />
        <div className="skeleton mt-3 h-3 w-1/2 rounded" />
      </div>
    </div>
  )
}
