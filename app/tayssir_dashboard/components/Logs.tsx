"use client";

import { useEffect, useMemo, useState } from "react";
import { schoolService } from "@/lib/api/school.service";
import type { SchoolResponse } from "@/lib/api/types";

export default function Logs() {
  const [schools, setSchools] = useState<SchoolResponse[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadSchools() {
      try {
        const data = await schoolService.listSchools();
        if (mounted) setSchools(data);
      } catch (error) {
        console.error("Failed to load logs data:", error);
      }
    }
    loadSchools();
    return () => { mounted = false; };
  }, []);

  const dbLogs = useMemo(() => {
    return [...schools]
      .sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")))
      .slice(0, 20)
      .map((school) => {
        const status = school.requestStatus;
        if (status === "ACCEPTED") {
          return { id: school.id, action: "قبول طلب", target: school.name, date: String(school.updatedAt || school.createdAt).replace("T", " ").slice(0, 16), type: "success" as const };
        }
        if (status === "REJECTED") {
          return { id: school.id, action: "رفض طلب", target: school.name, date: String(school.updatedAt || school.createdAt).replace("T", " ").slice(0, 16), type: "error" as const };
        }
        return { id: school.id, action: "إنشاء طلب", target: school.name, date: String(school.createdAt).replace("T", " ").slice(0, 16), type: "info" as const };
      });
  }, [schools]);

  return (
    <div className="p-6 md:p-8 font-cairo" dir="rtl">
      <h2 className="text-2xl font-black text-[#2d2d5e] mb-6">سجل العمليات (Logs)</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="space-y-4">
          {dbLogs.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500 font-semibold">لا توجد عمليات مسجلة في قاعدة البيانات حالياً</div>
          ) : dbLogs.map((log) => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-10 rounded-full ${
                  log.type === "success" ? "bg-emerald-500" :
                  log.type === "error" ? "bg-rose-500" :
                  "bg-blue-500"
                }`}></div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#2d2d5e]">{log.action}</span>
                    <span className="text-gray-400 text-sm">بخصوص</span>
                    <span className="font-bold text-[#e01c8a]">{log.target}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-left">
                <span className="text-xs font-bold text-gray-400 flex items-center justify-end gap-1" dir="ltr">
                  <span>{log.date}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}