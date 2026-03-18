
"use client";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHide(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#D2008A] ${
        hide ? 'splash-exit' : ''
      }`}
      style={{ fontFamily: 'Cairo, sans-serif' }}
    >
      <span
        className="text-white text-5xl md:text-7xl font-extrabold tracking-widest animate-intro"
        style={{ letterSpacing: '0.1em' }}
      >
        تسيير
      </span>
      <style jsx>{`
        .animate-intro {
          animation: intro-pop 1.2s cubic-bezier(.4,2,.3,1) both;
        }
        @keyframes intro-pop {
          0% { opacity: 0; transform: scale(0.7); }
          60% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .splash-exit {
          animation: splash-exit-anim 1s cubic-bezier(.7,1.7,.7,1) forwards;
        }
        @keyframes splash-exit-anim {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          60% {
            opacity: 1;
            transform: translateY(-30px) scale(1.04);
          }
          100% {
            opacity: 0;
            transform: translateY(-100vh) scale(0.98);
          }
        }
      `}</style>
    </div>
  );
}
