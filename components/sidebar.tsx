"use client";

import { PageKey } from "./types";

interface SidebarProps {
  currentPage: PageKey;
  setPage: (page: PageKey) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const isUsersPage = (p: PageKey) =>
  p === "students" || p === "teachers" || p === "admins";

const mainLinks: { label: string; page: PageKey }[] = [
  { label: "الفصول",           page: "classes"    },
  { label: "الجداول",          page: "schedule"   },
  { label: "الحضور والغياب",   page: "attendance" },
  { label: "المالية",          page: "finance"    },
  { label: "التواصل",          page: "contact"    },
  { label: "الملفات",          page: "files"      },
];

const bottomLinks: { label: string; page: PageKey }[] = [
  { label: "الاعدادات", page: "settings" },
  { label: "التدقيق",   page: "audit"    },
];

const userSubLinks: { label: string; page: PageKey }[] = [
  { label: "الطلاب",    page: "students" },
  { label: "الاساتذة",  page: "teachers" },
  { label: "الاداريون", page: "admins"   },
];

export default function Sidebar({ currentPage, setPage, open, setOpen }: SidebarProps) {
  if (!open) return null;

  return (
    <>
      {/* Overlay on mobile */}
      <div
        className="fixed inset-0 z-30 bg-black/20 md:hidden"
        onClick={() => setOpen(false)}
      />

      <aside
        dir="rtl"
        className="relative z-40 w-[220px] min-h-screen bg-gradient-to-b from-[#e01c8a] to-[#c0157a] flex flex-col justify-between py-4 shadow-2xl"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        {/* ── Top: logo + close button ── */}
        <div>
          <div className="flex items-center justify-between px-4 py-2 mb-2">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#e01c8a] font-black text-xs">ت</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-sm">تمكين</span>
                <span className="text-white/60 text-[9px]">logo ipsum</span>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-white font-black text-base leading-none"
              title="إغلاق القائمة"
            >
              ‹
            </button>
          </div>

          {/* ── Nav links ── */}
          <nav className="flex flex-col gap-0.5 px-2">
            {/* الرئيسية */}
            <NavBtn
              label="الرئيسية"
              active={currentPage === "home"}
              onClick={() => setPage("home")}
            />

            {/* المستخدمين */}
            <NavBtn
              label="المستخدمين"
              active={isUsersPage(currentPage)}
              onClick={() => setPage("students")}
            />
            {isUsersPage(currentPage) && (
              <div className="mr-5 flex flex-col gap-0.5 mb-1">
                {userSubLinks.map((sub) => (
                  <button
                    key={sub.page}
                    onClick={() => setPage(sub.page)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold w-full text-right transition-all duration-200 ${
                      currentPage === sub.page ? "text-white" : "text-white/60 hover:text-white"
                    }`}
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        currentPage === sub.page ? "bg-white" : "bg-white/30"
                      }`}
                    />
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
                active={currentPage === link.page}
                onClick={() => setPage(link.page)}
              />
            ))}
          </nav>
        </div>

        {/* ── Bottom links ── */}
        <nav className="flex flex-col gap-0.5 px-2 pb-2">
          {bottomLinks.map((link) => (
            <NavBtn
              key={link.page}
              label={link.label}
              active={currentPage === link.page}
              onClick={() => setPage(link.page)}
            />
          ))}
          <NavBtn label="تسجيل الخروج" active={false} onClick={() => {}} />
        </nav>
      </aside>
    </>
  );
}

function NavBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2.5 rounded-xl text-sm font-black w-full text-right transition-all duration-200 ${
        active
          ? "bg-white/25 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      {label}
    </button>
  );
}