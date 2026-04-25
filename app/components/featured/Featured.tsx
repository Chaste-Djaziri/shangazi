"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"

const featuredVideos = [
  {
    id: "1RUH9zcOTZQ",
    embedUrl: "https://www.youtube.com/embed/1RUH9zcOTZQ?si=1FEFIp41DeZ4p_TT&autoplay=1",
    title: "Menya Byinshi Ku bijyanye no Kuboneza Urubyaro",
    description: "Latest featured video from Shangazi",
  },
]

function VideoModal({
  video,
  isOpen,
  onClose,
}: { video: (typeof featuredVideos)[0] | null; isOpen: boolean; onClose: () => void }) {
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
          <iframe
            src={video.embedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

export default function Featured() {
  const [selectedVideo, setSelectedVideo] = useState<(typeof featuredVideos)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const featuredVideo = featuredVideos[0]

  const openModal = (video: (typeof featuredVideos)[0]) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
  }

  return (
    <>
      <section className="featured">
        <div className="featured-container">
          <div className="featured-panel">
            <div className="featured-overlay" />
            <div className="featured-overlay-secondary" />
            <div className="featured-content">
              <div className="featured-copy">
                <p className="featured-kicker">Latest Video</p>
                <h2 className="featured-title">Menya Byinshi Ku bijyanye no Kuboneza Urubyaro</h2>
                <div className="featured-watch-row">
                  <button
                    type="button"
                    className="hero-play-button"
                    aria-label={`Play ${featuredVideo.title}`}
                    onClick={() => openModal(featuredVideo)}
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
