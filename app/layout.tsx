import type { Metadata } from "next";
import "./globals.css";
import BackgroundShapes from "@/components/BackgroundShapes";

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
        <BackgroundShapes />
        <div style={{ position: "relative", zIndex: 10 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
