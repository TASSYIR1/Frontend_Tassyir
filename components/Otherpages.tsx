"use client";

import React, { useState } from "react";

// ─── ICONS ────────────────────────────────────────────────────────
const Icons = {
  Mail: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  File: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
  Trash: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Send: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  X: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  User: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Shield: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ShieldCheck: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  ShieldAlert: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

// ─── CONTACT PAGE ──────────────────────────────────────────────
const messages = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  from: i % 2 === 0 ? "ولي الأمر - بن سالم" : "أستاذ - حمداني",
  role: i % 2 === 0 ? "parent" : "prof",
  subject: i % 3 === 0 ? "استفسار عن الغياب" : i % 3 === 1 ? "طلب اجتماع" : "تقرير الدرجات",
  date: `${String(10 + i).padStart(2, "0")}/03/2026`,
  read: i % 3 !== 0,
}));

export function ContactPage() {
  const [selected, setSelected] = useState<number | null>(1);
  const [showCompose, setShowCompose] = useState(false);

  return (
    <div dir="rtl" className="p-6 flex flex-col gap-6 max-w-7xl mx-auto font-cairo">
      <div className="flex gap-6 h-[calc(100vh-180px)] min-h-[500px]">
        {/* Inbox list */}
        <div className="w-[360px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100/50 flex items-center justify-between bg-gradient-to-l from-pink-50/50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#e01c8a]/10 rounded-xl text-[#e01c8a] shadow-inner">
                {Icons.Mail}
              </div>
              <p className="text-[#2d2d5e] font-black text-lg">رسائل الأساتذة والآباء</p>
            </div>
            <button
              onClick={() => setShowCompose(true)}
              className="bg-gradient-to-r from-[#e01c8a] to-[#ff42a5] hover:from-[#c0157a] hover:to-[#e01c8a] text-white font-bold p-2.5 rounded-xl shadow-lg shadow-pink-500/30 transition-all hover:scale-105 active:scale-95"
            >
              {Icons.Plus}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelected(msg.id)}
                className={`w-full text-right px-6 py-4 border-b border-gray-50 transition-all duration-300 relative group flex flex-col gap-2 ${selected === msg.id ? "bg-gradient-to-l from-pink-50/80 to-transparent" : "hover:bg-gray-50"}`}
              >
                {selected === msg.id && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#e01c8a] rounded-l-full shadow-[0_0_8px_rgba(224,28,138,0.5)]" />}
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${msg.role === 'parent' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {msg.role === 'parent' ? 'ولي أمر' : 'أستاذ'}
                    </span>
                    <span className={`text-sm font-black transition-colors ${selected === msg.id ? "text-[#e01c8a]" : (msg.read ? "text-gray-500" : "text-[#2d2d5e]")}`}>{msg.from}</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 bg-white shadow-sm border border-gray-100 px-2 py-1 rounded-md">{msg.date}</span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className={`text-xs ${msg.read ? "text-gray-400" : "text-gray-700 font-bold"}`}>{msg.subject}</p>
                  {!msg.read && <span className="w-2.5 h-2.5 rounded-full bg-[#e01c8a] shadow-[0_0_8px_rgba(224,28,138,0.5)] animate-pulse" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message view */}
        <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col overflow-hidden relative">
          {selected ? (
            <div className="w-full h-full flex flex-col animate-in fade-in duration-300">
              {(() => {
                const msg = messages.find((m) => m.id === selected)!;
                return (
                  <>
                    <div className="px-8 py-6 border-b border-gray-100/50 bg-gradient-to-br from-gray-50/50 to-transparent">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-full flex items-center justify-center text-[#e01c8a] shadow-inner border border-white">
                          {Icons.User}
                        </div>
                        <div>
                          <p className="text-[#2d2d5e] font-black text-xl">{msg.subject}</p>
                          <p className="text-gray-500 text-sm font-bold mt-1">من: <span className="text-[#e01c8a]">{msg.from}</span> <span className="text-gray-300 mx-2">|</span> {msg.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 flex-1 overflow-y-auto">
                      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-[#2d2d5e] text-sm leading-8 font-bold shadow-sm">
                        السلام عليكم، أود الاستفسار عن الموضوع المذكور بخصوص الطالب. أرجو الرد في أقرب وقت ممكن مع تزويدي بكافة التفاصيل. شكراً جزيلاً لتعاونكم.
                      </div>
                    </div>
                    <div className="p-6 border-t border-gray-100/50 bg-gray-50/30">
                      <div className="relative group focus-within:ring-2 focus-within:ring-[#e01c8a]/20 rounded-2xl transition-all shadow-sm">
                        <textarea
                          className="w-full bg-white border border-gray-200 rounded-2xl p-4 pb-14 text-sm font-bold text-gray-700 resize-none focus:outline-none focus:border-[#e01c8a] transition-all placeholder-gray-400 block"
                          rows={3}
                          placeholder="اكتب ردك هنا..."
                        />
                        <button className="absolute bottom-3 left-3 bg-gradient-to-r from-[#e01c8a] to-[#ff42a5] hover:from-[#c0157a] hover:to-[#e01c8a] text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-pink-500/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
                          إرسال
                          {Icons.Send}
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="w-24 h-24 bg-gray-50 shadow-inner rounded-full flex items-center justify-center mb-4 text-gray-300">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <p className="font-black text-lg">اختر رسالة للعرض</p>
            </div>
          )}
        </div>
      </div>

      {showCompose && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 w-full max-w-lg mx-4 border border-white/50 animate-in fade-in zoom-in duration-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#e01c8a]/10 to-transparent rounded-full blur-3xl -z-10 animate-pulse" />
            
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-xl text-[#e01c8a]">
                  {Icons.Mail}
                </div>
                <h2 className="text-[#2d2d5e] font-black text-xl">رسالة جديدة</h2>
              </div>
              <button onClick={() => setShowCompose(false)} className="w-10 h-10 rounded-full bg-gray-50 hover:bg-rose-50 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all duration-300">
                {Icons.X}
              </button>
            </div>
            
            <div className="flex flex-col gap-5 relative z-10">
              {["المستلم", "الموضوع"].map((f) => (
                <div key={f} className="group">
                  <label className="text-gray-500 text-sm font-bold block mb-2 group-focus-within:text-[#e01c8a] transition-colors">{f}</label>
                  <input type="text" placeholder={`أدخل ${f}`} className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e01c8a]/20 focus:border-[#e01c8a] transition-all font-bold placeholder-gray-400" />
                </div>
              ))}
              <div className="group">
                <label className="text-gray-500 text-sm font-bold block mb-2 group-focus-within:text-[#e01c8a] transition-colors">الرسالة</label>
                <textarea placeholder="اكتب رسالتك هنا..." className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#e01c8a]/20 focus:border-[#e01c8a] transition-all font-bold placeholder-gray-400" rows={5} />
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowCompose(false)} className="flex-1 bg-gradient-to-r from-[#e01c8a] to-[#ff42a5] hover:from-[#c0157a] hover:to-[#e01c8a] shadow-[0_8px_20px_-8px_rgba(224,28,138,0.5)] shadow-[#e01c8a]/30 hover:shadow-[#e01c8a]/50 text-white font-black text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95">
                إرسال الرسالة
                {Icons.Send}
              </button>
              <button onClick={() => setShowCompose(false)} className="flex-1 bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-500 font-bold text-sm py-4 rounded-xl transition-all active:scale-95">
                إلغاء الأمر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FILES PAGE ──────────────────────────────────────────────
const files = [
  { name: "كشف النقاط - الفصل الأول", type: "PDF", size: "2.3 MB", date: "10/03/2026" },
  { name: "جدول الحصص الأسبوعي", type: "XLSX", size: "1.1 MB", date: "08/03/2026" },
  { name: "قائمة الطلاب 2026", type: "DOCX", size: "450 KB", date: "05/03/2026" },
  { name: "تقرير الحضور - مارس", type: "PDF", size: "3.8 MB", date: "01/03/2026" },
  { name: "عقود الاساتذة", type: "PDF", size: "1.5 MB", date: "15/02/2026" },
  { name: "ميزانية الفصل الثاني", type: "XLSX", size: "890 KB", date: "12/02/2026" },
];

const typeColors: Record<string, { bg: string, text: string, icon: React.ReactNode }> = {
  PDF: { bg: "bg-rose-50 border-rose-100", text: "text-rose-600", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
  XLSX: { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-600", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg> },
  DOCX: { bg: "bg-blue-50 border-blue-100", text: "text-blue-600", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg> },
};

export function FilesPage() {
  return (
    <div dir="rtl" className="p-6 flex flex-col gap-6 max-w-7xl mx-auto font-cairo">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-white/60 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100/50 flex items-center justify-between bg-gradient-to-l from-gray-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#e01c8a]/10 rounded-xl text-[#e01c8a] shadow-inner">
              {Icons.File}
            </div>
            <p className="text-[#2d2d5e] font-black text-xl">إدارة الملفات</p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#e01c8a] to-[#ff42a5] hover:from-[#c0157a] hover:to-[#e01c8a] transition-all hover:scale-105 active:scale-95 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-pink-500/20">
            {Icons.Plus}
            <span>رفع ملف جديد</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8 bg-gray-50/30">
          {files.map((file, i) => {
            const config = typeColors[file.type] || { bg: "bg-gray-50 border-gray-100", text: "text-gray-600", icon: Icons.File };
            
            return (
              <div key={i} className="group bg-white border border-gray-100 hover:border-pink-200 rounded-2xl p-5 hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-300 flex flex-col gap-4 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-50/50 to-transparent rounded-full blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-lg border ${config.bg} ${config.text}`}>
                    {config.icon}
                    {file.type}
                  </span>
                  <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-colors shadow-sm">
                    {Icons.Trash}
                  </button>
                </div>
                
                <div className="mt-2">
                  <p className="text-[#2d2d5e] font-black text-base leading-tight group-hover:text-[#e01c8a] transition-colors">{file.name}</p>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">الحجم</span>
                    <span className="text-[#2d2d5e] font-black text-sm">{file.size}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">تاريخ الرفع</span>
                    <span className="text-gray-500 font-bold text-xs bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{file.date}</span>
                  </div>
                </div>
                
                <button className="w-full mt-2 flex items-center justify-center gap-2 border-2 border-pink-50 text-[#e01c8a] hover:bg-[#e01c8a] hover:text-white hover:border-[#e01c8a] font-bold text-sm py-2.5 rounded-xl transition-all duration-300">
                  {Icons.Download}
                  تحميل الملف
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ──────────────────────────────────────────────
export function SettingsPage() {
  const [schoolName, setSchoolName] = useState("مدرسة النجاح");
  const [phone, setPhone] = useState("06 66 66 66 66");
  const [email, setEmail] = useState("tasyir@gmail.com");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div dir="rtl" className="p-6 flex flex-col gap-6 max-w-5xl mx-auto font-cairo">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-white/60 p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-50/50 to-transparent rounded-full blur-3xl -z-10 group-hover:bg-pink-100/50 transition-colors duration-500" />
          
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100/50">
            <div className="p-3 bg-pink-50 rounded-xl text-[#e01c8a] shadow-inner border border-white">
              {Icons.Settings}
            </div>
            <p className="text-[#2d2d5e] font-black text-xl">إعدادات المؤسسة</p>
          </div>
          
          <div className="flex flex-col gap-6">
            {[
              { label: "اسم المؤسسة", value: schoolName, set: setSchoolName, type: "text" },
              { label: "رقم الهاتف", value: phone, set: setPhone, type: "tel" },
              { label: "البريد الالكتروني", value: email, set: setEmail, type: "email" },
            ].map(({ label, value, set, type }) => (
              <div key={label} className="group/input focus-within:scale-[1.01] transition-transform">
                <label className="text-gray-500 text-sm font-bold block mb-2 group-focus-within/input:text-[#e01c8a] transition-colors">{label}</label>
                <div className="relative">
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#2d2d5e] font-bold focus:outline-none focus:ring-2 focus:ring-[#e01c8a]/20 focus:border-[#e01c8a] transition-all shadow-sm block"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-white/60 p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-50/50 to-transparent rounded-full blur-3xl -z-10 group-hover:bg-purple-100/50 transition-colors duration-500" />
          
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100/50">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600 shadow-inner border border-white">
              {Icons.Shield}
            </div>
            <p className="text-[#2d2d5e] font-black text-xl">الأمان والخصوصية</p>
          </div>
          
          <div className="flex flex-col gap-6">
            {["كلمة المرور الحالية", "كلمة المرور الجديدة", "تأكيد كلمة المرور"].map((label) => (
              <div key={label} className="group/input focus-within:scale-[1.01] transition-transform">
                <label className="text-gray-500 text-sm font-bold block mb-2 group-focus-within/input:text-purple-600 transition-colors">{label}</label>
                <input 
                  type="password" 
                  placeholder="••••••••••"
                  className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#2d2d5e] font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm block" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-10 py-4 rounded-xl font-black text-base text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
            saved 
              ? "bg-emerald-500 shadow-emerald-500/30" 
              : "bg-gradient-to-r from-[#e01c8a] to-[#ff42a5] hover:from-[#c0157a] hover:to-[#e01c8a] shadow-pink-500/30"
          }`}
        >
          {saved ? (
            <>
              {Icons.Check}
              تم حفظ التغييرات بنجاح
            </>
          ) : (
            "حفظ جميع التغييرات"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── AUDIT PAGE ──────────────────────────────────────────────
const auditLogs = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  user: i % 3 === 0 ? "المدير" : i % 3 === 1 ? "الاستاذ بن علي" : "الاداري سالم",
  action: i % 4 === 0 ? "إضافة طالب" : i % 4 === 1 ? "تعديل جدول" : i % 4 === 2 ? "حذف ملف" : "تسجيل دخول",
  date: `15/03/2026`,
  time: `${String(8 + (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
  status: i % 7 === 6 ? "مرفوض" : "ناجح",
}));

export function AuditPage() {
  return (
    <div dir="rtl" className="p-6 flex flex-col gap-6 max-w-7xl mx-auto font-cairo">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-white/60 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100/50 flex items-center justify-between bg-gradient-to-l from-gray-50/50 to-transparent">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-50 rounded-xl text-rose-500 shadow-inner border border-white">
              {Icons.ShieldAlert}
            </div>
            <div>
              <p className="text-[#2d2d5e] font-black text-xl">سجل النشاطات (Audit Log)</p>
              <p className="text-gray-400 text-sm font-bold mt-1">مراقبة كافة نشاطات المستخدمين في النظام</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-black text-gray-600">تسجيل نشط المستمر</span>
          </div>
        </div>
        
        <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <table className="w-full text-sm min-w-[900px] border-collapse">
            <thead className="bg-[#f8f9fc]/50 border-b border-gray-100">
              <tr>
                {["#", "المستخدم", "الإجراء المتخذ", "التاريخ", "الوقت", "حالة العملية"].map((h) => (
                  <th key={h} className="px-6 py-5 text-gray-400 font-black text-xs text-right whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-pink-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-gray-400 font-mono font-black bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 text-xs shadow-sm">
                      {String(log.id).padStart(3, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-50 to-purple-50 flex items-center justify-center text-[#e01c8a] border border-white shadow-sm">
                        {Icons.User}
                      </div>
                      <span className="text-[#2d2d5e] font-black">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 font-bold bg-white px-3 py-1.5 rounded-xl border border-gray-100 text-xs shadow-sm">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 font-black text-xs">{log.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 font-mono font-bold text-xs bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                      {log.time}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl border transition-all duration-300 shadow-sm ${
                      log.status === "ناجح" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100/50 group-hover:bg-emerald-100/50" 
                        : "bg-rose-50 text-rose-600 border-rose-100/50 group-hover:bg-rose-100/50"
                    }`}>
                      {log.status === "ناجح" ? Icons.ShieldCheck : Icons.ShieldAlert}
                      {log.status === "ناجح" ? "عملية ناجحة" : "محاولة مرفوضة"}
                    </span>
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