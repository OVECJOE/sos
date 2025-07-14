import { NextRequest, NextResponse } from "next/server"
import * as PaystackSDK from "paystack-sdk"
import { prisma } from "@/lib/prisma"

const paystack = new PaystackSDK.Paystack(process.env.PAYSTACK_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json()
    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 })
    }
    const verifyRes = await paystack.transaction.verify(reference)
    if (!verifyRes.status || !verifyRes.data || verifyRes.data.status !== "success") {
      return NextResponse.json({ error: verifyRes.message || "Payment not successful" }, { status: 400 })
    }
    // Extract userId and credits from metadata
    const metadata = verifyRes.data.metadata || {}
    const userId = metadata.userId as string
    const credits = Number(metadata.credits)
    if (!userId || !credits) {
      return NextResponse.json({ error: "Missing user or credits in payment metadata" }, { status: 400 })
    }
    // Update user credits and record transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: credits } },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: "CREDIT_PURCHASE",
          amount: credits,
          description: `Purchased ${credits} credits via Paystack`,
        },
      }),
    ])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
} 