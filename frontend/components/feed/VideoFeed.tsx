"use client"
import { Button } from "@/components/ui/button"
import VideoCard from "@/components/video/VideoCard"

interface VideoFeedProps {
  videos: any[]
  hasMore: boolean
  onLoadMore: () => void
  setVideos: React.Dispatch<React.SetStateAction<any[]>>
  user: any
}

export default function VideoFeed({ videos, hasMore, onLoadMore, setVideos, user }: VideoFeedProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} user={user} setVideos={setVideos} />
      ))}

      {hasMore && (
        <div className="text-center">
          <Button onClick={onLoadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}