import type { Metadata } from "next";
import "./globals.css";
import BackgroundShapes from "@/components/BackgroundShapes";
import PageTransition3D from "@/components/PageTransition3D";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: "تسيير — أفضل طريقة لإدارة مدرستك",
  description: "إدارة و تسيير كل أركان مدرستك من منصة واحدة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ position: "relative" }}>
        <SplashScreen />
        <BackgroundShapes />
        <div style={{ position: "relative", zIndex: 10 }}>
          {children}
        </div>
        <PageTransition3D />
      </body>
    </html>
  );
}
