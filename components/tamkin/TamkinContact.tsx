"use client";

import Image from "next/image";

const contactItems = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "بني الدرار، الجزائر 21344 و م",
    isLtr: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.64 12.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.55 1.4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z" />
      </svg>
    ),
    label: "07 77 77 77 77",
    isLtr: true,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "school@tassyir.dz",
    isLtr: true,
  },
];

export default function TamkinContact() {
  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden py-20"
      dir="rtl"
      style={{ background: "#f9f5ff" }}
    >
      {/* Decorative elements */}
      <div
        className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: "#9B5CF6", transform: "translate(-40%, -40%)" }}
      />
      <svg
        className="absolute right-10 bottom-10 opacity-15 pointer-events-none"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="45" stroke="#E91E8C" strokeWidth="2" />
        <circle cx="50" cy="50" r="30" stroke="#9B5CF6" strokeWidth="2" />
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
            تواصل معنا
          </span>
          <h2
            className="font-black"
            style={{
              fontSize: "clamp(26px, 4vw, 40px)",
              color: "#D2008A",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            تواصل معنا
          </h2>
          <div
            className="mt-3 h-1 rounded-full"
            style={{
              width: 80,
              background: "linear-gradient(to left, #E91E8C, #9B5CF6)",
            }}
          />
        </div>

        {/* Main grid: Map + Contact cards */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Google Map embed */}
          <div
            className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-lg flex-shrink-0"
            style={{ minHeight: 300 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3195.8219!2d2.8974!3d36.6968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBeni+Derrar%2C+Algeria!5e0!3m2!1sar!2sdz!4v1700000000000"
              width="100%"
              height="320"
              style={{ border: 0, display: "block" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع مدرسة تمكين"
            />
          </div>

          {/* Contact info cards */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {contactItems.map((item, index) => (
              <div
                key={index}
                className="group flex items-center gap-4 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                style={{
                  background: "white",
                  border: "1px solid rgba(155,92,246,0.1)",
                }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, #9B5CF6, #E91E8C)",
                    boxShadow: "0 4px 12px rgba(155,92,246,0.3)",
                  }}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <span
                  className="font-semibold text-sm flex-1 text-right"
                  dir={item.isLtr ? "ltr" : "rtl"}
                  style={{
                    color: "#1E0D3B",
                    fontFamily: "'Cairo', sans-serif",
                    textAlign: item.isLtr ? "left" : "right",
                  }}
                >
                  {item.label}
                </span>

                {/* Arrow indicator */}
                <div
                  className="opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: "#9B5CF6" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            ))}

            {/* Contact CTA */}
            <a
              href="mailto:school@tassyir.dz"
              className="flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #9B5CF6, #E91E8C)",
                color: "#ffffff",
                fontFamily: "'Cairo', sans-serif",
                textDecoration: "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              راسلنا الآن
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
