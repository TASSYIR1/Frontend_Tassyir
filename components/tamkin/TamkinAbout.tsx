"use client";

import Image from "next/image";

const cards = [
  {
    image: "/assets/bg2.jpg",
    title: "أكثر من 500 طالب",
    description: "نفخر بثقة أكثر من 500 طالب في مدرستنا، نوفر لهم أفضل المستويات في كل المستويات",
  },
  {
    image: "/assets/bg1.jpg",
    title: "أكثر من 500 طالب",
    description: "أفضل مدرسة التناسب الطلاب، الاهتمام بكل المستويات",
  },
  {
    image: "/assets/bg3.jpg",
    title: "أكثر من 500 طالب",
    description: "أفضل مدرسة لمتابعة الناس في كل المستويات",
  },
];

function AboutCard({
  image,
  title,
  description,
  index,
}: {
  image: string;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <div
      className="group relative flex flex-col items-center text-center bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-visible pb-6"
      style={{ minWidth: 0 }}
    >
      {/* Card image - rounded top */}
      <div className="relative w-full overflow-hidden rounded-t-2xl" style={{ height: 200 }}>
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(155,92,246,0.3) 100%)",
          }}
        />
      </div>

      {/* Icon badge overlapping */}
      <div
        className="absolute flex items-center justify-center w-14 h-14 rounded-full shadow-lg border-4 border-white z-10"
        style={{
          top: 170,
          background: "linear-gradient(135deg, #9B5CF6, #E91E8C)",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>

      {/* Text content */}
      <div className="px-5 pt-10 pb-2 text-right" dir="rtl">
        <h3
          className="font-black text-lg mb-2"
          style={{ color: "#1E0D3B", fontFamily: "'Cairo', sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "#666", fontFamily: "'Cairo', sans-serif" }}
        >
          {description}
        </p>
      </div>

      {/* Decorative wavy underline */}
      <div className="px-5 w-full flex justify-center mt-3">
        <svg
          viewBox="0 0 120 12"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "70%", height: 12 }}
        >
          <path
            d="M0,6 Q15,0 30,6 Q45,12 60,6 Q75,0 90,6 Q105,12 120,6"
            fill="none"
            stroke="#E91E8C"
            strokeWidth="2.5"
          />
        </svg>
      </div>
    </div>
  );
}

export default function TamkinAbout() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden py-20"
      dir="rtl"
      style={{ background: "#f9f5ff" }}
    >
      {/* Decorative shapes */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: "#9B5CF6", transform: "translate(30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
        style={{ background: "#E91E8C", transform: "translate(-30%, 30%)" }}
      />

      {/* Swirl decorative */}
      <svg
        className="absolute left-4 top-32 opacity-20 pointer-events-none"
        width="60"
        height="120"
        viewBox="0 0 60 120"
        fill="none"
      >
        <path d="M30,0 Q60,30 30,60 Q0,90 30,120" stroke="#E91E8C" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      <svg
        className="absolute right-8 bottom-20 opacity-20 pointer-events-none"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
      >
        <path d="M5,20 Q20,5 35,20 Q20,35 5,20" stroke="#9B5CF6" strokeWidth="2" fill="none" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12">
          <span
            className="inline-block text-xs font-bold mb-2 px-3 py-1 rounded-full"
            style={{
              color: "#9B5CF6",
              background: "rgba(155,92,246,0.1)",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            تعرف علينا
          </span>
          <h2
            className="font-black mb-4"
            style={{
              fontSize: "clamp(26px, 4vw, 40px)",
              color: "#D2008A",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            من نحن ؟
          </h2>
          <p
            className="max-w-2xl"
            style={{
              fontSize: 15,
              color: "#555",
              lineHeight: 1.8,
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            مدرسة دروس خصوصية للطور الابتدائي و مدرسة دروس خصوصية للطور الابتدائي و مدرسة دروس خصوصية للطور الابتدائي
          </p>
          {/* Pink underline accent */}
          <div
            className="mt-3 h-1 rounded-full"
            style={{
              width: 80,
              background: "linear-gradient(to left, #E91E8C, #9B5CF6)",
            }}
          />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <AboutCard
              key={index}
              image={card.image}
              title={card.title}
              description={card.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
