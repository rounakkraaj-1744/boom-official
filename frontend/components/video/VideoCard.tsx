"use client";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Eye, ShoppingCart } from "lucide-react";
import { videoApi } from "../../app/api/videos";

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    description: string;
    type: "SHORT_FORM" | "LONG_FORM";
    videoFile?: string;
    videoUrl?: string;
    price: number;
    purchased?: boolean;
    creator: { username: string; };
  };
  user: {
    id: string;
    username: string;
    walletBalance: number;
  } | null;
  setVideos: React.Dispatch<React.SetStateAction<VideoCardProps["video"][]>>;
}

export default function VideoCard({ video, user, setVideos }: VideoCardProps) {
  const handlePurchase = async () => {
    try {
      const data = await videoApi.purchaseVideo(video.id);
      if (data.success) {
        setVideos((prev) =>
          prev.map((v) => (v.id === video.id ? { ...v, purchased: true } : v))
        );
        alert("Video purchased successfully!");
      }
      else 
        alert(data.message);
    }
    catch (error) {
      alert("Purchase failed. Please try again.");
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">{video.title}</CardTitle>
            <CardDescription className="text-purple-200">
              by @{video.creator.username}
            </CardDescription>
          </div>
          <Badge variant={video.type === "SHORT_FORM" ? "default" : "secondary"}>
            {video.type === "SHORT_FORM" ? "Short" : "Long"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-purple-100 mb-4">{video.description}</p>

        {video.type === "SHORT_FORM" ? (
          <div className="space-y-4">
            {video.videoFile && (
              <video className="w-full rounded-lg" controls muted preload="metadata"
                onError={(e) => {
                  console.error("Video playback error:", e);
                }}>
                <source src={`http://localhost:8080${video.videoFile}`} type="video/mp4"/>
              </video>
            )}
            <Link href={`/video/${video.id}`}>
              <Button className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Watch
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <div className="text-purple-200 mb-2">Long-form Video</div>
              {video.price > 0 && (
                <div className="text-yellow-400 font-semibold">
                  ₹{video.price}
                </div>
              )}
            </div>

            {video.price > 0 && !video.purchased ? (
              <Button className="w-full" onClick={handlePurchase} disabled={!user || user.walletBalance < video.price}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy for ₹{video.price}
              </Button>
            ) : (
              <Link href={`/video/${video.id}`}>
                <Button className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Watch
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}