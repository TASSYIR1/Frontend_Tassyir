"use client";

export default function WhyUs() {
  const cards = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: "حلول ذكية متكاملة",
      text: "كل ما تحتاجه لإدارة مدرستك في منصة واحدة، بذكاء وسهولة.",
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "أمان وموثوقية عالية",
      text: "حماية بياناتك بأحدث التقنيات وضمان استمرارية الخدمة.",
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
      title: "دعم متواصل واحترافي",
      text: "فريق دعم جاهز لمساعدتك في أي وقت، وبكل احترافية.",
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      title: "تجربة استخدام فريدة",
      text: "واجهة عصرية وسهلة تجعل الإدارة متعة حقيقية.",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden pt-20 pb-24 bg-white" dir="rtl">
      {/* Section Header */}
      <div className="text-center mb-12 relative z-10">
        <span className="block text-[15px] font-semibold font-cairo mb-2 tracking-widest text-[#A577FD]">مزايا تسيير</span>
        <h2 className="font-cairo font-black text-4xl md:text-5xl text-[#D2008A] mb-2 drop-shadow-sm">لماذا نحن؟</h2>
        <p className="text-[#555] text-base md:text-lg font-medium max-w-2xl mx-auto mt-4">
          اكتشف كيف تجعل منصتنا إدارة مدرستك تجربة فريدة، ذكية، وآمنة.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-10 max-w-7xl mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            className="relative rounded-3xl p-8 flex flex-col items-center text-center shadow-lg bg-white border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#D2008A]/20 group"
          >
            {/* Floating Icon without background circle */}
            <div className="relative z-10 flex items-center justify-center mb-6 text-[#E91E8C] transition-transform duration-300 group-hover:scale-110">
              {card.icon}
            </div>

            {/* Title */}
            <h3 className="font-cairo font-bold text-xl md:text-2xl text-[#241646] mb-3">{card.title}</h3>

            {/* Text */}
            <p className="font-cairo text-[15px] text-[#555] font-medium leading-relaxed z-10">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
