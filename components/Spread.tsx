import Image from "next/image";
import Link from "next/link";

interface StatCard {
  icon: string;
  label: string;
  top: string;
  right: string;
}

const statCards: StatCard[] = [
  { icon: "🏫", label: "50+ مؤسسة",         top: "18%", right: "2%" },
  { icon: "🎒", label: "8000+ تلميذ",       top: "42%", right: "2%" },
  { icon: "📋", label: "1000+ تسجيل يوميا", top: "66%", right: "2%" },
];



export default function Presence() {
  return (
    <section className="relative w-full bg-[#ffffff] overflow-hidden py-16 px-4 md:px-10 lg:px-20 min-h-[480px]">
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-0">
        {/* ── RIGHT: Map + cards ── */}
        <div className="relative w-full md:w-[65%] flex items-center justify-center min-h-[340px] md:min-h-[420px]">

          {/* Purple blob asset — far right */}
          <div className="absolute -top-20 right-[-90px] h-full w-[200px] md:w-[260px] pointer-events-none select-none z-0">
            <Image
              src="assets/Rectangle 7.png"
              alt=""
              width={800}
              height={700}
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Algeria map */}
          <div className="relative z-10 w-full right-[-80px] max-w-[540px] mx-auto">
            <Image
              src="assets/group 332.png"
              alt="خريطة الجزائر"
              width={300}
              height={200}
              className="w-full h-auto object-contain"
              priority
            />

            

            {/* Stat cards */}
            {statCards.map((card, i) => (
              <div
                key={i}
                className="absolute z-30 flex items-center gap-2 bg-[#F59BFF] backdrop-blur-sm border border-[#D2008A]/20 shadow-md rounded-xl px-3 py-2 min-w-[130px]"
                style={{ top: card.top, right: card.right, transform: "translateY(-50%)" }}
              >
                <span className="text-lg">{card.icon}</span>
                <span className="text-[#2d2d5e] font-bold text-sm whitespace-nowrap">
                  {card.label}
                </span>
              </div>
            ))}
          </div>

        </div>
        {/* ── LEFT: Text content ── */}
        <div
          className="w-full md:w-[35%] flex flex-col items-start gap-4 text-right"
        >
          <p className="text-[#A577FD] text-xs tracking-widest font-medium">
            أين نحن
          </p>

          <h2 className="text-[#D2008A] text-5xl md:text-6xl font-extrabold leading-tight">
            الانتشار
          </h2>

          <p className="text-[#737373] text-base md:text-lg font-normal leading-relaxed max-w-[280px]">
            نحن نتواجد في كل ارجاء الجزائر
          </p>

          <Link
            href="#"
            className="flex items-center gap-2 text-[#2d2d5e] font-semibold text-sm mt-1 group"
          >
            <span className="w-2 h-5 bg-[#D2008A] rounded-sm inline-block" />
            <span className="group-hover:text-[#D2008A] transition-colors duration-200">
              اقرأ المزيد
            </span>
          </Link>
        </div>

        
      </div>
    </section>
  );
}