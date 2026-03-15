"use client";

import { useState } from "react";

const classesData = Array.from({ length: 8 }, (_, i) => ({
  id: `CLS-${100 + i}`,
  name: `ثانية ثانوي ${String.fromCharCode(65 + i)}`,
  subject: "رياضيات",
  teacher: "الاستاذ بن علي",
  students: Math.floor(Math.random() * 15) + 20,
  room: String(30 + i),
  group: `AB${10 + i}`,
}));

export default function ClassesPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div dir="rtl" className="p-6 flex flex-col gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-[#2d2d5e] font-bold text-sm">قائمة الفصول</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#e01c8a] hover:bg-[#c0157a] transition-colors text-white font-bold text-sm px-4 py-2 rounded-xl shadow"
          >
            <span className="text-lg font-light">+</span>
            <span>فصل جديد</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["الرمز", "الاسم", "المادة", "الاستاذ", "عدد الطلاب", "القاعة", "الفوج"].map((h) => (
                  <th key={h} className="px-4 py-3 text-gray-500 font-semibold text-right whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classesData.map((cls, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-[#e01c8a] font-bold">{cls.id}</td>
                  <td className="px-4 py-3 text-[#2d2d5e] font-medium">{cls.name}</td>
                  <td className="px-4 py-3 text-gray-600">{cls.subject}</td>
                  <td className="px-4 py-3 text-gray-600">{cls.teacher}</td>
                  <td className="px-4 py-3">
                    <span className="bg-[#e01c8a]/10 text-[#e01c8a] font-bold text-xs px-2 py-1 rounded-md">{cls.students}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cls.room}</td>
                  <td className="px-4 py-3 text-gray-600">{cls.group}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[#2d2d5e] font-black text-lg">فصل جديد</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <div className="flex flex-col gap-3">
              {["اسم الفصل", "المادة", "الاستاذ", "القاعة", "الفوج"].map((field) => (
                <div key={field}>
                  <label className="text-gray-500 text-xs font-medium block mb-1">{field}</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a]" placeholder={`أدخل ${field}`} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-[#e01c8a] hover:bg-[#c0157a] text-white font-bold text-sm py-2.5 rounded-xl">حفظ</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm py-2.5 rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}