import MeetingCreateForm from "@/components/meeting/MeetingCreateForm"
import { Card } from "@/components/ui/card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function CreateMeetingPage() {
  const session = await getServerSession(authOptions)
  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 md:px-6 py-10 flex flex-col gap-8">
      <section className="flex flex-col gap-2 items-center text-center mb-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">Create a <span className="text-purple-400">New Meeting</span></h1>
        <p className="text-white/60 text-base md:text-lg max-w-xl">Schedule a meeting, invite others, and keep everyone accountable. Fill in the details below to get started.</p>
      </section>
      <Card className="w-full border border-white/10 bg-black/80 text-white p-6 md:p-10 shadow-xl rounded-2xl relative">
        <MeetingCreateForm userId={session!.user.id} />
      </Card>
    </div>
  )
} 