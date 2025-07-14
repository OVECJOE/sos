import { NextRequest, NextResponse } from "next/server"
import * as PaystackSDK from "paystack-sdk"

const paystack = new PaystackSDK.Paystack(process.env.PAYSTACK_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { amount, userId, email } = await req.json()
    if (!amount || !userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    // 100 Naira per credit, convert to kobo
    const nairaAmount = amount * 100
    const koboAmount = nairaAmount * 100
    const callback_url = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard/credits/paystack/callback`
    const response = await paystack.transaction.initialize({
      amount: koboAmount.toString(),
      email,
      callback_url,
      metadata: {
        userId,
        credits: amount,
      },
    })
    if (!response.status || !response.data) {
      return NextResponse.json({ error: response.message || "Paystack error" }, { status: 500 })
    }
    return NextResponse.json({ authorization_url: response.data.authorization_url, reference: response.data.reference })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}