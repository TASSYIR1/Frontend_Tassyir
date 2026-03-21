"use client";

import { useState, useRef, useEffect } from "react";
import { TayssirPageKey } from "./TayssirSidebar";

const pageTitles: Record<TayssirPageKey, string> = {
  overview: "لوحة القيادة",
  requests: "طلبات التسجيل",
  schools:  "المدارس النشطة",
  stats:    "الإحصائيات",
  logs:     "سجل العمليات",
  settings: "الإعدادات",
};

interface TayssirHeaderProps {
  currentPage: TayssirPageKey;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function TayssirHeader({
  currentPage,
  sidebarOpen,
  onToggleSidebar,
}: TayssirHeaderProps) {
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "تم تسجيل طالب جديد", time: "منذ 5 دقائق", read: false },
    { id: 2, title: "فاتورة مستحقة الدفع", time: "منذ ساعتين", read: false },
    { id: 3, title: "تم رفع ملفات جديدة", time: "منذ 5 ساعات", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      dir="rtl"
      className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 md:px-6 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-20 transition-all duration-300 font-cairo"
    >
      <div className="flex items-center gap-3 md:gap-4">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="group w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-[#e01c8a]/40 hover:bg-rose-50 hover:shadow-md transition-all duration-300 flex items-center justify-center text-gray-500 hover:text-[#e01c8a]"
            title="فتح القائمة"
          >
            <div className="group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/>
              </svg>
            </div>
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-black text-[#2d2d5e] tracking-tight">
            {pageTitles[currentPage]}
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-gray-400 mt-1">
            <span className="text-[#e01c8a] hover:text-rose-600 transition-colors cursor-pointer">الإدارة العليا</span>
            <span className="text-gray-300">/</span>
            <span>{pageTitles[currentPage]}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className={`relative w-10 h-10 flex shrink-0 items-center justify-center rounded-full border transition-all duration-300 shadow-sm hover:shadow-md ${showNotifs ? 'bg-rose-50 border-rose-200 text-[#e01c8a]' : 'bg-gray-50/80 border-gray-200 hover:bg-rose-50 hover:border-rose-200 text-gray-500 hover:text-[#e01c8a]'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={unreadCount > 0 ? "animate-pulse" : ""}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#e01c8a] rounded-full border-[1.5px] border-white animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifs && (
              <div className="absolute top-full left-full ml-3 mt-3 w-[320px] bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <span className="text-[#2d2d5e] font-black text-[15px]">الإشعارات</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-bold text-[#e01c8a] hover:text-rose-600 transition-colors bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-200"
                    >
                      تحديد الكل كمقروء
                    </button>
                  )}
                </div>

                <div className="max-h-85 overflow-y-auto flex flex-col p-2 gap-1">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => {
                          setNotifications(notifications.map((n) => n.id === notif.id ? { ...n, read: true } : n));
                        }}
                        className={`text-right flex items-start gap-4 p-3 rounded-2xl transition-all duration-300 border border-transparent ${notif.read ? 'hover:bg-gray-50' : 'bg-rose-50/50 border-rose-100 hover:bg-rose-50'}`}
                      >
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.read ? 'bg-gray-300' : 'bg-[#e01c8a] shadow-[0_0_8px_rgba(224,28,138,0.5)]'}`} />
                        <div className="flex flex-col gap-1">
                          <span className={`text-[13px] font-bold ${notif.read ? 'text-gray-600' : 'text-[#2d2d5e]'}`}>
                            {notif.title}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">
                            {notif.time}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm font-bold text-gray-400 flex flex-col items-center gap-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><line x1="22" y1="2" x2="2" y2="22"></line></svg>
                      لا توجد إشعارات جديدة
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
          
          <button className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <div className="flex-col text-left hidden sm:flex">
              <span className="text-sm font-bold text-[#2d2d5e]">مسؤول النظام</span>
              <span className="text-[10px] font-bold text-gray-400">Super Admin</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#e01c8a] to-[#9b5cf6] border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
              م
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}