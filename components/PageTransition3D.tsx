"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition3D() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const prevPath = useRef(pathname);

  useEffect(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 150);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#F5F7FB",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.15s ease",
        pointerEvents: "none",
      }}
    />
  );
}