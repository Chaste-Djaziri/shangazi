"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"

function getYouTubeThumbnail(url: string | null) {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    const videoId = match[2];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return null;
}

function buildEmbedUrl(videoUrl?: string): string | null {
  if (!videoUrl) return null;
  try {
    const url = new URL(videoUrl);
    const host = url.hostname.toLowerCase();
    let videoId = null;
    if (host.includes("youtube.com")) {
      videoId = url.searchParams.get("v");
      if (!videoId && url.pathname.startsWith("/embed/")) videoId = url.pathname.split("/")[2];
    } else if (host === "youtu.be") {
      videoId = url.pathname.substring(1);
    }
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    if (host.includes("vimeo.com")) {
      const vId = url.pathname.split("/").filter(Boolean).pop();
      if (vId) return `https://player.vimeo.com/video/${vId}?autoplay=1`;
    }
  } catch (e) {}
  return null;
}

function VideoModal({
  video,
  isOpen,
  onClose,
}: { video: any | null; isOpen: boolean; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || !video) return null

  const embedUrl = buildEmbedUrl(video.videoUrl);

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="video-modal-close"
          aria-label="Close video"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="video-modal-header">
          <h3 className="video-modal-title">{video.title}</h3>
          <p className="video-modal-description">{video.description}</p>
        </div>
        <div className="video-modal-iframe-wrapper">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black text-gray-400">
               Video URL not supported.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Featured({ video }: { video?: any }) {
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Use real video if provided, otherwise demo data
  const displayVideo = video || {
    title: "Menya Byinshi Ku bijyanye no Kuboneza Urubyaro",
    description: "Latest featured video from Shangazi",
    videoUrl: "https://www.youtube.com/watch?v=1RUH9zcOTZQ",
    thumbnail: "/backgrounds/featured.png"
  }

  const openModal = (v: any) => {
    setSelectedVideo(v)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
  }

  const backgroundImage = displayVideo.thumbnail || getYouTubeThumbnail(displayVideo.videoUrl) || "/backgrounds/featured.png"

  return (
    <>
      <section className="featured">
        <div className="featured-container">
          <div className="featured-panel">
            <Image
              src={backgroundImage}
              alt={displayVideo.title}
              fill
              sizes="100vw"
              className="featured-background-image object-cover"
            />
            <div className="featured-overlay" />
            <div className="featured-overlay-secondary" />
            <div className="featured-content">
              <div className="featured-copy">
                <p className="featured-kicker">Latest Video</p>
                <h2 className="featured-title">{displayVideo.title}</h2>
                <div className="featured-watch-row">
                  <button
                    type="button"
                    className="hero-play-button"
                    aria-label={`Play ${displayVideo.title}`}
                    onClick={() => openModal(displayVideo)}
                  >
                    <Image src="/vectors/play.svg" alt="" width={16} height={16} className="hero-play-icon" />
                  </button>
                  <p className="hero-overlay-link featured-watch-label">Watch Now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <VideoModal video={selectedVideo} isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}
