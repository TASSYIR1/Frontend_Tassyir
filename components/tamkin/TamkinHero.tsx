"use client";

import Image from "next/image";

export default function TamkinHero() {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh" }}
      dir="rtl"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/bg1.jpg"
          alt="Hero background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
        {/* Purple/pink gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(155,92,246,0.88) 0%, rgba(210,0,138,0.75) 50%, rgba(155,92,246,0.70) 100%)",
          }}
        />
      </div>

      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #fff 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-10 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #E91E8C 0%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <div
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12"
        style={{ minHeight: "100vh", paddingTop: "90px", paddingBottom: "60px" }}
      >
        {/* Right: Text content (RTL = appears on right) */}
        <div className="flex flex-col items-start text-right order-1 lg:order-1 w-full lg:w-1/2">
          {/* Small subtitle badge */}
          <span
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-sm font-semibold text-white/90"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            ✨ من أجل مستقبل أفضل
          </span>

          {/* Main title */}
          <h1
            className="font-black leading-tight mb-4"
            style={{
              fontSize: "clamp(40px, 7vw, 72px)",
              color: "#ffffff",
              fontFamily: "'Cairo', sans-serif",
              textShadow: "0 2px 20px rgba(0,0,0,0.2)",
            }}
          >
            مدرسة تمكين
          </h1>

          {/* Subtitle */}
          <p
            className="font-bold mb-8"
            style={{
              fontSize: "clamp(16px, 2.5vw, 22px)",
              color: "rgba(255,255,255,0.9)",
              fontFamily: "'Cairo', sans-serif",
              lineHeight: 1.6,
              maxWidth: 480,
            }}
          >
            مدرسة دروس خصوصية للطور الابتدائي
          </p>

          {/* Stats row */}
          <div className="flex flex-row gap-8 mb-8">
            {[
              { num: "+500", label: "طالب" },
              { num: "+50", label: "معلم" },
              { num: "+5", label: "سنوات خبرة" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="font-black text-2xl text-white"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {stat.num}
                </div>
                <div
                  className="text-white/80 text-xs font-semibold"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href="/Tamkin/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: "#E91E8C",
              color: "#ffffff",
              fontFamily: "'Cairo', sans-serif",
              boxShadow: "0 8px 32px rgba(233,30,140,0.4)",
            }}
          >
            تسجيل الدخول
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Left: Student image (appears on left in RTL) */}
        <div
          className="order-2 lg:order-2 w-full lg:w-1/2 flex items-end justify-center relative"
          style={{ minHeight: 350 }}
        >
          {/* Glow circle behind image */}
          <div
            className="absolute inset-0 rounded-full opacity-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.5) 0%, transparent 70%)",
              maxWidth: 420,
              maxHeight: 420,
              margin: "auto",
            }}
          />
          {/* Decorative ring */}
          <div
            className="absolute rounded-full border-2 border-white/20 pointer-events-none"
            style={{ width: 380, height: 380, top: "50%", left: "50%", transform: "translate(-50%, -40%)" }}
          />

          <div
            className="relative z-10"
            style={{ width: "100%", maxWidth: 420, height: 500 }}
          >
            <Image
              src="/assets/col-md-6.png"
              alt="طالب"
              fill
              style={{ objectFit: "contain", objectPosition: "bottom center", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))" }}
              priority
            />
          </div>
        </div>
      </div>

      {/* Bottom curved separator */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
        style={{ lineHeight: 0 }}
      >
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: 80 }}
        >
          <path
            d="M0,80 L0,40 Q360,0 720,30 Q1080,60 1440,20 L1440,80 Z"
            fill="#f9f5ff"
          />
        </svg>
      </div>
    </section>
  );
}
