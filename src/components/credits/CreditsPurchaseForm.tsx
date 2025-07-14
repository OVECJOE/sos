"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface CreditsPurchaseFormProps {
  user: {
    id: string
    email: string
    name?: string | null
    credits: number
  }
}

export default function CreditsPurchaseForm({ user }: CreditsPurchaseFormProps) {
  const [amount, setAmount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(Number(e.target.value))
  }

  async function handlePayment() {
    setError("")
    if (amount < 1 || !Number.isInteger(amount)) {
      setError("Enter a valid number of credits (minimum 1)")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/credits/paystack/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, userId: user.id, email: user.email }),
      })
      const data = await res.json()
      if (!res.ok || !data.authorization_url) throw new Error(data.error || "Failed to initialize payment")
      window.location.href = data.authorization_url
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full z-10">
      <div className="flex flex-col gap-2">
        <Label htmlFor="credits" className="text-sm font-medium">Number of Credits</Label>
        <Input
          id="credits"
          name="credits"
          type="number"
          min={1}
          value={amount}
          onChange={handleAmountChange}
          className={cn("bg-black border border-white/20 px-4 py-2 text-white focus:outline-none focus:border-white/40", error && "border-red-500")}
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
      <Button type="button" className="w-full mt-2 font-bold text-lg py-3 border border-orange-400/40 text-orange-400 hover:bg-orange-400/10" disabled={loading} onClick={handlePayment}>
        {loading ? "Redirecting..." : "Buy Credits"}
      </Button>
      <div className="text-xs text-white/40 text-center mt-2">Payments are processed securely via Paystack.</div>
    </div>
  )
}