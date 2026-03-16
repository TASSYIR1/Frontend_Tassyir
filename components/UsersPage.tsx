"use client";

import { useState } from "react";
import { PageKey } from "./types";

// ── Types ──────────────────────────────────────────────────────
interface Student {
  id: string;
  name: string;
  level: string;
  dob: string;
  status: "مدفوع" | "غير مدفوع";
  parent: string;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  dob: string;
  status: "مدفوع" | "غير مدفوع";
  phone: string;
}

interface Admin {
  id: string;
  name: string;
  role: string;
  dob: string;
  status: "مدفوع" | "غير مدفوع";
  phone: string;
}

type AnyUser = Student | Teacher | Admin;

// ── Initial data ───────────────────────────────────────────────
const initialStudents: Student[] = Array.from({ length: 14 }, (_, i) => ({
  id: `STD${234 + i}`,
  name: i % 3 === 0 ? "بن سالم اجم" : i % 3 === 1 ? "عمراني يوسف" : "بوزيد سارة",
  level: i % 3 === 0 ? "ثانية ثانوي" : i % 3 === 1 ? "أولى ثانوي" : "ثالثة ثانوي",
  dob: `${String(10 + (i % 20)).padStart(2, "0")}/01/2010`,
  status: i % 5 === 4 ? "غير مدفوع" : "مدفوع",
  parent: `07 7${i} 77 77 77`,
}));

const initialTeachers: Teacher[] = Array.from({ length: 13 }, (_, i) => ({
  id: `TCH${100 + i}`,
  name: i % 3 === 0 ? "بن علي محمد" : i % 3 === 1 ? "حمداني فاطمة" : "مزهود كريم",
  subject: i % 3 === 0 ? "رياضيات - فيزياء" : i % 3 === 1 ? "عربية - تاريخ" : "فرنسية - انجليزية",
  dob: `${String(5 + (i % 25)).padStart(2, "0")}/06/198${i % 9}`,
  status: i % 6 === 5 ? "غير مدفوع" : "مدفوع",
  phone: `06 6${i} 66 66 66`,
}));

const initialAdmins: Admin[] = Array.from({ length: 8 }, (_, i) => ({
  id: `ADM${100 + i}`,
  name: i % 2 === 0 ? "بوكرمة نادية" : "سالم عبد الرحمان",
  role: i % 3 === 0 ? "إداري رئيسي" : i % 3 === 1 ? "محاسب" : "سكرتير",
  dob: `${String(3 + (i % 27)).padStart(2, "0")}/03/197${i % 9}`,
  status: "مدفوع",
  phone: `05 5${i} 55 55 55`,
}));

// ── Props ──────────────────────────────────────────────────────
interface UsersPageProps {
  activeTab: "students" | "teachers" | "admins";
  setPage: (p: PageKey) => void;
}

const tabs: { label: string; key: "students" | "teachers" | "admins" }[] = [
  { label: "الطلاب",    key: "students" },
  { label: "الاساتذة",  key: "teachers" },
  { label: "الاداريون", key: "admins"   },
];

// ── Shared field input ─────────────────────────────────────────
function Field({
  label, value, onChange, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="text-gray-500 text-xs font-bold block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a] transition-colors"
      />
    </div>
  );
}

// ── Status badge ───────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const isPaid = status === "مدفوع";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border ${
      isPaid ? "bg-green-50 text-green-600 border-green-100/50" : "bg-red-50 text-red-500 border-red-100/50"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-green-500" : "bg-red-500"}`}></span>
      {status}
    </span>
  );
}

// ── View Modal ─────────────────────────────────────────────────
function ViewModal({ user, tab, onClose }: { user: AnyUser; tab: string; onClose: () => void }) {
  const fields: { label: string; value: string }[] = [
    { label: "المعرف", value: user.id },
    { label: "الاسم واللقب", value: user.name },
    { label: "تاريخ الميلاد", value: user.dob },
    { label: "حالة الدفع", value: user.status },
    ...(tab === "students"
      ? [
          { label: "المستوى الدراسي", value: (user as Student).level },
          { label: "ولي الأمر", value: (user as Student).parent },
        ]
      : tab === "teachers"
      ? [
          { label: "المواد", value: (user as Teacher).subject },
          { label: "رقم الهاتف", value: (user as Teacher).phone },
        ]
      : [
          { label: "الدور", value: (user as Admin).role },
          { label: "رقم الهاتف", value: (user as Admin).phone },
        ]),
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-[#e01c8a]/20 to-transparent rounded-full -z-10"></div>
        {/* Header */}
        <div className="bg-gradient-to-l from-[#e01c8a] to-[#c0157a] px-6 py-6 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-sm"></div>
          <div className="relative z-10">
            <p className="text-white font-black text-2xl mb-1">{user.name}</p>
            <p className="inline-block bg-white/20 text-white font-medium text-xs px-3 py-1 rounded-full">{user.id}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all backdrop-blur-md relative z-10 shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-1">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded-xl transition-colors">
              <span className={`text-sm font-black ${label === "حالة الدفع" ? "" : "text-[#2d2d5e]"} ${label === "الحالة" ? "" : "order-1"}`}>
                {label === "حالة الدفع" ? <StatusBadge status={value} /> : value}
              </span>
              <span className="text-gray-400 font-bold text-xs order-2">{label}</span>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 bg-gray-50/30 pt-4 border-t border-gray-50">
          <button onClick={onClose} className="w-full bg-[#e01c8a] hover:bg-[#c0157a] hover:-translate-y-0.5 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-[0_4px_15px_-3px_rgba(224,28,138,0.4)]">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ───────────────────────────────────────────────
function DeleteModal({ user, onConfirm, onClose }: {
  user: AnyUser; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10"></div>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 shadow-inner border border-red-200">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </div>
          <div>
            <p className="text-[#2d2d5e] font-black text-xl">حذف المستخدم</p>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              هل أنت متأكد من حذف <span className="font-bold text-[#e01c8a]">{user.name}</span>؟
              <br />لا يمكن التراجع عن هذا الإجراء.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-[0_4px_15px_-3px_rgba(239,68,68,0.4)] hover:scale-[1.02]"
          >
            تأكيد الحذف
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm py-3 rounded-xl transition-all"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal (student) ───────────────────────────────────────
function EditStudentModal({ student, onSave, onClose }: {
  student: Student; onSave: (s: Student) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({ ...student });
  const set = (k: keyof Student) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-[#2d2d5e] font-black text-lg flex items-center gap-2">
            <span className="w-2 h-6 bg-[#5B8FF9] rounded-full"></span>
            تعديل بيانات الطالب
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white hover:bg-gray-200 border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <Field label="الاسم واللقب"   value={form.name}   onChange={set("name")} />
          <Field label="المستوى الدراسي" value={form.level}  onChange={set("level")} />
          <Field label="تاريخ الميلاد"  value={form.dob}    onChange={set("dob")} />
          <Field label="ولي الأمر"       value={form.parent} onChange={set("parent")} />
          <div>
            <label className="text-gray-500 text-xs font-bold block mb-1">حالة الدفع</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "مدفوع" | "غير مدفوع" }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#5B8FF9] bg-white transition-all shadow-sm"
            >
              <option value="مدفوع">مدفوع</option>
              <option value="غير مدفوع">غير مدفوع</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6 bg-gray-50/30 pt-4 border-t border-gray-50">
          <button onClick={() => onSave(form)} className="flex-1 bg-[#5B8FF9] hover:bg-blue-600 hover:-translate-y-0.5 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-[0_4px_15px_-3px_rgba(91,143,249,0.4)]">حفظ التغييرات</button>
          <button onClick={onClose} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-sm py-3 rounded-xl transition-all">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal (teacher) ───────────────────────────────────────
function EditTeacherModal({ teacher, onSave, onClose }: {
  teacher: Teacher; onSave: (t: Teacher) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({ ...teacher });
  const set = (k: keyof Teacher) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-[#2d2d5e] font-black text-lg flex items-center gap-2">
            <span className="w-2 h-6 bg-[#5B8FF9] rounded-full"></span>
            تعديل بيانات الأستاذ
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white hover:bg-gray-200 border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <Field label="الاسم واللقب" value={form.name}    onChange={set("name")} />
          <Field label="المواد"        value={form.subject} onChange={set("subject")} />
          <Field label="تاريخ الميلاد" value={form.dob}    onChange={set("dob")} />
          <Field label="رقم الهاتف"   value={form.phone}   onChange={set("phone")} />
          <div>
            <label className="text-gray-500 text-xs font-bold block mb-1">حالة الدفع</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "مدفوع" | "غير مدفوع" }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#5B8FF9] bg-white transition-all shadow-sm"
            >
              <option value="مدفوع">مدفوع</option>
              <option value="غير مدفوع">غير مدفوع</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6 bg-gray-50/30 pt-4 border-t border-gray-50">
          <button onClick={() => onSave(form)} className="flex-1 bg-[#5B8FF9] hover:bg-blue-600 hover:-translate-y-0.5 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-[0_4px_15px_-3px_rgba(91,143,249,0.4)]">حفظ التغييرات</button>
          <button onClick={onClose} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-sm py-3 rounded-xl transition-all">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal (admin) ─────────────────────────────────────────
function EditAdminModal({ admin, onSave, onClose }: {
  admin: Admin; onSave: (a: Admin) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({ ...admin });
  const set = (k: keyof Admin) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-[#2d2d5e] font-black text-lg flex items-center gap-2">
            <span className="w-2 h-6 bg-[#5B8FF9] rounded-full"></span>
            تعديل بيانات الإداري
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white hover:bg-gray-200 border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <Field label="الاسم واللقب" value={form.name}  onChange={set("name")} />
          <Field label="الدور"         value={form.role}  onChange={set("role")} />
          <Field label="تاريخ الميلاد" value={form.dob}  onChange={set("dob")} />
          <Field label="رقم الهاتف"   value={form.phone} onChange={set("phone")} />
        </div>
        <div className="flex gap-3 px-6 pb-6 bg-gray-50/30 pt-4 border-t border-gray-50">
          <button onClick={() => onSave(form)} className="flex-1 bg-[#5B8FF9] hover:bg-blue-600 hover:-translate-y-0.5 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-[0_4px_15px_-3px_rgba(91,143,249,0.4)]">حفظ التغييرات</button>
          <button onClick={onClose} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-sm py-3 rounded-xl transition-all">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ── Add Modal ──────────────────────────────────────────────────
function AddModal({ tab, onAdd, onClose }: {
  tab: "students" | "teachers" | "admins";
  onAdd: (u: AnyUser) => void;
  onClose: () => void;
}) {
  const [name, setName]       = useState("");
  const [dob, setDob]         = useState("");
  const [extra1, setExtra1]   = useState("");
  const [extra2, setExtra2]   = useState("");

  const title    = tab === "students" ? "إضافة طالب جديد" : tab === "teachers" ? "إضافة أستاذ جديد" : "إضافة إداري جديد";
  const label1   = tab === "students" ? "المستوى الدراسي" : tab === "teachers" ? "المواد" : "الدور";
  const label2   = tab === "students" ? "ولي الأمر / هاتف" : "رقم الهاتف";

  const handleAdd = () => {
    if (!name.trim()) return;
    const base = { id: `${tab.slice(0, 3).toUpperCase()}${Date.now()}`, name, dob, status: "مدفوع" as const };
    if (tab === "students") onAdd({ ...base, level: extra1, parent: extra2 });
    else if (tab === "teachers") onAdd({ ...base, subject: extra1, phone: extra2 });
    else onAdd({ ...base, role: extra1, phone: extra2 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-[#2d2d5e] font-black text-lg flex items-center gap-2">
            <span className="w-2 h-6 bg-[#e01c8a] rounded-full"></span>
            {title}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white hover:bg-gray-200 border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <Field label="الاسم واللقب"  value={name}   onChange={setName} />
          <Field label="تاريخ الميلاد" value={dob}    onChange={setDob} />
          <Field label={label1}         value={extra1} onChange={setExtra1} />
          <Field label={label2}         value={extra2} onChange={setExtra2} />
        </div>
        <div className="flex gap-3 px-6 pb-6 bg-gray-50/30 pt-4 border-t border-gray-50">
          <button onClick={handleAdd} className="flex-1 bg-[#e01c8a] hover:bg-[#c0157a] hover:-translate-y-0.5 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-[0_4px_15px_-3px_rgba(224,28,138,0.4)]">إضافة</button>
          <button onClick={onClose} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-sm py-3 rounded-xl transition-all">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function UsersPage({ activeTab, setPage }: UsersPageProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [admins,   setAdmins]   = useState<Admin[]>(initialAdmins);

  const [showAdd,    setShowAdd]    = useState(false);
  const [viewUser,   setViewUser]   = useState<AnyUser | null>(null);
  const [editUser,   setEditUser]   = useState<AnyUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AnyUser | null>(null);

  // ── Handlers ──
  const handleDelete = () => {
    if (!deleteUser) return;
    if (activeTab === "students") setStudents((s) => s.filter((x) => x.id !== deleteUser.id));
    if (activeTab === "teachers") setTeachers((t) => t.filter((x) => x.id !== deleteUser.id));
    if (activeTab === "admins")   setAdmins((a) => a.filter((x) => x.id !== deleteUser.id));
    setDeleteUser(null);
  };

  const handleSaveEdit = (updated: AnyUser) => {
    if (activeTab === "students") setStudents((s) => s.map((x) => x.id === updated.id ? updated as Student : x));
    if (activeTab === "teachers") setTeachers((t) => t.map((x) => x.id === updated.id ? updated as Teacher : x));
    if (activeTab === "admins")   setAdmins((a) => a.map((x) => x.id === updated.id ? updated as Admin : x));
    setEditUser(null);
  };

  const handleAdd = (u: AnyUser) => {
    if (activeTab === "students") setStudents((s) => [u as Student, ...s]);
    if (activeTab === "teachers") setTeachers((t) => [u as Teacher, ...t]);
    if (activeTab === "admins")   setAdmins((a) => [u as Admin, ...a]);
  };

  const addLabel   = activeTab === "students" ? "طالب جديد"  : activeTab === "teachers" ? "استاذ جديد" : "اداري جديد";
  const listTitle  = activeTab === "students" ? "قائمة الطلاب داخل المؤسسة" : activeTab === "teachers" ? "قائمة الاساتذة داخل المؤسسة" : "قائمة الاداريين داخل المؤسسة";

  // ── Action buttons ──
  function Actions({ user }: { user: AnyUser }) {
    return (
      <div className="flex items-center gap-2">
        <button
          title="حذف"
          onClick={() => setDeleteUser(user)}
          className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white flex items-center justify-center text-red-500 transition-all text-base shadow-sm border border-red-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
        <button
          title="تعديل"
          onClick={() => setEditUser(user)}
          className="w-8 h-8 rounded-xl bg-blue-50 hover:bg-[#5B8FF9] hover:text-white flex items-center justify-center text-[#5B8FF9] transition-all text-base shadow-sm border border-blue-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
        </button>
        <button
          title="عرض"
          onClick={() => setViewUser(user)}
          className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-700 hover:text-white flex items-center justify-center text-gray-500 transition-all text-base shadow-sm border border-gray-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#2d2d5e] mb-1">إدارة المستخدمين</h1>
          <p className="text-sm font-semibold text-gray-500">إدارة تفاصيل الطلاب، الأساتذة، والإداريين</p>
        </div>
        <div className="p-3 bg-purple-500/10 rounded-2xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_-2px_rgba(0,0,0,0.02)] w-fit gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPage(tab.key)}
            className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-[#e01c8a] text-white shadow-md shadow-[#e01c8a]/20"
                : "bg-transparent text-gray-500 hover:text-[#e01c8a] hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 bg-white">
          <div className="flex items-center gap-3">
             <div className="w-2 h-6 bg-[#5B8FF9] rounded-full"></div>
             <p className="text-[#2d2d5e] font-black text-lg">{listTitle}</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="group flex items-center gap-2 bg-[#e01c8a] hover:bg-[#c0157a] hover:scale-[1.02] transition-all duration-300 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-[0_4px_15px_-3px_rgba(224,28,138,0.4)]"
          >
            <span className="text-xl font-medium mb-1 group-hover:rotate-90 transition-transform duration-300">+</span>
            <span>{addLabel}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          {/* ── Students table ── */}
          {activeTab === "students" && (
            <table className="w-full text-sm border-collapse min-w-[900px]">
              <thead className="bg-[#f8f9fc]/50 border-b border-gray-100">
                <tr>
                  {["المعرف", "الاسم واللقب", "المستوى الدراسي", "تاريخ الميلاد", "حالة الدفع", "ولي الامر", "الاجراءات"].map((h) => (
                    <th key={h} className="px-6 py-4 text-gray-400 font-black text-xs text-right whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-pink-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs font-bold border border-gray-100">{s.id}</span>
                    </td>
                    <td className="px-6 py-4 text-[#2d2d5e] font-black">{s.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-[#5B8FF9] rounded-xl text-xs font-bold border border-blue-100">{s.level}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-bold">{s.dob}</td>
                    <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                    <td className="px-6 py-4 text-gray-500 font-bold">{s.parent}</td>
                    <td className="px-6 py-4"><Actions user={s} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ── Teachers table ── */}
          {activeTab === "teachers" && (
            <table className="w-full text-sm border-collapse min-w-[900px]">
              <thead className="bg-[#f8f9fc]/50 border-b border-gray-100">
                <tr>
                  {["المعرف", "الاسم واللقب", "المواد", "تاريخ الميلاد", "حالة الدفع", "رقم الهاتف", "الاجراءات"].map((h) => (
                    <th key={h} className="px-6 py-4 text-gray-400 font-black text-xs text-right whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-pink-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs font-bold border border-gray-100">{t.id}</span>
                    </td>
                    <td className="px-6 py-4 text-[#2d2d5e] font-black">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-black border border-purple-100">
                          {t.name.split(" ")[0][0]}
                        </div>
                        {t.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-pink-50 text-[#e01c8a] rounded-xl text-xs font-bold border border-pink-100">{t.subject}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-bold">{t.dob}</td>
                    <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                    <td className="px-6 py-4 text-gray-500 font-bold" dir="ltr">{t.phone}</td>
                    <td className="px-6 py-4"><Actions user={t} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ── Admins table ── */}
          {activeTab === "admins" && (
            <table className="w-full text-sm border-collapse min-w-[900px]">
              <thead className="bg-[#f8f9fc]/50 border-b border-gray-100">
                <tr>
                  {["المعرف", "الاسم واللقب", "الدور", "تاريخ الميلاد", "حالة الدفع", "رقم الهاتف", "الاجراءات"].map((h) => (
                    <th key={h} className="px-6 py-4 text-gray-400 font-black text-xs text-right whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {admins.map((a) => (
                  <tr key={a.id} className="hover:bg-pink-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs font-bold border border-gray-100">{a.id}</span>
                    </td>
                    <td className="px-6 py-4 text-[#2d2d5e] font-black">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center font-black border border-orange-100">
                          {a.name.split(" ")[0][0]}
                        </div>
                        {a.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-xl text-xs font-bold border border-green-100">{a.role}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-bold">{a.dob}</td>
                    <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
                    <td className="px-6 py-4 text-gray-500 font-bold" dir="ltr">{a.phone}</td>
                    <td className="px-6 py-4"><Actions user={a} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {showAdd && (
        <AddModal tab={activeTab} onAdd={handleAdd} onClose={() => setShowAdd(false)} />
      )}

      {viewUser && (
        <ViewModal user={viewUser} tab={activeTab} onClose={() => setViewUser(null)} />
      )}

      {deleteUser && (
        <DeleteModal user={deleteUser} onConfirm={handleDelete} onClose={() => setDeleteUser(null)} />
      )}

      {editUser && activeTab === "students" && (
        <EditStudentModal student={editUser as Student} onSave={handleSaveEdit} onClose={() => setEditUser(null)} />
      )}
      {editUser && activeTab === "teachers" && (
        <EditTeacherModal teacher={editUser as Teacher} onSave={handleSaveEdit} onClose={() => setEditUser(null)} />
      )}
      {editUser && activeTab === "admins" && (
        <EditAdminModal admin={editUser as Admin} onSave={handleSaveEdit} onClose={() => setEditUser(null)} />
      )}
    </div>
  );
}
