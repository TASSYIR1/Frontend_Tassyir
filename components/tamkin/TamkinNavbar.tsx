"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "الرئيسية", href: "#home" },
  { label: "من نحن", href: "#about" },
  { label: "المعرض", href: "#gallery" },
  { label: "التواصل", href: "#contact" },
];

export default function TamkinNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - far right in RTL */}
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src="/assets/logo.png"
                alt="تمكين"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={`font-black text-lg transition-colors duration-300 ${
                  scrolled ? "text-[#D2008A]" : "text-white"
                }`}
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                تمكين
              </span>
              <span
                className={`text-[10px] font-semibold transition-colors duration-300 ${
                  scrolled ? "text-purple-600" : "text-white/80"
                }`}
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                مدرسة
              </span>
            </div>
          </div>

          {/* Nav Links - center */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`font-semibold text-sm transition-all duration-200 hover:text-[#E91E8C] relative group ${
                    scrolled ? "text-gray-700" : "text-white/90"
                  }`}
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E91E8C] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Button - far left in RTL */}
          <div className="flex items-center gap-3">
            <a
              href="/Tamkin/login"
              className="hidden sm:inline-flex items-center px-5 py-2 rounded-full bg-[#E91E8C] text-white font-bold text-sm hover:bg-[#c4177a] transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              تسجيل الدخول
            </a>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${
                  isMenuOpen
                    ? "rotate-45 translate-y-2 bg-[#E91E8C]"
                    : scrolled
                    ? "bg-gray-700"
                    : "bg-white"
                }`}
              />
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${
                  isMenuOpen
                    ? "opacity-0"
                    : scrolled
                    ? "bg-gray-700"
                    : "bg-white"
                }`}
              />
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${
                  isMenuOpen
                    ? "-rotate-45 -translate-y-2 bg-[#E91E8C]"
                    : scrolled
                    ? "bg-gray-700"
                    : "bg-white"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
        }}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="block py-2 text-gray-700 font-semibold hover:text-[#E91E8C] transition-colors"
                style={{ fontFamily: "'Cairo', sans-serif" }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href="/Tamkin/login"
              className="inline-flex px-5 py-2 rounded-full bg-[#E91E8C] text-white font-bold text-sm"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              تسجيل الدخول
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
