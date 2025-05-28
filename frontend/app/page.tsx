"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import AuthTabs from "@/components/auth/AuthTabs"
import WelcomeHeader from "@/components/auth/WelcomeHeader"
import WalletPromo from "@/components/auth/WalletPromo"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) 
      router.push("/feed");
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <WelcomeHeader />
        <div className="max-w-md mx-auto">
          <AuthTabs />
        </div>
        <WalletPromo />
      </div>
    </div>
  )
}