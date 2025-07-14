import Image from "next/image"
import React from "react"

interface UserProfileCardProps {
  user: {
    id: string
    name?: string | null
    email: string
    image?: string | null
  }
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {user.image && (
        <Image 
          src={user.image} 
          alt={user.name || user.email} 
          width={80}
          height={80}
          className="w-20 h-20 rounded-full border-2 border-white/20 mb-4" 
        />
      )}
      <div className="text-xl font-semibold text-white mb-1">{user.name || user.email}</div>
      <div className="text-sm text-white/60">{user.email}</div>
    </div>
  )
}