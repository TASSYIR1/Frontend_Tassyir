"use client";

import { ReactNode } from "react";
import DashboardNavButton from "@/components/DashboardNavButton";

export type TayssirPageKey = "overview" | "requests" | "schools" | "stats" | "logs" | "settings";

interface TayssirSidebarProps {
  currentPage: TayssirPageKey;
  setPage: (page: TayssirPageKey) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Icons: Record<string, ReactNode> = {
  overview: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  requests: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  schools: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  stats: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  logs: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  closeIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>,
};

export default function TayssirSidebar({
  currentPage,
  setPage,
  open,
  setOpen,
}: TayssirSidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${!open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`relative z-40 h-screen transition-all duration-500 ease-in-out ${open ? "w-65 opacity-100" : "w-0 opacity-0 pointer-events-none"} overflow-hidden shrink-0`}
      >
        <aside
          dir="rtl"
          className="w-65 h-full bg-linear-to-b from-[#e01c8a] via-[#d51881] to-[#b31269] flex flex-col pt-6 pb-2 shadow-[10px_0_30px_-10px_rgba(224,28,138,0.4)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full font-cairo"
        >
          <div className="flex items-center justify-between px-6 pb-6 mb-2 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <span className="text-white font-black text-lg">ت</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-black text-lg tracking-wide">تسيير</span>
                <span className="text-white/60 text-[10px] font-bold tracking-widest">SUPER ADMIN</span>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="group w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 transition-all duration-300 flex items-center justify-center text-white/80 hover:text-white border border-white/10"
              title="إغلاق القائمة"
            >
              <div className="group-hover:-translate-x-1 group-hover:scale-110 transition-transform duration-300">
                {Icons.closeIcon}
              </div>
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 px-4 mt-4 flex-1">
            <DashboardNavButton
              label="لوحة القيادة"
              icon={Icons.overview}
              active={currentPage === "overview"}
              onClick={() => setPage("overview")}
            />
            <DashboardNavButton
              label="طلبات التسجيل"
              icon={Icons.requests}
              active={currentPage === "requests"}
              onClick={() => setPage("requests")}
            />
            <DashboardNavButton
              label="المدارس النشطة"
              icon={Icons.schools}
              active={currentPage === "schools"}
              onClick={() => setPage("schools")}
            />
            <DashboardNavButton
              label="الإحصائيات"
              icon={Icons.stats}
              active={currentPage === "stats"}
              onClick={() => setPage("stats")}
            />
          </nav>

          <div className="px-4 mt-auto space-y-1.5">
            <DashboardNavButton
              label="الإعدادات"
              icon={Icons.settings}
              active={currentPage === "settings"}
              onClick={() => setPage("settings")}
            />
            <DashboardNavButton
              label="سجل العمليات"
              icon={Icons.logs}
              active={currentPage === "logs"}
              onClick={() => setPage("logs")}
            />
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="w-full h-13 rounded-xl flex items-center gap-3 px-4 font-bold transition-all duration-300 group hover:bg-white/10 text-white/70 hover:text-white mt-1 border border-transparent hover:border-white/10"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-white/20 transition-all duration-300 text-rose-300">
                {Icons.logout}
              </div>
              <span className="text-[15px] truncate pt-1">تسجيل الخروج</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}