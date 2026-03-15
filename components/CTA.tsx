import Image from "next/image";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative w-full bg-white overflow-hidden py-20 px-4 min-h-[260px] flex items-center justify-center">

      {/* Left purple shape */}
      <div className="absolute top-10 -left-10 h-full w-[180px] md:w-[220px] pointer-events-none select-none z-0">
        <Image
          src="assets/rectangle 8.png"
          alt=""
          width={220}
          height={300}
          className="h-full w-auto object-contain object-left"
        />
      </div>

      {/* Right purple shape */}
      <div className="absolute top-10 right-0 h-full w-[180px] md:w-[220px] pointer-events-none select-none z-0">
        <Image
          src="assets/rectangle 9.png"
          alt=""
          width={220}
          height={300}
          className="h-full w-auto object-contain object-right"
        />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-5 text-center max-w-2xl mx-auto">

        {/* Subtitle */}
        <p className="text-[#A577FD] text-xs tracking-widest font-medium">
          تواصل معنا
        </p>

        {/* Main title */}
        <h2 className="text-[#D2008A] text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
          هل انت جاهز لتسيير مدرستك باحترافية
        </h2>

        {/* Description */}
        <p className="text-[#737373] text-base md:text-lg font-normal leading-relaxed max-w-xl">
          تواصل معنا وابدا في تسير وتنظيم مؤسستك التعليمية بشكل عصري و مميز
        </p>

        {/* CTA Button */}
        <Link
          href="#"
          className="mt-2 bg-[#D2008A] hover:bg-[#c01577] transition-colors duration-200 text-white font-bold text-base px-10 py-3 rounded-md shadow-md"
        >
          سجل الان
        </Link>
      </div>

    </section>
  );
}