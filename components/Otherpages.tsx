"use client";

import { useState } from "react";

// ─── CONTACT PAGE ──────────────────────────────────────────────
const messages = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  from: i % 2 === 0 ? "ولي الأمر - بن سالم" : "الاستاذ حمداني",
  subject: i % 3 === 0 ? "استفسار عن الغياب" : i % 3 === 1 ? "طلب اجتماع" : "تقرير الدرجات",
  date: `${String(10 + i).padStart(2, "0")}/03/2026`,
  read: i % 3 !== 0,
}));

export function ContactPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showCompose, setShowCompose] = useState(false);

  return (
    <div dir="rtl" className="p-6 flex flex-col gap-4">
      <div className="flex gap-4 h-[calc(100vh-180px)]">
        {/* Inbox list */}
        <div className="w-[320px] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-[#2d2d5e] font-bold text-sm">الرسائل</p>
            <button
              onClick={() => setShowCompose(true)}
              className="bg-[#e01c8a] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#c0157a] transition-colors"
            >
              + رسالة
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelected(msg.id)}
                className={`w-full text-right px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selected === msg.id ? "bg-[#e01c8a]/5 border-r-2 border-r-[#e01c8a]" : ""}`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-xs font-semibold ${msg.read ? "text-gray-400" : "text-[#2d2d5e]"}`}>{msg.from}</span>
                  <span className="text-[10px] text-gray-400">{msg.date}</span>
                </div>
                <p className={`text-xs ${msg.read ? "text-gray-400" : "text-gray-700 font-semibold"}`}>{msg.subject}</p>
                {!msg.read && <span className="w-2 h-2 rounded-full bg-[#e01c8a] inline-block mt-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Message view */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          {selected ? (
            <div className="w-full h-full p-6 flex flex-col gap-4">
              {(() => {
                const msg = messages.find((m) => m.id === selected)!;
                return (
                  <>
                    <div className="border-b border-gray-100 pb-3">
                      <p className="text-[#2d2d5e] font-bold text-base">{msg.subject}</p>
                      <p className="text-gray-400 text-xs mt-1">من: {msg.from} · {msg.date}</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      السلام عليكم، أود الاستفسار عن الموضوع المذكور. أرجو الرد في أقرب وقت ممكن. شكراً.
                    </p>
                    <div className="mt-auto">
                      <textarea
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-[#e01c8a]"
                        rows={3}
                        placeholder="اكتب ردك هنا..."
                      />
                      <button className="mt-2 bg-[#e01c8a] hover:bg-[#c0157a] text-white font-bold text-sm px-5 py-2 rounded-xl transition-colors">
                        إرسال
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <p className="text-gray-300 text-sm">اختر رسالة للعرض</p>
          )}
        </div>
      </div>

      {showCompose && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#2d2d5e] font-black text-lg">رسالة جديدة</h2>
              <button onClick={() => setShowCompose(false)} className="text-gray-400 text-xl font-bold">×</button>
            </div>
            <div className="flex flex-col gap-3">
              {["المستلم", "الموضوع"].map((f) => (
                <div key={f}>
                  <label className="text-gray-500 text-xs font-medium block mb-1">{f}</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e01c8a]" />
                </div>
              ))}
              <div>
                <label className="text-gray-500 text-xs font-medium block mb-1">الرسالة</label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#e01c8a]" rows={4} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowCompose(false)} className="flex-1 bg-[#e01c8a] hover:bg-[#c0157a] text-white font-bold text-sm py-2.5 rounded-xl">إرسال</button>
              <button onClick={() => setShowCompose(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm py-2.5 rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FILES PAGE ──────────────────────────────────────────────
const files = [
  { name: "كشف النقاط - الفصل الأول", type: "PDF", size: "2.3 MB", date: "10/03/2026" },
  { name: "جدول الحصص الأسبوعي", type: "XLSX", size: "1.1 MB", date: "08/03/2026" },
  { name: "قائمة الطلاب 2026", type: "DOCX", size: "450 KB", date: "05/03/2026" },
  { name: "تقرير الحضور - مارس", type: "PDF", size: "3.8 MB", date: "01/03/2026" },
  { name: "عقود الاساتذة", type: "PDF", size: "1.5 MB", date: "15/02/2026" },
  { name: "ميزانية الفصل الثاني", type: "XLSX", size: "890 KB", date: "12/02/2026" },
];

const typeColors: Record<string, string> = {
  PDF: "bg-red-100 text-red-600",
  XLSX: "bg-green-100 text-green-600",
  DOCX: "bg-blue-100 text-blue-600",
};

export function FilesPage() {
  return (
    <div dir="rtl" className="p-6 flex flex-col gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-[#2d2d5e] font-bold text-sm">الملفات</p>
          <button className="flex items-center gap-2 bg-[#e01c8a] hover:bg-[#c0157a] transition-colors text-white font-bold text-sm px-4 py-2 rounded-xl shadow">
            <span>+ رفع ملف</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {files.map((file, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${typeColors[file.type] || "bg-gray-100 text-gray-600"}`}>{file.type}</span>
                <button className="text-gray-300 hover:text-red-400 transition-colors text-sm">🗑️</button>
              </div>
              <p className="text-[#2d2d5e] font-semibold text-sm leading-tight">{file.name}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-gray-400 text-xs">{file.date}</span>
                <span className="text-gray-400 text-xs">{file.size}</span>
              </div>
              <button className="w-full border border-[#e01c8a]/30 text-[#e01c8a] hover:bg-[#e01c8a] hover:text-white font-semibold text-xs py-1.5 rounded-lg transition-colors mt-1">
                تحميل
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ──────────────────────────────────────────────
export function SettingsPage() {
  const [schoolName, setSchoolName] = useState("مدرسة النجاح");
  const [phone, setPhone] = useState("06 66 66 66 66");
  const [email, setEmail] = useState("tasyir@gmail.com");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div dir="rtl" className="p-6 flex flex-col gap-4 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-[#2d2d5e] font-bold text-base mb-5">إعدادات المؤسسة</p>
        <div className="flex flex-col gap-4">
          {[
            { label: "اسم المؤسسة", value: schoolName, set: setSchoolName },
            { label: "رقم الهاتف", value: phone, set: setPhone },
            { label: "البريد الالكتروني", value: email, set: setEmail },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label className="text-gray-500 text-xs font-medium block mb-1.5">{label}</label>
              <input
                value={value}
                onChange={(e) => set(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a] transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-[#2d2d5e] font-bold text-base mb-5">الأمان</p>
        <div className="flex flex-col gap-4">
          {["كلمة المرور الحالية", "كلمة المرور الجديدة", "تأكيد كلمة المرور"].map((label) => (
            <div key={label}>
              <label className="text-gray-500 text-xs font-medium block mb-1.5">{label}</label>
              <input type="password" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e01c8a] transition-colors" />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`px-8 py-3 rounded-xl font-bold text-sm text-white transition-all ${saved ? "bg-green-500" : "bg-[#e01c8a] hover:bg-[#c0157a]"}`}
      >
        {saved ? "✓ تم الحفظ" : "حفظ التغييرات"}
      </button>
    </div>
  );
}

// ─── AUDIT PAGE ──────────────────────────────────────────────
const auditLogs = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  user: i % 3 === 0 ? "المدير" : i % 3 === 1 ? "الاستاذ بن علي" : "الاداري سالم",
  action: i % 4 === 0 ? "إضافة طالب" : i % 4 === 1 ? "تعديل جدول" : i % 4 === 2 ? "حذف ملف" : "تسجيل دخول",
  date: `15/03/2026`,
  time: `${String(8 + (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
  status: i % 7 === 6 ? "مرفوض" : "ناجح",
}));

export function AuditPage() {
  return (
    <div dir="rtl" className="p-6 flex flex-col gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-[#2d2d5e] font-bold text-sm">سجل التدقيق</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["#", "المستخدم", "الإجراء", "التاريخ", "الوقت", "الحالة"].map((h) => (
                  <th key={h} className="px-4 py-3 text-gray-500 font-semibold text-right whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 font-medium">{log.id}</td>
                  <td className="px-4 py-3 text-[#2d2d5e] font-medium">{log.user}</td>
                  <td className="px-4 py-3 text-gray-600">{log.action}</td>
                  <td className="px-4 py-3 text-gray-600">{log.date}</td>
                  <td className="px-4 py-3 text-gray-600">{log.time}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${log.status === "ناجح" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}