"use client";

export default function Statistics() {
  return (
    <div className="p-6 md:p-8 font-cairo" dir="rtl">
      <h2 className="text-2xl font-black text-[#2d2d5e] mb-6">الإحصائيات والتقارير</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Placeholder Stat 1 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <h3 className="font-bold text-gray-500 mb-4">معدل قبول الطلبات</h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-emerald-500">85%</span>
            <span className="text-sm font-bold text-gray-400 mb-1">+5% هذا الشهر</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-[85%]"></div>
          </div>
        </div>

        {/* Placeholder Stat 2 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <h3 className="font-bold text-gray-500 mb-4">توزيع أنواع المدارس</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-[#2d2d5e]">مدارس عادية</span>
                <span className="text-blue-500">70%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full w-[70%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-[#2d2d5e]">مراكز دروس دعم</span>
                <span className="text-[#e01c8a]">30%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#e01c8a] h-full rounded-full w-[30%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder Stat 3 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <h3 className="font-bold text-gray-500 mb-4">أداء النمو (المدارس الجديدة)</h3>
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <span className="block text-5xl font-black text-[#2d2d5e]">24</span>
              <span className="text-sm font-bold text-gray-400 mt-2 block">مدرسة منضمة في آخر 30 يوم</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}