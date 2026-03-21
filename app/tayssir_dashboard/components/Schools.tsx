"use client";

import { useState } from "react";

const mockSchools = [
  { id: 1, name: "مدرسة المستقبل", type: "Normale", date: "2024-01-10", status: "active", contact: "خالد سعيد", phone: "0555123456" },
  { id: 2, name: "معهد القمة", type: "Cours Sup", date: "2024-02-15", status: "active", contact: "سارة عبد الله", phone: "0666987654" },
  { id: 3, name: "مدارس الشروق", type: "Normale", date: "2023-11-05", status: "suspended", contact: "عمر جمال", phone: "0777555333" },
];

export default function Schools() {
  const [schools, setSchools] = useState(mockSchools);

  const toggleStatus = (id: number) => {
    setSchools(schools.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === "active" ? "suspended" : "active" };
      }
      return s;
    }));
  };

  return (
    <div className="p-6 md:p-8 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-black text-[#2d2d5e]">المدارس النشطة</h2>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="البحث عن مدرسة..."
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e01c8a]/20 focus:border-[#e01c8a]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 font-bold">اسم المدرسة</th>
                <th className="py-4 px-6 font-bold">النوع</th>
                <th className="py-4 px-6 font-bold">تاريخ الانضمام</th>
                <th className="py-4 px-6 font-bold">جهة الاتصال</th>
                <th className="py-4 px-6 font-bold">الحالة</th>
                <th className="py-4 px-6 font-bold text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#2d2d5e]">{school.name}</td>
                  <td className="py-4 px-6 font-semibold text-gray-600">{school.type === "Normale" ? "مدرسة عادية" : "مركز دعم"}</td>
                  <td className="py-4 px-6 text-gray-500">{school.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-semibold">{school.contact}</span>
                      <span className="text-xs text-gray-500" dir="ltr">{school.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {school.status === "active" ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-full">نشط</span>
                    ) : (
                      <span className="px-3 py-1 bg-rose-100 text-rose-700 font-bold text-[10px] rounded-full">معلق</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-left space-x-2 space-x-reverse">
                    <button
                      className="text-gray-500 hover:text-[#e01c8a] transition-colors p-1"
                      title="التفاصيل"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button
                      onClick={() => toggleStatus(school.id)}
                      className={`${school.status === "active" ? "text-amber-500 hover:text-amber-600" : "text-emerald-500 hover:text-emerald-600"} transition-colors p-1`}
                      title={school.status === "active" ? "تعليق الحساب" : "تفعيل الحساب"}
                    >
                      {school.status === "active" ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
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