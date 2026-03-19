import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "الرئيسية", href: "#home" },
  { label: "من نحن", href: "#about" },
  { label: "المعرض", href: "#gallery" },
  { label: "التواصل", href: "#contact" },
  { label: "معنا", href: "#" },
];

const socialLinks = [
  {
    href: "#",
    label: "LinkedIn",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Facebook",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Instagram",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
];

export default function TamkinFooter() {
  return (
    <footer
      className="relative w-full overflow-hidden"
      dir="rtl"
      style={{ background: "#D2008A" }}
    >
      {/* Decorative elements */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: "#fff", transform: "translate(30%, -50%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
        style={{ background: "#fff", transform: "translate(-30%, 50%)" }}
      />

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Column 1: Logo + description */}
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span
                  className="text-white font-black text-xl"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  تمكين
                </span>
                <span
                  className="text-white/70 text-xs font-semibold"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  مدرسة
                </span>
              </div>
              {/* Logo icon */}
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
            </div>
            <p
              className="text-white/80 text-sm leading-relaxed text-right max-w-xs"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              مدرسة تمكين للدروس الخصوصية، نقدم أفضل تعليم للطور الابتدائي مع فريق من أفضل الأساتذة المتخصصين في مختلف المواد الدراسية.
            </p>
          </div>

          {/* Column 2: Site map */}
          <div className="flex flex-col items-center gap-5">
            <h3
              className="text-white font-black text-lg"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              خريطة الموقع
            </h3>
            <ul className="flex flex-col items-center gap-3 w-full">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact + Socials */}
          <div className="flex flex-col items-start gap-5">
            <h3
              className="text-white font-black text-lg w-full text-right"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              للتواصل
            </h3>

            {/* Social media icons */}
            <div className="flex items-center gap-3 w-full justify-end">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex items-center justify-center w-9 h-9 rounded-full text-white transition-all duration-200 hover:scale-110 hover:bg-white/20"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 w-full justify-end">
              <span
                className="text-white text-sm font-medium"
                dir="ltr"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                06 66 66 66 66
              </span>
              <div className="flex items-center justify-center w-7 h-7">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.64 12.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.55 1.4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z" />
                </svg>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 w-full justify-end">
              <span
                className="text-white text-sm font-medium"
                dir="ltr"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                tasyir@gmail.com
              </span>
              <div className="flex items-center justify-center w-7 h-7">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t py-4 px-4 sm:px-8"
        style={{ borderColor: "rgba(255,255,255,0.2)" }}
      >
        <p
          className="text-center text-white/60 text-xs"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          © مدرسة تمكين — {new Date().getFullYear()} كل الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}
