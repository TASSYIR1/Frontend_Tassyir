"use client";

import { useEffect, useState } from "react";
import { communicationService } from "@/lib/api/communication.service";
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
  Megaphone: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
  ),
  Pin: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
  ),
  Trash: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
  ),
  Edit: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
  )
};

interface Announcement {
  id: string;
  title: string;
  preview: string;
  date: string;
  target: string;
  pinned: boolean;
}

const initialAnnouncements: Announcement[] = [
  {
    id: "A1",
    title: "اجتماع أولياء الأمور",
    preview: "نعلن عن عقد اجتماع لأولياء الأمور يوم الخميس القادم لمناقشة...",
    date: "12/03/2026",
    target: "أولياء الأمور",
    pinned: true,
  },
  {
    id: "A2",
    title: "تغيير في جدول الامتحانات",
    preview: "تم تأجيل امتحان الرياضيات للصف الثاني ثانوي إلى يوم الثلاثاء...",
    date: "14/03/2026",
    target: "الطلاب",
    pinned: true,
  },
  {
    id: "A3",
    title: "رحلة مدرسية ترفيهية",
    preview: "تنظم المدرسة رحلة إلى حديقة التجارب يوم السبت القادم، للمشاركة...",
    date: "10/03/2026",
    target: "الطلاب",
    pinned: false,
  },
  {
    id: "A4",
    title: "تنبيه بخصوص الزي المدرسي",
    preview: "نذكر جميع الطلاب بضرورة الالتزام بالزي المدرسي الموحد، سيتم...",
    date: "05/03/2026",
    target: "الطلاب, أولياء الأمور",
    pinned: false,
  },
  {
    id: "A5",
    title: "دورة تكوينية للأساتذة",
    preview: "تعقد دورة تكوينية في استخدام التقنيات الحديثة في التعليم للأساتذة...",
    date: "01/03/2026",
    target: "الأساتذة",
    pinned: false,
  },
];

const toText = (value: unknown, fallback = "") =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const mapAnnouncementFromApi = (row: RecordMap, index: number): Announcement => ({
  id: toText(row.id, `A-${index}`),
  title: toText(row.title, "إعلان"),
  preview: toText(row.content, toText(row.preview, "")),
  date: toText(
    row.createdAt,
    typeof row.date === "string" ? row.date : new Date().toLocaleDateString("en-GB"),
  ),
  target: toText(row.scope, toText(row.target, "الجميع")),
  pinned: Boolean(row.pinned),
});

const toAnnouncementPayload = (announcement: { title: string; preview: string; target: string; pinned: boolean }): RecordMap => ({
  title: announcement.title,
  content: announcement.preview,
  scope: announcement.target || "ALL",
  pinned: announcement.pinned,
});

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({ title: "", preview: "", target: "", pinned: false });

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const rows = await communicationService.getAnnouncements();
        setAnnouncements(rows.map((row, index) => mapAnnouncementFromApi(row, index)));
      } catch {
        setAnnouncements(initialAnnouncements);
      } finally {
        setLoading(false);
      }
    };

    void loadAnnouncements();
  }, []);

  const filtered = announcements.filter(
    (a) =>
      a.title.includes(search) ||
      a.preview.includes(search) ||
      a.target.includes(search)
  );

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;
    try {
      await communicationService.deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("تعذر حذف الإعلان من الخادم");
    }
  };

  const handleEdit = (a: Announcement) => {
    setForm({ title: a.title, preview: a.preview, target: a.target, pinned: a.pinned });
    setEditingId(a.id);
    setShowModal(true);
  };

  const openNew = () => {
    setForm({ title: "", preview: "", target: "", pinned: false });
    setEditingId(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.preview.trim()) return alert("الرجاء إدخال العنوان والمحتوى");

    if (editingId) {
      try {
        await communicationService.deleteAnnouncement(editingId);
        await communicationService.createAnnouncement(toAnnouncementPayload(form));
      } catch {
        alert("تعذر تعديل الإعلان على الخادم");
        return;
      }
    } else {
      try {
        await communicationService.createAnnouncement(toAnnouncementPayload(form));
      } catch {
        alert("تعذر إضافة الإعلان على الخادم");
        return;
      }
    }
    try {
      const rows = await communicationService.getAnnouncements();
      setAnnouncements(rows.map((row, index) => mapAnnouncementFromApi(row, index)));
    } catch {
      // keep current state if refresh fails
    }
    setShowModal(false);
  };

  const togglePin = async (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)).sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
    );

    const current = announcements.find((item) => item.id === id);
    if (!current) return;

    try {
      await communicationService.deleteAnnouncement(id);
      await communicationService.createAnnouncement(
        toAnnouncementPayload({
          title: current.title,
          preview: current.preview,
          target: current.target,
          pinned: !current.pinned,
        }),
      );
    } catch {
      // optimistic UI only if backend pin persistence fails
    }
  };

  return (
    <div dir="rtl" className="p-6 flex flex-col gap-6 max-w-7xl mx-auto font-cairo h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 p-6 rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-white/60 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-amber-50 rounded-2xl text-amber-500 shadow-inner border border-white">
            {Icons.Megaphone}
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#2d2d5e]">الإعلانات والتواصل</h1>
            <p className="text-gray-400 font-bold text-sm mt-1">
              إدارة إعلانات المدرسة والتعاميم الموجهة
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
              placeholder="ابحث عن إعلان..."
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
            إعلان جديد
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <div className="col-span-full py-12 text-center">
            <p className="text-[#2d2d5e] font-black">جاري تحميل الإعلانات من الخادم...</p>
          </div>
        )}
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border ${item.pinned ? "border-amber-200 bg-amber-50/10" : "border-gray-100/50 hover:border-[#e01c8a]/30"} transition-all duration-300 group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                  {item.date}
                </span>
                <span className="text-xs font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                  {item.target}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => togglePin(item.id)} className={`p-1.5 rounded-lg transition-colors ${item.pinned ? "text-amber-500 bg-amber-50" : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"}`} title="تثبيت الإعلان">
                  {Icons.Pin}
                </button>
                <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                  {Icons.Edit}
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="حذف">
                  {Icons.Trash}
                </button>
              </div>
            </div>
            
            <h3 className="font-black text-[#2d2d5e] text-lg mb-2 flex items-center gap-2">
              {item.pinned && <span className="text-amber-500">{Icons.Pin}</span>}
              {item.title}
            </h3>
            
            <p className="text-gray-500 text-sm font-bold leading-relaxed line-clamp-3">
              {item.preview}
            </p>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
              {Icons.Search}
            </div>
            <p className="text-gray-400 font-bold">لا توجد إعلانات مطابقة للبحث</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d2d5e]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xl font-black text-[#2d2d5e]">
                {editingId ? "تعديل إعلان" : "إعلان جديد"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-rose-500 bg-white hover:bg-rose-50 p-2 rounded-xl shadow-sm transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div>
                <label className="text-gray-500 text-sm font-bold block mb-2">عنوان الإعلان</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="مثال: عطلة الشتاء"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#2d2d5e] focus:outline-none focus:border-[#e01c8a] focus:ring-1 focus:ring-[#e01c8a] transition-all"
                />
              </div>

               <div>
                <label className="text-gray-500 text-sm font-bold block mb-2">الفئة المستهدفة</label>
                <input
                  type="text"
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value })}
                  placeholder="مثال: الطلاب, الأساتذة, الجميع"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#2d2d5e] focus:outline-none focus:border-[#e01c8a] focus:ring-1 focus:ring-[#e01c8a] transition-all"
                />
              </div>

              <div>
                <label className="text-gray-500 text-sm font-bold block mb-2">محتوى الإعلان</label>
                <textarea
                  value={form.preview}
                  onChange={(e) => setForm({ ...form, preview: e.target.value })}
                  placeholder="اكتب تفاصيل الإعلان هنا..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#2d2d5e] resize-none focus:outline-none focus:border-[#e01c8a] focus:ring-1 focus:ring-[#e01c8a] transition-all"
                />
              </div>

              <div className="flex items-center gap-3 mt-2">
                 <input
                    type="checkbox"
                    id="pin"
                    checked={form.pinned}
                    onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                    className="w-5 h-5 accent-[#e01c8a] rounded"
                 />
                 <label htmlFor="pin" className="text-sm font-black text-[#2d2d5e] cursor-pointer">
                    تثبيت الإعلان في الأعلى
                 </label>
              </div>
            </div>
            <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-100">
              <button
                onClick={handleSave}
                className="flex-1 bg-linear-to-r from-[#e01c8a] to-[#ff42a5] text-white px-4 py-3 rounded-xl font-black text-sm shadow-md shadow-pink-500/20 hover:shadow-lg transition-all"
              >
                حفظ الإعلان
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
