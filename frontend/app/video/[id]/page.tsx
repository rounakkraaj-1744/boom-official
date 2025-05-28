"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Gift, MessageCircle, Send } from "lucide-react"
import Link from "next/link"

interface Video {
  id: string
  title: string
  description: string
  type: "SHORT_FORM" | "LONG_FORM"
  videoFile?: string
  videoUrl?: string
  price: number
  creator: { username: string }
}

interface Comment {
  id: string
  content: string
  createdAt: string
  user: { username: string }
}

interface User {
  id: string
  username: string
  walletBalance: number
}

export default function VideoPage() {
  const [video, setVideo] = useState<Video | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [newComment, setNewComment] = useState("")
  const [giftAmount, setGiftAmount] = useState("10")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/");
      return;
    }

    fetch("http://localhost:8080/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user)
        }
      })

    // Get video details
    fetch(`http://localhost:8080/api/videos/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVideo(data.video)
        } else {
          router.push("/feed")
        }
      })

    fetch(`http://localhost:8080/api/comments/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success)
          setComments(data.comments)
      })
      .finally(() => setLoading(false))
  }, [params.id, router])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim())
      return;

    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`http://localhost:8080/api/comments/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      })

      const data = await response.json()
      if (data.success) {
        setComments((prev) => [data.comment, ...prev]);
        setNewComment("");
      }
    }
    catch (error) {
      alert("Failed to add comment");
    }
  }

  const handleGift = async () => {
    const amount = Number.parseInt(giftAmount)
    if (!amount || amount <= 0) {
      alert("Please enter a valid gift amount");
      return;
    }

    if (!user || user.walletBalance < amount) {
      alert("Insufficient balance");
      return;
    }

    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`http://localhost:8080/api/gifts/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      })

      const data = await response.json()
      if (data.success) {
        setUser((prev) => (prev ? { ...prev, walletBalance: prev.walletBalance - amount } : null))
        alert(`Successfully gifted ₹${amount} to @${video?.creator.username}!`)
      }
      else
        alert(data.message);
    }
    catch (error) {
      alert("Failed to send gift")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Video not found</div>
      </div>
    );
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
                <CardContent className="p-0">
                  {video.type === "SHORT_FORM" && video.videoFile ? (
                    <video className="w-full rounded-t-lg" controls autoPlay
                      onError={(e) => {
                        console.error("Video playback error:", e);
                        alert("Failed to load video. Please try again later.");
                      }}>
                      <source src={`http://localhost:8080${video.videoFile}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : video.videoUrl ? (
                    <div className="aspect-video bg-black rounded-t-lg flex items-center justify-center">
                      <iframe
                        src={video.videoUrl.replace("watch?v=", "embed/")}
                        className="w-full h-full rounded-t-lg"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-black rounded-t-lg flex items-center justify-center">
                      <div className="text-white">Video not available</div>
                    </div>
                  )}

                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
                    <p className="text-purple-200 mb-4">by @{video.creator.username}</p>
                    <p className="text-purple-100">{video.description}</p>

                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
                      <h3 className="text-white font-semibold mb-3 flex items-center">
                        <Gift className="w-5 h-5 mr-2" />
                        Gift the Creator
                      </h3>
                      <div className="flex items-center space-x-3">
                        <Select value={giftAmount} onValueChange={setGiftAmount}>
                          <SelectTrigger className="w-32 bg-white/10 border-purple-500/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">₹10</SelectItem>
                            <SelectItem value="50">₹50</SelectItem>
                            <SelectItem value="100">₹100</SelectItem>
                            <SelectItem value="500">₹500</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={handleGift} className="bg-gradient-to-r from-yellow-500 to-orange-500">
                          <Gift className="w-4 h-4 mr-2" />
                          Send Gift
                        </Button>
                      </div>
                      <p className="text-sm text-purple-300 mt-2">Your balance: ₹{user?.walletBalance || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Comments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleAddComment} className="space-y-3">
                    <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"/>
                    <Button type="submit" size="sm" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </Button>
                  </form>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-white/5 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-purple-200 font-medium">@{comment.user.username}</span>
                          <span className="text-xs text-purple-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white text-sm">{comment.content}</p>
                      </div>
                    ))}

                    {comments.length === 0 && (
                      <div className="text-center text-purple-300 py-8">No comments yet. Be the first to comment!</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}