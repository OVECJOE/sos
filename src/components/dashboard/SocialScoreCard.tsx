import React from "react"

export default function SocialScoreCard({ score }: { score: number }) {
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-widest text-purple-400/80 mb-2">Social Score</div>
      <div className="text-3xl font-bold text-purple-400 mb-2">{score}</div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div 
          className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-orange-400"
          style={{ 
            width: `${Math.min(100, Math.max(0, ((score - 300) / (850 - 300)) * 100))}%` 
          }}
        />
      </div>
    </div>
  )
} 