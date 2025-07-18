// import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { Video } from "@imagekit/next";

export default function VideoComponent({ video, autoPlay=false }: { video: IVideo, autoPlay: boolean }) {
  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${video._id}`} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{ aspectRatio: "9/16" }}
          >
            <Video
              className="w-full h-full object-cover"
              urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
              src={video.videoUrl}
              controls={video.controls}
              width={500}
              height={500}
              autoPlay={autoPlay}
              loop={autoPlay}
              playsInline
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                },
              ]}
            />
          </div>
        </Link>
      </figure>

      <div className="card-body p-4">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{video.title}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}
