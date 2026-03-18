"use client";

import { PageKey } from "./types";
import { ReactNode } from "react";

interface SidebarProps {
  currentPage: PageKey;
  setPage: (page: PageKey) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const isUsersPage = (p: PageKey) =>
  p === "students" || p === "teachers" || p === "admins" || p === "parents";

const Icons: Record<string, ReactNode> = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  parents: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  classes: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  subjects: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>,
  announcements: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13z"/><path d="M11 13v6"/></svg>,
  schedule: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  attendance: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>,
  finance: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  contact: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  files: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  audit: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  closeIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>,
  menuIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>,
  students: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  teachers: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  admins: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
};

const mainLinks: { label: string; page: PageKey; icon: ReactNode }[] = [
  { label: "الفصول",           page: "classes",    icon: Icons.classes },
  { label: "المواد والمجموعات", page: "subjects",   icon: Icons.subjects },
  { label: "الجداول",          page: "schedule",   icon: Icons.schedule },
  { label: "الحضور والغياب",   page: "attendance", icon: Icons.attendance },
  { label: "المالية",          page: "finance",    icon: Icons.finance },
  { label: "الإعلانات",        page: "announcements", icon: Icons.announcements },
  { label: "التواصل",          page: "contact",    icon: Icons.contact },
  { label: "الملفات",          page: "files",      icon: Icons.files },
];

const bottomLinks: { label: string; page: PageKey; icon: ReactNode }[] = [
  { label: "الاعدادات", page: "settings", icon: Icons.settings },
  { label: "التدقيق",   page: "audit",    icon: Icons.audit },
];

const userSubLinks: { label: string; page: PageKey; icon: ReactNode }[] = [
  { label: "الطلاب",    page: "students", icon: Icons.students },
  { label: "الاساتذة",  page: "teachers", icon: Icons.teachers },
  { label: "الاداريون", page: "admins",   icon: Icons.admins },
  { label: "أولياء الأمور", page: "parents",   icon: Icons.parents },
];

export default function Sidebar({ currentPage, setPage, open, setOpen }: SidebarProps) {
  return (
    <>
      {/* Overlay on mobile */}
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${!open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        onClick={() => setOpen(false)}
      />

      <div 
        className={`relative z-40 h-screen transition-all duration-500 ease-in-out ${open ? "w-[260px] opacity-100" : "w-0 opacity-0 pointer-events-none"} overflow-hidden shrink-0`}
      >
        <aside
          dir="rtl"
          className="w-[260px] h-full bg-gradient-to-b from-[#e01c8a] via-[#d51881] to-[#b31269] flex flex-col justify-between pt-6 pb-2 shadow-[10px_0_30px_-10px_rgba(224,28,138,0.4)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full font-cairo"
        >
          {/* ── Top: logo + close button ── */}
          <div>
            <div className="flex items-center justify-between px-6 pb-6 mb-2 border-b border-white/10">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                  <span className="text-white font-black text-lg">ت</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-white font-black text-lg tracking-wide">تمكين</span>
                  <span className="text-white/60 text-[10px] font-bold tracking-widest">DASHBOARD</span>
                </div>
              </div>

              {/* Close button */}
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

            {/* ── Nav links ── */}
            <nav className="flex flex-col gap-1.5 px-4 mt-4">
              {/* الرئيسية */}
              <NavBtn
                label="الرئيسية"
                icon={Icons.home}
                active={currentPage === "home"}
                onClick={() => setPage("home")}
              />

              {/* المستخدمين */}
              <NavBtn
                label="المستخدمين"
                icon={Icons.users}
                active={isUsersPage(currentPage)}
                onClick={() => setPage("students")}
              />
              {isUsersPage(currentPage) && (
                <div className="mr-6 pr-4 border-r-2 border-white/10 flex flex-col gap-1 my-1 animate-in slide-in-from-right-2 duration-300">
                  {userSubLinks.map((sub) => (
                    <button
                      key={sub.page}
                      onClick={() => setPage(sub.page)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold w-full text-right transition-all duration-300 ${currentPage === sub.page ? "bg-white/20 text-white shadow-sm border border-white/10" : "text-white/60 hover:bg-white/10 hover:text-white hover:translate-x-1"}`}
                    >
                      <span className={`transition-colors duration-300 ${currentPage === sub.page ? "text-white" : "text-white/40"}`}>
                        {sub.icon}
                      </span>
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Main links */}
              {mainLinks.map((link) => (
                <NavBtn
                  key={link.page}
                  label={link.label}
                  icon={link.icon}
                  active={currentPage === link.page}
                  onClick={() => setPage(link.page)}
                />
              ))}
            </nav>
          </div>

          {/* ── Bottom links ── */}
          <div className="mt-8 pt-6 border-t border-white/10 px-4">
            <nav className="flex flex-col gap-1.5">
              {bottomLinks.map((link) => (
                <NavBtn
                  key={link.page}
                  label={link.label}
                  icon={link.icon}
                  active={currentPage === link.page}
                  onClick={() => setPage(link.page)}
                />
              ))}
              <button
                onClick={() => {}}
                className="group flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-black w-full text-right transition-all duration-300 text-white/80 hover:bg-rose-500/80 hover:text-white hover:shadow-lg hover:shadow-rose-500/30 border border-transparent hover:border-rose-400 mt-2"
              >
                <div className="flex items-center gap-3">
                  <span className="group-hover:-translate-x-1 transition-transform duration-300">
                    {Icons.logout}
                  </span>
                  تسجيل الخروج
                </div>
              </button>
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
}

function NavBtn({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-black w-full text-right transition-all duration-300 ${active ? "bg-white/20 text-white shadow-md border border-white/20 backdrop-blur-sm scale-[1.02]" : "text-white/80 hover:bg-white/10 hover:text-white border border-transparent hover:translate-x-1"}`}
    >
      <div className="flex items-center gap-3">
        <span className={`transition-all duration-300 ${active ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "group-hover:scale-110"}`}>
          {icon}
        </span>
        {label}
      </div>
      {active && (
        <span className="w-1.5 h-6 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" />
      )}
    </button>
  );
}