"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function TamkinLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#F5F7FB] flex flex-col relative" dir="rtl">
      {/* Full-height left-side school image */}
      <div className="fixed top-0 left-0 h-full w-auto z-0">
        <img src="/school.png" alt="school" className="h-full w-auto object-cover" style={{minWidth: '200px'}} />
      </div>
      {/* ═══════ Main Split Layout ═══════ */}
      <div className="flex-1 flex flex-col">

        {/* ────── Login Form Section Only ────── */}
        <div className="flex-1 flex flex-col justify-between px-6 sm:px-10 lg:px-16 py-8 lg:py-12 relative z-10">

          {/* ── Header: Logo ── */}
          <div className="flex items-center gap-3 mb-8 lg:mb-0">
            {/* Globe icon */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#1E0D3B" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
                <ellipse cx="12" cy="12" rx="4" ry="10" stroke="white" strokeWidth="1.5" />
                <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" />
                <line x1="4" y1="7" x2="20" y2="7" stroke="white" strokeWidth="1" />
                <line x1="4" y1="17" x2="20" y2="17" stroke="white" strokeWidth="1" />
              </svg>
            </div>
            <span
              className="font-black text-xl text-[#1E0D3B]"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              تسيير
            </span>
            <div className="flex flex-col leading-tight mr-1">
              <span className="text-[10px] font-bold text-gray-400">logo—</span>
              <span className="text-[10px] font-bold text-gray-400">ipsum</span>
            </div>
          </div>

          {/* ── Center content: Title + Form ── */}
          <div className="flex-1 flex items-center justify-end lg:pr-16">
            <div className="w-full max-w-md text-right ml-auto">

              {/* Title */}
              <h1
                className="font-black text-gray-800 mb-3 text-right"
                style={{
                  fontSize: "clamp(24px, 4vw, 38px)",
                  fontFamily: "'Cairo', sans-serif",
                  lineHeight: 1.3,
                }}
              >
                سجل دخولك في{" "}
                <span className="text-[#D2008A]">تسيير</span>
              </h1>

              {/* Subtitle */}
              <p
                className="text-gray-500 mb-10 leading-relaxed text-right"
                style={{
                  fontSize: "clamp(13px, 1.5vw, 15px)",
                  fontFamily: "'Cairo', sans-serif",
                  lineHeight: 1.8,
                }}
              >
                منصة رقمية متكاملة لمتابعة الدفعات، جداول الحصص، الحضور، والتواصل
                الفوري بين الإدارة والأساتذة والطلبة.
              </p>

              {/* ── Form ── */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-5"
                dir="rtl"
              >
                {/* Email */}
                <div className="relative group">
                  {/* Icon right */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D2008A] transition-colors pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    className="w-full pr-12 pl-4 py-4 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-all duration-200 border border-transparent focus:border-[#D2008A]/40 focus:shadow-[0_0_0_3px_rgba(210,0,138,0.08)] shadow-sm hover:shadow-md text-right"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  />
                </div>

                {/* Password */}
                <div className="relative group">
                  {/* Icon right: lock */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D2008A] transition-colors pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  {/* Toggle eye left */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D2008A] transition-colors"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="كلمة المرور"
                    className="w-full pr-12 pl-12 py-4 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-all duration-200 border border-transparent focus:border-[#D2008A]/40 focus:shadow-[0_0_0_3px_rgba(210,0,138,0.08)] shadow-sm hover:shadow-md text-right"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-white text-base transition-all duration-300 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: "linear-gradient(135deg, #D2008A 0%, #E91E8C 100%)",
                    fontFamily: "'Cairo', sans-serif",
                    boxShadow: "0 6px 20px rgba(210,0,138,0.3)",
                  }}
                >
                  تسجيل الدخول
                </button>
              </form>

              {/* ── Secondary options ── */}
              <div className="flex items-center justify-between mt-5 flex-wrap gap-2">
                {/* Forgot password */}
                <Link
                  href="#"
                  className="text-[#D2008A] font-bold text-sm hover:underline transition-all"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  هل نسيت كلمة المرور ؟
                </Link>

                {/* Terms checkbox */}
                <label
                  className="flex items-center gap-2 cursor-pointer text-sm text-gray-500 select-none flex-row-reverse"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  أوافق على جميع الشروط
                  <button
                    type="button"
                    onClick={() => setAgreed(!agreed)}
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0"
                    style={{
                      borderColor: agreed ? "#D2008A" : "#ccc",
                      background: agreed ? "#D2008A" : "transparent",
                    }}
                  >
                    {agreed && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </label>
              </div>
            </div>
          </div>

          {/* ── Footer links ── */}
          <div
            className="flex items-center justify-center gap-4 text-gray-400 text-xs sm:text-sm mt-8 lg:mt-0"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <Link href="#" className="hover:text-[#D2008A] transition-colors">
              الدعم الفني
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="#" className="hover:text-[#D2008A] transition-colors">
              طريقة الاستخدام
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="#" className="hover:text-[#D2008A] transition-colors">
              شروط الاستخدام
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
