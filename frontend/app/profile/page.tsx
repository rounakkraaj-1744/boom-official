"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Video, Wallet, Gift, ShoppingBag, Calendar } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  id: string
  username: string
  email: string
  walletBalance: number
  createdAt: string
  _count: {
    videos: number
    comments: number
    purchases: number
    sentGifts: number
  }
}

interface VideoType {
  id: string
  title: string
  description: string
  type: "SHORT_FORM" | "LONG_FORM"
  price: number
  createdAt: string
  _count: {
    comments: number
    purchases: number
    gifts: number
  }
}

interface Transaction {
  id: string
  type: "PURCHASE" | "GIFT_SENT" | "GIFT_RECEIVED"
  amount: number
  createdAt: string
  video?: { title: string }
  fromUser?: { username: string }
  toUser?: { username: string }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myVideos, setMyVideos] = useState<VideoType[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    loadProfileData();
  }, [router])

  const loadProfileData = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const profileData = await response.json();

      const videosRes = await fetch("http://localhost:8080/api/videos/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const videosData = await videosRes.json();

      const transactionsRes = await fetch("http://localhost:8080/api/users/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transactionsData = await transactionsRes.json();

      if (profileData.success)
        setProfile(profileData.profile);
      if (videosData.success)
        setMyVideos(videosData.videos);
      if (transactionsData.success)
        setTransactions(transactionsData.transactions);
    }
    catch (error) {
      console.error("Failed to load profile data:", error);
    }
    finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Profile not found</div>
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

          {/* This is the profile header */}
          <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 mb-6">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">@{profile.username}</CardTitle>
                  <CardDescription className="text-purple-200">{profile.email}</CardDescription>
                  <div className="flex items-center space-x-2 mt-2">
                    <Calendar className="w-4 h-4 text-purple-300" />
                    <span className="text-purple-300 text-sm">
                      Joined {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{profile._count.videos}</div>
                  <div className="text-purple-300 text-sm">Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{profile._count.comments}</div>
                  <div className="text-purple-300 text-sm">Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{profile._count.purchases}</div>
                  <div className="text-purple-300 text-sm">Purchases</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">₹{profile.walletBalance}</div>
                  <div className="text-purple-300 text-sm">Wallet</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="videos">My Videos</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="space-y-4">
              {myVideos.length > 0 ? (
                myVideos.map((video) => (
                  <Card key={video.id} className="bg-white/10 backdrop-blur-sm border-purple-500/20">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{video.title}</CardTitle>
                          <CardDescription className="text-purple-200">
                            {new Date(video.createdAt).toLocaleDateString()}
                          </CardDescription>
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
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-4 text-sm text-purple-300">
                          <span>{video._count.comments} comments</span>
                          <span>{video._count.purchases} purchases</span>
                          <span>₹{video._count.gifts} in gifts</span>
                        </div>
                        <Link href={`/video/${video.id}`}>
                          <Button size="sm">View</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No videos yet</h3>
                  <p className="text-purple-300 mb-4">Start creating content to build your audience</p>
                  <Link href="/upload">
                    <Button>Upload Your First Video</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <Card key={transaction.id} className="bg-white/10 backdrop-blur-sm border-purple-500/20">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          {
                            transaction.type === "PURCHASE" ? <ShoppingBag className="w-5 h-5 text-blue-400" />
                              : transaction.type === "GIFT_SENT" ? <Gift className="w-5 h-5 text-red-400" />
                                : <Gift className="w-5 h-5 text-green-400" />
                          }
                          <div>
                            <div className="text-white font-medium">
                              {
                                transaction.type === "PURCHASE" ? "Video Purchase" : transaction.type === "GIFT_SENT"
                                  ? "Gift Sent" : "Gift Received"
                              }
                            </div>
                            <div className="text-purple-300 text-sm">
                              {
                                transaction.video?.title || (transaction.type === "GIFT_SENT" ? `To @${transaction.toUser?.username}` : `From @${transaction.fromUser?.username}`)
                              }
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-semibold ${transaction.type === "GIFT_RECEIVED" ? "text-green-400" : "text-red-400"}`}>
                            {transaction.type === "GIFT_RECEIVED" ? "+" : "-"}₹{transaction.amount}
                          </div>
                          <div className="text-purple-400 text-sm">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No transactions yet</h3>
                  <p className="text-purple-300">Your transaction history will appear here</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Content Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-purple-300">Total Videos</span>
                        <span className="text-white font-semibold">{profile._count.videos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Total Comments</span>
                        <span className="text-white font-semibold">{profile._count.comments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Engagement Rate</span>
                        <span className="text-white font-semibold">
                          {profile._count.videos > 0
                            ? Math.round((profile._count.comments / profile._count.videos) * 100) / 100
                            : 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Monetization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-purple-300">Current Balance</span>
                        <span className="text-white font-semibold">₹{profile.walletBalance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Total Purchases</span>
                        <span className="text-white font-semibold">{profile._count.purchases}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Gifts Sent</span>
                        <span className="text-white font-semibold">{profile._count.sentGifts}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}