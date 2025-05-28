"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { videoApi } from "../api/videos"

export default function UploadPage() {
  const [videoType, setVideoType] = useState<"SHORT_FORM" | "LONG_FORM">("SHORT_FORM")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) 
      router.push("/");
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("type", videoType);

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const videoFile = formData.get("videoFile") as File
    const videoUrl = formData.get("videoUrl") as string
    const price = formData.get("price") as string

    if (!title || !description) {
      setError("Please fill in all required fields");
      setUploading(false);
      return;
    }

    if (videoType === "SHORT_FORM" && !videoFile) {
      setError("Please select a video file");
      setUploading(false);
      return;
    }

    if (videoType === "LONG_FORM" && !videoUrl) {
      setError("Please provide a video URL");
      setUploading(false);
      return;
    }

    try {
      const data = await videoApi.uploadVideo(formData)
      if (data.success) {
        alert("Video uploaded successfully!");
        router.push("/feed");
      }
      else
        setError(data.message || "Failed to upload video");;
    }
    catch (error) {
      console.error("Upload failed:", error);
      setError("Upload failed. Please try again.");
    }
    finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/feed">
              <Button variant="ghost" className="text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feed
              </Button>
            </Link>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Upload Video</CardTitle>
              <CardDescription className="text-purple-200">Share your content with the Boom community</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Title
                  </Label>
                  <Input id="title" name="title" required className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300" placeholder="Enter video title"/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea id="description" name="description" required
                    className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"
                    placeholder="Describe your video" />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Video Type</Label>
                  <Select value={videoType} onValueChange={(value: "SHORT_FORM" | "LONG_FORM") => setVideoType(value)}>
                    <SelectTrigger className="bg-white/10 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHORT_FORM">Short-Form</SelectItem>
                      <SelectItem value="LONG_FORM">Long-Form</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {videoType === "SHORT_FORM" ? (
                  <div className="space-y-2">
                    <Label htmlFor="videoFile" className="text-white">
                      Video File
                    </Label>
                    <Input id="videoFile" name="videoFile" type="file"
                      accept=".mp4,.mpeg,.mov" required
                      className="bg-white/10 border-purple-500/30 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md"
                    />
                    <p className="text-sm text-purple-300">Max size: 10MB, .mp4, .mpeg, or .mov only</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl" className="text-white">
                        Video URL
                      </Label>
                      <Input id="videoUrl" name="videoUrl" type="url"
                        required className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"
                        placeholder="https://youtube.com/watch?v=..."/>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-white">
                        Price (₹)
                      </Label>
                      <Input id="price" name="price" type="number" min="0" step="1" defaultValue="0"
                        className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"
                        placeholder="0 for free, or set a price"/>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={uploading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Video"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}