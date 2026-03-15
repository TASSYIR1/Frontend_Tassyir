"use client";

import Image from "next/image";
import { PageKey } from "./types";

interface SidebarProps {
  currentPage: PageKey;
  setPage: (page: PageKey) => void;
}

const topLinks: { label: string; page: PageKey; icon: string }[] = [
  { label: "الرئيسية", page: "home", icon: "🏠" },
];

const userSubLinks: { label: string; page: PageKey }[] = [
  { label: "الطلاب", page: "students" },
  { label: "الاساتذة", page: "teachers" },
  { label: "الاداريون", page: "admins" },
];

const mainLinks: { label: string; page: PageKey; icon: string }[] = [
  { label: "الفصول", page: "classes", icon: "📋" },
  { label: "الجداول", page: "schedule", icon: "📅" },
  { label: "الحضور والغياب", page: "attendance", icon: "🕐" },
  { label: "المالية", page: "finance", icon: "💰" },
  { label: "التواصل", page: "contact", icon: "📡" },
  { label: "الملفات", page: "files", icon: "📁" },
];

const bottomLinks: { label: string; page: PageKey; icon: string }[] = [
  { label: "الاعدادات", page: "settings", icon: "⚙️" },
  { label: "التدقيق", page: "audit", icon: "🔍" },
];

const isUsersPage = (p: PageKey) =>
  p === "students" || p === "teachers" || p === "admins";

export default function Sidebar({ currentPage, setPage }: SidebarProps) {
  return (
    <aside
      dir="rtl"
      className="w-[220px] min-h-screen bg-gradient-to-b from-[#e01c8a] to-[#c0157a] flex flex-col justify-between py-4 shadow-2xl"
    >
      {/* Logo */}
      <div>
        <div className="flex items-center gap-2 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#e01c8a] font-black text-xs">ت</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-black text-sm">تمكين</span>
            <span className="text-white/60 text-[9px]">logo ipsum</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-2">
          {/* الرئيسية */}
          <button
            onClick={() => setPage("home")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold w-full text-right transition-all duration-200 ${
              currentPage === "home"
                ? "bg-[#c8b4f0] text-[#2d2d5e]"
                : "text-white hover:bg-white/10"
            }`}
          >
            <span>🏠</span>
            <span>الرئيسية</span>
          </button>

          {/* المستخدمين */}
          <div>
            <button
              onClick={() => setPage("students")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold w-full text-right transition-all duration-200 ${
                isUsersPage(currentPage)
                  ? "bg-[#c8b4f0] text-[#2d2d5e]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <span>👥</span>
              <span>المستخدمين</span>
            </button>
            {isUsersPage(currentPage) && (
              <div className="mr-6 mt-1 flex flex-col gap-0.5">
                {userSubLinks.map((sub) => (
                  <button
                    key={sub.page}
                    onClick={() => setPage(sub.page)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium w-full text-right transition-all duration-200 ${
                      currentPage === sub.page
                        ? "text-white font-bold"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        currentPage === sub.page ? "bg-white" : "bg-white/40"
                      }`}
                    />
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main links */}
          {mainLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => setPage(link.page)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold w-full text-right transition-all duration-200 ${
                currentPage === link.page
                  ? "bg-[#c8b4f0] text-[#2d2d5e]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom links */}
      <nav className="flex flex-col gap-1 px-2 pb-2">
        {bottomLinks.map((link) => (
          <button
            key={link.page}
            onClick={() => setPage(link.page)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold w-full text-right transition-all duration-200 ${
              currentPage === link.page
                ? "bg-[#c8b4f0] text-[#2d2d5e]"
                : "text-white hover:bg-white/10"
            }`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </button>
        ))}
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold w-full text-right text-white hover:bg-white/10 transition-all duration-200">
          <span>🚪</span>
          <span>تسجيل الخروج</span>
        </button>
      </nav>
    </aside>
  );
}