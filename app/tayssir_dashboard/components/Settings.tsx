"use client";

import { useEffect, useState } from "react";
import { schoolService } from "@/lib/api/school.service";
import type { SchoolResponse } from "@/lib/api/types";

export default function Settings() {
  const [schools, setSchools] = useState<SchoolResponse[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadSchools() {
      try {
        const data = await schoolService.listSchools();
        if (mounted) setSchools(data);
      } catch (error) {
        console.error("Failed to load settings data:", error);
      }
    }
    loadSchools();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#2d2d5e] mb-2 tracking-tight">الإعدادات</h1>
        <p className="text-gray-500 font-medium">عرض بيانات الإعدادات المتاحة من قاعدة البيانات فقط</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#2d2d5e] mb-4">ملخص المنصة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-sm text-gray-500 font-semibold">إجمالي المدارس</p>
            <p className="text-2xl font-black text-[#2d2d5e] mt-1">{schools.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-sm text-gray-500 font-semibold">طلبات معلقة</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{schools.filter(s => s.requestStatus === "PENDING").length}</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-sm text-gray-500 font-semibold">مدارس نشطة</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{schools.filter(s => s.active).length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-[#2d2d5e] mb-2">تنبيه</h2>
        <p className="text-sm text-gray-500 font-semibold">
          إدارة مستخدمي المنصة (Platform Admins) غير متاحة حالياً عبر API، لذلك لا يتم عرض أي بيانات افتراضية أو إدخال Mock هنا.
        </p>
      </div>
    </div>
  );
}
