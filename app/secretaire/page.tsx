"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { PageKey } from "@/components/types";
import HomePage from "@/components/HomePage";
import UsersPage from "@/components/UsersPage";
import ClassesPage from "@/components/Classespage";
import SchedulePage from "@/components/Schedulepage";
import AttendancePage from "@/components/Attendancepage";
import FinancePage from "@/components/Financepage";
import AnnouncementsPage from "@/components/AnnouncementsPage";
import SubjectsPage from "@/components/SubjectsPage";
import { ContactPage, FilesPage } from "@/components/Otherpages";

const SECRETARY_RESTRICTED_PAGES: PageKey[] = ["admins", "audit", "settings"];

const isSecretaryAllowedPage = (page: PageKey) => !SECRETARY_RESTRICTED_PAGES.includes(page);

export default function SecretaryDashboardPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<PageKey>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isSecretaryAllowedPage(currentPage)) {
      setCurrentPage("home");
    }
  }, [currentPage]);

  const handlePageChange = (page: PageKey) => {
    if (!isSecretaryAllowedPage(page)) {
      setCurrentPage("home");
      return;
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "students":
      case "teachers":
      case "parents":
        return (
          <UsersPage
            activeTab={currentPage as "students" | "teachers" | "parents"}
            setPage={handlePageChange}
          />
        );
      case "classes":
        return <ClassesPage />;
      case "subjects":
        return <SubjectsPage />;
      case "schedule":
        return <SchedulePage />;
      case "attendance":
        return <AttendancePage readOnly />;
      case "finance":
        return <FinancePage />;
      case "announcements":
        return <AnnouncementsPage />;
      case "contact":
        return <ContactPage />;
      case "files":
        return <FilesPage />;
      default:
        return <HomePage />;
    }
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'); * { font-family: 'Cairo', sans-serif; }`}</style>

      <div className="flex h-screen bg-[#f4f4f8] overflow-hidden">
        <Sidebar
          currentPage={currentPage}
          setPage={handlePageChange}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          restrictedPages={SECRETARY_RESTRICTED_PAGES}
          roleLabel="تسيير"
          roleBadge="SECRETARY"
        />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header
            currentPage={currentPage}
            setPage={handlePageChange}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
            restrictedPages={SECRETARY_RESTRICTED_PAGES}
            sectionLabel="لوحة السكرتارية"
            roleCaption="Secretary"
          />

          <main className="flex-1 overflow-y-auto">{renderPage()}</main>
        </div>
      </div>
    </>
  );
}
