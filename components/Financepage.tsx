"use client";

import { useState } from "react";

const payments = Array.from({ length: 12 }, (_, i) => ({
  id: `PAY-${1000 + i}`,
  student: "بن سالم اجم",
  amount: (Math.floor(Math.random() * 5) + 3) * 1000,
  date: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}/03/2026`,
  method: i % 2 === 0 ? "نقدي" : "تحويل",
  status: i % 5 === 4 ? "غير مدفوع" : "مدفوع",
}));

export default function FinancePage() {
  const [showModal, setShowModal] = useState(false);
  const totalPaid = payments.filter((p) => p.status === "مدفوع").reduce((a, b) => a + b.amount, 0);
  const totalUnpaid = payments.filter((p) => p.status === "غير مدفوع").reduce((a, b) => a + b.amount, 0);

  return (
    <div dir="rtl" className="p-6 flex flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#e01c8a]/10 rounded-2xl p-5">
          <p className="text-[#e01c8a] font-black text-2xl">{(totalPaid + totalUnpaid).toLocaleString()} دج</p>
          <p className="text-gray-500 text-sm mt-1">إجمالي الفواتير</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-5">
          <p className="text-green-600 font-black text-2xl">{totalPaid.toLocaleString()} دج</p>
          <p className="text-gray-500 text-sm mt-1">المدفوع</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-5">
          <p className="text-red-500 font-black text-2xl">{totalUnpaid.toLocaleString()} دج</p>
          <p className="text-gray-500 text-sm mt-1">غير المدفوع</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-[#2d2d5e] font-bold text-sm">سجل المدفوعات</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#e01c8a] hover:bg-[#c0157a] transition-colors text-white font-bold text-sm px-4 py-2 rounded-xl shadow"
          >
            <span>+ دفعة جديدة</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["الرمز", "الطالب", "المبلغ", "التاريخ", "طريقة الدفع", "الحالة"].map((h) => (
                  <th key={h} className="px-4 py-3 text-gray-500 font-semibold text-right whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-[#e01c8a] font-bold">{p.id}</td>
                  <td className="px-4 py-3 text-gray-700">{p.student}</td>
                  <td className="px-4 py-3 text-[#2d2d5e] font-bold">{p.amount.toLocaleString()} دج</td>
                  <td className="px-4 py-3 text-gray-600">{p.date}</td>
                  <td className="px-4 py-3 text-gray-600">{p.method}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-md ${p.status === "مدفوع" ? "bg-green-500 text-white" : "bg-red-100 text-red-600"}`}>
                      {p.status}
                    </span>
                  </td>
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
              <h2 className="text-[#2d2d5e] font-black text-lg">دفعة جديدة</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <div className="flex flex-col gap-3">
              {["اسم الطالب", "المبلغ", "طريقة الدفع"].map((f) => (
                <div key={f}>
                  <label className="text-gray-500 text-xs font-medium block mb-1">{f}</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e01c8a]" placeholder={`أدخل ${f}`} />
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