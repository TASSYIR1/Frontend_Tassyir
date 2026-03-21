"use client";

import { useEffect, useState } from "react";
import { academicService } from "@/lib/api/academic.service";
import type { RecordMap } from "@/lib/api/types";

// ── Types ──────────────────────────────────────────────────────
interface ClassCard {
  id: string;
  teacher: string;
  group: string;
  schedule: string;
  room: string;
  students: number;
  subject: string;
  level: "أولى ثانوي" | "ثانية ثانوي" | "ثالثة ثانوي";
}

// ── Data ───────────────────────────────────────────────────────
const subjects = ["رياضيات", "فيزياء", "عربية", "فرنسية", "انجليزية", "تاريخ", "علوم"];
const levels: ClassCard["level"][] = ["أولى ثانوي", "ثانية ثانوي", "ثالثة ثانوي"];
const schedules = [
  "الاثنين، الخميس - 17:00 - 19:00",
  "الثلاثاء، الجمعة - 09:00 - 11:00",
  "الأحد، الأربعاء - 14:00 - 16:00",
  "السبت، الثلاثاء - 10:00 - 12:00",
];
const teachers = [
  "سليماني تيسير",
  "بن علي محمد",
  "حمداني فاطمة",
  "مزهود كريم",
  "بوزيد سارة",
];

const allClasses: ClassCard[] = [];

const toText = (value: unknown, fallback = "") =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const mapClassFromApi = (row: RecordMap, index: number): ClassCard => {
  const levelLabel = toText(row.level_label, toText(row.levelLabel, "أولى ثانوي"));
  const safeLevel: ClassCard["level"] = levels.includes(levelLabel as ClassCard["level"])
    ? (levelLabel as ClassCard["level"])
    : "أولى ثانوي";

  return {
    id: toText(row.id, `CLS-${100 + index}`),
    teacher: toText(row.teacher_name, toText(row.teacherName, toText(row.teacher, teachers[index % teachers.length]))),
    group: toText(row.name, toText(row.group_name, `الفوج ${(index % 5) + 1}`)),
    schedule: toText(row.schedule_label, toText(row.schedule, schedules[index % schedules.length])),
    room: toText(row.room_name, toText(row.roomName, "--")),
    students: toNumber(row.students_count, toNumber(row.studentCount, 0)),
    subject: toText(row.subject_name, toText(row.subjectName, subjects[index % subjects.length])),
    level: safeLevel,
  };
};

const toClassApiPayload = (cls: ClassCard): RecordMap => ({
  name: cls.group,
  levelLabel: cls.level,
  roomName: cls.room,
  subjectName: cls.subject,
  scheduleLabel: cls.schedule,
  studentsCount: cls.students,
  teacherName: cls.teacher,
});

// ── View / Edit / Delete Modals ────────────────────────────────
function ViewModal({ cls, onClose }: { cls: ClassCard; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-l from-[#e01c8a] to-[#c0157a] rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-white font-black text-lg">{cls.subject}</p>
            <p className="text-white/70 text-xs mt-0.5">{cls.id} · {cls.level}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-black text-xl transition-colors">×</button>
        </div>
        <div className="p-6 flex flex-col gap-3">
          {[
            { label: "الاستاذ",      value: `الاستاذ ${cls.teacher}` },
            { label: "الفوج",        value: cls.group },
            { label: "التوقيت",      value: cls.schedule },
            { label: "القاعة",       value: `القاعة ${cls.room}` },
            { label: "عدد التلاميذ", value: String(cls.students) },
            { label: "المادة",       value: cls.subject },
            { label: "المستوى",      value: cls.level },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-[#2d2d5e] font-bold text-sm">{value}</span>
              <span className="text-gray-400 text-xs">{label}</span>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          <button onClick={onClose} className="w-full bg-[#e01c8a] hover:bg-[#c0157a] text-white font-bold text-sm py-2.5 rounded-xl transition-colors">إغلاق</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ cls, onSave, onClose }: {
  cls: ClassCard; onSave: (c: ClassCard) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({ ...cls });
  const set = (k: keyof ClassCard) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-[#2d2d5e] font-black text-lg">تعديل الفصل</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-black text-xl transition-colors">×</button>
        </div>
        <div className="p-6 flex flex-col gap-3">
          {[
            { label: "الاستاذ",  key: "teacher"  as keyof ClassCard },
            { label: "الفوج",    key: "group"    as keyof ClassCard },
            { label: "التوقيت",  key: "schedule" as keyof ClassCard },
            { label: "القاعة",   key: "room"     as keyof ClassCard },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-gray-500 text-xs font-bold block mb-1">{label}</label>
              <input
                value={String(form[key])}
                onChange={(e) => set(key)(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a] transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="text-gray-500 text-xs font-bold block mb-1">عدد التلاميذ</label>
            <input
              type="number"
              value={form.students}
              onChange={(e) => setForm((f) => ({ ...f, students: Number(e.target.value) }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a] transition-colors"
            />
          </div>
          <div>
            <label className="text-gray-500 text-xs font-bold block mb-1">المادة</label>
            <select
              value={form.subject}
              onChange={(e) => set("subject")(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a]"
            >
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs font-bold block mb-1">المستوى</label>
            <select
              value={form.level}
              onChange={(e) => set("level")(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a]"
            >
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
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

function DeleteModal({ cls, onConfirm, onClose }: {
  cls: ClassCard; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-3xl">🗑️</div>
          <div>
            <p className="text-[#2d2d5e] font-black text-lg">حذف الفصل</p>
            <p className="text-gray-500 text-sm mt-1">
              هل أنت متأكد من حذف فصل <span className="font-bold text-[#2d2d5e]">{cls.subject}</span> - {cls.group}؟
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-sm py-2.5 rounded-xl transition-colors">حذف</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm py-2.5 rounded-xl transition-colors">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

function AddModal({ onAdd, onClose }: { onAdd: (c: ClassCard) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<ClassCard, "id">>({
    teacher: "", group: "", schedule: "", room: "", students: 30,
    subject: subjects[0], level: "أولى ثانوي",
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.teacher.trim()) return;
    onAdd({ ...form, id: `CLS-${Date.now()}` });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-[#2d2d5e] font-black text-lg">إضافة فصل جديد</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-black text-xl transition-colors">×</button>
        </div>
        <div className="p-6 flex flex-col gap-3">
          {[
            { label: "الاستاذ",  key: "teacher"  as keyof typeof form },
            { label: "الفوج",    key: "group"    as keyof typeof form },
            { label: "التوقيت",  key: "schedule" as keyof typeof form },
            { label: "القاعة",   key: "room"     as keyof typeof form },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-gray-500 text-xs font-bold block mb-1">{label}</label>
              <input
                value={String(form[key])}
                onChange={(e) => set(key)(e.target.value)}
                placeholder={`أدخل ${label}`}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a] transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="text-gray-500 text-xs font-bold block mb-1">عدد التلاميذ</label>
            <input
              type="number"
              value={form.students}
              onChange={(e) => setForm((f) => ({ ...f, students: Number(e.target.value) }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a] transition-colors"
            />
          </div>
          <div>
            <label className="text-gray-500 text-xs font-bold block mb-1">المادة</label>
            <select value={form.subject} onChange={(e) => set("subject")(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a]">
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs font-bold block mb-1">المستوى</label>
            <select value={form.level} onChange={(e) => set("level")(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a]">
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={handleAdd} className="flex-1 bg-[#e01c8a] hover:bg-[#c0157a] text-white font-bold text-sm py-2.5 rounded-xl transition-colors">إضافة</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm py-2.5 rounded-xl transition-colors">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ── Single Class Card ──────────────────────────────────────────
function ClassCardComponent({ cls, onView, onEdit, onDelete }: {
  cls: ClassCard;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group bg-white border border-gray-100/80 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex gap-4 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e01c8a]/5 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-125 duration-500"></div>

      {/* Action buttons column */}
      <div className="flex flex-col gap-2 flex-shrink-0 z-10">
        <button
          onClick={onView}
          className="flex flex-col items-center justify-center gap-1 bg-blue-50/50 hover:bg-blue-100 text-blue-600 rounded-2xl w-14 h-14 transition-colors border border-blue-100/50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          <span className="text-[10px] font-black">معاينة</span>
        </button>
        <button
          onClick={onEdit}
          className="flex flex-col items-center justify-center gap-1 bg-green-50/50 hover:bg-green-100 text-green-600 rounded-2xl w-14 h-14 transition-colors border border-green-100/50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          <span className="text-[10px] font-black">تعديل</span>
        </button>
        <button
          onClick={onDelete}
          className="flex flex-col items-center justify-center gap-1 bg-red-50/50 hover:bg-red-100 text-red-500 rounded-2xl w-14 h-14 transition-colors border border-red-100/50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          <span className="text-[10px] font-black">حذف</span>
        </button>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-3 text-right z-10 py-1">
        {/* Subject badge + ID */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-gray-400 font-bold bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">{cls.id}</span>
          <span className="text-xs font-black text-[#e01c8a] bg-[#e01c8a]/10 px-3 py-1 rounded-xl border border-[#e01c8a]/20 shadow-sm">{cls.subject}</span>
        </div>

        <div className="flex flex-col gap-2.5">
          <InfoLine icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#5B8FF9]"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>} text={`الاستاذ ${cls.teacher}`} bold />
          <InfoLine icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#e01c8a]"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>} text={cls.group} />
          <div className="w-full h-px bg-gray-50 my-0.5"></div>
          <InfoLine icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>} text={cls.schedule} />
          <InfoLine icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>} text={`القاعة ${cls.room}`} />
          <InfoLine icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>} text={`عدد التلاميذ : ${cls.students}`} />
        </div>
      </div>
    </div>
  );
}

function InfoLine({ icon, text, bold }: { icon: React.ReactNode; text: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-end gap-2.5 group/line">
      <span className={`text-[13px] ${bold ? "text-[#2d2d5e] font-black" : "text-gray-600 font-bold"}`}>{text}</span>
      <span className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover/line:scale-110 transition-transform">{icon}</span>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function ClassesPage() {
  const [classes, setClasses]         = useState<ClassCard[]>(allClasses);
  const [activeLevel, setActiveLevel] = useState<ClassCard["level"]>("أولى ثانوي");
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [search, setSearch]           = useState("");

  const [showAdd,    setShowAdd]    = useState(false);
  const [viewCard,   setViewCard]   = useState<ClassCard | null>(null);
  const [editCard,   setEditCard]   = useState<ClassCard | null>(null);
  const [deleteCard, setDeleteCard] = useState<ClassCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const rows = await academicService.getClasses();
        setClasses(rows.map((row, index) => mapClassFromApi(row, index)));
      } catch {
        setClasses(allClasses);
      } finally {
        setLoading(false);
      }
    };

    void loadClasses();
  }, []);

  // ── Filtered classes ──
  const filtered = classes.filter((c) => {
    const matchLevel   = c.level === activeLevel;
    const matchSubject = activeSubject === null || c.subject === activeSubject;
    const matchSearch  = search.trim() === "" || [c.teacher, c.group, c.room, c.subject].some((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    );
    return matchLevel && matchSubject && matchSearch;
  });

  // ── Subjects available for active level ──
  const availableSubjects = Array.from(new Set(
    classes.filter((c) => c.level === activeLevel).map((c) => c.subject)
  ));

  // ── Handlers ──
  const handleDelete = async () => {
    if (!deleteCard) return;
    try {
      await academicService.deleteClass(deleteCard.id);
      setClasses((prev) => prev.filter((c) => c.id !== deleteCard.id));
    } catch {
      alert("تعذر حذف الفصل من الخادم");
    }
    setDeleteCard(null);
  };

  const handleSaveEdit = async (updated: ClassCard) => {
    try {
      await academicService.updateClass(updated.id, toClassApiPayload(updated));
      setClasses((prev) => prev.map((c) => c.id === updated.id ? updated : c));
    } catch {
      alert("تعذر تعديل الفصل على الخادم");
    }
    setEditCard(null);
  };

  const handleAdd = async (c: ClassCard) => {
    try {
      const created = await academicService.createClass(toClassApiPayload(c));
      const mapped = mapClassFromApi(created, 0);
      setClasses((prev) => [mapped, ...prev]);
    } catch {
      alert("تعذر إضافة الفصل على الخادم");
    }
  };

  return (
    <div dir="rtl" className="p-8 flex flex-col h-full max-w-7xl mx-auto w-full gap-6">
      
      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#2d2d5e] mb-1">إدارة الفصول</h1>
          <p className="text-sm font-semibold text-gray-500">قم بتنظيم وإدارة جميع الفصول الدراسية</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#e01c8a] hover:bg-[#c0157a] transition-all text-white font-black text-sm px-6 py-3 rounded-2xl shadow-lg shadow-[#e01c8a]/20 hover:shadow-[#e01c8a]/40 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#e01c8a]/20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>إضافة فصل جديد</span>
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex h-full gap-6 min-h-[500px]">
        {/* ── Right sidebar: subject filter ── */}
        <div className="w-64 flex-shrink-0 bg-white border border-gray-100 p-5 flex flex-col gap-3 overflow-y-auto rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] custom-scrollbar">
          <div className="flex items-center gap-2 mb-2 pb-3 border-b border-gray-100">
            <div className="w-2 h-6 bg-[#5B8FF9] rounded-full"></div>
            <p className="text-[#2d2d5e] font-black text-base">المواد الدراسية</p>
          </div>
          <button
            onClick={() => setActiveSubject(null)}
            className={`w-full text-right px-4 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-between group ${
              activeSubject === null
                ? "bg-gradient-to-r from-[#e01c8a] to-[#c0157a] text-white shadow-md shadow-[#e01c8a]/20 scale-[1.02]"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#2d2d5e]"
            }`}
          >
            <span>عرض الكل</span>
            {activeSubject === null && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
          </button>
          
          <div className="flex flex-col gap-2 mt-1">
            {subjects.map((sub) => {
              const available = availableSubjects.includes(sub);
              return (
                <button
                  key={sub}
                  disabled={!available}
                  onClick={() => setActiveSubject(sub)}
                  className={`w-full text-right px-4 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-between group ${
                    !available
                      ? "bg-gray-50/50 text-gray-300 cursor-not-allowed border border-dashed border-gray-200"
                      : activeSubject === sub
                      ? "bg-[#5B8FF9]/10 text-[#5B8FF9] border-2 border-[#5B8FF9]/20 shadow-sm scale-[1.02]"
                      : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${activeSubject === sub ? "bg-[#5B8FF9]" : available ? "bg-gray-300 group-hover:bg-gray-400" : "bg-gray-200"}`} />
                    <span>{sub}</span>
                  </div>
                  {activeSubject === sub && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Main content area ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-gray-100">
          
          {/* Level tabs & Search */}
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col gap-4 bg-white z-10 sticky top-0">
            {/* Level tabs */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => { setActiveLevel(lvl); setActiveSubject(null); }}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      activeLevel === lvl
                        ? "bg-white text-[#e01c8a] shadow-sm border border-gray-100"
                        : "text-gray-500 hover:text-[#2d2d5e] hover:bg-gray-100"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                 <span className="text-[#2d2d5e] font-black text-sm">{filtered.length} فصل</span>
              </div>
            </div>

            {/* Search + filter bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative group bg-gray-50 rounded-2xl border-2 border-gray-100 focus-within:bg-white focus-within:border-[#e01c8a]/40 focus-within:ring-4 focus-within:ring-[#e01c8a]/10 transition-all">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e01c8a] transition-colors">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث باسم الأستاذ، الفوج، القاعة أو المادة..."
                  className="w-full bg-transparent pr-12 pl-4 py-3.5 text-sm text-[#2d2d5e] font-bold focus:outline-none placeholder:text-gray-400 placeholder:font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9fc]/50 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-3">
                <p className="text-[#2d2d5e] font-black text-lg">جاري تحميل الفصول...</p>
                <p className="text-gray-400 font-semibold text-sm">يتم جلب البيانات من الخادم</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <span className="text-5xl opacity-40">📭</span>
                </div>
                <div className="text-center">
                  <p className="text-[#2d2d5e] font-black text-xl mb-1">لا توجد فصول مطابقة</p>
                  <p className="text-gray-400 font-semibold text-sm">تأكد من تعديل كلمات البحث أو اختيار مادة أخرى</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                {filtered.map((cls) => (
                  <ClassCardComponent
                    key={cls.id}
                    cls={cls}
                    onView={() => setViewCard(cls)}
                    onEdit={() => setEditCard(cls)}
                    onDelete={() => setDeleteCard(cls)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showAdd    && <AddModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
      {viewCard   && <ViewModal cls={viewCard} onClose={() => setViewCard(null)} />}
      {editCard   && <EditModal cls={editCard} onSave={handleSaveEdit} onClose={() => setEditCard(null)} />}
      {deleteCard && <DeleteModal cls={deleteCard} onConfirm={handleDelete} onClose={() => setDeleteCard(null)} />}
    </div>
  );
}
