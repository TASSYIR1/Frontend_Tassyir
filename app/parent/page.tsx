"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { readSharedSchedules, SharedScheduleEntry } from "@/lib/sharedSchedule";
import DashboardNavButton from "@/components/DashboardNavButton";

// --- Types ---
type ParentPageKey =
  | "home"
  | "children"
  | "schedule"
  | "attendance"
  | "payments"
  | "announcements"
  | "messages";

type ParentScheduleSession = {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  group: string;
};

type ParentAttendanceRecord = {
  id: string;
  childId: number;
  date: string;
  subject: string;
  status: "حاضر" | "غائب" | "متأخر";
  notes: string;
};

const pageTitles: Record<ParentPageKey, string> = {
  home: "الرئيسية",
  children: "أبنائي",
  schedule: "الجدول الدراسي",
  attendance: "الحضور والغياب",
  payments: "المدفوعات",
  announcements: "الإعلانات",
  messages: "المراسلة",
};

// --- Shared SVGs ---
const Icons: Record<string, ReactNode> = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  children: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  schedule: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  attendance: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>,
  payments: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  announcements: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13z"/><path d="M11 13v6"/></svg>,
  messages: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  closeIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>,
};

const navLinks: { label: string; page: ParentPageKey; icon: ReactNode }[] = [
  { label: "أبنائي",          page: "children",      icon: Icons.children },
  { label: "الجدول الدراسي",  page: "schedule",      icon: Icons.schedule },
  { label: "الحضور والغياب",  page: "attendance",    icon: Icons.attendance },
  { label: "المدفوعات",       page: "payments",      icon: Icons.payments },
  { label: "الإعلانات",       page: "announcements", icon: Icons.announcements },
  { label: "المراسلة",        page: "messages",      icon: Icons.messages },
];

// --- Components ---

function StatCard({ title, value, subtitle, highlight = false, onClick }: { title: string; value: string; subtitle: string, highlight?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer hover:border-rose-200' : ''}`}
    >
      <h3 className="text-gray-500 font-bold text-sm mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-black ${highlight ? 'text-red-600' : 'text-[#2d2d5e]'}`}>{value}</span>
      </div>
      <p className={`text-xs mt-2 font-bold inline-block px-2 py-1 rounded-lg ${highlight ? 'bg-red-50 text-red-700' : 'text-[#e01c8a] bg-rose-50'}`}>
        {subtitle}
      </p>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
      <h3 className="text-[#2d2d5e] font-black text-lg mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-[#e01c8a] rounded-full"></span>
        {title}
      </h3>
      {children}
    </div>
  );
}

// --- Mock Data ---

const childrenData = [
  { id: 1, name: "ياسين", level: "الثانية باكالوريا", subscriptions: 3, group: "AB12" },
  { id: 2, name: "مريم", level: "الجدع المشترك", subscriptions: 2, group: "CD14" },
];

export default function ParentDashboardCoursSup() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<ParentPageKey>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState<number>(1);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState("2026-03-12");
  const [selectedScheduleSession, setSelectedScheduleSession] = useState<ParentScheduleSession | null>(null);
  const [toastMessage, setToastMessage] = useState<{message: string, type: 'success'|'error'|'info'} | null>(null);
  const [sharedSchedules, setSharedSchedules] = useState<SharedScheduleEntry[]>(() => readSharedSchedules());

  const showToast = (message: string, type: 'success'|'error'|'info' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    showToast("جاري تسجيل الخروج...", "info");
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  const selectedChild = childrenData.find(c => c.id === selectedChildId) || childrenData[0];

  // Header Handlers
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const syncSharedSchedules = () => setSharedSchedules(readSharedSchedules());
    window.addEventListener("storage", syncSharedSchedules);
    return () => window.removeEventListener("storage", syncSharedSchedules);
  }, []);

  const searchResults = Object.entries(pageTitles).filter(([key, title]) =>
    title.includes(searchQuery) || key.includes(searchQuery.toLowerCase())
  );

  const [notifications, setNotifications] = useState([
    { id: 1, title: `تذكير بموعد حصة الرياضيات ل${selectedChild.name}`, time: "منذ 5 دقائق", read: false },
    { id: 2, title: "فاتورة شهر مارس بانتظار الدفع", time: "منذ ساعتين", read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));

  const dayOrder = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  const baseParentSessions: ParentScheduleSession[] = [
    { id: "P-S1", day: "الإثنين", time: "18:30 - 20:00 م", subject: "الرياضيات", teacher: "أ. أحمد", room: "قاعة 203", group: selectedChild.group },
    { id: "P-S2", day: "الأربعاء", time: "18:30 - 20:00 م", subject: "الفيزياء", teacher: "أ. سارة", room: "قاعة 107", group: selectedChild.group },
  ];
  const adminParentSessions: ParentScheduleSession[] = sharedSchedules
    .filter((item) => item.targetType === "group" && item.targetValue === selectedChild.group)
    .map((item, index) => ({
      id: `P-SA-${index}`,
      day: item.day,
      time: item.time,
      subject: item.subject,
      teacher: item.teacher,
      room: item.room,
      group: item.group,
    }));
  const parentScheduleSessions = [...baseParentSessions, ...adminParentSessions];
  const parentScheduleByDay = dayOrder.reduce<Record<string, ParentScheduleSession[]>>((acc, day) => {
    acc[day] = parentScheduleSessions.filter((session) => session.day === day);
    return acc;
  }, {});

  const attendanceRecords: ParentAttendanceRecord[] = [
    { id: "PA-1", childId: 1, date: "2026-03-12", subject: "الرياضيات", status: "حاضر", notes: "-" },
    { id: "PA-2", childId: 1, date: "2026-03-12", subject: "الفيزياء", status: "غائب", notes: "تم إشعار الإدارة" },
    { id: "PA-3", childId: 1, date: "2026-03-11", subject: "العلوم", status: "متأخر", notes: "تأخير 10 دقائق" },
    { id: "PA-4", childId: 2, date: "2026-03-12", subject: "الفرنسية", status: "حاضر", notes: "-" },
    { id: "PA-5", childId: 2, date: "2026-03-11", subject: "الرياضيات", status: "غائب", notes: "تقرير إداري" },
  ];
  const filteredParentAttendance = attendanceRecords.filter(
    (row) => row.childId === selectedChild.id && row.date === selectedAttendanceDate,
  );
  const presentCount = filteredParentAttendance.filter((row) => row.status === "حاضر").length;
  const absentCount = filteredParentAttendance.filter((row) => row.status === "غائب").length;
  const lateCount = filteredParentAttendance.filter((row) => row.status === "متأخر").length;

  const content = (() => {
    switch (currentPage) {
      case "home":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="الأبناء المسجلين" value={childrenData.length.toString()} subtitle="إدارة ملفات الأبناء" onClick={() => setCurrentPage('children')} />
              <StatCard title="اشتراكات غير مدفوعة" value="1" subtitle="يرجى مراجعة المدفوعات" highlight={true} onClick={() => setCurrentPage('payments')} />
              <StatCard title="الإعلانات غير المقروءة" value={unreadCount.toString()} subtitle="إشعارات المدرسة" onClick={() => setCurrentPage('announcements')} />
              <StatCard title="حصص اليوم" value="2" subtitle={`تخص ${selectedChild.name}`} onClick={() => setCurrentPage('schedule')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionCard title={`جدول اليوم - ${selectedChild.name}`}>
                <div className="flex flex-col gap-3">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between hover:border-[#e01c8a]/30 transition-colors">
                    <div>
                      <h4 className="font-black text-[#2d2d5e] text-sm">الرياضيات (حصص دعم)</h4>
                      <p className="text-xs text-gray-500 font-bold mt-1">أ. أحمد • قاعة 203</p>
                    </div>
                    <div className="bg-[#e01c8a]/10 text-[#e01c8a] px-3 py-1.5 rounded-xl text-sm font-black text-left">
                      18:30 م
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between hover:border-[#e01c8a]/30 transition-colors">
                    <div>
                      <h4 className="font-black text-[#2d2d5e] text-sm">الفيزياء (حصص دعم)</h4>
                      <p className="text-xs text-gray-500 font-bold mt-1">أ. سارة • قاعة 107</p>
                    </div>
                    <div className="bg-[#e01c8a]/10 text-[#e01c8a] px-3 py-1.5 rounded-xl text-sm font-black text-left">
                      20:00 م
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="أحدث الإعلانات">
                <div className="flex flex-col gap-3">
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-4 hover:bg-rose-100/50 transition-colors cursor-pointer" onClick={() => showToast("عرض تفاصيل الإعلان...", "info")}>
                    <div className="w-2 h-2 mt-1.5 bg-[#e01c8a] rounded-full shadow-[0_0_8px_rgba(224,28,138,0.5)]"></div>
                    <div>
                      <h4 className="font-black text-rose-900 text-sm">توقف استثنائي</h4>
                      <p className="text-xs text-rose-700 font-bold mt-1">لا توجد حصص دعم يوم الجمعة مساءً.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-4 hover:bg-blue-100/50 transition-colors cursor-pointer" onClick={() => showToast("عرض تفاصيل الإعلان...", "info")}>
                    <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full"></div>
                    <div>
                      <h4 className="font-black text-blue-900 text-sm">تذكير بالأداء</h4>
                      <p className="text-xs text-blue-700 font-bold mt-1">المرجو تسوية اشتراكات الشهر الجاري.</p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        );
        
      case "children":
        return (
          <SectionCard title="إدارة ملفات الأبناء">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {childrenData.map((child) => (
                <div 
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`border rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-sm
                    ${selectedChildId === child.id 
                      ? 'border-[#e01c8a] bg-rose-50/30 shadow-md ring-2 ring-[#e01c8a]/20' 
                      : 'border-gray-200 bg-white hover:border-[#e01c8a]/50 hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black shadow-inner
                        ${selectedChildId === child.id ? 'bg-[#e01c8a] text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {child.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-[#2d2d5e] text-lg">{child.name}</h4>
                        <p className="text-sm text-gray-500 font-bold mt-1">{child.level}</p>
                      </div>
                    </div>
                    {selectedChildId === child.id && (
                      <span className="bg-rose-100 text-[#e01c8a] font-black px-3 py-1 rounded-lg text-xs border border-rose-200">
                        الابن النشط
                      </span>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-600 text-sm">عدد الاشتراكات النشطة:</span>
                    <span className="font-black text-lg text-[#2d2d5e]">{child.subscriptions} اشتراكات</span>
                  </div>
                  
                    {selectedChildId !== child.id && (
                      <button onClick={() => setSelectedChildId(child.id)} className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                        عرض بيانات هذا الابن
                      </button>
                    )}
                </div>
              ))}
            </div>
          </SectionCard>
        );

      case "schedule":
        return (
          <SectionCard title={`الجدول الدراسي - ${selectedChild.name}`}>
            <div className="space-y-6">
              {dayOrder.map((day) => {
                const sessions = parentScheduleByDay[day] ?? [];
                return (
                  <div key={day} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-lg font-black text-[#2d2d5e]">{day}</h4>
                      <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-[#e01c8a]">
                        {sessions.length} حصص
                      </span>
                    </div>

                    {sessions.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-center text-sm font-bold text-gray-400">
                        لا توجد حصص مبرمجة لهذا اليوم
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {sessions.map((session) => (
                          <button
                            key={session.id}
                            type="button"
                            onClick={() => setSelectedScheduleSession(session)}
                            className="rounded-xl border border-gray-200 bg-white p-4 text-right transition-all hover:-translate-y-0.5 hover:border-[#e01c8a]/40 hover:shadow-md"
                          >
                            <p className="text-sm font-bold text-gray-400">{session.time}</p>
                            <p className="mt-1 text-base font-black text-[#2d2d5e]">{session.subject}</p>
                            <p className="mt-2 text-sm font-bold text-gray-600">{session.teacher}</p>
                            <p className="text-xs font-bold text-gray-400">{session.room}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>
        );

      case "attendance":
        return (
          <SectionCard title={`سجل الحضور والغياب - ${selectedChild.name}`}>
             <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
               <div>
                 <label className="mb-1 block text-xs font-bold text-gray-500">اختر اليوم</label>
                 <input
                   type="date"
                   value={selectedAttendanceDate}
                   onChange={(e) => setSelectedAttendanceDate(e.target.value)}
                   className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-[#2d2d5e] focus:border-[#e01c8a]/40 focus:outline-none"
                 />
               </div>
               <p className="text-xs font-bold text-gray-400">عرض الحضور لهذا اليوم فقط</p>
             </div>

             <div className="flex gap-4 mb-6">
               <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-xl flex-1 flex justify-between items-center">
                 <span className="font-bold text-green-800 text-sm">حضور</span>
                 <span className="font-black text-green-600 text-xl">{presentCount}</span>
               </div>
               <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-xl flex-1 flex justify-between items-center">
                 <span className="font-bold text-red-800 text-sm">غياب</span>
                 <span className="font-black text-red-600 text-xl">{absentCount}</span>
               </div>
               <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl flex-1 flex justify-between items-center">
                 <span className="font-bold text-amber-800 text-sm">تأخير</span>
                 <span className="font-black text-amber-500 text-xl">{lateCount}</span>
               </div>
             </div>

             <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
               <table className="w-full text-right border-collapse">
                 <thead>
                   <tr className="border-b-2 border-gray-100">
                     <th className="py-4 px-4 font-black text-gray-400 text-sm">التاريخ</th>
                     <th className="py-4 px-4 font-black text-gray-400 text-sm">المادة</th>
                     <th className="py-4 px-4 font-black text-gray-400 text-sm">الحالة</th>
                     <th className="py-4 px-4 font-black text-gray-400 text-sm">ملاحظات المعلم</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredParentAttendance.length === 0 ? (
                     <tr>
                       <td colSpan={4} className="px-4 py-8 text-center text-sm font-bold text-gray-400">
                         لا توجد بيانات حضور لهذا اليوم
                       </td>
                     </tr>
                   ) : (
                     filteredParentAttendance.map((row) => (
                       <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                         <td className="py-4 px-4 font-bold text-[#2d2d5e] text-sm">{row.date}</td>
                         <td className="py-4 px-4 font-bold text-gray-600 text-sm">{row.subject}</td>
                         <td className="py-4 px-4">
                           <span
                             className={`font-bold px-3 py-1 rounded-lg text-xs ${
                               row.status === "حاضر"
                                 ? "bg-green-100 text-green-700"
                                 : row.status === "غائب"
                                   ? "bg-red-100 text-red-700"
                                   : "bg-amber-100 text-amber-700"
                             }`}
                           >
                             {row.status}
                           </span>
                         </td>
                         <td className="py-4 px-4 text-sm font-bold text-gray-500">{row.notes}</td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>
          </SectionCard>
        );

      case "payments":
        return (
          <SectionCard title="سجل المدفوعات (اشتراكات الدعم)">
            <p className="text-gray-500 text-sm mb-6 font-medium">ملاحظة: يمكنك الاطلاع على حالة الأداء لكل اشتراك. يرجى تسوية أي مستحقات لدى الإدارة.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-2xl p-5 hover:border-[#e01c8a]/30 transition-all shadow-sm bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-[#2d2d5e] text-lg">الرياضيات - أ. أحمد</h4>
                    <p className="text-sm text-gray-500 font-bold mt-1">اشتراك شهر مارس ({selectedChild.name})</p>
                  </div>
                  <span className="bg-green-100 text-green-700 font-black px-3 py-1.5 rounded-lg text-xs border border-green-200">
                    مدفوع بالكامل
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-black text-lg text-[#2d2d5e]">350 درهم</span>
                </div>
              </div>

              <div className="border border-red-200 bg-red-50/30 rounded-2xl p-5 hover:border-red-300 transition-all shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-[#2d2d5e] text-lg">الفيزياء - أ. سارة</h4>
                    <p className="text-sm text-gray-500 font-bold mt-1">اشتراك شهر مارس ({selectedChild.name})</p>
                  </div>
                  <span className="bg-red-100 text-red-700 font-black px-3 py-1.5 rounded-lg text-xs border border-red-200">
                    غير مدفوع
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-black text-lg text-[#2d2d5e]">350 درهم</span>
                </div>
              </div>
            </div>
          </SectionCard>
        );

      case "announcements":
        return (
          <SectionCard title="الإعلانات والمستجدات">
            <div className="flex flex-col gap-4">
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#e01c8a]/30 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">الإدارة المركزية</span>
                  <span className="text-xs text-gray-400 font-bold">اليوم الساعة 10:00 ص</span>
                </div>
                <h4 className="font-black text-[#2d2d5e] text-base mb-2">تسجيلات مكثفة للامتحانات الوطنية</h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  السادة الآباء، نعلمكم عن فتح باب التسجيل لفوج خاص بالامتحانات الوطنية لشهر يونيو. المقاعد محدودة.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#e01c8a]/30 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">أستاذ أحمد (رياضيات)</span>
                  <span className="text-xs text-gray-400 font-bold">أمس الساعة 18:00 م</span>
                </div>
                <h4 className="font-black text-[#2d2d5e] text-base mb-2">حصص إضافية مجانية</h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  سيتم إجراء حصة مراجعة شاملة للوحدة الثانية يوم الأحد صباحاً لجميع المشتركين.
                </p>
              </div>
            </div>
          </SectionCard>
        );

      case "messages":
        return (
          <div className="h-[600px] flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             {/* Messaging Header */}
             <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-[#e01c8a]/10 rounded-full flex items-center justify-center text-[#e01c8a]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                   </div>
                   <div>
                      <h3 className="font-black text-[#2d2d5e]">الإدارة المركزية</h3>
                      <p className="text-xs text-gray-500 font-bold">متاح للرد أثناء أوقات العمل</p>
                   </div>
                </div>
             </div>
             
             {/* Chat Thread */}
             <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-gray-50/30">
                <div className="self-end max-w-sm">
                   <div className="bg-[#e01c8a] text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm">
                      السلام عليكم، أود الاستفسار عن إمكانية إضافة حصة علوم فيزيائية لابني ياسين ضمن اشتراكات هذا الشهر.
                   </div>
                   <p className="text-[10px] text-gray-400 mt-1 text-right">أمس, 14:30</p>
                </div>
                
                <div className="self-start max-w-sm">
                   <div className="bg-white border border-gray-200 text-gray-700 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm">
                      وعليكم السلام، نعم يمكن ذلك. يرجى تأكيد الرغبة حتى يتم إضافته لجدول الأستاذة سارة، وتبلغ التكلفة 350 درهم تضاف لاشتراك الشهر القادم.
                   </div>
                   <p className="text-[10px] text-gray-400 mt-1 text-left">أمس, 15:45</p>
                </div>
             </div>
             
             {/* Input Area */}
             <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                <input 
                   type="text" 
                   placeholder="اكتب رسالتك للإدارة هنا..." 
                   className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-2 focus:ring-[#e01c8a]/10 transition-all text-gray-700" 
                />
                <button onClick={() => showToast("جاري إرسال الرسالة...", "success")} className="w-12 h-12 bg-[#e01c8a] hover:bg-rose-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm shrink-0">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="-ml-1"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
             </div>
          </div>
        );

      default:
        return null;
    }
  })();

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
          <div className={`px-6 py-3 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 ${
            toastMessage.type === 'success' ? 'bg-green-500 text-white' : 
            toastMessage.type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
          }`}>
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

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
                    <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">ولي أمر</span>
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
                <DashboardNavButton
                  label="الرئيسية"
                  icon={Icons.home}
                  active={currentPage === "home"}
                  onClick={() => setCurrentPage("home")}
                />
                
                {navLinks.map((link) => (
                  <DashboardNavButton
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
              <button 
                onClick={handleLogout}
                className="group flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-black w-full text-right transition-all duration-300 text-white/80 hover:bg-rose-500/80 hover:text-white hover:shadow-lg hover:shadow-rose-500/30 border border-transparent hover:border-rose-400 mt-2"
              >
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
                  <span className="text-white font-black text-sm">أ</span>
                </div>
                <div className="hidden md:flex flex-col leading-none text-right">
                  <span className="text-[#2d2d5e] font-black text-sm group-hover:text-[#e01c8a] transition-colors">أحمد</span>
                  <span className="text-gray-400 font-bold text-[10px] uppercase mt-1">ولي أمر</span>
                </div>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f4f4f8]">
            {content}
          </main>
        </div>
      </div>

      {selectedScheduleSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black text-[#2d2d5e]">{selectedScheduleSession.subject}</h3>
                <p className="text-sm font-bold text-gray-500">{selectedScheduleSession.day}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScheduleSession(null)}
                className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-bold text-gray-500 hover:bg-gray-50"
              >
                إغلاق
              </button>
            </div>

            <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-bold text-gray-700">
                <span className="text-gray-500">الوقت: </span>
                {selectedScheduleSession.time}
              </p>
              <p className="text-sm font-bold text-gray-700">
                <span className="text-gray-500">الأستاذ: </span>
                {selectedScheduleSession.teacher}
              </p>
              <p className="text-sm font-bold text-gray-700">
                <span className="text-gray-500">القاعة: </span>
                {selectedScheduleSession.room}
              </p>
              <p className="text-sm font-bold text-gray-700">
                <span className="text-gray-500">المجموعة: </span>
                {selectedScheduleSession.group}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}