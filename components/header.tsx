"use client";

import { PageKey } from "./types";

const pageTitles: Record<PageKey, string> = {
  home: "الصفحة الرئيسية",
  students: "المستخدمين",
  teachers: "المستخدمين",
  admins: "المستخدمين",
  classes: "الفصول",
  schedule: "الجداول",
  attendance: "الحضور والغياب",
  finance: "المالية",
  contact: "التواصل",
  files: "الملفات",
  settings: "الاعدادات",
  audit: "التدقيق",
};

interface HeaderProps {
  currentPage: PageKey;
}

export default function Header({ currentPage }: HeaderProps) {
  return (
    <header
      dir="rtl"
      className="w-full bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm"
    >
      {/* Right: page title */}
      <h1 className="text-[#2d2d5e] font-bold text-lg">
        {pageTitles[currentPage]}
      </h1>

      {/* Left: logo + notification */}
      <div className="flex items-center gap-4">
        <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="text-gray-500 text-lg">🔲</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex flex-col leading-none text-right">
            <span className="text-[#2d2d5e] font-black text-sm">تمكين</span>
            <span className="text-gray-400 text-[9px]">logo ipsum</span>
          </div>
          <div className="w-8 h-8 bg-[#e01c8a] rounded-full flex items-center justify-center">
            <span className="text-white font-black text-xs">ت</span>
          </div>
        </div>
      </div>
    </header>
  );
}