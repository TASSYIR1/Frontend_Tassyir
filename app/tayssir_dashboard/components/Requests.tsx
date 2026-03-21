"use client";

import { useEffect, useState } from "react";
import { schoolService } from "@/lib/api/school.service";
import type { SchoolResponse } from "@/lib/api/types";

type RequestStatus = "pending" | "accepted" | "rejected";

const filterOptions: { id: "all" | RequestStatus; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "pending", label: "في الانتظار" },
  { id: "accepted", label: "مقبولة" },
  { id: "rejected", label: "مرفوضة" }
];

type RequestType = {
  id: string;
  name: string;
  type: string;
  rep: string;
  contact: string;
  email: string;
  date: string;
  status: RequestStatus;
  desc: string;
  level: string;
};

function mapSchoolToRequest(school: SchoolResponse): RequestType {
  return {
    id: school.id,
    name: school.name,
    type: school.type === "COURS_SUPPLEMENTAIRES" ? "Cours Sup" : "Normale",
    rep: "—",
    contact: school.contactPhone || "—",
    email: school.contactEmail || "—",
    date: school.createdAt ? String(school.createdAt).split("T")[0] : "—",
    status: school.requestStatus === "ACCEPTED"
      ? "accepted"
      : school.requestStatus === "REJECTED"
        ? "rejected"
        : "pending",
    desc: school.aboutDescription || "بدون وصف",
    level: school.schoolLevel || "—",
  };
}

export default function Requests() {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [filter, setFilter] = useState<"all" | RequestStatus>("all");
  const [selectedReq, setSelectedReq] = useState<RequestType | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadRequests() {
      try {
        const schools = await schoolService.listSchools();
        if (mounted) {
          setRequests(schools.map(mapSchoolToRequest));
        }
      } catch (error) {
        console.error("Failed to load registration requests:", error);
      }
    }
    loadRequests();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

  const updateRequestStatus = (requestId: string, status: RequestStatus) => {
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status } : req));
    setSelectedReq(prev => prev && prev.id === requestId ? { ...prev, status } : prev);
  };

  const handleAccept = async () => {
    if (!selectedReq || actionLoading) return;
    try {
      setActionLoading(true);
      await schoolService.approveSchoolRequest(selectedReq.id);
      updateRequestStatus(selectedReq.id, "accepted");
      setSelectedReq(null);
    } catch (error) {
      console.error("Failed to approve request:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReq || actionLoading) return;
    try {
      setActionLoading(true);
      await schoolService.rejectSchoolRequest(selectedReq.id);
      updateRequestStatus(selectedReq.id, "rejected");
      setSelectedReq(null);
    } catch (error) {
      console.error("Failed to reject request:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-black text-[#2d2d5e]">طلبات التسجيل</h2>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          {filterOptions.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === f.id ? "bg-[#e01c8a] text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 font-bold">اسم المدرسة</th>
                <th className="py-4 px-6 font-bold">النوع</th>
                <th className="py-4 px-6 font-bold">المسؤول</th>
                <th className="py-4 px-6 font-bold">للتواصل</th>
                <th className="py-4 px-6 font-bold">التاريخ</th>
                <th className="py-4 px-6 font-bold">الحالة</th>
                <th className="py-4 px-6 font-bold text-left">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#2d2d5e]">{req.name}</td>
                  <td className="py-4 px-6 font-semibold text-gray-600">{req.type === "Normale" ? "مدرسة عادية" : "مركز دروس دعم"}</td>
                  <td className="py-4 px-6 text-gray-600">{req.rep}</td>
                  <td className="py-4 px-6 text-gray-500" dir="ltr"><div className="text-right">{req.contact}</div></td>
                  <td className="py-4 px-6 text-gray-500">{req.date}</td>
                  <td className="py-4 px-6">
                    {req.status === "pending" && <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] rounded-full">قيد الانتظار</span>}
                    {req.status === "accepted" && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-full">مقبولة</span>}
                    {req.status === "rejected" && <span className="px-3 py-1 bg-rose-100 text-rose-700 font-bold text-[10px] rounded-full">مرفوضة</span>}
                  </td>
                  <td className="py-4 px-6 text-left">
                    <button
                      onClick={() => setSelectedReq(req)}
                      className="text-[#e01c8a] hover:bg-rose-50 px-3 py-1.5 rounded-lg font-bold transition-colors"
                    >
                      التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-[#2d2d5e]">تفاصيل طلب التسجيل</h3>
              <button onClick={() => setSelectedReq(null)} className="text-gray-400 hover:text-gray-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 mb-3">معلومات المدرسة</h4>
                  <div className="space-y-2 text-sm text-[#2d2d5e]">
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">الاسم:</span> {selectedReq.name}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">النوع:</span> {selectedReq.type}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">المستوى:</span> {selectedReq.level}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 mb-3">معلومات المسؤول</h4>
                  <div className="space-y-2 text-sm text-[#2d2d5e]">
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">الاسم الكامل:</span> {selectedReq.rep}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">رقم الهاتف:</span> <span dir="ltr">{selectedReq.contact}</span></p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">الإيميل:</span> {selectedReq.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-2">وصف تنظيمي</h4>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 leading-relaxed">
                  {selectedReq.desc}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-3xl">
              {selectedReq.status === "pending" ? (
                <>
                  <button disabled={actionLoading} onClick={handleReject} className="px-6 py-2 rounded-xl border border-rose-200 text-rose-600 font-bold hover:bg-rose-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    {actionLoading ? "جاري المعالجة..." : "رفض الطلب"}
                  </button>
                  <button disabled={actionLoading} onClick={handleAccept} className="px-6 py-2 rounded-xl bg-linear-to-l from-emerald-500 to-emerald-400 text-white font-bold hover:opacity-90 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                    {actionLoading ? "جاري المعالجة..." : "قبول وإنشاء الحساب"}
                  </button>
                </>
              ) : (
                <button onClick={() => setSelectedReq(null)} className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors">
                  إغلاق
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}