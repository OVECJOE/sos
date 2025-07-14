import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
} 