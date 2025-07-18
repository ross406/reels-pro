"use client";

import VideoComponent from "@/app/components/VideoComponent";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { Loader2, ArrowUp, ArrowDown } from "lucide-react";
import React, { useEffect, useState } from "react";

const VideoPlay = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const allVideos = await apiClient.getVideos();
        const index = allVideos.findIndex((v) => v._id?.toString() === id);
        setVideos(allVideos);
        setCurrentIndex(index === -1 ? 0 : index);
      } catch (err) {
        console.error("Error fetching videos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const currentVideo = videos[currentIndex];

  return (
    <div className="h-[80vh] w-full flex items-center justify-center bg-black relative overflow-hidden">
      {!currentVideo || loading ? (
        <div className="text-white flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading Video...
        </div>
      ) : (
        <>
          <div className="w-[360px] max-h-[80vh] aspect-[9/16] relative">
            <VideoComponent key={currentVideo._id?.toString()} video={currentVideo} autoPlay={true} />
          </div>

          {/* Floating Arrow Buttons */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-4">
            {currentIndex > 0 && (
              <button
                onClick={handlePrev}
                className="p-3 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            )}
            {currentIndex < videos.length - 1 && (
              <button
                onClick={handleNext}
                className="p-3 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlay;
