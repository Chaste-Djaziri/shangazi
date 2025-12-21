"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface DropdownProps {
  label: string;
  links: { href: string; label: string }[];
}

export default function Dropdown({ label, links }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <span className="dropdown-arrow">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              prefetch={false}
              className="dropdown-link"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

