"use client"

import { useState } from "react"
import { videoApi } from "../app/api/videos"

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

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadVideos = async (page = 1, limit = 10) => {
    try {
      setLoading(true)
      const data = await videoApi.getVideos(page, limit)
      if (data.success) {
        if (page === 1)
          setVideos(data.videos)
        else
          setVideos((prev) => [...prev, ...data.videos])
        return data.pagination
      }
      else 
        setError(data.message)
    }
    catch (err) {
      setError("Failed to load videos")
    }
    finally {
      setLoading(false)
    }
  }

  const searchVideos = async (searchParams: any) => {
    try {
      setLoading(true)
      const data = await videoApi.searchVideos(searchParams)
      if (data.success) {
        setVideos(data.videos)
        return data.pagination
      }
      else
        setError(data.message)
    }
    catch (err) {
      setError("Search failed")
    }
    finally {
      setLoading(false)
    }
  }

  const purchaseVideo = async (videoId: string) => {
    try {
      const data = await videoApi.purchaseVideo(videoId)
      if (data.success) {
        setVideos((prev) => prev.map((video) => (video.id === videoId ? { ...video, purchased: true } : video)))
        return data
      }
      else {
        throw new Error(data.message)
      }
    }
    catch (err) {
      throw err
    }
  }

  return {
    videos,
    loading,
    error,
    setVideos,
    loadVideos,
    searchVideos,
    purchaseVideo,
  }
}
