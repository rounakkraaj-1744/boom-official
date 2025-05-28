"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import FeedHeader from "@/components/feed/FeedHeader"
import SearchBar from "@/components/feed/SearchBar"
import VideoFeed from "@/components/feed/VideoFeed"
import { videoApi } from "../api/videos"

interface Video {
  id: string
  title: string
  description: string
  type: "SHORT_FORM" | "LONG_FORM"
  videoFile?: string
  videoUrl?: string
  price: number
  createdAt: string
  creator: { username: string }
  purchased?: boolean
}

export default function FeedPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user, loading: authLoading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !user) {
      router.push("/");
      return;
    }
    if (user)
      loadVideos();
  }, [user, initialized, router])

  const loadVideos = async (pageNum = 1) => {
    try {
      const data = await videoApi.getVideos(pageNum, 10);

      if (data.success) {
        pageNum === 1 ? setVideos(data.videos) : setVideos ((prev) => [...prev, ...data.videos])
        setHasMore(data.pagination.hasMore);
      }
    }
    catch (error) {
      console.error("Failed to load videos:", error);
    }
    finally {
      setLoading(false);
    }
  }

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadVideos(nextPage);
  }

  if (authLoading || !initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user)
    return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <FeedHeader user={user} />
      <div className="container mx-auto px-4 py-8">
        <SearchBar />
        <VideoFeed videos={videos} hasMore={hasMore} onLoadMore={loadMore} setVideos={setVideos} user={user} />
      </div>
    </div>
  );
}