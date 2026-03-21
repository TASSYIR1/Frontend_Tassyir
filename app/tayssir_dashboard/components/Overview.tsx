"use client";

export default function Overview() {
  const kpis = [
    { title: "طلبات في الانتظار", value: 12, label: "بانتظار المراجعة", color: "text-amber-500", bg: "bg-amber-50" },
    { title: "المدارس المقبولة", value: 145, label: "العدد الإجمالي", color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "المدارس المرفوضة", value: 3, label: "طلبات ملغاة", color: "text-rose-500", bg: "bg-rose-50" },
    { title: "المدارس النشطة", value: 142, label: "حالياً", color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 font-cairo" dir="rtl">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-semibold">{kpi.title}</span>
              <span className="text-2xl font-black text-[#2d2d5e] mt-1">{kpi.value}</span>
              <span className="text-xs text-gray-400 mt-1">{kpi.label}</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2d2d5e] text-lg">أحدث طلبات التسجيل</h3>
            <button className="text-sm font-semibold text-[#e01c8a] hover:underline">عرض الكل</button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((req, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center justify-center text-lg font-bold text-gray-600">
                    م
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2d2d5e]">مدرسة التميز والإبداع</h4>
                    <p className="text-xs text-gray-500">أحمد محمد - مدرسة عادية</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] rounded-full">
                  قيد الانتظار
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest accepted */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2d2d5e] text-lg">أحدث المدارس المنضمة</h3>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((req, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-lg font-bold text-blue-600">
                    ن
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2d2d5e]">مدرسة النجاح الأهلية</h4>
                    <p className="text-xs text-gray-500">انضمت منذ يومين</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-full">
                  نشط
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}