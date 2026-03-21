"use client";

import { useEffect, useState } from "react";
import { scheduleService } from "@/lib/api/schedule.service";
import { academicService } from "@/lib/api/academic.service";
import type { RecordMap } from "@/lib/api/types";

interface Session {
  id: number | string;
  day: string;
  subject: string;
  teacher: string;
  group: string;
  room: string;
  level: string;
  time: string;
  source?: "backend";
  scopeType?: "GROUP" | "CLASS";
  scopeId?: string;
}

const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];
const times = ["8:00 - 9:00", "9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "14:00 - 15:00", "15:00 - 16:00"];
const subjects = ["رياضيات", "فيزياء", "عربية", "فرنسية", "تاريخ", "علوم", "انجليزية"];
const levels = ["أولى ثانوي", "ثانية ثانوي", "ثالثة ثانوي"];
const rooms = ["31", "32", "33", "34", "35", "36", "37"];

const subjectColors: Record<string, string> = {
  رياضيات:  "bg-pink-50/80 text-[#e01c8a] border-pink-100",
  فيزياء:   "bg-blue-50/80 text-blue-600 border-blue-100",
  عربية:    "bg-green-50/80 text-green-700 border-green-100",
  فرنسية:   "bg-purple-50/80 text-purple-600 border-purple-100",
  تاريخ:    "bg-orange-50/80 text-orange-600 border-orange-100",
  علوم:     "bg-teal-50/80 text-teal-600 border-teal-100",
  انجليزية: "bg-yellow-50/80 text-yellow-700 border-yellow-100",
};

const toText = (value: unknown, fallback = "") =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const dayToArabic: Record<string, string> = {
  SATURDAY: "السبت",
  SUNDAY: "الأحد",
  MONDAY: "الإثنين",
  TUESDAY: "الثلاثاء",
  WEDNESDAY: "الأربعاء",
  THURSDAY: "الخميس",
};

const dayNumberToArabic: Record<number, string> = {
  1: "الإثنين",
  2: "الثلاثاء",
  3: "الأربعاء",
  4: "الخميس",
  5: "الجمعة",
  6: "السبت",
  7: "الأحد",
};

const dayArabicToNumber: Record<string, number> = {
  "الإثنين": 1,
  "الثلاثاء": 2,
  "الأربعاء": 3,
  "الخميس": 4,
  "الجمعة": 5,
  "السبت": 6,
  "الأحد": 7,
};

const normalizeTime = (value: string) => {
  const [hourPart, minutePart = "00"] = value.trim().split(":");
  const hour = hourPart.padStart(2, "0");
  const minute = minutePart.padStart(2, "0");
  return `${hour}:${minute}`;
};

const displayTime = (value: string) => normalizeTime(value).replace(/^0/, "");

const splitRange = (range: string) => {
  const [rawStart = "08:00", rawEnd = "09:00"] = range.split("-").map((part) => part.trim());
  return {
    start: normalizeTime(rawStart),
    end: normalizeTime(rawEnd),
  };
};

const mapSessionFromApi = (
  row: RecordMap,
  groupName: string,
  levelName: string,
  subjectMap: Map<string, string>,
): Session => {
  const start = toText(row.start_time, toText(row.startTime, "08:00"));
  const end = toText(row.end_time, toText(row.endTime, "09:00"));
  const dayNumeric = Number(row.day_of_week ?? row.dayOfWeek ?? row.day);
  const dayRaw = toText(row.day_of_week, toText(row.dayOfWeek, toText(row.day, "MONDAY"))).toUpperCase();
  const subjectId = toText(row.subject_id, toText(row.subjectId, ""));
  const day = Number.isFinite(dayNumeric)
    ? (dayNumberToArabic[dayNumeric] ?? "الإثنين")
    : (dayToArabic[dayRaw] ?? "الإثنين");

  return {
    id: toText(row.id, `${groupName}-${start}`),
    day,
    subject: toText(row.subject_name, toText(row.subjectName, subjectMap.get(subjectId) ?? "مادة")),
    teacher: toText(row.teacher_name, toText(row.teacherName, "غير محدد")),
    group: groupName,
    room: toText(row.room_name, toText(row.roomName, "--")),
    level: levelName,
    time: `${displayTime(start)} - ${displayTime(end)}`,
    source: "backend",
    scopeType: toText(row.scope_type, toText(row.scopeType, "GROUP")).toUpperCase() as "GROUP" | "CLASS",
    scopeId: toText(row.scope_id, toText(row.scopeId, "")),
  };
};

function buildEmptySchedule() {
  const schedule: Record<string, Record<string, Session[]>> = {};
  days.forEach((day) => {
    schedule[day] = {};
    times.forEach((time) => {
      schedule[day][time] = [];
    });
  });
  return schedule;
}

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  const bg = count >= 3 ? "bg-[#e01c8a] text-white shadow-sm shadow-[#e01c8a]/30" : count === 2 ? "bg-purple-500 text-white shadow-sm shadow-purple-500/30" : "bg-[#5B8FF9] text-white shadow-sm shadow-[#5B8FF9]/30";
  return <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${bg} min-w-[20px] text-center inline-block`}>{count}</span>;
}

function SessionModal({ session, onClose }: { session: Session; onClose: () => void }) {
  const color = subjectColors[session.subject] ?? "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.2)] p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <span className={`text-sm font-black px-4 py-1.5 rounded-xl border-2 shadow-sm ${color}`}>{session.subject}</span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold transition-colors">×</button>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { label: "الاستاذ",  value: session.teacher, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#5B8FF9]"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
            { label: "الفوج",    value: session.group, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#e01c8a]"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
            { label: "القاعة",   value: `قاعة ${session.room}`, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
            { label: "المستوى",  value: session.level, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> },
            { label: "التوقيت",  value: session.time, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-center justify-between bg-white hover:bg-gray-50 transition-colors rounded-2xl p-3.5 border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-sm border border-gray-100">{icon}</span>
                <span className="text-[#2d2d5e] font-black text-sm">{value}</span>
              </div>
              <span className="text-gray-400 text-[11px] font-bold">{label}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-6 w-full bg-[#e01c8a] hover:bg-[#c0157a] hover:-translate-y-0.5 shadow-lg shadow-[#e01c8a]/20 text-white font-black text-sm py-3 rounded-2xl transition-all">
          إغلاق
        </button>
      </div>
    </div>
  );
}

function DayPanel({ day, schedule, timesList, onClose }: {
  day: string;
  schedule: Record<string, Session[]>;
  timesList: string[];
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Session | null>(null);
  const total = Object.values(schedule).flat().length;

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-stretch justify-end">
      {/* Click outside to close */}
      <div className="flex-1 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        dir="rtl"
        className="bg-white w-[420px] max-w-[95vw] flex flex-col shadow-2xl rounded-l-3xl overflow-hidden translate-x-0"
        style={{ height: "100vh" }}
      >
        {/* ── Fixed header ── */}
        <div className="flex-shrink-0 bg-gradient-to-br from-[#e01c8a] to-[#c0157a] px-6 py-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-white font-black text-3xl mb-1">{day}</p>
              <p className="text-white/80 text-sm font-bold bg-white/10 w-fit px-3 py-1 rounded-lg">
                {total > 0 ? `${total} حصص في هذا اليوم` : "لا توجد حصص اليوم"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-center text-white font-black text-xl backdrop-blur-md border border-white/10"
            >
              ×
            </button>
          </div>

          {/* Summary chips */}
          {total > 0 && (
            <div className="flex gap-2 mt-5 flex-wrap relative z-10">
              {timesList.map((t) => {
                const n = (schedule[t] ?? []).length;
                if (n === 0) return null;
                return (
                  <span key={t} className="text-[11px] bg-white/20 text-white font-bold px-3 py-1.5 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
                    {t} <span className="mr-1 bg-white text-[#e01c8a] px-1.5 py-0.5 rounded-md text-[9px]">{n}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Scrollable body ── */}
        <div
          className="flex-1 overflow-y-auto bg-[#f8f9fc] custom-scrollbar"
        >
          <div className="p-6 flex flex-col gap-6">
            {timesList.map((time) => {
              const sessions = schedule[time] ?? [];
              return (
                <div key={time} className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
                  {/* Time header */}
                  <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-50">
                    <CountBadge count={sessions.length} />
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-5 bg-[#5B8FF9] rounded-full"></div>
                      <span className="text-[#2d2d5e] font-black text-base">{time}</span>
                    </div>
                  </div>

                  {sessions.length === 0 ? (
                    <div className="px-5 py-8 text-center bg-gray-50/50">
                      <p className="text-gray-400 font-bold text-sm">لا توجد حصص في هذا التوقيت</p>
                    </div>
                  ) : (
                    <div className="p-5 flex flex-col gap-3 bg-gray-50/30">
                      {sessions.map((session) => {
                        const color = subjectColors[session.subject] ?? "bg-gray-50 text-gray-600 border-gray-200";
                        return (
                          <button
                            key={session.id}
                            onClick={() => setSelected(session)}
                            className={`w-full text-right border-2 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group ${color}`}
                          >
                            {/* Subject title */}
                            <div className="flex items-center justify-between mb-4">
                              <p className="font-black text-lg">{session.subject}</p>
                              <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                              </div>
                            </div>

                            {/* Info grid */}
                            <div className="grid grid-cols-2 gap-3">
                              <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#5B8FF9]"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>} label="الاستاذ" value={session.teacher} />
                              <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#e01c8a]"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>} label="الفوج" value={session.group} />
                              <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>} label="القاعة" value={`قاعة ${session.room}`} />
                              <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>} label="المستوى" value={session.level} />
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

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/60 rounded-xl px-4 py-3 border border-white/50 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.02)] group hover:bg-white transition-colors">
      <div className="w-8 h-8 rounded-lg bg-gray-100/80 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-gray-500 font-bold">{label}</span>
        <span className="text-sm font-black text-[#2d2d5e] leading-tight">{value}</span>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [view, setView] = useState<"system" | "teacher">("system");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [groupOptions, setGroupOptions] = useState<Array<{ id: string; name: string; level: string }>>([]);
  const [classOptions, setClassOptions] = useState<Array<{ id: string; name: string; level: string }>>([]);
  const [subjectOptions, setSubjectOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [newEntry, setNewEntry] = useState({
    scopeType: "group" as "group" | "class",
    scopeId: "",
    day: days[0],
    time: times[0],
    subjectId: "",
    room: rooms[0],
  });

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const [classRows, groupRows, subjectRows] = await Promise.all([
        academicService.getClasses(),
        academicService.getGroups(),
        academicService.getSubjects(),
      ]);

      const classes = classRows.map((row) => ({
        id: toText(row.id, ""),
        name: toText(row.name, "قسم"),
        level: toText(row.level_label, toText(row.levelLabel, "غير محدد")),
      })).filter((row) => row.id.length > 0);

      const groups = groupRows.map((row) => ({
        id: toText(row.id, ""),
        name: toText(row.name, "فوج"),
        level: toText(row.level_label, toText(row.levelLabel, "غير محدد")),
      })).filter((row) => row.id.length > 0);

      const subjectsMap = new Map(
        subjectRows
          .map((row) => [toText(row.id, ""), toText(row.name, "مادة")] as const)
          .filter(([id]) => id.length > 0),
      );

      const classSchedules = await Promise.allSettled(
        classes.map(async (entry) => {
          const rows = await scheduleService.getClassSchedule(entry.id);
          return rows.map((row) => mapSessionFromApi(row, entry.name, entry.level, subjectsMap));
        }),
      );

      const groupSchedules = await Promise.allSettled(
        groups.map(async (entry) => {
          const rows = await scheduleService.getGroupSchedule(entry.id);
          return rows.map((row) => mapSessionFromApi(row, entry.name, entry.level, subjectsMap));
        }),
      );

      const allSessions = [...classSchedules, ...groupSchedules]
        .filter((result): result is PromiseFulfilledResult<Session[]> => result.status === "fulfilled")
        .flatMap((result) => result.value);

      const subjectOptionsData = subjectRows
        .map((row) => ({ id: toText(row.id, ""), name: toText(row.name, "مادة") }))
        .filter((row) => row.id.length > 0);

      const teacherNames = Array.from(new Set(allSessions.map((item) => item.teacher).filter((name) => name.trim().length > 0)));

      setSessions(allSessions);
      setClassOptions(classes);
      setGroupOptions(groups);
      setSubjectOptions(subjectOptionsData);
      setSelectedTeacher((prev) => prev || teacherNames[0] || "");
      setNewEntry((prev) => ({
        ...prev,
        scopeId: prev.scopeId || groups[0]?.id || classes[0]?.id || "",
        subjectId: prev.subjectId || subjectOptionsData[0]?.id || "",
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSchedules();
  }, []);

  const activeSchedule = (() => {
    const schedule = buildEmptySchedule();
    const selectedSessions = view === "teacher"
      ? sessions.filter((item) => item.teacher === selectedTeacher)
      : sessions;

    selectedSessions.forEach((item) => {
      if (!schedule[item.day] || !schedule[item.day][item.time]) return;
      schedule[item.day][item.time].push(item);
    });

    return schedule;
  })();

  const createNewSchedule = async () => {
    if (!newEntry.scopeId || !newEntry.subjectId) return;

    const { start, end } = splitRange(newEntry.time);
    const payload: RecordMap = {
      subjectId: newEntry.subjectId,
      roomName: newEntry.room,
      dayOfWeek: dayArabicToNumber[newEntry.day] ?? 1,
      startTime: start,
      endTime: end,
    };

    try {
      if (newEntry.scopeType === "group") {
        await scheduleService.createGroupSession(newEntry.scopeId, payload);
      } else {
        await scheduleService.createClassSession(newEntry.scopeId, payload);
      }
      await loadSchedules();
      setShowCreateModal(false);
    } catch {
      alert("تعذر حفظ الجدولة على الخادم");
    }
  };

  const teacherOptions = Array.from(new Set(sessions.map((item) => item.teacher).filter((name) => name.trim().length > 0)));

  const gridTimes = Array.from(new Set([...times, ...sessions.map((item) => item.time)])).sort((left, right) => {
    const leftStart = splitRange(left).start;
    const rightStart = splitRange(right).start;
    return leftStart.localeCompare(rightStart);
  });

  return (
    <div dir="rtl" className="p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#2d2d5e] mb-1">إستعمال الزمن</h1>
          <p className="text-sm font-semibold text-gray-500">قم بمتابعة جداول التوقيت والأقسام</p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-50/80 p-2 rounded-2xl border border-gray-100">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#e01c8a] hover:bg-[#c0157a] text-white text-sm font-black transition-colors shadow-sm"
          >
            إضافة جدولة جديدة
          </button>

          <div className="flex bg-gray-200/60 rounded-xl p-1 gap-1">
            <button
              onClick={() => setView("system")}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${view === "system" ? "bg-white text-[#e01c8a] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              جدول المنظومة
            </button>
            <button
              onClick={() => setView("teacher")}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${view === "teacher" ? "bg-white text-[#e01c8a] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              جدول أستاذ
            </button>
          </div>

          {view === "teacher" && (
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-[#2d2d5e] font-bold focus:outline-none focus:border-[#e01c8a] focus:ring-4 focus:ring-[#e01c8a]/10 bg-white transition-all shadow-sm"
            >
              {teacherOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="w-2 h-6 bg-[#5B8FF9] rounded-full"></div>
             <p className="text-[#2d2d5e] font-black text-lg">الجدول الأسبوعي</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-gray-400 text-xs font-bold bg-gray-50 px-4 py-2 rounded-full border border-gray-100 flex items-center gap-2">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
               <span>اضغط على يوم أو حصة لعرض التفاصيل</span>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto p-4 flex-1 bg-[#f8f9fc]/30 pb-8">
          <table className="w-full text-sm border-collapse min-w-[900px] bg-white rounded-2xl shadow-sm border border-gray-100">
            <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
              <tr className="border-b border-gray-100">
                <th className="p-4 w-28 text-gray-400 font-black text-xs">التوقيت</th>
                {days.map((d) => {
                  const total = Object.values(activeSchedule[d]).flat().length;
                  return (
                    <th key={d} className="p-3 border-r border-gray-100/50 first:border-r-0">
                      <button
                        onClick={() => setSelectedDay(d)}
                        className="w-full flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white hover:shadow-sm hover:border-gray-100 border border-transparent transition-all group"
                      >
                        <span className="text-[#2d2d5e] font-black text-sm group-hover:text-[#e01c8a] transition-colors">{d}</span>
                        <CountBadge count={total} />
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {gridTimes.map((time) => (
                <tr key={time} className="hover:bg-blue-50/10 transition-colors group/row">
                  <td className="p-4 text-gray-500 font-black text-center whitespace-nowrap border-l border-gray-100/60 text-xs bg-gray-50/30 group-hover/row:bg-white transition-colors">
                    {time}
                  </td>
                  {days.map((day) => {
                    const sessions = activeSchedule[day][time];
                    return (
                      <td key={day} className="p-2.5 align-top border-l border-gray-50/60">
                        {sessions.length === 0 ? (
                          <div className="min-h-[64px] rounded-xl border-2 border-dashed border-gray-100/60 bg-gray-50/30 w-full h-full" />
                        ) : (
                          <div className="flex flex-col gap-2 min-h-[64px]">
                            {sessions.slice(0, 2).map((s) => {
                              const color = subjectColors[s.subject] ?? "bg-gray-50 text-gray-600 border-gray-200";
                              return (
                                <button
                                  key={s.id}
                                  onClick={() => setSelectedSession(s)}
                                  className={`w-full text-right rounded-xl border-2 px-3 py-2 text-[11px] font-bold hover:opacity-90 hover:scale-[1.02] hover:shadow-md transition-all duration-200 ${color}`}
                                >
                                  <span className="block font-black mb-0.5">{s.subject}</span>
                                  <div className="flex items-center justify-between opacity-80 font-semibold text-[10px]">
                                    <span className="truncate">{s.group}</span>
                                    <span>{s.room}</span>
                                  </div>
                                </button>
                              );
                            })}
                            {sessions.length > 2 && (
                              <button
                                onClick={() => setSelectedDay(day)}
                                className="group/btn text-[11px] bg-gradient-to-r from-gray-50 to-gray-100 text-[#2d2d5e] border border-gray-200 font-black text-center hover:border-[#e01c8a]/30 hover:to-pink-50 hover:text-[#e01c8a] transition-all duration-300 rounded-xl py-2 flex items-center justify-center gap-1.5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]"
                              >
                                <span className="bg-white px-1.5 py-0.5 rounded-md shadow-sm border border-gray-100 group-hover/btn:border-[#e01c8a]/20 group-hover/btn:text-[#e01c8a]">+{sessions.length - 2}</span>
                                <span className="pt-0.5">حصص أخرى</span>
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
      <div className="flex flex-wrap gap-2 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mt-[-10px] z-10 w-fit mx-auto">
        <span className="text-xs font-black text-gray-400 space-x-reverse ml-3">المواد:</span>
        {Object.entries(subjectColors).map(([sub, cls]) => (
          <span key={sub} className={`text-[11px] font-black px-3 py-1.5 rounded-xl border-2 shadow-sm ${cls}`}>{sub}</span>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#2d2d5e] text-lg font-black">جلسات الجدول من الخادم</h2>
          <span className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
            {sessions.length} جلسة
          </span>
        </div>

        {loading ? (
          <p className="text-sm font-bold text-gray-400">جاري تحميل الجلسات...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm font-bold text-gray-400">لا توجد جلسات مجدولة بعد.</p>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-black">
                  <th className="py-3 px-4">الفئة</th>
                  <th className="py-3 px-4">المستهدف</th>
                  <th className="py-3 px-4">اليوم / التوقيت</th>
                  <th className="py-3 px-4">المادة</th>
                  <th className="py-3 px-4">الأستاذ</th>
                  <th className="py-3 px-4">القسم/الفوج</th>
                  <th className="py-3 px-4">القاعة</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((entry) => (
                  <tr key={String(entry.id)} className="border-b border-gray-50 text-sm font-bold text-gray-600">
                    <td className="py-3 px-4">
                      <span className="bg-rose-50 text-[#e01c8a] border border-rose-100 rounded-lg px-2 py-1 text-xs font-black">
                        {entry.scopeType === "GROUP" ? "فوج" : "قسم"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{entry.group}</td>
                    <td className="py-3 px-4">{entry.day} - {entry.time}</td>
                    <td className="py-3 px-4">{entry.subject}</td>
                    <td className="py-3 px-4">{entry.teacher}</td>
                    <td className="py-3 px-4">{entry.group}</td>
                    <td className="py-3 px-4">{entry.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedDay && (
        <DayPanel
          day={selectedDay}
          schedule={activeSchedule[selectedDay]}
          timesList={gridTimes}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {selectedSession && !selectedDay && (
        <SessionModal session={selectedSession} onClose={() => setSelectedSession(null)} />
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div dir="rtl" className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[#2d2d5e] text-xl font-black">إضافة جدولة جديدة</h2>
              <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">×</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-gray-500 block mb-2">الفئة المستهدفة</label>
                <select value={newEntry.scopeType} onChange={(e) => setNewEntry((prev) => ({ ...prev, scopeType: e.target.value as "group" | "class", scopeId: "" }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#2d2d5e]">
                  <option value="group">فوج</option>
                  <option value="class">قسم</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-gray-500 block mb-2">القسم/الفوج المستهدف</label>
                <select value={newEntry.scopeId} onChange={(e) => setNewEntry((prev) => ({ ...prev, scopeId: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#2d2d5e]">
                  <option value="">اختر...</option>
                  {(newEntry.scopeType === "group" ? groupOptions : classOptions).map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-gray-500 block mb-2">اليوم</label>
                <select value={newEntry.day} onChange={(e) => setNewEntry((prev) => ({ ...prev, day: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#2d2d5e]">
                  {days.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-gray-500 block mb-2">التوقيت</label>
                <select value={newEntry.time} onChange={(e) => setNewEntry((prev) => ({ ...prev, time: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#2d2d5e]">
                  {times.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-gray-500 block mb-2">المادة</label>
                <select value={newEntry.subjectId} onChange={(e) => setNewEntry((prev) => ({ ...prev, subjectId: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#2d2d5e]">
                  <option value="">اختر المادة...</option>
                  {subjectOptions.map((subject) => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-gray-500 block mb-2">القاعة</label>
                <input value={newEntry.room} onChange={(e) => setNewEntry((prev) => ({ ...prev, room: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#2d2d5e]" />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={createNewSchedule} className="flex-1 bg-[#e01c8a] hover:bg-[#c0157a] text-white font-black py-2.5 rounded-xl transition-colors">حفظ الجدولة</button>
              <button onClick={() => setShowCreateModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black py-2.5 rounded-xl transition-colors">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}