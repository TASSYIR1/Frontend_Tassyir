"use client";

import { useState } from "react";
import TayssirSidebar, { TayssirPageKey } from "./components/TayssirSidebar";
import TayssirHeader from "./components/TayssirHeader";
import Overview from "./components/Overview";
import Requests from "./components/Requests";
import Schools from "./components/Schools";
import Statistics from "./components/Statistics";
import Logs from "./components/Logs";
import Settings from "./components/Settings";

export default function TayssirDashboardPage() {
  const [currentPage, setCurrentPage] = useState<TayssirPageKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case "overview": return <Overview />;
      case "requests": return <Requests />;
      case "schools":  return <Schools />;
      case "stats":    return <Statistics />;
      case "logs":     return <Logs />;
      case "settings": return <Settings />;
      default:         return <Overview />;
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'); * { font-family: 'Cairo', sans-serif; }`}</style>
      
      <div className="flex h-screen bg-[#F5F7FB] overflow-hidden">
        {/* Sidebar */}
        <TayssirSidebar
          currentPage={currentPage}
          setPage={setCurrentPage}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10 p-0">
          <TayssirHeader
            currentPage={currentPage}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
          />
          <main className="flex-1 overflow-y-auto w-full">
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}
