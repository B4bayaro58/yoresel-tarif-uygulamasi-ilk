'use client'

import React from 'react'

export default function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      {/* Image area */}
      <div className="skeleton" style={{ height: '210px', borderRadius: 0 }} />

      {/* Body */}
      <div className="px-3 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="skeleton" style={{ height: 10, width: 36, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 10, width: 24, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 10, width: 32, borderRadius: 6 }} />
        </div>
        <div className="skeleton" style={{ height: 18, width: 44, borderRadius: 999 }} />
      </div>
    </div>
  )
}
