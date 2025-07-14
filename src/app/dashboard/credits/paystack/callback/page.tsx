import { Suspense } from "react"

export default async function PaystackCallbackPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
    const { reference } = await searchParams;
    const CbHandler = async () => {
        if (!reference) {
            return <div className="text-red-500 text-center">Missing payment reference.</div>
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/credits/paystack/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference }),
            cache: "no-store"
        })
        const data = await res.json()
        if (res.ok && data.success) {
            return <div className="text-green-400 text-center font-bold text-lg">Payment successful! Credits have been added to your account.</div>
        } else {
            return <div className="text-red-400 text-center font-bold text-lg">Payment verification failed: {data.error || "Unknown error"}</div>
        }
    }

    return (
        <div className="w-full max-w-md mx-auto px-2 sm:px-4 md:px-6 py-10 flex flex-col gap-8">
            <section className="flex flex-col gap-2 items-center text-center mb-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">Payment <span className="text-orange-400">Verification</span></h1>
                <p className="text-white/60 text-base md:text-lg max-w-xl">We are verifying your payment. This will only take a moment.</p>
            </section>
            <div className="w-full border border-white/10 bg-black/80 text-white shadow-xl p-6 md:p-10 rounded-2xl relative flex flex-col gap-6">
                <Suspense fallback={<div className="text-center text-white/60">Verifying payment...</div>}>
                    <CbHandler />
                </Suspense>
            </div>
        </div>
    )
}