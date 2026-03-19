"use client";

import { ReactNode } from "react";

type DashboardNavButtonProps = {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
};

export default function DashboardNavButton({
  label,
  icon,
  active,
  onClick,
}: DashboardNavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-black w-full text-right transition-all duration-300 ${
        active
          ? "bg-white/20 text-white shadow-md border border-white/20 backdrop-blur-sm scale-[1.02]"
          : "text-white/80 hover:bg-white/10 hover:text-white border border-transparent hover:translate-x-1"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`transition-all duration-300 ${
            active ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "group-hover:scale-110"
          }`}
        >
          {icon}
        </span>
        {label}
      </div>
      {active && <span className="w-1.5 h-6 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" />}
    </button>
  );
}
