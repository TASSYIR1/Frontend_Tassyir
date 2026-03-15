"use client";

import { useEffect, useState } from "react";
import { PageKey } from "./types";

interface UsersPageProps {
  activeTab: "students" | "teachers" | "admins";
  setPage: (p: PageKey) => void;
}

const students = Array.from({ length: 14 }, (_, i) => ({
  id: "STD234",
  name: "بن سالم اجم",
  level: "ثانية ثانوي",
  dob: "23/01/2010",
  status: "مدفوع",
  parent: "07 77 77 77 77",
}));

const teachers = Array.from({ length: 13 }, (_, i) => ({
  id: "STD234",
  name: "بن سالم ادم",
  subject: "رياضيات - فيزياء",
  dob: "23/01/2010",
  status: "مدفوع",
  phone: "07 77 77 77 77",
}));

const admins = Array.from({ length: 12 }, (_, i) => ({
  id: "ADM10" + i,
  name: "بن سالم ادم",
  role: "إداري",
  dob: "23/01/2010",
  status: "مدفوع",
  phone: "07 77 77 77 77",
}));

const tabs: { label: string; key: "students" | "teachers" | "admins" }[] = [
  { label: "الطلاب", key: "students" },
  { label: "الاساتذة", key: "teachers" },
  { label: "الاداريون", key: "admins" },
];

export default function UsersPage({ activeTab, setPage }: UsersPageProps) {
  const [showModal, setShowModal] = useState(false);

  const addLabel =
    activeTab === "students"
      ? "طالب جديد"
      : activeTab === "teachers"
      ? "استاذ جديد"
      : "اداري جديد";

  const listTitle =
    activeTab === "students"
      ? "قائمة الطلاب داخل المؤسسة"
      : activeTab === "teachers"
      ? "قائمة الاساتذة داخل المؤسسة"
      : "قائمة الاداريين داخل المؤسسة";

  return (
    <div dir="rtl" className="p-6 flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPage(tab.key)}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-[#e01c8a]/20 text-[#e01c8a] border border-[#e01c8a]/30"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Card header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-[#2d2d5e] font-bold text-sm">{listTitle}</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#e01c8a] hover:bg-[#c0157a] transition-colors text-white font-bold text-sm px-4 py-2 rounded-xl shadow"
          >
            <span className="text-lg font-light">+</span>
            <span>{addLabel}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "students" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["المعرف", "الاسم واللقب", "المستوى الدراسي", "تاريخ الميلاد", "حالة الدفع", "ولي الامر", "الاجراءات"].map((h) => (
                    <th key={h} className="px-4 py-3 text-gray-500 font-semibold text-right whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-[#2d2d5e] font-medium">{s.id}</td>
                    <td className="px-4 py-3 text-gray-700">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.level}</td>
                    <td className="px-4 py-3 text-gray-600">{s.dob}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-md">{s.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.parent}</td>
                    <td className="px-4 py-3">
                      <ActionButtons />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "teachers" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["المعرف", "الاسم واللقب", "المواد", "تاريخ الميلاد", "حالة الدفع", "رقم الهاتف", "الاجراءات"].map((h) => (
                    <th key={h} className="px-4 py-3 text-gray-500 font-semibold text-right whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teachers.map((t, i) => (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-[#2d2d5e] font-medium">{t.id}</td>
                    <td className="px-4 py-3 text-gray-700">{t.name}</td>
                    <td className="px-4 py-3 text-gray-600">{t.subject}</td>
                    <td className="px-4 py-3 text-gray-600">{t.dob}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-md">{t.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{t.phone}</td>
                    <td className="px-4 py-3">
                      <ActionButtons />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "admins" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["المعرف", "الاسم واللقب", "الدور", "تاريخ الميلاد", "حالة الدفع", "رقم الهاتف", "الاجراءات"].map((h) => (
                    <th key={h} className="px-4 py-3 text-gray-500 font-semibold text-right whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admins.map((a, i) => (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-[#2d2d5e] font-medium">{a.id}</td>
                    <td className="px-4 py-3 text-gray-700">{a.name}</td>
                    <td className="px-4 py-3 text-gray-600">{a.role}</td>
                    <td className="px-4 py-3 text-gray-600">{a.dob}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-md">{a.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{a.phone}</td>
                    <td className="px-4 py-3">
                      <ActionButtons />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add modal */}
      {showModal && (
        <AddModal
          title={addLabel}
          activeTab={activeTab}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex items-center gap-2">
      <button className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
        🗑️
      </button>
      <button className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-500 transition-colors">
        ✏️
      </button>
      <button className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
        👁️
      </button>
    </div>
  );
}

function AddModal({
  title,
  activeTab,
  onClose,
}: {
  title: string;
  activeTab: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#2d2d5e] font-black text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
        </div>
        <div className="flex flex-col gap-3">
          {["الاسم واللقب", "تاريخ الميلاد", "رقم الهاتف", "المستوى"].map((field) => (
            <div key={field}>
              <label className="text-gray-500 text-xs font-medium block mb-1">{field}</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#e01c8a] transition-colors"
                placeholder={`أدخل ${field}`}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-[#e01c8a] hover:bg-[#c0157a] transition-colors text-white font-bold text-sm py-2.5 rounded-xl"
          >
            حفظ
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 font-bold text-sm py-2.5 rounded-xl"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}