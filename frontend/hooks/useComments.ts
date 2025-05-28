"use client"

import { useState, useEffect } from "react"
import { commentApi } from "../app/api/comments"

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    username: string
  }
}

export function useComments(videoId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadComments()
  }, [videoId])

  const loadComments = async () => {
    try {
      setLoading(true)
      const data = await commentApi.getComments(videoId)
      if (data.success) {
        setComments(data.comments)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("Failed to load comments")
    } finally {
      setLoading(false)
    }
  }

  const addComment = async (content: string) => {
    try {
      const data = await commentApi.addComment(videoId, content)
      if (data.success) {
        setComments((prev) => [data.comment, ...prev])
        return data.comment
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      throw err
    }
  }

  return {
    comments,
    loading,
    error,
    addComment,
    refreshComments: loadComments,
  }
}
