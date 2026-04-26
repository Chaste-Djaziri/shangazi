import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-image-wrapper">
          <div className="not-found-number">404</div>
        </div>
        
        <h1 className="not-found-title">
          Page Not Found
        </h1>
        
        <p className="not-found-description">
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or the URL might be incorrect.
        </p>
        
        <div className="not-found-actions">
          <Link href="/" className="not-found-btn-primary">
            Go Back Home
          </Link>
          <Link href="/contact" className="not-found-btn-secondary">
            Contact Us
          </Link>
        </div>
        
        <div className="not-found-links">
          <Link href="/" className="not-found-link">Home</Link>
          <span className="not-found-separator">•</span>
          <Link href="/about" className="not-found-link">About</Link>
          <span className="not-found-separator">•</span>
          <Link href="/topics" className="not-found-link">Topics</Link>
          <span className="not-found-separator">•</span>
          <Link href="/contact" className="not-found-link">Contact</Link>
        </div>
      </div>
    </div>
  );
}
