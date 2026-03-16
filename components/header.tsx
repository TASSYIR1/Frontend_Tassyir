"use client";

import { PageKey } from "./types";
import { useState, useRef, useEffect } from "react";

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
  setPage?: (page: PageKey) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ currentPage, setPage, sidebarOpen, onToggleSidebar }: HeaderProps) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = Object.entries(pageTitles).filter(([key, title]) =>
    title.includes(searchQuery) || key.includes(searchQuery.toLowerCase())
  );

  const [notifications, setNotifications] = useState([
    { id: 1, title: "تم تسجيل طالب جديد", time: "منذ 5 دقائق", read: false },
    { id: 2, title: "فاتورة مستحقة الدفع", time: "منذ ساعتين", read: false },
    { id: 3, title: "تم رفع ملفات جديدة", time: "منذ 5 ساعات", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  return (
    <header
      dir="rtl"
      className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 md:px-6 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-20 transition-all duration-300 font-cairo"
    >
      {/* Right side: toggle button + page title */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Sidebar toggle — shows when sidebar is closed */}
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
            <span className="text-[#e01c8a] hover:text-rose-600 transition-colors cursor-pointer">لوحة القيادة</span>
            <span className="text-gray-300">/</span>
            <span>{pageTitles[currentPage]}</span>
          </div>
        </div>
      </div>

      {/* Left side: Search, Notifications, Profile/Logo */}
      <div className="flex items-center gap-3 md:gap-5">
        
        {/* Search (hidden on mobile, visible on lg) */}
        <div ref={searchRef} className="relative hidden lg:block">
          <div 
            className={`flex items-center bg-gray-50/80 border ${showSearch ? 'border-[#e01c8a]/50 ring-4 ring-[#e01c8a]/10 bg-white' : 'border-gray-200'} rounded-full px-4 py-2 hover:bg-white hover:border-[#e01c8a]/30 hover:shadow-sm transition-all duration-300 group`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors ${showSearch ? 'text-[#e01c8a]' : 'text-gray-400 group-hover:text-[#e01c8a]'}`}>
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="البحث سريع..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!showSearch) setShowSearch(true);
              }}
              onFocus={() => setShowSearch(true)}
              className="bg-transparent border-none outline-none w-48 text-sm px-2 text-[#2d2d5e] placeholder:text-gray-400 font-bold" 
            />
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-black border border-gray-200 rounded px-1.5 py-0.5 bg-white shadow-sm">
              <span>⌘</span><span>K</span>
            </div>
          </div>

          {/* Search Dropdown */}
          {showSearch && (
            <div className="absolute top-full right-0 mt-3 w-full bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-h-64 overflow-y-auto p-2">
                {searchResults.length > 0 ? (
                  searchResults.map(([key, title], index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (setPage) setPage(key as PageKey);
                        setShowSearch(false);
                        setSearchQuery("");
                      }}
                      className="w-full text-right px-4 py-3 hover:bg-rose-50 hover:text-[#e01c8a] transition-colors rounded-xl text-sm font-bold text-gray-600 flex items-center gap-3"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="9 18 15 12 9 6"/></svg>
                      {title}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-sm font-bold text-gray-400">
                    لا توجد نتائج بحث
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className={`relative w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 shadow-sm hover:shadow-md ${showNotifs ? 'bg-rose-50 border-rose-200 text-[#e01c8a]' : 'bg-gray-50/80 border-gray-200 hover:bg-rose-50 hover:border-rose-200 text-gray-500 hover:text-[#e01c8a]'}`}
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
            <div className="absolute top-full right-[-60px] md:right-0 left-auto mt-3 w-[320px] bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col">
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
              <div className="max-h-[340px] overflow-y-auto flex flex-col p-2 gap-1">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <button 
                      key={notif.id}
                      onClick={() => {
                        setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
                      }}
                      className={`text-right flex items-start gap-4 p-3 rounded-2xl transition-all duration-300 border border-transparent ${notif.read ? 'hover:bg-gray-50' : 'bg-rose-50/50 border-rose-100 hover:bg-rose-50'}`}
                    >
                      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.read ? 'bg-gray-300' : 'bg-[#e01c8a] shadow-[0_0_8px_rgba(224,28,138,0.5)]'}`} />
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

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-gray-200 rounded-full mx-1"></div>

        {/* Logo / Profile Dropdown Trigger */}
        <button className="flex items-center gap-3 p-1 md:pr-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-300 group">
          <div className="hidden md:flex flex-col leading-none text-right">
            <span className="text-[#2d2d5e] font-black text-sm group-hover:text-[#e01c8a] transition-colors">تمكين</span>
            <span className="text-gray-400 font-bold text-[9px] tracking-widest uppercase mt-1">Admin</span>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-[#e01c8a] to-rose-400 rounded-full flex items-center justify-center shadow-md shadow-rose-200 group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300 border-2 border-white ring-2 ring-transparent group-hover:ring-rose-100 flex-shrink-0">
            <span className="text-white font-black text-sm">ت</span>
          </div>
        </button>

      </div>
    </header>
  );
}