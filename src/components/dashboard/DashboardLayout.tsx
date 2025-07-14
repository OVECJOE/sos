import React from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 relative min-h-[70vh]">
      {/* Subtle accent border for creative effect */}
      <div className="absolute inset-0 border border-white/10 pointer-events-none z-0" />
      {children}
    </section>
  )
} 