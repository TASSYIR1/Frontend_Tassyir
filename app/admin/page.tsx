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
import FinancePage from "@/components/Financepage";import AnnouncementsPage from "@/components/AnnouncementsPage";
import SubjectsPage from "@/components/SubjectsPage";import {
  ContactPage,
  FilesPage,
  SettingsPage,
  AuditPage,
} from "@/components/Otherpages";

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState<PageKey>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case "home":       return <HomePage />;
      case "students":
      case "teachers":
      case "parents":
      case "admins":     return <UsersPage activeTab={currentPage as "students" | "teachers" | "parents" | "admins"} setPage={setCurrentPage} />;
      case "classes":    return <ClassesPage />;
      case "subjects":   return <SubjectsPage />;
      case "schedule":   return <SchedulePage />;
      case "attendance": return <AttendancePage readOnly />;
      case "finance":    return <FinancePage />;
      case "announcements": return <AnnouncementsPage />;
      case "contact":    return <ContactPage />;
      case "files":      return <FilesPage />;
      case "settings":   return <SettingsPage />;
      case "audit":      return <AuditPage />;
      default:           return <HomePage />;
    }
  };

  return (
    <>
      {/* Cairo font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'); * { font-family: 'Cairo', sans-serif; }`}</style>

      <div className="flex h-screen bg-[#f4f4f8] overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          setPage={setCurrentPage}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header
            currentPage={currentPage}
            setPage={setCurrentPage}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
          />
          <main className="flex-1 overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}