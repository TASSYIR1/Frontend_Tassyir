"use client";

import { PageKey } from "./types";

const pageTitles: Record<PageKey, string> = {
  home:       "الصفحة الرئيسية",
  students:   "المستخدمين",
  teachers:   "المستخدمين",
  admins:     "المستخدمين",
  classes:    "الفصول",
  schedule:   "الجداول",
  attendance: "الحضور والغياب",
  finance:    "المالية",
  contact:    "التواصل",
  files:      "الملفات",
  settings:   "الاعدادات",
  audit:      "التدقيق",
};

interface HeaderProps {
  currentPage: PageKey;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ currentPage, sidebarOpen, onToggleSidebar }: HeaderProps) {
  return (
    <header
      dir="rtl"
      className="w-full bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between shadow-sm"
    >
      {/* Right side: toggle button + page title */}
      <div className="flex items-center gap-3">
        {/* Sidebar toggle — shows when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 rounded-lg bg-[#e01c8a]/10 hover:bg-[#e01c8a]/20 flex items-center justify-center transition-colors"
            title="فتح القائمة"
          >
            <span className="text-[#e01c8a] font-black text-lg leading-none">›</span>
          </button>
        )}
        <h1 className="text-[#2d2d5e] font-black text-lg">
          {pageTitles[currentPage]}
        </h1>
      </div>

      {/* Left side: logo */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col leading-none text-right">
          <span className="text-[#2d2d5e] font-black text-sm">تمكين</span>
          <span className="text-gray-400 text-[9px]">logo ipsum</span>
        </div>
        <div className="w-8 h-8 bg-[#e01c8a] rounded-full flex items-center justify-center">
          <span className="text-white font-black text-xs">ت</span>
        </div>
      </div>
    </header>
  );
}