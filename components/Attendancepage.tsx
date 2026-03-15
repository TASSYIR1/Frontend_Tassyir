"use client";

import { useState } from "react";

const students = Array.from({ length: 10 }, (_, i) => ({
  id: `STD${200 + i}`,
  name: "بن سالم اجم",
  level: "ثانية ثانوي",
  present: Math.floor(Math.random() * 10) + 18,
  absent: Math.floor(Math.random() * 5),
  late: Math.floor(Math.random() * 3),
}));

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState("2026-03-15");

  return (
    <div dir="rtl" className="p-6 flex flex-col gap-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "حاضرون اليوم", value: "287", color: "text-green-500", bg: "bg-green-50" },
          { label: "غائبون اليوم", value: "37", color: "text-red-500", bg: "bg-red-50" },
          { label: "متأخرون", value: "12", color: "text-orange-500", bg: "bg-orange-50" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 flex flex-col gap-1`}>
            <p className={`${stat.color} font-black text-4xl`}>{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-[#2d2d5e] font-bold text-sm">سجل الحضور</p>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:border-[#e01c8a]"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["المعرف", "الاسم واللقب", "المستوى", "حاضر", "غائب", "متأخر", "الحالة"].map((h) => (
                  <th key={h} className="px-4 py-3 text-gray-500 font-semibold text-right whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => {
                const status = s.absent > 3 ? "غائب متكرر" : "منتظم";
                const statusColor = s.absent > 3 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600";
                return (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-[#2d2d5e] font-medium">{s.id}</td>
                    <td className="px-4 py-3 text-gray-700">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.level}</td>
                    <td className="px-4 py-3 text-green-600 font-bold">{s.present}</td>
                    <td className="px-4 py-3 text-red-500 font-bold">{s.absent}</td>
                    <td className="px-4 py-3 text-orange-500 font-bold">{s.late}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${statusColor}`}>{status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}