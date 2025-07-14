import React from "react"

export default function CreditsCard({ credits }: { credits: number }) {
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-widest text-orange-400/80 mb-2">Credits</div>
      <div className="text-3xl font-bold text-orange-400 mb-2">{credits}</div>
      <div className="text-sm text-white/60">Available for meetings</div>
    </div>
  )
} 