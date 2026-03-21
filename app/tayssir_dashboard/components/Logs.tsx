"use client";

const mockLogs = [
  { id: 1, action: "قبول طلب", target: "مدرسة المستقبل", admin: "أحمد بن علي", date: "2024-03-21 10:30", type: "success" },
  { id: 2, action: "رفض طلب", target: "مدرسة الأمل", admin: "سارة محمد", date: "2024-03-20 15:45", type: "error" },
  { id: 3, action: "تعليق حساب", target: "معهد النور", admin: "أحمد بن علي", date: "2024-03-19 09:15", type: "warning" },
  { id: 4, action: "تفعيل حساب", target: "مدارس الشروق", admin: "ياسين عمر", date: "2024-03-18 11:20", type: "info" },
];

export default function Logs() {
  return (
    <div className="p-6 md:p-8 font-cairo" dir="rtl">
      <h2 className="text-2xl font-black text-[#2d2d5e] mb-6">سجل العمليات (Logs)</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="space-y-4">
          {mockLogs.map((log) => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-10 rounded-full ${
                  log.type === "success" ? "bg-emerald-500" :
                  log.type === "error" ? "bg-rose-500" :
                  log.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                }`}></div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#2d2d5e]">{log.action}</span>
                    <span className="text-gray-400 text-sm">بخصوص</span>
                    <span className="font-bold text-[#e01c8a]">{log.target}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">
                    بواسطة المشرف <span className="text-gray-700">{log.admin}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-left">
                <span className="text-xs font-bold text-gray-400 flex items-center justify-end gap-1" dir="ltr">
                  <span>{log.date}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}