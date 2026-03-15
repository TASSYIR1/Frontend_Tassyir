"use client";

import Image from "next/image";
import studentImg from "@/assets/col-md-6.png";
import rectangle4 from "@/assets/Rectangle 4.png";
import rectangle5 from "@/assets/Rectangle 5.png";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* ── Rectangle 5 — large purple shape, right side ── */}
      <div
        style={{
          position: "absolute",
          top: -70,
          right: 10,
          width: "70%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <Image
          src={rectangle5}
          alt=""
          fill
          style={{ objectFit: "fill" }}
          priority
        />
      </div>

      {/* ── Rectangle 4 — top-left purple accent, compact ── */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: -100,
          width: "40%",
          height: "48%",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <Image
          src={rectangle4}
          alt=""
          fill
          style={{ objectFit: "fill" }}
        />
      </div>

      {/* ── Main Grid ── */}
      <div
        className="flex flex-row justify-around gap-[280px] items-center "
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "70px 24px 24px",
          zIndex: 10,
          minHeight: "100vh",
          alignItems: "start",
        }}
      >
        {/* ═══ RIGHT COLUMN (1st in RTL) — Text content ═══ */}
        <div
          className="flex flex-col items-start order-2 lg:order-1"
          style={{
            direction: "rtl",
            textAlign: "right",
            paddingTop: 60,
          }}
        >
          <p
            style={{
              fontSize: 15,
              color: "#E91E8C",
              fontFamily: "'Cairo', sans-serif",
              marginBottom: 14,
              fontWeight: 600,
            }}
          >
            من اجل مستقبل افضل
          </p>

          <h1
            style={{
              fontSize: "clamp(28px, 3.8vw, 46px)",
              color: "#ffffff",
              fontWeight: 900,
              fontFamily: "'Cairo', sans-serif",
              maxWidth: 520,
              lineHeight: 1.35,
              marginBottom: 18,
            }}
          >
            افضل طريقة لادارة وتسيير مدرستك
          </h1>

          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "'Cairo', sans-serif",
              lineHeight: 1.8,
              maxWidth: 420,
              marginBottom: 36,
            }}
          >
            ادارة و تسيير كل اركان مدرستك من منصة واحدة
          </p>

          <button
            style={{
              background: "#E91E8C",
              color: "#ffffff",
              fontFamily: "'Cairo', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              padding: "14px 48px",
              borderRadius: 4,
              border: "none",
              boxShadow: "0 4px 20px rgba(233,30,140,0.4)",
              cursor: "pointer",
              transition: "opacity 200ms, transform 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            سجل الان
          </button>
        </div>

        {/* ═══ LEFT COLUMN (2nd in RTL) — Student + floating cards ═══ */}
        <div
          className="order-1 lg:order-2"
          style={{
            position: "relative",
            height: "calc(100vh - 70px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          

          {/* Student Image — positioned high, centered at shape boundary */}
          <div
            style={{
              position: "absolute",
              top: -58,
              left: "20%",
              width: 420,
              height: "100%",
              zIndex: 10,
            }}
          >
            <Image
              src={studentImg}
              alt="Student"
              fill
              style={{
                objectFit: "contain",
                objectPosition: "bottom center",
              }}
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
}
