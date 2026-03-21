"use client";

import { useState } from "react";

export default function Settings() {
  const [admins, setAdmins] = useState([
    { id: 1, name: "ياسين الإدريسي", email: "yassine@tayssir.ma", role: "Super Admin", addedAt: "2026-03-10" },
    { id: 2, name: "أمينة بناني", email: "amina@tayssir.ma", role: "Admin", addedAt: "2026-03-15" }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "Admin" });

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email) return;

    const newEntry = {
      id: admins.length + 1,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      addedAt: new Date().toISOString().split("T")[0]
    };

    setAdmins([...admins, newEntry]);
    setShowAddForm(false);
    setNewAdmin({ name: "", email: "", role: "Admin" });
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto space-y-8" dir="rtl">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#2d2d5e] mb-2 tracking-tight">الإعدادات</h1>
          <p className="text-gray-500 font-medium">إدارة المسؤولين وإعدادات المنصة</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-linear-to-l from-[#e01c8a] to-[#2d2d5e] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#e01c8a]/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          {showAddForm ? "إلغاء الإضافة" : "+ إضافة مسؤول جديد"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-4xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-bold text-[#2d2d5e] mb-4">إضافة مسؤول جديد</h2>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الاسم الكامل</label>
                <input 
                  type="text" 
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e01c8a]/50"
                  placeholder="أدخل الاسم..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e01c8a]/50"
                  placeholder="أدخل البريد..."
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">الدور</label>
                <select 
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e01c8a]/50 bg-white"
                >
                  <option value="Admin">مسؤول (Admin)</option>
                  <option value="Super Admin">مدير عام (Super Admin)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="bg-[#2d2d5e] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#1f1f42] transition-colors"
              >
                حفظ وإضافة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins List Box */}
      <div className="bg-white rounded-4xl p-6 md:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
        <h2 className="text-xl font-bold text-[#2d2d5e] mb-6">قائمة المسؤولين</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-150">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-4 text-gray-500 font-bold whitespace-nowrap">المسؤول</th>
                <th className="pb-4 text-gray-500 font-bold whitespace-nowrap">الدور</th>
                <th className="pb-4 text-gray-500 font-bold whitespace-nowrap">تاريخ الإضافة</th>
                <th className="pb-4 text-gray-500 font-bold whitespace-nowrap text-left px-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2d2d5e]/5 flex items-center justify-center text-[#2d2d5e] font-bold shrink-0">
                        {admin.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#2d2d5e] whitespace-nowrap">{admin.name}</span>
                        <span className="text-xs text-gray-400 font-semibold">{admin.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${admin.role === 'Super Admin' ? 'bg-[#e01c8a]/10 text-[#e01c8a]' : 'bg-[#2d2d5e]/10 text-[#2d2d5e]'}`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-4 font-semibold text-gray-500">{admin.addedAt}</td>
                  <td className="py-4 text-left px-4">
                    {admin.id !== 1 && (
                      <button 
                        className="text-gray-400 group-hover:text-red-500 font-bold text-xs bg-gray-100 group-hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                        onClick={() => setAdmins(admins.filter(a => a.id !== admin.id))}
                      >
                        إزالة
                      </button>
                    )}
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