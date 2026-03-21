"use client";

import { useState, useMemo } from "react";
import { attendanceService } from "@/lib/api/attendance.service";

// ── Types ──────────────────────────────────────────────────────
interface AttendanceRecord {
  id: string;
  student: string;
  group: string;
  level: string;
  sessionDate: string;
  sessionSlot: string;
  present: number;
  absent: number;
  late: number;
  todayStatus: "حاضر" | "غائب" | "متأخر";
}

// ── Static data ────────────────────────────────────────────────
const groups  = ["AB12", "CD14", "EF16", "GH18", "IJ20"];
const levels  = ["أولى ثانوي", "ثانية ثانوي", "ثالثة ثانوي"];
const sessionDates = ["2026-03-16", "2026-03-17", "2026-03-18", "2026-03-19", "2026-03-20"];
const sessionSlots = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "14:00 - 15:00", "18:30 - 20:00"];
const names   = ["بن سالم اجم", "عمراني يوسف", "بوزيد سارة", "حمداني فاطمة", "مزهود كريم", "سليماني تيسير", "بوكرمة نادية", "رمضان عبد الله"];
const todayOptions: AttendanceRecord["todayStatus"][] = ["حاضر", "حاضر", "حاضر", "غائب", "حاضر", "متأخر", "حاضر", "حاضر"];

const allRecords: AttendanceRecord[] = Array.from({ length: 36 }, (_, i) => ({
  id:          `STD${200 + i}`,
  student:     names[i % names.length],
  group:       groups[i % groups.length],
  level:       levels[i % levels.length],
  sessionDate: sessionDates[i % sessionDates.length],
  sessionSlot: sessionSlots[i % sessionSlots.length],
  present:     18 + (i % 8),
  absent:      i % 7,
  late:        i % 4,
  todayStatus: todayOptions[i % todayOptions.length],
}));

// ── Status badge ───────────────────────────────────────────────
function StatusPill({ status }: { status: AttendanceRecord["todayStatus"] }) {
  const map = {
    "حاضر":   "bg-green-50 text-green-700 border border-green-200 shadow-sm",
    "غائب":   "bg-red-50 text-red-600 border border-red-200 shadow-sm",
    "متأخر":  "bg-orange-50 text-orange-600 border border-orange-200 shadow-sm",
  };
  return <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${map[status]}`}>{status}</span>;
}

// ── Mark attendance modal ──────────────────────────────────────
function MarkModal({ record, onSave, onClose }: {
  record: AttendanceRecord;
  onSave: (r: AttendanceRecord) => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<AttendanceRecord["todayStatus"]>(record.todayStatus);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-[#2d2d5e] font-black text-base">{record.student}</h2>
            <p className="text-gray-400 text-xs mt-0.5">{record.group} · {record.level}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-black text-xl transition-colors">×</button>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-xs font-bold mb-3">حالة الحضور اليوم</p>
          <div className="flex gap-3">
            {(["حاضر", "غائب", "متأخر"] as AttendanceRecord["todayStatus"][]).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all border-2 ${
                  status === s
                    ? s === "حاضر" ? "bg-green-500 text-white border-green-500"
                      : s === "غائب" ? "bg-red-500 text-white border-red-500"
                      : "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={() => { onSave({ ...record, todayStatus: status }); onClose(); }}
            className="flex-1 bg-[#e01c8a] hover:bg-[#c0157a] text-white font-bold text-sm py-2.5 rounded-xl transition-colors">حفظ</button>
          <button onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm py-2.5 rounded-xl transition-colors">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function AttendancePage({ readOnly = false }: { readOnly?: boolean }) {
  const [records, setRecords]         = useState<AttendanceRecord[]>(allRecords);
  const [search, setSearch]           = useState("");
  const [filterGroup, setFilterGroup] = useState<string>("الكل");
  const [filterLevel, setFilterLevel] = useState<string>("الكل");
  const [filterStatus, setFilterStatus] = useState<string>("الكل");
  const [selectedDate, setSelectedDate] = useState(sessionDates[0]);
  const [filterSession, setFilterSession] = useState<string>("الكل");
  const [markRecord, setMarkRecord]   = useState<AttendanceRecord | null>(null);

  const filtered = useMemo(() => records.filter(r => {
    const matchSearch = search.trim() === "" || [r.student, r.id, r.group, r.level].some(v => v.includes(search));
    const matchGroup  = filterGroup  === "الكل" || r.group  === filterGroup;
    const matchLevel  = filterLevel  === "الكل" || r.level  === filterLevel;
    const matchStatus = filterStatus === "الكل" || r.todayStatus === filterStatus;
    const matchDate   = r.sessionDate === selectedDate;
    const matchSlot   = filterSession === "الكل" || r.sessionSlot === filterSession;
    return matchSearch && matchGroup && matchLevel && matchStatus && matchDate && matchSlot;
  }), [records, search, filterGroup, filterLevel, filterStatus, selectedDate, filterSession]);

  const countPresent = filtered.filter(r => r.todayStatus === "حاضر").length;
  const countAbsent  = filtered.filter(r => r.todayStatus === "غائب").length;
  const countLate    = filtered.filter(r => r.todayStatus === "متأخر").length;
  const pct = filtered.length > 0 ? Math.round((countPresent / filtered.length) * 100) : 0;

  const handleSaveMark = (updated: AttendanceRecord) => {
    setRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const resetFilters = () => {
    setSearch("");
    setFilterGroup("الكل");
    setFilterLevel("الكل");
    setFilterStatus("الكل");
    setFilterSession("الكل");
  };

  const isFiltered = search || filterGroup !== "الكل" || filterLevel !== "الكل" || filterStatus !== "الكل" || filterSession !== "الكل";

  const handleExportPdf = async () => {
    try {
      await attendanceService.exportPdf();
    } catch (error) {
      console.error("Attendance PDF export failed:", error);
    }
  };

  const handleExportExcel = async () => {
    try {
      await attendanceService.exportExcel();
    } catch (error) {
      console.error("Attendance Excel export failed:", error);
    }
  };

  return (
    <div dir="rtl" className="p-8 flex flex-col gap-8 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 mb-2">
        <div>
          <h1 className="text-2xl font-black text-[#2d2d5e] mb-1">
            {readOnly ? "متابعة الحضور والغياب" : "إدارة الحضور والغياب"}
          </h1>
          <p className="text-sm font-semibold text-gray-500">
            {readOnly
              ? "عرض حالة الحضور حسب التاريخ والفوج والحصة بدون تعديل"
              : "تابع حضور الطلاب واستخرج الإحصائيات"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportExcel} className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors">تصدير Excel</button>
          <button onClick={handleExportPdf} className="px-3 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 text-xs font-bold hover:bg-purple-100 transition-colors">تصدير PDF</button>
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 shadow-inner">
          <span className="text-gray-400 text-lg">📅</span>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="text-base text-[#2d2d5e] font-bold focus:outline-none bg-transparent" />
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: "نسبة الحضور",     value: `${pct}%`,            color: "text-[#e01c8a]", bg: "bg-gradient-to-br from-[#e01c8a]/10 to-[#e01c8a]/5 border-2 border-[#e01c8a]/10", sub: `من ${filtered.length} طالب` },
          { label: "حاضرون اليوم",    value: String(countPresent),  color: "text-green-600", bg: "bg-gradient-to-br from-green-50 to-white border border-green-100",      sub: "طالب حاضر" },
          { label: "غائبون اليوم",    value: String(countAbsent),   color: "text-red-500",   bg: "bg-gradient-to-br from-red-50 to-white border border-red-100",        sub: "طالب غائب" },
          { label: "متأخرون اليوم",   value: String(countLate),     color: "text-orange-500",bg: "bg-gradient-to-br from-orange-50 to-white border border-orange-100",     sub: "طالب متأخر" },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 blur-2xl rounded-full -mr-8 -mt-8 pointer-events-none"></div>
            <p className={`${stat.color} font-black text-4xl mb-3 group-hover:scale-105 transition-transform origin-right`}>{stat.value}</p>
            <p className="text-[#2d2d5e] text-sm font-black">{stat.label}</p>
            <p className="text-gray-400 text-xs font-semibold mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Filter panel ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-6">
        {/* Row 1: Search + reset */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative group">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e01c8a] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ابحث باسم الطالب، المعرف، المستوى، أو الفوج..."
              className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl pr-12 pl-4 py-3.5 text-sm text-[#2d2d5e] font-bold focus:outline-none focus:bg-white focus:border-[#e01c8a]/40 focus:ring-4 focus:ring-[#e01c8a]/10 transition-all placeholder:text-gray-400 placeholder:font-semibold" />
          </div>
          {isFiltered && (
            <button onClick={resetFilters}
              className="flex items-center gap-2 text-red-500 text-sm font-bold px-5 py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 transition-colors whitespace-nowrap border-2 border-red-100 focus:outline-none focus:ring-4 focus:ring-red-500/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              تصفية البحث
            </button>
          )}
        </div>

        {/* Row 2: Filter chips */}
        <div className="flex flex-wrap gap-4 items-center bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
          <span className="text-gray-400 bg-white shadow-sm border border-gray-100 px-3 py-1.5 rounded-lg text-xs font-black flex-shrink-0">الفوج</span>
          <div className="flex items-center gap-2 flex-wrap">
            {["الكل", ...groups].map(g => (
              <button key={g} onClick={() => setFilterGroup(g)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterGroup === g ? "bg-[#e01c8a] text-white shadow-md shadow-[#e01c8a]/20 scale-105" : "bg-white text-gray-500 hover:text-[#2d2d5e] hover:bg-gray-100/80 border border-gray-200/60"}`}>
                {g}
              </button>
            ))}
          </div>

          <div className="w-px h-8 bg-gray-200/60 mx-2" />

          <span className="text-gray-400 bg-white shadow-sm border border-gray-100 px-3 py-1.5 rounded-lg text-xs font-black flex-shrink-0">المستوى</span>
          <div className="flex items-center gap-2 flex-wrap">
            {["الكل", ...levels].map(l => (
              <button key={l} onClick={() => setFilterLevel(l)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterLevel === l ? "bg-[#5B8FF9] text-white shadow-md shadow-[#5B8FF9]/20 scale-105" : "bg-white text-gray-500 hover:text-[#2d2d5e] hover:bg-gray-100/80 border border-gray-200/60"}`}>
                {l}
              </button>
            ))}
          </div>

          <div className="w-px h-8 bg-gray-200/60 mx-2" />

          <span className="text-gray-400 bg-white shadow-sm border border-gray-100 px-3 py-1.5 rounded-lg text-xs font-black flex-shrink-0">الحصة</span>
          <div className="flex items-center gap-2 flex-wrap">
            {["الكل", ...sessionSlots].map(s => (
              <button key={s} onClick={() => setFilterSession(s)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterSession === s ? "bg-[#2d2d5e] text-white shadow-md shadow-[#2d2d5e]/20 scale-105" : "bg-white text-gray-500 hover:text-[#2d2d5e] hover:bg-gray-100/80 border border-gray-200/60"}`}>
                {s}
              </button>
            ))}
          </div>

          <div className="w-px h-8 bg-gray-200/60 mx-2" />

          <span className="text-gray-400 bg-white shadow-sm border border-gray-100 px-3 py-1.5 rounded-lg text-xs font-black flex-shrink-0">الحالة</span>
          <div className="flex items-center gap-2">
            {["الكل", "حاضر", "غائب", "متأخر"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                  filterStatus === s
                    ? s === "حاضر" ? "bg-green-500 text-white shadow-md shadow-green-500/20 border-green-500 scale-105"
                      : s === "غائب" ? "bg-red-500 text-white shadow-md shadow-red-500/20 border-red-500 scale-105"
                      : s === "متأخر" ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 border-orange-500 scale-105"
                      : "bg-[#2d2d5e] text-white shadow-md border-[#2d2d5e] scale-105"
                    : "bg-white text-gray-500 hover:text-[#2d2d5e] hover:bg-gray-100/80 border-gray-200/60"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex-1">
        <div className="px-6 py-5 border-b border-gray-100/80 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-[#e01c8a] rounded-full"></div>
            <p className="text-[#2d2d5e] font-black text-lg">سجل الحضور اليومي حسب الحصة</p>
          </div>
          <span className="bg-gray-50 border border-gray-200 text-gray-500 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">{filtered.length} طالب مسجل</span>
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-5xl opacity-40">📭</span>
            </div>
            <div className="text-center">
              <p className="text-[#2d2d5e] font-black text-lg mb-1">لا توجد نتائج مطابقة</p>
              <p className="text-gray-400 font-semibold text-sm">حاول تغيير معايير البحث أو تصفية النتائج</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto h-[600px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  {[
                    "المعرف", "الطالب", "الفوج", "المستوى", "تاريخ الحصة", "التوقيت", "حاضر", "غائب", "متأخر", "الحالة اليوم",
                    ...(readOnly ? [] : ["إجراء"]),
                  ].map((h) => (
                    <th key={h} className="px-6 py-4 text-gray-500 font-black text-sm whitespace-nowrap border-b border-gray-200/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/80">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-[#e01c8a] font-black bg-[#e01c8a]/5 px-2 py-1 rounded-md">{r.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5B8FF9]/20 to-[#5B8FF9]/5 flex items-center justify-center text-[#5B8FF9] font-bold text-xs ring-2 ring-white shadow-sm">
                          {r.student.split(' ').map(n=>n[0]).join('').substring(0,2)}
                        </div>
                        <span className="text-[#2d2d5e] font-bold group-hover:text-[#5B8FF9] transition-colors">{r.student}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#1E0D3B]/5 border border-[#1E0D3B]/10 text-[#1E0D3B]/70 text-xs font-black px-3 py-1 rounded-lg shadow-sm">{r.group}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-bold text-sm bg-gray-50/30">{r.level}</td>
                    <td className="px-6 py-4 text-gray-600 font-bold text-sm">{r.sessionDate}</td>
                    <td className="px-6 py-4 text-gray-600 font-bold text-sm">{r.sessionSlot}</td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-black text-base bg-green-50 w-8 h-8 inline-flex items-center justify-center rounded-lg">{r.present}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-red-500 font-black text-base bg-red-50 w-8 h-8 inline-flex items-center justify-center rounded-lg">{r.absent}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-orange-500 font-black text-base bg-orange-50 w-8 h-8 inline-flex items-center justify-center rounded-lg">{r.late}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={r.todayStatus} />
                    </td>
                    {!readOnly && (
                      <td className="px-6 py-4">
                        <button onClick={() => setMarkRecord(r)}
                          className="flex items-center gap-2 text-sm font-black text-white bg-[#e01c8a] hover:bg-[#c0157a] hover:shadow-lg hover:shadow-[#e01c8a]/20 px-4 py-2 rounded-xl transition-all shadow-md focus:outline-none focus:ring-4 focus:ring-[#e01c8a]/20">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          تسجيل
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!readOnly && markRecord && (
        <MarkModal record={markRecord} onSave={handleSaveMark} onClose={() => setMarkRecord(null)} />
      )}
    </div>
  );
}
