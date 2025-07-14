import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 px-6 py-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <Logo size="md" />
                <div className="flex items-center gap-6 text-sm text-white/40">
                    <Link href="/leaderboard" className="hover:text-white transition">Leaderboard</Link>
                    <Link href="/profiles" className="hover:text-white transition">Profiles</Link>
                    <Link href="/auth/signin" className="hover:text-white transition">Sign In</Link>
                </div>
            </div>
        </footer>
    )
}
