"use client";

import { useMemo, useState, useRef, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// --- Types ---
type SecretairePageKey =
  | "home"
  | "students"
  | "subscriptions"
  | "subjects-groups"
  | "schedule"
  | "payments"
  | "attendance"
  | "announcements"
  | "messages";

const pageTitles: Record<SecretairePageKey, string> = {
  home: "الرئيسية",
  students: "الطلاب",
  subscriptions: "الاشتراكات",
  "subjects-groups": "المواد والمجموعات",
  schedule: "الجدول الدراسي",
  payments: "المدفوعات",
  attendance: "الحضور والغياب",
  announcements: "الإعلانات",
  messages: "المراسلة",
};

// --- Shared SVGs ---
const Icons: Record<string, ReactNode> = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  students: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  subscriptions: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  "subjects-groups": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  schedule: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  payments: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  attendance: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>,
  announcements: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13z"/><path d="M11 13v6"/></svg>,
  messages: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  closeIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>,
};

const navLinks: { label: string; page: SecretairePageKey; icon: ReactNode }[] = [
  { label: "الطلاب",             page: "students",         icon: Icons.students },
  { label: "الاشتراكات",         page: "subscriptions",    icon: Icons.subscriptions },
  { label: "المواد والمجموعات",  page: "subjects-groups",  icon: Icons["subjects-groups"] },
  { label: "الجدول الدراسي",     page: "schedule",         icon: Icons.schedule },
  { label: "المدفوعات",          page: "payments",         icon: Icons.payments },
  { label: "الحضور والغياب",     page: "attendance",       icon: Icons.attendance },
  { label: "الإعلانات",          page: "announcements",    icon: Icons.announcements },
  { label: "المراسلة",           page: "messages",         icon: Icons.messages },
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
        <span className={`text-3xl font-black ${highlight ? 'text-red-600' : 'text-[#2d2d5e]'}`}>{value}</span>
      </div>
      <p className={`text-xs mt-2 font-bold inline-block px-2 py-1 rounded-lg ${highlight ? 'bg-red-50 text-red-700' : 'text-[#e01c8a] bg-rose-50'}`}>
        {subtitle}
      </p>
    </div>
  );
}

function SectionCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[#2d2d5e] font-black text-lg flex items-center gap-2">
          <span className="w-2 h-6 bg-[#e01c8a] rounded-full"></span>
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

// --- Mock Data ---

const mockStudents = [
  { id: 1, name: "ياسين بنعلي", level: "الثانية باكالوريا", subscriptions: 3, paymentStatus: "paid" },
  { id: 2, name: "مريم العلمي", level: "الجدع المشترك", subscriptions: 2, paymentStatus: "unpaid" },
  { id: 3, name: "أحمد الإدريسي", level: "الأولى باكالوريا", subscriptions: 1, paymentStatus: "paid" },
  { id: 4, name: "سارة العمراني", level: "الثالثة إعدادي", subscriptions: 4, paymentStatus: "partial" },
];

const mockSubscriptions = [
  { id: 1, studentId: 1, studentName: "ياسين بنعلي", subject: "الرياضيات", teacher: "أستاذ أحمد", group: "باك-رياضيات-G1", price: "350", status: "نشط" },
  { id: 2, studentId: 1, studentName: "ياسين بنعلي", subject: "الفيزياء", teacher: "أستاذة سارة", group: "باك-فيزياء-G2", price: "350", status: "نشط" },
  { id: 3, studentId: 2, studentName: "مريم العلمي", subject: "الفرنسية", teacher: "أستاذ سعيد", group: "جدع-فرنسية-G1", price: "300", status: "غير نشط" },
];

const mockGroups = [
  { id: 1, name: "باك-رياضيات-G1", subject: "الرياضيات", level: "الثانية باكالوريا", room: "قاعة 203", capacity: 20, enrolled: 15, schedule: "الإثنين 18:30" },
  { id: 2, name: "باك-فيزياء-G2", subject: "الفيزياء", level: "الثانية باكالوريا", room: "قاعة 107", capacity: 20, enrolled: 18, schedule: "الأربعاء 18:30", conflict: true },
];

export default function SecretaireDashboardCoursSup() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<SecretairePageKey>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [toastMessage, setToastMessage] = useState<{msg: string, type: 'success'|'info'|'error'} | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showAddAnnouncementModal, setShowAddAnnouncementModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', level: '', email: '' });
  const [newSubject, setNewSubject] = useState({ name: '', teacher: '', price: '' });
  const [newGroup, setNewGroup] = useState({ name: '', subject: '', schedule: '' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

  const showToast = (msg: string, type: 'success'|'info'|'error' = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    showToast("جاري تسجيل الخروج...", "info");
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  // States for sub-pages
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Header Handlers
  const [showNotifs, setShowNotifs] = useState(false);
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
    { id: 1, title: "تأخر في الأداء: مريم العلمي (الفرنسية)", time: "منذ 10 دقائق", read: false },
    { id: 2, title: "طلب تسجيل جديد: عمر التازي", time: "منذ ساعة", read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));

  const content = useMemo(() => {
    switch (currentPage) {
      case "home":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="الطلاب النشطين" value="142" subtitle="+12 هذا الشهر" />
              <StatCard title="اشتراكات غير مدفوعة" value="28" subtitle="مستحقات هذا الشهر" highlight={true} />
              <StatCard title="إجمالي الاشتراكات" value="315" subtitle="نشط حالياً" />
              <StatCard title="حصص اليوم" value="8" subtitle="موزعة على 5 أساتذة" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionCard 
                title="تتبع المدفوعات المتأخرة" 
                action={<button onClick={() => showToast("جاري عرض جميع المدفوعات المتأخرة...", "info")} className="text-xs font-bold text-[#e01c8a] bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors">عرض الكل</button>}
              >
                <div className="flex flex-col gap-3">
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-between hover:border-red-200 transition-colors">
                    <div>
                      <h4 className="font-black text-red-900 text-sm">مريم العلمي</h4>
                      <p className="text-xs text-red-700 font-bold mt-1">الفرنسية (اشتراك مارس)</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="font-black text-red-600 text-sm">300 درهم</span>
                       <button onClick={() => showToast("إرسال تذكير...", "info")} className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition-colors" title="إرسال تذكير">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                       </button>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between hover:border-amber-200 transition-colors">
                    <div>
                      <h4 className="font-black text-amber-900 text-sm">سارة العمراني</h4>
                      <p className="text-xs text-amber-700 font-bold mt-1">الرياضيات (اشتراك مارس - دفع جزئي)</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="font-black text-amber-600 text-sm">متبقي: 150 درهم</span>
                       <button onClick={() => showToast("إرسال تذكير...", "info")} className="bg-amber-500 text-white p-1.5 rounded-lg hover:bg-amber-600 transition-colors" title="إرسال تذكير">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                       </button>
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard 
                title="الحصص الجارية اليوم المباشرة"
                action={<button onClick={() => showToast("جاري تحديث الحصص الجارية...", "info")} className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">تحديث</button>}
              >
                <div className="flex flex-col gap-3">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between hover:border-[#e01c8a]/30 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                         <h4 className="font-black text-[#2d2d5e] text-sm">الرياضيات (باك-رياضيات-G1)</h4>
                      </div>
                      <p className="text-xs text-gray-500 font-bold mt-1">أ. أحمد • قاعة 203</p>
                    </div>
                    <div className="bg-gray-200/50 text-gray-600 px-3 py-1.5 rounded-xl text-sm font-black text-left">
                      18:30 - 20:00
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between hover:border-[#e01c8a]/30 transition-colors opacity-60">
                    <div>
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                         <h4 className="font-black text-[#2d2d5e] text-sm">الفيزياء (باك-فيزياء-G2)</h4>
                      </div>
                      <p className="text-xs text-gray-500 font-bold mt-1">أ. سارة • قاعة 107</p>
                    </div>
                    <div className="bg-gray-200/50 text-gray-600 px-3 py-1.5 rounded-xl text-sm font-black text-left">
                      20:15 - 22:00
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        );
        
      case "students":
        return (
          <SectionCard 
            title="إدارة شؤون الطلاب"
            action={
               <div className="flex gap-2">
                  <button onClick={() => showToast("جاري فتح نافذة استيراد من إكسل...", "info")} className="text-xs font-bold text-[#e01c8a] bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                     استيراد Excel
                  </button>
                  <button onClick={() => setShowAddStudentModal(true)} className="text-xs font-bold text-white bg-[#e01c8a] px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-1">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                     إضافة طالب
                  </button>
               </div>
            }
          >
            <div className="mb-4 flex gap-3">
               <input 
                  type="text" 
                  placeholder="ابحث بالاسم أو الرقم..." 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-1 focus:ring-[#e01c8a]/20"
               />
               <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 font-bold focus:outline-none focus:border-[#e01c8a]/50">
                  <option value="">جميع المستويات</option>
                  <option value="bac2">الثانية باكالوريا</option>
                  <option value="bac1">الأولى باكالوريا</option>
                  <option value="tronc">الجدع المشترك</option>
               </select>
            </div>
            
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                    <th className="py-3 px-4 font-black text-gray-500 text-xs">الاسم الكامل</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs">المستوى الدراسي</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs">الاشتراكات النشطة</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs">حالة الأداء (الشهر الحالي)</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-black text-[#2d2d5e] text-sm flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-rose-100 text-[#e01c8a] flex items-center justify-center text-xs">
                            {student.name.charAt(0)}
                         </div>
                         {student.name}
                      </td>
                      <td className="py-3 px-4 text-xs font-bold text-gray-600">{student.level}</td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-50 text-blue-600 font-black px-2 py-1 rounded-md text-xs">{student.subscriptions} مواد</span>
                      </td>
                      <td className="py-3 px-4">
                        {student.paymentStatus === 'paid' && <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded-md text-xs">خالص</span>}
                        {student.paymentStatus === 'unpaid' && <span className="bg-red-100 text-red-700 font-bold px-2 py-1 rounded-md text-xs">غير خالص</span>}
                        {student.paymentStatus === 'partial' && <span className="bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded-md text-xs">دفع جزئي</span>}
                      </td>
                      <td className="py-3 px-4 flex justify-center gap-2">
                        <button onClick={() => showToast("عرض الملف...", "info")} className="text-gray-400 hover:text-blue-500 transition-colors" title="عرض الملف">
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        <button onClick={() => showToast("تعديل...", "info")} className="text-gray-400 hover:text-[#e01c8a] transition-colors" title="تعديل">
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button onClick={() => showToast("إعادة تعيين كلمة المرور...", "info")} className="text-gray-400 hover:text-amber-500 transition-colors" title="إعادة تعيين كلمة المرور">
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        );

      case "subscriptions":
        return (
          <SectionCard 
            title="إدارة اشتراكات الطلاب المادية (الفوترة)"
            action={
               <button onClick={() => showToast("جاري فتح نافذة التسجيل...", "info")} className="text-xs font-bold text-white bg-[#e01c8a] px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  تسجيل طالب في مادة
               </button>
            }
          >
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                    <th className="py-3 px-4 font-black text-gray-500 text-xs">الطالب</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs">المادة / المعلم</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs">المجموعة</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs">السعر الشهري</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs">حالة الاشتراك</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSubscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-black text-[#2d2d5e] text-sm">{sub.studentName}</td>
                      <td className="py-3 px-4">
                         <p className="font-bold text-gray-700 text-sm">{sub.subject}</p>
                         <p className="text-xs text-gray-400">{sub.teacher}</p>
                      </td>
                      <td className="py-3 px-4 text-xs font-bold text-gray-600">{sub.group}</td>
                      <td className="py-3 px-4 font-black text-[#2d2d5e] text-sm">{sub.price} درهم</td>
                      <td className="py-3 px-4">
                        {sub.status === 'نشط' ? (
                           <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded-md text-xs">نشط</span>
                        ) : (
                           <span className="bg-gray-100 text-gray-500 font-bold px-2 py-1 rounded-md text-xs">متوقف / تم الإلغاء</span>
                        )}
                      </td>
                      <td className="py-3 px-4 flex justify-center gap-2">
                        <button onClick={() => showToast("تعديل الاشتراك...", "info")} className="text-gray-400 hover:text-[#e01c8a] transition-colors" title="تعديل">
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button onClick={() => showToast("جاري إيقاف الاشتراك...", "info")} className="text-gray-400 hover:text-red-500 transition-colors" title="إيقاف الاشتراك">
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        );

      case "subjects-groups":
        return (
          <div className="space-y-6">
             <SectionCard 
               title="إعدادات المواد والأساتذة"
               action={
                  <button onClick={() => setShowAddSubjectModal(true)} className="text-xs font-bold text-white bg-[#e01c8a] px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors">إضافة مادة</button>
               }
             >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-gray-50/50 hover:border-[#e01c8a]/30 transition-colors">
                      <div>
                         <h4 className="font-black text-[#2d2d5e]">الرياضيات</h4>
                         <p className="text-xs font-bold text-gray-500">أ. أحمد • 350 درهم</p>
                      </div>
                      <button onClick={() => showToast("خيارات المادة...", "info")} className="text-gray-400 hover:text-[#e01c8a]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button>
                   </div>
                   <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-gray-50/50 hover:border-[#e01c8a]/30 transition-colors">
                      <div>
                         <h4 className="font-black text-[#2d2d5e]">الفيزياء</h4>
                         <p className="text-xs font-bold text-gray-500">أ. سارة • 350 درهم</p>
                      </div>
                      <button onClick={() => showToast("خيارات المادة...", "info")} className="text-gray-400 hover:text-[#e01c8a]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button>
                   </div>
                </div>
             </SectionCard>

             <SectionCard 
               title="إدارة المجموعات والأفواج"
               action={
                  <button onClick={() => setShowAddGroupModal(true)} className="text-xs font-bold text-[#e01c8a] bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1">إنشاء فوج جديد</button>
               }
             >
                <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                        <th className="py-3 px-4 font-black text-gray-500 text-xs">اسم الفوج</th>
                        <th className="py-3 px-4 font-black text-gray-500 text-xs">المادة والقاعة</th>
                        <th className="py-3 px-4 font-black text-gray-500 text-xs">الموعد الثابت</th>
                        <th className="py-3 px-4 font-black text-gray-500 text-xs">الطلبة المسجلين</th>
                        <th className="py-3 px-4 font-black text-gray-500 text-xs text-center">حالة القاعة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockGroups.map((grp) => (
                        <tr key={grp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-4 font-black text-[#2d2d5e] text-sm">{grp.name}</td>
                          <td className="py-3 px-4">
                             <p className="font-bold text-gray-700 text-sm">{grp.subject}</p>
                             <p className="text-xs text-gray-400">{grp.room}</p>
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-600 text-sm">{grp.schedule}</td>
                          <td className="py-3 px-4">
                             <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-20">
                                   <div className={`h-full ${grp.enrolled >= grp.capacity ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${(grp.enrolled/grp.capacity)*100}%`}}></div>
                                </div>
                                <span className="text-xs font-bold text-gray-500">{grp.enrolled}/{grp.capacity}</span>
                             </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {grp.conflict ? (
                               <span className="bg-red-100 text-red-700 font-bold px-2 py-1 rounded-md text-xs inline-flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> تعارض في الوقت</span>
                            ) : (
                               <span className="text-green-500"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </SectionCard>
          </div>
        );

      case "schedule":
        return (
          <SectionCard 
            title="جدولة الحصص المباشرة للمجموعات"
            action={<button onClick={() => setShowAddLessonModal(true)} className="text-xs font-bold text-white bg-[#e01c8a] px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors">إضافة حصة استثنائية/تعويضية</button>}
          >
            <div className="mb-6 flex gap-3">
               <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 font-bold focus:outline-none focus:border-[#e01c8a]/50">
                  <option value="">جميع المجموعات والأفواج</option>
                  <option value="1">باك-رياضيات-G1</option>
                  <option value="2">باك-فيزياء-G2</option>
               </select>
               <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 font-bold focus:outline-none focus:border-[#e01c8a]/50">
                  <option value="">هذا الأسبوع</option>
                  <option value="next">الأسبوع القادم</option>
               </select>
            </div>

            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                    <th className="py-3 px-4 font-black text-gray-500 text-xs w-1/5">اليوم / الوقت</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs w-1/4">المجموعة والمادة</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs w-1/5">المعلم</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs w-1/5">القاعة</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs w-1/12 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-black text-[#2d2d5e] text-sm">الإثنين</p>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">18:30 - 20:00 م</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#2d2d5e] text-sm">باك-رياضيات-G1</p>
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold mt-1 inline-block">رياضيات</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-600 text-sm">أ. أحمد</td>
                    <td className="py-3 px-4 font-bold text-gray-600 text-sm">قاعة 203</td>
                    <td className="py-3 px-4 flex justify-center mt-2">
                       <button onClick={() => showToast("تعديل الحصة...", "info")} className="text-gray-400 hover:text-blue-500 transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors bg-red-50/30">
                    <td className="py-3 px-4">
                      <p className="font-black text-[#2d2d5e] text-sm">الأربعاء</p>
                      <p className="text-xs text-red-400 font-bold mt-0.5">18:30 - 20:00 م <span className="bg-red-100 text-red-700 px-1 rounded text-[10px]">! تعارض </span></p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#2d2d5e] text-sm">باك-فيزياء-G2</p>
                      <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-[10px] font-bold mt-1 inline-block">فيزياء</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-600 text-sm">أ. سارة</td>
                    <td className="py-3 px-4 font-bold text-red-600 text-sm">قاعة 107 (محجوزة)</td>
                    <td className="py-3 px-4 flex justify-center mt-2">
                       <button onClick={() => showToast("تعديل الحصة...", "info")} className="text-gray-400 hover:text-blue-500 transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        );

      case "payments":
         return (
          <SectionCard 
            title="صندوق الأداء وتتبع المدفوعات"
            action={
               <div className="flex gap-2">
                  <button onClick={() => showToast("جاري تصدير البيانات...", "info")} className="text-xs font-bold text-[#e01c8a] bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                     تصدير Excel/PDF
                  </button>
               </div>
            }
          >
            <div className="mb-4 flex gap-3">
               <input 
                  type="text" 
                  placeholder="ابحث باسم الطالب..." 
                  className="w-1/3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-1 focus:ring-[#e01c8a]/20"
               />
               <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 font-bold focus:outline-none focus:border-[#e01c8a]/50">
                  <option value="">شهر مارس 2026</option>
                  <option value="">شهر فبراير 2026</option>
               </select>
               <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 font-bold focus:outline-none focus:border-[#e01c8a]/50">
                  <option value="">جميع الحالات</option>
                  <option value="unpaid">غير مدفوع / متأخر</option>
                  <option value="paid">مدفوع</option>
               </select>
            </div>
            
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                    <th className="py-3 px-4 font-black text-gray-500 text-xs">الطالب</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs">المادة / الفوج</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs">المبلغ المطلوب</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs">حالة الأداء المباشر</th>
                    <th className="py-3 px-4 font-black text-gray-500 text-xs text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                     <td className="py-3 px-4 font-black text-[#2d2d5e] text-sm">ياسين بنعلي</td>
                     <td className="py-3 px-4">
                         <p className="font-bold text-gray-700 text-sm">الرياضيات</p>
                         <p className="text-[10px] text-gray-400">باك-رياضيات-G1</p>
                     </td>
                     <td className="py-3 px-4 font-black text-[#2d2d5e] text-sm">350 درهم</td>
                     <td className="py-3 px-4">
                        <select className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold rounded-md px-2 py-1 outline-none cursor-pointer appearance-none">
                           <option value="paid">مدفوع (خالص)</option>
                           <option value="unpaid">غير مدفوع</option>
                           <option value="partial">دفع جزئي</option>
                        </select>
                     </td>
                     <td className="py-3 px-4 flex justify-center gap-2">
                        <button onClick={() => showToast("جاري استخراج إيصال الأداء...", "info")} className="text-gray-400 hover:text-green-500 transition-colors" title="استخراج إيصال الأداء">
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </button>
                     </td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors bg-red-50/30">
                     <td className="py-3 px-4 font-black text-[#2d2d5e] text-sm">مريم العلمي</td>
                     <td className="py-3 px-4">
                         <p className="font-bold text-gray-700 text-sm">الفرنسية</p>
                         <p className="text-[10px] text-gray-400">جدع-فرنسية-G1</p>
                     </td>
                     <td className="py-3 px-4 font-black text-[#2d2d5e] text-sm">300 درهم</td>
                     <td className="py-3 px-4">
                        <select className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-md px-2 py-1 outline-none cursor-pointer appearance-none">
                           <option value="unpaid">غير مدفوع</option>
                           <option value="paid">مدفوع (خالص)</option>
                           <option value="partial">دفع جزئي</option>
                        </select>
                     </td>
                     <td className="py-3 px-4 flex justify-center gap-2">
                        <button onClick={() => showToast("جاري إرسال تذكير لولي الأمر...", "info")} className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-2 py-1 rounded text-xs font-bold transition-colors" title="إرسال تذكير لولي الأمر">
                           إرسال تذكير
                        </button>
                     </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        );

      case "attendance":
        return (
          <SectionCard 
            title="سجل ومراقبة غياب وحضور الطلاب"
            action={<button onClick={() => showToast("جاري تصدير السجل...", "info")} className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> تصدير</button>}
         >
            <div className="mb-4 flex gap-3 flex-wrap">
               <input type="date" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#e01c8a]/50" />
               <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 font-bold focus:outline-none focus:border-[#e01c8a]/50">
                  <option value="">تصفية بالمجموعة / الفوج</option>
                  <option value="1">باك-رياضيات-G1</option>
               </select>
               <input 
                  type="text" 
                  placeholder="ابحث عن طالب..." 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-1 focus:ring-[#e01c8a]/20"
               />
            </div>

            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 mt-6">
               <table className="w-full text-right border-collapse">
                 <thead>
                   <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                     <th className="py-3 px-4 font-black text-gray-500 text-xs">تاريخ الحصة</th>
                     <th className="py-3 px-4 font-black text-gray-500 text-xs">الطالب</th>
                     <th className="py-3 px-4 font-black text-gray-500 text-xs">المجموعة والمادة</th>
                     <th className="py-3 px-4 font-black text-gray-500 text-xs text-center">الحالة (مدخلة من المعلم)</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr className="border-b border-gray-50">
                     <td className="py-3 px-4 text-xs font-bold text-gray-600">12 مارس 2026 - 18:30</td>
                     <td className="py-3 px-4 font-black text-[#2d2d5e] text-sm">ياسين بنعلي</td>
                     <td className="py-3 px-4 text-sm font-bold text-gray-500">باك-رياضيات-G1</td>
                     <td className="py-3 px-4 text-center">
                       <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded-md text-xs">حاضر</span>
                     </td>
                   </tr>
                   <tr className="border-b border-gray-50">
                     <td className="py-3 px-4 text-xs font-bold text-gray-600">12 مارس 2026 - 18:30</td>
                     <td className="py-3 px-4 font-black text-[#2d2d5e] text-sm">مريم العلمي</td>
                     <td className="py-3 px-4 text-sm font-bold text-gray-500">باك-رياضيات-G1</td>
                     <td className="py-3 px-4 text-center">
                       <span className="bg-red-100 text-red-700 font-bold px-2 py-1 rounded-md text-xs">غائب</span>
                     </td>
                   </tr>
                 </tbody>
               </table>
            </div>
          </SectionCard>
        );

      case "announcements":
        return (
          <SectionCard 
            title="نشر الإعلانات للطلبة والآباء"
            action={<button onClick={() => setShowAddAnnouncementModal(true)} className="text-xs font-bold text-white bg-[#e01c8a] px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors">إضافة إعلان جديد</button>}
          >
            <div className="flex flex-col gap-4 mt-2">
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-md">الجميع</span>
                    <span className="text-xs text-gray-400 font-bold">نشر بواسطة: الإدارة - اليوم 10:00 ص</span>
                  </div>
                  <h4 className="font-black text-[#2d2d5e] text-base mb-2">تسجيلات مكثفة للامتحانات الوطنية</h4>
                  <p className="text-sm text-gray-600 font-medium max-w-2xl">
                    نعلمكم عن فتح باب التسجيل لفوج خاص بالامتحانات الوطنية لشهر يونيو. المقاعد محدودة يرجى التوجه للإدارة للتسجيل.
                  </p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => showToast("تعديل الإعلان...", "info")} className="text-gray-400 hover:text-[#e01c8a] transition-colors" title="تعديل"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                   <button onClick={() => showToast("جاري حذف الإعلان...", "info")} className="text-gray-400 hover:text-red-500 transition-colors" title="حذف"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-1 rounded-md">مجموعة: باك-رياضيات-G1</span>
                    <span className="text-xs text-gray-400 font-bold">نشر بواسطة: الإدارة نيابة عن أ.أحمد - أمس</span>
                  </div>
                  <h4 className="font-black text-[#2d2d5e] text-base mb-2">إلغاء حصة الغد</h4>
                  <p className="text-sm text-gray-600 font-medium max-w-2xl">
                    نظراً لظروف طارئة للأستاذ سيتم تأجيل حصة الغد الرياضيات إلى يوم الأحد صباحاً نفس القاعة.
                  </p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => showToast("تعديل الإعلان...", "info")} className="text-gray-400 hover:text-[#e01c8a] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                   <button onClick={() => showToast("جاري حذف الإعلان...", "info")} className="text-gray-400 hover:text-red-500 transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
              </div>
            </div>
          </SectionCard>
        );

      case "messages":
        return (
          <div className="h-[600px] flex bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-x divide-x-reverse divide-gray-100">
             {/* Conversations List Sidebar */}
             <div className="w-1/3 bg-gray-50/50 flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-white">
                   <div className="relative mb-3">
                      <input type="text" placeholder="البحث في الرسائل..." className="w-full bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#e01c8a]/20" />
                   </div>
                   <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button onClick={() => showToast("عرض الآباء والأولياء...", "info")} className="flex-1 py-1.5 text-xs font-bold bg-white text-[#e01c8a] rounded-lg shadow-sm">الآباء</button>
                      <button onClick={() => showToast("عرض الأساتذة والمعلمين...", "info")} className="flex-1 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700">الأساتذة</button>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                   <div className="p-3 bg-white rounded-xl border border-[#e01c8a]/30 shadow-sm cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-1.5 py-0.5 rounded-md">ولي أمر</span>
                         <h4 className="font-black text-[#2d2d5e] text-sm">أحمد (ولي أمر ياسين)</h4>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">السلام عليكم، أود الاستفسار عن إمكانية إضافة...</p>
                      <span className="text-[10px] text-[#e01c8a] font-bold mt-2 block">الآن</span>
                   </div>
                   <div className="p-3 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="bg-purple-100 text-purple-700 text-[9px] font-black px-1.5 py-0.5 rounded-md">أستاذ</span>
                         <h4 className="font-black text-gray-700 text-sm">أ. سارة (فيزياء)</h4>
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-1">هل يمكن حجز قاعة 107 يوم الأحد لدرس إضافي؟</p>
                      <span className="text-[10px] text-gray-400 mt-2 block">أمس</span>
                   </div>
                </div>
             </div>

             {/* Active Chat Thread */}
             <div className="flex-1 flex flex-col bg-white">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-[#e01c8a] font-black">أ</div>
                      <div>
                         <h3 className="font-black text-[#2d2d5e]">أحمد (ولي أمر ياسين)</h3>
                         <p className="text-xs text-gray-500 font-bold">ولي أمر • متصل مؤخراً</p>
                      </div>
                   </div>
                   <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg border border-gray-200">مراسلة الآباء</span>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-gray-50/20">
                   <div className="self-start max-w-md">
                      <div className="bg-gray-100 text-gray-700 border border-gray-200 p-3 rounded-2xl rounded-tr-none shadow-sm text-sm">
                         السلام عليكم، أود الاستفسار عن إمكانية إضافة حصة علوم فيزيائية لابني ياسين ضمن اشتراكات هذا الشهر.
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 text-right">أمس, 14:30</p>
                   </div>
                   
                   <div className="self-end max-w-md">
                      <div className="bg-[#e01c8a] text-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm">
                         وعليكم السلام، نعم يمكن ذلك. يرجى تأكيد الرغبة حتى يتم إضافته لجدول الأستاذة سارة، وتبلغ التكلفة 350 درهم تضاف لاشتراك الشهر القادم.
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 text-left">أمس, 15:45</p>
                   </div>
                </div>
                
                <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                   <button onClick={() => showToast("جاري اختيار ملف للإرسال...", "info")} className="text-gray-400 hover:text-[#e01c8a] transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg></button>
                   <input 
                      type="text" 
                      placeholder="اكتب ردك للآباء أو المعلمين..." 
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-2 focus:ring-[#e01c8a]/10 transition-all" 
                   />
                   <button onClick={() => showToast("جاري إرسال الرسالة...", "info")} className="w-12 h-12 bg-[#e01c8a] hover:bg-rose-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="-ml-1"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                   </button>
                </div>
             </div>
          </div>
        );

      default:
        return null;
    }
  }, [currentPage, unreadCount]);

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
                    <span className="text-white font-black text-lg">س</span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-white font-black text-lg tracking-wide">تسيير</span>
                    <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">سكرتيرة (دعم)</span>
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
                <NavBtn
                  label="الرئيسية"
                  icon={Icons.home}
                  active={currentPage === "home"}
                  onClick={() => setCurrentPage("home")}
                />
                
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
              <button onClick={handleLogout} className="group flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-black w-full text-right transition-all duration-300 text-white/80 hover:bg-rose-500/80 hover:text-white hover:shadow-lg hover:shadow-rose-500/30 border border-transparent hover:border-rose-400 mt-2">
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
                  <span className="text-[#e01c8a] hover:text-rose-600 transition-colors cursor-pointer">الإدارة (سكرتيرة)</span>
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
                    placeholder="بحث في النظام..." 
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
                              setCurrentPage(key as SecretairePageKey);
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
                      <span className="text-[#2d2d5e] font-black text-[15px]">التنبيهات الإدارية</span>
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
                          لا توجد تنبيهات جديدة
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden md:block w-px h-8 bg-gray-200 rounded-full mx-1"></div>

              <button className="flex items-center gap-3 p-1 pl-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-300 group">
                <div className="w-10 h-10 bg-linear-to-br from-[#e01c8a] to-rose-400 rounded-full flex items-center justify-center shadow-md shadow-rose-200 group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300 border-2 border-white ring-2 ring-transparent group-hover:ring-rose-100 shrink-0">
                  <span className="text-white font-black text-sm">س</span>
                </div>
                <div className="hidden md:flex flex-col leading-none text-right">
                  <span className="text-[#2d2d5e] font-black text-sm group-hover:text-[#e01c8a] transition-colors">سعاد</span>
                  <span className="text-gray-400 font-bold text-[10px] uppercase mt-1">سكرتيرة إدارية</span>
                </div>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f4f4f8]">
            {content}
          </main>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className={`px-6 py-3 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center gap-2 ${
                toastMessage.type === 'success' ? 'bg-green-500' :
                toastMessage.type === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              }`}>
                {toastMessage.type === 'success' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                {toastMessage.type === 'error' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>}
                {toastMessage.type === 'info' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>}
                {toastMessage.msg}
              </div>
            </div>
          )}

          {/* Add Student Modal */}
          {showAddStudentModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in scale-95 fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-[#2d2d5e]">إضافة طالب جديد</h2>
                  <button onClick={() => setShowAddStudentModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
                </div>
                <div className="space-y-4 mb-6">
                  <input 
                    type="text" 
                    placeholder="اسم الطالب الكامل" 
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-2 focus:ring-[#e01c8a]/10"
                  />
                  <select 
                    value={newStudent.level}
                    onChange={(e) => setNewStudent({...newStudent, level: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 font-bold focus:outline-none focus:border-[#e01c8a]/50"
                  >
                    <option value="">اختر المستوى</option>
                    <option value="tronc">الجدع المشترك</option>
                    <option value="bac1">الأولى باكالوريا</option>
                    <option value="bac2">الثانية باكالوريا</option>
                  </select>
                  <input 
                    type="email" 
                    placeholder="البريد الإلكتروني" 
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-2 focus:ring-[#e01c8a]/10"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setShowAddStudentModal(false);
                      showToast("تم إضافة الطالب بنجاح!", "success");
                      setNewStudent({ name: '', level: '', email: '' });
                    }}
                    className="flex-1 bg-[#e01c8a] hover:bg-rose-600 text-white font-black py-3 rounded-xl transition-colors"
                  >
                    إضافة
                  </button>
                  <button 
                    onClick={() => setShowAddStudentModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black py-3 rounded-xl transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Subject Modal */}
          {showAddSubjectModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in scale-95 fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-[#2d2d5e]">إضافة مادة جديدة</h2>
                  <button onClick={() => setShowAddSubjectModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
                </div>
                <div className="space-y-4 mb-6">
                  <input 
                    type="text" 
                    placeholder="اسم المادة" 
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-2 focus:ring-[#e01c8a]/10"
                  />
                  <input 
                    type="text" 
                    placeholder="اسم الأستاذ" 
                    value={newSubject.teacher}
                    onChange={(e) => setNewSubject({...newSubject, teacher: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-2 focus:ring-[#e01c8a]/10"
                  />
                  <input 
                    type="text" 
                    placeholder="السعر الشهري (درهم)" 
                    value={newSubject.price}
                    onChange={(e) => setNewSubject({...newSubject, price: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-2 focus:ring-[#e01c8a]/10"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setShowAddSubjectModal(false);
                      showToast("تم إضافة المادة بنجاح!", "success");
                      setNewSubject({ name: '', teacher: '', price: '' });
                    }}
                    className="flex-1 bg-[#e01c8a] hover:bg-rose-600 text-white font-black py-3 rounded-xl transition-colors"
                  >
                    إضافة
                  </button>
                  <button 
                    onClick={() => setShowAddSubjectModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black py-3 rounded-xl transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Group Modal */}
          {showAddGroupModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in scale-95 fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-[#2d2d5e]">إنشاء فوج جديد</h2>
                  <button onClick={() => setShowAddGroupModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
                </div>
                <div className="space-y-4 mb-6">
                  <input 
                    type="text" 
                    placeholder="اسم الفوج (مثل: باك-رياضيات-G1)" 
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-2 focus:ring-[#e01c8a]/10"
                  />
                  <select 
                    value={newGroup.subject}
                    onChange={(e) => setNewGroup({...newGroup, subject: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 font-bold focus:outline-none focus:border-[#e01c8a]/50"
                  >
                    <option value="">اختر المادة</option>
                    <option value="رياضيات">الرياضيات</option>
                    <option value="فيزياء">الفيزياء</option>
                    <option value="فرنسية">الفرنسية</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="الموعد الثابت (مثل: الإثنين 18:30)" 
                    value={newGroup.schedule}
                    onChange={(e) => setNewGroup({...newGroup, schedule: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-2 focus:ring-[#e01c8a]/10"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setShowAddGroupModal(false);
                      showToast("تم إنشاء الفوج بنجاح!", "success");
                      setNewGroup({ name: '', subject: '', schedule: '' });
                    }}
                    className="flex-1 bg-[#e01c8a] hover:bg-rose-600 text-white font-black py-3 rounded-xl transition-colors"
                  >
                    إنشاء
                  </button>
                  <button 
                    onClick={() => setShowAddGroupModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black py-3 rounded-xl transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Lesson Modal */}
          {showAddLessonModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in scale-95 fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-[#2d2d5e]">إضافة حصة استثنائية</h2>
                  <button onClick={() => setShowAddLessonModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
                </div>
                <div className="space-y-4 mb-6">
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 font-bold focus:outline-none focus:border-[#e01c8a]/50">
                    <option value="">اختر الفوج/المجموعة</option>
                    <option value="1">باك-رياضيات-G1</option>
                    <option value="2">باك-فيزياء-G2</option>
                  </select>
                  <input 
                    type="date" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e01c8a]/50"
                  />
                  <input 
                    type="time" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e01c8a]/50"
                  />
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 font-bold focus:outline-none focus:border-[#e01c8a]/50">
                    <option value="">اختر القاعة</option>
                    <option value="203">قاعة 203</option>
                    <option value="107">قاعة 107</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setShowAddLessonModal(false);
                      showToast("تم إضافة الحصة بنجاح!", "success");
                    }}
                    className="flex-1 bg-[#e01c8a] hover:bg-rose-600 text-white font-black py-3 rounded-xl transition-colors"
                  >
                    إضافة
                  </button>
                  <button 
                    onClick={() => setShowAddLessonModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black py-3 rounded-xl transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Announcement Modal */}
          {showAddAnnouncementModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-in scale-95 fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-[#2d2d5e]">إضافة إعلان جديد</h2>
                  <button onClick={() => setShowAddAnnouncementModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-black text-gray-600 mb-2">العنوان</label>
                    <input 
                      type="text" 
                      placeholder="عنوان الإعلان" 
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-2 focus:ring-[#e01c8a]/10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-600 mb-2">المحتوى</label>
                    <textarea 
                      placeholder="محتوى الإعلان..." 
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e01c8a]/50 focus:ring-2 focus:ring-[#e01c8a]/10 min-h-32 resize-none"
                    />
                  </div>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 font-bold focus:outline-none focus:border-[#e01c8a]/50">
                    <option value="">الجمهور المستهدف</option>
                    <option value="all">الجميع</option>
                    <option value="group1">باك-رياضيات-G1</option>
                    <option value="group2">باك-فيزياء-G2</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setShowAddAnnouncementModal(false);
                      showToast("تم نشر الإعلان بنجاح!", "success");
                      setNewAnnouncement({ title: '', content: '' });
                    }}
                    className="flex-1 bg-[#e01c8a] hover:bg-rose-600 text-white font-black py-3 rounded-xl transition-colors"
                  >
                    نشر
                  </button>
                  <button 
                    onClick={() => setShowAddAnnouncementModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black py-3 rounded-xl transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}