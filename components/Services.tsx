import Image from "next/image";

export default function Services() {
  return (
    <section
      dir="rtl"
      className="relative w-full bg-white overflow-hidden py-16 px-4 md:px-10 lg:px-20 min-h-[560px] flex flex-row justify-between  items-center "
    >
      {/* Right: Text content */}
        <div className="w-full md:w-[40%] lg:w-[35%] flex flex-col justify-evenly items-start text-right gap-5"
        style={{ transform: "translateX(-60px)" }}
        >
          {/* Subtitle */}
          <p className="text-[#A577FD] text-sm tracking-widest font-medium">
            احدث التقنيات
          </p>

          {/* Main heading */}
          <h2 className="text-[#D2008A] text-5xl md:text-6xl font-extrabold leading-tight">
            خدماتنا
          </h2>

          {/* Description */}
          <p className="text-[#737373] text-base md:text-lg font-normal leading-relaxed max-w-xs">
            ادارة و تسير كل اركان مدرستك من منصة واحدة
          </p>

          {/* Read more link */}
          <a
            href="#"
            className="flex items-center gap-2 text-[#2d2d5e] font-semibold text-sm mt-2 group"
          >
            <span className="w-2 h-5 bg-[#D2008A] rounded-sm inline-block" />
            <span className="group-hover:text-[#D2008A] transition-colors duration-200">
              اقرا المزيد
            </span>
          </a>
        </div>

      {/* Bottom-left purple blob */}
      <div className="absolute bottom-[-100px] left-[-20px] w-[160px] md:w-[220px] pointer-events-none select-none z-0">
        <Image
          src="assets/Rectangle 6.png"
          alt=""
          width={220}
          height={300}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Main content wrapper */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Left: Mockup image */}
<div className="w-full md:w-[55%] lg:w-[60%] flex items-center justify-center -translate-x-40 translate-y-5 md:-translate-x-50 lg:-translate-x-70">
  <Image
    src="assets/Group 333.png"
    alt="Services mockup"
    width={700}
    height={460}
    className="w-full max-w-[620px] h-auto object-contain drop-shadow-xl"
    priority
  />
</div>

        
      </div>
    </section>
  );
}