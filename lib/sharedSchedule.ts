export type ScheduleTargetType = "group" | "teacher" | "secretary";

export interface SharedScheduleEntry {
  id: string;
  targetType: ScheduleTargetType;
  targetValue: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  group: string;
  room: string;
  level?: string;
  notes?: string;
  createdAt: string;
}

export const SCHEDULE_STORAGE_KEY = "tamkin_shared_schedule_v1";

export const WEEK_DAYS = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];

export const WEEK_TIMES = [
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "18:30 - 20:00",
];

function hasWindow() {
  return typeof window !== "undefined";
}

export function readSharedSchedules(): SharedScheduleEntry[] {
  if (!hasWindow()) return [];

  try {
    const raw = window.localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SharedScheduleEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function writeSharedSchedules(entries: SharedScheduleEntry[]) {
  if (!hasWindow()) return;
  window.localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(entries));
}

export function addSharedSchedule(
  entry: Omit<SharedScheduleEntry, "id" | "createdAt">
): SharedScheduleEntry[] {
  const nextEntry: SharedScheduleEntry = {
    ...entry,
    id: `SCH-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const current = readSharedSchedules();
  const next = [nextEntry, ...current];
  writeSharedSchedules(next);
  return next;
}

export function getSchedulesByTarget(
  targetType: ScheduleTargetType,
  targetValue: string
): SharedScheduleEntry[] {
  return readSharedSchedules().filter(
    (item) => item.targetType === targetType && item.targetValue === targetValue
  );
}
