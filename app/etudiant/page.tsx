"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { readSharedSchedules, SharedScheduleEntry } from "@/lib/sharedSchedule";
import DashboardNavButton from "@/components/DashboardNavButton";
import { AuthGuard } from "@/lib/auth/AuthGuard";
import { useAuth } from "@/lib/auth/AuthProvider";
import { scheduleService } from "@/lib/api/schedule.service";
import { attendanceService } from "@/lib/api/attendance.service";
import { paymentsService } from "@/lib/api/payments.service";
import { communicationService } from "@/lib/api/communication.service";
import type { RecordMap } from "@/lib/api/types";

// --- Types ---
type StudentPageKey =
  | "home"
  | "schedule"
  | "files"
  | "attendance"
  | "payments"
  | "announcements";

type Announcement = {
  id: string;
  type: "admin" | "teacher";
  title: string;
  preview: string;
  fullText: string;
  time: string;
  color: string;
  teacher?: string;
};

type ScheduleSession = {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  group: string;
};

type StudentAttendanceRecord = {
  id: string;
  date: string;
  subject: string;
  status: "حاضر" | "غائب" | "متأخر";
  justification: string;
};

const pageTitles: Record<StudentPageKey, string> = {
  home: "الرئيسية",
  schedule: "جدولي الدراسي",
  files: "ملفاتي",
  attendance: "الحضور والغياب",
  payments: "المدفوعات",
  announcements: "الإعلانات",
};

// --- Shared SVGs (Matched exactly with admin/teacher template) ---
const Icons: Record<string, ReactNode> = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  schedule: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  files: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  attendance: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>,
  payments: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  announcements: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13z"/><path d="M11 13v6"/></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  closeIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>,
};

const navLinks: { label: string; page: StudentPageKey; icon: ReactNode }[] = [
  { label: "جدولي الدراسي",     page: "schedule",      icon: Icons.schedule },
  { label: "ملفاتي",            page: "files",         icon: Icons.files },
  { label: "الحضور والغياب",    page: "attendance",    icon: Icons.attendance },
  { label: "المدفوعات",         page: "payments",      icon: Icons.payments },
  { label: "الإعلانات",         page: "announcements", icon: Icons.announcements },
];

// --- Components ---

function StatCard({ title, value, subtitle, highlight = false, onClick }: { title: string; value: string; subtitle: string, highlight?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-shadow ${onClick ? 'hover:shadow-md cursor-pointer hover:border-[#e01c8a]/30' : 'hover:shadow-md'}`}>
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

function StudentDashboardContent() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [currentPage, setCurrentPage] = useState<StudentPageKey>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState<{msg: string, type: 'success'|'info'|'error'} | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [selectedScheduleSession, setSelectedScheduleSession] = useState<ScheduleSession | null>(null);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState("2026-03-12");
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const [studentAnnouncements, setStudentAnnouncements] = useState<Announcement[]>([]);
  const [studentScheduleRows, setStudentScheduleRows] = useState<ScheduleSession[]>([]);
  const [studentAttendanceRows, setStudentAttendanceRows] = useState<StudentAttendanceRecord[]>([]);
  const [studentPaymentRows, setStudentPaymentRows] = useState<RecordMap[]>([]);
  const [studentGroup, setStudentGroup] = useState("AB12");
  const [selectedPayment, setSelectedPayment] = useState<RecordMap | null>(null);

  const showToast = (msg: string, type: 'success'|'info'|'error' = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = async () => {
    showToast("جاري تسجيل الخروج...", "info");
    try {
      await logout();
    } finally {
      setTimeout(() => {
        router.push("/");
      }, 600);
    }
  };

  const toText = (value: unknown, fallback = "") =>
    typeof value === "string" && value.trim().length > 0 ? value : fallback;
  const toNumber = (value: unknown, fallback = 0) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const toArabicAttendance = (value: unknown): "حاضر" | "غائب" | "متأخر" => {
    const normalized = toText(value, "").toLowerCase();
    if (normalized.includes("late") || normalized.includes("retard") || normalized.includes("متأخر")) return "متأخر";
    if (normalized.includes("abs") || normalized.includes("غائب") || normalized.includes("absent")) return "غائب";
    return "حاضر";
  };

  useEffect(() => {
    const loadStudentData = async () => {
      if (!user?.userId) return;
      try {
        const [scheduleRows, attendanceRows, paymentRows, announcementRows] = await Promise.all([
          scheduleService.getMySchedule(),
          attendanceService.getByStudent(user.userId),
          paymentsService.getByStudent(user.userId),
          communicationService.getAnnouncements(),
        ]);

        const mappedSchedule: ScheduleSession[] = scheduleRows.map((row, index) => ({
          id: toText(row.id, `S-${index}`),
          day: toText(row.day, toText(row.jour, "الإثنين")),
          time: toText(row.time, toText(row.startTime, "--:--")),
          subject: toText(row.subject, toText(row.subjectName, "مادة")),
          teacher: toText(row.teacher, toText(row.teacherName, "أستاذ")),
          room: toText(row.room, toText(row.roomName, "قاعة")),
          group: toText(row.group, toText(row.groupName, studentGroup)),
        }));

        const mappedAttendance: StudentAttendanceRecord[] = attendanceRows.map((row, index) => ({
          id: toText(row.id, `AT-${index}`),
          date: toText(row.date, toText(row.sessionDate, "")),
          subject: toText(row.subject, toText(row.subjectName, "مادة")),
          status: toArabicAttendance(row.status),
          justification: toText(row.justification, toText(row.notes, "-")),
        }));

        const mappedAnnouncements: Announcement[] = announcementRows.map((row, index) => {
          const scope = toText(row.scope, "").toLowerCase();
          const type: "admin" | "teacher" = scope.includes("teacher") ? "teacher" : "admin";
          return {
            id: toText(row.id, `ANN-${index}`),
            type,
            title: toText(row.title, "إعلان"),
            preview: toText(row.content, ""),
            fullText: toText(row.content, ""),
            time: toText(row.createdAt, ""),
            color: type === "teacher" ? "purple" : "blue",
            teacher: toText(row.authorName, ""),
          };
        });

        setStudentScheduleRows(mappedSchedule);
        setStudentAttendanceRows(mappedAttendance);
        setStudentPaymentRows(paymentRows);
        setStudentAnnouncements(mappedAnnouncements);

        const detectedGroup = mappedSchedule.find((row) => row.group)?.group;
        if (detectedGroup) setStudentGroup(detectedGroup);
      } catch {
        showToast("تعذر تحميل بيانات الطالب", "error");
      }
    };

    void loadStudentData();
  }, [user?.userId]);

  const announcements = studentAnnouncements;

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
    { id: 1, title: "تم إضافة درس جديد في الرياضيات", time: "منذ 5 دقائق", read: false },
    { id: 2, title: "تذكير: واجب الفيزياء غداً", time: "منذ ساعتين", read: false },
  ]);

  const [sharedSchedules, setSharedSchedules] = useState<SharedScheduleEntry[]>(() => readSharedSchedules());

  useEffect(() => {
    const syncSchedules = () => setSharedSchedules(readSharedSchedules());
    window.addEventListener("storage", syncSchedules);
    return () => window.removeEventListener("storage", syncSchedules);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));

  const adminGroupSchedules = sharedSchedules
    .filter((item) => item.targetType === "group" && item.targetValue === studentGroup)
    .map((item) => ({
      day: item.day,
      time: item.time,
      subject: item.subject,
      teacher: item.teacher,
      room: item.room,
    }));

  const dayOrder = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  const studentScheduleSessions: ScheduleSession[] = [
    ...studentScheduleRows,
    ...adminGroupSchedules.map((row, index) => ({
      id: `SA-${index}`,
      day: row.day,
      time: row.time,
      subject: row.subject,
      teacher: row.teacher,
      room: row.room,
      group: studentGroup,
    })),
  ];

  const studentScheduleByDay = dayOrder.reduce<Record<string, ScheduleSession[]>>((acc, day) => {
    acc[day] = studentScheduleSessions.filter((session) => session.day === day);
    return acc;
  }, {});

  const filteredAttendance = studentAttendanceRows.filter((row) => row.date === selectedAttendanceDate);
  const presentCount = filteredAttendance.filter((row) => row.status === "حاضر").length;
  const absentCount = filteredAttendance.filter((row) => row.status === "غائب").length;
  const lateCount = filteredAttendance.filter((row) => row.status === "متأخر").length;
  const paidCount = studentPaymentRows.filter((row) => {
    const status = toText(row.status, "").toLowerCase();
    return status.includes("paid") || status.includes("مدفوع");
  }).length;
  const unpaidCount = studentPaymentRows.length - paidCount;
  const paymentHealthy = unpaidCount <= 0;

  const content = (() => {
    switch (currentPage) {
      case "home":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="المحاضرات اليوم" value="4" subtitle="المحاضرة القادمة 10:15" onClick={() => setCurrentPage("schedule")} />
              <StatCard title="إعلانات" value="2" subtitle="إعلانات مدرسية جديدة" onClick={() => setCurrentPage("announcements")} />
              <StatCard title="الإشعارات" value={unreadCount.toString()} subtitle="إشعارات غير مقروءة" onClick={() => setShowNotifs(true)} />
              <StatCard title="حالة الدفع" value={paymentHealthy ? "نشط" : "متأخر"} subtitle={paymentHealthy ? "لا توجد مستحقات" : `${unpaidCount} مستحقات غير مدفوعة`} highlight={paymentHealthy} onClick={() => setCurrentPage("payments")} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionCard title="جدول اليوم">
                <div className="flex flex-col gap-3">
                  <div onClick={() => setCurrentPage("schedule")} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between hover:border-[#e01c8a]/30 transition-colors cursor-pointer">
                    <div>
                      <h4 className="font-black text-[#2d2d5e] text-sm">الرياضيات</h4>
                      <p className="text-xs text-gray-500 font-bold mt-1">أستاذ أحمد • قاعة 203</p>
                    </div>
                    <div className="bg-[#e01c8a]/10 text-[#e01c8a] px-3 py-1.5 rounded-xl text-sm font-black text-left">
                      08:30 ص
                    </div>
                  </div>
                  <div onClick={() => setCurrentPage("schedule")} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between hover:border-[#e01c8a]/30 transition-colors cursor-pointer">
                    <div>
                      <h4 className="font-black text-[#2d2d5e] text-sm">الفيزياء</h4>
                      <p className="text-xs text-gray-500 font-bold mt-1">أستاذة سارة • قاعة 107</p>
                    </div>
                    <div className="bg-[#e01c8a]/10 text-[#e01c8a] px-3 py-1.5 rounded-xl text-sm font-black text-left">
                      10:15 ص
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="أحدث الإعلانات">
                <div className="flex flex-col gap-3">
                  <div 
                    onClick={() => {
                      setSelectedAnnouncement(announcements[0]);
                      setShowAnnouncementModal(true);
                    }}
                    className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-4 hover:bg-rose-100/50 transition-colors cursor-pointer hover:shadow-md"
                  >
                    <div className="w-2 h-2 mt-1.5 bg-[#e01c8a] rounded-full shadow-[0_0_8px_rgba(224,28,138,0.5)]"></div>
                    <div>
                      <h4 className="font-black text-rose-900 text-sm">حدث مدرسي</h4>
                      <p className="text-xs text-rose-700 font-bold mt-1">الاحتفال السنوي يقام يوم الجمعة بعد الظهر.</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => {
                      setSelectedAnnouncement(announcements[1]);
                      setShowAnnouncementModal(true);
                    }}
                    className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-4 hover:bg-blue-100/50 transition-colors cursor-pointer hover:shadow-md"
                  >
                    <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full"></div>
                    <div>
                      <h4 className="font-black text-blue-900 text-sm">الأساتذة</h4>
                      <p className="text-xs text-blue-700 font-bold mt-1">تم تأكيد غياب الأستاذ خالد لليوم.</p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        );

      case "schedule":
        return (
          <SectionCard title="الجدول الدراسي الأسبوعي (نفس نمط الإدارة)">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {dayOrder.map((day) => (
                <div key={day} className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-black text-[#2d2d5e] text-sm">{day}</h4>
                    <span className="bg-white border border-gray-200 text-gray-500 text-xs font-bold px-2 py-1 rounded-lg">
                      {studentScheduleByDay[day].length} حصة
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {studentScheduleByDay[day].length === 0 && (
                      <div className="border border-dashed border-gray-200 rounded-xl px-3 py-4 text-center text-xs font-bold text-gray-400 bg-white">
                        لا توجد حصص
                      </div>
                    )}

                    {studentScheduleByDay[day].map((session) => (
                      <button
                        key={session.id}
                        onClick={() => setSelectedScheduleSession(session)}
                        className="w-full text-right bg-white border border-gray-200 hover:border-[#e01c8a]/40 rounded-xl p-3 transition-all hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[#2d2d5e] font-black text-sm">{session.subject}</span>
                          <span className="text-[#e01c8a] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md text-[10px] font-black">{session.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 font-bold">{session.teacher} • {session.room}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        );

      case "files":
        return (
          <SectionCard title="ملفاتي (الدروس، الواجبات، PDF)">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
              <div 
                onClick={() => setExpandedFile(expandedFile === 'pdf1' ? null : 'pdf1')}
                className={`border transition-all duration-300 rounded-2xl p-6 text-center cursor-pointer group flex flex-col items-center ${
                  expandedFile === 'pdf1' 
                    ? 'border-[#e01c8a]/50 bg-white shadow-lg ring-2 ring-[#e01c8a]/10' 
                    : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-[#e01c8a]/30 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-[#e01c8a] shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <span className="font-black text-xl">PDF</span>
                </div>
                <h4 className="font-black text-[#2d2d5e] text-sm mb-1">الفصل الأول - رياضيات</h4>
                <p className="text-xs text-gray-400 font-bold">بواسطة الأستاذ أحمد</p>
                {expandedFile === 'pdf1' && (
                  <div className="mt-3 w-full pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600 font-bold mb-3">حجم الملف: 2.5 MB • تاريخ الرفع: 10 مارس 2026</p>
                  </div>
                )}
                <button onClick={(e) => {e.stopPropagation(); showToast("جاري تحميل الملف... 2.5 MB", "info");}} className="mt-4 text-xs font-bold text-white bg-[#e01c8a] px-4 py-1.5 rounded-lg w-full hover:bg-rose-600 transition-colors">
                  {expandedFile === 'pdf1' ? 'تحميل الآن' : 'معاينة & تحميل'}
                </button>
              </div>

              <div 
                onClick={() => setExpandedFile(expandedFile === 'doc1' ? null : 'doc1')}
                className={`border transition-all duration-300 rounded-2xl p-6 text-center cursor-pointer group flex flex-col items-center ${
                  expandedFile === 'doc1' 
                    ? 'border-blue-500/50 bg-white shadow-lg ring-2 ring-blue-500/10' 
                    : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-blue-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <span className="font-black text-xl">DOC</span>
                </div>
                <h4 className="font-black text-[#2d2d5e] text-sm mb-1">واجب الفيزياء</h4>
                <p className="text-xs text-gray-400 font-bold">للتسليم في 12 مارس</p>
                {expandedFile === 'doc1' && (
                  <div className="mt-3 w-full pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600 font-bold mb-3">حجم الملف: 1.2 MB • تاريخ الرفع: 08 مارس 2026</p>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-2 text-[10px] text-amber-700 font-bold mb-3">
                      ⏰ موعد التسليم: 12 مارس 2026 الساعة 18:00
                    </div>
                  </div>
                )}
                <button onClick={(e) => {e.stopPropagation(); showToast("جاري تحميل الملف... 1.2 MB", "info");}} className="mt-4 text-xs font-bold text-white bg-blue-600 px-4 py-1.5 rounded-lg w-full hover:bg-blue-700 transition-colors">
                  {expandedFile === 'doc1' ? 'تحميل الآن' : 'معاينة & تحميل'}
                </button>
              </div>

              <div 
                onClick={() => setExpandedFile(expandedFile === 'zip1' ? null : 'zip1')}
                className={`border transition-all duration-300 rounded-2xl p-6 text-center cursor-pointer group flex flex-col items-center ${
                  expandedFile === 'zip1' 
                    ? 'border-purple-500/50 bg-white shadow-lg ring-2 ring-purple-500/10' 
                    : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-purple-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </div>
                <h4 className="font-black text-[#2d2d5e] text-sm mb-1">تصحيح تمرين 3</h4>
                <p className="text-xs text-gray-400 font-bold">ملف مشترك</p>
                {expandedFile === 'zip1' && (
                  <div className="mt-3 w-full pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600 font-bold mb-3">حجم الملف: 3.8 MB • 15 ملف • تاريخ الرفع: 15 مارس 2026</p>
                  </div>
                )}
                <button onClick={(e) => {e.stopPropagation(); showToast("جاري تحميل الملفات... 3.8 MB", "info");}} className="mt-4 text-xs font-bold text-white bg-purple-600 px-4 py-1.5 rounded-lg w-full hover:bg-purple-700 transition-colors">
                  {expandedFile === 'zip1' ? 'تحميل الآن' : 'معاينة & تحميل'}
                </button>
              </div>
            </div>
          </SectionCard>
        );

      case "attendance":
        return (
          <SectionCard title="الحضور والغياب (سجل الحضور والتأخير)">
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
                     <th className="py-4 px-4 font-black text-gray-400 text-sm">التبرير</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredAttendance.length === 0 ? (
                     <tr>
                       <td colSpan={4} className="px-4 py-8 text-center text-sm font-bold text-gray-400">
                         لا توجد بيانات حضور لهذا اليوم
                       </td>
                     </tr>
                   ) : (
                     filteredAttendance.map((row) => (
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
                         <td
                           className={`py-4 px-4 text-sm ${
                             row.justification.includes("عذر")
                               ? "font-bold text-blue-500 underline cursor-pointer"
                               : "text-gray-500"
                           }`}
                           onClick={() => {
                             if (row.justification.includes("عذر")) {
                               showToast("عرض العذر الطبي المرفق...", "info");
                             }
                           }}
                         >
                           {row.justification}
                         </td>
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
          <SectionCard title="سجل المدفوعات">
            {studentPaymentRows.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-center text-sm font-bold text-gray-400">
                لا توجد سجلات مدفوعات متاحة حالياً
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentPaymentRows.map((row, index) => {
                  const statusText = toText(row.status, "غير محدد");
                  const isPaid = statusText.toLowerCase().includes("paid") || statusText.includes("مدفوع");
                  return (
                    <div key={`student-payment-${index}`} onClick={() => { setSelectedPayment(row); setShowPaymentModal(true); }} className={`rounded-2xl p-5 transition-all shadow-sm hover:shadow-md cursor-pointer ${isPaid ? "border border-gray-200 bg-white hover:border-green-300" : "border border-[#e01c8a]/40 bg-rose-50/30 hover:border-[#e01c8a]"}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-[#2d2d5e] text-lg">{toText(row.period, toText(row.month, "اشتراك"))}</h4>
                          <p className="text-sm text-gray-500 font-bold mt-1">{toText(row.label, "المصروفات الدراسية")}</p>
                        </div>
                        <span className={`font-black px-3 py-1.5 rounded-lg text-xs border ${isPaid ? "bg-green-100 text-green-700 border-green-200" : "bg-rose-100 text-[#e01c8a] border-rose-200"}`}>
                          {isPaid ? "مدفوع" : "غير مدفوع"}
                        </span>
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-black text-lg text-[#2d2d5e]">{toNumber(row.amount, 0)} درهم</span>
                        {isPaid ? (
                          <button onClick={(e) => {e.stopPropagation(); showToast("جاري تحميل الإيصال...", "success");}} className="text-[#e01c8a] text-sm font-bold hover:underline flex items-center gap-1">
                            تحميل الإيصال
                          </button>
                        ) : (
                          <button onClick={(e) => {e.stopPropagation(); setSelectedPayment(row); setShowPaymentModal(true); showToast("فتح نافذة الدفع الآمن...", "info");}} className="bg-[#e01c8a] hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors hover:shadow-md">
                            الدفع الآن
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        );

      case "announcements":
        return (
          <SectionCard title="الإعلانات (المدرسة والمعلمين)">
            <div className="flex flex-col gap-4">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id}
                  onClick={() => {
                    setSelectedAnnouncement(announcement);
                    setShowAnnouncementModal(true);
                  }}
                  className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#e01c8a]/30 transition-all cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`bg-${announcement.color}-100 text-${announcement.color}-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md`}>
                      {announcement.type === 'admin' ? 'الإدارة' : 'أستاذ أحمد (رياضيات)'}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">{announcement.time}</span>
                  </div>
                  <h4 className="font-black text-[#2d2d5e] text-base mb-2 flex items-center gap-2">
                    {announcement.title}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-[#e01c8a]"><polyline points="9 18 15 12 9 6"/></svg>
                  </h4>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    {announcement.preview}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        );

      default:
        return null;
    }
  })();

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'); * { font-family: 'Cairo', sans-serif; }`}</style>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-xl shadow-rose-200/50 border border-rose-100 flex items-center gap-3">
            {toastMessage.type === 'info' && (
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
            )}
            {toastMessage.type === 'success' && (
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
            )}
            <span className="font-bold text-[#2d2d5e] text-sm">{toastMessage.msg}</span>
          </div>
        </div>
      )}

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
                    <span className="text-white font-black text-lg">ط</span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-white font-black text-lg tracking-wide">تسيير</span>
                    <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">طالب</span>
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
                className="group flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-black w-full text-right transition-all duration-300 text-white/80 hover:bg-rose-500/80 hover:text-white hover:shadow-lg hover:shadow-rose-500/30 border border-transparent hover:border-rose-400 mt-2">
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
                  <span className="text-[#e01c8a] hover:text-rose-600 transition-colors cursor-pointer" onClick={() => setCurrentPage("home")}>مساحة الطالب</span>
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
                              setCurrentPage(key as StudentPageKey);
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

              <button onClick={() => showToast("فتح الملف الشخصي...", "info")} className="flex items-center gap-3 p-1 pl-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-300 group">
                <div className="w-10 h-10 bg-linear-to-br from-[#e01c8a] to-rose-400 rounded-full flex items-center justify-center shadow-md shadow-rose-200 group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300 border-2 border-white ring-2 ring-transparent group-hover:ring-rose-100 shrink-0">
                  <span className="text-white font-black text-sm">ي</span>
                </div>
                <div className="hidden md:flex flex-col leading-none text-right">
                  <span className="text-[#2d2d5e] font-black text-sm group-hover:text-[#e01c8a] transition-colors">ياسين</span>
                  <span className="text-gray-400 font-bold text-[10px] uppercase mt-1">طالب</span>
                </div>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f4f4f8]">
            {content}
          </main>

          {/* Announcement Modal */}
          {showAnnouncementModal && selectedAnnouncement && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-in scale-95 fade-in duration-300">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
                  <h2 className="font-black text-xl text-[#2d2d5e]">{selectedAnnouncement.title}</h2>
                  <button 
                    onClick={() => setShowAnnouncementModal(false)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <span className={`bg-${selectedAnnouncement.color}-100 text-${selectedAnnouncement.color}-700 text-[10px] font-black uppercase px-3 py-1 rounded-lg`}>
                      {selectedAnnouncement.type === 'admin' ? 'الإدارة' : selectedAnnouncement.teacher}
                    </span>
                    <span className="text-sm text-gray-400 font-bold">{selectedAnnouncement.time}</span>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 font-bold text-base leading-relaxed whitespace-pre-wrap">
                      {selectedAnnouncement.fullText}
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3 justify-end">
                    <button 
                      onClick={() => {
                        setShowAnnouncementModal(false);
                        showToast('تم وضع علامة على الإعلان...', 'success');
                      }}
                      className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                    >
                      وضع علامة
                    </button>
                    <button 
                      onClick={() => {
                        setShowAnnouncementModal(false);
                        showToast('تم إغلاق الإعلان', 'info');
                      }}
                      className="px-6 py-2.5 rounded-lg bg-[#e01c8a] text-white font-bold hover:bg-rose-600 transition-colors shadow-md"
                    >
                      حسناً، فهمت
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Modal */}
          {showPaymentModal && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-in scale-95 fade-in duration-300">
                <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between">
                  <h2 className="font-black text-xl text-[#2d2d5e]">بوابة الدفع الآمن</h2>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="bg-linear-to-br from-rose-50 to-orange-50 border border-rose-100 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 font-bold mb-2">المبلغ المستحق:</p>
                    <p className="text-3xl font-black text-[#e01c8a]">{toNumber(selectedPayment?.amount, 1500)} درهم</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:border-blue-300 transition-colors">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-black">💳</div>
                      <div className="flex-1 text-right">
                        <p className="font-bold text-gray-700 text-sm">بطاقة ائتمان</p>
                        <p className="text-xs text-gray-400">Visa, Mastercard</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:border-green-300 transition-colors">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm font-black">📱</div>
                      <div className="flex-1 text-right">
                        <p className="font-bold text-gray-700 text-sm">المحفظة الرقمية</p>
                        <p className="text-xs text-gray-400">Apple Pay, Google Pay</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:border-purple-300 transition-colors">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm font-black">🏦</div>
                      <div className="flex-1 text-right">
                        <p className="font-bold text-gray-700 text-sm">تحويل بنكي</p>
                        <p className="text-xs text-gray-400">حساب مدرسي</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        setShowPaymentModal(false);
                        showToast('تم إلغاء العملية', 'info');
                      }}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button 
                      onClick={() => {
                        setShowPaymentModal(false);
                        showToast('جاري معالجة الدفع... يرجى الانتظار', 'info');
                        setTimeout(() => showToast('تم تأكيد الدفع بنجاح! شكراً لك', 'success'), 2000);
                      }}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-[#e01c8a] text-white font-bold hover:bg-rose-600 transition-colors shadow-md"
                    >
                      متابعة الدفع
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    <p className="text-xs font-black text-gray-400 mb-1">المعلم</p>
                    <p className="font-black text-[#2d2d5e]">{selectedScheduleSession.teacher}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-xs font-black text-gray-400 mb-1">القاعة</p>
                    <p className="font-black text-[#2d2d5e]">{selectedScheduleSession.room}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-xs font-black text-gray-400 mb-1">الفوج</p>
                    <p className="font-black text-[#2d2d5e]">{selectedScheduleSession.group}</p>
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

export default function StudentDashboard() {
  return (
    <AuthGuard allowedRoles={['ETUDIANT']}>
      <StudentDashboardContent />
    </AuthGuard>
  );
}