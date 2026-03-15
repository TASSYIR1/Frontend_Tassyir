"use client";

import { useState } from "react";

const navLinks = [
  { label: "الرئيسية", href: "#" },
  { label: "لماذا نحن", href: "#why" },
  { label: "خدماتنا", href: "#services" },
  { label: "الانتشار", href: "#spread" },
  { label: "تواصل معنا", href: "#contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        background: "transparent",
        height: 64,
        display: "flex",
        alignItems: "center",
        direction: "rtl",
        zIndex: 50,
      }}
    >
      <div
        className="flex items-center justify-around w-full"
        style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}
      >
        {/* RIGHT ZONE — Logo */}
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 40,
              height: 40,
              background: "#9B5CF6",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
              <ellipse cx="12" cy="12" rx="4" ry="10" stroke="white" strokeWidth="1.5" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" />
              <line x1="4" y1="7" x2="20" y2="7" stroke="white" strokeWidth="1.5" />
              <line x1="4" y1="17" x2="20" y2="17" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>

          <span
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: 20,
              fontFamily: "'Cairo', sans-serif",
              lineHeight: 1,
            }}
          >
            تسيير
          </span>

          <div className="flex flex-col" style={{ lineHeight: 1.2 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.85)",
                fontFamily: "'Cairo', sans-serif",
              }}
            >
              logo—
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.85)",
                fontFamily: "'Cairo', sans-serif",
              }}
            >
              ipsum
            </span>
          </div>
        </div>

        {/* CENTER ZONE — Nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 500,
                  fontSize: 14,
                  fontFamily: "'Cairo', sans-serif",
                  textDecoration: "none",
                  transition: "color 200ms",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#ffffff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* LEFT ZONE — CTA */}
        <div className="flex items-center gap-3">
          <button
            style={{
              background: "#E91E8C",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "'Cairo', sans-serif",
              padding: "8px 24px",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
            }}
          >
            تسجيل
          </button>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {isMenuOpen ? (
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="21" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="18" x2="21" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div
          className="md:hidden"
          style={{
            position: "absolute",
            top: 64,
            left: 0,
            right: 0,
            background: "rgba(155,92,246,0.95)",
            backdropFilter: "blur(10px)",
            padding: "16px 24px",
            zIndex: 100,
          }}
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 500,
                    fontSize: 14,
                    fontFamily: "'Cairo', sans-serif",
                    textDecoration: "none",
                    display: "block",
                    padding: "4px 0",
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
