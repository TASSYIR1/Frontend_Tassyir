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
    <div dir="rtl" className="p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#2d2d5e] mb-1">لوحة القيادة</h1>
          <p className="text-sm font-semibold text-gray-500">نظرة عامة وإحصائيات سريعة</p>
        </div>
        <div className="p-3 bg-[#e01c8a]/10 rounded-2xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#e01c8a]"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        </div>
      </div>

      {/* Stats cards row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Donut chart card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between w-full mb-2">
            <p className="text-[#2d2d5e] font-black w-full">نسبة الدفعات</p>
            <div className="p-2 bg-[#5B8FF9]/10 rounded-xl">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#5B8FF9]"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
            </div>
          </div>
          <DonutChart paid={45} unpaid={123} />
        </div>

        {/* Monthly income */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e01c8a]/5 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <p className="text-[#e01c8a] font-bold">الدخل الشهري</p>
            <div className="p-2 bg-[#e01c8a]/10 rounded-xl">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#e01c8a]"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[#2d2d5e] font-black text-3xl leading-tight">980,000 <span className="text-lg text-gray-400 font-bold">دج</span></p>
            <p className="text-green-500 text-sm font-bold mt-2 flex items-center gap-1 bg-green-50 w-fit px-2.5 py-1 rounded-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              +210,000
            </p>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5B8FF9]/5 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <p className="text-[#5B8FF9] font-bold">نسبة الحضور شهريا</p>
            <div className="p-2 bg-[#5B8FF9]/10 rounded-xl">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#5B8FF9]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[#2d2d5e] font-black text-4xl leading-tight">97%</p>
            <p className="text-green-500 text-sm font-bold mt-2 flex items-center gap-1 bg-green-50 w-fit px-2.5 py-1 rounded-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              +3.2%
            </p>
          </div>
        </div>

        {/* Human resources */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-purple-500 font-bold">الموارد البشرية</p>
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: "التلاميذ", value: "324" },
              { label: "الاساتذة", value: "28" },
              { label: "الاداريون", value: "8" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100">
                <span className="text-[#2d2d5e] font-black text-base">{item.value}</span>
                <span className="text-gray-500 text-xs font-bold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current classes table */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-2">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="w-2 h-6 bg-[#e01c8a] rounded-full animate-pulse"></div>
             <p className="text-[#2d2d5e] font-black text-lg">الحصص الجارية الآن</p>
          </div>
          <div className="px-3 py-1.5 bg-orange-50 text-orange-500 rounded-xl flex items-center gap-2 text-sm font-bold border border-orange-100/50">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
            مباشر
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[900px]">
            <thead className="bg-[#f8f9fc]/50">
              <tr>
                {["القاعة", "المادة", "المستوى", "الاستاذ", "الفوج", "التوقيت"].map((h) => (
                  <th key={h} className="px-6 py-4 text-gray-400 font-black text-xs text-right whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentClasses.map((cls, i) => (
                <tr key={i} className="hover:bg-pink-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center font-bold text-sm bg-purple-50 text-purple-600 rounded-xl w-10 h-10 border border-purple-100">
                      {cls.room}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#2d2d5e] font-black">{cls.subject}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold border border-gray-100">
                      {cls.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-bold">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-[#5B8FF9] items-center justify-center font-black flex border border-blue-100">
                          {cls.teacher.charAt(0)}
                        </div>
                        {cls.teacher}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-bold">{cls.group}</td>
                  <td className="px-6 py-4">
                    <span className="px-4 py-2 bg-pink-50 text-[#e01c8a] rounded-xl text-xs font-black flex items-center gap-2 w-fit border border-pink-100">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {cls.time}
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