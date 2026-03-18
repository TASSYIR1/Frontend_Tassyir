"use client";

import Image from "next/image";
import rectangle3 from "@/assets/Rectangle 3.png";

export default function WhyUs() {
  // New majestic cards data
  const cards = [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D2008A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2 2 4-4" />
        </svg>
      ),
      title: "حلول ذكية متكاملة",
      text: "كل ما تحتاجه لإدارة مدرستك في منصة واحدة، بذكاء وسهولة.",
      gradient: "from-[#E91E8C]/80 via-[#BBA2ED]/60 to-[#9B5CF6]/80",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9B5CF6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <circle cx="12" cy="12" r="6" />
        </svg>
      ),
      title: "أمان وموثوقية عالية",
      text: "حماية بياناتك بأحدث التقنيات وضمان استمرارية الخدمة.",
      gradient: "from-[#9B5CF6]/80 via-[#E91E8C]/60 to-[#A577FD]/80",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A577FD" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M2 12h20" />
        </svg>
      ),
      title: "دعم متواصل واحترافي",
      text: "فريق دعم جاهز لمساعدتك في أي وقت، وبكل احترافية.",
      gradient: "from-[#A577FD]/80 via-[#E91E8C]/60 to-[#BBA2ED]/80",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#BBA2ED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <path d="M8 12h8" />
        </svg>
      ),
      title: "تجربة استخدام فريدة",
      text: "واجهة عصرية وسهلة تجعل الإدارة متعة حقيقية.",
      gradient: "from-[#BBA2ED]/80 via-[#E91E8C]/60 to-[#9B5CF6]/80",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden pt-16 pb-20" dir="rtl" style={{ background: "#ffffff" }}>
      return (
        <section className="relative w-full overflow-hidden pt-20 pb-24" dir="rtl" style={{ background: "linear-gradient(120deg, #f8f6ff 60%, #f3eafd 100%)" }}>
          {/* Section Header */}
          <div className="text-center mb-12 relative z-10">
            <span className="block text-[13px] font-semibold font-cairo mb-2 tracking-widest text-[#A577FD]">مزايا تسيير</span>
            <h2 className="font-cairo font-black text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-l from-[#D2008A] via-[#9B5CF6] to-[#A577FD] mb-2 drop-shadow-lg">لماذا نحن؟</h2>
            <p className="text-[#6B21A8] text-base md:text-lg font-semibold max-w-2xl mx-auto mt-2">اكتشف كيف تجعل منصتنا إدارة مدرستك تجربة فريدة، ذكية، وآمنة.</p>
          </div>

          {/* Majestic Card Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-10 max-w-7xl mx-auto">
            {cards.map((card, i) => (
              <div
                key={i}
                className={`relative rounded-3xl p-8 flex flex-col items-center text-center shadow-xl bg-white/60 backdrop-blur-md border border-[#E9D7F7]/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/90 hover:border-[#D2008A]/40 group`}
                style={{ minHeight: 290, overflow: 'hidden' }}
              >
                {/* Glowing Gradient Border */}
                <div className={`absolute -inset-1 rounded-3xl pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-all duration-300`} style={{ background: `linear-gradient(120deg, var(--tw-gradient-stops))` }} />

                {/* Floating Icon */}
                <div className={`relative z-10 flex items-center justify-center mb-5 w-20 h-20 rounded-full bg-gradient-to-br ${card.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`} style={{ boxShadow: '0 6px 32px 0 #D2008A22' }}>
                  {card.icon}
                </div>

                {/* Title */}
                <h3 className="font-cairo font-extrabold text-xl md:text-2xl text-[#241646] mb-3 drop-shadow-sm">{card.title}</h3>

                {/* Text */}
                <p className="font-cairo text-[15px] text-[#555] font-medium leading-relaxed z-10">{card.text}</p>

                {/* Animated Glow */}
                <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-16 rounded-full blur-2xl opacity-40 z-0`} style={{ background: 'linear-gradient(90deg, #E91E8C 0%, #BBA2ED 100%)' }} />
              </div>
            ))}
          </div>
        </section>

      {/* Hide scrollbar via CSS */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
