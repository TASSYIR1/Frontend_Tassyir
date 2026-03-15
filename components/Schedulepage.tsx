"use client";

import { useState } from "react";

interface Session {
  id: number;
  subject: string;
  teacher: string;
  group: string;
  room: string;
  level: string;
  time: string;
}

const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];
const times = ["8:00 - 9:00", "9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "14:00 - 15:00", "15:00 - 16:00"];
const teachers = ["أ. بن علي", "أ. حمداني", "أ. مزهود", "أ. بوزيد", "أ. رمضان"];
const subjects = ["رياضيات", "فيزياء", "عربية", "فرنسية", "تاريخ", "علوم", "انجليزية"];
const groups = ["AB12", "CD14", "EF16", "GH18", "IJ20"];
const levels = ["أولى ثانوي", "ثانية ثانوي", "ثالثة ثانوي"];
const rooms = ["31", "32", "33", "34", "35", "36", "37"];

const subjectColors: Record<string, string> = {
  رياضيات:  "bg-[#e01c8a]/10 text-[#e01c8a] border-[#e01c8a]/30",
  فيزياء:   "bg-blue-50 text-blue-600 border-blue-200",
  عربية:    "bg-green-50 text-green-700 border-green-200",
  فرنسية:   "bg-purple-50 text-purple-600 border-purple-200",
  تاريخ:    "bg-orange-50 text-orange-600 border-orange-200",
  علوم:     "bg-teal-50 text-teal-600 border-teal-200",
  انجليزية: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

// Build deterministic system schedule
let sid = 0;
const systemSchedule: Record<string, Record<string, Session[]>> = {};
days.forEach((day, di) => {
  systemSchedule[day] = {};
  times.forEach((time, ti) => {
    const count = (di * 7 + ti * 3) % 4;
    const sessions: Session[] = [];
    for (let s = 0; s < count; s++) {
      sessions.push({
        id: ++sid,
        subject:  subjects[(di + ti + s * 3) % subjects.length],
        teacher:  teachers[(di + ti + s) % teachers.length],
        group:    groups[(ti + s + di) % groups.length],
        room:     rooms[(di * 2 + ti + s) % rooms.length],
        level:    levels[(di + s) % levels.length],
        time,
      });
    }
    systemSchedule[day][time] = sessions;
  });
});

function getTeacherSchedule(teacher: string) {
  const result: Record<string, Record<string, Session[]>> = {};
  days.forEach((day) => {
    result[day] = {};
    times.forEach((time) => {
      result[day][time] = systemSchedule[day][time].filter((s) => s.teacher === teacher);
    });
  });
  return result;
}

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  const bg = count >= 3 ? "bg-[#e01c8a] text-white" : count === 2 ? "bg-purple-100 text-purple-700" : "bg-blue-50 text-blue-600";
  return <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${bg}`}>{count}</span>;
}

function SessionModal({ session, onClose }: { session: Session; onClose: () => void }) {
  const color = subjectColors[session.subject] ?? "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-5">
          <span className={`text-sm font-black px-3 py-1 rounded-xl border ${color}`}>{session.subject}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none">×</button>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { label: "الاستاذ",  value: session.teacher },
            { label: "الفوج",    value: session.group },
            { label: "القاعة",   value: `قاعة ${session.room}` },
            { label: "المستوى",  value: session.level },
            { label: "التوقيت",  value: session.time },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
              <span className="text-[#2d2d5e] font-bold text-sm">{value}</span>
              <span className="text-gray-400 text-xs">{label}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-5 w-full bg-[#e01c8a] hover:bg-[#c0157a] text-white font-bold text-sm py-2.5 rounded-xl transition-colors">
          إغلاق
        </button>
      </div>
    </div>
  );
}

function DayPanel({ day, schedule, onClose }: {
  day: string;
  schedule: Record<string, Session[]>;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Session | null>(null);
  const total = Object.values(schedule).flat().length;

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-stretch justify-end">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Panel */}
      <div
        dir="rtl"
        className="bg-white w-[420px] max-w-[95vw] flex flex-col shadow-2xl"
        style={{ height: "100vh" }}
      >
        {/* ── Fixed header ── */}
        <div className="flex-shrink-0 bg-gradient-to-l from-[#e01c8a] to-[#c0157a] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-black text-xl">{day}</p>
              <p className="text-white/75 text-sm mt-1">
                {total > 0 ? `${total} حصة في هذا اليوم` : "لا توجد حصص اليوم"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/35 transition-colors flex items-center justify-center text-white font-black text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Summary chips */}
          {total > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {times.map((t) => {
                const n = (schedule[t] ?? []).length;
                if (n === 0) return null;
                return (
                  <span key={t} className="text-[11px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full">
                    {t}: {n}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Scrollable body ── */}
        <div
          className="flex-1 overflow-y-auto bg-[#f8f8fb]"
          style={{ overflowY: "scroll" }}
        >
          <div className="p-5 flex flex-col gap-4">
            {times.map((time) => {
              const sessions = schedule[time] ?? [];
              return (
                <div key={time} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Time header */}
                  <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <CountBadge count={sessions.length} />
                    <div className="flex items-center gap-2">
                      <span className="text-[#2d2d5e] font-black text-base">{time}</span>
                    </div>
                  </div>

                  {sessions.length === 0 ? (
                    <div className="px-5 py-5 text-center">
                      <p className="text-gray-300 text-sm">لا توجد حصص في هذا التوقيت</p>
                    </div>
                  ) : (
                    <div className="p-4 flex flex-col gap-3">
                      {sessions.map((session) => {
                        const color = subjectColors[session.subject] ?? "bg-gray-50 text-gray-600 border-gray-200";
                        return (
                          <button
                            key={session.id}
                            onClick={() => setSelected(session)}
                            className={`w-full text-right border-2 rounded-2xl p-4 hover:shadow-md transition-all duration-200 ${color}`}
                          >
                            {/* Subject title */}
                            <p className="font-black text-base mb-3">{session.subject}</p>

                            {/* Info grid */}
                            <div className="grid grid-cols-2 gap-2">
                              <InfoRow icon="👨‍🏫" label="الاستاذ" value={session.teacher} />
                              <InfoRow icon="👥" label="الفوج"   value={session.group} />
                              <InfoRow icon="🏫" label="القاعة"  value={`قاعة ${session.room}`} />
                              <InfoRow icon="📚" label="المستوى" value={session.level} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom padding for comfortable scrolling */}
            <div className="h-6" />
          </div>
        </div>
      </div>

      {selected && <SessionModal session={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 bg-white/50 rounded-xl px-3 py-2">
      <span className="text-[10px] opacity-60 font-semibold">{label}</span>
      <span className="text-sm font-black leading-tight">{value}</span>
    </div>
  );
}

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [view, setView] = useState<"system" | "teacher">("system");
  const [selectedTeacher, setSelectedTeacher] = useState(teachers[0]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const activeSchedule = view === "system" ? systemSchedule : getTeacherSchedule(selectedTeacher);

  return (
    <div dir="rtl" className="p-6 flex flex-col gap-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setView("system")}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${view === "system" ? "bg-[#e01c8a] text-white shadow" : "text-gray-500 hover:text-gray-700"}`}
          >
            جدول المنظومة
          </button>
          <button
            onClick={() => setView("teacher")}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${view === "teacher" ? "bg-[#e01c8a] text-white shadow" : "text-gray-500 hover:text-gray-700"}`}
          >
            جدول أستاذ
          </button>
        </div>

        {view === "teacher" && (
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2d2d5e] font-bold focus:outline-none focus:border-[#e01c8a] bg-white"
          >
            {teachers.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}

        <p className="text-gray-400 text-xs mr-auto">اضغط على يوم أو حصة لعرض التفاصيل</p>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="p-3 w-28"></th>
                {days.map((d) => {
                  const total = Object.values(activeSchedule[d]).flat().length;
                  return (
                    <th key={d} className="p-2">
                      <button
                        onClick={() => setSelectedDay(d)}
                        className="w-full flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#e01c8a]/5 transition-colors group"
                      >
                        <span className="text-[#2d2d5e] font-black text-sm group-hover:text-[#e01c8a] transition-colors">{d}</span>
                        <CountBadge count={total} />
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {times.map((time, ti) => (
                <tr key={time} className={ti % 2 === 0 ? "bg-white" : "bg-gray-50/30"}>
                  <td className="p-3 text-gray-500 font-bold text-center whitespace-nowrap border-l border-gray-100 text-[11px]">
                    {time}
                  </td>
                  {days.map((day) => {
                    const sessions = activeSchedule[day][time];
                    return (
                      <td key={day} className="p-1.5 align-top border-l border-gray-50">
                        {sessions.length === 0 ? (
                          <div className="min-h-[52px] rounded-xl border border-dashed border-gray-100" />
                        ) : (
                          <div className="flex flex-col gap-1 min-h-[52px]">
                            {sessions.slice(0, 2).map((s) => {
                              const color = subjectColors[s.subject] ?? "bg-gray-50 text-gray-600 border-gray-200";
                              return (
                                <button
                                  key={s.id}
                                  onClick={() => setSelectedSession(s)}
                                  className={`w-full text-right rounded-lg border px-2 py-1 text-[10px] font-bold hover:opacity-80 transition-opacity ${color}`}
                                >
                                  <span className="block">{s.subject}</span>
                                  <span className="block font-normal opacity-70 truncate">{s.group}</span>
                                </button>
                              );
                            })}
                            {sessions.length > 2 && (
                              <button
                                onClick={() => setSelectedDay(day)}
                                className="text-[10px] text-[#e01c8a] font-black text-center hover:underline"
                              >
                                +{sessions.length - 2} أخرى
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(subjectColors).map(([sub, cls]) => (
          <span key={sub} className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${cls}`}>{sub}</span>
        ))}
      </div>

      {selectedDay && (
        <DayPanel
          day={selectedDay}
          schedule={activeSchedule[selectedDay]}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {selectedSession && !selectedDay && (
        <SessionModal session={selectedSession} onClose={() => setSelectedSession(null)} />
      )}
    </div>
  );
}