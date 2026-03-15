"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { PageKey } from "@/components/types";
import HomePage from "@/components/HomePage";
import UsersPage from "@/components/UsersPage";
import ClassesPage from "@/components/Classespage";
import SchedulePage from "@/components/Schedulepage";
import AttendancePage from "@/components/Attendancepage";
import FinancePage from "@/components/Financepage";
import {
  ContactPage,
  FilesPage,
  SettingsPage,
  AuditPage,
} from "@/components/Otherpages";

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState<PageKey>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "students":
      case "teachers":
      case "admins":
        return (
          <UsersPage
            activeTab={currentPage}
            setPage={setCurrentPage}
          />
        );
      case "classes":
        return <ClassesPage />;
      case "schedule":
        return <SchedulePage />;
      case "attendance":
        return <AttendancePage />;
      case "finance":
        return <FinancePage />;
      case "contact":
        return <ContactPage />;
      case "files":
        return <FilesPage />;
      case "settings":
        return <SettingsPage />;
      case "audit":
        return <AuditPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f4f8] overflow-hidden">
      {/* Sidebar — fixed on the right */}
      <Sidebar currentPage={currentPage} setPage={setCurrentPage} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentPage={currentPage} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}