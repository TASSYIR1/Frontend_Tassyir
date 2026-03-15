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
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-md ${
      status === "مدفوع" ? "bg-green-500 text-white" : "bg-red-100 text-red-600"
    }`}>
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-l from-[#e01c8a] to-[#c0157a] rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-white font-black text-lg">{user.name}</p>
            <p className="text-white/70 text-xs mt-0.5">{user.id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-black text-xl transition-colors">×</button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-3">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className={`text-sm font-bold ${label === "حالة الدفع" ? "" : "text-[#2d2d5e]"}`}>
                {label === "حالة الدفع" ? <StatusBadge status={value} /> : value}
              </span>
              <span className="text-gray-400 text-xs">{label}</span>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6">
          <button onClick={onClose} className="w-full bg-[#e01c8a] hover:bg-[#c0157a] text-white font-bold text-sm py-2.5 rounded-xl transition-colors">
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-3xl">🗑️</div>
          <div>
            <p className="text-[#2d2d5e] font-black text-lg">حذف المستخدم</p>
            <p className="text-gray-500 text-sm mt-1">
              هل أنت متأكد من حذف <span className="font-bold text-[#2d2d5e]">{user.name}</span>؟
              <br />لا يمكن التراجع عن هذا الإجراء.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-sm py-2.5 rounded-xl transition-colors"
          >
            حذف
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm py-2.5 rounded-xl transition-colors"
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-[#2d2d5e] font-black text-lg">تعديل بيانات الطالب</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-black text-xl transition-colors">×</button>
        </div>
        <div className="p-6 flex flex-col gap-3">
          <Field label="الاسم واللقب"   value={form.name}   onChange={set("name")} />
          <Field label="المستوى الدراسي" value={form.level}  onChange={set("level")} />
          <Field label="تاريخ الميلاد"  value={form.dob}    onChange={set("dob")} />
          <Field label="ولي الأمر"       value={form.parent} onChange={set("parent")} />
          <div>
            <label className="text-gray-500 text-xs font-bold block mb-1">حالة الدفع</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "مدفوع" | "غير مدفوع" }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a]"
            >
              <option value="مدفوع">مدفوع</option>
              <option value="غير مدفوع">غير مدفوع</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={() => onSave(form)} className="flex-1 bg-[#e01c8a] hover:bg-[#c0157a] text-white font-bold text-sm py-2.5 rounded-xl transition-colors">حفظ</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm py-2.5 rounded-xl transition-colors">إلغاء</button>
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-[#2d2d5e] font-black text-lg">تعديل بيانات الأستاذ</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-black text-xl transition-colors">×</button>
        </div>
        <div className="p-6 flex flex-col gap-3">
          <Field label="الاسم واللقب" value={form.name}    onChange={set("name")} />
          <Field label="المواد"        value={form.subject} onChange={set("subject")} />
          <Field label="تاريخ الميلاد" value={form.dob}    onChange={set("dob")} />
          <Field label="رقم الهاتف"   value={form.phone}   onChange={set("phone")} />
          <div>
            <label className="text-gray-500 text-xs font-bold block mb-1">حالة الدفع</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "مدفوع" | "غير مدفوع" }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a]"
            >
              <option value="مدفوع">مدفوع</option>
              <option value="غير مدفوع">غير مدفوع</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={() => onSave(form)} className="flex-1 bg-[#e01c8a] hover:bg-[#c0157a] text-white font-bold text-sm py-2.5 rounded-xl transition-colors">حفظ</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm py-2.5 rounded-xl transition-colors">إلغاء</button>
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-[#2d2d5e] font-black text-lg">تعديل بيانات الإداري</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-black text-xl transition-colors">×</button>
        </div>
        <div className="p-6 flex flex-col gap-3">
          <Field label="الاسم واللقب" value={form.name}  onChange={set("name")} />
          <Field label="الدور"         value={form.role}  onChange={set("role")} />
          <Field label="تاريخ الميلاد" value={form.dob}  onChange={set("dob")} />
          <Field label="رقم الهاتف"   value={form.phone} onChange={set("phone")} />
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={() => onSave(form)} className="flex-1 bg-[#e01c8a] hover:bg-[#c0157a] text-white font-bold text-sm py-2.5 rounded-xl transition-colors">حفظ</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm py-2.5 rounded-xl transition-colors">إلغاء</button>
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-[#2d2d5e] font-black text-lg">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-black text-xl transition-colors">×</button>
        </div>
        <div className="p-6 flex flex-col gap-3">
          <Field label="الاسم واللقب"  value={name}   onChange={setName} />
          <Field label="تاريخ الميلاد" value={dob}    onChange={setDob} />
          <Field label={label1}         value={extra1} onChange={setExtra1} />
          <Field label={label2}         value={extra2} onChange={setExtra2} />
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={handleAdd} className="flex-1 bg-[#e01c8a] hover:bg-[#c0157a] text-white font-bold text-sm py-2.5 rounded-xl transition-colors">إضافة</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm py-2.5 rounded-xl transition-colors">إلغاء</button>
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
      <div className="flex items-center gap-1.5">
        <button
          title="حذف"
          onClick={() => setDeleteUser(user)}
          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors text-base"
        >🗑️</button>
        <button
          title="تعديل"
          onClick={() => setEditUser(user)}
          className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-500 transition-colors text-base"
        >✏️</button>
        <button
          title="عرض"
          onClick={() => setViewUser(user)}
          className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors text-base"
        >👁️</button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPage(tab.key)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-[#e01c8a]/20 text-[#e01c8a] border border-[#e01c8a]/30"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-[#2d2d5e] font-bold text-sm">{listTitle}</p>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-[#e01c8a] hover:bg-[#c0157a] transition-colors text-white font-bold text-sm px-4 py-2 rounded-xl shadow"
          >
            <span className="text-lg font-light">+</span>
            <span>{addLabel}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          {/* ── Students table ── */}
          {activeTab === "students" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["المعرف", "الاسم واللقب", "المستوى الدراسي", "تاريخ الميلاد", "حالة الدفع", "ولي الامر", "الاجراءات"].map((h) => (
                    <th key={h} className="px-4 py-3 text-gray-500 font-semibold text-right whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-[#2d2d5e] font-medium">{s.id}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.level}</td>
                    <td className="px-4 py-3 text-gray-600">{s.dob}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3 text-gray-600">{s.parent}</td>
                    <td className="px-4 py-3"><Actions user={s} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ── Teachers table ── */}
          {activeTab === "teachers" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["المعرف", "الاسم واللقب", "المواد", "تاريخ الميلاد", "حالة الدفع", "رقم الهاتف", "الاجراءات"].map((h) => (
                    <th key={h} className="px-4 py-3 text-gray-500 font-semibold text-right whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-[#2d2d5e] font-medium">{t.id}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{t.name}</td>
                    <td className="px-4 py-3 text-gray-600">{t.subject}</td>
                    <td className="px-4 py-3 text-gray-600">{t.dob}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3 text-gray-600">{t.phone}</td>
                    <td className="px-4 py-3"><Actions user={t} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ── Admins table ── */}
          {activeTab === "admins" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["المعرف", "الاسم واللقب", "الدور", "تاريخ الميلاد", "حالة الدفع", "رقم الهاتف", "الاجراءات"].map((h) => (
                    <th key={h} className="px-4 py-3 text-gray-500 font-semibold text-right whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-[#2d2d5e] font-medium">{a.id}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{a.name}</td>
                    <td className="px-4 py-3 text-gray-600">{a.role}</td>
                    <td className="px-4 py-3 text-gray-600">{a.dob}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3 text-gray-600">{a.phone}</td>
                    <td className="px-4 py-3"><Actions user={a} /></td>
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