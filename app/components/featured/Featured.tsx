"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const featuredVideos = [
  {
    id: "1RUH9zcOTZQ",
    embedUrl: "https://www.youtube.com/embed/1RUH9zcOTZQ?si=1FEFIp41DeZ4p_TT&autoplay=1",
    title: "Featured Video 1",
  },
  {
    id: "kqx7NBVwaQM",
    embedUrl: "https://www.youtube.com/embed/kqx7NBVwaQM?si=_gtdvAVFtiWJQ-Nj&autoplay=1",
    title: "Featured Video 2",
  },
  {
    id: "eHfePBZmEqg",
    embedUrl: "https://www.youtube.com/embed/eHfePBZmEqg?si=rSOwzVKEKyFc5zpa&autoplay=1",
    title: "Featured Video 3",
  },
];

function VideoPreview({ video, onOpenModal }: { video: typeof featuredVideos[0]; onOpenModal: () => void }) {
  const [currentSrc, setCurrentSrc] = useState(`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`);

  const handleImageError = () => {
    // Fallback to medium quality if hqdefault fails
    setCurrentSrc(`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`);
  };

  return (
    <div
      className="featured-video-preview"
      onClick={onOpenModal}
    >
      <div className="video-thumbnail">
        <img
          src={currentSrc}
          alt={video.title}
          className="thumbnail-image"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="video-play-button">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function VideoModal({ video, isOpen, onClose }: { video: typeof featuredVideos[0] | null; isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !video) return null;

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
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
  );
}

export default function Featured() {
  const [selectedVideo, setSelectedVideo] = useState<typeof featuredVideos[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const featuredRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const openModal = (video: typeof featuredVideos[0]) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline();
            
            if (contentRef.current) {
              const title = contentRef.current.querySelector(".featured-title");
              const subtitle = contentRef.current.querySelector(".featured-subtitle");
              const videos = contentRef.current.querySelectorAll(".featured-video-preview");

              tl.fromTo(
                title,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
              )
              .fromTo(
                subtitle,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
                "-=0.4"
              )
              .fromTo(
                videos,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
                "-=0.4"
              );

              observer.disconnect();
            }
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (featuredRef.current) {
      observer.observe(featuredRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <section className="featured" ref={featuredRef}>
        <div className="featured-container">
          <div className="featured-content" ref={contentRef}>
            <h2 className="featured-title">
              Featured <span className="featured-title-accent">Content</span>
            </h2>
            <p className="featured-subtitle">
              Explore Emma Claudine's most impactful video series and playlists
            </p>
            <div className="featured-videos">
              {featuredVideos.map((video, index) => (
                <VideoPreview
                  key={index}
                  video={video}
                  onOpenModal={() => openModal(video)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <VideoModal video={selectedVideo} isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
