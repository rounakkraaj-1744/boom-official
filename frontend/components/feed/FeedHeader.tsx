"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wallet, User, Upload, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

interface FeedHeaderProps {
  user: any
}

export default function FeedHeader({ user }: FeedHeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  }

  return (
    <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">BOOM Feed</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <Wallet className="w-5 h-5" />
              <span>₹{user?.walletBalance || 0}</span>
            </div>
            <Link href="/profile">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Link href="/upload">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </Link>
            <Button variant="destructive" size="sm" className="text-white" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}