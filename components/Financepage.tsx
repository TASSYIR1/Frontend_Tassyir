"use client";

import { useState, useMemo } from "react";

// ── Types ──────────────────────────────────────────────────────
interface Payment {
  id: string;
  student: string;
  group: string;
  level: string;
  amount: number;
  date: string;
  method: "نقدي" | "تحويل";
  status: "مدفوع" | "غير مدفوع";
}

// ── Static data ────────────────────────────────────────────────
const groups  = ["AB12", "CD14", "EF16", "GH18", "IJ20"];
const levels  = ["أولى ثانوي", "ثانية ثانوي", "ثالثة ثانوي"];
const names   = ["بن سالم اجم", "عمراني يوسف", "بوزيد سارة", "حمداني فاطمة", "مزهود كريم", "سليماني تيسير"];

const allPayments: Payment[] = Array.from({ length: 32 }, (_, i) => ({
  id:      `PAY-${1000 + i}`,
  student: names[i % names.length],
  group:   groups[i % groups.length],
  level:   levels[i % levels.length],
  amount:  (Math.floor(i * 7 + 3) % 8 + 3) * 1000,
  date:    `${String((i % 28) + 1).padStart(2, "0")}/03/2026`,
  method:  i % 2 === 0 ? "نقدي" : "تحويل",
  status:  i % 5 === 4 ? "غير مدفوع" : "مدفوع",
}));

// ── Add Payment Modal ──────────────────────────────────────────
function AddModal({ onAdd, onClose }: { onAdd: (p: Payment) => void; onClose: () => void }) {
  const [form, setForm] = useState({ student: "", group: groups[0], level: levels[0], amount: 5000, method: "نقدي" as Payment["method"] });

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div dir="rtl" className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-lg border border-white/50 animate-in fade-in zoom-in duration-200 relative overflow-hidden">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#e01c8a]/10 to-transparent rounded-full blur-3xl -z-10 animate-pulse" />

        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-50 rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e01c8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
            </div>
            <h2 className="text-[#2d2d5e] font-black text-xl">دفعة جديدة</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 hover:bg-rose-50 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        
        <div className="p-8 flex flex-col gap-5">
          {[["اسم الطالب", "student"] as const].map(([label, key]) => (
            <div key={key} className="group">
              <label className="text-gray-500 text-sm font-bold block mb-2 group-focus-within:text-[#e01c8a] transition-colors">{label}</label>
              <div className="relative">
                <input value={form[key]} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={`أدخل ${label}`}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e01c8a]/20 focus:border-[#e01c8a] transition-all font-bold placeholder-gray-400" />
              </div>
            </div>
          ))}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="text-gray-500 text-sm font-bold block mb-2 group-focus-within:text-[#e01c8a] transition-colors">الفوج</label>
              <select value={form.group} onChange={(e) => setForm(f => ({ ...f, group: e.target.value }))}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e01c8a]/20 focus:border-[#e01c8a] transition-all font-bold appearance-none cursor-pointer text-gray-700">
                {groups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="group">
              <label className="text-gray-500 text-sm font-bold block mb-2 group-focus-within:text-[#e01c8a] transition-colors">المستوى</label>
              <select value={form.level} onChange={(e) => setForm(f => ({ ...f, level: e.target.value }))}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e01c8a]/20 focus:border-[#e01c8a] transition-all font-bold appearance-none cursor-pointer text-gray-700">
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="text-gray-500 text-sm font-bold block mb-2 group-focus-within:text-[#e01c8a] transition-colors">المبلغ (دج)</label>
              <div className="relative">
                <input type="number" value={form.amount} onChange={(e) => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e01c8a]/20 focus:border-[#e01c8a] transition-all font-bold text-gray-700 font-mono" />
              </div>
            </div>
            <div className="group">
              <label className="text-gray-500 text-sm font-bold block mb-2 group-focus-within:text-[#e01c8a] transition-colors">طريقة الدفع</label>
              <select value={form.method} onChange={(e) => setForm(f => ({ ...f, method: e.target.value as Payment["method"] }))}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e01c8a]/20 focus:border-[#e01c8a] transition-all font-bold appearance-none cursor-pointer text-gray-700">
                <option value="نقدي">نقدي</option>
                <option value="تحويل">تحويل</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-4 p-8 pt-2 bg-gray-50/50">
          <button onClick={() => {
            if (!form.student.trim()) return;
            onAdd({ ...form, id: `PAY-${Date.now()}`, date: new Date().toLocaleDateString("ar-DZ"), status: "مدفوع" });
            onClose();
          }} className="flex-1 bg-gradient-to-r from-[#e01c8a] to-[#ff42a5] hover:from-[#c0157a] hover:to-[#e01c8a] shadow-[0_8px_20px_-8px_rgba(224,28,138,0.5)] shadow-[#e01c8a]/30 hover:shadow-[#e01c8a]/50 text-white font-black text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            تأكيد الإضافة
          </button>
          <button onClick={onClose} className="flex-1 bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-500 font-bold text-sm py-4 rounded-xl transition-all active:scale-95">
            إلغاء الأمر
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function FinancePage() {
  const [payments, setPayments]       = useState<Payment[]>(allPayments);
  const [search, setSearch]           = useState("");
  const [filterGroup, setFilterGroup] = useState<string>("الكل");
  const [filterLevel, setFilterLevel] = useState<string>("الكل");
  const [filterStatus, setFilterStatus] = useState<string>("الكل");
  const [filterMethod, setFilterMethod] = useState<string>("الكل");
  const [showAdd, setShowAdd]         = useState(false);

  const filtered = useMemo(() => payments.filter(p => {
    const matchSearch  = search.trim() === "" || [p.student, p.id, p.group, p.level].some(v => v.includes(search));
    const matchGroup   = filterGroup  === "الكل" || p.group  === filterGroup;
    const matchLevel   = filterLevel  === "الكل" || p.level  === filterLevel;
    const matchStatus  = filterStatus === "الكل" || p.status === filterStatus;
    const matchMethod  = filterMethod === "الكل" || p.method === filterMethod;
    return matchSearch && matchGroup && matchLevel && matchStatus && matchMethod;
  }), [payments, search, filterGroup, filterLevel, filterStatus, filterMethod]);

  const totalPaid   = filtered.filter(p => p.status === "مدفوع").reduce((a, b) => a + b.amount, 0);
  const totalUnpaid = filtered.filter(p => p.status === "غير مدفوع").reduce((a, b) => a + b.amount, 0);
  const totalAll    = filtered.reduce((a, b) => a + b.amount, 0);

  const resetFilters = () => {
    setSearch(""); setFilterGroup("الكل"); setFilterLevel("الكل");
    setFilterStatus("الكل"); setFilterMethod("الكل");
  };

  const isFiltered = search || filterGroup !== "الكل" || filterLevel !== "الكل" || filterStatus !== "الكل" || filterMethod !== "الكل";

  return (
    <div dir="rtl" className="p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#2d2d5e] mb-1">المالية والمداخيل</h1>
          <p className="text-sm font-semibold text-gray-500">إدارة مدفوعات الطلاب وتتبع الإيرادات</p>
        </div>
        <div className="p-3 bg-green-500/10 rounded-2xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "إجمالي الفواتير", value: totalAll,    color: "text-[#e01c8a]", bg: "bg-gradient-to-br from-[#e01c8a]/10 to-[#e01c8a]/5 border border-[#e01c8a]/10", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M2 9.5h20"/></svg> },
          { label: "المدفوع",          value: totalPaid,   color: "text-green-600", bg: "bg-gradient-to-br from-green-50 to-green-50/50 border border-green-100", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg> },
          { label: "غير المدفوع",      value: totalUnpaid, color: "text-red-500",   bg: "bg-gradient-to-br from-red-50 to-red-50/50 border border-red-100", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
        ].map(stat => (
          <div key={stat.label} className={`rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] ${stat.bg}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center justify-between mb-4">
               <p className="text-gray-600 text-sm font-black">{stat.label}</p>
               <div className={`p-2 rounded-xl bg-white/60 shadow-sm ${stat.color}`}>
                 {stat.icon}
               </div>
            </div>
            <p className={`${stat.color} font-black text-3xl leading-tight`}>{stat.value.toLocaleString()} <span className="text-lg font-bold opacity-60">دج</span></p>
            <p className="text-gray-500 text-xs mt-3 flex items-center gap-1.5 font-bold">
               <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
               {filtered.length} سجل معروض
            </p>
          </div>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col gap-6">
        {/* Search + Add */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full relative group">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e01c8a] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث باسم الطالب، رقم الدفعة، الفوج..."
              className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pr-12 pl-4 py-3.5 text-sm text-[#2d2d5e] font-bold focus:outline-none focus:bg-white focus:shadow-[0_4px_20px_-4px_rgba(224,28,138,0.1)] focus:border-[#e01c8a]/30 transition-all placeholder:font-semibold" />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            {isFiltered && (
              <button onClick={resetFilters} className="text-[#e01c8a] text-xs font-black px-4 py-3.5 rounded-2xl bg-[#e01c8a]/5 border border-[#e01c8a]/10 hover:bg-[#e01c8a]/10 transition-colors whitespace-nowrap flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                مسح الفلاتر
              </button>
            )}
            <button onClick={() => setShowAdd(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#e01c8a] hover:bg-[#c0157a] hover:scale-[1.02] text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-[0_4px_15px_-3px_rgba(224,28,138,0.4)] transition-all whitespace-nowrap">
              <span className="text-xl font-medium mb-0.5">+</span><span>دفعة جديدة</span>
            </button>
          </div>
        </div>

        {/* Filter chips row */}
        <div className="flex flex-wrap gap-2 items-center bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100">
          <span className="text-gray-400 text-xs font-black flex-shrink-0 px-2 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            تصفية النتائج:
          </span>

          {/* Group filter */}
          <div className="flex items-center gap-1 flex-wrap">
            {["الكل", ...groups].map(g => (
              <button key={g} onClick={() => setFilterGroup(g)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-300 ${filterGroup === g ? "bg-[#e01c8a] text-white shadow-sm" : "bg-white border border-gray-100/50 text-gray-500 hover:bg-gray-100 hover:text-[#2d2d5e]"}`}>
                {g}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          {/* Level filter */}
          <div className="flex items-center gap-1 flex-wrap">
            {["الكل", ...levels].map(l => (
              <button key={l} onClick={() => setFilterLevel(l)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-300 ${filterLevel === l ? "bg-[#5B8FF9] text-white shadow-sm" : "bg-white border border-gray-100/50 text-gray-500 hover:bg-gray-100 hover:text-[#2d2d5e]"}`}>
                {l}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          {/* Status filter */}
          <div className="flex items-center gap-1">
            {["الكل", "مدفوع", "غير مدفوع"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-300 ${filterStatus === s ? (s === "مدفوع" ? "bg-green-500 text-white shadow-sm" : s === "غير مدفوع" ? "bg-red-500 text-white shadow-sm" : "bg-gray-700 text-white shadow-sm") : "bg-white border border-gray-100/50 text-gray-500 hover:bg-gray-100 hover:text-[#2d2d5e]"}`}>
                {s}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          {/* Method filter */}
          <div className="flex items-center gap-1">
            {["الكل", "نقدي", "تحويل"].map(m => (
              <button key={m} onClick={() => setFilterMethod(m)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-300 ${filterMethod === m ? "bg-orange-500 text-white shadow-sm" : "bg-white border border-gray-100/50 text-gray-500 hover:bg-gray-100 hover:text-[#2d2d5e]"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 bg-white">
          <div className="flex items-center gap-3">
             <div className="w-2 h-6 bg-[#e01c8a] rounded-full"></div>
             <p className="text-[#2d2d5e] font-black text-lg">سجل المدفوعات</p>
          </div>
          <p className="text-[#e01c8a] bg-pink-50 border border-pink-100 text-xs font-black px-4 py-1.5 rounded-xl">{filtered.length} نتيجة</p>
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <p className="text-gray-400 font-bold">لا توجد نتائج مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[950px]">
              <thead className="bg-[#f8f9fc]/50 border-b border-gray-100">
                <tr>
                  {["رقم الدفعة", "الطالب", "الفوج", "المستوى", "المبلغ", "التاريخ", "طريقة الدفع", "الحالة"].map(h => (
                    <th key={h} className="px-6 py-4 text-gray-400 font-black text-xs text-right whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-pink-50/30 transition-colors group">
                    <td className="px-6 py-4" dir="ltr">
                      <span className="bg-pink-50/80 text-[#e01c8a] px-3 py-1.5 rounded-lg border border-pink-100 font-mono font-bold text-[13px] tracking-widest inline-flex">{p.id}</span>
                    </td>
                    <td className="px-6 py-4 text-[#2d2d5e] font-black border-none">{p.student}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-50 text-gray-600 border border-gray-100 text-xs font-black px-3 py-1.5 rounded-xl">{p.group}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-black text-xs">{p.level}</td>
                    <td className="px-6 py-4 text-[#2d2d5e] font-black text-base">{p.amount.toLocaleString()} <span className="text-gray-400 font-bold text-xs">دج</span></td>
                    <td className="px-6 py-4 text-gray-500 font-bold text-xs">{p.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border ${p.method === "نقدي" ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-[#5B8FF9]/10 text-[#5B8FF9] border-blue-100"}`}>
                        {p.method === "نقدي" ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
                        {p.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border transition-all duration-300 ${p.status === "مدفوع" ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50" : "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/50"}`}>
                        {p.status === "مدفوع" ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && <AddModal onAdd={p => setPayments(prev => [p, ...prev])} onClose={() => setShowAdd(false)} />}
    </div>
  );
}