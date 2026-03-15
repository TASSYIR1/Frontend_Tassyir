"use client";

const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];
const times = ["8:00 - 9:00", "9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "14:00 - 15:00", "15:00 - 16:00"];

const subjects = ["رياضيات", "فيزياء", "عربية", "فرنسية", "تاريخ", "علوم", "انجليزية"];
const colors = [
  "bg-[#e01c8a]/10 text-[#e01c8a] border-[#e01c8a]/20",
  "bg-blue-50 text-blue-600 border-blue-100",
  "bg-green-50 text-green-600 border-green-100",
  "bg-purple-50 text-purple-600 border-purple-100",
  "bg-orange-50 text-orange-600 border-orange-100",
  "bg-teal-50 text-teal-600 border-teal-100",
];

const schedule: Record<string, Record<string, { subject: string; teacher: string; room: string } | null>> = {};
days.forEach((day) => {
  schedule[day] = {};
  times.forEach((time) => {
    schedule[day][time] =
      Math.random() > 0.35
        ? {
            subject: subjects[Math.floor(Math.random() * subjects.length)],
            teacher: "الاستاذ بن علي",
            room: String(30 + Math.floor(Math.random() * 10)),
          }
        : null;
  });
});

export default function SchedulePage() {
  return (
    <div dir="rtl" className="p-6 flex flex-col gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-[#2d2d5e] font-bold text-sm">الجدول الأسبوعي</p>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-gray-400 font-semibold w-28"></th>
                {days.map((d) => (
                  <th key={d} className="p-2 text-[#2d2d5e] font-bold text-center bg-gray-50 rounded-lg">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time) => (
                <tr key={time}>
                  <td className="p-2 text-gray-500 font-medium text-center whitespace-nowrap">{time}</td>
                  {days.map((day) => {
                    const cell = schedule[day][time];
                    const colorClass = cell ? colors[subjects.indexOf(cell.subject) % colors.length] : "";
                    return (
                      <td key={day} className="p-1.5">
                        {cell ? (
                          <div className={`rounded-xl border p-2 text-center ${colorClass}`}>
                            <p className="font-bold">{cell.subject}</p>
                            <p className="text-[10px] opacity-70 mt-0.5">{cell.room}</p>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-gray-100 p-2 h-full min-h-[52px]" />
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
    </div>
  );
}