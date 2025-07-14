"use client"
import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createMeetingSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ZodIssue } from "zod"
import { Card as PreviewCard, CardHeader as PreviewCardHeader, CardTitle as PreviewCardTitle, CardContent as PreviewCardContent } from "@/components/ui/card"

interface MeetingCreateFormProps {
  userId: string
}

const steps = [
  { label: "Basic Info" },
  { label: "Scheduling" },
  { label: "Preview & Confirm" },
]

export default function MeetingCreateForm({ userId }: MeetingCreateFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    description: "",
    googleMeetLink: "",
    scheduledStart: "",
    scheduledEnd: "",
    confirmationDeadline: "",
    scorePenalty: 25,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const [step, setStep] = useState(0)
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!titleInputRef.current) return
    const handleFocus = () => {
      if (!form.title) {
        setForm(f => ({ ...f, title: "Weekly Sync Meeting" }))
      }
    }
    const input = titleInputRef.current
    input.addEventListener("focus", handleFocus)
    return () => input.removeEventListener("focus", handleFocus)
  }, [form.title])

  useEffect(() => {
    const prevLink = typeof window !== "undefined" ? localStorage.getItem("lastGoogleMeetLink") : null
    if (prevLink && !form.googleMeetLink) {
      setForm(f => ({ ...f, googleMeetLink: prevLink }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (form.googleMeetLink) {
      localStorage.setItem("lastGoogleMeetLink", form.googleMeetLink)
    }
  }, [form.googleMeetLink])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function nextStep() {
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }
  function prevStep() {
    setStep((s) => Math.max(s - 1, 0))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setApiError("")
    function toISO(val: string) {
      if (!val) return ""
      if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) return val // already has seconds
      if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val)) {
        // Add seconds and Z (UTC) if missing
        return new Date(val).toISOString()
      }
      return val
    }
    const formForValidation = {
      ...form,
      scheduledStart: toISO(form.scheduledStart),
      scheduledEnd: toISO(form.scheduledEnd),
      confirmationDeadline: toISO(form.confirmationDeadline),
      scorePenalty: typeof form.scorePenalty === 'string' ? Number(form.scorePenalty) : form.scorePenalty,
    }
    const parsed = createMeetingSchema.safeParse(formForValidation)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.issues.forEach((err: ZodIssue) => {
        if (typeof err.path[0] === "string") fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      setStep(0)
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formForValidation, organizerId: userId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create meeting")
      // Confetti and modal before redirect
      if (typeof window !== "undefined") {
        const confetti = (await import("canvas-confetti")).default
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.7 },
          zIndex: 9999,
        })
      }
      alert("🎉 Meeting Created! Redirecting to dashboard...")
      router.push(`/dashboard`)
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex flex-col ${step === 2 ? 'md:flex-row' : ''} gap-6 md:gap-10 w-full max-w-4xl mx-auto`}>
        <div className="flex-1 min-w-0">
          <Card className="bg-transparent border-none shadow-none p-0">
            {/* Stepper Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((s, i) => (
                <div key={s.label} className="flex items-center gap-1">
                  <div className={`rounded-full w-3 h-3 border-2 ${i <= step ? 'bg-purple-400 border-purple-400' : 'bg-white/10 border-white/20'} transition-all`} />
                  {i < steps.length - 1 && <div className="w-8 h-0.5 bg-white/20" />}
                </div>
              ))}
            </div>
            <CardHeader className="mb-2">
              <CardTitle className="text-xl font-semibold">{steps[step].label}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {step === 0 && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="title" className="text-white font-bold text-lg">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      value={form.title}
                      onChange={handleChange}
                      className="text-white"
                      placeholder="e.g. Product Sync, Team Standup"
                      aria-invalid={!!errors.title}
                      required
                      ref={titleInputRef}
                    />
                    <span className="text-xs text-white/40">Give your meeting a clear, descriptive name.</span>
                    {errors.title && <span className="text-xs text-destructive mt-1">{errors.title}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="description" className="text-white font-bold text-lg">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="text-white resize-none"
                      placeholder="Add a short description (optional)"
                      aria-invalid={!!errors.description}
                      rows={3}
                    />
                    <span className="text-xs text-white/40">Let attendees know what to expect.</span>
                    {errors.description && <span className="text-xs text-destructive mt-1">{errors.description}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="googleMeetLink" className="text-white font-bold text-lg">Google Meet Link</Label>
                    <Input
                      id="googleMeetLink"
                      name="googleMeetLink"
                      type="url"
                      value={form.googleMeetLink}
                      onChange={handleChange}
                      className="text-white"
                      placeholder="https://meet.google.com/xyz-1234"
                      aria-invalid={!!errors.googleMeetLink}
                      required
                    />
                    <span className="text-xs text-white/40">Paste your Google Meet link here. We will remember it for next time!</span>
                    {errors.googleMeetLink && <span className="text-xs text-destructive mt-1">{errors.googleMeetLink}</span>}
                  </div>
                </>
              )}
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="scheduledStart" className="text-white font-bold text-lg">Start Time</Label>
                      <Input
                        id="scheduledStart"
                        name="scheduledStart"
                        type="datetime-local"
                        value={form.scheduledStart}
                        onChange={handleChange}
                        className="text-white"
                        aria-invalid={!!errors.scheduledStart}
                        required
                      />
                      <span className="text-xs text-white/40">When does your meeting begin?</span>
                      {errors.scheduledStart && <span className="text-xs text-destructive mt-1">{errors.scheduledStart}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="scheduledEnd" className="text-white font-bold text-lg">End Time</Label>
                      <Input
                        id="scheduledEnd"
                        name="scheduledEnd"
                        type="datetime-local"
                        value={form.scheduledEnd}
                        onChange={handleChange}
                        className="text-white"
                        aria-invalid={!!errors.scheduledEnd}
                        required
                      />
                      <span className="text-xs text-white/40">Set an end time to help attendees plan.</span>
                      {errors.scheduledEnd && <span className="text-xs text-destructive mt-1">{errors.scheduledEnd}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="confirmationDeadline" className="text-white font-bold text-lg">Confirmation Deadline</Label>
                    <Input
                      id="confirmationDeadline"
                      name="confirmationDeadline"
                      type="datetime-local"
                      value={form.confirmationDeadline}
                      onChange={handleChange}
                      className="text-white"
                      aria-invalid={!!errors.confirmationDeadline}
                      required
                    />
                    <span className="text-xs text-white/40">Attendees must confirm before this deadline.</span>
                    {errors.confirmationDeadline && <span className="text-xs text-destructive mt-1">{errors.confirmationDeadline}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="scorePenalty" className="text-white font-bold text-lg">Score Penalty</Label>
                    <Input
                      id="scorePenalty"
                      name="scorePenalty"
                      type="number"
                      min={5}
                      max={100}
                      value={form.scorePenalty}
                      onChange={handleChange}
                      className="text-white"
                      aria-invalid={!!errors.scorePenalty}
                      required
                    />
                    <span className="text-xs text-white/40">How many points are lost for no-shows?</span>
                    {errors.scorePenalty && <span className="text-xs text-destructive mt-1">{errors.scorePenalty}</span>}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="flex flex-col gap-4 items-center text-center">
                  <div className="text-lg font-semibold">Review your meeting details before submitting.</div>
                </div>
              )}
              {apiError && <div className="text-destructive text-sm text-center mt-2">{apiError}</div>}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 mt-2">
              <div className="flex w-full justify-between gap-2">
                {!loading && (
                  <Button type="button" variant="secondary" onClick={prevStep} disabled={step === 0}>
                    Back
                  </Button>
                )}
                {step < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep} className="ml-auto">
                    Next
                  </Button>
                ) : (
                  <Button type="submit" size="lg" className="font-bold text-lg py-3 w-full" disabled={loading}>
                    {loading ? <><Spinner size="sm" /> Creating...</> : "Create Meeting"}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
        {/* Live Preview Card - only show on final step */}
        {step === 2 && (
          <div className="flex-1 min-w-0 md:max-w-sm w-full md:w-auto mt-6 md:mt-0">
            <PreviewCard className="bg-black/80 border border-white/10 shadow-lg rounded-2xl p-6 flex flex-col gap-4 w-full max-w-full">
              <PreviewCardHeader>
                <PreviewCardTitle className="text-xl font-bold text-purple-400">{form.title || "Meeting Title"}</PreviewCardTitle>
              </PreviewCardHeader>
              <PreviewCardContent className="flex flex-col gap-2">
                <div className="text-white/80 text-base min-h-[2.5rem]">{form.description || "Meeting description will appear here."}</div>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-xs text-white/40">Start:</span>
                  <span className="text-sm text-white font-medium">{form.scheduledStart ? new Date(form.scheduledStart).toLocaleString() : "Not set"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-white/40">End:</span>
                  <span className="text-sm text-white font-medium">{form.scheduledEnd ? new Date(form.scheduledEnd).toLocaleString() : "Not set"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-white/40">Confirmation Deadline:</span>
                  <span className="text-sm text-white font-medium">{form.confirmationDeadline ? new Date(form.confirmationDeadline).toLocaleString() : "Not set"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-white/40">Google Meet Link:</span>
                  <span className="text-sm text-blue-400 break-all">{form.googleMeetLink || "https://meet.google.com/xyz-1234"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-white/40">Score Penalty:</span>
                  <span className="text-sm text-red-400 font-bold">{form.scorePenalty}</span>
                </div>
              </PreviewCardContent>
            </PreviewCard>
          </div>
        )}
      </div>
    </form>
  )
}