"use client";

import Image from "next/image";
import rectangle3 from "@/assets/Rectangle 3.png";

export default function WhyUs() {
  const cards = [
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9B5CF6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      title: "حل موحد لإدارة المدارس",
      text: "منصة واحدة تجمع بين الإدارة المالية, البيداغوجية, والتواصل الداخلي.",
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9B5CF6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
          <path d="M7 8h2v4H7z" />
          <path d="M15 10h2v2h-2z" />
        </svg>
      ),
      title: "يدعم نموذجين تشغيليين",
      text: "مناسب للمدارس العادية ومدارس الدروس الخصوصية.",
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9B5CF6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M12 4v16" />
          <path d="M2 10h20" />
          <circle cx="7" cy="7" r="1" fill="#9B5CF6" />
          <circle cx="17" cy="7" r="1" fill="#9B5CF6" />
        </svg>
      ),
      title: "متابعة مالية دقيقة",
      text: "تتبع حالة الدفعات (مدفوع / غير مدفوع), فواتير آلية, وإشعارات تذكر بالدفع.",
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9B5CF6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <rect x="7" y="14" width="4" height="4" rx="0.5" />
        </svg>
      ),
      title: "جدول الحصص",
      text: "تحديثات فورية للإدارة والمعلمين, تعديل في الجدول.",
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9B5CF6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" y1="10" x2="15" y2="10" />
        </svg>
      ),
      title: "تواصل مع الأولياء",
      text: "إشعارات فورية للأولياء حول نتائج وسلوك أبنائهم.",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden pt-16 pb-20" dir="rtl" style={{ background: "#ffffff" }}>
      {/* Section Header — above everything */}
      <div className="text-center mb-6 relative z-10">
        <span
          className="block text-[12px] font-semibold font-cairo mb-1"
          style={{ color: "#9B5CF6" }}
        >
          منصة تسيير عصرية
        </span>
        <h2
          className="font-cairo font-black"
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            color: "#D2008A",
          }}
        >
          لماذا نحن
        </h2>
      </div>

      {/* Row: Pink scroll section + Rectangle 3 on same line */}
      <div className="relative" style={{ minHeight: 320 }}>
        {/* Rectangle 3 — decorative purple shape, far right */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: -80,
            right: -20,
            width: "40%",
            height: "150%",
            zIndex: 1,
          }}
        >
          <Image
            src={rectangle3}
            alt=""
            fill
            style={{ objectFit: "contain", objectPosition: "top right" }}
          />
        </div>

        {/* Pink scroll band — leaves space on right for Rectangle 3 */}
        <div
          className="relative z-10 py-10"
          style={{
            background: "#E91E8C",
            marginRight: "5%",
            borderRadius: "16px 0 0 16px",
          }}
        >
          <div
            className="flex gap-5 px-6 overflow-x-auto"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {cards.map((card, i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-xl p-6"
                style={{
                  background: "white",
                  width: 260,
                  minHeight: 200,
                  scrollSnapAlign: "start",
                  direction: "rtl",
                  textAlign: "right",
                }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center mb-4"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: "rgba(155,92,246,0.08)",
                  }}
                >
                  {card.icon}
                </div>

                {/* Title */}
                <h3
                  className="font-cairo font-bold mb-2"
                  style={{ fontSize: 15, color: "#1E0D3B" }}
                >
                  {card.title}
                </h3>

                {/* Text */}
                <p
                  className="font-cairo"
                  style={{
                    fontSize: 13,
                    color: "#555",
                    lineHeight: 1.7,
                  }}
                >
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar via CSS */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
