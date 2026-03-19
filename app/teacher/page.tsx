"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { readSharedSchedules, SharedScheduleEntry } from "@/lib/sharedSchedule";
import DashboardNavButton from "@/components/DashboardNavButton";

// --- Types ---
type TeacherPageKey =
  | "home"
  | "schedule"
  | "classes"
  | "attendance"
  | "files"
  | "announcements"
  | "messaging";

type ScheduleSession = {
  id: string;
  day: string;
  time: string;
  subject: string;
  group: string;
  room: string;
  teacher: string;
};

const pageTitles: Record<TeacherPageKey, string> = {
  home: "الرئيسية",
  schedule: "الجدول الدراسي",
  classes: "فصولي ومجموعاتي",
  attendance: "الحضور والغياب",
  files: "الملفات",
  announcements: "الإعلانات",
  messaging: "المراسلة",
};

// --- Shared SVGs (Matched exactly with admin) ---
const Icons: Record<string, ReactNode> = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  schedule: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  classes: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  attendance: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>,
  files: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  announcements: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13z"/><path d="M11 13v6"/></svg>,
  messaging: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  closeIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>,
};

const navLinks: { label: string; page: TeacherPageKey; icon: ReactNode }[] = [
  { label: "الجدول الدراسي",    page: "schedule",      icon: Icons.schedule },
  { label: "فصولي ومجموعاتي", page: "classes",       icon: Icons.classes },
  { label: "الحضور والغياب",  page: "attendance",    icon: Icons.attendance },
  { label: "الملفات",         page: "files",         icon: Icons.files },
  { label: "الإعلانات",       page: "announcements", icon: Icons.announcements },
  { label: "المراسلة",        page: "messaging",     icon: Icons.messaging },
];

// --- Components ---

function StatCard({ 
  title, 
  value, 
  subtitle,
  onClick 
}: { 
  title: string; 
  value: string; 
  subtitle: string;
  onClick?: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer hover:border-rose-200' : ''}`}
    >
      <h3 className="text-gray-500 font-bold text-sm mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-[#2d2d5e]">{value}</span>
      </div>
      <p className="text-[#e01c8a] text-xs mt-2 font-bold bg-rose-50 inline-block px-2 py-1 rounded-lg">
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

// --- Main Page ---

export default function TeacherDashboard() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<TeacherPageKey>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState<{message: string, type: 'success'|'error'|'info'} | null>(null);

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

  const searchResults = Object.entries(pageTitles).filter(([key, title]) =>
    title.includes(searchQuery) || key.includes(searchQuery.toLowerCase())
  );

  const [notifications, setNotifications] = useState([
    { id: 1, title: "تم رفع مستوى طالب جديد", time: "منذ 5 دقائق", read: false },
    { id: 2, title: "إشعار من الإدارة بخصوص الجدول", time: "منذ ساعتين", read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));

  const teacherName = "محمد أحمد";
  const [sharedSchedules, setSharedSchedules] = useState<SharedScheduleEntry[]>(() => readSharedSchedules());
  const [attendanceDate, setAttendanceDate] = useState("2026-03-19");
  const [attendanceGroup, setAttendanceGroup] = useState("5A");
  const [selectedScheduleSession, setSelectedScheduleSession] = useState<ScheduleSession | null>(null);
  const [attendanceRows, setAttendanceRows] = useState([
    { id: 1, name: "أحمد بن محمد", group: "5A", date: "2026-03-19", status: "present" as "present" | "absent" | "late" },
    { id: 2, name: "سارة محمود", group: "5A", date: "2026-03-19", status: "absent" as "present" | "absent" | "late" },
    { id: 3, name: "يوسف خليل", group: "5A", date: "2026-03-19", status: "late" as "present" | "absent" | "late" },
    { id: 4, name: "مريم العلوي", group: "4B", date: "2026-03-19", status: "present" as "present" | "absent" | "late" },
    { id: 5, name: "خالد أمين", group: "4B", date: "2026-03-19", status: "present" as "present" | "absent" | "late" },
  ]);

  useEffect(() => {
    const syncSharedSchedules = () => setSharedSchedules(readSharedSchedules());
    window.addEventListener("storage", syncSharedSchedules);
    return () => window.removeEventListener("storage", syncSharedSchedules);
  }, []);

  const teacherScheduleRows = sharedSchedules
    .filter((item) => item.targetType === "teacher" && item.targetValue === teacherName)
    .map((item) => ({
      day: item.day,
      time: item.time,
      subject: item.subject,
      group: item.group,
      room: item.room,
    }));

  const baseTeacherScheduleRows = [
    { day: "الإثنين", time: "08:30 ص", subject: "الرياضيات", group: "5A", room: "203" },
    { day: "الثلاثاء", time: "10:15 ص", subject: "الفيزياء", group: "4B", room: "107" },
  ];

  const mergedTeacherScheduleRows = [...baseTeacherScheduleRows, ...teacherScheduleRows];

  const dayOrder = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  const teacherScheduleSessions: ScheduleSession[] = mergedTeacherScheduleRows.map((row, index) => ({
    id: `T-${index}`,
    day: row.day,
    time: row.time,
    subject: row.subject,
    group: row.group,
    room: row.room,
    teacher: teacherName,
  }));

  const teacherScheduleByDay = dayOrder.reduce<Record<string, ScheduleSession[]>>((acc, day) => {
    acc[day] = teacherScheduleSessions.filter((session) => session.day === day);
    return acc;
  }, {});

  const visibleAttendanceRows = attendanceRows.filter(
    (student) => student.group === attendanceGroup && student.date === attendanceDate,
  );

  const updateAttendanceStatus = (
    studentId: number,
    nextStatus: "present" | "absent" | "late",
  ) => {
    setAttendanceRows((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status: nextStatus } : student,
      ),
    );
  };

  const content = (() => {
    switch (currentPage) {
      case "home":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="حصص اليوم" value="4" subtitle="٢ صباحي، ٢ مسائي" onClick={() => setCurrentPage('schedule')} />
              <StatCard title="الحصص القادمة" value="3" subtitle="خلال ٢٤ ساعة القادمة" onClick={() => setCurrentPage('schedule')} />
              <StatCard title="الإعلانات الأسبوعية" value="5" subtitle="٢ جديد هذا الأسبوع" onClick={() => setCurrentPage('announcements')} />
              <StatCard title="الإشعارات الحديثة" value="7" subtitle={`${unreadCount} غير مقروءة`} onClick={() => setShowNotifs(true)} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionCard title="الحصص القادمة">
                <div className="flex flex-col gap-3">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between hover:border-[#e01c8a]/30 transition-colors">
                    <div>
                      <h4 className="font-black text-[#2d2d5e] text-sm">الرياضيات</h4>
                      <p className="text-xs text-gray-500 font-bold mt-1">الفصل 5A • القاعة 203</p>
                    </div>
                    <div className="bg-[#e01c8a]/10 text-[#e01c8a] px-3 py-1.5 rounded-xl text-sm font-black text-left">
                      08:30 ص
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between hover:border-[#e01c8a]/30 transition-colors">
                    <div>
                      <h4 className="font-black text-[#2d2d5e] text-sm">الفيزياء</h4>
                      <p className="text-xs text-gray-500 font-bold mt-1">الفصل 4B • القاعة 107</p>
                    </div>
                    <div className="bg-[#e01c8a]/10 text-[#e01c8a] px-3 py-1.5 rounded-xl text-sm font-black text-left">
                      10:15 ص
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="آخر الإعلانات والإشعارات">
                <div className="flex flex-col gap-3">
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-4 hover:bg-rose-100/50 transition-colors">
                    <div className="w-2 h-2 mt-1.5 bg-[#e01c8a] rounded-full shadow-[0_0_8px_rgba(224,28,138,0.5)]"></div>
                    <div>
                      <h4 className="font-black text-rose-900 text-sm">تذكير</h4>
                      <p className="text-xs text-rose-700 font-bold mt-1">اجتماع تربوي يوم الخميس الساعة ٣ عصراً.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-4 hover:bg-blue-100/50 transition-colors">
                    <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full"></div>
                    <div>
                      <h4 className="font-black text-blue-900 text-sm">مستندات جديدة</h4>
                      <p className="text-xs text-blue-700 font-bold mt-1">تم توفير ملفات داعمة للفصل 5A.</p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        );

      case "schedule":
        return (
          <SectionCard title="التقويم الأسبوعي (نفس نمط لوحة الإدارة)">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {dayOrder.map((day) => (
                <div key={day} className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-black text-[#2d2d5e] text-sm">{day}</h4>
                    <span className="bg-white border border-gray-200 text-gray-500 text-xs font-bold px-2 py-1 rounded-lg">
                      {teacherScheduleByDay[day].length} حصة
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {teacherScheduleByDay[day].length === 0 && (
                      <div className="border border-dashed border-gray-200 rounded-xl px-3 py-4 text-center text-xs font-bold text-gray-400 bg-white">
                        لا توجد حصص
                      </div>
                    )}

                    {teacherScheduleByDay[day].map((session) => (
                      <button
                        key={session.id}
                        onClick={() => setSelectedScheduleSession(session)}
                        className="w-full text-right bg-white border border-gray-200 hover:border-[#e01c8a]/40 rounded-xl p-3 transition-all hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[#2d2d5e] font-black text-sm">{session.subject}</span>
                          <span className="text-[#e01c8a] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md text-[10px] font-black">{session.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 font-bold">{session.group} • {session.room}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        );

      case "classes":
        return (
          <SectionCard title="قائمة الفصول والمجموعات">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-[#e01c8a]/30 transition-all flex justify-between items-center">
                <div>
                  <h4 className="font-black text-[#2d2d5e] text-lg mb-2">الفصل 5A</h4>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#e01c8a]"></span>
                      <span className="text-xs text-gray-500 font-bold">الطلاب: ٢٨</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-xs text-gray-500 font-bold">المواد: رياضيات، علوم</span>
                    </div>
                  </div>
                </div>
                <button className="bg-white text-[#e01c8a] border border-gray-200 w-10 h-10 rounded-xl flex justify-center items-center hover:bg-rose-50 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-[#e01c8a]/30 transition-all flex justify-between items-center">
                <div>
                  <h4 className="font-black text-[#2d2d5e] text-lg mb-2">الفصل 4B</h4>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#e01c8a]"></span>
                      <span className="text-xs text-gray-500 font-bold">الطلاب: ٢٥</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-xs text-gray-500 font-bold">المواد: فيزياء</span>
                    </div>
                  </div>
                </div>
                <button className="bg-white text-[#e01c8a] border border-gray-200 w-10 h-10 rounded-xl flex justify-center items-center hover:bg-rose-50 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </SectionCard>
        );

      case "attendance":
        return (
          <SectionCard title="تسجيل الحضور والغياب (حسب الحصة)">
            <div className="mb-5 flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 font-bold focus:outline-none focus:border-[#e01c8a]/50"
              />
              <select
                value={attendanceGroup}
                onChange={(e) => setAttendanceGroup(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 font-bold focus:outline-none focus:border-[#e01c8a]/50"
              >
                <option value="5A">الفوج 5A</option>
                <option value="4B">الفوج 4B</option>
              </select>
              <div className="bg-rose-50 border border-rose-100 text-[#e01c8a] text-xs font-black px-3 py-2 rounded-xl flex items-center">
                التسجيل حسب اليوم والفوج
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="py-4 px-4 font-black text-gray-400 text-sm">اسم الطالب</th>
                    <th className="py-4 px-4 font-black text-gray-400 text-sm text-center">حاضر</th>
                    <th className="py-4 px-4 font-black text-gray-400 text-sm text-center">غائب</th>
                    <th className="py-4 px-4 font-black text-gray-400 text-sm text-center">متأخر</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleAttendanceRows.map((student) => (
                    <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-[#2d2d5e] text-sm">{student.name}</td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="radio"
                          name={`student-${student.id}`}
                          className="w-4 h-4 text-green-500"
                          checked={student.status === "present"}
                          onChange={() => updateAttendanceStatus(student.id, "present")}
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="radio"
                          name={`student-${student.id}`}
                          className="w-4 h-4 text-red-500"
                          checked={student.status === "absent"}
                          onChange={() => updateAttendanceStatus(student.id, "absent")}
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="radio"
                          name={`student-${student.id}`}
                          className="w-4 h-4 text-amber-500"
                          checked={student.status === "late"}
                          onChange={() => updateAttendanceStatus(student.id, "late")}
                        />
                      </td>
                    </tr>
                  ))}
                  {visibleAttendanceRows.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm font-bold text-gray-400">
                        لا توجد بيانات حضور لهذا اليوم وهذا الفوج.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => showToast("تم حفظ التعديلات...", "success")} className="bg-[#e01c8a] hover:bg-rose-600 text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-md shadow-rose-200 transition-colors">
                حفظ التعديلات
              </button>
            </div>
          </SectionCard>
        );

      case "files":
        return (
          <SectionCard title="رفع الملفات (للفصل أو الحصة)">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-rose-50 hover:border-rose-300 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#e01c8a] shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <span className="font-black text-lg">PDF</span>
                </div>
                <h4 className="font-black text-[#2d2d5e] text-sm mb-1">ملفات PDF</h4>
                <p className="text-xs text-gray-500 font-bold">دروس، ملخصات</p>
              </div>

              <div className="border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <span className="font-black text-lg">W</span>
                </div>
                <h4 className="font-black text-[#2d2d5e] text-sm mb-1">ملفات Word</h4>
                <p className="text-xs text-gray-500 font-bold">تمارين، واجبات</p>
              </div>

              <div className="border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-amber-50 hover:border-amber-300 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-amber-500 shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <h4 className="font-black text-[#2d2d5e] text-sm mb-1">صور</h4>
                <p className="text-xs text-gray-500 font-bold">مخططات، رسومات</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row gap-4">
               <select className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#e01c8a]/20 font-bold text-sm text-gray-600">
                 <option>اختر الفصل / المجموعة</option>
                 <option>الفصل 5A</option>
                 <option>الفصل 4B</option>
               </select>
               <button onClick={() => showToast("جاري تأكيد الرفع...", "info")} className="bg-[#2d2d5e] hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-colors w-full sm:w-auto">
                 تأكيد الرفع
               </button>
            </div>
          </SectionCard>
        );

      case "announcements":
        return (
          <SectionCard title="إنشاء الإعلانات">
            <div className="flex flex-col gap-4 max-w-2xl">
              <div>
                <label className="block text-sm font-black text-[#2d2d5e] mb-2">إلى :</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100">
                    <input type="checkbox" className="w-4 h-4 accent-[#e01c8a]" defaultChecked />
                    <span className="font-bold text-sm text-gray-600">الفصول</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100">
                    <input type="checkbox" className="w-4 h-4 accent-[#e01c8a]" />
                    <span className="font-bold text-sm text-gray-600">المجموعات</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-[#2d2d5e] mb-2">محتوى الإعلان:</label>
                <textarea 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#e01c8a]/20 font-bold text-sm text-gray-700 min-h-[120px]"
                  placeholder="اكتب رسالتك للإعلان للطلاب أو المجموعات..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button onClick={() => showToast("تم نشر الإعلان بنجاح...", "success")} className="bg-[#e01c8a] hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-black text-sm shadow-md shadow-rose-200 transition-colors">
                  نشر الإعلان
                </button>
              </div>
            </div>
          </SectionCard>
        );

      case "messaging":
        return (
          <SectionCard title="المراسلة الداخلية (الإدارة والسكرتارية)">
            <div className="flex bg-gray-100 p-1 rounded-xl mb-4 w-fit">
               <button onClick={() => showToast("تبديل إلى المراسلة مع السكرتارية...", "info")} className="px-6 py-2 text-sm font-bold bg-white text-[#e01c8a] rounded-lg shadow-sm">تواصل مع السكرتارية</button>
               <button onClick={() => showToast("تبديل إلى المراسلة مع الإدارة...", "info")} className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">تواصل مع الإدارة</button>
            </div>
            
            <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 h-[400px] overflow-y-auto mb-4">
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tr-sm p-4 max-w-[80%] shadow-sm">
                  <h4 className="font-black text-xs text-blue-600 mb-1">السكرتارية</h4>
                  <p className="text-sm font-bold text-gray-700 leading-relaxed">
                    أستاذي، هل يمكنك تأكيد القاعة التي ستشغلها لدرس الدعم يوم الأحد؟
                  </p>
                  <span className="block text-left mt-2 text-[10px] text-gray-400 font-bold">10:00 ص</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-rose-50 border border-rose-100 rounded-2xl rounded-tl-sm p-4 max-w-[80%] shadow-sm">
                  <h4 className="font-black text-xs text-[#e01c8a] mb-1">أنت</h4>
                  <p className="text-sm font-bold text-rose-900 leading-relaxed">
                    نعم، تم حجز القاعة 107 كما هو متفق عليه.
                  </p>
                  <span className="block text-left mt-2 text-[10px] text-rose-300 font-bold">10:15 ص</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="اكتب رسالتك..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#e01c8a]/20 font-bold text-sm text-gray-700"
              />
              <button onClick={() => showToast("جاري إرسال الرسالة...", "success")} className="bg-[#e01c8a] hover:bg-rose-600 text-white w-12 rounded-xl flex justify-center items-center shadow-md shadow-rose-200 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-180 -ml-1"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
            </div>
          </SectionCard>
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
      
      <div className="flex h-screen bg-[#f4f4f8] overflow-hidden" dir="rtl">
        {/* Mobile Overlay */}
        <div
          className={`fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${!sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div 
          className={`relative z-40 h-screen transition-all duration-500 ease-in-out ${sidebarOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 pointer-events-none"} overflow-hidden shrink-0`}
        >
          <aside
            className="w-[260px] h-full bg-linear-to-b from-[#e01c8a] via-[#d51881] to-[#b31269] flex flex-col justify-between pt-6 pb-2 shadow-[10px_0_30px_-10px_rgba(224,28,138,0.4)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full font-cairo"
          >
            <div>
              <div className="flex items-center justify-between px-6 pb-6 mb-2 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                    <span className="text-white font-black text-lg">ت</span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-white font-black text-lg tracking-wide">تمكين</span>
                    <span className="text-white/60 text-[10px] font-bold tracking-widest">المعلم</span>
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
                  label="نظرة عامة"
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
                  <span className="group-hover:-translate-x-1 transition-transform duration-300">
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
            className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 md:px-6 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-20 transition-all duration-300 font-cairo"
          >
            <div className="flex items-center gap-3 md:gap-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="group w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-[#e01c8a]/40 hover:bg-rose-50 hover:shadow-md transition-all duration-300 flex items-center justify-center text-gray-500 hover:text-[#e01c8a]"
                >
                  <div className="group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300">
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
                  <span className="text-[#e01c8a] hover:text-rose-600 transition-colors cursor-pointer">لوحة المعلم</span>
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

                {showSearch && (
                  <div className="absolute top-full left-0 mt-3 w-full bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-64 overflow-y-auto p-2">
                      {searchResults.length > 0 ? (
                        searchResults.map(([key, title], index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setCurrentPage(key as TeacherPageKey);
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

                {showNotifs && (
                  <div className="absolute top-full left-[-60px] md:left-0 right-auto mt-3 w-[320px] bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col">
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

              <div className="hidden md:block w-px h-8 bg-gray-200 rounded-full mx-1"></div>

              <button className="flex items-center gap-3 p-1 pl-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-br from-[#e01c8a] to-rose-400 rounded-full flex items-center justify-center shadow-md shadow-rose-200 group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300 border-2 border-white ring-2 ring-transparent group-hover:ring-rose-100 flex-shrink-0">
                  <span className="text-white font-black text-sm">م</span>
                </div>
                <div className="hidden md:flex flex-col leading-none text-right">
                  <span className="text-[#2d2d5e] font-black text-sm group-hover:text-[#e01c8a] transition-colors">محمد أحمد</span>
                  <span className="text-gray-400 font-bold text-[10px] uppercase mt-1">معلم رياضيات</span>
                </div>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f4f4f8] font-cairo">
            {content}
          </main>

          {selectedScheduleSession && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full animate-in scale-95 fade-in duration-300" dir="rtl">
                <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between">
                  <h2 className="font-black text-xl text-[#2d2d5e]">تفاصيل الحصة</h2>
                  <button
                    onClick={() => setSelectedScheduleSession(null)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-xs font-black text-gray-400 mb-1">اليوم</p>
                    <p className="font-black text-[#2d2d5e]">{selectedScheduleSession.day}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-xs font-black text-gray-400 mb-1">التوقيت</p>
                    <p className="font-black text-[#2d2d5e]">{selectedScheduleSession.time}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-xs font-black text-gray-400 mb-1">المادة</p>
                    <p className="font-black text-[#2d2d5e]">{selectedScheduleSession.subject}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-xs font-black text-gray-400 mb-1">الفوج</p>
                    <p className="font-black text-[#2d2d5e]">{selectedScheduleSession.group}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-xs font-black text-gray-400 mb-1">القاعة</p>
                    <p className="font-black text-[#2d2d5e]">{selectedScheduleSession.room}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-xs font-black text-gray-400 mb-1">الأستاذ</p>
                    <p className="font-black text-[#2d2d5e]">{selectedScheduleSession.teacher}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
