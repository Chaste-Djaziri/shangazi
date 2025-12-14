"use client"

import { useState, useRef, useEffect } from "react"
import gsap from "gsap"

const featuredVideos = [
  {
    id: "1RUH9zcOTZQ",
    embedUrl: "https://www.youtube.com/embed/1RUH9zcOTZQ?si=1FEFIp41DeZ4p_TT&autoplay=1",
    title: "Community Dialogue Series",
    description: "Engaging conversations about important social issues",
  },
  {
    id: "kqx7NBVwaQM",
    embedUrl: "https://www.youtube.com/embed/kqx7NBVwaQM?si=_gtdvAVFtiWJQ-Nj&autoplay=1",
    title: "Educational Content",
    description: "Empowering knowledge and understanding",
  },
  {
    id: "eHfePBZmEqg",
    embedUrl: "https://www.youtube.com/embed/eHfePBZmEqg?si=rSOwzVKEKyFc5zpa&autoplay=1",
    title: "Featured Interview",
    description: "In-depth discussions with thought leaders",
  },
  {
    id: "dQw4w9WgXcQ",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=example&autoplay=1",
    title: "Social Impact Stories",
    description: "Real stories of change and transformation",
  },
  {
    id: "jNQXAC9IVRw",
    embedUrl: "https://www.youtube.com/embed/jNQXAC9IVRw?si=example&autoplay=1",
    title: "Youth Empowerment",
    description: "Inspiring the next generation of leaders",
  },
  {
    id: "9bZkp7q19f0",
    embedUrl: "https://www.youtube.com/embed/9bZkp7q19f0?si=example&autoplay=1",
    title: "Cultural Heritage",
    description: "Celebrating Rwandan culture and traditions",
  },
]

function VideoPreview({ video, onOpenModal }: { video: (typeof featuredVideos)[0]; onOpenModal: () => void }) {
  const [currentSrc, setCurrentSrc] = useState(`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageError = () => {
    setCurrentSrc(`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <button
      onClick={onOpenModal}
      className="featured-video-card"
      aria-label={`Play ${video.title}`}
    >
      <div className="featured-video-thumbnail">
        <div className="video-thumbnail">
          {isLoading && (
            <div className="video-thumbnail-skeleton">
              <div className="skeleton-loader"></div>
            </div>
          )}
          <img
            src={currentSrc || "/placeholder.svg"}
            alt={video.title}
            className="thumbnail-image"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
          <div className="video-overlay">
            <div className="video-play-button">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="featured-video-info">
        <h3 className="featured-video-title">{video.title}</h3>
        <p className="featured-video-description">{video.description}</p>
      </div>
    </button>
  )
}

function VideoModal({
  video,
  isOpen,
  onClose,
}: { video: (typeof featuredVideos)[0] | null; isOpen: boolean; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // Animate modal in
      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" }
        )
      }
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
  const featuredRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const openModal = (video: (typeof featuredVideos)[0]) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline()

            if (contentRef.current) {
              const title = contentRef.current.querySelector(".featured-title")
              const subtitle = contentRef.current.querySelector(".featured-subtitle")
              const videos = contentRef.current.querySelectorAll(".featured-video-preview")

              tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
                .fromTo(
                  subtitle,
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
                  "-=0.4",
                )
                .fromTo(
                  videos,
                  { opacity: 0, y: 30 },
                  { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
                  "-=0.4",
                )

              observer.disconnect()
            }
          }
        })
      },
      { threshold: 0.2 },
    )

    if (featuredRef.current) {
      observer.observe(featuredRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <section className="featured" ref={featuredRef}>
        <div className="featured-container">
          <div className="featured-content" ref={contentRef}>
            <div className="featured-header">
              <h2 className="featured-title">
                Featured <span className="featured-title-accent">Content</span>
              </h2>
              <p className="featured-subtitle">
                Explore Emma Claudine's most impactful video series and playlists
              </p>
            </div>

            <div className="featured-videos">
              {featuredVideos.map((video, index) => (
                <div key={video.id} className="featured-video-preview">
                  <VideoPreview video={video} onOpenModal={() => openModal(video)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <VideoModal video={selectedVideo} isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}
