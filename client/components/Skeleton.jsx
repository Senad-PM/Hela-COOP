import React from 'react'

export const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-shimmer bg-gray-200/70 ${className}`} />
)


export const SkeletonStatCard = ({ bg = 'bg-gray-50' }) => (
  <div className={`flex items-center ${bg} rounded-2xl p-4 gap-3`}>
    <SkeletonBlock className='w-10 h-10 rounded-full flex-shrink-0' />
    <div className='flex flex-col gap-2 flex-1'>
      <SkeletonBlock className='h-5 w-16 rounded-md' />
      <SkeletonBlock className='h-3 w-24 rounded-md' />
    </div>
  </div>
)

export const SkeletonStatGrid = ({ count = 4, cols = 4 }) => (
  <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonStatCard key={i} />
    ))}
  </div>
)

export const SkeletonRow = ({ cols = 6, index = 0 }) => (
  <div
    className={`grid px-4 py-3 rounded-xl items-center gap-3 ${index % 2 === 0 ? 'bg-white/70' : 'bg-white/40'}`}
    style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
  >
    {Array.from({ length: cols }).map((_, i) => (
      <SkeletonBlock key={i} className={`h-4 rounded-md ${i === 0 ? 'w-14' : i === 1 ? 'w-28' : 'w-16'}`} />
    ))}
  </div>
)

export const SkeletonTable = ({ rows = 6, cols = 6 }) => (
  <div className='space-y-1'>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} cols={cols} index={i} />
    ))}
  </div>
)

export default SkeletonBlock