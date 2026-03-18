"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

// --- Types ---
type ParentPageKey =
  | "children"
  | "schedule"
  | "attendance"
  | "payments"
  | "announcements"
  | "messaging";

const pageTitles: Record<ParentPageKey, string> = {
  children: "أبنائي",
  schedule: "الجدول الدراسي",
  attendance: "الحضور والغياب",
  payments: "المدفوعات",
  announcements: "الإعلانات",
  messaging: "المراسلة",
};

// --- Shared SVGs (Matched exactly with admin/teacher template) ---
const Icons: Record<string, ReactNode> = {
  children: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  schedule: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  attendance: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>,
  payments: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  announcements: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13z"/><path d="M11 13v6"/></svg>,
  messaging: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  closeIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>,
};

const navLinks: { label: string; page: ParentPageKey; icon: ReactNode }[] = [
  { label: "أبنائي",          page: "children",      icon: Icons.children },
  { label: "الجدول الدراسي",  page: "schedule",      icon: Icons.schedule },
  { label: "الحضور والغياب",  page: "attendance",    icon: Icons.attendance },
  { label: "المدفوعات",       page: "payments",      icon: Icons.payments },
  { label: "الإعلانات",       page: "announcements", icon: Icons.announcements },
  { label: "المراسلة",        page: "messaging",     icon: Icons.messaging },
];

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
      className={`group flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-black w-full text-right transition-all duration-300 ${
        active 
          ? "bg-white/20 text-white shadow-md border border-white/20 backdrop-blur-sm scale-[1.02]" 
          : "text-white/80 hover:bg-white/10 hover:text-white border border-transparent hover:translate-x-1"
      }`}
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

// --- Components ---

function StatCard({ title, value, subtitle, highlight = false }: { title: string; value: string; subtitle: string, highlight?: boolean }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="text-gray-500 font-bold text-sm mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-black ${highlight ? 'text-green-600' : 'text-[#2d2d5e]'}`}>{value}</span>
      </div>
      <p className={`text-xs mt-2 font-bold inline-block px-2 py-1 rounded-lg ${highlight ? 'bg-green-50 text-green-700' : 'text-[#e01c8a] bg-rose-50'}`}>
        {subtitle}
      </p>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 w-full">
      <h3 className="text-[#2d2d5e] font-black text-lg mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-[#e01c8a] rounded-full"></span>
        {title}
      </h3>
      {children}
    </div>
  );
}

// --- Main Page ---

export default function ParentDashboard() {
  const [currentPage, setCurrentPage] = useState<ParentPageKey>("children");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Active Child State
  const childrenList = [
    { id: 1, name: "ياسين أحمد", grade: "الابتدائي", level: "الصف الخامس" },
    { id: 2, name: "سارة أحمد", grade: "الإعدادي", level: "الصف الثاني" },
  ];
  const [activeChildId, setActiveChildId] = useState<number>(1);
  const activeChild = childrenList.find(c => c.id === activeChildId) || childrenList[0];

  // Header Handlers
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChildrenDropdown, setShowChildrenDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const childrenDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (childrenDropdownRef.current && !childrenDropdownRef.current.contains(event.target as Node)) {
        setShowChildrenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = Object.entries(pageTitles).filter(([key, title]) =>
    title.includes(searchQuery) || key.includes(searchQuery.toLowerCase())
  );

  const [notifications, setNotifications] = useState([
    { id: 1, title: "رسالة جديدة من الإدارة", time: "منذ 5 دقائق", read: false },
    { id: 2, title: "تنبيه: اقتراب موعد سداد المصروفات", time: "منذ ساعتين", read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));

  const renderContent = () => {
    switch (currentPage) {
      case "children":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="الأبناء المسجلين" value="2" subtitle="في المراحل المختلفة" />
              <StatCard title="تنبيهات الحضور" value="1" subtitle="غياب واحد لسارة" />
              <StatCard title="الإشعارات" value={unreadCount.toString()} subtitle="إشعارات غير مقروءة" />
              <StatCard title="حالة المدفوعات" value="مستحقة" subtitle="قسط متبقي لياسين" highlight={false} />
            </div>

            <SectionCard title="قائمة الأبناء">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {childrenList.map((child) => (
                  <div 
                    key={child.id}
                    onClick={() => setActiveChildId(child.id)}
                    className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 flex justify-between items-center ${activeChildId === child.id ? 'border-[#e01c8a] bg-rose-50' : 'border-gray-200 bg-white hover:border-[#e01c8a]/50 hover:shadow-md'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl shadow-sm ${activeChildId === child.id ? 'bg-[#e01c8a]' : 'bg-gray-400'}`}>
                        {child.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className={`font-black text-lg ${activeChildId === child.id ? 'text-[#2d2d5e]' : 'text-gray-700'}`}>{child.name}</h4>
                        <p className="text-sm font-bold text-gray-500 mt-1">{child.grade} • {child.level}</p>
                      </div>
                    </div>
                    {activeChildId === child.id && (
                      <span className="bg-[#e01c8a] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">النشط حالياً</span>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        );

      case "schedule":
        return (
          <SectionCard title={`الجدول الدراسي - ${activeChild.name}`}>
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="py-4 px-4 font-black text-gray-400 text-sm w-1/4">اليوم / الوقت</th>
                    <th className="py-4 px-4 font-black text-gray-400 text-sm w-1/4">المادة (سجل الحصص)</th>
                    <th className="py-4 px-4 font-black text-gray-400 text-sm w-1/4">المعلم</th>
                    <th className="py-4 px-4 font-black text-gray-400 text-sm w-1/4">القاعة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-black text-[#2d2d5e] text-sm">الإثنين</p>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">08:30 - 10:00 ص</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-bold border border-blue-100">الرياضيات</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-600">أ. محمود</td>
                    <td className="py-4 px-4 font-bold text-gray-600">قاعة 201</td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-black text-[#2d2d5e] text-sm">الإثنين</p>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">10:15 - 12:00 م</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-sm font-bold border border-purple-100">الفيزياء</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-600">أ. سارة</td>
                    <td className="py-4 px-4 font-bold text-gray-600">قاعة 105</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        );

      case "attendance":
        return (
          <SectionCard title={`سجل الحضور والغياب - ${activeChild.name}`}>
             <div className="flex gap-4 mb-6">
               <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-xl flex-1 flex justify-between items-center">
                 <span className="font-bold text-green-800 text-sm">حضور</span>
                 <span className="font-black text-green-600 text-xl">45</span>
               </div>
               <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-xl flex-1 flex justify-between items-center">
                 <span className="font-bold text-red-800 text-sm">غياب</span>
                 <span className="font-black text-red-600 text-xl">1</span>
               </div>
               <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl flex-1 flex justify-between items-center">
                 <span className="font-bold text-amber-800 text-sm">تأخير</span>
                 <span className="font-black text-amber-500 text-xl">2</span>
               </div>
             </div>

             <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
               <table className="w-full text-right border-collapse">
                 <thead>
                   <tr className="border-b-2 border-gray-100">
                     <th className="py-4 px-4 font-black text-gray-400 text-sm">التاريخ</th>
                     <th className="py-4 px-4 font-black text-gray-400 text-sm">المادة</th>
                     <th className="py-4 px-4 font-black text-gray-400 text-sm">الحالة</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                     <td className="py-4 px-4 font-bold text-[#2d2d5e] text-sm">12 مارس 2026</td>
                     <td className="py-4 px-4 font-bold text-gray-600 text-sm">الرياضيات</td>
                     <td className="py-4 px-4">
                       <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-lg text-xs">حاضر</span>
                     </td>
                   </tr>
                   <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                     <td className="py-4 px-4 font-bold text-[#2d2d5e] text-sm">10 مارس 2026</td>
                     <td className="py-4 px-4 font-bold text-gray-600 text-sm">الفيزياء</td>
                     <td className="py-4 px-4">
                       <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-lg text-xs">غائب</span>
                     </td>
                   </tr>
                   <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                     <td className="py-4 px-4 font-bold text-[#2d2d5e] text-sm">05 مارس 2026</td>
                     <td className="py-4 px-4 font-bold text-gray-600 text-sm">العلوم</td>
                     <td className="py-4 px-4">
                       <span className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-lg text-xs">تأخير</span>
                     </td>
                   </tr>
                 </tbody>
               </table>
             </div>
          </SectionCard>
        );

      case "payments":
        return (
          <SectionCard title={`حالة المدفوعات - ${activeChild.name}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-2xl p-5 hover:border-[#e01c8a]/30 transition-all shadow-sm bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-[#2d2d5e] text-lg">شهر مارس</h4>
                    <p className="text-sm text-gray-500 font-bold mt-1">المصروفات الدراسية</p>
                  </div>
                  <span className="bg-green-100 text-green-700 font-black px-3 py-1.5 rounded-lg text-xs border border-green-200">
                    مدفوع
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-black text-lg text-[#2d2d5e]">1500 درهم</span>
                  <button className="text-[#e01c8a] text-sm font-bold hover:underline flex items-center gap-1">
                    تحميل الإيصال
                  </button>
                </div>
              </div>

              <div className="border border-[#e01c8a]/40 bg-rose-50/30 rounded-2xl p-5 hover:border-[#e01c8a] transition-all shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-[#2d2d5e] text-lg">شهر أبريل</h4>
                    <p className="text-sm text-gray-500 font-bold mt-1">المصروفات الدراسية</p>
                  </div>
                  <span className="bg-rose-100 text-[#e01c8a] font-black px-3 py-1.5 rounded-lg text-xs border border-rose-200">
                    غير مدفوع
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-black text-lg text-[#2d2d5e]">1500 درهم</span>
                  <button className="bg-[#e01c8a] hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                    الدفع الآن
                  </button>
                </div>
              </div>
            </div>
          </SectionCard>
        );

      case "announcements":
        return (
          <SectionCard title="الإعلانات (المدرسة والمعلمين)">
            <div className="flex flex-col gap-4">
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#e01c8a]/30 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">إعلان مدرسة</span>
                  <span className="text-xs text-gray-400 font-bold">اليوم الساعة 09:30 ص</span>
                </div>
                <h4 className="font-black text-[#2d2d5e] text-base mb-2">اجتماع أولياء الأمور</h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  السادة أولياء الأمور الكرام، ندعوكم لحضور اجتماعنا الفصلي لمناقشة أداء أبنائكم يوم السبت القادم.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#e01c8a]/30 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">إعلان معلم (أستاذ محمود)</span>
                  <span className="text-xs text-gray-400 font-bold">أمس الساعة 16:00 م</span>
                </div>
                <h4 className="font-black text-[#2d2d5e] text-base mb-2">رحلة علمية لمادة العلوم</h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  يرجى تسليم موافقات أولياء الأمور للرحلة العلمية المقررة يوم الأربعاء القادم.
                </p>
              </div>
            </div>
          </SectionCard>
        );

      case "messaging":
        return (
          <SectionCard title="المراسلة مع الإدارة">
            <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 h-100 overflow-y-auto mb-4">
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tr-sm p-4 max-w-[80%] shadow-sm">
                  <h4 className="font-black text-xs text-blue-600 mb-1">الإدارة</h4>
                  <p className="text-sm font-bold text-gray-700 leading-relaxed">
                    مرحباً ولي الأمر، نرجو تأكيد حضوركم لاجتماع يوم السبت القادم.
                  </p>
                  <span className="block text-left mt-2 text-[10px] text-gray-400 font-bold">10:00 ص</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-rose-50 border border-rose-100 rounded-2xl rounded-tl-sm p-4 max-w-[80%] shadow-sm">
                  <h4 className="font-black text-xs text-[#e01c8a] mb-1">أنت</h4>
                  <p className="text-sm font-bold text-rose-900 leading-relaxed">
                    مرحباً، تم التأكيد وسأكون حاضراً بإذن الله. شكراً لكم.
                  </p>
                  <span className="block text-left mt-2 text-[10px] text-rose-300 font-bold">10:15 ص</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="اكتب رسالتك للإدارة..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#e01c8a]/20 font-bold text-sm text-gray-700"
              />
              <button className="bg-[#e01c8a] hover:bg-rose-600 text-white w-12 rounded-xl flex justify-center items-center shadow-md shadow-rose-200 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-180 -ml-1"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
            </div>
          </SectionCard>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'); * { font-family: 'Cairo', sans-serif; }`}</style>
      <div className="flex h-screen bg-[#f4f4f8] overflow-hidden font-cairo" dir="rtl">
        {/* Mobile Overlay */}
        <div
          className={`fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${!sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div 
          className={`relative z-40 h-screen transition-all duration-500 ease-in-out ${sidebarOpen ? "w-65 opacity-100" : "w-0 opacity-0 pointer-events-none"} overflow-hidden shrink-0`}
        >
          <aside
            className="w-65 h-full bg-linear-to-b from-[#e01c8a] via-[#d51881] to-[#b31269] flex flex-col justify-between pt-6 pb-2 shadow-[10px_0_30px_-10px_rgba(224,28,138,0.4)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            <div>
              <div className="flex items-center justify-between px-6 pb-6 mb-2 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                    <span className="text-white font-black text-lg">أ</span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-white font-black text-lg tracking-wide">تسيير</span>
                    <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">ولي الأمر</span>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="group w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 transition-all duration-300 flex items-center justify-center text-white/80 hover:text-white border border-white/10"
                >
                  <div className="group-hover:-translate-x-1 group-hover:scale-110 transition-transform duration-300">
                    {Icons.closeIcon}
                  </div>
                </button>
              </div>

              <nav className="flex flex-col gap-1.5 px-4 mt-4">                
                {navLinks.map((link) => (
                  <NavBtn
                    key={link.page}
                    label={link.label}
                    icon={link.icon}
                    active={currentPage === link.page}
                    onClick={() => setCurrentPage(link.page)}
                  />
                ))}
              </nav>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 px-4">
              <button className="group flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-black w-full text-right transition-all duration-300 text-white/80 hover:bg-rose-500/80 hover:text-white hover:shadow-lg hover:shadow-rose-500/30 border border-transparent hover:border-rose-400 mt-2">
                <div className="flex items-center gap-3">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {Icons.logout}
                  </span>
                  تسجيل الخروج
                </div>
              </button>
            </div>
          </aside>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <header
            className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 md:px-6 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 md:gap-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="group w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-[#e01c8a]/40 hover:bg-rose-50 hover:shadow-md transition-all duration-300 flex items-center justify-center text-gray-500 hover:text-[#e01c8a]"
                >
                  <div className="group-hover:-translate-x-1 group-hover:scale-110 transition-transform duration-300">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/>
                    </svg>
                  </div>
                </button>
              )}
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-black text-[#2d2d5e] tracking-tight">
                  {pageTitles[currentPage]}
                </h1>
                <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-gray-400 mt-1 flex-row-reverse w-fit">
                  <span className="text-gray-300">/</span>
                  <span className="text-[#e01c8a] hover:text-rose-600 transition-colors cursor-pointer">مساحة ولي الأمر</span>
                  <span>{pageTitles[currentPage]}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-5">
              
              {/* Active Child Selector in Header */}
              <div ref={childrenDropdownRef} className="relative hidden sm:block">
                <button 
                  onClick={() => setShowChildrenDropdown(!showChildrenDropdown)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 shadow-sm text-sm font-black ${showChildrenDropdown ? 'bg-rose-50 border-[#e01c8a]/40 text-[#e01c8a] outline-none ring-4 ring-[#e01c8a]/10' : 'bg-white border-gray-200 text-gray-600 hover:border-[#e01c8a]/30 hover:bg-rose-50'}`}
                >
                  <div className="w-6 h-6 bg-[#e01c8a] rounded-full text-white flex items-center justify-center text-xs">
                    {activeChild.name.charAt(0)}
                  </div>
                  {activeChild.name}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${showChildrenDropdown ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                </button>

                {showChildrenDropdown && (
                  <div className="absolute top-full left-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col p-2 gap-1">
                      {childrenList.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => {
                            setActiveChildId(child.id);
                            setShowChildrenDropdown(false);
                          }}
                          className={`flex items-center text-right gap-3 px-3 py-2 rounded-xl transition-colors ${activeChildId === child.id ? 'bg-rose-50 text-[#e01c8a]' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm shrink-0 ${activeChildId === child.id ? 'bg-[#e01c8a]' : 'bg-gray-400'}`}>
                            {child.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-sm">{child.name}</span>
                            <span className="text-[10px] font-bold text-gray-400">{child.grade}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div ref={searchRef} className="relative hidden lg:block">
                <div 
                  className={`flex items-center bg-gray-50/80 border ${showSearch ? 'border-[#e01c8a]/50 ring-4 ring-[#e01c8a]/10 bg-white' : 'border-gray-200'} rounded-full px-4 py-2 hover:bg-white hover:border-[#e01c8a]/30 hover:shadow-sm transition-all duration-300 group`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors ${showSearch ? 'text-[#e01c8a]' : 'text-gray-400 group-hover:text-[#e01c8a]'}`}>
                    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input 
                    type="text" 
                    placeholder="بحث سريع..." 
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

                {showSearch && (
                  <div className="absolute top-full left-0 mt-3 w-full bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-64 overflow-y-auto p-2">
                      {searchResults.length > 0 ? (
                        searchResults.map(([key, title], index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setCurrentPage(key as ParentPageKey);
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
                          لم يتم العثور على نتائج
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div ref={notifRef} className="relative">
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

                {showNotifs && (
                  <div className="absolute top-full -left-15 md:left-0 right-auto mt-3 w-[320px] bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col">
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
                              setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
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

              <div className="hidden md:block w-px h-8 bg-gray-200 rounded-full mx-1"></div>

              <button className="flex items-center gap-3 p-1 pl-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-300 group">
                <div className="w-10 h-10 bg-linear-to-br from-[#e01c8a] to-rose-400 rounded-full flex items-center justify-center shadow-md shadow-rose-200 group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300 border-2 border-white ring-2 ring-transparent group-hover:ring-rose-100 shrink-0">
                  <span className="text-white font-black text-sm">ع</span>
                </div>
                <div className="hidden md:flex flex-col leading-none text-right">
                  <span className="text-[#2d2d5e] font-black text-sm group-hover:text-[#e01c8a] transition-colors">عبد الله</span>
                  <span className="text-gray-400 font-bold text-[10px] uppercase mt-1">ولي أمر</span>
                </div>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f4f4f8]">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
}
