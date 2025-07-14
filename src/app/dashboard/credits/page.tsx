import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CreditsPurchaseForm from "@/components/credits/CreditsPurchaseForm"
import { Card } from "@/components/ui/card"

export default async function CreditsPage() {
  const session = await getServerSession(authOptions)
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { id: true, credits: true, email: true, name: true },
  })

  if (!user) return null

  return (
    <div className="w-full max-w-xl mx-auto px-2 sm:px-4 md:px-6 py-10 flex flex-col gap-8">
      <section className="flex flex-col gap-2 items-center text-center mb-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">Buy <span className='text-orange-400'>Credits</span></h1>
        <p className="text-white/60 text-base md:text-lg max-w-xl">Purchase credits to schedule meetings and unlock more features. Payments are secure and instant.</p>
      </section>
      <Card className="w-full border border-white/10 bg-black/80 text-white p-6 md:p-10 shadow-xl rounded-2xl relative flex flex-col gap-6">
        <div className="mb-4 text-center">
          <span className="text-lg font-semibold">Current Credits:</span>
          <span className="ml-2 text-2xl font-extrabold text-orange-400">{user.credits}</span>
        </div>
        <CreditsPurchaseForm user={user} />
      </Card>
    </div>
  )
} 