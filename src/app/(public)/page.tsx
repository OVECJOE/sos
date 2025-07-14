import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { Calendar, Users, TrendingUp, Shield, Clock, Award } from "lucide-react"
import Logo from "@/components/common/Logo"

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 mb-6">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/60">Social Scoring for Meetings</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Build Trust Through
              <span className="block text-purple-400">Accountability</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Schedule meetings with confidence. Track attendance, penalize no-shows, and build public social scores that matter.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="bg-purple-400 text-black hover:bg-purple-400/90 font-semibold">
              <Link href="/auth/signin" className="flex items-center gap-2">
                <FcGoogle className="w-5 h-5" />
                Get Started Free
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border border-white/20 text-black hover:bg-white/5 hover:text-white">
              <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Trusted by teams worldwide</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Google OAuth secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <Logo size="xl" /> Works
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              A simple three-step process to transform your meeting culture
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative border border-white/10 p-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-orange-400"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 border border-purple-400/40 flex items-center justify-center text-purple-400 font-bold text-xl">1</div>
                <h3 className="text-xl font-semibold">Schedule & Invite</h3>
              </div>
              <p className="text-white/60 leading-relaxed">
                Create meetings with Google Meet integration. Set confirmation deadlines and score penalties for no-shows.
              </p>
            </div>

            <div className="relative border border-white/10 p-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-teal-400"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 border border-orange-400/40 flex items-center justify-center text-orange-400 font-bold text-xl">2</div>
                <h3 className="text-xl font-semibold">Track Attendance</h3>
              </div>
              <p className="text-white/60 leading-relaxed">
                Attendees confirm participation. Automatic attendance tracking when joining Google Meet links.
              </p>
            </div>

            <div className="relative border border-white/10 p-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-red-400"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 border border-teal-400/40 flex items-center justify-center text-teal-400 font-bold text-xl">3</div>
                <h3 className="text-xl font-semibold">Build Reputation</h3>
              </div>
              <p className="text-white/60 leading-relaxed">
                Public social scores reflect reliability. No-shows face penalties. Build trust through accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <Logo size="xl" /></h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              The only platform that makes meeting attendance matter
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-white/10 p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 border border-purple-400/40 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold">Public Social Scores</h3>
              </div>
              <p className="text-white/60">
                Every user has a public score (300-850) based on attendance and confirmation rates. Build reputation through reliability.
              </p>
            </div>

            <div className="border border-white/10 p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 border border-orange-400/40 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold">Automatic Penalties</h3>
              </div>
              <p className="text-white/60">
                No-shows face automatic score deductions. Organizers can trigger penalties after meetings end.
              </p>
            </div>

            <div className="border border-white/10 p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 border border-teal-400/40 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold">Google Meet Integration</h3>
              </div>
              <p className="text-white/60">
                Seamless integration with Google Meet. Automatic attendance tracking when joining meeting links.
              </p>
            </div>

            <div className="border border-white/10 p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 border border-red-400/40 flex items-center justify-center">
                  <Users className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold">Public Leaderboard</h3>
              </div>
              <p className="text-white/60">
                Compete on the public leaderboard. See who&apos;s most reliable. Build trust through transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Meeting Culture?
          </h2>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who&apos;ve made accountability their competitive advantage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-purple-400 text-black hover:bg-purple-400/90 font-semibold">
              <Link href="/auth/signin" className="flex items-center gap-2">
                <FcGoogle className="w-5 h-5" />
                Start Building Your Score
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border border-white/20 text-black hover:bg-white/5 hover:text-white">
              <Link href="/profiles">Browse Profiles</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
} 