"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowLeft, Filter, Play, Eye, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface Video {
  id: string
  title: string
  description: string
  type: "SHORT_FORM" | "LONG_FORM"
  videoFile?: string
  videoUrl?: string
  price: number
  createdAt: string
  creator: {
    username: string
  }
  purchased?: boolean
}

export default function SearchPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [priceFilter, setPriceFilter] = useState("ALL")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const initialQuery = searchParams.get("q") || "";
    setQuery(initialQuery);
    if (initialQuery)
      performSearch(initialQuery);
  }, [router, searchParams])

  const performSearch = async (searchQuery: string, type = typeFilter, price = priceFilter) => {
    if (!searchQuery.trim())
      return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: type !== "ALL" ? type : "",
        price: price !== "ALL" ? price : "",
      });

      const response = await fetch(`http://localhost:8080/api/videos/search?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success)
        setVideos(data.videos)
    }
    catch (error) {
      console.error("Search failed:", error)
    }
    finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query, typeFilter, priceFilter)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "type") {
      setTypeFilter(value);
      performSearch(query, value, priceFilter);
    }
    else if (filterType === "price") {
      setPriceFilter(value);
      performSearch(query, typeFilter, value);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/feed">
              <Button variant="ghost" className="text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feed
              </Button>
            </Link>
          </div>

          {/* This is the search header*/}
          <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for videos, creators, or topics..."
                    className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"
                  />
                  <Button type="submit" disabled={loading}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>

                {/* Filters button */}
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-purple-300" />
                    <span className="text-purple-300 text-sm">Filters:</span>
                  </div>
                  <Select value={typeFilter} onValueChange={(value) => handleFilterChange("type", value)}>
                    <SelectTrigger className="w-40 bg-white/10 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Types</SelectItem>
                      <SelectItem value="SHORT_FORM">Short-Form</SelectItem>
                      <SelectItem value="LONG_FORM">Long-Form</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priceFilter} onValueChange={(value) => handleFilterChange("price", value)}>
                    <SelectTrigger className="w-40 bg-white/10 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Prices</SelectItem>
                      <SelectItem value="FREE">Free</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </CardContent>
          </Card>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-purple-200">Searching...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {videos.length > 0 ? (
                <>
                  <p className="text-purple-200">Found {videos.length} results</p>
                  {
                    videos.map((video) => (
                      <Card key={video.id} className="bg-white/10 backdrop-blur-sm border-purple-500/20">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-white">{video.title}</CardTitle>
                              <CardDescription className="text-purple-200">by @{video.creator.username}</CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={video.type === "SHORT_FORM" ? "default" : "secondary"}>
                                {video.type === "SHORT_FORM" ? "Short" : "Long"}
                              </Badge>
                              {video.price > 0 && <Badge variant="outline">₹{video.price}</Badge>}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-purple-100 mb-4">{video.description}</p>
                          <Link href={`/video/${video.id}`}>
                            <Button className="w-full">
                              {
                                video.type === "SHORT_FORM" ? <Play className="w-4 h-4 mr-2" /> : video.price > 0 && !video.purchased ?
                                  <ShoppingCart className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />
                              }
                              {video.type === "SHORT_FORM" ? "Watch" : video.price > 0 && !video.purchased ? `Buy for ₹${video.price}` : "Watch"}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                </>
              ) : query ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                  <p className="text-purple-300">Try adjusting your search terms or filters</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Search for content</h3>
                  <p className="text-purple-300">Enter keywords to find videos and creators</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}