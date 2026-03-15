"use client";

import DonutChart from "./Donutchart";

const currentClasses = [
  { room: "34", subject: "رياضيات", level: "ثانية ثانوي", teacher: "الاستاذ", group: "AB12", time: "9:00 - 8:00" },
  { room: "34", subject: "رياضيات", level: "ثانية ثانوي", teacher: "الاستاذ", group: "AB12", time: "9:00 - 8:00" },
  { room: "34", subject: "رياضيات", level: "ثانية ثانوي", teacher: "الاستاذ", group: "AB12", time: "9:00 - 8:00" },
  { room: "34", subject: "رياضيات", level: "ثانية ثانوي", teacher: "الاستاذ", group: "AB12", time: "9:00 - 8:00" },
  { room: "34", subject: "رياضيات", level: "ثانية ثانوي", teacher: "الاستاذ", group: "AB12", time: "9:00 - 8:00" },
];

export default function HomePage() {
  return (
    <div dir="rtl" className="p-6 flex flex-col gap-6">
      {/* Section title */}
      <p className="text-gray-400 text-sm font-medium">نظرة عامة</p>

      {/* Stats cards row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Donut chart card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-2">
          <p className="text-[#2d2d5e] font-bold text-sm text-right w-full">نسبة الدفعات</p>
          <DonutChart paid={45} unpaid={123} />
        </div>

        {/* Monthly income */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <p className="text-[#e01c8a] font-bold text-sm">الدخل الشهري</p>
          <div>
            <p className="text-[#2d2d5e] font-black text-3xl leading-tight">980,000 دج</p>
            <p className="text-green-500 text-sm font-semibold mt-1 flex items-center gap-1">
              <span>↑</span> +210,000
            </p>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <p className="text-[#e01c8a] font-bold text-sm">نسبة الحضور شهريا</p>
          <div>
            <p className="text-[#2d2d5e] font-black text-5xl leading-tight">97%</p>
            <p className="text-green-500 text-sm font-semibold mt-1 flex items-center gap-1">
              <span>↑</span> +3.2%
            </p>
          </div>
        </div>

        {/* Human resources */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <p className="text-[#e01c8a] font-bold text-sm">الموارد البشرية</p>
          <div className="flex flex-col gap-3 mt-2">
            {[
              { label: "عدد التلاميذ", value: "324" },
              { label: "عدد الاساتذة", value: "28" },
              { label: "عدد الاداريون", value: "8" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                <span className="text-[#2d2d5e] font-bold text-base">{item.value}</span>
                <span className="text-gray-500 text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current classes table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-[#2d2d5e] font-bold text-sm">الحصص الجارية الآن</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["القاعة", "المادة", "المستوى", "الاستاذ", "الفوج", "التوقيت"].map((h) => (
                  <th key={h} className="px-4 py-3 text-gray-500 font-semibold text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentClasses.map((cls, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-[#2d2d5e] font-medium">{cls.room}</td>
                  <td className="px-4 py-3 text-gray-600">{cls.subject}</td>
                  <td className="px-4 py-3 text-gray-600">{cls.level}</td>
                  <td className="px-4 py-3 text-gray-600">{cls.teacher}</td>
                  <td className="px-4 py-3 text-gray-600">{cls.group}</td>
                  <td className="px-4 py-3 text-gray-600">{cls.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}