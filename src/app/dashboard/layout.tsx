import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Home, Calendar, CreditCard, LogOut } from "lucide-react"
import { SignOutButton } from "@/components/auth/SignOutButton"
import Image from "next/image"
import React from "react"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-black border-r border-white/10 px-6 py-8 sticky top-0 z-20">
        <Link href="/dashboard" className="text-2xl font-bold tracking-tight mb-10">
          <span className="text-purple-400">So</span>S
        </Link>
        <nav className="flex-1 flex flex-col gap-2">
          <SidebarLink href="/dashboard" icon={<Home className="w-5 h-5" />} label="Dashboard" />
          <SidebarLink href="/dashboard/meetings/create" icon={<Calendar className="w-5 h-5" />} label="Create Meeting" />
          <SidebarLink href="/dashboard/credits" icon={<CreditCard className="w-5 h-5" />} label="Credits" />
        </nav>
        <div className="mt-8">
          <SignOutButton className="w-full flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition text-black hover:text-white">
            <LogOut className="w-5 h-5" /> Sign Out
          </SignOutButton>
        </div>
      </aside>
      {/* Mobile Sidebar */}
      <aside className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-black border-t border-white/10 flex justify-around py-2">
        <SidebarLink href="/dashboard" icon={<Home className="w-4 h-4" />} label="Home" />
        <SidebarLink href="/dashboard/meetings/create" icon={<Calendar className="w-4 h-4" />} label="Meet" />
        <SidebarLink href="/dashboard/credits" icon={<CreditCard className="w-4 h-4" />} label="Credits" />
        <SignOutButton className="flex flex-col items-center text-xs text-black">
          <LogOut className="w-4 h-4" />
        </SignOutButton>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="w-full border-b border-white/10 px-6 py-4 flex items-center justify-between bg-black/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Image src={session.user.image ? session.user.image : "/default-avatar.png"} alt={session.user.name || session.user.email || "User"} width={40} height={40} className="rounded-full border border-white/10" />
            <div>
              <div className="font-semibold text-white text-lg">{session.user.name || session.user.email}</div>
              <div className="text-xs text-white/40">{session.user.email}</div>
            </div>
          </div>
        </header>
        <main className="flex-1 bg-black/95 px-2 md:px-8 py-8 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition text-white/80 hover:text-white font-medium"
      prefetch={false}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  )
} 