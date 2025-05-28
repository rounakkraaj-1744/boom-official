"use client"
import type React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"

export default function SearchBar() {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query.trim())
      router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="flex gap-4 mb-8">
      <div className="flex-1">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
            <Input name="search" placeholder="Search videos, creators..."
              className="pl-10 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"/>
          </div>
        </form>
      </div>
      <Link href="/search">
        <Button variant="outline" size="sm">
          <Search className="w-4 h-4 mr-2" />
          Advanced Search
        </Button>
      </Link>
    </div>
  )
}