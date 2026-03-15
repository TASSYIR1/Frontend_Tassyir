import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "الرئيسية",  href: "#" },
  { label: "لماذا نحن", href: "#" },
  { label: "خدماتنا",  href: "#" },
  { label: "الانتشار", href: "#" },
  { label:   "تواصل",    href: "#" },

];

const socialIcons = [
  { src: "assets/linkedin.png",  alt: "LinkedIn"  },
  { src: "assets/facebook.png",  alt: "Facebook"  },
  { src: "assets/instagram.png", alt: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#D2008A] overflow-hidden">

      {/* ── Main footer content ── */}
      <div className="w-full px-10 md:px-16 lg:px-24 py-12">
        <div className="flex flex-col md:flex-row-reverse items-start justify-between gap-12 md:gap-0">

          {/* ── Column 1 (far right): Logo + description ── */}
          <div className="flex flex-col items-end gap-4 w-full md:w-1/3 md:pl-8">
            <div className="flex items-end gap-3">
              <Image
                src="assets/logo.png"
                alt="تسيير"
                width={50}
                height={50}
                className="h-auto object-contain"
              />
              <Image
                src="assets/logo.png"
                alt="تسيير"
                width={50}
                height={50}
                className="h-auto object-contain"
              />
            </div>
            <p className="text-white/90 text-sm leading-relaxed text-right">
              منصة الكترونية موحدة لإدارة المدرسية في الجزائر. تدعم المدارس العادية ومدارس الدروس الخصوصية. سهّل قائمة الاحصاءات الجداول الحضور والتواصل بين الأطراف وتواصلك مع الإنجازات مع الفعاليات قرونة وقابلة لخلطها.
            </p>
          </div>

          {/* ── Column 2: Site map ── */}
          <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
            <h3 className="text-white font-bold text-lg tracking-wide">
              خريطة الموقع
            </h3>
            <ul className="flex flex-col items-center gap-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-white/90 hover:text-white transition-colors duration-200 text-sm font-medium ${
                      link.label === "الانتشار" ? "font-bold text-white" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3 (far left): Contact ── */}
          <div className="flex flex-col items-start gap-5 w-full md:w-1/3 md:pr-8">
            <h3 className="text-white font-bold text-lg tracking-wide w-full text-right">
              للتواصل
            </h3>

            {/* Social icons */}
            <div className="flex flex-row-reverse items-center gap-3 w-full justify-end">
              {socialIcons.map((icon) => (
                <Link href="#" key={icon.alt}>
                  <div className="w-9 h-9 rounded-md bg-transparent flex items-center gap-0 justify-center">
                    <Image
                      src={icon.src}
                      alt={icon.alt}
                      width={30}
                      height={30}
                      className="object-contain"
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Phone */}
            <div className="flex flex-row-reverse items-center gap-2 w-full justify-end">
              <Image
                src="assets/phone.png"
                alt="phone"
                width={18}
                height={18}
                className="object-contain color-white invert"
              />
              <span className="text-white text-sm font-medium tracking-wide" dir="ltr">
                06 66 66 66 66
              </span>
            </div>

            {/* Email */}
            <div className="flex flex-row-reverse items-center gap-2 w-full justify-end">
              <Image
                src="assets/mail.png"
                alt="mail"
                width={18}
                height={18}
                className="object-contain color-white invert"
              />
              <span className="text-white text-sm font-medium" dir="ltr">
                tasyir@gmail.com
              </span>
            </div>

            {/* CTA Button */}
            <div className="w-full flex justify-">
              <Link
                href="#"
                className="mt-1 bg-white text-[#D2008A] hover:bg-white/90 transition-colors duration-200 font-bold text-sm px-8 py-2.5 rounded-md shadow-md"
              >
                سجل الان
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="w-full border-t border-white/20 py-4 px-10 md:px-16 lg:px-24">
        <div className="flex items-center justify-start gap-1">
          <span className="text-white/70 text-xs">
            © تسيير - 2026 كل الحقوق محفوظة
          </span>
        </div>
      </div>

    </footer>
  );
}