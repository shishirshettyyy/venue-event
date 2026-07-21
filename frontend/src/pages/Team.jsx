import React from 'react'
import { mission, stats, departments, values, techStack } from '../data/about.js'

export default function Team() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <p className="eyebrow">{mission.eyebrow}</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{mission.heading}</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{mission.body}</p>

      <div className="mt-10 flex flex-wrap gap-10 border-y border-line py-6">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-display text-2xl font-bold text-ink">{s.value}</p>
            <p className="mt-1 text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <p className="eyebrow">What we're building</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <p className="eyebrow">How it's organized</p>
        <div className="mt-4 space-y-4">
          {departments.map((d) => (
            <div key={d.name} className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-baseline sm:gap-6">
              <h3 className="w-56 shrink-0 font-display text-base font-semibold">{d.name}</h3>
              <p className="text-sm leading-relaxed text-muted">{d.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-line bg-surface p-6">
        <p className="eyebrow">Tech stack</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {techStack.map((t) => (
            <span key={t} className="chip cursor-default hover:border-line">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
