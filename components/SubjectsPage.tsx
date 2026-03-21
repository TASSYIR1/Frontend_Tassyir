"use client";

import { useEffect, useState } from "react";
import { academicService } from "@/lib/api/academic.service";
import type { RecordMap } from "@/lib/api/types";

const Icons = {
  Plus: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
  ),
  Search: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
  ),
  More: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
  ),
  BookOpen: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
  ),
  Users: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  Clock: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
  ),
  Trash: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
  ),
  Edit: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
  )
};

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  classesCount: number;
  hoursPerWeek: number;
  color: string;
}

const initialSubjects: Subject[] = [
  { id: "S1", name: "الرياضيات", code: "MATH101", teacher: "أ. بن علي محمد", classesCount: 5, hoursPerWeek: 6, color: "from-blue-500 to-cyan-400" },
  { id: "S2", name: "الفيزياء", code: "PHY102", teacher: "أ. عمراني يوسف", classesCount: 4, hoursPerWeek: 4, color: "from-purple-500 to-indigo-400" },
  { id: "S3", name: "اللغة العربية", code: "ARA103", teacher: "أ. حمداني فاطمة", classesCount: 6, hoursPerWeek: 5, color: "from-[#e01c8a] to-[#ff42a5]" },
  { id: "S4", name: "العلوم الطبيعية", code: "SCI104", teacher: "أ. مزهود كريم", classesCount: 3, hoursPerWeek: 4, color: "from-emerald-500 to-teal-400" },
  { id: "S5", name: "التاريخ والجغرافيا", code: "HIS105", teacher: "أ. بوزيد سارة", classesCount: 4, hoursPerWeek: 3, color: "from-amber-500 to-orange-400" },
  { id: "S6", name: "اللغة الفرنسية", code: "FRE106", teacher: "أ. سالم عبد الرحمان", classesCount: 5, hoursPerWeek: 4, color: "from-rose-500 to-pink-400" },
];

const toText = (value: unknown, fallback = "") =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const mapSubjectFromApi = (row: RecordMap, index: number): Subject => {
  const palette = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-indigo-400",
    "from-[#e01c8a] to-[#ff42a5]",
    "from-emerald-500 to-teal-400",
    "from-amber-500 to-orange-400",
    "from-rose-500 to-pink-400",
  ];

  return {
    id: toText(row.id, `S${Date.now()}-${index}`),
    name: toText(row.name, "مادة"),
    code: toText(row.code, `SUB-${index + 1}`),
    teacher: toText(row.teacher_name, toText(row.teacherName, "غير محدد")),
    classesCount: toNumber(row.classes_count, 0),
    hoursPerWeek: toNumber(row.hours_per_week, 0),
    color: toText(row.color, palette[index % palette.length]),
  };
};

const toSubjectApiPayload = (subject: Omit<Subject, "id"> | Subject): RecordMap => ({
  name: subject.name,
  code: subject.code,
  teacherName: subject.teacher,
  classesCount: subject.classesCount,
  hoursPerWeek: subject.hoursPerWeek,
  color: subject.color,
});

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({ name: "", code: "", teacher: "", classesCount: 1, hoursPerWeek: 1, color: "from-blue-500 to-cyan-400" });

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const rows = await academicService.getSubjects();
        setSubjects(rows.map((row, index) => mapSubjectFromApi(row, index)));
      } catch {
        setSubjects(initialSubjects);
      } finally {
        setLoading(false);
      }
    };

    void loadSubjects();
  }, []);

  const filtered = subjects.filter(
    (s) =>
      s.name.includes(search) ||
      s.teacher.includes(search) ||
      s.code.includes(search)
  );

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المادة؟")) return;
    try {
      await academicService.deleteSubject(id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("تعذر حذف المادة من الخادم");
    }
  };

  const handleEdit = (s: Subject) => {
    setForm({ name: s.name, code: s.code, teacher: s.teacher, classesCount: s.classesCount, hoursPerWeek: s.hoursPerWeek, color: s.color });
    setEditingId(s.id);
    setShowModal(true);
  };

  const openNew = () => {
    setForm({ name: "", code: "", teacher: "", classesCount: 1, hoursPerWeek: 1, color: "from-blue-500 to-cyan-400" });
    setEditingId(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.code.trim()) return alert("الرجاء إدخال اسم ورمز المادة");

    if (editingId) {
      try {
        await academicService.updateSubject(editingId, toSubjectApiPayload({ id: editingId, ...form }));
        setSubjects((prev) =>
          prev.map((s) => (s.id === editingId ? { ...s, ...form } : s))
        );
      } catch {
        alert("تعذر تعديل المادة على الخادم");
        return;
      }
    } else {
      try {
        const created = await academicService.createSubject(toSubjectApiPayload({ ...form, id: "" }));
        const mapped = mapSubjectFromApi(created, 0);
        setSubjects((prev) => [mapped, ...prev]);
      } catch {
        alert("تعذر إضافة المادة على الخادم");
        return;
      }
    }
    setShowModal(false);
  };

  return (
    <div dir="rtl" className="p-6 flex flex-col gap-6 max-w-7xl mx-auto font-cairo h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 p-6 rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-white/60 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-500 shadow-inner border border-white">
            {Icons.BookOpen}
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#2d2d5e]">المواد الدراسية والأفواج</h1>
            <p className="text-gray-400 font-bold text-sm mt-1">
              إدارة المواد، توزيع الأساتذة، والأفواج التعليمية
            </p>
          </div>
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-80 group">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e01c8a] transition-colors">
              {Icons.Search}
            </div>
            <input
              type="text"
              placeholder="ابحث عن مادة، أستاذ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pr-11 pl-4 py-3 text-sm font-bold text-[#2d2d5e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e01c8a]/20 focus:border-[#e01c8a] focus:bg-white transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={openNew}
            className="flex items-center gap-2 bg-linear-to-r from-[#e01c8a] to-[#ff42a5] hover:from-[#c0157a] hover:to-[#e01c8a] text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-pink-500/30 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            {Icons.Plus}
            إضافة مادة
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <div className="col-span-full py-12 text-center">
            <p className="text-[#2d2d5e] font-black">جاري تحميل المواد من الخادم...</p>
          </div>
        )}
        {filtered.map((subject) => (
          <div
            key={subject.id}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
          >
            <div className={"absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${subject.color} rounded-full blur-3xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity"} />
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-lg w-fit mb-2 border border-gray-100">
                  {subject.code}
                </span>
                <h3 className="font-black text-[#2d2d5e] text-xl">
                  {subject.name}
                </h3>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(subject)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                  {Icons.Edit}
                </button>
                <button onClick={() => handleDelete(subject.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="حذف">
                  {Icons.Trash}
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-2xl border border-white">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center text-white shadow-inner">
                  {Icons.Users}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400">الأستاذ المنسق</span>
                  <span className="text-sm font-bold text-[#2d2d5e]">{subject.teacher}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col gap-1 items-center justify-center text-center shadow-sm">
                  <div className="text-purple-500 mb-1">{Icons.Users}</div>
                  <span className="text-lg font-black text-[#2d2d5e]">{subject.classesCount}</span>
                  <span className="text-[10px] font-bold text-gray-400">أفواج مسجلة</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col gap-1 items-center justify-center text-center shadow-sm">
                  <div className="text-emerald-500 mb-1">{Icons.Clock}</div>
                  <span className="text-lg font-black text-[#2d2d5e]">{subject.hoursPerWeek}</span>
                  <span className="text-[10px] font-bold text-gray-400">ساعة / أسبوع</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <button className="text-sm font-black text-[#e01c8a] hover:text-[#c0157a] transition-colors">
                عرض التفاصيل &larr;
              </button>
              <div className="flex -space-x-2 space-x-reverse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                    A{i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
              {Icons.Search}
            </div>
            <p className="text-gray-400 font-bold">لا توجد مواد مطابقة للبحث</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d2d5e]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xl font-black text-[#2d2d5e]">
                {editingId ? "تعديل مادة" : "إضافة مادة جديدة"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-rose-500 bg-white hover:bg-rose-50 p-2 rounded-xl shadow-sm transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-gray-500 text-sm font-bold block mb-2">اسم المادة</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: الرياضيات"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#2d2d5e] focus:outline-none focus:border-[#e01c8a] focus:ring-1 focus:ring-[#e01c8a] transition-all"
                />
              </div>

              <div>
                <label className="text-gray-500 text-sm font-bold block mb-2">رمز المادة</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="مثال: MATH101"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#2d2d5e] focus:outline-none focus:border-[#e01c8a] focus:ring-1 focus:ring-[#e01c8a] transition-all"
                />
              </div>

              <div>
                <label className="text-gray-500 text-sm font-bold block mb-2">الأستاذ المنسق</label>
                <input
                  type="text"
                  value={form.teacher}
                  onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                  placeholder="مثال: أ. بن علي محمد"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#2d2d5e] focus:outline-none focus:border-[#e01c8a] focus:ring-1 focus:ring-[#e01c8a] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 text-sm font-bold block mb-2">الأفواج المسجلة</label>
                  <input
                    type="number"
                    value={form.classesCount}
                    onChange={(e) => setForm({ ...form, classesCount: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#2d2d5e] focus:outline-none focus:border-[#e01c8a] focus:ring-1 focus:ring-[#e01c8a] transition-all"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-sm font-bold block mb-2">ساعات / أسبوع</label>
                  <input
                    type="number"
                    value={form.hoursPerWeek}
                    onChange={(e) => setForm({ ...form, hoursPerWeek: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#2d2d5e] focus:outline-none focus:border-[#e01c8a] focus:ring-1 focus:ring-[#e01c8a] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-500 text-sm font-bold block mb-2">لون المادة</label>
                <select
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#2d2d5e] focus:outline-none focus:border-[#e01c8a] focus:ring-1 focus:ring-[#e01c8a] transition-all bg-white"
                >
                  <option value="from-blue-500 to-cyan-400">أزرق</option>
                  <option value="from-purple-500 to-indigo-400">بنفسجي</option>
                  <option value="from-emerald-500 to-teal-400">أخضر</option>
                  <option value="from-amber-500 to-orange-400">برتقالي</option>
                  <option value="from-rose-500 to-pink-400">وردي</option>
                  <option value="from-[#e01c8a] to-[#ff42a5]">وردي داكن</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-100">
              <button
                onClick={handleSave}
                className="flex-1 bg-linear-to-r from-[#e01c8a] to-[#ff42a5] text-white px-4 py-3 rounded-xl font-black text-sm shadow-md shadow-pink-500/20 hover:shadow-lg transition-all"
              >
                حفظ المادة
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-white text-gray-500 border border-gray-200 px-4 py-3 rounded-xl font-black text-sm hover:bg-gray-50 transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
