"use client";

import { useState } from "react";
import Image from "next/image";

const galleryImages = [
  { src: "/assets/bg1.jpg", alt: "ميكرو هاك", caption: "ميكرو هاك" },
  { src: "/assets/bg2.jpg", alt: "فعاليات المدرسة", caption: "فعاليات المدرسة" },
  { src: "/assets/bg3.jpg", alt: "أنشطة الطلاب", caption: "أنشطة الطلاب" },
  { src: "/assets/bg1.jpg", alt: "يوم العلوم", caption: "يوم العلوم" },
  { src: "/assets/bg2.jpg", alt: "حفل التخرج", caption: "حفل التخرج" },
];

export default function TamkinGallery() {
  const [activeIndex, setActiveIndex] = useState(1);

  const prev = () =>
    setActiveIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
  const next = () =>
    setActiveIndex((i) => (i + 1) % galleryImages.length);

  // Build visible indices: prev, active, next (and more if needed)
  const getVisible = () => {
    const indices = [];
    for (let offset = -2; offset <= 2; offset++) {
      indices.push((activeIndex + offset + galleryImages.length) % galleryImages.length);
    }
    return indices;
  };

  const visible = getVisible();

  return (
    <section
      id="gallery"
      className="relative w-full overflow-hidden py-20"
      dir="rtl"
      style={{ background: "#ffffff" }}
    >
      {/* Decorative blobs */}
      <svg
        className="absolute right-6 top-10 opacity-15 pointer-events-none"
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
      >
        <path d="M10,40 Q40,0 70,40 Q40,80 10,40" stroke="#E91E8C" strokeWidth="2" fill="none" />
      </svg>
      <svg
        className="absolute left-12 bottom-16 opacity-15 pointer-events-none"
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
      >
        <polygon points="25,5 45,40 5,40" stroke="#9B5CF6" strokeWidth="2" fill="none" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-right mb-12">
          <span
            className="inline-block text-xs font-bold mb-2 px-3 py-1 rounded-full"
            style={{
              color: "#9B5CF6",
              background: "rgba(155,92,246,0.1)",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            لحظاتنا الجميلة
          </span>
          <h2
            className="font-black mb-2"
            style={{
              fontSize: "clamp(26px, 4vw, 40px)",
              color: "#D2008A",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            معرض الصور
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#888",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            أبرز اللحظات لأحداثنا المميزة داخل المؤسسة
          </p>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative flex items-center justify-center gap-4 px-4 py-4" style={{ minHeight: 360 }}>
        {/* Prev arrow (in RTL, this becomes the "next" visually but controls previous index) */}
        <button
          onClick={next}
          className="absolute left-4 z-20 flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          style={{ background: "#E91E8C", color: "#fff", border: "none" }}
          aria-label="Next"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={prev}
          className="absolute right-4 z-20 flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          style={{ background: "#E91E8C", color: "#fff", border: "none" }}
          aria-label="Previous"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Images */}
        <div className="flex items-center justify-center gap-4 w-full max-w-5xl">
          {visible.map((imgIdx, position) => {
            const isCenter = position === 2;
            const isSideNear = position === 1 || position === 3;
            const isSideFar = position === 0 || position === 4;

            return (
              <div
                key={`${imgIdx}-${position}`}
                onClick={() => setActiveIndex(imgIdx)}
                className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 flex-shrink-0"
                style={{
                  width: isCenter ? 340 : isSideNear ? 240 : 160,
                  height: isCenter ? 320 : isSideNear ? 260 : 200,
                  opacity: isCenter ? 1 : isSideNear ? 0.75 : 0.5,
                  transform: isCenter ? "scale(1)" : isSideNear ? "scale(0.92)" : "scale(0.83)",
                  zIndex: isCenter ? 10 : isSideNear ? 5 : 1,
                  boxShadow: isCenter
                    ? "0 20px 60px rgba(155,92,246,0.35)"
                    : "0 8px 24px rgba(0,0,0,0.1)",
                  display: isSideFar ? "none" : "block",
                }}
              >
                <Image
                  src={galleryImages[imgIdx].src}
                  alt={galleryImages[imgIdx].alt}
                  fill
                  style={{ objectFit: "cover" }}
                />
                {isCenter && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Caption */}
      <div className="text-center mt-6">
        <p
          className="font-bold text-base"
          style={{ color: "#1E0D3B", fontFamily: "'Cairo', sans-serif" }}
        >
          {galleryImages[activeIndex].caption}
        </p>
        <p
          className="text-sm mt-1"
          style={{ color: "#888", fontFamily: "'Cairo', sans-serif" }}
        >
          أبرز اللحظات لأحداثنا المميزة داخل المؤسسة
        </p>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {galleryImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? 24 : 8,
              height: 8,
              background: i === activeIndex ? "#E91E8C" : "rgba(155,92,246,0.3)",
              border: "none",
              cursor: "pointer",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
