import React from 'react'

const styles = {
  Workshop: 'from-[#3D1560] to-[#5A2A85]',
  Meetup: 'from-[#2A0F45] to-[#3D1560]',
  Show: 'from-[#D8431F] to-[#F05537]',
  Concert: 'from-[#8C2B5A] to-[#C13B72]',
  Conference: 'from-[#241035] to-[#4A2168]',
}

const marks = {
  Workshop: '⌁',
  Meetup: '◎',
  Show: '✶',
  Concert: '♪',
  Conference: '▢',
}

export default function CategoryArt({ category, className = '' }) {
  const gradient = styles[category] || styles.Workshop
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      <span className="font-display text-4xl text-white/25">{marks[category] || '✶'}</span>
      <span className="absolute bottom-3 left-3 rounded-full bg-black/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white">
        {category}
      </span>
    </div>
  )
}
